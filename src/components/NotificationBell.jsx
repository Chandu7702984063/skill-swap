import React, { useEffect, useState, useContext } from "react";
import {
  collection,
  query,
  where,
  onSnapshot,
  updateDoc,
  doc,
} from "firebase/firestore";
import { db } from "../services/firebase";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-hot-toast";
import { FaBell } from "react-icons/fa";

const NotificationBell = () => {
  const [unreadCount, setUnreadCount] = useState(0);
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    if (!currentUser) return;

    const q = query(
      collection(db, "notifications"),
      where("userId", "==", currentUser.uid),
      where("read", "==", false)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setUnreadCount(snapshot.size);
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          const data = change.doc.data();
          toast.success(data.message);
        }
      });
    });

    return () => unsubscribe();
  }, [currentUser]);

  const markAllAsRead = async () => {
    const q = query(
      collection(db, "notifications"),
      where("userId", "==", currentUser.uid),
      where("read", "==", false)
    );
    const snapshot = await getDocs(q);
    snapshot.forEach(async (docSnap) => {
      await updateDoc(doc(db, "notifications", docSnap.id), { read: true });
    });
    setUnreadCount(0);
  };

  return (
    <div className="relative cursor-pointer" onClick={markAllAsRead}>
      <FaBell size={24} />
      {unreadCount > 0 && (
        <span className="absolute top-0 right-0 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
          {unreadCount}
        </span>
      )}
    </div>
  );
};

export default NotificationBell;

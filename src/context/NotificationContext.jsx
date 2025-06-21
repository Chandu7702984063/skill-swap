// src/context/NotificationContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../services/firebase";
import {
  onSnapshot,
  query,
  where,
  collection,
  doc,
  updateDoc,
  orderBy,
} from "firebase/firestore";
import toast from "react-hot-toast";
import { useAuthState } from "react-firebase-hooks/auth";

const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [user] = useAuthState(auth);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "notifications"),
      where("userId", "==", user.uid),
      orderBy("timestamp", "desc") // optional, if you store timestamps
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const all = [];
      let unread = 0;

      snapshot.forEach((doc) => {
        const data = doc.data();
        all.push({ id: doc.id, ...data });
        if (!data.read) unread++;
      });

      setUnreadCount(unread);
      setNotifications(all);

      // Optional: show toast only for newly added
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          const data = change.doc.data();
          toast.success(data.message);
        }
      });
    });

    return () => unsubscribe();
  }, [user]);

  const markAsRead = async (notificationId) => {
    const ref = doc(db, "notifications", notificationId);
    await updateDoc(ref, { read: true });
  };

  const markAllAsRead = async () => {
    const unread = notifications.filter((n) => !n.read);
    await Promise.all(
      unread.map((n) =>
        updateDoc(doc(db, "notifications", n.id), { read: true })
      )
    );
  };

  return (
    <NotificationContext.Provider
      value={{
        unreadCount,
        notifications,
        markAsRead,
        markAllAsRead,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

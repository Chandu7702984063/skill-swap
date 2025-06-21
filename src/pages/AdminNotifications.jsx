import React, { useEffect, useState } from "react";
import { collection, getDocs, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "../services/firebase";

const AdminNotifications = () => {
  const [notifications, setNotifications] = useState([]);

  // Fetch all notifications from Firestore
  const fetchNotifications = async () => {
    const querySnapshot = await getDocs(collection(db, "notifications"));
    const all = querySnapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    }));
    setNotifications(all);
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  // Mark notification as read
  const markAsRead = async (id) => {
    await updateDoc(doc(db, "notifications", id), {
      read: true,
    });
    fetchNotifications(); // Refresh after update
  };

  // Delete notification
  const deleteNotification = async (id) => {
    await deleteDoc(doc(db, "notifications", id));
    fetchNotifications(); // Refresh after delete
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">📢 Admin Notification Dashboard</h2>
      <table className="min-w-full bg-white border border-gray-300">
        <thead className="bg-purple-100">
          <tr>
            <th className="text-left p-2 border">Message</th>
            <th className="text-left p-2 border">User ID</th>
            <th className="text-left p-2 border">Status</th>
            <th className="text-left p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {notifications.map((n) => (
            <tr key={n.id} className="border-t hover:bg-gray-50">
              <td className="p-2">{n.message}</td>
              <td className="p-2">{n.userId}</td>
              <td className="p-2">
                {n.read ? (
                  <span className="text-green-600 font-medium">Read</span>
                ) : (
                  <span className="text-red-600 font-medium">Unread</span>
                )}
              </td>
              <td className="p-2 flex gap-2">
                {!n.read && (
                  <button
                    onClick={() => markAsRead(n.id)}
                    className="bg-yellow-400 text-white px-2 py-1 rounded"
                  >
                    Mark as Read
                  </button>
                )}
                <button
                  onClick={() => deleteNotification(n.id)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {notifications.length === 0 && (
            <tr>
              <td colSpan="4" className="p-4 text-center text-gray-500">
                No notifications yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AdminNotifications;

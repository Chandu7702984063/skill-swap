import React, { useState } from "react";
import { FaBell } from "react-icons/fa";
import { useNotification } from "../context/NotificationContext";

const NotificationDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { notifications, markAsRead, unreadCount } = useNotification();

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleMarkAsRead = (id) => {
    markAsRead(id);
    setIsOpen(false); // close after action (optional)
  };

  return (
    <div className="relative inline-block text-left">
      {/* Bell Icon */}
      <button
        onClick={toggleDropdown}
        className="relative p-2 text-gray-600 hover:text-purple-600 focus:outline-none"
      >
        <FaBell className="text-xl" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 bg-red-600 text-white text-xs px-1.5 py-0.5 rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white shadow-lg rounded-lg border border-gray-200 z-50 max-h-96 overflow-y-auto">
          <div className="px-4 py-3 border-b font-semibold text-gray-800">
            Notifications
          </div>
          <ul className="divide-y divide-gray-100">
            {notifications.length === 0 ? (
              <li className="px-4 py-3 text-sm text-gray-500">
                No notifications
              </li>
            ) : (
              notifications.map((n) => (
                <li
                  key={n.id}
                  className={`px-4 py-3 text-sm ${
                    !n.read ? "bg-gray-100" : "bg-white"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <p className="text-gray-700">{n.message}</p>
                    {!n.read && (
                      <button
                        onClick={() => handleMarkAsRead(n.id)}
                        className="text-xs text-blue-600 hover:underline"
                      >
                        Mark as read
                      </button>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(
                      n.timestamp?.toDate?.() || n.timestamp
                    ).toLocaleString()}
                  </p>
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;

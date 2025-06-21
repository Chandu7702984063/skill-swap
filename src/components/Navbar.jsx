import React, { useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../services/firebase";
import { FaSignOutAlt, FaUserCircle, FaBars, FaTimes } from "react-icons/fa";
import logo from "../assets/logo.png";
import { useNotification } from "../context/NotificationContext";
import NotificationDropdown from "./NotificationDropdown"; // ✅ Import dropdown

const Navbar = ({ userName }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { unreadCount } = useNotification();

  const handleLogout = async () => {
    await signOut(auth);
    window.location.href = "/login";
  };

  return (
    <nav className="w-full bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <img
            src={logo}
            alt="SkillSwap"
            className="h-9 w-9 rounded-full shadow-md"
          />
          <span className="text-xl font-semibold text-purple-700">
            SkillSwap
          </span>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          {/* 🔔 Notification Dropdown */}
          <NotificationDropdown />

          <div className="flex items-center gap-3 text-gray-700 font-medium">
            <FaUserCircle className="text-purple-600 text-xl" />
            <span>Hello, {userName}</span>
          </div>

          <button
            onClick={handleLogout}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-sm"
          >
            <FaSignOutAlt /> Logout
          </button>
        </div>

        {/* Mobile Menu Toggle Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden text-purple-600 text-2xl"
        >
          {isMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {isMenuOpen && (
        <div className="md:hidden px-4 pb-4 bg-white border-t space-y-3">
          {/* Notification Dropdown */}
          <div className="flex justify-start">
            <NotificationDropdown />
          </div>

          <div className="flex items-center gap-2 text-gray-700 font-medium">
            <FaUserCircle className="text-purple-600 text-lg" />
            <span>Hello, {userName}</span>
          </div>

          <button
            onClick={handleLogout}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm flex justify-center items-center gap-2"
          >
            <FaSignOutAlt /> Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

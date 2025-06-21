import React, { useState } from "react";
import {
  FaBars,
  FaTimes,
  FaUser,
  FaChalkboardTeacher,
  FaExchangeAlt,
  FaComments,
  FaWallet,
  FaStar,
  FaGift,
  FaCog,
  FaSignOutAlt,
  FaQuestionCircle,
} from "react-icons/fa";

const Sidebar = ({ userName = "Chandu", rating = 4.6 }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Toggle Button for Mobile */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 bg-white border p-2 rounded shadow"
        onClick={toggleSidebar}
      >
        {isOpen ? (
          <FaTimes className="text-xl" />
        ) : (
          <FaBars className="text-xl" />
        )}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed md:static top-0 left-0 h-full w-64 bg-white shadow-md p-4 z-40 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Profile Header */}
        <div className="flex flex-col items-start mb-6">
          <div className="flex items-center gap-3">
            <FaUser className="text-purple-600 text-3xl" />
            <div className="hidden sm:block">
              <p className="text-gray-800 font-semibold text-lg">{userName}</p>
              <p className="text-gray-500 text-sm">+91 7702984063</p>
            </div>
          </div>
          <div className="mt-2 flex items-center gap-1 text-yellow-500 text-sm cursor-pointer">
            <FaStar />{" "}
            <span className="hidden sm:block">{rating} My Rating</span>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="flex flex-col gap-4 text-gray-700 text-sm font-medium">
          <MenuItem icon={<FaQuestionCircle />} label="Help" />
          <a href="/skill-exchange">
            <MenuItem icon={<FaExchangeAlt />} label="Skill Exchange" />
          </a>

          <MenuItem icon={<FaWallet />} label="Wallet" />
          <MenuItem icon={<FaComments />} label="Messages" />
          <a href="/my-swaps">
            <MenuItem icon={<FaChalkboardTeacher />} label="My Swaps" />
          </a>

          <MenuItem icon={<FaGift />} label="Refer & Earn" extra="Get ₹50" />
          <MenuItem icon={<FaStar />} label="Achievements" />
          <MenuItem icon={<FaCog />} label="Settings" />
          <MenuItem icon={<FaSignOutAlt />} label="Logout" isLogout />
        </nav>
      </aside>
    </>
  );
};

const MenuItem = ({ icon, label, extra = "", isLogout = false }) => (
  <div
    className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer hover:bg-purple-50 transition ${
      isLogout ? "text-red-600 hover:bg-red-50" : ""
    }`}
  >
    <div className="flex items-center gap-3">
      <span className="text-lg">{icon}</span>
      <span>{label}</span>
    </div>
    {extra && <span className="text-xs text-gray-500">{extra}</span>}
  </div>
);

export default Sidebar;

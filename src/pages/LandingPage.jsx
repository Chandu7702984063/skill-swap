import React from "react";
import { useNavigate } from "react-router-dom";
import { FaGlobe, FaQuestionCircle } from "react-icons/fa";
import logo from "../assets/logo.png"; // your logo
import sampleImage from "../assets/skill-swap.png"; // your landing image

const LandingPage = () => {
  const navigate = useNavigate();

  const handleRoute = (path) => {
    navigate(path);
  };

  return (
    <>
      {/* NAVBAR */}
      <header className="w-full bg-white shadow-md py-4 px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <img src={logo} alt="SkillSwap" className="w-8 h-8" />
          <h1 className="text-xl font-bold text-purple-700">SkillSwap</h1>
        </div>

        {/* Nav Buttons */}
        <nav className="flex items-center gap-4 text-sm">
          {/* Help */}
          <button
            onClick={() => handleRoute("/help")}
            className="flex items-center gap-1 text-gray-700 hover:text-purple-600 transition"
          >
            <FaQuestionCircle /> Help
          </button>

          {/* Language Dropdown */}
          <div className="relative group">
            <button className="flex items-center gap-1 text-gray-700 hover:text-purple-600 transition">
              <FaGlobe /> Language
            </button>
            <ul className="absolute hidden group-hover:block bg-white border rounded shadow-md mt-2 w-28 z-10">
              <li className="px-4 py-2 hover:bg-purple-50 cursor-pointer">English</li>
              <li className="px-4 py-2 hover:bg-purple-50 cursor-pointer">हिंदी</li>
              <li className="px-4 py-2 hover:bg-purple-50 cursor-pointer">తెలుగు</li>
            </ul>
          </div>

          {/* Auth Buttons */}
          <button
            onClick={() => handleRoute("/login")}
            className="text-purple-700 border border-purple-600 px-3 py-1 rounded hover:bg-purple-50 transition"
          >
            Login
          </button>
          <button
            onClick={() => handleRoute("/register")}
            className="bg-purple-600 text-white px-4 py-1 rounded hover:bg-purple-700 transition"
          >
            Sign Up
          </button>
        </nav>
      </header>

      {/* Landing Content */}
      <main className="flex flex-col sm:flex-row items-center justify-center min-h-[80vh] px-6 bg-gradient-to-br from-blue-100 via-purple-100 to-cyan-100">
        <img
          src={sampleImage}
          alt="Skill swapping"
          className="max-w-md w-full mb-8 sm:mb-0 sm:mr-12 rounded-2xl shadow-xl"
        />
        <div className="max-w-lg text-center sm:text-left">
          <h2 className="text-4xl font-bold text-purple-700 mb-4">
            Swap Skills. Grow Together.
          </h2>
          <p className="text-gray-700 text-lg">
            SkillSwap is your community to learn and teach skills you love — whether it's
            coding, design, languages, or public speaking. Collaborate, connect, and level up!
          </p>
        </div>
      </main>
    </>
  );
};

export default LandingPage;

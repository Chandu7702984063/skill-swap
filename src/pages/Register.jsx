import React, { useState } from "react";
import { auth, db } from "../services/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { FaUser, FaEnvelope, FaLock, FaCode, FaPhoneAlt } from "react-icons/fa";

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    phone: "",
    skills: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        skills: formData.skills,
        createdAt: serverTimestamp(),
      });

      alert("🎉 User registered successfully!");
      window.location.href = "/login";
    } catch (error) {
      alert("❌ Error: " + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-200 via-blue-100 to-cyan-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 sm:p-10">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-purple-700 mb-2">
            Join SkillSwap
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            Learn, share and grow with the community.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Full Name */}
          <Input
            icon={<FaUser />}
            name="fullName"
            placeholder="Full Name"
            handleChange={handleChange}
            required
          />

          {/* Email */}
          <Input
            icon={<FaEnvelope />}
            name="email"
            type="email"
            placeholder="Email Address"
            handleChange={handleChange}
            required
          />

          {/* Phone */}
          <Input
            icon={<FaPhoneAlt />}
            name="phone"
            placeholder="Phone Number"
            handleChange={handleChange}
            required
          />

          {/* Password */}
          <Input
            icon={<FaLock />}
            name="password"
            type="password"
            placeholder="Password"
            handleChange={handleChange}
            required
          />

          {/* Skills */}
          <Input
            icon={<FaCode />}
            name="skills"
            placeholder="Skills (e.g., React, Firebase)"
            handleChange={handleChange}
          />

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-500 text-white font-bold text-lg rounded-xl shadow-md hover:from-purple-700 hover:to-blue-600 transition-all"
          >
            Register
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-sm text-gray-600 mt-6">
          Already have an account?{" "}
          <a
            href="/login"
            className="text-purple-700 hover:underline font-medium"
          >
            Login here
          </a>
        </p>
      </div>
    </div>
  );
};

// 🔧 Reusable Input Component
const Input = ({
  icon,
  name,
  placeholder,
  type = "text",
  handleChange,
  required = false,
}) => (
  <div className="flex items-center gap-3 bg-gray-100 px-4 py-3 rounded-xl focus-within:ring-2 ring-purple-300 transition">
    <span className="text-purple-500 text-lg">{icon}</span>
    <input
      name={name}
      type={type}
      placeholder={placeholder}
      onChange={handleChange}
      required={required}
      className="bg-transparent w-full outline-none text-gray-700 placeholder-gray-500"
    />
  </div>
);

export default Register;

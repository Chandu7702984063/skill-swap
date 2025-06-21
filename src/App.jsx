import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import LandingPage from "./pages/LandingPage";
import SkillExchange from "./pages/SkillExchange";
import AdminNotifications from "./pages/AdminNotifications"; // ✅ Add this import
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./services/firebase";
import { Toaster } from "react-hot-toast";
import { NotificationProvider } from "./context/NotificationContext";
import MySwaps from "./pages/MySwaps";

// ✅ Protected Route Wrapper
const ProtectedRoute = ({ element }) => {
  const [user, loading] = useAuthState(auth);
  if (loading) return <p>Loading...</p>;
  return user ? element : (window.location.href = "/login");
};

function App() {
  return (
    <Router>
      <NotificationProvider>
        <Toaster position="top-right" reverseOrder={false} />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/dashboard"
            element={<ProtectedRoute element={<Dashboard />} />}
          />
          <Route
            path="/my-swaps"
            element={<ProtectedRoute element={<MySwaps />} />}
          />
          <Route
            path="/skill-exchange"
            element={<ProtectedRoute element={<SkillExchange />} />}
          />
          <Route
            path="/admin-notifications"
            element={<ProtectedRoute element={<AdminNotifications />} />}
          />
        </Routes>
      </NotificationProvider>
    </Router>
  );
}

export default App;

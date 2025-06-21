import React, { useEffect, useState } from "react";
import { auth, db } from "../services/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar"; // assuming you created Sidebar component

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const docRef = doc(db, "users", firebaseUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUser(docSnap.data());
        }
      } else {
        window.location.href = "/login";
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <div
        className={`fixed z-30 inset-y-0 left-0 transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:static md:inset-0 transition duration-300 ease-in-out`}
      >
        <Sidebar userName={user?.fullName} rating={4.6} />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        {/* Top Nav */}
        <div className="md:hidden p-4">
          <button
            className="text-2xl text-purple-700"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            ☰
          </button>
        </div>

        <Navbar userName={user?.fullName || "User"} />

        <main className="p-6">
          <h2 className="text-2xl font-semibold text-purple-700">Dashboard</h2>
          <p className="mt-4 text-gray-700">Email: {user?.email}</p>
          <p className="text-gray-700">Skills: {user?.skills}</p>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;

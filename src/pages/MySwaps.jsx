import React, { useEffect, useState } from "react";
import { auth, db } from "../services/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";

const MySwaps = () => {
  const [user] = useAuthState(auth);
  const [swaps, setSwaps] = useState([]);

  useEffect(() => {
    const fetchSwaps = async () => {
      if (!user) return;

      const [requestedSnapshot, receivedSnapshot] = await Promise.all([
        getDocs(
          query(collection(db, "swaps"), where("requesterId", "==", user.uid))
        ),
        getDocs(
          query(
            collection(db, "swaps"),
            where("offeredSkill.userId", "==", user.uid)
          )
        ),
      ]);

      const allDocs = [...requestedSnapshot.docs, ...receivedSnapshot.docs];
      const uniqueSwapsMap = new Map();

      // Remove duplicates (if any)
      for (let docSnap of allDocs) {
        uniqueSwapsMap.set(docSnap.id, docSnap);
      }

      const swapDetails = await Promise.all(
        Array.from(uniqueSwapsMap.values()).map(async (docSnap) => {
          const data = docSnap.data();

          const offeredSkillUserId = data?.offeredSkill?.userId || null;
          const requestedSkillUserId =
            data?.requestedSkill?.userId || data?.requesterId || null;

          const [offeredOwnerSnap, requestedOwnerSnap] = await Promise.all([
            offeredSkillUserId
              ? getDoc(doc(db, "users", offeredSkillUserId))
              : null,
            requestedSkillUserId
              ? getDoc(doc(db, "users", requestedSkillUserId))
              : null,
          ]);

          const offeredOwner = offeredOwnerSnap?.exists()
            ? offeredOwnerSnap.data()
            : {};
          const requestedOwner = requestedOwnerSnap?.exists()
            ? requestedOwnerSnap.data()
            : {};

          return {
            id: docSnap.id,
            ...data,
            offeredOwner,
            requestedOwner,
          };
        })
      );

      setSwaps(swapDetails);
    };

    fetchSwaps();
  }, [user]);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 text-purple-700">🧩 My Swaps</h2>

      {swaps.length === 0 ? (
        <p>No swap requests found.</p>
      ) : (
        swaps.map((swap) => (
          <div
            key={swap.id}
            className="bg-white shadow-md rounded-lg p-4 mb-5 border"
          >
            <h3 className="text-lg font-bold text-purple-700 mb-2">
              Skill You Offered:
            </h3>
            <p className="text-gray-800 font-semibold">
              {swap?.offeredSkill?.title || "N/A"}
            </p>
            <p className="text-gray-600 mb-2">
              {swap?.offeredSkill?.description || "N/A"}
            </p>

            <h3 className="text-lg font-bold text-purple-700 mt-4">
              Skill You Requested:
            </h3>
            <p className="text-gray-800 font-semibold">
              {swap?.requestedSkill?.title || "N/A"}
            </p>
            <p className="text-gray-600">
              {swap?.requestedSkill?.description || "N/A"}
            </p>

            <div className="mt-4">
              <span className="text-sm font-semibold text-gray-600">
                Status:
              </span>{" "}
              <span
                className={`inline-block px-2 py-1 text-xs font-bold rounded ${
                  swap.status === "accepted"
                    ? "bg-green-100 text-green-700"
                    : swap.status === "declined"
                    ? "bg-red-100 text-red-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {swap.status}
              </span>
            </div>

            <div className="mt-4 border-t pt-3">
              <h4 className="font-bold text-sm text-gray-700 mb-1">
                Offered By:
              </h4>
              <p>Name: {swap.offeredOwner.fullName || "N/A"}</p>
              <p>Email: {swap.offeredOwner.email || "N/A"}</p>
              <p>Phone: {swap.offeredOwner.phone || "N/A"}</p>
            </div>

            <div className="mt-3 border-t pt-3">
              <h4 className="font-bold text-sm text-gray-700 mb-1">
                Requested By:
              </h4>
              <p>Name: {swap.requestedOwner.fullName || "N/A"}</p>
              <p>Email: {swap.requestedOwner.email || "N/A"}</p>
              <p>Phone: {swap.requestedOwner.phone || "N/A"}</p>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default MySwaps;

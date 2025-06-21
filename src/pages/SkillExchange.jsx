import React, { useState, useEffect, useContext } from "react";
import {
  collection,
  addDoc,
  getDocs,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
  where,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../services/firebase";
import { AuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";

const SkillExchange = () => {
  const [skills, setSkills] = useState([]);
  const [form, setForm] = useState({ title: "", description: "" });
  const [searchQuery, setSearchQuery] = useState("");
  const [swapRequests, setSwapRequests] = useState([]);
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [mySkills, setMySkills] = useState([]);
  const [selectedOfferedSkillId, setSelectedOfferedSkillId] = useState("");
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    const q = query(collection(db, "skills"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) =>
      setSkills(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })))
    );
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!currentUser) return;

    const q = query(
      collection(db, "swaps"),
      where("requesterId", "==", currentUser.uid)
    );
    const unsub = onSnapshot(q, (snap) =>
      setSwapRequests(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })))
    );
    return () => unsub();
  }, [currentUser]);

  useEffect(() => {
    if (!currentUser) return;

    const loadMySkills = async () => {
      const snap = await getDocs(
        query(collection(db, "skills"), where("userId", "==", currentUser.uid))
      );
      const mySkills = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setMySkills(mySkills);
      if (!selectedOfferedSkillId && mySkills.length > 0) {
        setSelectedOfferedSkillId(mySkills[0].id);
      }
    };

    const loadIncoming = () => {
      const incomingQ = query(
        collection(db, "swaps"),
        where("requestedSkill.userId", "==", currentUser.uid)
      );
      const unsub = onSnapshot(incomingQ, (snap) =>
        setIncomingRequests(
          snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        )
      );
      return unsub;
    };

    loadMySkills();
    const unsubIncoming = loadIncoming();

    return () => unsubIncoming();
  }, [currentUser, selectedOfferedSkillId]);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleAddSkill = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.description.trim())
      return toast.error("Fill both fields.");
    try {
      await addDoc(collection(db, "skills"), {
        ...form,
        userId: currentUser.uid,
        createdAt: serverTimestamp(),
      });
      setForm({ title: "", description: "" });
      toast.success("Skill added!");
    } catch {
      toast.error("Failed to add skill.");
    }
  };

  const sendNotification = async (uid, msg) => {
    await addDoc(collection(db, "notifications"), {
      userId: uid,
      message: msg,
      read: false,
      timestamp: serverTimestamp(),
    }).catch(console.error);
  };

  const handleRequestSwap = async (skill) => {
    if (!selectedOfferedSkillId)
      return toast.error("Select a skill you want to offer first.");

    const mySkill = mySkills.find((s) => s.id === selectedOfferedSkillId);
    if (!mySkill) return;

    try {
      await addDoc(collection(db, "swaps"), {
        requesterId: currentUser.uid,
        offeredSkill: {
          title: mySkill.title,
          description: mySkill.description,
          userId: currentUser.uid,
        },
        requestedSkill: {
          title: skill.title,
          description: skill.description,
          userId: skill.userId,
        },
        status: "pending",
        createdAt: serverTimestamp(),
      });

      await sendNotification(
        skill.userId,
        "🔁 New skill swap request received."
      );
      toast.success("Swap request sent!");
    } catch {
      toast.error("Failed to send swap request.");
    }
  };

  const handleUpdateRequestStatus = async (id, status) => {
    try {
      const ref = doc(db, "swaps", id);
      await updateDoc(ref, { status });
      const req = incomingRequests.find((r) => r.id === id);
      if (req) {
        await sendNotification(
          req.requesterId,
          status === "accepted"
            ? "✅ Your skill swap request was accepted."
            : "❌ Your skill swap request was declined."
        );
      }
      toast.success(`Swap ${status}`);
    } catch {
      toast.error("Update failed.");
    }
  };

  const hasRequested = (skill) =>
    swapRequests.some((r) => r.requestedSkill.title === skill.title);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-purple-700 mb-4">
        🔁 Skill Exchange
      </h2>

      {/* Add Skill Form */}
      <form
        onSubmit={handleAddSkill}
        className="mb-6 grid gap-4 sm:grid-cols-2"
      >
        <input
          name="title"
          placeholder="Skill Title"
          value={form.title}
          onChange={handleChange}
          className="p-2 border rounded"
        />
        <input
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          className="p-2 border rounded"
        />
        <button
          type="submit"
          className="col-span-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700"
        >
          Add My Skill
        </button>
      </form>

      {/* Select Skill to Offer */}
      {mySkills.length > 0 && (
        <div className="mb-6">
          <label className="block font-medium mb-1">
            Select your skill to offer:
          </label>
          <select
            value={selectedOfferedSkillId}
            onChange={(e) => setSelectedOfferedSkillId(e.target.value)}
            className="w-full p-2 border rounded"
          >
            {mySkills.map((ms) => (
              <option key={ms.id} value={ms.id}>
                {ms.title} — {ms.description}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Skill List */}
      <input
        type="text"
        placeholder="Search available skills"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="border p-2 mb-4 rounded w-full"
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {skills
          .filter((s) => s.userId !== currentUser.uid)
          .filter((s) =>
            s.title.toLowerCase().includes(searchQuery.toLowerCase())
          )
          .map((skill) => (
            <div
              key={skill.id}
              className="p-4 bg-white rounded shadow hover:shadow-md border"
            >
              <h3 className="font-semibold text-purple-700">{skill.title}</h3>
              <p className="text-gray-600 text-sm">{skill.description}</p>
              <button
                onClick={() => handleRequestSwap(skill)}
                disabled={hasRequested(skill)}
                className="mt-3 bg-purple-600 text-white py-1 px-3 rounded disabled:opacity-50"
              >
                {hasRequested(skill) ? "Requested" : "Request Swap"}
              </button>
            </div>
          ))}
      </div>

      {/* Incoming Requests */}
      {incomingRequests.length > 0 && (
        <div className="mt-10">
          <h3 className="text-xl font-bold text-purple-700 mb-4">
            📥 Incoming Requests
          </h3>
          <div className="space-y-4">
            {incomingRequests.map((req) => (
              <div key={req.id} className="p-4 bg-white border rounded">
                <p>
                  <strong>Offered:</strong> {req.offeredSkill.title}
                </p>
                <p>
                  <strong>Requested:</strong> {req.requestedSkill.title}
                </p>
                <p>
                  <strong>Status:</strong> {req.status}
                </p>

                {req.status === "pending" ? (
                  <div className="mt-2 flex gap-2">
                    <button
                      onClick={() =>
                        handleUpdateRequestStatus(req.id, "accepted")
                      }
                      className="bg-green-500 text-white py-1 px-3 rounded"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() =>
                        handleUpdateRequestStatus(req.id, "declined")
                      }
                      className="bg-red-500 text-white py-1 px-3 rounded"
                    >
                      Decline
                    </button>
                  </div>
                ) : (
                  <p className="mt-2 italic text-gray-500">
                    You {req.status} this request.
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SkillExchange;

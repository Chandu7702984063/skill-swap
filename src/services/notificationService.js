import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";

export const sendNotification = async (userId, message) => {
  try {
    await addDoc(collection(db, "notifications"), {
      userId,
      message,
      read: false,
      timestamp: serverTimestamp(),
    });
  } catch (error) {
    console.error("Failed to send notification:", error.message);
  }
};

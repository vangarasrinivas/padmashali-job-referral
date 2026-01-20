import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  increment,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export const trackVisitor = async () => {
  const today = new Date().toISOString().split("T")[0];
  const ref = doc(db, "analytics", "visitors");

  const snap = await getDoc(ref);

  if (!snap.exists()) {
    await setDoc(ref, {
      total: 1,
      daily: {
        [today]: 1,
      },
    });
  } else {
    await updateDoc(ref, {
      total: increment(1),
      [`daily.${today}`]: increment(1),
    });
  }
};

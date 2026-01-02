import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  orderBy,
  query,
  where,
  limit,
  startAfter,
  getCountFromServer,
} from "firebase/firestore";
import { db } from "./firebase";

const jobsCollection = collection(db, "jobs");

/* ---------------- CREATE ---------------- */
export const createJob = async (job) => {
  const docRef = await addDoc(jobsCollection, {
    ...job,
    created_date: serverTimestamp(),
  });
  return docRef.id;
};

/* ---------------- READ (PAGINATED) ---------------- */
export const getJobs = async ({ category = null, pageSize = 15, lastDoc = null } = {}) => {
  let q;

  if (category) {
    q = query(
      jobsCollection,
      where("jobCategory", "==", category),
      orderBy("created_date", "desc")
    );
  } else {
    q = query(jobsCollection, orderBy("created_date", "desc"));
  }

  if (lastDoc) {
    q = query(q, startAfter(lastDoc));
  }

  // Limit to pageSize
  q = query(q, /* limit */ pageSize ? limit(pageSize) : undefined);

  const snapshot = await getDocs(q);

  const jobs = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  const lastVisible = snapshot.docs[snapshot.docs.length - 1] || null;

  return { jobs, lastVisible };
};

/* ---------------- GET JOBS COUNT ---------------- */
export const getJobsCount = async (category = null) => {
  let q;
  if (category) {
    q = query(jobsCollection, where("jobCategory", "==", category));
  } else {
    q = jobsCollection;
  }

  const snapshot = await getCountFromServer(q);
  return snapshot.data().count;
};


/* ---------------- UPDATE ---------------- */
export const updateJob = async (id, updatedJob) => {
  const jobRef = doc(db, "jobs", id);
  await updateDoc(jobRef, {
    ...updatedJob,
    modified_date: serverTimestamp(),
  });
};

/* ---------------- DELETE ---------------- */
export const deleteJob = async (id) => {
  const jobRef = doc(db, "jobs", id);
  await deleteDoc(jobRef);
};

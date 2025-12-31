import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, serverTimestamp, orderBy, query, where } from "firebase/firestore";
import { db } from "./firebase";

const jobsCollection = collection(db, "jobs");

// CREATE
export const createJob = async (job) => {
  const docRef = await addDoc(jobsCollection, { ...job, created_date: serverTimestamp() });
  return docRef.id;
};

// READ
export const getJobs = async (category) => {
  let q;

  if (category) {
    // Filter by jobCategory if category is provided
    q = query(
      jobsCollection,
      where("jobCategory", "==", category),
      orderBy("created_date", "desc")
    );
  } else {
    // Return all jobs
    q = query(jobsCollection, orderBy("created_date", "desc"));
  }

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

// export const getJobs = async (category) => {
//   // Query all jobs, ordered by created_date
//   const q = query(jobsCollection, orderBy("created_date", "desc"));
//   const snapshot = await getDocs(q);

//   // Map results
//   const allJobs = snapshot.docs.map((doc) => ({
//     id: doc.id,
//     ...doc.data(),
//   }));

//   // Filter by category in-app if a category is provided
//   if (category) {
//     return allJobs.filter((job) => job.jobCategory === category);
//   }

//   return allJobs; // Return all jobs if no category
// };

// UPDATE
export const updateJob = async (id, updatedJob) => {
  const jobRef = doc(db, "jobs", id);

  await updateDoc(jobRef, {
    ...updatedJob,
    modified_date: serverTimestamp(),
  });
};


// DELETE
export const deleteJob = async (id) => {
  const jobRef = doc(db, "jobs", id);
  await deleteDoc(jobRef);
};



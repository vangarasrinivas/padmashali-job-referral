"use client";

import { useEffect, useState } from "react";
import { getJobs, createJob, updateJob, deleteJob } from "@/lib/jobs";
import JobForm from "@/components/JobForm";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import NavbarAdmin from "@/components/NavbarAdmin";
import JobCardAdmin from "../../components/JobCardAdmin";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
export default function AdminPage() {
  const router = useRouter();

  const [jobs, setJobs] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);

  // ✅ Separate loading states
  const [authLoading, setAuthLoading] = useState(true);
  const [jobsLoading, setJobsLoading] = useState(false);

 
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.replace("/admin/login");
        return;
      }

      const adminRef = doc(db, "admins", user.uid);
      const adminSnap = await getDoc(adminRef);

      if (!adminSnap.exists()) {
        router.replace("/admin/login");
        return;
      }

      // ✅ Admin verified
      setAuthLoading(false);
      loadJobs(); // load jobs AFTER auth
    });

    return () => unsub();
  }, []);
 
  const loadJobs = async (category) => {
    setJobsLoading(true);
    try {
      const data = await getJobs(category);
      setJobs(data);
    } catch (error) {
      console.error("Failed to load jobs:", error);
      setJobs([]);
    } finally {
      setJobsLoading(false);
    }
  };

  /* ---------------- SUBMIT ---------------- */
  const handleSubmit = async (data) => {
    setJobsLoading(true);

    try {
      if (selectedJob) {
        await updateJob(selectedJob.id, data);
      } else {
        await createJob(data);
      }

      setOpen(false);
      setSelectedJob(null);
      await loadJobs();
    } finally {
      setJobsLoading(false);
    }
  };

  const closeModal = () => {
    setOpen(false);
    setSelectedJob(null);
  };



  return (
    <div>
      <NavbarAdmin />
      <div className="max-w-7xl mx-auto p-6 bg-gray-100 min-h-screen ">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-semibold text-gray-800">Manage Jobs</h1>

          <button
            onClick={() => setOpen(true)}
            className="flex items-center gap-2 bg-[#9743e4] text-white px-4 py-2 rounded-md
                     hover:bg-[#7a33c9] transition"
          >
            <FaPlus size={14} />
            Add Job
          </button>
        </div>

        {/* Job List */}
        <div className="space-y-3">

          {jobsLoading ? (
            <div className="text-center py-10 text-2xl font-medium text-gray-500">Loading jobs...</div>
          ) : (
            <div className="flex flex-col gap-4">
              {jobs.map((job) => (
                <JobCardAdmin
                  key={job.id}
                  job={job}
                  onEdit={(job) => {
                    setSelectedJob(job);
                    setOpen(true);
                  }}
                  onDelete={async (id) => {
                    await deleteJob(id);
                    loadJobs();
                  }}
                />
              ))}
            </div>
          )}
        </div>


        {/* Modal */}
        {open && (
          <div
            className="fixed inset-0 z-100 flex items-center justify-center
                     bg-black/40 backdrop-blur-sm"
          >
            <div
              className="bg-white w-full max-w-5xl mx-4 rounded-xl shadow-xl
                       transform transition-all duration-300 scale-100 opacity-100"
            >
              {/* Modal Header */}
              <div className="flex justify-between items-center px-6 py-4 border-b">
                <h2 className="text-lg font-semibold text-gray-800">
                  {selectedJob ? "Update Job" : "Create Job"}
                </h2>

                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600 text-xl"
                >
                  ✕
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 max-h-[80vh] overflow-y-auto">
                <JobForm
                  initialData={selectedJob}
                  onSubmit={handleSubmit}
                  loading={jobsLoading}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

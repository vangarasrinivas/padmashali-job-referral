"use client";

import { useEffect, useState } from "react";
import {
  getJobs,
  getJobsCount,
  createJob,
  updateJob,
  deleteJob,
} from "@/lib/jobs";
import JobForm from "@/components/JobForm";
import NavbarAdmin from "@/components/NavbarAdmin";
import JobCardAdmin from "@/components/JobCardAdmin";
import ToastAlert from "@/components/ToastAlert";
import { FaPlus } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import BackToTop from "../../components/BackToTop";
import { FiLogOut } from "react-icons/fi";
import { signOut } from "firebase/auth";

const PAGE_SIZE = 15;

export default function AdminPage() {
  const router = useRouter();

  /* ---------------- STATE ---------------- */
  const [jobs, setJobs] = useState([]);
  const [lastDoc, setLastDoc] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [totalJobs, setTotalJobs] = useState(0);

  const [open, setOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);

  const [authLoading, setAuthLoading] = useState(true);
  const [jobsLoading, setJobsLoading] = useState(false);

  const [alert, setAlert] = useState(null);
  // { type: "success" | "error", message: string }

  /* ---------------- ALERT ---------------- */
  const showAlert = (type, message) => {
    setAlert({ type, message });
  };

  /* ---------------- AUTH ---------------- */
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

      setAuthLoading(false);
      loadInitialJobs();
    });

    return () => unsub();
  }, []);

  /* ---------------- INITIAL LOAD ---------------- */
  const loadInitialJobs = async () => {
    setJobsLoading(true);
    try {
      const { jobs: firstJobs, lastVisible } = await getJobs({
        pageSize: PAGE_SIZE,
      });

      const count = await getJobsCount();

      setJobs(firstJobs);
      setLastDoc(lastVisible);
      setTotalJobs(count);
      setHasMore(firstJobs.length === PAGE_SIZE);
    } catch {
      showAlert("error", "Failed to load jobs");
    } finally {
      setJobsLoading(false);
    }
  };

  /* ---------------- LOAD MORE ---------------- */
  const loadMoreJobs = async () => {
    if (!lastDoc || !hasMore) return;

    setJobsLoading(true);
    try {
      const { jobs: moreJobs, lastVisible } = await getJobs({
        pageSize: PAGE_SIZE,
        lastDoc,
      });

      setJobs((prev) => [...prev, ...moreJobs]);
      setLastDoc(lastVisible);
      setHasMore(moreJobs.length === PAGE_SIZE);
    } catch {
      showAlert("error", "Failed to load more jobs");
    } finally {
      setJobsLoading(false);
    }
  };

  /* ---------------- CREATE / UPDATE ---------------- */
  const handleSubmit = async (data) => {
    setJobsLoading(true);
    try {
      if (selectedJob) {
        await updateJob(selectedJob.id, data);
        showAlert("success", "Job updated successfully");
      } else {
        await createJob(data);
        showAlert("success", "Job created successfully");
      }

      setOpen(false);
      setSelectedJob(null);
      await loadInitialJobs();
    } catch {
      showAlert("error", "Failed to save job");
    } finally {
      setJobsLoading(false);
    }
  };

  /* ---------------- DELETE ---------------- */
  const handleDelete = async (id) => {
    try {
      await deleteJob(id);
      showAlert("success", "Job deleted successfully");
      await loadInitialJobs();
    } catch {
      showAlert("error", "Failed to delete job");
    }
  };

  /* ---------------- AUTH LOADING ---------------- */
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Checking admin access...
      </div>
    );
  }

  console.log("Jobs:", jobs);

  const handleLogout = async () => {
    await signOut(auth);
    router.replace("/"); // ✅ Redirect to home
  }

  return (
    <div>
      <NavbarAdmin />

      {/* Toast Alert */}
      {alert && (
        <ToastAlert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}
      <div className="bg-gray-100 min-h-screen px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="py-4 ">
            {/* Count */}

            <h1 className="text-xl text-center font-semibold text-gray-800">
              Manage Jobs
            </h1>

            <div className="flex flex-wrap gap-2 float-right mt-3 md:mt-0 ">
              {/* Add Job Button */}
              <button
                onClick={() => {
                  setSelectedJob(null);
                  setOpen(true);
                }}
                className="
                  flex items-center gap-1.5 sm:gap-2
                  bg-gradient-to-r from-[#9743e4] to-[#7a33c9]
                  text-white font-medium
                  px-2 sm:px-4 py-1.5 sm:py-2.5
                  text-xs sm:text-sm
                  rounded-md sm:rounded-lg
                  shadow-sm sm:shadow-md shadow-purple-500/30
                  hover:shadow-purple-500/50
                  hover:scale-105
                  transition-transform duration-200
                "
              >
                <FaPlus className="text-xs sm:text-sm" />
                <span>Add Job</span>
              </button>

              {/* Logout Button */}
              <button
                onClick={() => handleLogout()}
                className="
                flex items-center gap-1.5 sm:gap-2
                bg-red-600 hover:bg-red-700
                text-white font-medium
                px-2 sm:px-4 py-1.5 sm:py-2
                text-xs sm:text-sm
                rounded-md sm:rounded-lg
                shadow-sm hover:shadow-md
                transition-all duration-200
              "
              >
                <FiLogOut className="text-xs sm:text-sm" />
                <span>Logout</span>
              </button>
            </div>

          </div>
          <div>


            <div className="text-sm text-gray-600 mb-5">
              Showing <span className="font-medium">{jobs.length}</span> of{" "}
              <span className="font-medium">{totalJobs}</span> jobs
            </div>
          </div>



          {/* Job List */}
          {jobs.length === 0 && !jobsLoading ? (
            <div className="text-center py-12 text-gray-500">
              No jobs found
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {jobs.map((job) => (
                <JobCardAdmin
                  key={job.id}
                  job={job}
                  onEdit={() => {
                    setSelectedJob(job);
                    setOpen(true);
                  }}
                  onDelete={() => handleDelete(job.id)}
                />
              ))}
            </div>
          )}

          {/* Load More / End Result */}
          <div className="flex justify-center py-10">
            {hasMore ? (
              <button
                onClick={loadMoreJobs}
                disabled={jobsLoading}
                className="
                group relative flex items-center gap-2
                px-8 py-3 rounded-md
                bg-gradient-to-r from-[#9743e4] to-[#7a33c9]
                text-white text-sm font-medium
                shadow-lg shadow-purple-500/20
                hover:shadow-purple-500/40
                hover:scale-[1.03]
                active:scale-95
                transition-all duration-300
                disabled:opacity-60 disabled:cursor-not-allowed
              "
              >
                {jobsLoading ? (
                  <>
                    <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    Loading more jobs
                  </>
                ) : (
                  <>
                    Load more jobs
                    <span className="transition-transform group-hover:translate-x-1">
                      →
                    </span>
                  </>
                )}
              </button>
            ) : (
              jobs.length > 0 && (
                <div className="flex items-center gap-4 text-gray-400 text-sm">
                  <span className="h-px w-16 bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
                  <span>End of results</span>
                  <span className="h-px w-16 bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
                </div>
              )
            )}
          </div>

          {/* Modal */}
          {open && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
              <div className="bg-white w-full max-w-5xl mx-4 rounded-2xl shadow-xl">
                <div className="flex justify-between items-center px-6 py-4 border-b">
                  <h2 className="text-lg font-semibold">
                    {selectedJob ? "Update Job" : "Create Job"}
                  </h2>
                  <button
                    onClick={() => setOpen(false)}
                    className="text-gray-500 hover:text-black"
                  >
                    ✕
                  </button>
                </div>

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
          {/* Back to Top */}
          <BackToTop />
        </div>

      </div>


    </div>
  );
}

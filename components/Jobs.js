"use client";

import { useEffect, useState } from "react";
import JobCard from "./JobCard";
import { getJobs, getJobsCount } from "@/lib/jobs";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { FaLock } from "react-icons/fa";

const PAGE_SIZE_AUTH = 15;
const PAGE_SIZE_GUEST = 5;

const Jobs = () => {
  const [activeTab, setActiveTab] = useState("Private");
  const { profile } = useCurrentUser();

  const isAuthenticated = Boolean(profile);
  const PAGE_SIZE = isAuthenticated ? PAGE_SIZE_AUTH : PAGE_SIZE_GUEST;

  const [jobs, setJobs] = useState([]);
  const [lastDoc, setLastDoc] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [totalJobs, setTotalJobs] = useState(0);
  const [loading, setLoading] = useState(false);

  /* ---------------- LOAD JOBS ---------------- */
  const loadJobs = async ({ reset = false, category }) => {
    setLoading(true);

    try {
      const { jobs: fetchedJobs, lastVisible } = await getJobs({
        category,
        pageSize: PAGE_SIZE,
        lastDoc: reset ? null : lastDoc,
      });

      const count = await getJobsCount(category);

      setJobs((prev) =>
        reset ? fetchedJobs : [...prev, ...fetchedJobs]
      );
      setLastDoc(lastVisible);
      setTotalJobs(count);
      setHasMore(
        isAuthenticated && fetchedJobs.length === PAGE_SIZE
      );
    } catch (err) {
      console.error("Failed to load jobs:", err);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- INITIAL LOAD ---------------- */
  useEffect(() => {
    loadJobs({ reset: true, category: activeTab });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, isAuthenticated]);

  /* ---------------- LOAD MORE ---------------- */
  const loadMoreJobs = () => {
    if (!hasMore || loading) return;
    loadJobs({ category: activeTab });
  };

  return (
    <div className="w-full bg-gray-100 min-h-screen mt-5 rounded-md shadow-md">
      {/* ---------------- TABS ---------------- */}
      <div className="sticky top-16 z-30 bg-white px-5 pt-3 flex gap-4 border-b-2 border-gray-200">
        {["Private", "Government"].map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab);
              setJobs([]);
              setLastDoc(null);
              setHasMore(true);
            }}
            className={`relative px-4 py-2 font-medium transition-colors
              ${activeTab === tab ? "text-[#9743e4]" : "text-gray-500"}
            `}
          >
            {tab}
            <span
              className={`absolute left-0 -bottom-[2px] h-[2px] bg-[#9743e4] transition-all
                ${activeTab === tab ? "w-full" : "w-0"}
              `}
            />
          </button>
        ))}
      </div>

      {/* ---------------- CONTENT ---------------- */}
      <div className="p-5">
        {/* Count */}
        {!loading && jobs.length > 0 && (
          <div className="text-sm text-gray-600 mb-2">
            Showing <span className="font-medium">{jobs.length}</span>{" "}
            of <span className="font-medium">{totalJobs}</span>{" "}
            {activeTab} jobs
          </div>
        )}

        {/* Job List */}
        {loading ? (
          <div className="flex justify-center py-10">
            <span className="h-6 w-6 rounded-full border-2 border-purple-300 border-t-purple-600 animate-spin" />
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-6 text-gray-500">
            No jobs found
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        )}

        {/* ---------------- CTA / LOAD MORE ---------------- */}
        <div className="flex justify-center mt-10 ">
          {!isAuthenticated && jobs.length >= PAGE_SIZE_GUEST ? (

            <div className="relative w-full text-center bg-gradient-to-r mt-[-10rem] from-purple-50 to-purple-100 border border-purple-200 p-8 rounded-2xl shadow-lg">

              {/* Lock Icon */}
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#9743e4] text-white shadow-md">
                <FaLock size={18} />
              </div>

              {/* Headline */}
              <h3 className="text-lg font-semibold text-gray-900">
                More Jobs Are Locked
              </h3>

              {/* Hidden count */}
              <p className="mt-1 text-sm font-medium text-purple-700">
                +{totalJobs} more jobs hidden
              </p>

              {/* Subtext */}
              <p className="mt-2 text-sm text-gray-600">
                Sign in or create a free account to unlock
                <span className="font-medium text-purple-700"> unlimited job listings</span>.
              </p>

              {/* Actions */}
              <div className="mt-6 flex gap-4 justify-center">
                <a
                  href="/signup"
                  className="
            px-6 py-2.5 rounded-full
            bg-gradient-to-r from-[#9743e4] to-[#7a33c9]
            text-white text-sm font-medium
            shadow-lg shadow-purple-500/30
            hover:shadow-purple-500/50
            hover:scale-[1.03]
            active:scale-95
            transition-all
          "
                >
                  Unlock Jobs
                </a>

                <a
                  href="/login"
                  className="
            px-6 py-2.5 rounded-full
            border border-[#9743e4]
            text-[#9743e4] text-sm font-medium
            hover:bg-purple-50
            transition
          "
                >
                  Sign In
                </a>
              </div>

              {/* Trust hint */}
              <p className="mt-4 text-xs text-gray-500">
                Free account • No spam • Instant access
              </p>
            </div>
          ) : hasMore ? (
            <button
              onClick={loadMoreJobs}
              disabled={loading}
              className="
                group flex items-center gap-2
                px-8 py-3 rounded-full
                bg-gradient-to-r from-[#9743e4] to-[#7a33c9]
                text-white text-sm font-medium
                shadow-lg shadow-purple-500/20
                hover:shadow-purple-500/40
                hover:scale-[1.03]
                active:scale-95
                transition-all
                disabled:opacity-60 disabled:cursor-not-allowed
              "
            >
              {loading ? (
                <>
                  <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  Loading more jobs
                </>
              ) : (
                <>
                  Load more jobs
                  <span className="group-hover:translate-x-1 transition-transform">
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
      </div>
    </div>
  );
};

export default Jobs;

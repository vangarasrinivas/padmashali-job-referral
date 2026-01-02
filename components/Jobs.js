"use client";

import { useEffect, useState } from "react";
import JobCard from "./JobCard";
import { getJobs, getJobsCount } from "@/lib/jobs";

const PAGE_SIZE = 15;

const Jobs = () => {
  const [activeTab, setActiveTab] = useState("Private");

  const [jobs, setJobs] = useState([]);
  const [lastDoc, setLastDoc] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [totalJobs, setTotalJobs] = useState(0);

  const [loading, setLoading] = useState(false);

  /* ---------------- INITIAL LOAD ---------------- */
  const loadInitialJobs = async (category) => {
    setLoading(true);
    try {
      const { jobs: firstJobs, lastVisible } = await getJobs({
        category,
        pageSize: PAGE_SIZE,
      });

      const count = await getJobsCount(category);

      setJobs(firstJobs);
      setLastDoc(lastVisible);
      setTotalJobs(count);
      setHasMore(firstJobs.length === PAGE_SIZE);
    } catch (error) {
      console.error("Failed to load jobs:", error);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- LOAD MORE ---------------- */
  const loadMoreJobs = async () => {
    if (!lastDoc || !hasMore) return;

    setLoading(true);
    try {
      const { jobs: moreJobs, lastVisible } = await getJobs({
        category: activeTab,
        pageSize: PAGE_SIZE,
        lastDoc,
      });

      setJobs((prev) => [...prev, ...moreJobs]);
      setLastDoc(lastVisible);
      setHasMore(moreJobs.length === PAGE_SIZE);
    } catch (error) {
      console.error("Failed to load more jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- FIRST LOAD ---------------- */
  useEffect(() => {
    loadInitialJobs(activeTab);
  }, []);

  return (
    <div className="w-full bg-gray-100 min-h-screen mt-5 rounded-md shadow-md">
      {/* Sticky Tabs */}
      <div
        className="
          sticky top-16 z-30
          bg-white px-5 pt-3
          flex gap-4 border-b-2 border-gray-200
        "
      >
        {["Private", "Government"].map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab);
              setJobs([]);
              setLastDoc(null);
              setHasMore(true);
              loadInitialJobs(tab);
            }}
            className={`relative px-4 py-2 font-medium transition-colors duration-300
              ${activeTab === tab ? "text-[#9743e4]" : "text-gray-500"}
            `}
          >
            {tab}
            <span
              className={`absolute left-0 -bottom-[2px] h-[2px] bg-[#9743e4] transition-all duration-300
                ${activeTab === tab ? "w-full" : "w-0"}
              `}
            />
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Count */}
        {!loading && jobs.length > 0 && (
          <div className="text-sm text-gray-600 mb-2">
            Showing <span className="font-medium">{jobs.length}</span> of{" "}
            <span className="font-medium">{totalJobs}</span> {activeTab} jobs
          </div>
        )}

        {/* Job List */}
        {loading && jobs.length === 0 ? (
          <div className="text-center py-4 text-gray-500">No jobs found</div>
        ) : (
          <div className="flex flex-col gap-4">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        )}

        {/* Load More / End Result */}
        <div className="flex justify-center mt-10">
          {hasMore ? (
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
                transition-all duration-300
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
      </div>
    </div>
  );
};

export default Jobs;

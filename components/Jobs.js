"use client";

import { useEffect, useState } from "react";
import JobCard from "./JobCard";
import { getJobs } from "@/lib/jobs";

const Jobs = () => {
  const [activeTab, setActiveTab] = useState("Private");
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadJobs = async (category) => {
    setLoading(true); // Start loading
    try {
      const data = await getJobs(category);
      setJobs(data);
    } catch (error) {
      console.error("Failed to load jobs:", error);
      setJobs([]);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  useEffect(() => {
    loadJobs("Private");
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
              loadJobs(tab);
            }}
            className={`relative px-4 py-2 font-medium transition-colors duration-300 cursor-pointer
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
        {loading ? (
          <div className="text-center py-10 text-2xl font-medium text-gray-500">Loading jobs...</div>
        ) : (
          <div className="flex flex-col gap-4">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Jobs;

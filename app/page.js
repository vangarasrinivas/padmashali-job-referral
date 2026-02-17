"use client";

import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Jobs from "../components/Jobs";
import BackToTop from "../components/BackToTop";
import ContactSection from "../components/ContactSection";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import Link from "next/link";
import { FaPlus } from "react-icons/fa";
import JobForm from "@/components/JobForm";
import {
  getJobs,
  getJobsCount,
  createJob,
  updateJob,
  deleteJob,
} from "@/lib/jobs";
import ToastAlert from "@/components/ToastAlert";

export default function Home() {
  const { profile } = useCurrentUser();
  console.log("User profile:", profile);

  const [open, setOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [jobsLoading, setJobsLoading] = useState(false);
  const [reloadJobs, setReloadJobs] = useState(false); // New state to trigger reload 


  const [alert, setAlert] = useState(null);
  // { type: "success" | "error", message: string }

  /* ---------------- ALERT ---------------- */
  const showAlert = (type, message) => {
    setAlert({ type, message });
  };

  const handleSubmit = async (data) => {
    setJobsLoading(true);
    try {
      if (selectedJob) {
        await updateJob(selectedJob.id, data);
        showAlert("success", "Job updated successfully");
      } else {
        const updatedInfo = {
          ...data,
          posted_by_uid: profile?.uid || null,
          posted_by: 'user',
          posted_by_name: profile?.fullName,
          posted_by_email: profile?.email || 'admin'
        };

        await createJob(updatedInfo);
        showAlert("success", "Job created successfully");
        setReloadJobs((prev) => !prev);
      }

      setOpen(false);
      setSelectedJob(null);

      // Separate error handling
      try {
        // await loadInitialJobs();
        console.log("Reloading jobs after submit...");
      } catch (e) {
        console.error("loadInitialJobs failed:", e);
      }

    } catch (error) {
      console.error("Save job error:", error);
      showAlert("error", "Failed to save job");
    } finally {
      setJobsLoading(false);
    }
  };





  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Navbar */}
      <Navbar />
      {alert && (
        <ToastAlert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}

      <div className="max-w-6xl mx-auto px-0 md:px-4 mt-[2rem]">
        <section
          id="home"
          className="
          
          rounded-2xl
          bg-white
          border border-gray-200
          shadow-sm
        "
        >
          <div className="px-6 pt-8 pb-5 sm:px-10 sm:pt-12 text-center">

            <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-900">
              Welcome to{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#9743e4] to-[#7a33c9]">
                Padmashali Job Referral Portal
              </span>
            </h1>

            {!profile ? (
              <Link
                href="/login"
                className="inline-flex px-5 py-2.5 mt-2 rounded-full bg-gradient-to-r from-[#9743e4] to-[#7a33c9] text-white font-medium"
              >
                Sign in to continue
              </Link>
            ) : (
              <>
                <p className="font-medium text-xl text-gray-800 mt-1">
                  Welcome,{" "}
                  <span className="text-[#7a33c9] font-bold">
                    {profile?.fullName || profile?.email}
                  </span>{" "}
                  👋
                </p>
                <p className=" font-bold text-xl text-gray-800 mt-2">Post a job or refer a candidate</p>
                <div className="flex justify-center mt-2">
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
                    <span>Post Job</span>
                  </button>
                </div>

              </>
            )}

            {/* <p className="mt-4 max-w-3xl mx-auto text-sm sm:text-base text-gray-600">
              Discover genuine job openings, employee referrals, interview
              guidance, and career growth opportunities — powered by the
              Padmashali community.
            </p> */}


          </div>
        </section>

        <section id="jobs" className="mt-5">
          <div className="flex justify-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 border-b-4 border-purple-500 inline-block pb-1">
              Latest Jobs
            </h2>
          </div>
          <Jobs reload={reloadJobs} />
        </section>
      </div>
      <ContactSection />
      <BackToTop />

      {open && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/40 backdrop-blur-sm">
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
    </div>
  );
}

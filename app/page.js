"use client";

import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Jobs from "../components/Jobs";
import BackToTop from "../components/BackToTop";
import ContactSection from "../components/ContactSection";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import Link from "next/link";
import { FaCheckCircle, FaPlus } from "react-icons/fa";
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

          <div className="px-5 pt-8 pb-8 sm:px-8 sm:pt-10">
            <div className="flex flex-col lg:flex-row gap-6 lg:gap-10 items-start">

              {/* ===== LEFT SECTION (70%) ===== */}
              <div className="w-full lg:w-[70%] text-center lg:text-left">

                <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold text-gray-900">
                  Welcome to{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#9743e4] to-[#7a33c9]">
                    Padmashali Job Referral Portal
                  </span>
                </h1>

                {!profile ? (
                  <Link
                    href="/login"
                    className="inline-flex px-5 py-2.5 mt-5 rounded-full bg-gradient-to-r from-[#9743e4] to-[#7a33c9] text-white font-medium"
                  >
                    Sign in to continue
                  </Link>
                ) : (
                  <>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-5 mt-2">

                      {/* Text Section */}
                      <div className="text-center sm:text-left">
                        <p className="font-medium text-base sm:text-lg md:text-xl text-gray-800">
                          Welcome,{" "}
                          <span className="text-[#7a33c9] font-bold">
                            {profile?.fullName || profile?.email}
                          </span>{" "}
                          👋
                        </p>

                        <p className="font-semibold text-sm sm:text-base text-gray-800 mt-1">
                          Post a job or refer a candidate
                        </p>
                      </div>

                      {/* Button Section */}
                      <div className="flex justify-center sm:justify-start">
                        <button
                          onClick={() => {
                            setSelectedJob(null);
                            setOpen(true);
                          }}
                          className="flex items-center gap-2 bg-gradient-to-r from-[#9743e4] to-[#7a33c9] text-white font-medium px-5 py-2 text-sm rounded-lg shadow-md hover:scale-105 transition-transform duration-200"
                        >
                          <FaPlus />
                          Post Job
                        </button>
                      </div>

                    </div>
                  </>
                )}

                {/* Platform Description */}
                <p className="mt-4 text-sm sm:text-base text-gray-600 max-w-xl mx-auto lg:mx-0 leading-relaxed hidden md:block">
                  Discover verified job opportunities shared by community members.
                  Get trusted employee referrals, career guidance, and support to grow professionally.
                </p>

                {/* <p className="mt-3 text-sm sm:text-base text-gray-600 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                  Padmashali Trust is committed to empowering our community through
                  employment support, networking, and collaborative growth initiatives.
                </p> */}

                {/* Feature Points */}

                <ul className="mt-5 space-y-3 text-sm sm:text-base text-gray-700 max-w-xl mx-auto lg:mx-0 hidden md:block">

                  <li className="flex items-start gap-3">
                    <FaCheckCircle className="text-[#9743e4] mt-1 shrink-0 text-sm sm:text-base" />
                    <span>Share only genuine job posts and referrals</span>
                  </li>

                  <li className="flex items-start gap-3">
                    <FaCheckCircle className="text-[#9743e4] mt-1 shrink-0 text-sm sm:text-base" />
                    <span>No spam, forwarded messages, or political content</span>
                  </li>

                  {/* <li className="flex items-start gap-3">
                    <FaCheckCircle className="text-[#9743e4] mt-1 shrink-0 text-sm sm:text-base" />
                    <span>Respect everyone in the community</span>
                  </li>

                  <li className="flex items-start gap-3">
                    <FaCheckCircle className="text-[#9743e4] mt-1 shrink-0 text-sm sm:text-base" />
                    <span>Help whenever possible — one referral can change a life</span>
                  </li> */}

                </ul>


              </div>

              {/* ===== RIGHT SECTION (30%) ===== */}
              <div className="w-full sm:w-[80%] md:w-[60%] lg:w-[30%]">
                <div className="bg-gradient-to-br from-purple-50 to-white border border-purple-200 rounded-2xl p-4 sm:p-5 shadow-sm text-center">

                  <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                    Support Padmashali Trust 🙏
                  </h3>

                  <p className="text-xs sm:text-sm text-gray-600 mt-1">
                    Scan to donate via PhonePe / GPay / Paytm
                  </p>

                  <div className="mt-4 flex justify-center">
                    {/* <Image
                      src="/trust-paymet-qr.jpg"
                      alt="UPI Donation QR"
                      width={160}
                      height={160}
                      className="w-32 sm:w-36 h-auto object-contain rounded-lg border border-gray-200"
                    /> */}
                    <img
                      src="/trust-paymet-qr.jpg"
                      alt="Padmashali Logo"
                      className="w-32 h-36"
                    />
                  </div>

                  <a
                    href="upi://pay?pa=8919685595-2@ybl&pn=Padmashali%20Trust&cu=INR&tn=Donation%20for%20Padmashali%20Trust"
                    className="mt-4 px-4 py-2 text-xs sm:text-sm font-medium text-white bg-gradient-to-r from-[#9743e4] to-[#7a33c9] rounded-lg hover:opacity-90 transition md:hidden inline-block"
                  >
                    Donate Now
                  </a>

                </div>
              </div>

            </div>
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

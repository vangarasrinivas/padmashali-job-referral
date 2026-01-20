"use client";

import React, { useEffect } from "react";
import Navbar from "../components/Navbar";
import Jobs from "../components/Jobs";
import BackToTop from "../components/BackToTop";
import ContactSection from "../components/ContactSection";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import Link from "next/link";
export default function Home() {
  const { profile } = useCurrentUser();

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Navbar */}
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 mt-[2rem]">
        <section
          id="home"
          className="
          
          rounded-2xl
          bg-white
          border border-gray-200
          shadow-sm
        "
        >
          <div className="px-6 py-8 sm:px-10 sm:py-12 text-center">

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
              <p className="text-base font-medium text-gray-800">
                Welcome,{" "}
                <span className="text-[#7a33c9]">
                  {profile?.fullName || profile?.email}
                </span>{" "}
                👋
              </p>
            )}

            <p className="mt-4 max-w-3xl mx-auto text-sm sm:text-base text-gray-600">
              Discover genuine job openings, employee referrals, interview
              guidance, and career growth opportunities — powered by the
              Padmashali community.
            </p>


          </div>
        </section>

        <section id="jobs" className="mt-5">
          <div className="flex justify-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 border-b-4 border-purple-500 inline-block pb-1">
              Latest Jobs
            </h2>
          </div>
          <Jobs />
        </section>
      </div>
      <ContactSection />
      <BackToTop />
    </div>
  );
}

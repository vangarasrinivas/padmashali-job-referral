import React from "react";
import Navbar from "../components/Navbar";
import Jobs from "../components/Jobs";
import BackToTop from "../components/BackToTop";
import ContactSection from "../components/ContactSection";

export default function Home() {
  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Navbar */}
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 mt-[4rem]">
        <section
          id="home"
          className="
    mt-6
    rounded-2xl
    bg-white
    border border-gray-200
    shadow-sm
  "
        >
          <div className="px-6 py-8 sm:px-10 sm:py-12 text-center">
            <h1
              className="
        text-xl sm:text-2xl md:text-3xl
        font-semibold
        text-gray-900
        leading-snug
      "
            >
              Welcome to{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#9743e4] to-[#7a33c9]">
                Padmashali Job Referral Portal
              </span>
            </h1>

            <p
              className="
        mt-4
        max-w-3xl mx-auto
        text-sm sm:text-base
        text-gray-600
      "
            >
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

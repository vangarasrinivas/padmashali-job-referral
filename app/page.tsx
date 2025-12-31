import React from "react";
import Navbar from "../components/Navbar";
import Jobs from "../components/Jobs";

export default function Home() {
  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Navbar */}
      <Navbar />
  
      <div className="max-w-6xl mx-auto px-4 mt-[4rem]">
        <section id="home" className="mt-4 pt-3 bg-light">
          <h1 className="md:text-3xl text-blue-400 text-xl font-bold text-center">
            Welcome to the Padmashali Job Referral Portal – explore the latest
            job opportunities and achieve success in your career.
          </h1>
        </section>
        <section id="jobs" className="mt-5">
          <div className="flex justify-center">
            <h1 className="md:text-3xl text-2xl text-red-400 font-bold border-b-3 border-red-400 inline-block pb-2">
              Latest jobs
            </h1>
          </div>
          <Jobs />
        </section>
      </div>
    </div>
  );
}

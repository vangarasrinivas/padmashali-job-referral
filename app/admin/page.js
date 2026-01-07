"use client";

import React, { useState } from 'react'
import NavbarAdmin from '@/components/NavbarAdmin'
import AdminJobs from '../../components/AdminJobs';
import BackToTop from '../../components/BackToTop';
import AdminUsers from '../../components/Users';

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState("Jobs");

  return (
    <section className="bg-gray-100 min-h-screen">
      <NavbarAdmin />
      <h1 className="text-xl text-center font-semibold py-4 text-gray-800">
        Manage {activeTab}
      </h1>

      <div
        className="
          sticky top-16 z-30
          bg-white  pt-3
          flex gap-4 border-b-2 border-gray-200
        "
      >
        <div className='max-w-6xl mx-auto w-full flex gap-4'>
          {["Jobs", "Users"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
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

      </div>

      <div className='max-w-6xl mx-auto mt-3'>


        <div>
          {
            activeTab === "Jobs" ? (
              <div>
                {/* Render Jobs Management Component */}
                <AdminJobs />
              </div>
            ) : (
              <div>
                {/* Render Users Management Component */}
                <AdminUsers />
              </div>
            )
          }
        </div>
      </div>
      {/* Back to Top */}
      <BackToTop />
    </section>
  )
}

export default AdminPage

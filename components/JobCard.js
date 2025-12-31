"use client";

import { useState } from "react";
import {
  FaBriefcase,
  FaMapMarkerAlt,
  FaRupeeSign,
  FaGraduationCap,
  FaUserTie,
  FaChevronDown,
} from "react-icons/fa";
import { formatPostedDate } from "@/lib/utils";

const JobCard = ({ job }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="w-full bg-white rounded-lg shadow-md p-5 border border-gray-200 transition-shadow hover:shadow-lg">

      {/* Title */}
      <div className="flex justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-base font-semibold text-gray-900">
            {job.title}
          </h2>
          <span className="text-xs text-gray-500 italic block mt-1">{job.jobType || 'Full-Time'}</span>
        </div>
        <div>
          {job.created_date && (
            <span className="text-xs text-gray-500 mb-2 font-serif italic">
              {formatPostedDate(job.created_date)}
            </span>
          )}
        </div>

      </div>


      <p className="text-lg font-bold text-gray-600 mt-1">
        {job.company}
      </p>

      {/* Meta */}
      <div className="flex flex-wrap gap-4 text-sm text-gray-600 mt-3">
        <div className="flex items-center gap-1">
          <FaBriefcase className="text-gray-400" />
          <span>{job.experience}</span>
        </div>

        <div className="flex items-center gap-1">
          <FaRupeeSign className="text-gray-400" />
          <span>{job.salary || "Not Disclosed"}</span>
        </div>

        <div className="flex items-center gap-1">
          <FaMapMarkerAlt className="text-gray-400" />
          <span>{job.location}</span>
        </div>
        <div className="flex items-center gap-1">
          <FaGraduationCap className="text-gray-400" />
          <span>{job.qualification}</span>
        </div>
      </div>

      {/* Education */}


      {/* Skills */}
      <div className="flex flex-wrap gap-2 mt-4">
        {["TypeScript", "Node.js", "Backend", "Fullstack", "React.js"].map(
          (skill) => (
            <span
              key={skill}
              className="bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full"
            >
              {skill}
            </span>
          )
        )}
      </div>

      {/* Expandable Description */}
      <div
        className={`
            relative overflow-hidden transition-all duration-300 ease-in-out
            ${expanded ? "max-h-96 mt-4 opacity-100" : "max-h-20 mt-3 opacity-90"}
          `}
      >
        <p className="text-sm text-gray-600 leading-relaxed">
          {job.description}
        </p>

        {/* Fade gradient when collapsed */}
        {!expanded && (
          <div className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-t from-white to-transparent" />
        )}
      </div>

      {/* Toggle */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="mt-2 flex items-center gap-1 text-sm font-medium text-[#9743e4] hover:underline"
      >
        {expanded ? "View less" : "View more"}
        <FaChevronDown
          className={`transition-transform duration-300 ${expanded ? "rotate-180" : ""
            }`}
        />
      </button>

      {/* CTA */}
      <button onClick={() => window.open(job.applyUrl)} className="mt-4 bg-[#9743e4] cursor-pointer text-white px-4 py-1.5 rounded-md text-sm hover:bg-[#7a33c9] transition">
        Apply Now
      </button>
    </div>
  );
};

export default JobCard;

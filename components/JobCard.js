"use client";

import { useState } from "react";
import {
  FaBriefcase,
  FaMapMarkerAlt,
  FaRupeeSign,
  FaGraduationCap,
  FaChevronDown,
} from "react-icons/fa";
import { formatPostedDate } from "@/lib/utils";

const JobCard = ({ job }) => {
  const [expanded, setExpanded] = useState(false);

  // ✅ Normalize & clean skills (NO empty values)
  const skills =
    Array.isArray(job?.skills)
      ? job.skills
        .map((skill) => skill?.trim())
        .filter(Boolean)
      : [];

  return (
    <div className="w-full bg-white rounded-lg shadow-md p-5 border border-gray-200 transition-shadow hover:shadow-lg">

      {/* Title */}
      <div className="flex justify-between">
        <div className="flex items-center gap-3">
          {job?.title && (
            <h2 className="text-base font-semibold text-gray-900">
              {job.title}
            </h2>
          )}

          {job?.jobType && (
            <span className="text-xs text-gray-500 italic block mt-1">
              {job.jobType}
            </span>
          )}
        </div>

        {job?.created_date && (
          <span className="text-xs text-gray-500 font-serif italic">
            {formatPostedDate(job.created_date)}
          </span>
        )}
      </div>

      {/* Company */}
      {job?.company && (
        <p className="text-lg font-bold text-gray-600 mt-1">
          {job.company}
        </p>
      )}

      {/* Meta */}
      <div className="flex flex-wrap gap-4 text-sm text-gray-600 mt-3">

        {job?.experience && (
          <div className="flex items-center gap-1">
            <FaBriefcase className="text-gray-400" />
            <span>{job.experience}</span>
          </div>
        )}

        <div className="flex items-center gap-1">
          <FaRupeeSign className="text-gray-400" />
          <span>{job?.salary?.trim() ? job.salary : "Not Disclosed"}</span>
        </div>

        {job?.location && (
          <div className="flex items-center gap-1">
            <FaMapMarkerAlt className="text-gray-400" />
            <span>{job.location}</span>
          </div>
        )}

        {job?.qualification && (
          <div className="flex items-center gap-1">
            <FaGraduationCap className="text-gray-400" />
            <span>{job.qualification}</span>
          </div>
        )}
      </div>

      {/* Skills */}
      {skills.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-4">
          {skills.map((skill, index) => (
            <span
              key={index}
              className="bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full"
            >
              {skill}
            </span>
          ))}
        </div>
      )}

      {/* Description */}
      {job?.description && (
        <div
          className={`relative overflow-hidden transition-all duration-300 ease-in-out
            ${expanded ? "max-h-96 mt-4 opacity-100" : "max-h-16 mt-3 opacity-90"}`}
        >
          <div
            className="text-sm text-gray-600 leading-relaxed
              [&_ul]:list-disc [&_ul]:pl-5
              [&_ol]:list-decimal [&_ol]:pl-5"
            dangerouslySetInnerHTML={{ __html: job.description }}
          />

          {!expanded && (
            <div className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-t from-white to-transparent" />
          )}
        </div>
      )}

      {/* Toggle */}
      {job?.description && (
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
      )}

      {/* CTA */}
      {job?.applyUrl && (
        <button
          onClick={() => window.open(job.applyUrl, "_blank")}
          className="mt-4 bg-[#9743e4] cursor-pointer text-white px-4 py-1.5 rounded-md text-sm hover:bg-[#7a33c9] transition"
        >
          Apply Now
        </button>
      )}
    </div>
  );
};

export default JobCard;

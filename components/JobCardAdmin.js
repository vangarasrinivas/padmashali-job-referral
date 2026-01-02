"use client";

import { useState } from "react";
import {
    FaBriefcase,
    FaMapMarkerAlt,
    FaRupeeSign,
    FaGraduationCap,
    FaUserTie,
    FaChevronDown,
    FaEdit,
    FaTrash,
} from "react-icons/fa";
import { formatPostedDate } from "@/lib/utils";

export default function JobCardAdmin({ job, onEdit, onDelete }) {
    const [expanded, setExpanded] = useState(false);

    return (
        <div className="w-full bg-white rounded-lg shadow-md p-5 border border-gray-200 hover:shadow-lg transition">

            {/* Header */}
            <div className="flex justify-between items-start">
                {/* Left */}
                <div>
                    <div className="flex items-center gap-3">
                        <h2 className="text-base font-semibold text-gray-900">
                            {job.title}
                        </h2>
                        <span className="text-xs text-gray-500 italic block mt-1">{job.jobType || 'Full-Time'}</span>
                    </div>

                    <p className="text-lg font-bold text-gray-600 mt-1">
                        {job.company}
                    </p>
                </div>

                {/* Right */}
                <div className="flex flex-col items-end gap-1">
                    {/* Posted Date */}
                    {job.created_date && (
                        <span className="text-xs text-gray-500 mb-2 font-serif">
                            {formatPostedDate(job.created_date)}
                        </span>
                    )}

                    {/* Admin Actions */}
                    <div className="flex gap-3">
                        <FaEdit
                            className="text-blue-500 cursor-pointer hover:scale-110 transition"
                            title="Edit Job"
                            onClick={() => onEdit(job)}
                        />
                        <FaTrash
                            className="text-red-500 cursor-pointer hover:scale-110 transition"
                            title="Delete Job"
                            onClick={() => onDelete(job.id)}
                        />
                    </div>
                </div>
            </div>

            {/* Meta */}
            <div className="flex flex-wrap gap-4 text-sm text-gray-600 mt-3">
                {job.experience && (
                    <div className="flex items-center gap-1">
                        <FaBriefcase className="text-gray-400" />
                        <span>{job.experience}</span>
                    </div>
                )}

                {job.salary && (
                    <div className="flex items-center gap-1">
                        <FaRupeeSign className="text-gray-400" />
                        <span>{job.salary}</span>
                    </div>
                )}

                {job.location && (
                    <div className="flex items-center gap-1">
                        <FaMapMarkerAlt className="text-gray-400" />
                        <span>{job.location}</span>
                    </div>
                )}

                {job.qualification && (
                    <div className="flex items-center gap-1">
                        <FaGraduationCap className="text-gray-400" />
                        <span>{job.qualification}</span>
                    </div>
                )}
            </div>

            {/* Preferred Profile */}
            {job.preferredProfile && (
                <div className="flex items-start gap-2 text-sm text-gray-700 mt-3">
                    <FaUserTie className="text-gray-400 mt-1" />
                    <p>
                        <span className="font-medium">Preferred profile:</span>{" "}
                        {job.preferredProfile}
                    </p>
                </div>
            )}

            {/* Skills */}
            {/* Skills */}
            {Array.isArray(job.skills) &&
                job.skills
                    .filter(
                        (skill) =>
                            typeof skill === "string" && skill.trim().length > 0
                    )
                    .length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4">
                        {job.skills
                            .filter(
                                (skill) =>
                                    typeof skill === "string" && skill.trim().length > 0
                            )
                            .map((skill, index) => (
                                <span
                                    key={`${skill}-${index}`}
                                    className="bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full"
                                >
                                    {skill.trim()}
                                </span>
                            ))}
                    </div>
                )}




            {/* Description */}
            {job.description && (
                <>
                    <div
                        className={`
              relative overflow-hidden transition-all duration-300
              ${expanded ? "max-h-96 mt-4" : "max-h-15 mt-3"}
            `}
                    >
                        <div
                            className="text-sm text-gray-600 leading-relaxed [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5"
                            dangerouslySetInnerHTML={{ __html: job.description }}
                        />

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
                </>
            )}
        </div>
    );
}

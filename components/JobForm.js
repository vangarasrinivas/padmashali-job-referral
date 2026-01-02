"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const JobDescriptionEditor = dynamic(() => import("./JobDescriptionEditor"), { ssr: false });

const inputClass =
  "w-full bg-gray-50 border border-gray-300 rounded-md px-3 py-2 text-sm " +
  "focus:outline-none focus:ring-2 focus:ring-[#9743e4]/40 focus:border-[#9743e4] transition";

const labelClass = "mb-1 text-sm font-medium text-gray-600";

const JobForm = ({ initialData, onSubmit, loading }) => {
  const [form, setForm] = useState({
    title: "",
    company: "",
    qualification: "",
    experience: "",
    location: "",
    salary: "",
    skills: "",
    jobType: "Full Time",
    jobCategory: "Private",
    applyUrl: "",
    description: "",
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        title: initialData.title || "",
        company: initialData.company || "",
        experience: initialData.experience || "",
        qualification: initialData.qualification || "",
        location: initialData.location || "",
        salary: initialData.salary || "",
        skills: (initialData.skills || []).join(", "),
        jobType: initialData.jobType || "Full Time",
        jobCategory: initialData.jobCategory || "Private",
        applyUrl: initialData.applyUrl || "",
        description: initialData.description || "",
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleDescriptionChange = (value) => {
    setForm({ ...form, description: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    onSubmit({
      ...form,
      skills: form.skills.split(",").map((s) => s.trim()),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Job Title */}
        <div className="flex flex-col">
          <label className={labelClass}>Job Title</label>
          <input name="title" value={form.title} onChange={handleChange} className={inputClass} required />
        </div>

        {/* Company */}
        <div className="flex flex-col">
          <label className={labelClass}>Company</label>
          <input name="company" value={form.company} onChange={handleChange} className={inputClass} required />
        </div>

        {/* Location */}
        <div className="flex flex-col">
          <label className={labelClass}>Location</label>
          <input name="location" value={form.location} onChange={handleChange} className={inputClass} />
        </div>

        {/* Job Type */}
        <div className="flex flex-col">
          <label className={labelClass}>Job Type</label>
          <select name="jobType" value={form.jobType} onChange={handleChange} className={inputClass}>
            <option>Full Time</option>
            <option>Part Time</option>
            <option>Internship</option>
            <option>Contract</option>
            <option>Other</option>
          </select>
        </div>

        {/* Job Category */}
        <div className="flex flex-col">
          <label className={labelClass}>Job Category</label>
          <select name="jobCategory" value={form.jobCategory} onChange={handleChange} className={inputClass}>
            <option>Private</option>
            <option>Government</option>
          </select>
        </div>

        {/* Experience */}
        <div className="flex flex-col">
          <label className={labelClass}>Experience</label>
          <input name="experience" value={form.experience} onChange={handleChange} className={inputClass} />
        </div>

        {/* Qualification */}
        <div className="flex flex-col">
          <label className={labelClass}>Qualification</label>
          <input name="qualification" value={form.qualification} onChange={handleChange} className={inputClass} />
        </div>

        {/* Salary */}
        <div className="flex flex-col">
          <label className={labelClass}>Salary</label>
          <input name="salary" value={form.salary} onChange={handleChange} className={inputClass} />
        </div>

        {/* Apply URL */}
        <div className="flex flex-col">
          <label className={labelClass}>Apply URL</label>
          <input
            name="applyUrl"
            value={form.applyUrl}
            onChange={handleChange}
            className={inputClass}
            placeholder="https://company.com/careers"
          />
        </div>

        {/* Skills */}
        <div className="flex flex-col lg:col-span-3">
          <label className={labelClass}>Skills</label>
          <textarea
            name="skills"
            value={form.skills}
            onChange={handleChange}
            className={`${inputClass} resize-none`}
            rows={2}
            placeholder="Node.js, React, TypeScript"
          />
        </div>

        {/* Job Description */}
        <div className="flex flex-col lg:col-span-3">
          <label className={labelClass}>Job Description</label>
          <JobDescriptionEditor content={form.description} onChange={handleDescriptionChange} />
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="bg-[#9743e4] text-white px-6 py-2 rounded-md text-sm
                     hover:bg-[#7a33c9] transition disabled:opacity-60"
        >
          {loading ? "Saving..." : "Save Job"}
        </button>
      </div>
    </form>
  );
};

export default JobForm;

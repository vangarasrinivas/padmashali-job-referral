"use client";

import Link from "next/link";
import { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";


export default function SignupForm({
  form,
  errors,
  loading,
  handleChange,
  handleSubmit,
  emailSent, // new prop to show after signup
  handleResumeUpload,
  setForm,
}) {
  const inputStyle =
    "w-full px-3 py-2.5 text-sm rounded-md bg-gray-50 ring-1 ring-gray-200 outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white";

  const labelStyle =
    "block text-sm font-medium text-gray-700 mb-1";

  const errorText = "text-xs text-red-600 mt-1";

  const requiredStar = <span className="text-red-500">*</span>;

  const grid4 = "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5";
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);


  if (emailSent) {
    // Show after signup success
    return (
      <div className="max-w-md mx-auto text-center bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">
          Verify Your Email
        </h2>
        <p className="mb-4">
          We have sent a verification link to <strong>{form.email}</strong>.
          Please check your inbox and spam folders and click the link to activate your account.
        </p>
        <p className="text-sm">
          After verification, you can{" "}
          <Link
            href="/login"
            className="text-purple-600 font-medium hover:underline"
          >
            login here
          </Link>.
        </p>
      </div>
    );
  }

  return (
    <>
      <h2 className="text-3xl font-bold text-center mb-5">
        Create Account
      </h2>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className={grid4}>
          {/* Full Name */}
          <div>
            <label className={labelStyle}>
              Full Name {requiredStar}
            </label>
            <input
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              className={inputStyle}
            />
            {errors.fullName && (
              <p className={errorText}>{errors.fullName}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className={labelStyle}>
              Email {requiredStar}
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className={inputStyle}
            />
            {errors.email && (
              <p className={errorText}>{errors.email}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className={labelStyle}>
              Phone Number {requiredStar}
            </label>
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className={inputStyle}
            />
            {errors.phone && (
              <p className={errorText}>{errors.phone}</p>
            )}
          </div>

          {/* Location */}
          <div>
            <label className={labelStyle}>Location</label>
            <input
              name="location"
              value={form.location}
              onChange={handleChange}
              className={inputStyle}
            />
          </div>

          {/* Qualification */}
          <div>
            <label className={labelStyle}>Qualification</label>
            <input
              name="qualification"
              value={form.qualification}
              onChange={handleChange}
              className={inputStyle}
            />
          </div>

          {/* Profile Type */}
          <div>
            <label className={labelStyle}>Profile Type</label>
            <select
              name="careerType"
              value={form.careerType}
              onChange={handleChange}
              className={inputStyle}
            >
              <option value="working">Working</option>
              <option value="fresher">Fresher</option>
              <option value="student">Student</option>
            </select>
          </div>

          {/* STUDENT */}
          {form.careerType === "student" && (
            <>
              <div>
                <label className={labelStyle}>College Name</label>
                <input
                  name="college"
                  value={form.college}
                  onChange={handleChange}
                  className={inputStyle}
                />
              </div>

              <div>
                <label className={labelStyle}>Branch</label>
                <input
                  name="branch"
                  value={form.branch}
                  onChange={handleChange}
                  className={inputStyle}
                />
              </div>
            </>
          )}

          {/* FRESHER */}
          {form.careerType === "fresher" && (
            <>
              <div>
                <label className={labelStyle}>College Name</label>
                <input
                  name="college"
                  value={form.college}
                  onChange={handleChange}
                  className={inputStyle}
                />
              </div>

              <div>
                <label className={labelStyle}>Skills</label>
                <textarea
                  name="skills"
                  value={form.skills}
                  onChange={handleChange}
                  className={inputStyle}
                />
              </div>
            </>
          )}

          {/* WORKING */}
          {form.careerType === "working" && (
            <>
              <div>
                <label className={labelStyle}>Years of Experience</label>
                <input
                  name="experienceYears"
                  value={form.experienceYears}
                  onChange={handleChange}
                  className={inputStyle}
                />
              </div>

              <div>
                <label className={labelStyle}>Current Company</label>
                <input
                  name="company"
                  value={form.company}
                  onChange={handleChange}
                  className={inputStyle}
                />
              </div>

              <div>
                <label className={labelStyle}>Work Location</label>
                <input
                  name="workinglocation"
                  value={form.workinglocation}
                  onChange={handleChange}
                  className={inputStyle}
                />
              </div>

              <div>
                <label className={labelStyle}>Working Skills / Summary</label>
                <textarea
                  name="skills"
                  value={form.skills}
                  onChange={handleChange}
                  className={inputStyle}
                />
              </div>
            </>
          )}

          <div className="">
            <label className={labelStyle}>Upload Resume (PDF/DOC, max 1MB)</label>

            {/* File input styled as a text input with icon */}
            <div className="mt-2 relative">
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleResumeUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="flex items-center justify-between border border-gray-300 rounded-md bg-white px-3 py-2 text-gray-700 cursor-pointer hover:border-purple-500 transition">
                <span>
                  {form.resumeName ? form.resumeName : "Choose a file..."}
                </span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M12 12v8m0 0l-3-3m3 3l3-3M12 4v8"
                  />
                </svg>
              </div>
            </div>

            {/* Show uploaded file with delete option */}
            {form.resume && (
              <div className="mt-3 flex items-center justify-between bg-gray-100 p-2 rounded-md border border-gray-300">
                <a
                  href={form.resume}
                  download={form.resumeName}
                  className="text-gray-800 hover:text-purple-600 underline truncate max-w-xs"
                >
                  {form.resumeName}
                </a>
                <button
                  type="button"
                  onClick={() => setForm({ ...form, resume: "", resumeName: "" })}
                  className="ml-3 px-2 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition"
                >
                  Delete
                </button>
              </div>
            )}
          </div>

          {/* Password */}
          <div>
            <label className={labelStyle}>
              Password {requiredStar}
            </label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                className={`${inputStyle} pr-10`}
              />

              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </button>
            </div>

            {errors.password && (
              <p className={errorText}>{errors.password}</p>
            )}
          </div>
          {/* Confirm Password */}
          <div>
            <label className={labelStyle}>
              Confirm Password {requiredStar}
            </label>

            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                className={`${inputStyle} pr-10`}
              />

              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                aria-label="Toggle confirm password visibility"
              >
                {showConfirmPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </button>
            </div>

            {errors.confirmPassword && (
              <p className={errorText}>{errors.confirmPassword}</p>
            )}
          </div>

        </div>

        {/* SUBMIT BUTTON */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-purple-600 text-white py-3 rounded-lg text-lg font-semibold hover:bg-purple-700 disabled:opacity-60"
        >
          {loading ? "Creating Account..." : "Sign Up"}
        </button>
      </form>

      <p className="text-center text-sm mt-6">
        Already have an account?{" "}
        <Link
          href="/login"
          className="text-purple-600 font-medium hover:underline"
        >
          Login here
        </Link>
      </p>
    </>
  );
}

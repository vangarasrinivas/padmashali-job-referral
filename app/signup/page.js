"use client";

import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import ToastAlert from "@/components/ToastAlert";
import NavbarUsers from "../../components/NavbarUsers";
import Link from "next/link";

export default function SignupPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    qualification: "",
    location: "",
    careerType: "working",

    college: "",
    branch: "",
    skills: "",

    experienceYears: "",
    company: "",
    workinglocation: "",

    password: "",
    confirmPassword: "",
  });

  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const showAlert = (type, message) =>
    setAlert({ type, message });

  const handleSubmit = async (e) => {
    e.preventDefault();

    /** REQUIRED FIELD VALIDATION */
    if (!form.fullName || !form.email || !form.phone) {
      showAlert("error", "Full Name, Email and Phone Number are required");
      return;
    }
    if (!form.password) {
      showAlert("error", "Password is required");
      return;
    }
    if (!form.confirmPassword) {
      showAlert("error", "Confirm password is required");
      return;
    }

    if (form.password !== form.confirmPassword) {
      showAlert("error", "Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      const res = await createUserWithEmailAndPassword(
        auth,
        form.email,
        form.password
      );

      await setDoc(doc(db, "users", res.user.uid), {
        uid: res.user.uid,
        fullName: form.fullName,
        email: form.email,
        phone: form.phone,
        location: form.location || "",
        qualification: form.qualification,
        careerType: form.careerType,

        college: form.college || "",
        branch: form.branch || "",
        skills: form.skills,

        experienceYears: form.experienceYears || "",
        company: form.company || "",
        workinglocation: form.workinglocation || "",


        role: "user",
        createdAt: serverTimestamp(),
      });

      showAlert("success", "Account created successfully!");
      setTimeout(() => router.push("/login"), 1200);
    } catch (err) {
      showAlert("error", err.message.replace("Firebase:", ""));
    } finally {
      setLoading(false);
    }
  };

  const inputStyle =
    "w-full px-3 py-2.5 text-sm rounded-md bg-gray-50 ring-1 ring-gray-200 outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white";

  const labelStyle = "block text-sm font-medium text-gray-700 mb-1";

  const grid4 =
    "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5";

  return (
    <section className="min-h-screen bg-gary-100">
      <NavbarUsers />
      <div className="max-w-6xl mx-auto px-4 py-12">
        {alert && (
          <ToastAlert
            type={alert.type}
            message={alert.message}
            onClose={() => setAlert(null)}
          />
        )}

        <h2 className="text-3xl font-bold text-center mb-10">
          Create Account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-8">

          {/* BASIC DETAILS */}
          <div className={grid4}>
            <div>
              <label className={labelStyle}>Full Name</label>
              <input
                name="fullName"
                onChange={handleChange}
                className={inputStyle}

              />
            </div>

            <div>
              <label className={labelStyle}>Email</label>
              <input
                name="email"
                type="email"
                onChange={handleChange}
                className={inputStyle}

              />
            </div>

            <div>
              <label className={labelStyle}>Phone Number</label>
              <input
                name="phone"
                onChange={handleChange}
                className={inputStyle}
              />
            </div>

            <div>
              <label className={labelStyle}>Location</label>
              <input
                name="location"
                value={form.location}
                onChange={handleChange}
                className={inputStyle}
              />
            </div>

            <div>
              <label className={labelStyle}>Qualification</label>
              <input
                name="qualification"
                onChange={handleChange}
                className={inputStyle}
              />
            </div>

            <div>
              <label className={labelStyle}>Profile Type</label>
              <select
                name="careerType"
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
              <div>
                <label className={labelStyle}>College Name</label>
                <input
                  name="college"
                  value={form.college}
                  onChange={handleChange}
                  className={inputStyle}
                />
              </div>
            )}

            {form.careerType === "student" && (
              <div>
                <label className={labelStyle}>Branch</label>
                <input
                  name="branch"
                  value={form.branch}
                  onChange={handleChange}
                  className={inputStyle}
                />
              </div>
            )}

            {/* FRESHER */}

            {form.careerType === "fresher" && (
              <div>
                <label className={labelStyle}>College Name</label>
                <input
                  name="college"
                  value={form.college}
                  onChange={handleChange}
                  className={inputStyle}
                />
              </div>
            )}

            {form.careerType === "fresher" && (
              <div>
                <label className={labelStyle}>Skills</label>
                <textarea
                  name="skills"
                  value={form.skills}
                  onChange={handleChange}
                  className={inputStyle}
                />
              </div>
            )}

            {/* WORKING */}

            {form.careerType === "working" && (
              <div>
                <label className={labelStyle}>Years of Experience</label>
                <input
                  name="experienceYears"
                  value={form.experienceYears}
                  onChange={handleChange}
                  className={inputStyle}
                />
              </div>
            )}

            {form.careerType === "working" && (
              <div>
                <label className={labelStyle}>Current Company</label>
                <input
                  name="company"
                  value={form.company}
                  onChange={handleChange}
                  className={inputStyle}
                />
              </div>
            )}

            {form.careerType === "working" && (
              <div>
                <label className={labelStyle}>Work Location</label>
                <input
                  name="workinglocation"
                  value={form.workinglocation}
                  onChange={handleChange}
                  className={inputStyle}
                />
              </div>
            )}

            {form.careerType === "working" && (
              <div>
                <label className={labelStyle}>Working Skills/Summary</label>
                <textarea
                  name="skills"
                  value={form.skills}
                  onChange={handleChange}
                  className={inputStyle}
                />
              </div>
            )}

            <div>
              <label className={labelStyle}>Password</label>
              <input
                type="password"
                name="password"
                onChange={handleChange}
                className={inputStyle}

              />
            </div>

            <div>
              <label className={labelStyle}>Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                onChange={handleChange}
                className={inputStyle}

              />
            </div>


          </div>



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
      </div>
    </section>
  );
}

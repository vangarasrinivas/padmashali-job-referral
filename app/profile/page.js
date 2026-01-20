"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import ToastAlert from "@/components/ToastAlert";
import NavbarProfile from "@/components/NavbarProfile";

export default function ProfilePage() {
    const router = useRouter();

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [alert, setAlert] = useState(null);

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
        resume: "",       // Base64 content
        resumeName: "",   // File name
    });

    const showAlert = (type, message) => setAlert({ type, message });
    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    // AUTH CHECK
    useEffect(() => {
        const unsub = onAuthStateChanged(auth, async (currentUser) => {
            if (!currentUser) {
                router.push("/login");
                return;
            }

            setUser(currentUser);

            const snap = await getDoc(doc(db, "users", currentUser.uid));
            if (snap.exists()) {
                const data = snap.data();
                setForm({
                    fullName: data.fullName || "",
                    email: data.email || currentUser.email,
                    phone: data.phone || "",
                    qualification: data.qualification || "",
                    location: data.location || "",
                    careerType: data.careerType || "working",
                    college: data.college || "",
                    branch: data.branch || "",
                    skills: data.skills || "",
                    experienceYears: data.experienceYears || "",
                    company: data.company || "",
                    workinglocation: data.workinglocation || "",
                    resume: data.resume || "",
                    resumeName: data.resumeName || "",
                });
            }

            setLoading(false);
        });

        return () => unsub();
    }, [router]);

    // HANDLE RESUME FILE
    const handleResumeUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.size > 1024 * 1024) { // 1MB limit
            showAlert("error", "File size must be less than 1MB");
            return;
        }

        const reader = new FileReader();
        reader.onload = () => {
            setForm({
                ...form,
                resume: reader.result,
                resumeName: file.name,
            });
        };
        reader.readAsDataURL(file);
    };

    // UPDATE PROFILE
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.fullName || !form.phone) {
            showAlert("error", "Full Name and Phone are required");
            return;
        }

        try {
            setSaving(true);

            await updateDoc(doc(db, "users", user.uid), {
                fullName: form.fullName,
                phone: form.phone,
                location: form.location || "",
                qualification: form.qualification || "",
                careerType: form.careerType,
                college: form.college || "",
                branch: form.branch || "",
                skills: form.skills,
                experienceYears: form.experienceYears || "",
                company: form.company || "",
                workinglocation: form.workinglocation || "",
                resume: form.resume || "",
                resumeName: form.resumeName || "",
            });

            showAlert("success", "Profile updated successfully");
        } catch (err) {
            showAlert("error", err.message);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return null;

    const inputStyle =
        "w-full px-3 py-2.5 text-sm rounded-md bg-gray-50 ring-1 ring-gray-200 outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white";

    const disabledStyle =
        "w-full px-3 py-2.5 text-sm rounded-md bg-gray-100 ring-1 ring-gray-200 text-gray-500 cursor-not-allowed";

    const labelStyle = "block text-sm font-medium text-gray-700 mb-1";
    const grid4 = "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5";

    return (
        <section className="min-h-screen bg-gray-100">
            <NavbarProfile />

            <div className="max-w-6xl mx-auto px-4 py-12 mt-10">
                {alert && (
                    <ToastAlert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />
                )}

                <h2 className="text-3xl font-bold text-center mb-10">Your Profile</h2>


                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className={grid4}>
                        {/* FULL NAME */}
                        <div>
                            <label className={labelStyle}>Full Name</label>
                            <input name="fullName" value={form.fullName} onChange={handleChange} className={inputStyle} />
                        </div>

                        {/* EMAIL - READ ONLY */}
                        <div>
                            <label className={labelStyle}>Email</label>
                            <input value={form.email} disabled className={disabledStyle} />
                        </div>

                        {/* PHONE */}
                        <div>
                            <label className={labelStyle}>Phone Number</label>
                            <input name="phone" value={form.phone} onChange={handleChange} className={inputStyle} />
                        </div>

                        {/* LOCATION */}
                        <div>
                            <label className={labelStyle}>Location</label>
                            <input name="location" value={form.location} onChange={handleChange} className={inputStyle} />
                        </div>

                        {/* QUALIFICATION */}
                        <div>
                            <label className={labelStyle}>Qualification</label>
                            <input name="qualification" value={form.qualification} onChange={handleChange} className={inputStyle} />
                        </div>

                        {/* PROFILE TYPE */}
                        <div>
                            <label className={labelStyle}>Profile Type</label>
                            <select name="careerType" value={form.careerType} onChange={handleChange} className={inputStyle}>
                                <option value="working">Working</option>
                                <option value="fresher">Fresher</option>
                                <option value="student">Student</option>
                            </select>
                        </div>


                        {/* STUDENT / FRESHER / WORKING sections */}
                        {(form.careerType === "student" || form.careerType === "fresher") && (
                            <div>
                                <label className={labelStyle}>College Name</label>
                                <input name="college" value={form.college} onChange={handleChange} className={inputStyle} />
                            </div>
                        )}

                        {form.careerType === "student" && (
                            <div>
                                <label className={labelStyle}>Branch</label>
                                <input name="branch" value={form.branch} onChange={handleChange} className={inputStyle} />
                            </div>
                        )}

                        {form.careerType === "fresher" && (
                            <div>
                                <label className={labelStyle}>Skills/Summary</label>
                                <textarea name="skills" value={form.skills} onChange={handleChange} className={inputStyle} />
                            </div>
                        )}

                        {form.careerType === "working" && (
                            <>
                                <div>
                                    <label className={labelStyle}>Years of Experience</label>
                                    <input name="experienceYears" value={form.experienceYears} onChange={handleChange} className={inputStyle} />
                                </div>

                                <div>
                                    <label className={labelStyle}>Current Company</label>
                                    <input name="company" value={form.company} onChange={handleChange} className={inputStyle} />
                                </div>

                                <div>
                                    <label className={labelStyle}>Work Location</label>
                                    <input name="workinglocation" value={form.workinglocation} onChange={handleChange} className={inputStyle} />
                                </div>

                                <div>
                                    <label className={labelStyle}>Working Skills / Summary</label>
                                    <textarea name="skills" value={form.skills} onChange={handleChange} className={inputStyle} />
                                </div>
                                {/* RESUME UPLOAD */}
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


                            </>
                        )}


                    </div>

                    <button
                        type="submit"
                        disabled={saving}
                        className="w-full bg-purple-600 text-white py-3 rounded-lg text-lg font-semibold hover:bg-purple-700 disabled:opacity-60"
                    >
                        {saving ? "Updating..." : "Update Profile"}
                    </button>
                </form>
            </div>
        </section>
    );
}

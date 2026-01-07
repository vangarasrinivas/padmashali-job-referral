"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import ToastAlert from "@/components/ToastAlert";

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
        careerType: "experienced",

        college: "",
        branch: "",
        skills: "",

        experienceYears: "",
        company: "",
        workinglocation: "",
    });

    const showAlert = (type, message) =>
        setAlert({ type, message });

    const handleChange = (e) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    /* ---------------- AUTH CHECK ---------------- */
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
                    careerType: data.careerType || "experienced",

                    college: data.college || "",
                    branch: data.branch || "",
                    skills: data.skills || "",

                    experienceYears: data.experienceYears || "",
                    company: data.company || "",
                    workinglocation: data.workinglocation || "",
                });
            }

            setLoading(false);
        });

        return () => unsub();
    }, [router]);

    /* ---------------- UPDATE PROFILE ---------------- */
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

    const labelStyle =
        "block text-sm font-medium text-gray-700 mb-1";

    const grid4 =
        "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5";

    return (
        <section className="min-h-screen bg-gray-100">
            <Navbar />

            <div className="max-w-6xl mx-auto px-4 py-12 mt-10">
                {alert && (
                    <ToastAlert
                        type={alert.type}
                        message={alert.message}
                        onClose={() => setAlert(null)}
                    />
                )}

                <h2 className="text-3xl font-bold text-center mb-10">
                    Your Profile
                </h2>

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className={grid4}>
                        {/* FULL NAME */}
                        <div>
                            <label className={labelStyle}>Full Name</label>
                            <input
                                name="fullName"
                                value={form.fullName}
                                onChange={handleChange}
                                className={inputStyle}
                            />
                        </div>

                        {/* EMAIL - READ ONLY */}
                        <div>
                            <label className={labelStyle}>Email</label>
                            <input
                                value={form.email}
                                disabled
                                className={disabledStyle}
                            />
                        </div>

                        {/* PHONE */}
                        <div>
                            <label className={labelStyle}>Phone Number</label>
                            <input
                                name="phone"
                                value={form.phone}
                                onChange={handleChange}
                                className={inputStyle}
                            />
                        </div>

                        {/* LOCATION */}
                        <div>
                            <label className={labelStyle}>Location</label>
                            <input
                                name="location"
                                value={form.location}
                                onChange={handleChange}
                                className={inputStyle}
                            />
                        </div>

                        {/* QUALIFICATION */}
                        <div>
                            <label className={labelStyle}>Qualification</label>
                            <input
                                name="qualification"
                                value={form.qualification}
                                onChange={handleChange}
                                className={inputStyle}
                            />
                        </div>

                        {/* PROFILE TYPE */}
                        <div>
                            <label className={labelStyle}>Profile Type</label>
                            <select
                                name="careerType"
                                value={form.careerType}
                                onChange={handleChange}
                                className={inputStyle}
                            >
                                <option value="experienced">Experienced</option>
                                <option value="fresher">Fresher</option>
                                <option value="student">Student</option>
                            </select>
                        </div>

                        {/* STUDENT */}
                        {(form.careerType === "student" ||
                            form.careerType === "fresher") && (
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
                                <label className={labelStyle}>Skills/Summary</label>
                                <textarea
                                    name="skills"
                                    value={form.skills}
                                    onChange={handleChange}
                                    className={inputStyle}
                                />
                            </div>
                        )}

                        {/* EXPERIENCED */}
                        {form.careerType === "experienced" && (
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

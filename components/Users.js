"use client";

import { useEffect, useState } from "react";
import {
    collection,
    getDocs,
    doc,
    deleteDoc,
    updateDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { FaDownload, FaEdit, FaTrash } from "react-icons/fa";

export default function AdminUsersPage() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const [editUserId, setEditUserId] = useState(null);
    const [form, setForm] = useState({});

    /* ================= FETCH USERS ================= */
    const fetchUsers = async () => {
        const snap = await getDocs(collection(db, "users"));
        setUsers(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
        setLoading(false);
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    /* ================= DELETE USER ================= */
    const deleteUser = async (id) => {
        if (!confirm("Delete this user?")) return;
        await deleteDoc(doc(db, "users", id));
        setUsers(users.filter((u) => u.id !== id));
    };

    /* ================= EDIT ================= */
    const openEdit = (user) => {
        setEditUserId(user.id);
        setForm(user);
    };

    const updateUser = async () => {
        await updateDoc(doc(db, "users", editUserId), {
            fullName: form.fullName,
            phone: form.phone,
            location: form.location,
            qualification: form.qualification,
            careerType: form.careerType,

            college: form.college || "",
            branch: form.branch || "",
            skills: form.skills || "",

            experienceYears: form.experienceYears || "",
            company: form.company || "",
            workinglocation: form.workinglocation || "",
        });

        setEditUserId(null);
        fetchUsers();
    };

    if (loading) return <p className="p-6">Loading users...</p>;

    return (
        <div className="mx-auto">

            {/* ================= TABLE ================= */}
            <div className="overflow-x-auto bg-white rounded-xl shadow-md">
                <table className="w-full text-sm text-left border-collapse">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-4 py-3 font-medium text-gray-700">Name</th>
                            <th className="px-4 py-3 font-medium text-gray-700">Email</th>
                            <th className="px-4 py-3 font-medium text-gray-700">Phone</th>
                            <th className="px-4 py-3 font-medium text-gray-700">Location</th>
                            <th className="px-4 py-3 font-medium text-gray-700">Career</th>
                            <th className="px-4 py-3 font-medium text-gray-700">Resume</th>
                            <th className="px-4 py-3 font-medium text-gray-700 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {users.length > 0 ? (
                            users.map((u) => (
                                <tr
                                    key={u.id}
                                    className="hover:bg-gray-50 transition-colors duration-200"
                                >
                                    <td className="px-4 py-3 font-medium text-gray-800">{u.fullName}</td>
                                    <td className="px-4 py-3 text-gray-600">{u.email}</td>
                                    <td className="px-4 py-3 text-gray-600">{u.phone}</td>
                                    <td className="px-4 py-3 text-gray-600">{u.location}</td>
                                    <td className="px-4 py-3 text-gray-600 capitalize">{u.careerType}</td>
                                    {/* Resume Column */}
                                    <td className="px-4 py-3 text-gray-600">
                                        {u.resume ? (
                                            <a
                                                href={u.resume}
                                                download={u.resumeName || "resume"}
                                                className="flex items-center justify-center gap-2 text-purple-600 hover:text-purple-800"
                                                title="Download Resume"
                                            >
                                                {u.resumeName || "resume"}<FaDownload size={18} />
                                            </a>
                                        ) : (
                                            <span className="text-gray-400 italic">No resume</span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3 flex justify-center gap-4">
                                        <button
                                            onClick={() => openEdit(u)}
                                            className="text-blue-600 hover:text-blue-800 transition-colors"
                                        >
                                            <FaEdit size={16} />
                                        </button>
                                        <button
                                            onClick={() => deleteUser(u.id)}
                                            className="text-red-600 hover:text-red-800 transition-colors"
                                        >
                                            <FaTrash size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={6} className="text-center py-6 text-gray-500">
                                    No users found.
                                </td>
                            </tr>
                        )}
                    </tbody>

                </table>
            </div>


            {/* ================= EDIT MODAL ================= */}
            {editUserId && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white w-full max-w-4xl rounded-2xl shadow-xl p-6 max-h-[90vh] overflow-y-auto">
                        <h2 className="text-2xl font-semibold mb-6">Edit User</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input label="Full Name" value={form.fullName} onChange={(v) => setForm({ ...form, fullName: v })} />
                            <Input label="Email" value={form.email} disabled />
                            <Input label="Phone" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} />
                            <Input label="Location" value={form.location} onChange={(v) => setForm({ ...form, location: v })} />
                            <Input label="Qualification" value={form.qualification} onChange={(v) => setForm({ ...form, qualification: v })} />

                            <div className="mb-4">
                                <label className={labelStyle}>Profile Type</label>
                                <select
                                    value={form.careerType}
                                    onChange={(e) => setForm({ ...form, careerType: e.target.value })}
                                    className={inputStyle} // <-- uses same style as input
                                >
                                    <option value="working">Working</option>
                                    <option value="fresher">Fresher</option>
                                    <option value="student">Student</option>
                                </select>
                            </div>


                            {/* STUDENT */}
                            {form.careerType === "student" && (
                                <>
                                    <Input label="College" value={form.college} onChange={(v) => setForm({ ...form, college: v })} />
                                    <Input label="Branch" value={form.branch} onChange={(v) => setForm({ ...form, branch: v })} />
                                </>
                            )}

                            {/* FRESHER */}
                            {form.careerType === "fresher" && (
                                <>
                                    <Input label="College" value={form.college} onChange={(v) => setForm({ ...form, college: v })} />
                                    <Textarea label="Skills" value={form.skills} onChange={(v) => setForm({ ...form, skills: v })} />
                                </>
                            )}

                            {/* WORKING */}
                            {form.careerType === "working" && (
                                <>
                                    <Input label="Experience Years" value={form.experienceYears} onChange={(v) => setForm({ ...form, experienceYears: v })} />
                                    <Input label="Company" value={form.company} onChange={(v) => setForm({ ...form, company: v })} />
                                    <Input label="Work Location" value={form.workinglocation} onChange={(v) => setForm({ ...form, workinglocation: v })} />
                                    <Textarea label="Working Skills / Summary" value={form.skills} onChange={(v) => setForm({ ...form, skills: v })} />
                                </>
                            )}
                        </div>

                        <div className="flex justify-end gap-3 mt-8">
                            <button
                                onClick={() => setEditUserId(null)}
                                className="px-5 py-2 border rounded-lg"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={updateUser}
                                className="px-5 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                            >
                                Update User
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

/* ================= HELPERS ================= */
const inputStyle =
    "w-full px-3 py-2.5 text-sm rounded-md bg-gray-50 ring-1 ring-gray-200 outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white";

const labelStyle = "block text-sm font-medium text-gray-700 mb-1";

export const Input = ({ label, value, onChange, disabled }) => (
    <div className="mb-4">
        <label className={labelStyle}>{label}</label>
        <input
            value={value || ""}
            disabled={disabled}
            onChange={(e) => onChange?.(e.target.value)}
            className={`${inputStyle} ${disabled ? "bg-gray-100 cursor-not-allowed" : ""}`}
        />
    </div>
);

export const Textarea = ({ label, value, onChange }) => (
    <div className="md:col-span-2 mb-4">
        <label className={labelStyle}>{label}</label>
        <textarea
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            className={`${inputStyle} min-h-[90px]`}
        />
    </div>
);


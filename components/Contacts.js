"use client";

import { useEffect, useState } from "react";
import {
    collection,
    getDocs,
    query,
    orderBy,
    deleteDoc,
    doc,
    setDoc,
    updateDoc,
    serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { FaTrash, FaWhatsapp, FaEdit } from "react-icons/fa";
import { formatDate } from "../lib/utils";

/* ================= MAIN COMPONENT ================= */
export default function AdminContactsPage() {
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);

    const [openModal, setOpenModal] = useState(false);
    const [editId, setEditId] = useState(null);

    const [form, setForm] = useState({
        fullName: "",
        email: "",
        phone: "",
        careerType: "fresher",
        role: "user",
        emailVerified: false,
    });

    /* ================= FETCH CONTACTS ================= */
    const fetchContacts = async () => {
        try {
            setLoading(true);

            const q = query(
                collection(db, "contacts"),
                orderBy("createdAt", "desc")
            );

            const snap = await getDocs(q);

            setContacts(
                snap.docs.map((d) => ({
                    id: d.id,
                    ...d.data(),
                }))
            );
        } catch (err) {
            console.error("Failed to fetch contacts", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchContacts();
    }, []);

    /* ================= ADD / EDIT ================= */
    const openAdd = () => {
        setEditId(null);
        setForm({
            fullName: "",
            email: "",
            phone: "",
            careerType: "fresher",
            role: "user",
            emailVerified: false,
        });
        setOpenModal(true);
    };

    const openEdit = (contact) => {
        setEditId(contact.id);
        setForm(contact);
        setOpenModal(true);
    };

    const saveContact = async () => {
        try {
            /* ================= VALIDATION ================= */
            if (!form.fullName?.trim()) {
                alert("Full Name is required");
                return;
            }

            if (!form.phone?.trim()) {
                alert("Phone number is required");
                return;
            }

            const phoneDigits = form.phone.replace(/\D/g, "");

            if (phoneDigits.length !== 10) {
                alert("Phone number must be exactly 10 digits");
                return;
            }

            /* ================= SAVE ================= */
            if (editId) {
                // UPDATE
                await updateDoc(doc(db, "contacts", editId), {
                    fullName: form.fullName,
                    phone: phoneDigits,
                    careerType: form.careerType,
                    role: form.role,
                    emailVerified: form.emailVerified,
                });
            } else {
                // CREATE
                const ref = doc(collection(db, "contacts"));
                await setDoc(ref, {
                    ...form,
                    phone: phoneDigits,
                    uid: ref.id,
                    createdAt: serverTimestamp(),
                });
            }

            setOpenModal(false);
            fetchContacts();
        } catch (err) {
            console.error("Save failed", err);
            alert("Something went wrong. Please try again.");
        }
    };


    /* ================= DELETE ================= */
    const deleteContact = async (id) => {
        if (!confirm("Delete this contact?")) return;
        await deleteDoc(doc(db, "contacts", id));
        setContacts((prev) => prev.filter((c) => c.id !== id));
    };

    /* ================= WHATSAPP ================= */
    const sendWhatsApp = (c) => {
        if (!c.phone) {
            alert("Phone number not available");
            return;
        }

        // Remove non-digit characters
        let phoneDigits = c.phone.replace(/\D/g, "");

        // Add default country code if missing (example: India = 91)
        if (phoneDigits.length === 10) {
            phoneDigits = "91" + phoneDigits;
        }

        // Validate final number length (should be at least country code + 10 digits)
        // if (phoneDigits.length < 11) {
        //     alert("Invalid phone number. Please check country code and number.");
        //     return;
        // }

        // Your custom message
        const message = `Hi ${c.fullName} 👋

            Join the official Padmashali Community job referreal WhatsApp group here 👇
            https://chat.whatsapp.com/L749zvZUBb056lBT5gYWgz

            See you there! 😊`;

        // Open WhatsApp link
        const url = `https://wa.me/${phoneDigits}?text=${encodeURIComponent(message)}`;
        window.open(url, "_blank");
    };



    if (loading) return <p className="p-6">Loading contacts...</p>;

    return (
        <div className="mx-auto">

            {/* ADD BUTTON */}
            <div className="flex justify-end mb-1">
                <button
                    onClick={openAdd}
                    className="
            px-3 py-1.5 text-sm
            md:px-4 md:py-2 md:text-base
            bg-purple-600 text-white rounded-lg
            hover:bg-purple-700
        "
                >
                    + Add Contact
                </button>
            </div>


            {/* TABLE */}
            <div className="overflow-x-auto bg-white rounded-xl shadow-md">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-4 py-3">S.N</th>
                            <th className="px-4 py-3">Name</th>
                            <th className="px-4 py-3">Email</th>
                            <th className="px-4 py-3">Phone</th>
                            <th className="px-4 py-3">Joined</th>
                            <th className="px-4 py-3 text-center">Actions</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y">
                        {contacts.map((c, i) => (
                            <tr key={c.id} className="hover:bg-gray-50">
                                <td className="px-4 py-3">{i + 1}</td>
                                <td className="px-4 py-3 font-medium">{c.fullName}</td>
                                <td className="px-4 py-3">{c.email}</td>
                                <td className="px-4 py-3">{c.phone}</td>
                                <td className="px-4 py-3">
                                    {formatDate(c.createdAt)}
                                </td>
                                <td className="px-4 py-3 flex justify-center gap-4  text-xl">
                                    <button
                                        onClick={() => openEdit(c)}
                                        className="text-blue-600 hover:text-blue-700"
                                    >
                                        <FaEdit />
                                    </button>
                                    <button
                                        onClick={() => sendWhatsApp(c)}
                                        className="text-green-600 hover:text-green-700"
                                    >
                                        <FaWhatsapp />
                                    </button>
                                    <button
                                        onClick={() => deleteContact(c.id)}
                                        className="text-red-600 hover:text-red-700"
                                    >
                                        <FaTrash />
                                    </button>
                                </td>
                            </tr>
                        ))}

                        {contacts.length === 0 && (
                            <tr>
                                <td colSpan={9} className="text-center py-6 text-gray-500">
                                    No contacts found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* MODAL */}
            {openModal && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white w-full max-w-xl rounded-xl p-6">
                        <h2 className="text-xl font-semibold mb-4">
                            {editId ? "Edit Contact" : "Add Contact"}
                        </h2>

                        <div className="grid grid-cols-1 gap-4">
                            <Input label="Full Name" value={form.fullName}
                                onChange={(v) => setForm({ ...form, fullName: v })} />

                            <Input label="Email" value={form.email}
                                disabled={!!editId}
                                onChange={(v) => setForm({ ...form, email: v })} />

                            <Input label="Phone" value={form.phone}
                                onChange={(v) => setForm({ ...form, phone: v })} />

                            <div>
                                <label className={labelStyle}>Career Type</label>
                                <select
                                    value={form.careerType}
                                    onChange={(e) =>
                                        setForm({ ...form, careerType: e.target.value })
                                    }
                                    className={inputStyle}
                                >
                                    <option value="fresher">Fresher</option>
                                    <option value="working">Working</option>
                                    <option value="student">Student</option>
                                </select>
                            </div>

                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={form.emailVerified}
                                    onChange={(e) =>
                                        setForm({ ...form, emailVerified: e.target.checked })
                                    }
                                />
                                <span>Email Verified</span>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                onClick={() => setOpenModal(false)}
                                className="px-4 py-2 border rounded"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={saveContact}
                                className="px-4 py-2 bg-purple-600 text-white rounded"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

/* ================= INPUT HELPERS ================= */
const inputStyle =
    "w-full px-3 py-2.5 text-sm rounded-md bg-gray-50 ring-1 ring-gray-200 outline-none focus:ring-2 focus:ring-purple-500";

const labelStyle = "block text-sm font-medium text-gray-700 mb-1";

const Input = ({ label, value, onChange, disabled }) => (
    <div>
        <label className={labelStyle}>{label}</label>
        <input
            value={value || ""}
            disabled={disabled}
            onChange={(e) => onChange?.(e.target.value)}
            className={`${inputStyle} ${disabled ? "bg-gray-100 cursor-not-allowed" : ""}`}
        />
    </div>
);

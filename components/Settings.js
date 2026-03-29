"use client";

import { useEffect, useState } from "react";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { FaTrash } from "react-icons/fa";
import ToastAlert from "@/components/ToastAlert";

/* ================= MAIN COMPONENT ================= */
export default function AdminSettingsPage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [alert, setAlert] = useState(null);

    const [form, setForm] = useState({
        images: [],
        showProfessionals: true,
    });

    /* ================= ALERT ================= */
    const showAlert = (type, message) => {
        setAlert({ type, message });
    };

    /* ================= FETCH ================= */
    const fetchSettings = async () => {
        try {
            const ref = doc(db, "admin_settings", "settings");
            const snap = await getDoc(ref);

            if (snap.exists()) {
                setForm({
                    images: snap.data().images || [],                   
                    showProfessionals: snap.data().showProfessionals ?? true,
                   
                });
            }
        } catch (err) {
            console.error(err);
            showAlert("error", "Failed to load settings");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSettings();
    }, []);

    /* ================= TOGGLE ================= */
    const handleToggleChange = async (key, value) => {
        try {
            setSaving(true);

            setForm((prev) => ({ ...prev, [key]: value }));

            await setDoc(
                doc(db, "admin_settings", "settings"),
                {
                    [key]: value,
                    updatedAt: serverTimestamp(),
                },
                { merge: true }
            );

            showAlert("success", "Setting updated");
        } catch (err) {
            console.error(err);
            showAlert("error", "Failed to update setting");
        } finally {
            setSaving(false);
        }
    };

    /* ================= UPLOAD IMAGE ================= */
    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.size > 1024 * 1024) {
            showAlert("error", "Image must be less than 1MB");
            return;
        }

        const reader = new FileReader();

        reader.onload = async () => {
            try {
                setSaving(true);

                const newImage = reader.result;
                const updatedImages = [...(form.images || []), newImage];

                setForm((prev) => ({
                    ...prev,
                    images: updatedImages,
                }));

                await setDoc(
                    doc(db, "admin_settings", "settings"),
                    {
                        images: updatedImages,
                        updatedAt: serverTimestamp(),
                    },
                    { merge: true }
                );

                showAlert("success", "Image uploaded successfully");
            } catch (err) {
                console.error(err);
                showAlert("error", "Upload failed");
            } finally {
                setSaving(false);
            }
        };

        reader.readAsDataURL(file);
    };

    /* ================= DELETE IMAGE ================= */
    const deleteImage = async (index) => {
        try {
            setSaving(true);

            const updatedImages = [...form.images];
            updatedImages.splice(index, 1);

            setForm((prev) => ({
                ...prev,
                images: updatedImages,
            }));

            await setDoc(
                doc(db, "admin_settings", "settings"),
                {
                    images: updatedImages,
                    updatedAt: serverTimestamp(),
                },
                { merge: true }
            );

            showAlert("success", "Image deleted");
        } catch (err) {
            console.error(err);
            showAlert("error", "Delete failed");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="p-6 text-gray-500">
                Loading settings...
            </div>
        );
    }

    return (
        <div className="mx-auto p-4">

            {/* Toast Alert */}
            {alert && (
                <ToastAlert
                    type={alert.type}
                    message={alert.message}
                    onClose={() => setAlert(null)}
                />
            )}

            {/* Saving Indicator */}
            {saving && (
                <p className="text-sm text-purple-600 mb-3">
                    Saving changes...
                </p>
            )}

            {/* ================= TOGGLES ================= */}
            <div className="bg-white p-4 rounded-xl shadow mb-6 space-y-4">


                <Toggle
                    label="Show Professionals"
                    value={form.showProfessionals}
                    onChange={(v) => handleToggleChange("showProfessionals", v)}
                />

            </div>

            {/* ================= IMAGE SECTION ================= */}
            <div className="bg-white p-4 rounded-xl shadow">

                <label className="block font-medium mb-2">
                    Upload Images (max 1MB each)
                </label>

                <div className="relative">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="border border-gray-300 rounded-md px-3 py-2 cursor-pointer hover:border-purple-500">
                        Choose Image...
                    </div>
                </div>

                {/* IMAGE GRID */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                    {form.images?.map((img, index) => (
                        <div
                            key={index}
                            className="relative border rounded-lg overflow-hidden group"
                        >
                            <img
                                src={img}
                                className="w-full h-32 object-cover"
                            />

                            <button
                                onClick={() => deleteImage(index)}
                                className="absolute top-2 right-2 bg-black/60 text-white p-1 rounded opacity-0 group-hover:opacity-100"
                            >
                                <FaTrash size={12} />
                            </button>
                        </div>
                    ))}

                    {form.images.length === 0 && (
                        <p className="col-span-full text-gray-500 text-sm">
                            No images uploaded
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}

/* ================= TOGGLE ================= */
const Toggle = ({ label, value, onChange }) => (
    <div className="flex items-center justify-between">
        <span className="text-gray-700">{label}</span>
        <input
            type="checkbox"
            checked={value}
            onChange={(e) => onChange(e.target.checked)}
            className="w-5 h-5"
        />
    </div>
);
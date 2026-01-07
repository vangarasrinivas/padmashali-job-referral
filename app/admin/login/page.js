"use client";

import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { db, auth } from "@/lib/firebase";
import ToastAlert from "@/components/ToastAlert";

export default function AdminLogin() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const [alert, setAlert] = useState(null);
    // { type: "success" | "error", message: string }

    /* ---------------- ALERT ---------------- */
    const showAlert = (type, message) => {
        setAlert({ type, message });
    };


    const handleLogin = async () => {
        if (!email || !password) {
            showAlert("error", "Please enter email and password");
            return;
        }

        try {
            setLoading(true);
            const res = await signInWithEmailAndPassword(auth, email, password);
            const uid = res.user.uid;

            const adminRef = doc(db, "admins", uid);
            const adminSnap = await getDoc(adminRef);

            if (!adminSnap.exists()) {
                showAlert("error", "Access denied. Not an admin user.");

                return;
            }

            router.push("/admin");
        } catch (err) {
            // alert(err.message);
            showAlert("error", "In valid Credentials" || "Access denied. Not an admin user.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <nav className="text-white bg-[#9743e4] py-3 sticky top-0 shadow-md">
                <div className="flex justify-center">
                    <a
                        href="/"
                        // onClick={() => setRouteName("home")}
                        className="text-white font-bold text-xl cursor-pointer flex items-center gap-2 "
                    >
                        <img
                            src="/padmasali-logo.png"
                            alt="Padmashali Logo"
                            className="w-20 h-12"
                        />

                        Padmashali Job Referral
                    </a>
                </div>
            </nav>
            {alert && (
                <ToastAlert
                    type={alert.type}
                    message={alert.message}
                    onClose={() => setAlert(null)}
                />
            )}
            <div className="h-screen  bg-gray-100 ">
                <div className="flex items-center justify-center px-4 ">
                    <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 mt-10">
                        <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
                            Admin Login
                        </h2>
                        <p className="text-sm text-gray-500 text-center mb-6">
                            Sign in to access the admin dashboard
                        </p>

                        {/* Email */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Email
                            </label>
                            <input
                                type="email"
                                placeholder="admin@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                        </div>

                        {/* Password */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Password
                            </label>
                            <input
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                        </div>

                        {/* Button */}
                        <button
                            onClick={handleLogin}
                            disabled={loading}
                            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg font-medium transition disabled:opacity-60"
                        >
                            {loading ? "Signing in..." : "Login"}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

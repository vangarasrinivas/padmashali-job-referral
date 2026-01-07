"use client";

import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import NavbarUsers from "../../components/NavbarUsers";
import ToastAlert from "@/components/ToastAlert";

export default function LoginPage() {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    // { type: "success" | "error", message: string }
    const [alert, setAlert] = useState(null);

    /* ---------------- ALERT ---------------- */
    const showAlert = (type, message) => {
        setAlert({ type, message });
    };

    const login = async (e) => {
        e.preventDefault();

        if (!email || !password) {
            showAlert("error", "Please enter email and password");
            return;
        }

        try {
            setLoading(true);
            await signInWithEmailAndPassword(auth, email, password);

            showAlert("success", "Login successful! Redirecting...");

            setTimeout(() => {
                router.push("/");
            }, 800);
        } catch (err) {
            showAlert("error", "Invalid email or password");
        } finally {
            setLoading(false);
        }
    };


    return (
        <section className="min-h-screen bg-gray-50">
            <NavbarUsers />

            <div className="flex items-center justify-center px-4 py-16">
                <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">

                    {/* Header */}
                    <h2 className="text-2xl font-bold text-gray-900 text-center">
                        Welcome Back
                    </h2>
                    <p className="text-sm text-gray-500 text-center mt-1">
                        Login to continue
                    </p>

                    {/* Alert */}
                    {/* Toast Alert */}
                    {alert && (
                        <ToastAlert
                            type={alert.type}
                            message={alert.message}
                            onClose={() => setAlert(null)}
                        />
                    )}

                    {/* Form */}
                    <form onSubmit={login} className="mt-6 space-y-4">

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Email address
                            </label>
                            <input
                                type="email"
                                required
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-3 py-2.5 rounded-md bg-gray-50
                  ring-1 ring-gray-200 outline-none
                  focus:ring-2 focus:ring-purple-500 focus:bg-white transition"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Password
                            </label>
                            <input
                                type="password"
                                required
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-3 py-2.5 rounded-md bg-gray-50
                  ring-1 ring-gray-200 outline-none
                  focus:ring-2 focus:ring-purple-500 focus:bg-white transition"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-purple-600 hover:bg-purple-700
                text-white py-2.5 rounded-lg font-semibold transition
                disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {loading ? "Logging in..." : "Login"}
                        </button>
                    </form>

                    {/* Signup */}
                    <p className="text-sm text-gray-600 text-center mt-6">
                        Don’t have an account?{" "}
                        <Link
                            href="/signup"
                            className="text-purple-600 font-semibold hover:underline"
                        >
                            Sign up
                        </Link>
                    </p>

                </div>
            </div>
        </section>
    );
}

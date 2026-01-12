"use client";

import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/lib/firebase";
import Link from "next/link";
import NavbarUsers from "@/components/NavbarUsers";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleReset = async (e) => {
        e.preventDefault();

        if (!email) {
            setMessage({
                type: "error",
                text: "Please enter your email address",
            });
            return;
        }

        try {
            setLoading(true);

            await sendPasswordResetEmail(auth, email, {
                url: `${window.location.origin}/login`,
            });


            setMessage({
                type: "success",
                text:
                    "Password reset link sent! Please check your inbox and spam folder.",
            });
        } catch (err) {
            setMessage({
                type: "error",
                text: "Email not found or invalid email address",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="min-h-screen bg-gray-50">
            <NavbarUsers />

            <div className="flex justify-center items-center px-4 py-16">
                <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">

                    <h2 className="text-2xl font-bold text-center">
                        Reset Password
                    </h2>

                    <p className="text-sm text-gray-500 text-center mt-1">
                        Enter your email to receive a reset link
                    </p>

                    {/* Message */}
                    {message && (
                        <div
                            className={`mt-4 p-3 rounded-md text-sm flex justify-between items-start ${message.type === "success"
                                    ? "bg-green-50 text-green-700"
                                    : "bg-red-50 text-red-700"
                                }`}
                        >
                            <span>{message.text}</span>
                            <button
                                onClick={() => setMessage(null)}
                                className="ml-3 font-bold"
                            >
                                ✕
                            </button>
                        </div>
                    )}

                    <form
                        onSubmit={handleReset}
                        className="mt-6 space-y-4"
                    >
                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Email address
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-3 py-2.5 rounded-md bg-gray-50
                ring-1 ring-gray-200 outline-none
                focus:ring-2 focus:ring-purple-500"
                                placeholder="you@example.com"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-purple-600 text-white py-2.5 rounded-lg font-semibold
              hover:bg-purple-700 disabled:opacity-60"
                        >
                            {loading ? "Sending..." : "Send Reset Link"}
                        </button>
                    </form>

                    <p className="text-sm text-center mt-6">
                        Remembered your password?{" "}
                        <Link
                            href="/login"
                            className="text-purple-600 font-semibold hover:underline"
                        >
                            Back to login
                        </Link>
                    </p>
                </div>
            </div>
        </section>
    );
}

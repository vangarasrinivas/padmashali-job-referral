"use client";

import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import NavbarUsers from "../../components/NavbarUsers";
import ToastAlert from "@/components/ToastAlert";
import { doc, updateDoc } from "firebase/firestore";
import { FiEye, FiEyeOff } from "react-icons/fi";


export default function LoginPage() {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const [alert, setAlert] = useState(null);
    const [emailPending, setEmailPending] = useState(false);
    const [showPassword, setShowPassword] = useState(false);


    const login = async (e) => {
        e.preventDefault();

        if (!email || !password) {
            setAlert({ type: "error", message: "Please enter email and password" });
            return;
        }

        try {
            setLoading(true);

            const userCredential = await signInWithEmailAndPassword(
                auth,
                email,
                password
            );

            const user = userCredential.user;

            // ❌ Block unverified users
            if (!user.emailVerified) {
                setEmailPending(true);
                return;
            }

            // ✅ MARK VERIFIED IN FIRESTORE (ONE-TIME UPDATE)
            await updateDoc(doc(db, "users", user.uid), {
                emailVerified: true,
                emailVerifiedAt: new Date(),
            });

            setAlert({
                type: "success",
                message: "Login successful! Redirecting...",
            });

            setTimeout(() => router.push("/"), 300);
        } catch (err) {
            // console.error("Login error:", err);
            setAlert({ type: "error", message: "Invalid email or password" });
        } finally {
            setLoading(false);
        }
    };


    return (
        <section className="min-h-screen bg-gray-50">
            <NavbarUsers />

            <div className="flex items-center justify-center px-4 py-16">
                <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">

                    {/* Email verification pending message */}
                    {emailPending && (
                        <div className="flex items-start justify-between p-4 mb-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700">
                            <div>
                                <p className="font-semibold">
                                    Your email verification is pending.
                                </p>
                                <p>Please check your inbox and spam folders. Verify your email before logging in.</p>
                            </div>
                            <button
                                onClick={() => setEmailPending(false)}
                                className="text-yellow-700 font-bold text-xl leading-none"
                            >
                                ✕
                            </button>
                        </div>
                    )}

                    {/* Alert */}
                    {alert && !emailPending && (
                        <ToastAlert
                            type={alert.type}
                            message={alert.message}
                            onClose={() => setAlert(null)}
                        />
                    )}

                    <h2 className="text-2xl font-bold text-gray-900 text-center">
                        Welcome Back
                    </h2>
                    <p className="text-sm text-gray-500 text-center mt-1">
                        Login to continue
                    </p>

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
                                className="w-full px-3 py-2.5 rounded-md bg-gray-50 ring-1 ring-gray-200 outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Password
                            </label>

                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-3 py-2.5 pr-10 rounded-md bg-gray-50
        ring-1 ring-gray-200 outline-none
        focus:ring-2 focus:ring-purple-500 focus:bg-white transition"
                                />

                                <button
                                    type="button"
                                    onClick={() => setShowPassword((prev) => !prev)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2
        text-gray-500 hover:text-gray-700"
                                    aria-label="Toggle password visibility"
                                >
                                    {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                                </button>
                            </div>
                        </div>


                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2.5 rounded-lg font-semibold transition disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {loading ? "Logging in..." : "Login"}
                        </button>
                    </form>

                    <p className="text-sm text-center mt-6 space-y-2">
                        <Link
                            href="/forgot-password"
                            className="block text-purple-600 font-medium hover:underline"
                        >
                            Forgot password?
                        </Link>

                        <span className="text-gray-600">
                            Don’t have an account?{" "}
                            <Link
                                href="/signup"
                                className="text-purple-600 font-semibold hover:underline"
                            >
                                Sign up
                            </Link>
                        </span>
                    </p>





                </div>
            </div>
        </section>
    );
}

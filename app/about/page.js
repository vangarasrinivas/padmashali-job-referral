"use client";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import {
    FaBriefcase,
    FaHandshake,
    FaLightbulb,
    FaUsers,
    FaHeart,
    FaCheckCircle,
    FaUserCircle,
} from "react-icons/fa";
import ContactSection from "@/components/ContactSection";
import BackToTop from "../../components/BackToTop";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { usePathname } from "next/navigation";

export default function AboutPage() {
    const pathname = usePathname();
    const { user } = useAuth();

    const [menuOpen, setMenuOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const [profile, setProfile] = useState(null);

    const navItems = [
        { name: "Home", href: "/", key: "home" },
        { name: "About", href: "/about", key: "about" },
        { name: "Jobs", href: "/", key: "jobs" },
        { name: "Contact", href: "/#contact", key: "contact" },
        { name: "Admin", href: "/admin", key: "admin" },
    ];

    // Fetch user profile
    useEffect(() => {
        if (user) {
            getDoc(doc(db, "users", user.uid)).then((snap) => {
                if (snap.exists()) setProfile(snap.data());
            });
        }
    }, [user]);

    const logout = async () => {
        await signOut(auth);
        setMenuOpen(false);
        setProfileOpen(false);
        setProfile(null); // clear profile immediately
    };

    const underline = (active) =>
        `block h-0.5 bg-white absolute bottom-[-4px] left-0 transition-all duration-300
     ${active ? "w-full" : "w-0 group-hover:w-full"}`;

    const isUser = user && profile?.role === "user";

    const isActive = (key) =>
        pathname === `/${key}` || (pathname === "/" && key === "home");


    return (
        <section>

            <nav className="fixed top-0 left-0 w-full bg-[#9743e4] text-white z-[100] shadow-md">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="flex items-center justify-between h-16">

                        {/* Brand */}
                        <Link
                            href="/"
                            className="text-white text-xl cursor-pointer flex items-center gap-2"
                        >
                            <img
                                src="/padmasali-logo.png"
                                alt="Padmashali Logo"
                                className="w-20 h-12"
                            />
                            Padmashali Job Referral
                        </Link>

                        {/* Desktop Menu */}
                        <div className="hidden md:flex gap-8 items-center">
                            {navItems.map((item) => (
                                <Link
                                    key={item.key}
                                    href={item.href}
                                    className="relative group"
                                >
                                    {item.name}
                                    <span className={underline(isActive(item.key))}></span>
                                </Link>
                            ))}
                        </div>

                        {/* Desktop Right - Login / Profile */}
                        <div className="hidden md:flex items-center gap-4 relative">
                            {!isUser && (
                                <Link
                                    href="/login"
                                    className="relative inline-block bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition"
                                >
                                    Sign In
                                </Link>
                            )}

                            {isUser && (
                                <div className="relative">
                                    <button onClick={() => setProfileOpen(!profileOpen)}>
                                        <FaUserCircle size={26} />
                                    </button>

                                    {profileOpen && (
                                        <div className="absolute right-0 mt-2 w-56 bg-white text-black rounded shadow-lg p-3">
                                            <p className="font-semibold">
                                                Welcome, {profile?.fullName}!
                                            </p>
                                            <p className="font-semibold text-gray-500">{user.email}</p>
                                            <p className="text-sm text-gray-600">{profile?.profession}</p>

                                            <hr className="my-2 border-gray-200" />

                                            <Link
                                                href="/profile"
                                                onClick={() => setProfileOpen(false)}
                                                className="block px-3 py-2 rounded hover:bg-purple-50 hover:text-purple-600 transition-colors duration-200"
                                            >
                                                About You
                                            </Link>

                                            <button
                                                onClick={logout}
                                                className="w-full text-left px-3 py-2 rounded text-red-600 hover:bg-red-50 transition-colors duration-200 cursor-pointer"
                                            >
                                                Sign Out
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            className="md:hidden text-2xl"
                            onClick={() => setMenuOpen(!menuOpen)}
                        >
                            ☰
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {menuOpen && (
                    <div className="md:hidden bg-[#9743e4] text-white px-4 py-3 space-y-2">
                        {navItems.map((item) => (
                            <Link
                                key={item.key}
                                href={item.href}
                                onClick={() => setMenuOpen(false)}
                                className="relative group block py-2"
                            >
                                {item.name}
                                <span className={underline(false)}></span>
                            </Link>
                        ))}

                        <hr className="border-white/30" />

                        {!isUser && (
                            <Link
                                href="/login"
                                onClick={() => setMenuOpen(false)}
                                className="relative group block py-2"
                            >
                                Login
                                <span className={underline(pathname === "/login")}></span>
                            </Link>
                        )}

                        {isUser && (
                            <>
                                <p className="font-semibold">Welcome, {profile?.fullName || user.email}</p>
                                <Link
                                    href="/profile"
                                    onClick={() => setMenuOpen(false)}
                                    className="block py-2"
                                >
                                    About You
                                </Link>
                                <button
                                    onClick={logout}
                                    className="block py-2 text-left text-red-300"
                                >
                                    Sign Out
                                </button>
                            </>
                        )}
                    </div>
                )}
            </nav>





            <div className="min-h-screen bg-gradient-to-br from-[#f7f5ff] via-white to-[#f1ecff]">
                <div className="max-w-6xl mx-auto px-5 sm:px-8 pt-5 pb-10">

                    {/* ================= HERO ================= */}
                    <div className="text-center mb-20">
                        <span className="inline-block mb-4 px-4 py-1 text-xs font-semibold tracking-wide rounded-full bg-purple-100 text-purple-700">
                            Community Driven
                        </span>

                        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-tight">
                            Padmashali Job Referral
                            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#9743e4] to-[#7a33c9]">
                                Community
                            </span>
                        </h1>

                        <p className="mt-6 text-gray-600 max-w-3xl mx-auto text-base sm:text-lg">
                            A trusted network for Padmashali IT professionals to share
                            opportunities, referrals, and knowledge — empowering careers
                            through community support.
                        </p>
                    </div>

                    {/* ================= WHAT WE OFFER ================= */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
                        {[
                            {
                                icon: <FaBriefcase />,
                                title: "Job Openings",
                                desc: "Verified and genuine job openings shared by members.",
                            },
                            {
                                icon: <FaHandshake />,
                                title: "Referrals",
                                desc: "Employee referrals that help unlock opportunities.",
                            },
                            {
                                icon: <FaLightbulb />,
                                title: "Interview Guidance",
                                desc: "Tips, experiences, and preparation insights.",
                            },
                            {
                                icon: <FaUsers />,
                                title: "Career Growth",
                                desc: "Learn new skills and grow together professionally.",
                            },
                        ].map((item, index) => (
                            <div
                                key={index}
                                className="
                group relative overflow-hidden
                rounded-3xl p-6
                bg-white/60 backdrop-blur-xl
                border border-white/40
                shadow-lg shadow-purple-500/10
                hover:shadow-purple-500/20
                transition-all duration-300
              "
                            >
                                <div
                                    className="
                  mb-4 h-12 w-12 rounded-2xl
                  bg-gradient-to-br from-[#9743e4] to-[#7a33c9]
                  text-white flex items-center justify-center
                  group-hover:scale-110 transition-transform
                "
                                >
                                    {item.icon}
                                </div>

                                <h3 className="font-semibold text-gray-900 mb-1">
                                    {item.title}
                                </h3>
                                <p className="text-sm text-gray-600">
                                    {item.desc}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* ================= PURPOSE ================= */}
                    <div className="relative mb-24">
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-200/40 to-indigo-200/40 blur-3xl rounded-full"></div>

                        <div className="relative bg-white/70 backdrop-blur-xl rounded-3xl p-10 border border-white/50 shadow-xl">
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">
                                Our Purpose
                            </h2>
                            <p className="text-gray-600 text-lg leading-relaxed max-w-4xl">
                                To uplift our community by helping each other find better roles,
                                learn new skills, and grow together in the software industry.
                                We believe collaboration creates opportunities that individuals
                                cannot achieve alone.
                            </p>
                        </div>
                    </div>

                    {/* ================= RULES ================= */}
                    <div className="mb-24">
                        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                            Community Guidelines
                        </h2>

                        <div className="max-w-4xl mx-auto grid gap-5">
                            {[
                                "Share only genuine job posts and referrals",
                                "No spam, forwarded messages, or political content",
                                "Respect everyone in the community",
                                "Help whenever possible — one referral can change a life",
                            ].map((rule, index) => (
                                <div
                                    key={index}
                                    className="
                  flex items-start gap-4
                  bg-white/70 backdrop-blur-xl
                  border border-white/50
                  rounded-2xl p-5
                  shadow-md
                "
                                >
                                    <FaCheckCircle className="text-purple-600 mt-1 shrink-0" />
                                    <p className="text-gray-700">{rule}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ================= DISCLAIMER ================= */}
                    <div className="max-w-4xl mx-auto mb-24">
                        <div className="bg-gradient-to-r from-purple-100 to-indigo-100 rounded-3xl p-8 border border-purple-200">
                            <h3 className="text-xl font-semibold text-gray-900 mb-3">
                                Disclaimer
                            </h3>
                            <p className="text-gray-700 leading-relaxed">
                                This community is completely voluntary. Members are free to stay,
                                participate, or exit at any time. There is no force, pressure,
                                or obligation of any kind.
                            </p>
                        </div>
                    </div>

                    {/* ================= FOOTER CTA ================= */}
                    <div className="text-center">
                        <div
                            className="
              inline-flex items-center gap-3
              px-8 py-4 rounded-full
              bg-gradient-to-r from-[#9743e4] to-[#7a33c9]
              text-white font-semibold text-lg
              shadow-xl shadow-purple-500/40
            "
                        >
                            <FaHeart />
                            Together, we rise
                        </div>
                    </div>

                </div>
            </div>
            <ContactSection />
            <BackToTop />
        </section>

    );
}

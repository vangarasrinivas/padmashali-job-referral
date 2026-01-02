"use client";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import { useState } from "react";

import {
    FaBriefcase,
    FaHandshake,
    FaLightbulb,
    FaUsers,
    FaHeart,
    FaCheckCircle,
} from "react-icons/fa";
import ContactSection from "@/components/ContactSection";
import BackToTop from "../../components/BackToTop";
import Link from "next/link";
export default function AboutPage() {
    const [routeName, setRouteName] = useState("about");
    const [menuOpen, setMenuOpen] = useState(false);
    const navItems = [
        { name: "Home", href: "/" },
        { name: "About", href: "/about" },
        { name: "Jobs", href: "/" },
        { name: "Contact", href: "#contact" },
    ];

    const routeFunc = (navItem) => "text-white relative group";
    return (
        <section>

            (
            <nav className="fixed top-0 left-0 w-full text-white z-[50] bg-[#9743e4] shadow-md">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="flex items-center justify-between h-16">
                        {/* Brand */}
                        <div>
                            <Link
                                href="/"
                                onClick={() => setRouteName("home")}
                                className="text-white text-xl cursor-pointer flex items-center gap-2"
                            >
                                <img
                                    src="/padmasali-logo.png"
                                    alt="Padmashali Logo"
                                    className="w-20 h-12"
                                />
                                Padmashali Job Referral
                            </Link>
                        </div>

                        {/* Desktop Menu */}
                        <div className="hidden md:flex justify-center gap-x-8 items-center">
                            {navItems.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    onClick={() => setRouteName(item.name.toLowerCase())}
                                    className={`${routeFunc(item.name.toLowerCase())} inline-block relative`}
                                >
                                    {item.name}
                                    <span
                                        className={`block h-0.5 bg-white absolute bottom-0 left-0
                    ${routeName === item.name.toLowerCase() ? "w-full" : "w-0 group-hover:w-full"}
                    transition-all duration-300 ease-in-out`}
                                    ></span>
                                </Link>
                            ))}
                            <Link
                                href="/admin"
                                onClick={() => setRouteName("admin")}
                                className={`inline-block relative`}
                            >
                                Admin
                                <span
                                    className={`block h-0.5 bg-white absolute bottom-0 left-0
                  ${routeName === "admin" ? "w-full" : "w-0 group-hover:w-full"}
                  transition-all duration-300 ease-in-out`}
                                ></span>
                            </Link>
                        </div>

                        {/* Mobile Menu Button */}
                        <div className="md:hidden">
                            <button
                                onClick={() => setMenuOpen(!menuOpen)}
                                type="button"
                                className="focus:outline-none"
                            >
                                <svg
                                    className="h-6 w-6"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    {menuOpen ? (
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    ) : (
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M4 6h16M4 12h16M4 18h16"
                                        />
                                    )}
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                {menuOpen && (
                    <div className="md:hidden bg-[#9743e4] text-white">
                        <div className="px-4 pt-2 pb-3 space-y-1 flex flex-col">
                            {navItems.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    onClick={() => {
                                        setRouteName(item.name.toLowerCase());
                                        setMenuOpen(false);
                                    }}
                                    className={`py-2 px-3 ${routeFunc(item.name.toLowerCase())} inline-block relative`}
                                >
                                    {item.name}
                                    <span
                                        className={`block h-0.5 bg-white absolute bottom-0 left-0
                    ${routeName === item.name.toLowerCase() ? "w-full" : "w-0 group-hover:w-full"}
                    transition-all duration-300 ease-in-out`}
                                    ></span>
                                </Link>
                            ))}
                            <Link
                                href="/admin"
                                onClick={() => {
                                    setRouteName("admin");
                                    setMenuOpen(false);
                                }}
                                className={`py-2 px-3 inline-block relative`}
                            >
                                Admin
                                <span
                                    className={`block h-0.5 bg-white absolute bottom-0 left-0
                  ${routeName === "admin" ? "w-full" : "w-0 group-hover:w-full"}
                  transition-all duration-300 ease-in-out`}
                                ></span>
                            </Link>
                        </div>
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

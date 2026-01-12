"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { signOut } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { FaUserCircle } from "react-icons/fa";

const Navbar = () => {
  const pathname = usePathname();
  const { user } = useAuth();

  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [profile, setProfile] = useState(null);

  const navItems = [
    { name: "Home", href: "#home", key: "home" },
    { name: "About", href: "/about", key: "about" },
    { name: "Jobs", href: "#jobs", key: "jobs" },
    { name: "Contact", href: "#contact", key: "contact" },
    { name: "Admin", href: "/admin", key: "admin" },
  ];

  useEffect(() => {
    if (user) {
      getDoc(doc(db, "users", user.uid)).then((snap) => {
        if (snap.exists()) setProfile(snap.data());
      });
    }
  }, [user]);

  const isActive = (key) => pathname === `/${key}` || pathname === "/" && key === "home";

  const logout = async () => {
    await signOut(auth);
    setMenuOpen(false);
    setProfileOpen(false);
    setProfile(null); // clear profile immediately
  };

  const isUser = user && profile?.role === "user";

  const underline = (active) =>
    `block h-0.5 bg-white absolute bottom-[-4px] left-0 transition-all duration-300
     ${active ? "w-full" : "w-0 group-hover:w-full"}`;


  return (
    <nav className="fixed top-0 left-0 w-full bg-[#9743e4] text-white z-[100] shadow-md">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">

          {/* Brand */}
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

          {/* Desktop Nav */}
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

          {/* Desktop Right */}
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
                  <div className="absolute right-0 mt-2 w-65 bg-white text-black rounded shadow-lg p-3">
                    <p className="font-semibold">
                      Welcome, {profile?.fullName}!
                    </p>
                    <p className=" text-gray-500">
                      {user?.email}
                    </p>
                    <p className="text-sm text-gray-600">
                      {profile?.profession}
                    </p>

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

          {/* Mobile Button */}
          <button
            className="md:hidden"
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
              <p className="font-semibold">
                Welcome, {profile?.fullName || user.email}
              </p>
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
  );
};

export default Navbar;

"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { signOut } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { FaUserCircle } from "react-icons/fa";
import { useRouter } from "next/navigation";

const NavbarAdmin = () => {
  const router = useRouter();
  const [routeName, setRouteName] = useState("admin");
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [admin, setAdmin] = useState(null);

  // 🔹 REFS FOR OUTSIDE CLICK
  const profileRef = useRef(null);

  const navItems = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Jobs", href: "/" },
    { name: "Admin", href: "/admin" },
  ];

  // 🔹 FETCH ADMIN INFO
  useEffect(() => {
    if (auth.currentUser) {
      getDoc(doc(db, "admins", auth.currentUser.uid)).then((snap) => {
        if (snap.exists()) setAdmin(snap.data());
      });
    }
  }, []);

  // 🔹 CLOSE POPUP ON OUTSIDE CLICK + ESC
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };

    const handleEsc = (e) => {
      if (e.key === "Escape") setProfileOpen(false);
    };

    if (profileOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEsc);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [profileOpen]);

  const routeFunc = () => "text-white relative group";

  const logout = async () => {
    await signOut(auth);
    setProfileOpen(false);
    router.push("/");

  };

  return (
    <nav className="sticky top-0 text-white z-[50] bg-[#9743e4] shadow-md">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">

          {/* Brand */}
          <Link
            href="/"
            onClick={() => setRouteName("home")}
            className="text-white text-xl flex items-center gap-2"
          >
            <img
              src="/padmasali-logo.png"
              alt="Padmashali Logo"
              className="w-20 h-12"
            />
            Padmashali Job Referral
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex gap-x-8 items-center">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setRouteName(item.name.toLowerCase())}
                className={`${routeFunc()} inline-block relative`}
              >
                {item.name}
                <span
                  className={`block h-0.5 bg-white absolute bottom-[-2px] left-0
                    ${
                      routeName === item.name.toLowerCase()
                        ? "w-full"
                        : "w-0 group-hover:w-full"
                    }
                    transition-all duration-300`}
                />
              </Link>
            ))}
          </div>

          {/* ADMIN PROFILE */}
          <div className="hidden md:block relative" ref={profileRef}>
            <button onClick={() => setProfileOpen((v) => !v)}>
              <FaUserCircle size={26} />
            </button>

            {profileOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white text-black rounded-lg shadow-lg p-4">
                <p className="font-semibold">{admin?.name || "Admin"}</p>
                <p className="text-sm text-gray-500">
                  {auth.currentUser?.email}
                </p>

                <hr className="my-3" />

                <button
                  onClick={logout}
                  className="w-full text-left px-3 py-2 rounded text-red-600 hover:bg-red-50"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={() => setMenuOpen(!menuOpen)}>☰</button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-[#9743e4] text-white px-4 py-3 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => {
                setRouteName(item.name.toLowerCase());
                setMenuOpen(false);
              }}
              className="block py-2"
            >
              {item.name}
            </Link>
          ))}

          <hr className="border-white/30" />

          <p className="font-semibold">{admin?.name || "Admin"}</p>
          <p className="text-sm">{auth.currentUser?.email}</p>

          <button
            onClick={logout}
            className="block py-2 text-left text-red-300"
          >
            Sign Out
          </button>
        </div>
      )}
    </nav>
  );
};

export default NavbarAdmin;

"use client";

import React, { useState } from "react";
import Link from "next/link";

const NavbarAdmin = () => {
  const [routeName, setRouteName] = useState("admin");
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Jobs", href: "/" },
    { name: "Admin", href: "/admin" },
  ];

  const routeFunc = (navItem) =>
    "text-white relative group"; // all links normal weight

  return (
    <nav className="sticky top-0  text-white z-[50] bg-[#9743e4] shadow-md">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <div className="flex-shrink-0">
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
          <div className="hidden md:flex justify-center gap-x-8 items-center relative">
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
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavbarAdmin;

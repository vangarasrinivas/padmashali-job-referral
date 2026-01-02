"use client";

import { useEffect, useState } from "react";
import { FaArrowUp } from "react-icons/fa";

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setVisible(window.scrollY > 300);
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (!visible) return null;

  return (
    <button
      onClick={scrollToTop}
      aria-label="Back to top"
      className="
        fixed z-50
        bottom-4 right-4
        sm:bottom-6 sm:right-6

        flex items-center justify-center
        h-10 w-10 sm:h-12 sm:w-12
        rounded-full

        bg-gradient-to-r from-[#9743e4] to-[#7a33c9]
        text-white

        shadow-md shadow-purple-500/30
        sm:shadow-lg sm:shadow-purple-500/40

        hover:shadow-purple-500/60
        hover:scale-110
        active:scale-95

        transition-all duration-300
      "
    >
      <FaArrowUp className="text-xs sm:text-base" />
    </button>
  );
}

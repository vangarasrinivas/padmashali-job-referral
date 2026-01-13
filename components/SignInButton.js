"use client";

import Link from "next/link";
import { FiLogIn, FiUser } from "react-icons/fi";

const SignInButton = ({
  href = "/login",
  label = "Sign In",
  icon = "login", // "login" | "user"
  className = "",
}) => {
  const Icon = icon === "user" ? FiUser : FiLogIn;

  return (
    <Link
      href={href}
      className={`
        group inline-flex items-center gap-2
        px-5 py-2
        rounded-full
        bg-white text-[#9743e4]
        font-semibold
        shadow-sm
        transition-all duration-300 ease-out
        hover:shadow-lg
        hover:-translate-y-0.5
        focus:outline-none focus:ring-2 focus:ring-white/70
        text-sm
        ${className}
      `}
    >
      <Icon
        className="
          text-lg
          transition-transform duration-300
          group-hover:translate-x-1
        "
      />
      <span>{label}</span>
    </Link>
  );
};

export default SignInButton;

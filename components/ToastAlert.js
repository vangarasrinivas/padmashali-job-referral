"use client";

import { useEffect, useState } from "react";

export default function ToastAlert({ type, message, onClose }) {
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setClosing(true);
      setTimeout(onClose, 300); // wait for exit animation
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={`fixed top-20 right-5 z-50 min-w-[280px] max-w-sm px-5 py-4 rounded-xl shadow-lg border
        ${closing ? "toast-exit" : "toast-enter"}
        ${
          type === "success"
            ? "bg-green-50 border-green-200 text-green-700"
            : "bg-red-50 border-red-200 text-red-700"
        }
      `}
    >
      <div className="flex items-start gap-3">
        <span className="text-lg">
          {type === "success" ? "✅" : "❌"}
        </span>
        <p className="text-sm font-medium">{message}</p>
      </div>
    </div>
  );
}

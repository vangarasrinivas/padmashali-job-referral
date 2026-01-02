"use client";

import { FaEnvelope, FaPhoneAlt, FaPaperPlane } from "react-icons/fa";

export default function ContactSection() {
  return (
    <section className="mt-10" id='contact'>
      <div
        className="
          relative overflow-hidden
          rounded-3xl
          bg-white
          shadow-xl shadow-purple-500/10
          border border-gray-100
        "
      >
        {/* Top Gradient Line */}
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#9743e4] to-[#7a33c9]" />

        <div className="p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* ================= LEFT : CONTACT INFO ================= */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">
              Get in Touch
            </h2>

            <p className="text-gray-500 mt-2 max-w-md">
              Have questions, suggestions, or need help?  
              Reach out to us anytime.
            </p>

            {/* Email */}
            <div className="mt-8 flex items-center gap-4">
              <div
                className="
                  h-10 w-10 sm:h-12 sm:w-12
                  rounded-xl sm:rounded-2xl
                  bg-gradient-to-br from-purple-100 to-purple-200
                  text-purple-700
                  flex items-center justify-center
                "
              >
                <FaEnvelope className="text-sm sm:text-base" />
              </div>

              <div>
                <p className="text-xs sm:text-sm text-gray-500">Email</p>
                <a
                  href="mailto:padmashalijobreferralcommunity@gmail.com"
                  className="text-sm font-medium text-gray-900 hover:underline break-all"
                >
                  padmashalijobreferralcommunity@gmail.com
                </a>
              </div>
            </div>

            {/* Phone */}
            <div className="mt-6 flex items-center gap-4">
              <div
                className="
                  h-10 w-10 sm:h-12 sm:w-12
                  rounded-xl sm:rounded-2xl
                  bg-gradient-to-br from-purple-100 to-purple-200
                  text-purple-700
                  flex items-center justify-center
                "
              >
                <FaPhoneAlt className="text-sm sm:text-base" />
              </div>

              <div>
                <p className="text-xs sm:text-sm text-gray-500">Phone</p>
                <a
                  href="tel:+918919685595"
                  className="text-sm font-medium text-gray-900 hover:underline"
                >
                  +91 8919685595
                </a>
              </div>
            </div>

            <p className="mt-6 text-sm text-gray-400">
              Available Mon–Fri, 10am – 6pm
            </p>
          </div>

          {/* ================= RIGHT : CONTACT FORM ================= */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              alert("Thanks! We will get back to you soon.");
            }}
            className="space-y-5"
          >
            <input
              required
              placeholder="Your name"
              className="
                w-full px-4 py-3
                rounded-xl
                bg-gray-50
                border border-gray-200
                focus:outline-none focus:ring-2 focus:ring-purple-500
                focus:bg-white
                transition
              "
            />

            <input
              type="email"
              required
              placeholder="Your email"
              className="
                w-full px-4 py-3
                rounded-xl
                bg-gray-50
                border border-gray-200
                focus:outline-none focus:ring-2 focus:ring-purple-500
                focus:bg-white
                transition
              "
            />

            <textarea
              rows={4}
              required
              placeholder="Your message"
              className="
                w-full px-4 py-3
                rounded-xl
                bg-gray-50
                border border-gray-200
                resize-none
                focus:outline-none focus:ring-2 focus:ring-purple-500
                focus:bg-white
                transition
              "
            />

            <button
              type="submit"
              className="
                inline-flex items-center gap-3
                px-6 py-3
                rounded-xl
                bg-gradient-to-r from-[#9743e4] to-[#7a33c9]
                text-white font-medium
                shadow-lg shadow-purple-500/30
                hover:shadow-purple-500/50
                hover:scale-[1.03]
                active:scale-95
                transition-all
              "
            >
              <FaPaperPlane size={14} />
              Send Message
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

"use client";

import { useEffect, useState, useRef } from "react";
import { getSettings } from "@/lib/jobs";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

export default function SettingsCarousel() {
  const [settings, setSettings] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const intervalRef = useRef(null);

  /* ================= FETCH ================= */
  useEffect(() => {
    const load = async () => {
      try {
        const data = await getSettings();
        setSettings(data || {});
      } catch (err) {
        console.error(err);
        setSettings({});
      }
    };
    load();
  }, []);

  /* ================= AUTO SLIDE ================= */
  const startAutoSlide = () => {
    if (!settings?.images?.length) return;

    intervalRef.current = setInterval(() => {
      setCurrentSlide((prev) =>
        (prev + 1) % settings.images.length
      );
    }, 2000);
  };

  const stopAutoSlide = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  useEffect(() => {
    startAutoSlide();
    return () => stopAutoSlide();
  }, [settings?.images?.length]);

  /* ================= NAVIGATION ================= */
  const nextSlide = () => {
    setCurrentSlide((prev) =>
      (prev + 1) % settings.images.length
    );
  };

  const prevSlide = () => {
    setCurrentSlide((prev) =>
      prev === 0 ? settings.images.length - 1 : prev - 1
    );
  };

  /* ================= STATES ================= */
  if (settings === null) {
    return (
      <div className="w-full h-[180px] flex items-center justify-center text-gray-400">
        Loading...
      </div>
    );
  }

  if (settings?.allowCarousel === false) return null;

  if (!settings?.images?.length) {
    return (
      <div className="w-full h-[180px] flex items-center justify-center text-gray-400">
        No images available
      </div>
    );
  }

  return (
    <div
      className="w-full px-2 sm:px-0 relative mt-4"
      onMouseEnter={stopAutoSlide}
      onMouseLeave={startAutoSlide}
    >
        {/* {
            settings?.images?.length > 0 && (
                <h2 className="text-xl font-semibold text-gray-700 mb-3">
                    Featured
                </h2>
            )
        } */}

      {/* ================= IMAGE ================= */}
      <div className="flex justify-center">
        <div
          key={currentSlide}
          className="
            relative
            w-full 
            max-w-full sm:max-w-xl md:max-w-2xl lg:max-w-3xl
            h-[180px] sm:h-[240px] md:h-[300px] lg:h-[350px]
            rounded-lg sm:rounded-xl 
            overflow-hidden shadow 
            animate-fadeIn
          "
        >

          <img
            src={settings.images[currentSlide]}
            alt="carousel"
            className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
          />

          {/* ================= LEFT ARROW ================= */}
          <button
            onClick={prevSlide}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full"
          >
            <FaChevronLeft size={14} />
          </button>

          {/* ================= RIGHT ARROW ================= */}
          <button
            onClick={nextSlide}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full"
          >
            <FaChevronRight size={14} />
          </button>

        </div>
      </div>

      {/* ================= DOTS ================= */}
      <div className="flex justify-center gap-3 mt-3 sm:mt-4">
        {settings.images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`
              transition-all duration-300 rounded-full
              ${currentSlide === index
                ? "w-5 h-2 bg-purple-600"
                : "w-2 h-2 bg-gray-300"}
            `}
          />
        ))}
      </div>
    </div>
  );
}
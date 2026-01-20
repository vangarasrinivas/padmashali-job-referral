"use client";

import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function AdminAnalytics() {
  const [total, setTotal] = useState(0);
  const [todayUsers, setTodayUsers] = useState(0);

  useEffect(() => {
    const fetchStats = async () => {
      const ref = doc(db, "analytics", "visitors");
      const snap = await getDoc(ref);

      if (snap.exists()) {
        const data = snap.data();
        const today = new Date().toISOString().split("T")[0];

        setTotal(data.total || 0);
        setTodayUsers(data.daily?.[today] || 0);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Analytics</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="bg-white shadow rounded p-4">
          <p className="text-gray-500">Total Visitors</p>
          <p className="text-3xl font-bold text-purple-600">
            {total}
          </p>
        </div>

        <div className="bg-white shadow rounded p-4">
          <p className="text-gray-500">Today Users</p>
          <p className="text-3xl font-bold text-green-600">
            {todayUsers}
          </p>
        </div>
      </div>
    </div>
  );
}

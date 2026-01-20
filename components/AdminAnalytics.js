"use client";

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

const getLast7Days = () => {
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(d.toISOString().split("T")[0]);
  }
  return days;
};

const VisitorsChart = () => {
  const [data, setData] = useState([]);
  const [totalVisitors, setTotalVisitors] = useState(0);
  const [todayVisitors, setTodayVisitors] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const ref = doc(db, "analytics", "visitors");
      const snap = await getDoc(ref);

      if (!snap.exists()) return;

      const docData = snap.data();
      const daily = docData.daily || {};
      setTotalVisitors(docData.total || 0);

      const today = new Date().toISOString().split("T")[0];
      setTodayVisitors(daily[today] || 0);

      const days = getLast7Days();
      const chartData = days.map((day) => ({
        day: day.slice(5), // MM-DD
        visitors: daily[day] || 0,
      }));

      setData(chartData);
    };

    fetchData();
  }, []);

  return (
    <div className="bg-white p-6 rounded-lg shadow space-y-6">
      {/* Visitors Stats */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex-1 bg-purple-50 rounded-lg p-4 text-center shadow">
          <h3 className="text-gray-500 text-sm">Total Visitors</h3>
          <p className="text-2xl font-semibold text-purple-700">{totalVisitors}</p>
        </div>
        <div className="flex-1 bg-purple-50 rounded-lg p-4 text-center shadow">
          <h3 className="text-gray-500 text-sm">Today Visitors</h3>
          <p className="text-2xl font-semibold text-purple-700">{todayVisitors}</p>
        </div>
      </div>

      {/* Line Chart */}
      <div>
        <h2 className="text-lg font-semibold mb-4 text-gray-700">
          Visitors (Last 7 Days)
        </h2>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="visitors"
              stroke="#9743e4"
              strokeWidth={3}
              dot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default VisitorsChart;

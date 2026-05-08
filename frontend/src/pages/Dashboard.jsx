import React, { useEffect, useState } from "react";
import Layout from "../components/layout/Layout";
import { getDashboardStats } from "../api/dashboardApi";

import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
  LineChart,
  Line,
} from "recharts";

import {
  Users,
  UserPlus,
  CheckCircle,
  XCircle,
  DollarSign,
  TrendingUp,
  Activity,
  Target,
  Layers,
} from "lucide-react";

const money = (v) => `$${Number(v || 0).toLocaleString("en-US")}`;

const COLORS = ["#0d9488", "#06b6d4", "#22c55e", "#ef4444"];

function Dashboard() {
  const [stats, setStats] = useState(null);

  const fetchStats = async () => {
    try {
      const res = await getDashboardStats();
      setStats(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchStats();
    const t = setInterval(fetchStats, 5000);
    return () => clearInterval(t);
  }, []);

  if (!stats) {
    return (
      <Layout>
        <div className="p-6 text-gray-500">Loading dashboard...</div>
      </Layout>
    );
  }

  const leadStatus = [
    { name: "New", value: stats.newLeads },
    { name: "Qualified", value: stats.qualifiedLeads },
    { name: "Won", value: stats.wonLeads },
    { name: "Lost", value: stats.lostLeads },
  ];

  const sourceData = stats.sources || [];

  const revenue = [
    {
      name: "Revenue",
      total: stats.totalDealValue,
      won: stats.wonDealValue,
    },
  ];

  return (
    <Layout>
      <div className="p-6 bg-white rounded-2xl min-h-screen space-y-6">

        {/* HEADER */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              CRM Dashboard
            </h1>
            <p className="text-gray-500 text-sm">
              Sales overview & pipeline analytics
            </p>
          </div>

          <div className="bg-white border px-4 py-2 rounded-xl text-sm text-gray-600">
            Live Data
          </div>
        </div>

        {/* KPI CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">

          <KpiCard
            title="Total Leads"
            value={stats.totalLeads}
            icon={<Users />}
          />

          <KpiCard
            title="New Leads"
            value={stats.newLeads}
            icon={<UserPlus />}
          />

          <KpiCard
            title="Qualified Leads"
            value={stats.qualifiedLeads}
            icon={<Target />}
          />

          <KpiCard
            title="Won Leads"
            value={stats.wonLeads}
            icon={<CheckCircle />}
          />

          <KpiCard
            title="Lost Leads"
            value={stats.lostLeads}
            icon={<XCircle />}
          />

          <KpiCard
            title="Total Estimated Deal Value"
            value={money(stats.totalDealValue)}
            icon={<DollarSign />}
          />

          <KpiCard
            title="Won Deal Value"
            value={money(stats.wonDealValue)}
            icon={<TrendingUp />}
          />

        </div>

        {/* CHARTS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          <Card title="Lead Source Performance">
            <ResponsiveContainer width="100%" height={320}>
              <BarChart
                data={sourceData}
                layout="vertical"
                margin={{ top: 10, right: 30, left: 40, bottom: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />

                {/* Y-axis becomes categories (sources) */}
                <YAxis
                  type="category"
                  dataKey="name"
                  width={120}
                />

                {/* X-axis becomes values */}
                <XAxis type="number" />

                <Tooltip />
                <Legend />

                <Bar
                  dataKey="value"
                  fill="#0d9488"
                  radius={[0, 8, 8, 0]}
                  barSize={18}
                />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <Card title="Lead Status">
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={leadStatus}
                  innerRadius={70}
                  outerRadius={110}
                  dataKey="value"
                >
                  {leadStatus.map((_, i) => (
                    <Cell key={i} fill={COLORS[i]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>

          <Card title="Revenue Growth">
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={revenue}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line dataKey="total" stroke="#0d9488" strokeWidth={3} />
                <Line dataKey="won" stroke="#22c55e" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          <Card title="CRM Insights">
            <div className="space-y-3 text-sm">
              <Insight label="Best Source" value="Website" />
              <Insight label="Win Rate" value={`${stats.winRate || 0}%`} />
              <Insight label="Active Pipeline" value={stats.qualifiedLeads} />
              <Insight label="Total Revenue" value={money(stats.totalDealValue)} />
            </div>
          </Card>

        </div>

        {/* ACTIVITY */}
        <div className="bg-white border rounded-2xl p-5">
          <h2 className="font-semibold mb-3 flex items-center gap-2">
            <Activity className="text-teal-600" /> Recent Activity
          </h2>

          <ul className="text-sm text-gray-600 space-y-2">
            {(stats.recentLeads || []).slice(0, 5).map((l, i) => (
              <li key={i} className="flex justify-between border-b pb-2">
                <span>{l.name} added</span>
                <span className="text-gray-400">{l.source}</span>
              </li>
            ))}
          </ul>
        </div>

      </div>
    </Layout>
  );
}

function KpiCard({ title, value, icon }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let start = 0;

    const numeric = parseFloat(
      String(value).replace(/[^0-9.]/g, "")
    ) || 0;

    const duration = 800;
    const step = Math.ceil(numeric / (duration / 16));

    const interval = setInterval(() => {
      start += step;
      if (start >= numeric) {
        start = numeric;
        clearInterval(interval);
      }
      setDisplayValue(start);
    }, 16);

    return () => clearInterval(interval);
  }, [value]);

  const isCurrency = String(value).includes("$");
  const isPercent = String(value).includes("%");

  const formatted =
    isCurrency
      ? `$${displayValue.toLocaleString("en-US")}`
      : isPercent
        ? `${displayValue}%`
        : displayValue.toLocaleString("en-US");

  return (
    <div className="bg-white border rounded-2xl p-5 shadow-sm hover:shadow-md transition">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-gray-500 text-sm">{title}</p>
          <h2 className="text-2xl font-bold text-gray-800">
            {formatted}
          </h2>
        </div>

        <div className="bg-teal-600 text-white p-3 rounded-xl">
          {icon}
        </div>
      </div>
    </div>
  );
}

function Card({ title, children }) {
  return (
    <div className="bg-white border rounded-2xl p-5 shadow-sm">
      <h2 className="font-semibold mb-4 text-gray-800">{title}</h2>
      {children}
    </div>
  );
}

function Insight({ label, value }) {
  return (
    <div className="flex justify-between border-b pb-2">
      <span className="text-gray-500">{label}</span>
      <span className="font-semibold text-gray-800">{value}</span>
    </div>
  );
}

export default Dashboard;
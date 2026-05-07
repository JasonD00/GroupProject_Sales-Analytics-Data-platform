import { useState } from "react";
import { useTheme } from "../context/ThemeContext";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, LineChart, Line,
} from "recharts";

function SalesChart({ data = [], type = "bar", title, isDetailed = false }) {
  const { isDark } = useTheme();
  const t = isDark ? dark : light;

  const [dateFilter, setDateFilter] = useState("all");

  // Apply filter only in detailed mode
  const filteredData = isDetailed && dateFilter !== "all" 
    ? data.slice(-parseInt(dateFilter)) 
    : data;

  return (
    <div style={{ ...styles.card, background: t.cardBg }}>
      <div style={styles.header}>
        <h3 style={{ ...styles.title, color: t.textPrimary }}>{title}</h3>
        {isDetailed && (
          <select 
            value={dateFilter} 
            onChange={(e) => setDateFilter(e.target.value)}
            style={{ ...styles.filter, background: t.inputBg, border: `1px solid ${t.border}`, color: t.textPrimary }}
          >
            <option value="all">All Time</option>
            <option value="12">Last 12 Months</option>
            <option value="6">Last 6 Months</option>
            <option value="3">Last 3 Months</option>
          </select>
        )}
      </div>

      {filteredData.length === 0 ? (
        <div style={{ ...styles.empty, border: `1px dashed ${t.border}`, color: t.textMuted }}>
          No data available
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={260}>
          {type === "line" ? (
            <LineChart data={filteredData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={t.grid} />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: t.textMuted }} />
              <YAxis tick={{ fontSize: 12, fill: t.textMuted }} />
              <Tooltip contentStyle={{ background: t.cardBg, border: `1px solid ${t.border}`, color: t.textPrimary }} />
              <Line type="monotone" dataKey="revenue" stroke={t.accent} strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          ) : (
            <BarChart data={filteredData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={t.grid} />
              <XAxis dataKey={Object.keys(filteredData[0] || {})[0]} tick={{ fontSize: 12, fill: t.textMuted }} />
              <YAxis tick={{ fontSize: 12, fill: t.textMuted }} />
              <Tooltip contentStyle={{ background: t.cardBg, border: `1px solid ${t.border}`, color: t.textPrimary }} />
              <Bar dataKey={Object.keys(filteredData[0] || {})[1]} fill={t.accent} radius={[4, 4, 0, 0]} />
            </BarChart>
          )}
        </ResponsiveContainer>
      )}
    </div>
  );
}

const light = {
  cardBg: "#ffffff",
  textPrimary: "#1a2a6c",
  textMuted: "#888",
  border: "#e0e4ef",
  grid: "#f0f0f0",
  accent: "#1a2a6c",
  inputBg: "#ffffff",
};

const dark = {
  cardBg: "#1e293b",
  textPrimary: "#e2e8f0",
  textMuted: "#94a3b8",
  border: "#334155",
  grid: "#334155",
  accent: "#7c9fff",
  inputBg: "#0f172a",
};

const styles = {
  card: {
    borderRadius: "10px",
    padding: "20px 24px",
    boxShadow: "0 1px 4px rgba(0,0,0,0.07)",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "16px",
  },
  title: {
    margin: 0,
    fontSize: "15px",
    fontWeight: "700",
  },
  filter: {
    padding: "6px 12px",
    borderRadius: "6px",
    fontSize: "13px",
    cursor: "pointer",
    outline: "none",
  },
  empty: {
    height: "260px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "14px",
    borderRadius: "8px",
  },
};

export default SalesChart;
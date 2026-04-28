import { useTheme } from "../context/ThemeContext";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, LineChart, Line,
} from "recharts";

function SalesChart({ data = [], type = "bar", title }) {
  const { isDark } = useTheme();
  const t = isDark ? dark : light;

  return (
    <div style={{ ...styles.card, background: t.cardBg }}>
      <h3 style={{ ...styles.title, color: t.textPrimary }}>{title}</h3>
      {data.length === 0 ? (
        <div style={{ ...styles.empty, border: `1px dashed ${t.border}`, color: t.textMuted }}>
          No data available
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={260}>
          {type === "line" ? (
            <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={t.grid} />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: t.textMuted }} />
              <YAxis tick={{ fontSize: 12, fill: t.textMuted }} />
              <Tooltip contentStyle={{ background: t.cardBg, border: `1px solid ${t.border}`, color: t.textPrimary }} />
              <Line type="monotone" dataKey="revenue" stroke={t.accent} strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          ) : (
            <BarChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={t.grid} />
              <XAxis dataKey={Object.keys(data[0] || {})[0]} tick={{ fontSize: 12, fill: t.textMuted }} />
              <YAxis tick={{ fontSize: 12, fill: t.textMuted }} />
              <Tooltip contentStyle={{ background: t.cardBg, border: `1px solid ${t.border}`, color: t.textPrimary }} />
              <Bar dataKey={Object.keys(data[0] || {})[1]} fill={t.accent} radius={[4, 4, 0, 0]} />
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
};

const dark = {
  cardBg: "#1e293b",
  textPrimary: "#e2e8f0",
  textMuted: "#94a3b8",
  border: "#334155",
  grid: "#334155",
  accent: "#7c9fff",
};

const styles = {
  card: {
    borderRadius: "10px",
    padding: "20px 24px",
    boxShadow: "0 1px 4px rgba(0,0,0,0.07)",
  },
  title: {
    margin: "0 0 16px 0",
    fontSize: "15px",
    fontWeight: "700",
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
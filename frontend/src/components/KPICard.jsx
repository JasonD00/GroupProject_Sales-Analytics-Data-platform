import { useTheme } from "../context/ThemeContext";

function KPICard({ label, value, change, up }) {
  const { isDark } = useTheme();
  const t = isDark ? dark : light;

  return (
    <div style={{ ...styles.card, background: t.cardBg, borderTop: `4px solid ${t.accent}` }}>
      <span style={{ ...styles.label, color: t.textMuted }}>{label}</span>
      <span style={{ ...styles.value, color: t.textPrimary }}>{value}</span>
      <span style={{ ...styles.change, color: up ? "#16a34a" : "#dc2626" }}>
        {up ? "▲" : "▼"} {change} vs last month
      </span>
    </div>
  );
}

const light = {
  cardBg: "#ffffff",
  accent: "#1a2a6c",
  textPrimary: "#1a2a6c",
  textMuted: "#888",
};

const dark = {
  cardBg: "#1e293b",
  accent: "#7c9fff",
  textPrimary: "#e2e8f0",
  textMuted: "#94a3b8",
};

const styles = {
  card: {
    borderRadius: "10px",
    padding: "20px 24px",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    boxShadow: "0 1px 4px rgba(0,0,0,0.07)",
  },
  label: {
    fontSize: "12px",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: "0.6px",
  },
  value: {
    fontSize: "28px",
    fontWeight: "700",
  },
  change: {
    fontSize: "12px",
    fontWeight: "600",
  },
};

export default KPICard;
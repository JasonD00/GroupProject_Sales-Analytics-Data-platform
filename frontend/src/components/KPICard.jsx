function KPICard({ label, value, change, up }) {
  return (
    <div style={styles.card}>
      <span style={styles.label}>{label}</span>
      <span style={styles.value}>{value}</span>
    </div>
  );
}

const styles = {
  card: {
    background: "#fff",
    borderRadius: "10px",
    padding: "20px 24px",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    boxShadow: "0 1px 4px rgba(0,0,0,0.07)",
    borderTop: "4px solid #1a2a6c",
  },
  label: {
    fontSize: "12px",
    fontWeight: "600",
    color: "#888",
    textTransform: "uppercase",
    letterSpacing: "0.6px",
  },
  value: {
    fontSize: "28px",
    fontWeight: "700",
    color: "#1a2a6c",
  },
  change: {
    fontSize: "12px",
    fontWeight: "600",
  },
};

export default KPICard;
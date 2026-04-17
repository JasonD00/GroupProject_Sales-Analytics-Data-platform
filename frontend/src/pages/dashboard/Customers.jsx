import { useTheme } from "../../context/ThemeContext";

function Customers() {
  const { isDark } = useTheme();
  const t = isDark ? dark : light;
  const customers = [];

  return (
    <div style={styles.wrapper}>
      <div style={styles.header}>
        <h2 style={{ ...styles.title, color: t.textPrimary }}>Customers</h2>
        <button style={{ ...styles.addBtn, background: t.btnBg, color: t.btnText }}>+ Add Customer</button>
      </div>

      <div style={{ ...styles.tableCard, background: t.cardBg }}>
        <table style={styles.table}>
          <thead>
            <tr>
              {["ID", "Name", "Email", "Region", "Total Spend", "Status"].map((h) => (
                <th key={h} style={{ ...styles.th, background: t.theadBg, color: t.textSecondary }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {customers.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ ...styles.emptyCell, color: t.textMuted }}>No customers found.</td>
              </tr>
            ) : (
              customers.map((c) => (
                <tr key={c.id} style={{ borderBottom: `1px solid ${t.border}` }}>
                  <td style={{ ...styles.td, color: t.textPrimary }}>{c.id}</td>
                  <td style={{ ...styles.td, color: t.textPrimary }}>{c.name}</td>
                  <td style={{ ...styles.td, color: t.textPrimary }}>{c.email}</td>
                  <td style={{ ...styles.td, color: t.textPrimary }}>{c.region}</td>
                  <td style={{ ...styles.td, color: t.textPrimary, fontWeight: "600" }}>${c.totalSpend.toLocaleString()}</td>
                  <td style={styles.td}>
                    <span style={{ ...styles.badge, background: c.status === "Active" ? "#dcfce7" : "#fee2e2", color: c.status === "Active" ? "#16a34a" : "#dc2626" }}>
                      {c.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const light = {
  textPrimary: "#1a2a6c", textSecondary: "#555", textMuted: "#aaa",
  cardBg: "#ffffff", theadBg: "#f8f9fc", border: "#f0f2f7",
  btnBg: "#1a2a6c", btnText: "#fff",
};

const dark = {
  textPrimary: "#e2e8f0", textSecondary: "#94a3b8", textMuted: "#64748b",
  cardBg: "#1e293b", theadBg: "#0f172a", border: "#334155",
  btnBg: "#7c9fff", btnText: "#0f172a",
};

const styles = {
  wrapper:   { display: "flex", flexDirection: "column", gap: "20px" },
  header:    { display: "flex", justifyContent: "space-between", alignItems: "center" },
  title:     { margin: 0, fontSize: "18px", fontWeight: "700" },
  addBtn:    { padding: "9px 18px", borderRadius: "6px", border: "none", fontWeight: "600", cursor: "pointer", fontSize: "14px" },
  tableCard: { borderRadius: "10px", boxShadow: "0 1px 4px rgba(0,0,0,0.07)", overflow: "hidden" },
  table:     { width: "100%", borderCollapse: "collapse", fontSize: "14px" },
  th:        { textAlign: "left", padding: "10px 20px", fontWeight: "600", fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.4px" },
  td:        { padding: "12px 20px" },
  emptyCell: { padding: "40px", textAlign: "center", fontSize: "14px" },
  badge:     { padding: "3px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: "600" },
};

export default Customers;
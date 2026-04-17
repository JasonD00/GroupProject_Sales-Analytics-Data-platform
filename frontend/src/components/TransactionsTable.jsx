import { useState } from "react";
import { useTheme } from "../context/ThemeContext";

const STATUS_STYLES = {
  Completed: { background: "#dcfce7", color: "#16a34a" },
  Pending:   { background: "#fef9c3", color: "#ca8a04" },
  Failed:    { background: "#fee2e2", color: "#dc2626" },
};

function TransactionsTable({ transactions = [] }) {
  const { isDark } = useTheme();
  const t = isDark ? dark : light;

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const filtered = transactions.filter((tx) => {
    const matchesSearch =
      tx.customer.toLowerCase().includes(search.toLowerCase()) ||
      tx.product.toLowerCase().includes(search.toLowerCase()) ||
      tx.id.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "All" || tx.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div style={{ ...styles.wrapper, background: t.cardBg }}>
      <div style={{ ...styles.toolbar, borderBottom: `1px solid ${t.border}` }}>
        <input
          type="text"
          placeholder="Search by ID, customer or product..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ ...styles.searchInput, background: t.inputBg, border: `1px solid ${t.border}`, color: t.textPrimary }}
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{ ...styles.select, background: t.inputBg, border: `1px solid ${t.border}`, color: t.textPrimary }}
        >
          <option value="All">All Statuses</option>
          <option value="Completed">Completed</option>
          <option value="Pending">Pending</option>
          <option value="Failed">Failed</option>
        </select>
      </div>

      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr>
              {["ID", "Customer", "Product", "Rep", "Amount", "Date", "Status"].map((h) => (
                <th key={h} style={{ ...styles.th, background: t.theadBg, color: t.textSecondary }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ ...styles.emptyCell, color: t.textMuted }}>No transactions found.</td>
              </tr>
            ) : (
              filtered.map((tx) => (
                <tr key={tx.id} style={{ borderBottom: `1px solid ${t.border}` }}>
                  <td style={{ ...styles.td, color: t.textPrimary }}>{tx.id}</td>
                  <td style={{ ...styles.td, color: t.textPrimary }}>{tx.customer}</td>
                  <td style={{ ...styles.td, color: t.textPrimary }}>{tx.product}</td>
                  <td style={{ ...styles.td, color: t.textPrimary }}>{tx.rep}</td>
                  <td style={{ ...styles.td, color: t.textPrimary, fontWeight: "600" }}>${tx.amount.toLocaleString()}</td>
                  <td style={{ ...styles.td, color: t.textPrimary }}>{tx.date}</td>
                  <td style={styles.td}>
                    <span style={{ ...styles.badge, ...STATUS_STYLES[tx.status] }}>
                      {tx.status}
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
  cardBg: "#ffffff",
  border: "#f0f2f7",
  inputBg: "#ffffff",
  theadBg: "#f8f9fc",
  textPrimary: "#333",
  textSecondary: "#555",
  textMuted: "#aaa",
};

const dark = {
  cardBg: "#1e293b",
  border: "#334155",
  inputBg: "#0f172a",
  theadBg: "#0f172a",
  textPrimary: "#e2e8f0",
  textSecondary: "#94a3b8",
  textMuted: "#64748b",
};

const styles = {
  wrapper: {
    borderRadius: "10px",
    boxShadow: "0 1px 4px rgba(0,0,0,0.07)",
    overflow: "hidden",
  },
  toolbar: {
    display: "flex",
    gap: "12px",
    padding: "16px 20px",
  },
  searchInput: {
    flex: 1,
    padding: "9px 14px",
    borderRadius: "6px",
    fontSize: "14px",
    outline: "none",
  },
  select: {
    padding: "9px 14px",
    borderRadius: "6px",
    fontSize: "14px",
    cursor: "pointer",
  },
  tableWrapper: {
    overflowX: "auto",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "14px",
  },
  th: {
    textAlign: "left",
    padding: "10px 20px",
    fontWeight: "600",
    fontSize: "12px",
    textTransform: "uppercase",
    letterSpacing: "0.4px",
    whiteSpace: "nowrap",
  },
  td: {
    padding: "12px 20px",
    whiteSpace: "nowrap",
  },
  emptyCell: {
    padding: "40px",
    textAlign: "center",
    fontSize: "14px",
  },
  badge: {
    padding: "3px 10px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "600",
  },
};

export default TransactionsTable;
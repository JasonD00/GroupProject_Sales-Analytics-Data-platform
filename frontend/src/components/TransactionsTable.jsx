import { useState } from "react";

const STATUS_STYLES = {
  Completed: { background: "#dcfce7", color: "#16a34a" },
  Pending:   { background: "#fef9c3", color: "#ca8a04" },
  Failed:    { background: "#fee2e2", color: "#dc2626" },
};

function TransactionsTable({ transactions = [] }) {
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
    <div style={styles.wrapper}>
      <div style={styles.toolbar}>
        <input
          type="text"
          placeholder="Search by ID, customer or product..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={styles.searchInput}
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={styles.select}
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
                <th key={h} style={styles.th}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} style={styles.emptyCell}>No transactions found.</td>
              </tr>
            ) : (
              filtered.map((tx) => (
                <tr key={tx.id} style={styles.tr}>
                  <td style={styles.td}>{tx.id}</td>
                  <td style={styles.td}>{tx.customer}</td>
                  <td style={styles.td}>{tx.product}</td>
                  <td style={styles.td}>{tx.rep}</td>
                  <td style={{ ...styles.td, fontWeight: "600" }}>${tx.amount.toLocaleString()}</td>
                  <td style={styles.td}>{tx.date}</td>
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

const styles = {
  wrapper: {
    background: "#fff",
    borderRadius: "10px",
    boxShadow: "0 1px 4px rgba(0,0,0,0.07)",
    overflow: "hidden",
  },
  toolbar: {
    display: "flex",
    gap: "12px",
    padding: "16px 20px",
    borderBottom: "1px solid #f0f2f7",
  },
  searchInput: {
    flex: 1,
    padding: "9px 14px",
    borderRadius: "6px",
    border: "1px solid #dde1ee",
    fontSize: "14px",
    outline: "none",
  },
  select: {
    padding: "9px 14px",
    borderRadius: "6px",
    border: "1px solid #dde1ee",
    fontSize: "14px",
    background: "#fff",
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
    background: "#f8f9fc",
    color: "#555",
    fontWeight: "600",
    fontSize: "12px",
    textTransform: "uppercase",
    letterSpacing: "0.4px",
    whiteSpace: "nowrap",
  },
  tr: {
    borderBottom: "1px solid #f0f2f7",
  },
  td: {
    padding: "12px 20px",
    color: "#333",
    whiteSpace: "nowrap",
  },
  emptyCell: {
    padding: "40px",
    textAlign: "center",
    color: "#aaa",
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
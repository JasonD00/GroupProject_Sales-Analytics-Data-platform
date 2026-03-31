function Customers() {
  const customers = [];

  return (
    <div style={styles.wrapper}>
      <div style={styles.header}>
        <h2 style={styles.title}>Customers</h2>
        <button style={styles.addBtn}>+ Add Customer</button>
      </div>

      <div style={styles.tableCard}>
        <table style={styles.table}>
          <thead>
            <tr>
              {["ID", "Name", "Email", "Region", "Total Spend", "Status"].map((h) => (
                <th key={h} style={styles.th}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {customers.length === 0 ? (
              <tr>
                <td colSpan={6} style={styles.emptyCell}>No customers found.</td>
              </tr>
            ) : (
              customers.map((c) => (
                <tr key={c.id} style={styles.tr}>
                  <td style={styles.td}>{c.id}</td>
                  <td style={styles.td}>{c.name}</td>
                  <td style={styles.td}>{c.email}</td>
                  <td style={styles.td}>{c.region}</td>
                  <td style={{ ...styles.td, fontWeight: "600" }}>${c.totalSpend.toLocaleString()}</td>
                  <td style={styles.td}>
                    <span style={{
                      ...styles.badge,
                      background: c.status === "Active" ? "#dcfce7" : "#fee2e2",
                      color: c.status === "Active" ? "#16a34a" : "#dc2626",
                    }}>
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

const styles = {
  wrapper: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    margin: 0,
    fontSize: "18px",
    fontWeight: "700",
    color: "#1a2a6c",
  },
  addBtn: {
    padding: "9px 18px",
    borderRadius: "6px",
    border: "none",
    background: "#1a2a6c",
    color: "#fff",
    fontWeight: "600",
    cursor: "pointer",
    fontSize: "14px",
  },
  tableCard: {
    background: "#fff",
    borderRadius: "10px",
    boxShadow: "0 1px 4px rgba(0,0,0,0.07)",
    overflow: "hidden",
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
  },
  tr: {
    borderBottom: "1px solid #f0f2f7",
  },
  td: {
    padding: "12px 20px",
    color: "#333",
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

export default Customers;
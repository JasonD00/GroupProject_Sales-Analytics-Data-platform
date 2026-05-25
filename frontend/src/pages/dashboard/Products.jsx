function Products() {
  const products = [];

  return (
    <div style={styles.wrapper}>
      <div style={styles.header}>
        <h2 style={styles.title}>Products</h2>
        <button style={styles.addBtn}>+ Add Product</button>
      </div>

      <div style={styles.tableCard}>
        <table style={styles.table}>
          <thead>
            <tr>
              {["ID", "Name", "Category", "Price", "Stock", "Status"].map((h) => (
                <th key={h} style={styles.th}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan={6} style={styles.emptyCell}>No products found.</td>
              </tr>
            ) : (
              products.map((p) => (
                <tr key={p.id} style={styles.tr}>
                  <td style={styles.td}>{p.id}</td>
                  <td style={styles.td}>{p.name}</td>
                  <td style={styles.td}>{p.category}</td>
                  <td style={{ ...styles.td, fontWeight: "600" }}>${p.price.toLocaleString()}</td>
                  <td style={styles.td}>{p.stock}</td>
                  <td style={styles.td}>
                    <span style={{
                      ...styles.badge,
                      background: p.status === "Active" ? "#dcfce7" : "#fee2e2",
                      color: p.status === "Active" ? "#16a34a" : "#dc2626",
                    }}>
                      {p.status}
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

export default Products;
import { useState } from "react";
import { useTheme } from "../../context/ThemeContext";

function Products() {
  const { isDark } = useTheme();
  const t = isDark ? dark : light;

  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Filter products
  const filteredProducts = MOCK_PRODUCTS.filter((product) => {
    const matchesCategory = categoryFilter === "all" || product.category === categoryFilter;
    const matchesStatus = statusFilter === "all" || product.status === statusFilter;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesStatus && matchesSearch;
  });

  const getStatusColor = (status) => {
    if (status === "Active") return t.success;
    if (status === "Low Stock") return t.warning;
    if (status === "Out of Stock") return t.danger;
    return t.textSecondary;
  };

  return (
    <div style={styles.wrapper}>
      
      {/* Summary Cards */}
      <div style={styles.summaryGrid}>
        <div style={{ ...styles.summaryCard, background: t.cardBg, border: `1px solid ${t.border}` }}>
          <div style={{ ...styles.summaryIcon, background: t.accentLight }}>📦</div>
          <div>
            <div style={{ ...styles.summaryLabel, color: t.textSecondary }}>Total Products</div>
            <div style={{ ...styles.summaryValue, color: t.textPrimary }}>24</div>
          </div>
        </div>

        <div style={{ ...styles.summaryCard, background: t.cardBg, border: `1px solid ${t.border}` }}>
          <div style={{ ...styles.summaryIcon, background: t.successLight }}>✓</div>
          <div>
            <div style={{ ...styles.summaryLabel, color: t.textSecondary }}>In Stock</div>
            <div style={{ ...styles.summaryValue, color: t.textPrimary }}>18</div>
          </div>
        </div>

        <div style={{ ...styles.summaryCard, background: t.cardBg, border: `1px solid ${t.border}` }}>
          <div style={{ ...styles.summaryIcon, background: t.warningLight }}>⚠</div>
          <div>
            <div style={{ ...styles.summaryLabel, color: t.textSecondary }}>Low Stock</div>
            <div style={{ ...styles.summaryValue, color: t.textPrimary }}>4</div>
          </div>
        </div>

        <div style={{ ...styles.summaryCard, background: t.cardBg, border: `1px solid ${t.border}` }}>
          <div style={{ ...styles.summaryIcon, background: t.dangerLight }}>✕</div>
          <div>
            <div style={{ ...styles.summaryLabel, color: t.textSecondary }}>Out of Stock</div>
            <div style={{ ...styles.summaryValue, color: t.textPrimary }}>2</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div style={{ ...styles.filterBar, background: t.cardBg, border: `1px solid ${t.border}` }}>
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            ...styles.searchInput,
            background: t.inputBg,
            border: `1px solid ${t.border}`,
            color: t.textPrimary,
          }}
        />

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          style={{ ...styles.select, background: t.inputBg, border: `1px solid ${t.border}`, color: t.textPrimary }}
        >
          <option value="all">All Categories</option>
          <option value="Basic">Basic</option>
          <option value="Professional">Professional</option>
          <option value="Enterprise">Enterprise</option>
          <option value="Add-on">Add-on</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{ ...styles.select, background: t.inputBg, border: `1px solid ${t.border}`, color: t.textPrimary }}
        >
          <option value="all">All Status</option>
          <option value="Active">Active</option>
          <option value="Low Stock">Low Stock</option>
          <option value="Out of Stock">Out of Stock</option>
        </select>
      </div>

      {/* Products Table */}
      <div style={{ ...styles.tableCard, background: t.cardBg, border: `1px solid ${t.border}` }}>
        <div style={styles.tableHeader}>
          <h3 style={{ ...styles.tableTitle, color: t.textPrimary }}>Product Catalog</h3>
          <button style={styles.addBtn}>+ Add Product</button>
        </div>
        
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr style={{ borderBottom: `2px solid ${t.border}` }}>
                <th style={{ ...styles.th, color: t.textPrimary }}>Product ID</th>
                <th style={{ ...styles.th, color: t.textPrimary }}>Name</th>
                <th style={{ ...styles.th, color: t.textPrimary }}>Category</th>
                <th style={{ ...styles.th, color: t.textPrimary }}>Price</th>
                <th style={{ ...styles.th, color: t.textPrimary }}>Stock</th>
                <th style={{ ...styles.th, color: t.textPrimary }}>Sold (YTD)</th>
                <th style={{ ...styles.th, color: t.textPrimary }}>Revenue (YTD)</th>
                <th style={{ ...styles.th, color: t.textPrimary }}>Status</th>
                <th style={{ ...styles.th, color: t.textPrimary }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product.id} style={{ borderBottom: `1px solid ${t.borderLight}` }}>
                  <td style={{ ...styles.td, color: t.textSecondary, fontFamily: "monospace" }}>
                    {product.id}
                  </td>
                  <td style={{ ...styles.td, color: t.textPrimary, fontWeight: "500" }}>
                    {product.name}
                  </td>
                  <td style={{ ...styles.td, color: t.textSecondary }}>{product.category}</td>
                  <td style={{ ...styles.td, color: t.textPrimary }}>€{product.price.toLocaleString()}</td>
                  <td style={{ ...styles.td, color: t.textSecondary }}>{product.stock}</td>
                  <td style={{ ...styles.td, color: t.textSecondary }}>{product.sold}</td>
                  <td style={{ ...styles.td, color: t.textPrimary }}>
                    €{(product.price * product.sold).toLocaleString()}
                  </td>
                  <td style={{ ...styles.td }}>
                    <span style={{ ...styles.statusBadge, background: getStatusColor(product.status) }}>
                      {product.status}
                    </span>
                  </td>
                  <td style={{ ...styles.td }}>
                    <button style={{ ...styles.actionBtn, color: t.accent }}>Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

// MOCK DATA
const MOCK_PRODUCTS = [
  { id: "PRD-001", name: "Starter Pack", category: "Basic", price: 1250, stock: 45, sold: 142, status: "Active" },
  { id: "PRD-002", name: "Pro License", category: "Professional", price: 3500, stock: 28, sold: 89, status: "Active" },
  { id: "PRD-003", name: "Enterprise Plan", category: "Enterprise", price: 8500, stock: 12, sold: 34, status: "Active" },
  { id: "PRD-004", name: "Add-on Bundle", category: "Add-on", price: 750, stock: 0, sold: 256, status: "Out of Stock" },
  { id: "PRD-005", name: "Starter Plus", category: "Basic", price: 1750, stock: 38, sold: 98, status: "Active" },
  { id: "PRD-006", name: "Pro Plus", category: "Professional", price: 4200, stock: 22, sold: 67, status: "Active" },
  { id: "PRD-007", name: "Enterprise Elite", category: "Enterprise", price: 12000, stock: 8, sold: 23, status: "Low Stock" },
  { id: "PRD-008", name: "Integration Pack", category: "Add-on", price: 950, stock: 15, sold: 145, status: "Active" },
  { id: "PRD-009", name: "Analytics Add-on", category: "Add-on", price: 650, stock: 5, sold: 189, status: "Low Stock" },
  { id: "PRD-010", name: "Support Package", category: "Add-on", price: 450, stock: 32, sold: 234, status: "Active" },
  { id: "PRD-011", name: "Basic Suite", category: "Basic", price: 2100, stock: 3, sold: 76, status: "Low Stock" },
  { id: "PRD-012", name: "Pro Suite", category: "Professional", price: 5500, stock: 18, sold: 45, status: "Active" },
];

// THEME
const light = {
  textPrimary: "#1a2a6c",
  textSecondary: "#555",
  cardBg: "#ffffff",
  border: "#e0e4ef",
  borderLight: "#f0f2f7",
  inputBg: "#ffffff",
  accent: "#1a2a6c",
  success: "#16a34a",
  warning: "#f59e0b",
  danger: "#dc2626",
  accentLight: "#e0e7ff",
  successLight: "#dcfce7",
  warningLight: "#fef3c7",
  dangerLight: "#fee2e2",
};

const dark = {
  textPrimary: "#e2e8f0",
  textSecondary: "#94a3b8",
  cardBg: "#1e293b",
  border: "#334155",
  borderLight: "#334155",
  inputBg: "#0f172a",
  accent: "#7c9fff",
  success: "#22c55e",
  warning: "#fbbf24",
  danger: "#ef4444",
  accentLight: "#1e3a8a",
  successLight: "#065f46",
  warningLight: "#78350f",
  dangerLight: "#7f1d1d",
};

// STYLES
const styles = {
  wrapper: {
    display: "flex",
    flexDirection: "column",
    gap: "24px",
  },
  summaryGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "16px",
  },
  summaryCard: {
    padding: "20px",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    gap: "16px",
  },
  summaryIcon: {
    width: "48px",
    height: "48px",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "24px",
  },
  summaryLabel: {
    fontSize: "12px",
    marginBottom: "4px",
  },
  summaryValue: {
    fontSize: "24px",
    fontWeight: "700",
  },
  filterBar: {
    padding: "20px",
    borderRadius: "10px",
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
  },
  searchInput: {
    flex: 1,
    minWidth: "200px",
    padding: "8px 14px",
    borderRadius: "6px",
    fontSize: "13px",
    outline: "none",
  },
  select: {
    padding: "8px 14px",
    borderRadius: "6px",
    fontSize: "13px",
    cursor: "pointer",
    outline: "none",
  },
  tableCard: {
    padding: "24px",
    borderRadius: "10px",
  },
  tableHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },
  tableTitle: {
    margin: 0,
    fontSize: "16px",
    fontWeight: "700",
  },
  addBtn: {
    padding: "8px 16px",
    background: "#1a2a6c",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    fontSize: "13px",
    fontWeight: "600",
    cursor: "pointer",
  },
  tableWrapper: {
    overflowX: "auto",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  th: {
    padding: "12px 16px",
    textAlign: "left",
    fontSize: "13px",
    fontWeight: "600",
  },
  td: {
    padding: "12px 16px",
    fontSize: "13px",
  },
  statusBadge: {
    padding: "4px 10px",
    borderRadius: "12px",
    fontSize: "11px",
    fontWeight: "600",
    color: "#fff",
  },
  actionBtn: {
    background: "transparent",
    border: "none",
    fontSize: "13px",
    fontWeight: "500",
    cursor: "pointer",
    textDecoration: "underline",
  },
};

export default Products;
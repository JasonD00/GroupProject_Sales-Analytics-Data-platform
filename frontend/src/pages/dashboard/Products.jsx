/*
  Overview:
  Visible only to Enterprise tier
  Shows a switchable revenue trend chart, stock charts and a product table with pricing,
  stock and year to date sales data
*/
import { useState, useRef, useEffect } from "react";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import * as Plot from "@observablehq/plot";
import ChartToggle from "../../components/ChartToggle";

function Products() {
  const { isDark } = useTheme();
  const { user }   = useAuth();
  const t    = isDark ? dark : light;
  const tier = user?.tier || "Growth";

  const stockChartRef = useRef(null);

  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter,   setStatusFilter]   = useState("all");
  const [searchTerm,     setSearchTerm]     = useState("");

  const filteredProducts = MOCK_PRODUCTS.filter((p) => {
    const matchCategory = categoryFilter === "all" || p.category === categoryFilter;
    const matchStatus   = statusFilter   === "all" || p.status   === statusFilter;
    const matchSearch   =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCategory && matchStatus && matchSearch;
  });

  const getStatusColor = (status) => {
    if (status === "Active")       return t.success;
    if (status === "Low Stock")    return t.warning;
    if (status === "Out of Stock") return t.danger;
    return t.textSecondary;
  };

  // KPIs
  const totalProducts   = MOCK_PRODUCTS.length;
  const inStockCount    = MOCK_PRODUCTS.filter(p => p.status === "Active").length;
  const lowStockCount   = MOCK_PRODUCTS.filter(p => p.status === "Low Stock").length;
  const outOfStockCount = MOCK_PRODUCTS.filter(p => p.status === "Out of Stock").length;

  // Stock levels 
  useEffect(() => {
    if (!stockChartRef.current) return;
    stockChartRef.current.innerHTML = "";

    const stockData = MOCK_PRODUCTS
      .slice()
      .sort((a, b) => b.stock - a.stock)
      .slice(0, 8)
      .map(p => ({ name: p.name, stock: p.stock }));

    const plot = Plot.plot({
      width:        stockChartRef.current.offsetWidth || 400,
      height:       260,
      marginLeft:   120,
      marginBottom: 38,
      marginTop:    8,
      marginRight:  16,
      marks: [
        Plot.barX(stockData, {
          x:    "stock",
          y:    "name",
          fill: isDark ? "#7c9fff" : "#1a2a6c",
          rx:   3,
          sort: { y: "-x" },
        }),
        Plot.text(stockData, {
          x:          "stock",
          y:          "name",
          text:       (d) => d.stock,
          dx:         8,
          fill:       isDark ? "#e2e8f0" : "#1a2a6c",
          fontSize:   "11px",
          fontWeight: "600",
        }),
        Plot.ruleX([0]),
      ],
      x: { label: "Units in Stock", grid: true, tickPadding: 6, tickSize: 4 },
      y: { label: null },
      style: {
        fontSize:   "11px",
        color:      t.textSecondary,
        background: "transparent",
      },
    });

    stockChartRef.current.appendChild(plot);
    return () => plot.remove();
  }, [isDark]);

  return (
    <div style={styles.wrapper}>

      {/* Summary cards */}
      <div style={styles.summaryGrid}>
        {[
          { label: "Total Products", value: totalProducts,   accent: t.accentLight  },
          { label: "In Stock",       value: inStockCount,    accent: t.successLight },
          { label: "Low Stock",      value: lowStockCount,   accent: t.warningLight },
          { label: "Out of Stock",   value: outOfStockCount, accent: t.dangerLight  },
        ].map((card) => (
          <div
            key={card.label}
            style={{
              ...styles.summaryCard,
              background: t.cardBg,
              border:     `1px solid ${t.border}`,
            }}
          >
            <div style={{ ...styles.summaryAccent, background: card.accent }} />
            <div>
              <div style={{ ...styles.summaryLabel, color: t.textSecondary }}>{card.label}</div>
              <div style={{ ...styles.summaryValue, color: t.textPrimary }}>{card.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div style={styles.chartsGrid}>

        {/* Revenue by month */}
        <div style={{ ...styles.chartCard, background: t.cardBg, border: `1px solid ${t.border}` }}>
          <h3 style={{ ...styles.chartTitle, color: t.textPrimary }}>Product Revenue Trend</h3>
          <p style={{ ...styles.chartSub, color: t.textSecondary }}>Monthly revenue across all products</p>
          <ChartToggle
            data={MOCK_REVENUE}
            xKey="monthNum"
            yKey="revenue"
            xFormat={(d) => ["","Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][d]}
            xDomain={[0.5, 12.5]}
            yLabel="Revenue (€)"
            height={240}
            tier={tier}
          />
        </div>

        {/* Stock levels */}
        <div style={{ ...styles.chartCard, background: t.cardBg, border: `1px solid ${t.border}` }}>
          <h3 style={{ ...styles.chartTitle, color: t.textPrimary }}>Stock Levels</h3>
          <p style={{ ...styles.chartSub, color: t.textSecondary }}>Current units in stock per product</p>
          <div ref={stockChartRef} style={{ width: "100%", marginTop: "12px" }} />
        </div>
      </div>

      {/* Filters */}
      <div style={{ ...styles.filterBar, background: t.cardBg, border: `1px solid ${t.border}` }}>
        <input
          type="text"
          placeholder="Search by name or ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            ...styles.searchInput,
            background: t.inputBg,
            border:     `1px solid ${t.border}`,
            color:      t.textPrimary,
          }}
        />
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          style={{
            ...styles.select,
            background: t.inputBg,
            border:     `1px solid ${t.border}`,
            color:      t.textPrimary,
          }}
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
          style={{
            ...styles.select,
            background: t.inputBg,
            border:     `1px solid ${t.border}`,
            color:      t.textPrimary,
          }}
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
          <div>
            <h3 style={{ ...styles.chartTitle, color: t.textPrimary }}>Product Catalog</h3>
            <p style={{ ...styles.chartSub, color: t.textSecondary }}>{filteredProducts.length} results</p>
          </div>
          <button style={styles.addBtn}>+ Add Product</button>
        </div>

        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${t.border}` }}>
                {["Product ID","Name","Category","Price","Stock","Sold (YTD)","Revenue (YTD)","Status",""].map((h) => (
                  <th key={h} style={{ ...styles.th, color: t.textSecondary }}>{h}</th>
                ))}
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
                  <td style={{ ...styles.td, color: t.textSecondary }}>
                    {product.category}
                  </td>
                  <td style={{ ...styles.td, color: t.textPrimary }}>
                    €{product.price.toLocaleString()}
                  </td>
                  <td style={{ ...styles.td, color: t.textSecondary }}>
                    {product.stock}
                  </td>
                  <td style={{ ...styles.td, color: t.textSecondary }}>
                    {product.sold}
                  </td>
                  <td style={{ ...styles.td, color: t.textPrimary }}>
                    €{(product.price * product.sold).toLocaleString()}
                  </td>
                  <td style={{ ...styles.td }}>
                    <span
                      style={{
                        ...styles.statusBadge,
                        background: getStatusColor(product.status),
                        color:      "#fff",
                      }}
                    >
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
// TODO: Replace with GET /api/products
// Once backend is connected, remove MOCK_PRODUCTS and MOCK_REVENUE 
// Replace with variables from the API fetch 
const MOCK_PRODUCTS = [
  { id: "PRD-001", name: "Starter Pack",      category: "Basic",        price: 1250,  stock: 45, sold: 142, status: "Active"       },
  { id: "PRD-002", name: "Pro License",        category: "Professional", price: 3500,  stock: 28, sold: 89,  status: "Active"       },
  { id: "PRD-003", name: "Enterprise Plan",    category: "Enterprise",   price: 8500,  stock: 12, sold: 34,  status: "Active"       },
  { id: "PRD-004", name: "Add-on Bundle",      category: "Add-on",       price: 750,   stock: 0,  sold: 256, status: "Out of Stock" },
  { id: "PRD-005", name: "Starter Plus",       category: "Basic",        price: 1750,  stock: 38, sold: 98,  status: "Active"       },
  { id: "PRD-006", name: "Pro Plus",           category: "Professional", price: 4200,  stock: 22, sold: 67,  status: "Active"       },
  { id: "PRD-007", name: "Enterprise Elite",   category: "Enterprise",   price: 12000, stock: 8,  sold: 23,  status: "Low Stock"    },
  { id: "PRD-008", name: "Integration Pack",   category: "Add-on",       price: 950,   stock: 15, sold: 145, status: "Active"       },
  { id: "PRD-009", name: "Analytics Add-on",   category: "Add-on",       price: 650,   stock: 5,  sold: 189, status: "Low Stock"    },
  { id: "PRD-010", name: "Support Package",    category: "Add-on",       price: 450,   stock: 32, sold: 234, status: "Active"       },
  { id: "PRD-011", name: "Basic Suite",        category: "Basic",        price: 2100,  stock: 3,  sold: 76,  status: "Low Stock"    },
  { id: "PRD-012", name: "Pro Suite",          category: "Professional", price: 5500,  stock: 18, sold: 45,  status: "Active"       },
];

// TODO: Replace with GET /api/products/revenue/monthly
const MOCK_REVENUE = [
  { monthNum: 1,  revenue: 32000 },
  { monthNum: 2,  revenue: 28500 },
  { monthNum: 3,  revenue: 35200 },
  { monthNum: 4,  revenue: 31800 },
  { monthNum: 5,  revenue: 38900 },
  { monthNum: 6,  revenue: 42100 },
  { monthNum: 7,  revenue: 39500 },
  { monthNum: 8,  revenue: 44200 },
  { monthNum: 9,  revenue: 41800 },
  { monthNum: 10, revenue: 48500 },
  { monthNum: 11, revenue: 46300 },
  { monthNum: 12, revenue: 52800 },
];

// THEME
const light = {
  textPrimary:   "#1a2a6c",
  textSecondary: "#555",
  cardBg:        "#ffffff",
  border:        "#e0e4ef",
  borderLight:   "#f0f2f7",
  inputBg:       "#ffffff",
  accent:        "#1a2a6c",
  success:       "#16a34a",
  successLight:  "#dcfce7",
  warning:       "#f59e0b",
  warningLight:  "#fef3c7",
  danger:        "#dc2626",
  dangerLight:   "#fee2e2",
  accentLight:   "#e0e7ff",
};

const dark = {
  textPrimary:   "#e2e8f0",
  textSecondary: "#94a3b8",
  cardBg:        "#1e293b",
  border:        "#334155",
  borderLight:   "#1e293b",
  inputBg:       "#0f172a",
  accent:        "#7c9fff",
  success:       "#22c55e",
  successLight:  "#064e3b",
  warning:       "#fbbf24",
  warningLight:  "#78350f",
  danger:        "#ef4444",
  dangerLight:   "#7f1d1d",
  accentLight:   "#1e3a8a",
};

// STYLING
const styles = {
  wrapper: {
    display:       "flex",
    flexDirection: "column",
    gap:           "20px",
  },
  summaryGrid: {
    display:             "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap:                 "16px",
  },
  summaryCard: {
    padding:      "18px 20px",
    borderRadius: "10px",
    display:      "flex",
    alignItems:   "center",
    gap:          "14px",
  },
  summaryAccent: {
    width:        "4px",
    height:       "40px",
    borderRadius: "4px",
    flexShrink:   0,
  },
  summaryLabel: {
    fontSize:     "12px",
    marginBottom: "4px",
  },
  summaryValue: {
    fontSize:   "24px",
    fontWeight: "700",
  },
  chartsGrid: {
    display:             "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap:                 "16px",
  },
  chartCard: {
    padding:      "20px",
    borderRadius: "10px",
  },
  chartTitle: {
    margin:     "0 0 2px 0",
    fontSize:   "14px",
    fontWeight: "600",
  },
  chartSub: {
    margin:   0,
    fontSize: "12px",
  },
  filterBar: {
    padding:      "16px 20px",
    borderRadius: "10px",
    display:      "flex",
    gap:          "10px",
    flexWrap:     "wrap",
    alignItems:   "center",
  },
  searchInput: {
    flex:         1,
    minWidth:     "220px",
    padding:      "8px 14px",
    borderRadius: "6px",
    fontSize:     "13px",
    outline:      "none",
  },
  select: {
    padding:      "8px 12px",
    borderRadius: "6px",
    fontSize:     "13px",
    cursor:       "pointer",
    outline:      "none",
  },
  tableCard: {
    padding:      "20px",
    borderRadius: "10px",
  },
  tableHeader: {
    display:        "flex",
    justifyContent: "space-between",
    alignItems:     "flex-start",
    marginBottom:   "16px",
  },
  addBtn: {
    padding:      "8px 16px",
    background:   "#1a2a6c",
    color:        "#fff",
    border:       "none",
    borderRadius: "6px",
    fontSize:     "13px",
    fontWeight:   "600",
    cursor:       "pointer",
  },
  tableWrapper: {
    overflowX: "auto",
  },
  table: {
    width:           "100%",
    borderCollapse:  "collapse",
  },
  th: {
    padding:       "10px 14px",
    textAlign:     "left",
    fontSize:      "11px",
    fontWeight:    "600",
    textTransform: "uppercase",
    letterSpacing: "0.4px",
  },
  td: {
    padding:  "11px 14px",
    fontSize: "13px",
  },
  statusBadge: {
    padding:      "3px 9px",
    borderRadius: "20px",
    fontSize:     "11px",
    fontWeight:   "600",
  },
  actionBtn: {
    background:     "transparent",
    border:         "none",
    fontSize:       "13px",
    fontWeight:     "500",
    cursor:         "pointer",
    textDecoration: "underline",
  },
};

export default Products;
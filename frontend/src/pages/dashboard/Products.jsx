/*
  Endpoints used:
    GET /api/products         → full product list
    GET /api/products/summary → adds soldAmount + totalRevenue per product

  Both require JWT token in Authorization header.

  API field mapping:
    /api/products:
      productKey, productId, productNumber, productName,
      cost, productType, category, subcategory,
      maintenance, productLevel, startDate

    /api/products/summary:
      productId, productName, category, subcategory,
      cost, productType, soldAmount, totalRevenue
*/

import { useState, useEffect, useRef } from "react";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import * as Plot from "@observablehq/plot";
import ChartToggle from "../../components/ChartToggle";

function Products() {
  const { isDark }      = useTheme();
  const { user, token } = useAuth();
  const t               = isDark ? dark : light;

  const stockChartRef = useRef(null);

  // API state
  const [products, setProducts] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);

  // Filter state
  const [searchTerm,     setSearchTerm]     = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [typeFilter,     setTypeFilter]     = useState("all");
  const [sortBy,         setSortBy]         = useState("name");

  // Auth header
  const authHeader = {
    "Authorization": `Bearer ${token}`,
    "Content-Type":  "application/json",
  };

  useEffect(() => {
    if (!token) return;

    // Fetch products and summary in parallel
    Promise.all([
      fetch("http://localhost:8080/api/products",         { headers: authHeader }),
      fetch("http://localhost:8080/api/products/summary", { headers: authHeader }),
    ])
      .then(async ([productsRes, summaryRes]) => {
        if (!productsRes.ok) throw new Error("Failed to fetch products");

        const productsData = await productsRes.json();

        let summaryData = [];
        if (summaryRes.ok) {
          summaryData = await summaryRes.json();
        }

        const summaryMap = {};
        summaryData.forEach((s) => {
          summaryMap[s.productId] = s;
        });

        const merged = productsData.map((p) => {
          const s = summaryMap[p.productId] || {};
          return {
            productKey:    p.productKey,
            productId:     p.productId,
            productNumber: p.productNumber,
            name:          p.productName,
            cost:          p.cost,
            type:          p.productType,
            category:      p.category,
            subcategory:   p.subcategory,
            maintenance:   p.maintenance,
            productLevel:  p.productLevel,
            startDate:     p.startDate,
            soldAmount:    s.soldAmount   || 0,
            totalRevenue:  s.totalRevenue || 0,
          };
        });

        setProducts(merged);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [token]);

  // Revenue trend data for ChartToggle
  // Built from summary data, top products by revenue
  const revenueChartData = [...products]
    .sort((a, b) => b.totalRevenue - a.totalRevenue)
    .slice(0, 12)
    .map((p, i) => ({
      monthNum:     i + 1,
      revenue:      p.totalRevenue,
      productName:  p.name,
    }));

  // Stock levels chart - top products by cost
  useEffect(() => {
    if (!stockChartRef.current || products.length === 0) return;
    stockChartRef.current.innerHTML = "";

    const topProducts = [...products]
      .sort((a, b) => b.soldAmount - a.soldAmount)
      .slice(0, 8)
      .map(p => ({ name: p.name, sold: p.soldAmount }));

    const plot = Plot.plot({
      width:        stockChartRef.current.offsetWidth || 400,
      height:       260,
      marginLeft:   140,
      marginBottom: 38,
      marginTop:    8,
      marginRight:  16,
      marks: [
        Plot.barX(topProducts, {
          x:    "sold",
          y:    "name",
          fill: isDark ? "#7c9fff" : "#1a2a6c",
          rx:   3,
          sort: { y: "-x" },
        }),
        Plot.text(topProducts, {
          x:          "sold",
          y:          "name",
          text:       (d) => d.sold,
          dx:         8,
          fill:       isDark ? "#e2e8f0" : "#1a2a6c",
          fontSize:   "11px",
          fontWeight: "600",
        }),
        Plot.ruleX([0]),
      ],
      x: {
        label:       "Units Sold",
        grid:        true,
        tickPadding: 6,
        tickSize:    4,
      },
      y: { label: null },
      style: {
        fontSize:   "11px",
        color:      t.textSecondary,
        background: "transparent",
      },
    });

    stockChartRef.current.appendChild(plot);
    return () => plot.remove();
  }, [isDark, products]);

  // Values for filters
  const uniqueCategories = [...new Set(products.map(p => p.category))].filter(Boolean).sort();
  const uniqueTypes      = [...new Set(products.map(p => p.type))].filter(Boolean).sort();

  // Filter + sort
  let filtered = products.filter((p) => {
    const matchSearch   = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.productNumber?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory = categoryFilter === "all" || p.category === categoryFilter;
    const matchType     = typeFilter     === "all" || p.type     === typeFilter;
    return matchSearch && matchCategory && matchType;
  });

  if (sortBy === "name")     filtered.sort((a, b) => a.name.localeCompare(b.name));
  if (sortBy === "revenue")  filtered.sort((a, b) => b.totalRevenue - a.totalRevenue);
  if (sortBy === "sold")     filtered.sort((a, b) => b.soldAmount - a.soldAmount);
  if (sortBy === "cost")     filtered.sort((a, b) => b.cost - a.cost);

  // KPI values
  const totalProducts  = products.length;
  const totalRevenue   = products.reduce((s, p) => s + p.totalRevenue, 0);
  const totalSold      = products.reduce((s, p) => s + p.soldAmount,   0);
  const uniqueCatCount = [...new Set(products.map(p => p.category))].length;

  if (!user) {
    return (
      <div style={{ ...styles.stateBox, color: t.textSecondary }}>
        Please sign in to view product data.
      </div>
    );
  }

  return (
    <div style={styles.wrapper}>

      {/* Summary Cards */}
      <div style={styles.summaryGrid}>
        {[
          { label: "Total Products", value: totalProducts,                              accent: t.accentLight  },
          { label: "Total Revenue",  value: `€${(totalRevenue/1000).toFixed(1)}K`,     accent: t.successLight },
          { label: "Total Sold",     value: totalSold.toLocaleString(),                 accent: t.accentLight  },
          { label: "Categories",     value: uniqueCatCount,                             accent: t.warningLight },
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
              <div style={{ ...styles.summaryValue, color: t.textPrimary }}>
                {loading ? "-" : card.value}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div style={styles.chartsGrid}>

        {/* Revenue by product  */}
        <div style={{ ...styles.chartCard, background: t.cardBg, border: `1px solid ${t.border}` }}>
          <h3 style={{ ...styles.chartTitle, color: t.textPrimary }}>Top Products by Revenue</h3>
          <p style={{ ...styles.chartSub, color: t.textSecondary }}>Top 12 products ranked by total revenue</p>
          {products.length > 0 ? (
            <ChartToggle
              data={revenueChartData}
              xKey="monthNum"
              yKey="revenue"
              yLabel="Revenue (€)"
              height={240}
              tier={user?.tier || "GROWTH"}
            />
          ) : (
            <div style={{ ...styles.stateBox, color: t.textSecondary }}>
              {loading ? "Loading..." : "No data"}
            </div>
          )}
        </div>

        {/* Units sold */}
        <div style={{ ...styles.chartCard, background: t.cardBg, border: `1px solid ${t.border}` }}>
          <h3 style={{ ...styles.chartTitle, color: t.textPrimary }}>Top Products by Units Sold</h3>
          <p style={{ ...styles.chartSub, color: t.textSecondary }}>Top 8 products by units sold</p>
          <div ref={stockChartRef} style={{ width: "100%", marginTop: "12px" }} />
        </div>
      </div>

      {/* Filters */}
      <div style={{ ...styles.filterBar, background: t.cardBg, border: `1px solid ${t.border}` }}>
        <input
          type="text"
          placeholder="Search by name or product number..."
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
          style={{ ...styles.select, background: t.inputBg, border: `1px solid ${t.border}`, color: t.textPrimary }}
        >
          <option value="all">All Categories</option>
          {uniqueCategories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          style={{ ...styles.select, background: t.inputBg, border: `1px solid ${t.border}`, color: t.textPrimary }}
        >
          <option value="all">All Types</option>
          {uniqueTypes.map(tp => <option key={tp} value={tp}>{tp}</option>)}
        </select>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          style={{ ...styles.select, background: t.inputBg, border: `1px solid ${t.border}`, color: t.textPrimary }}
        >
          <option value="name">Sort by Name</option>
          <option value="revenue">Sort by Revenue</option>
          <option value="sold">Sort by Units Sold</option>
          <option value="cost">Sort by Cost</option>
        </select>
      </div>

      {/* Products Table */}
      <div style={{ ...styles.tableCard, background: t.cardBg, border: `1px solid ${t.border}` }}>
        <div style={styles.tableHeader}>
          <div>
            <h3 style={{ ...styles.tableTitle, color: t.textPrimary }}>Product Catalog</h3>
            <p style={{ ...styles.tableSub, color: t.textSecondary }}>
              {loading ? "Loading..." : `${filtered.length} of ${totalProducts} products`}
            </p>
          </div>
        </div>

        {loading && (
          <div style={{ ...styles.stateBox, color: t.textSecondary }}>Loading products...</div>
        )}
        {error && !loading && (
          <div style={{ ...styles.stateBox, color: t.danger }}>Error: {error}</div>
        )}
        {!loading && !error && filtered.length === 0 && (
          <div style={{ ...styles.stateBox, color: t.textSecondary }}>No products match your filters.</div>
        )}

        {!loading && !error && filtered.length > 0 && (
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${t.border}` }}>
                  {[
                    "Product No.",
                    "Name",
                    "Category",
                    "Subcategory",
                    "Type",
                    "Cost",
                    "Units Sold",
                    "Total Revenue",
                    "Start Date",
                  ].map((h) => (
                    <th key={h} style={{ ...styles.th, color: t.textSecondary }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr key={p.productKey} style={{ borderBottom: `1px solid ${t.borderLight}` }}>
                    <td style={{ ...styles.td, color: t.textSecondary, fontFamily: "monospace" }}>
                      {p.productNumber}
                    </td>
                    <td style={{ ...styles.td, color: t.textPrimary, fontWeight: "500" }}>
                      {p.name}
                    </td>
                    <td style={{ ...styles.td, color: t.textSecondary }}>{p.category}</td>
                    <td style={{ ...styles.td, color: t.textSecondary }}>{p.subcategory}</td>
                    <td style={{ ...styles.td, color: t.textSecondary }}>{p.type}</td>
                    <td style={{ ...styles.td, color: t.textPrimary, fontWeight: "600" }}>
                      €{p.cost.toLocaleString()}
                    </td>
                    <td style={{ ...styles.td, color: t.textSecondary }}>
                      {p.soldAmount.toLocaleString()}
                    </td>
                    <td style={{ ...styles.td, color: t.textPrimary, fontWeight: "600" }}>
                      €{p.totalRevenue.toLocaleString()}
                    </td>
                    <td style={{ ...styles.td, color: t.textSecondary }}>{p.startDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}

// THEME
const light = {
  textPrimary:   "#1a2a6c",
  textSecondary: "#555",
  cardBg:        "#ffffff",
  border:        "#e0e4ef",
  borderLight:   "#f0f2f7",
  inputBg:       "#ffffff",
  accent:        "#1a2a6c",
  accentLight:   "#e0e7ff",
  success:       "#16a34a",
  successLight:  "#dcfce7",
  warning:       "#f59e0b",
  warningLight:  "#fef3c7",
  danger:        "#dc2626",
};

const dark = {
  textPrimary:   "#e2e8f0",
  textSecondary: "#94a3b8",
  cardBg:        "#1e293b",
  border:        "#334155",
  borderLight:   "#1e293b",
  inputBg:       "#0f172a",
  accent:        "#7c9fff",
  accentLight:   "#1e3a8a",
  success:       "#22c55e",
  successLight:  "#064e3b",
  warning:       "#fbbf24",
  warningLight:  "#78350f",
  danger:        "#ef4444",
};

// ===== STYLES =====
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
  tableTitle: {
    margin:     "0 0 2px 0",
    fontSize:   "14px",
    fontWeight: "600",
  },
  tableSub: {
    margin:   0,
    fontSize: "12px",
  },
  stateBox: {
    padding:   "40px",
    textAlign: "center",
    fontSize:  "13px",
  },
  tableWrapper: {
    overflowX: "auto",
  },
  table: {
    width:          "100%",
    borderCollapse: "collapse",
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
};

export default Products;
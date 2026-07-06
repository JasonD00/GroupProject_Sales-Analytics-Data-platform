/*
  Endpoints user:
    GET /api/sales - full list of sales orders
    GET /api/sales/total-revenue - single total revenue value

  API field mapping (from backend):
    orderNumber      - order reference
    orderDate        - when order was placed
    shipDate         - when order was shipped
    dueDate          - when order is due
    salesAmount      - total value of order
    quantity         - units ordered
    price            - price per unit
    clientKey        - customer reference
    productKey       - product reference
    invoiceStatusKey - status reference
*/

import { useState, useEffect, useRef } from "react";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import * as Plot from "@observablehq/plot";

function Sales() {
  const { isDark } = useTheme();
  const { user, token } = useAuth();
  const t = isDark ? dark : light;

  const statusChartRef = useRef(null);
  const topOrdersChartRef = useRef(null);

  // API state
  const [sales, setSales] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [minAmount, setMinAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");
  const [sortBy, setSortBy] = useState("date");

  // Auth header
  const authHeader = {
    "Authorization": `Bearer ${token}`,
    "Content-Type":  "application/json",
  };

  useEffect(() => {
    if (!token) return;

    Promise.all([
      fetch("http://localhost:8080/api/sales", { headers: authHeader }),
      fetch("http://localhost:8080/api/sales/total-revenue", { headers: authHeader }),
    ])
      .then(async ([salesRes, revenueRes]) => {
        if (!salesRes.ok) throw new Error("Failed to fetch sales data");

        const salesData   = await salesRes.json();
        const revenueData = revenueRes.ok ? await revenueRes.json() : null;

        setSales(salesData);
        setTotalRevenue(revenueData);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [token]);

  // Build monthly revenue trend for ChartToggle
  // Groups the sales by month of orderDate and sums the salesAmount
  const monthlyRevenue = (() => {
    const map = {};
    sales.forEach((s) => {
      if (!s.orderDate) return;
      const month = new Date(s.orderDate).getMonth() + 1;
      map[month] = (map[month] || 0) + (s.salesAmount || 0);
    });
    return Object.entries(map)
      .map(([month, revenue]) => ({ monthNum: parseInt(month), revenue }))
      .sort((a, b) => a.monthNum - b.monthNum);
  })();

  // Builds the status distribution for the bar chart
  // Groups by their invoiceStatusKey and counts their orders
  const statusDistribution = (() => {
    const map = {};
    sales.forEach((s) => {
      const key = `Status ${s.invoiceStatusKey}`;
      map[key] = (map[key] || 0) + 1;
    });
    return Object.entries(map).map(([status, count]) => ({ status, count }));
  })();

  // Status distribution chart
  useEffect(() => {
    if (!statusChartRef.current || statusDistribution.length === 0) return;
    statusChartRef.current.innerHTML = "";

    const plot = Plot.plot({
      width:        statusChartRef.current.offsetWidth || 400,
      height:       200,
      marginLeft:   80,
      marginBottom: 38,
      marginTop:    8,
      marginRight:  16,
      marks: [
        Plot.barX(statusDistribution, {
          x:    "count",
          y:    "status",
          fill: isDark ? "#7c9fff" : "#1a2a6c",
          rx:   3,
          sort: { y: "-x" },
        }),
        Plot.text(statusDistribution, {
          x:          "count",
          y:          "status",
          text:       (d) => d.count,
          dx:         8,
          fill:       isDark ? "#e2e8f0" : "#1a2a6c",
          fontSize:   "11px",
          fontWeight: "600",
        }),
        Plot.ruleX([0]),
      ],
      x: { label: "Orders", grid: true, tickPadding: 6 },
      y: { label: null },
      style: {
        fontSize:   "11px",
        color:      t.textSecondary,
        background: "transparent",
      },
    });

    statusChartRef.current.appendChild(plot);
    return () => plot.remove();
  }, [isDark, sales]);

  // Top 10 orders by sales amount 
  useEffect(() => {
    if (!topOrdersChartRef.current || sales.length === 0) return;
    topOrdersChartRef.current.innerHTML = "";

    const top10 = [...sales]
      .sort((a, b) => b.salesAmount - a.salesAmount)
      .slice(0, 10)
      .map(s => ({
        order:  s.orderNumber,
        amount: s.salesAmount || 0,
      }));

    const plot = Plot.plot({
      width:        topOrdersChartRef.current.offsetWidth || 400,
      height:       260,
      marginLeft:   120,
      marginBottom: 38,
      marginTop:    8,
      marginRight:  16,
      marks: [
        Plot.barX(top10, {
          x:    "amount",
          y:    "order",
          fill: isDark ? "#7c9fff" : "#1a2a6c",
          rx:   3,
          sort: { y: "-x" },
        }),
        Plot.text(top10, {
          x:          "amount",
          y:          "order",
          text:       (d) => `€${d.amount.toLocaleString()}`,
          dx:         8,
          fill:       isDark ? "#e2e8f0" : "#1a2a6c",
          fontSize:   "11px",
          fontWeight: "600",
        }),
        Plot.ruleX([0]),
      ],
      x: {
        label:       "Sales Amount (€)",
        grid:        true,
        tickPadding: 6,
        tickFormat:  d => `€${(d/1000).toFixed(0)}K`,
      },
      y: { label: null },
      style: {
        fontSize:   "11px",
        color:      t.textSecondary,
        background: "transparent",
      },
    });

    topOrdersChartRef.current.appendChild(plot);
    return () => plot.remove();
  }, [isDark, sales]);

  // Filter + sort
  let filtered = sales.filter((s) => {
    const matchSearch = s.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchFrom   = !dateFrom || new Date(s.orderDate) >= new Date(dateFrom);
    const matchTo     = !dateTo   || new Date(s.orderDate) <= new Date(dateTo);
    const matchMin    = !minAmount || s.salesAmount >= parseFloat(minAmount);
    const matchMax    = !maxAmount || s.salesAmount <= parseFloat(maxAmount);
    return matchSearch && matchFrom && matchTo && matchMin && matchMax;
  });

  if (sortBy === "date")    filtered.sort((a, b) => new Date(b.orderDate)   - new Date(a.orderDate));
  if (sortBy === "amount")  filtered.sort((a, b) => b.salesAmount           - a.salesAmount);
  if (sortBy === "qty")     filtered.sort((a, b) => b.quantity              - a.quantity);
  if (sortBy === "due")     filtered.sort((a, b) => new Date(a.dueDate)     - new Date(b.dueDate));

  // KPI values
  const totalOrders   = sales.length;
  const totalQty      = sales.reduce((s, o) => s + (o.quantity    || 0), 0);
  const totalSales    = sales.reduce((s, o) => s + (o.salesAmount || 0), 0);
  const avgOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;

  // Fulfilment - avg days it takes an order to ship
  const avgFulfilment = (() => {
    const diffs = sales
      .filter(s => s.orderDate && s.shipDate)
      .map(s => Math.floor((new Date(s.shipDate) - new Date(s.orderDate)) / 86400000));
    return diffs.length > 0
      ? (diffs.reduce((a, b) => a + b, 0) / diffs.length).toFixed(1)
      : "-";
  })();

  if (!user) {
    return (
      <div style={{ ...styles.stateBox, color: t.textSecondary }}>
        Please sign in to view sales data.
      </div>
    );
  }

  return (
    <div style={styles.wrapper}>

      {/* Summary Cards */}
      <div style={styles.summaryGrid}>
        {[
          { label: "Total Orders",     value: loading ? "-" : totalOrders.toLocaleString(),              accent: t.accentLight  },
          { label: "Total Revenue",    value: loading ? "-" : `€${(totalSales/1000).toFixed(1)}K`,       accent: t.successLight },
          { label: "Avg Order Value",  value: loading ? "-" : `€${avgOrderValue.toFixed(0)}`,            accent: t.accentLight  },
          { label: "Avg Ship Time",    value: loading ? "-" : `${avgFulfilment} days`,                   accent: t.warningLight },
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

        {/* Top 10 orders by sales amount */}
        <div style={{ ...styles.chartCard, background: t.cardBg, border: `1px solid ${t.border}` }}>
          <div style={styles.chartHeader}>
            <div>
              <h3 style={{ ...styles.chartTitle, color: t.textPrimary }}>Top 10 Orders by Value</h3>
              <p style={{ ...styles.chartSub, color: t.textSecondary }}>Highest value sales orders</p>
            </div>
            {totalRevenue != null && (
              <div style={{ ...styles.totalPill, background: t.accentLight, color: t.accent }}>
                Total: €{(totalRevenue/1000).toFixed(0)}K
              </div>
            )}
          </div>
          {sales.length > 0 ? (
            <div ref={topOrdersChartRef} style={{ width: "100%", marginTop: "12px" }} />
          ) : (
            <div style={{ ...styles.stateBox, color: t.textSecondary }}>
              {loading ? "Loading..." : "No data"}
            </div>
          )}
        </div>

        {/* Orders by status */}
        <div style={{ ...styles.chartCard, background: t.cardBg, border: `1px solid ${t.border}` }}>
          <h3 style={{ ...styles.chartTitle, color: t.textPrimary }}>Orders by Status</h3>
          <p style={{ ...styles.chartSub, color: t.textSecondary }}>Order count per invoice status</p>
          <div ref={statusChartRef} style={{ width: "100%", marginTop: "12px" }} />
        </div>
      </div>

      {/* Filters */}
      <div style={{ ...styles.filterBar, background: t.cardBg, border: `1px solid ${t.border}` }}>
        <input
          type="text"
          placeholder="Search order number..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            ...styles.searchInput,
            background: t.inputBg,
            border:     `1px solid ${t.border}`,
            color:      t.textPrimary,
          }}
        />
        <div style={styles.filterGroup}>
          <label style={{ ...styles.filterLabel, color: t.textSecondary }}>From</label>
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            style={{
              ...styles.dateInput,
              background: t.inputBg,
              border:     `1px solid ${t.border}`,
              color:      t.textPrimary,
            }}
          />
        </div>
        <div style={styles.filterGroup}>
          <label style={{ ...styles.filterLabel, color: t.textSecondary }}>To</label>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            style={{
              ...styles.dateInput,
              background: t.inputBg,
              border:     `1px solid ${t.border}`,
              color:      t.textPrimary,
            }}
          />
        </div>
        <input
          type="number"
          placeholder="Min €"
          value={minAmount}
          onChange={(e) => setMinAmount(e.target.value)}
          style={{
            ...styles.amountInput,
            background: t.inputBg,
            border:     `1px solid ${t.border}`,
            color:      t.textPrimary,
          }}
        />
        <input
          type="number"
          placeholder="Max €"
          value={maxAmount}
          onChange={(e) => setMaxAmount(e.target.value)}
          style={{
            ...styles.amountInput,
            background: t.inputBg,
            border:     `1px solid ${t.border}`,
            color:      t.textPrimary,
          }}
        />
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          style={{ ...styles.select, background: t.inputBg, border: `1px solid ${t.border}`, color: t.textPrimary }}
        >
          <option value="date">Sort by Order Date</option>
          <option value="amount">Sort by Amount</option>
          <option value="qty">Sort by Quantity</option>
          <option value="due">Sort by Due Date</option>
        </select>
        <button
          onClick={() => { setSearchTerm(""); setDateFrom(""); setDateTo(""); setMinAmount(""); setMaxAmount(""); }}
          style={{ ...styles.clearBtn, color: t.textSecondary, border: `1px solid ${t.border}` }}
        >
          Clear
        </button>
      </div>

      {/* Sales Table */}
      <div style={{ ...styles.tableCard, background: t.cardBg, border: `1px solid ${t.border}` }}>
        <div style={styles.tableHeader}>
          <div>
            <h3 style={{ ...styles.chartTitle, color: t.textPrimary }}>Sales Orders</h3>
            <p style={{ ...styles.chartSub, color: t.textSecondary }}>
              {loading ? "Loading..." : `${filtered.length} of ${totalOrders} orders`}
            </p>
          </div>
        </div>

        {loading && (
          <div style={{ ...styles.stateBox, color: t.textSecondary }}>Loading sales data...</div>
        )}
        {error && !loading && (
          <div style={{ ...styles.stateBox, color: t.danger }}>Error: {error}</div>
        )}
        {!loading && !error && filtered.length === 0 && (
          <div style={{ ...styles.stateBox, color: t.textSecondary }}>No orders match your filters.</div>
        )}

        {!loading && !error && filtered.length > 0 && (
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${t.border}` }}>
                  {[
                    "Order No.",
                    "Order Date",
                    "Ship Date",
                    "Due Date",
                    "Ship Time",
                    "Quantity",
                    "Price",
                    "Sales Amount",
                  ].map((h) => (
                    <th key={h} style={{ ...styles.th, color: t.textSecondary }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((s) => {
                  const shipDays = s.orderDate && s.shipDate
                    ? Math.floor((new Date(s.shipDate) - new Date(s.orderDate)) / 86400000)
                    : null;
                  const isLate = s.dueDate && s.shipDate && new Date(s.shipDate) > new Date(s.dueDate);

                  return (
                    <tr key={s.orderNumber} style={{ borderBottom: `1px solid ${t.borderLight}` }}>
                      <td style={{ ...styles.td, color: t.textSecondary, fontFamily: "monospace" }}>
                        {s.orderNumber}
                      </td>
                      <td style={{ ...styles.td, color: t.textSecondary }}>{s.orderDate}</td>
                      <td style={{ ...styles.td, color: isLate ? t.danger : t.textSecondary }}>
                        {s.shipDate}
                      </td>
                      <td style={{ ...styles.td, color: t.textSecondary }}>{s.dueDate}</td>
                      <td style={{ ...styles.td, color: t.textSecondary }}>
                        {shipDays != null ? `${shipDays}d` : "-"}
                      </td>
                      <td style={{ ...styles.td, color: t.textSecondary }}>{s.quantity}</td>
                      <td style={{ ...styles.td, color: t.textSecondary }}>
                        €{s.price?.toLocaleString()}
                      </td>
                      <td style={{ ...styles.td, color: t.textPrimary, fontWeight: "600" }}>
                        €{s.salesAmount?.toLocaleString()}
                      </td>
                    </tr>
                  );
                })}
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
  dangerLight:   "#fee2e2",
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
  dangerLight:   "#7f1d1d",
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
  chartHeader: {
    display:        "flex",
    justifyContent: "space-between",
    alignItems:     "flex-start",
    marginBottom:   "4px",
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
  totalPill: {
    padding:      "4px 12px",
    borderRadius: "20px",
    fontSize:     "12px",
    fontWeight:   "600",
    whiteSpace:   "nowrap",
  },
  filterBar: {
    padding:      "16px 20px",
    borderRadius: "10px",
    display:      "flex",
    gap:          "10px",
    flexWrap:     "wrap",
    alignItems:   "center",
  },
  filterGroup: {
    display:    "flex",
    alignItems: "center",
    gap:        "6px",
  },
  filterLabel: {
    fontSize:   "12px",
    fontWeight: "500",
    whiteSpace: "nowrap",
  },
  searchInput: {
    flex:         1,
    minWidth:     "180px",
    padding:      "8px 14px",
    borderRadius: "6px",
    fontSize:     "13px",
    outline:      "none",
  },
  dateInput: {
    padding:      "7px 10px",
    borderRadius: "6px",
    fontSize:     "13px",
    outline:      "none",
  },
  amountInput: {
    width:        "80px",
    padding:      "8px 10px",
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
  clearBtn: {
    padding:      "8px 14px",
    borderRadius: "6px",
    fontSize:     "12px",
    cursor:       "pointer",
    background:   "transparent",
    fontWeight:   "500",
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

export default Sales;
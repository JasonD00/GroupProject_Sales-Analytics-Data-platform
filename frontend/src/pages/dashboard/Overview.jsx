/*

  Endpoints used:
    GET /api/sales/total-revenue → total revenue KPI card
    GET /api/clients/summary     → total customers + active count KPI cards
    GET /api/sales/territory     → revenue by region chart (Pro+)
    GET /api/sales               → recent transactions table

  All endpoints require JWT token in Authorisation header.
*/

import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import * as Plot from "@observablehq/plot";
import ChartToggle from "../../components/ChartToggle";

function Overview() {
  const { user, token, openLoginModel, hasFeature } = useAuth();
  const { isDark } = useTheme();
  const t = isDark ? dark : light;
  const tier = user?.tier || "GROWTH";

  const territoryChartRef  = useRef(null);
  const productTypeChartRef = useRef(null);
  const segmentChartRef     = useRef(null);
  const invoiceChartRef   = useRef(null);

  // API state
  const [totalRevenue,    setTotalRevenue]    = useState(null);
  const [customerSummary, setCustomerSummary] = useState([]);
  const [allSales,        setAllSales]        = useState([]);
  const [territory,       setTerritory]       = useState([]);
  const [invoiceSummary,  setInvoiceSummary]  = useState([]);
  const [productSummary, setProductSummary] = useState([]);
  const [customerData,   setCustomerData]   = useState([]);
  const [loading,         setLoading]         = useState(true);

  const authHeader = {
    "Authorization": `Bearer ${token}`,
    "Content-Type":  "application/json",
  };

  useEffect(() => {
    if (!token) return;

    const fetches = [
      // Total revenue KPI
      fetch("http://localhost:8080/api/sales/total-revenue", { headers: authHeader })
        .then(r => r.ok ? r.json() : null)
        .then(d => setTotalRevenue(d)),

      // Customer summary for KPI cards
      fetch("http://localhost:8080/api/clients/summary", { headers: authHeader })
        .then(r => r.ok ? r.json() : [])
        .then(d => setCustomerSummary(d)),

      // All sales - used to build monthly revenue trend chart
      fetch("http://localhost:8080/api/sales", { headers: authHeader })
        .then(r => r.ok ? r.json() : [])
        .then(d => setAllSales(d)),
    ];

    // Pro+ endpoints
    if (hasFeature("Pro")) {
      fetches.push(
        fetch("http://localhost:8080/api/sales/territory", { headers: authHeader })
          .then(r => r.ok ? r.json() : [])
          .then(d => setTerritory(d)),

        fetch("http://localhost:8080/api/products/summary", { headers: authHeader })
          .then(r => r.ok ? r.json() : [])
          .then(d => setProductSummary(d)),

        fetch("http://localhost:8080/api/clients", { headers: authHeader })
          .then(r => r.ok ? r.json() : [])
          .then(d => setCustomerData(d)),
      );
    }

    // Enterprise-only endpoints
    if (hasFeature("Enterprise")) {
      fetches.push(
        fetch("http://localhost:8080/api/invoices/summary", { headers: authHeader })
          .then(r => r.ok ? r.json() : [])
          .then(d => setInvoiceSummary(d)),
      );
    }

    Promise.all(fetches).finally(() => setLoading(false));
  }, [token]);

  // Build monthly revenue from allSales
  // Groups sales by month of orderDate and sums salesAmount
  const monthlyRevenue = (() => {
    const map = {};
    allSales.forEach((s) => {
      if (!s.orderDate) return;
      const month = new Date(s.orderDate).getMonth() + 1;
      map[month] = (map[month] || 0) + (s.salesAmount || 0);
    });
    return Object.entries(map)
      .map(([month, revenue]) => ({ monthNum: parseInt(month), revenue }))
      .sort((a, b) => a.monthNum - b.monthNum);
  })();

  // Revenue by product type, grouped from productSummary
  const productTypeData = (() => {
    const map = {};
    productSummary.forEach((p) => {
      const type = p.productType || "Other";
      map[type] = (map[type] || 0) + (p.totalRevenue || 0);
    });
    return Object.entries(map)
      .map(([type, revenue]) => ({ type, revenue }))
      .sort((a, b) => b.revenue - a.revenue);
  })();

  // Revenue by client segment, grouped from customerData + sales
  // Uses clientSegment from /api/clients
  const segmentData = (() => {
    const map = {};
    customerData.forEach((c) => {
      const seg = c.clientSegment || "Other";
      if (!map[seg]) map[seg] = 0;
      map[seg] += 1;
    });
    return Object.entries(map)
      .map(([segment, count]) => ({ segment, count }))
      .sort((a, b) => b.count - a.count);
  })();

  // Build invoice status counts from invoiceSummary
  // invoiceSummary returns orders with invoiceStatus field
  const invoiceStatusData = (() => {
    const map = {};
    invoiceSummary.forEach((inv) => {
      const status = inv.invoiceStatus || "Unknown";
      map[status] = (map[status] || 0) + 1;
    });
    return Object.entries(map).map(([status, count]) => ({ status, count }));
  })();

  // KPI cards from real data
  const totalCustomers  = customerSummary.length;
  const activeCustomers = customerSummary.filter(c => c.accountStatus === "Active").length;
  const totalOrders     = allSales.length;

  // Territory chart
  useEffect(() => {
    if (!territoryChartRef.current || territory.length === 0) return;
    territoryChartRef.current.innerHTML = "";

    // Group territory by country
    const byCountry = {};
    territory.forEach(d => {
      byCountry[d.country] = (byCountry[d.country] || 0) + (d.totalRevenue || 0);
    });
    const chartData = Object.entries(byCountry)
      .map(([country, revenue]) => ({ country, revenue }))
      .sort((a, b) => b.revenue - a.revenue);

    const plot = Plot.plot({
      width:        territoryChartRef.current.offsetWidth || 300,
      height:       Math.max(140, chartData.length * 32 + 40),
      marginLeft:   90,
      marginBottom: 30,
      marginTop:    8,
      marginRight:  16,
      marks: [
        Plot.barX(chartData, {
          x:    "revenue",
          y:    "country",
          fill: isDark ? "#7c9fff" : "#1a2a6c",
          rx:   3,
          sort: { y: "-x" },
        }),
        Plot.ruleX([0]),
      ],
      x: {
        label:       null,
        grid:        true,
        tickFormat:  d => `€${(d/1000).toFixed(0)}K`,
        tickPadding: 6,
      },
      y: { label: null },
      style: { fontSize: "10px", color: t.textSecondary, background: "transparent" },
    });

    territoryChartRef.current.appendChild(plot);
    return () => plot.remove();
  }, [isDark, territory]);

  // Invoice status chart 
  useEffect(() => {
    if (!invoiceChartRef.current || invoiceStatusData.length === 0) return;
    invoiceChartRef.current.innerHTML = "";

    const statusColors = {
      Paid:      isDark ? "#22c55e" : "#16a34a",
      Pending:   isDark ? "#fbbf24" : "#f59e0b",
      Overdue:   isDark ? "#ef4444" : "#dc2626",
      Cancelled: isDark ? "#94a3b8" : "#aaa",
    };

    const plot = Plot.plot({
      width:        invoiceChartRef.current.offsetWidth || 300,
      height:       Math.max(120, invoiceStatusData.length * 36 + 40),
      marginLeft:   80,
      marginBottom: 30,
      marginTop:    8,
      marginRight:  16,
      marks: [
        Plot.barX(invoiceStatusData, {
          x:    "count",
          y:    "status",
          fill: (d) => statusColors[d.status] || (isDark ? "#7c9fff" : "#1a2a6c"),
          rx:   3,
          sort: { y: "-x" },
        }),
        Plot.text(invoiceStatusData, {
          x:          "count",
          y:          "status",
          text:       d => d.count,
          dx:         8,
          fill:       isDark ? "#e2e8f0" : "#1a2a6c",
          fontSize:   "11px",
          fontWeight: "600",
        }),
        Plot.ruleX([0]),
      ],
      x: { label: null, grid: true, tickPadding: 6 },
      y: { label: null },
      style: { fontSize: "10px", color: t.textSecondary, background: "transparent" },
    });

    invoiceChartRef.current.appendChild(plot);
    return () => plot.remove();
  }, [isDark, invoiceSummary]);

  // Revenue by product type chart
  useEffect(() => {
    if (!productTypeChartRef.current || productTypeData.length === 0) return;
    productTypeChartRef.current.innerHTML = "";

    const plot = Plot.plot({
      width:        productTypeChartRef.current.offsetWidth || 300,
      height:       Math.max(160, productTypeData.length * 36 + 40),
      marginLeft:   110,
      marginBottom: 30,
      marginTop:    8,
      marginRight:  60,
      marks: [
        Plot.barX(productTypeData, {
          x:    "revenue",
          y:    "type",
          fill: isDark ? "#7c9fff" : "#1a2a6c",
          rx:   3,
          sort: { y: "-x" },
        }),
        Plot.text(productTypeData, {
          x:          "revenue",
          y:          "type",
          text:       d => `€${(d.revenue/1000).toFixed(1)}K`,
          dx:         8,
          fill:       isDark ? "#e2e8f0" : "#1a2a6c",
          fontSize:   "11px",
          fontWeight: "600",
        }),
        Plot.ruleX([0]),
      ],
      x: {
        label:       null,
        grid:        true,
        tickFormat:  d => `€${(d/1000).toFixed(0)}K`,
        tickPadding: 6,
      },
      y: { label: null },
      style: { fontSize: "10px", color: t.textSecondary, background: "transparent" },
    });

    productTypeChartRef.current.appendChild(plot);
    return () => plot.remove();
  }, [isDark, productTypeData]);

  // Customer segment chart
  useEffect(() => {
    if (!segmentChartRef.current || segmentData.length === 0) return;
    segmentChartRef.current.innerHTML = "";

    const plot = Plot.plot({
      width:        segmentChartRef.current.offsetWidth || 300,
      height:       Math.max(160, segmentData.length * 36 + 40),
      marginLeft:   90,
      marginBottom: 30,
      marginTop:    8,
      marginRight:  50,
      marks: [
        Plot.barX(segmentData, {
          x:    "count",
          y:    "segment",
          fill: isDark ? "#60a5fa" : "#3b82f6",
          rx:   3,
          sort: { y: "-x" },
        }),
        Plot.text(segmentData, {
          x:          "count",
          y:          "segment",
          text:       d => d.count,
          dx:         8,
          fill:       isDark ? "#e2e8f0" : "#1a2a6c",
          fontSize:   "11px",
          fontWeight: "600",
        }),
        Plot.ruleX([0]),
      ],
      x: {
        label:       "Customers",
        grid:        true,
        tickPadding: 6,
      },
      y: { label: null },
      style: { fontSize: "10px", color: t.textSecondary, background: "transparent" },
    });

    segmentChartRef.current.appendChild(plot);
    return () => plot.remove();
  }, [isDark, segmentData]);

  // Recent sales from allSales
  const sortedSales = [...allSales].sort((a, b) => 
  new Date(b.orderDate) - new Date(a.orderDate)
  );

  const visibleSales = hasFeature("Pro")
    ? sortedSales.slice(0, 8)
    : sortedSales.slice(0, 3);

  return (
    <div style={styles.wrapper}>

      {/* Not logged in banner */}
      {!user && (
        <div style={{ ...styles.banner, background: t.cardBg, border: `1px solid ${t.border}` }}>
          <div>
            <div style={{ ...styles.bannerTitle, color: t.textPrimary }}>Welcome to Sales Analytics</div>
            <div style={{ ...styles.bannerSub, color: t.textSecondary }}>
              Sign in to unlock full dashboard access based on your subscription plan.
            </div>
          </div>
          <button style={styles.bannerBtn} onClick={openLoginModel}>Sign In</button>
        </div>
      )}

      {/* KPI Cards */}
      <div style={styles.kpiGrid}>
        {[
          {
            label:    "Total Revenue",
            value:    totalRevenue != null ? `€${(totalRevenue/1000).toFixed(1)}K` : "-",
            positive: true,
          },
          {
            label:    "Total Customers",
            value:    loading ? "-" : totalCustomers,
            positive: true,
          },
          {
            label:    "Active Customers",
            value:    loading ? "-" : activeCustomers,
            positive: true,
          },
          {
            label:    "Total Orders",
            value:    loading ? "-" : totalOrders.toLocaleString(),
            positive: true,
          },
        ].map((kpi) => (
          <div key={kpi.label} style={{ ...styles.kpiCard, background: t.cardBg, border: `1px solid ${t.border}` }}>
            <div style={styles.kpiTop}>
              <span style={{ ...styles.kpiLabel, color: t.textSecondary }}>{kpi.label}</span>
            </div>
            <div style={{ ...styles.kpiValue, color: t.textPrimary }}>
              {loading ? "-" : kpi.value}
            </div>
          </div>
        ))}
      </div>

      {/* Charts 2x2 */}
      <div style={styles.chartsGrid}>

        {/* Revenue by Product Type - Pro+ */}
        <div style={{ ...styles.chartCard, background: t.cardBg, border: `1px solid ${t.border}` }}>
          <div style={styles.chartHeader}>
            <div>
              <div style={{ ...styles.chartTitle, color: t.textPrimary }}>Revenue by Product Type</div>
              <div style={{ ...styles.chartSub, color: t.textSecondary }}>Total revenue grouped by product type</div>
            </div>
            <span style={{ ...styles.planPill, background: "#dbeafe", color: "#1d4ed8" }}>Pro+</span>
          </div>
          {hasFeature("Pro") ? (
            productTypeData.length > 0 ? (
              <div ref={productTypeChartRef} style={{ width: "100%", marginTop: "8px" }} />
            ) : (
              <div style={{ ...styles.stateBox, color: t.textSecondary }}>
                {loading ? "Loading..." : "No product data"}
              </div>
            )
          ) : (
            <LockedChart tier="Pro" onUpgrade={openLoginModel} t={t} />
          )}
        </div>

        {/* Territory Chart - Pro+ */}
        <div style={{ ...styles.chartCard, background: t.cardBg, border: `1px solid ${t.border}` }}>
          <div style={styles.chartHeader}>
            <div>
              <div style={{ ...styles.chartTitle, color: t.textPrimary }}>Revenue by Territory</div>
              <div style={{ ...styles.chartSub, color: t.textSecondary }}>Revenue grouped by country</div>
            </div>
            <span style={{ ...styles.planPill, background: "#dbeafe", color: "#1d4ed8" }}>Pro+</span>
          </div>
          {hasFeature("Pro") ? (
            territory.length > 0 ? (
              <div ref={territoryChartRef} style={{ width: "100%", marginTop: "8px" }} />
            ) : (
              <div style={{ ...styles.stateBox, color: t.textSecondary }}>
                {loading ? "Loading..." : "No territory data"}
              </div>
            )
          ) : (
            <LockedChart tier="Pro" onUpgrade={openLoginModel} t={t} />
          )}
        </div>

        {/* Invoice Status - Enterprise only */}
        <div style={{ ...styles.chartCard, background: t.cardBg, border: `1px solid ${t.border}` }}>
          <div style={styles.chartHeader}>
            <div>
              <div style={{ ...styles.chartTitle, color: t.textPrimary }}>Invoice Status</div>
              <div style={{ ...styles.chartSub, color: t.textSecondary }}>Orders by invoice status</div>
            </div>
            <span style={{ ...styles.planPill, background: "#ede9fe", color: "#7c3aed" }}>Enterprise</span>
          </div>
          {hasFeature("Enterprise") ? (
            invoiceStatusData.length > 0 ? (
              <div ref={invoiceChartRef} style={{ width: "100%", marginTop: "8px" }} />
            ) : (
              <div style={{ ...styles.stateBox, color: t.textSecondary }}>
                {loading ? "Loading..." : "No invoice data"}
              </div>
            )
          ) : (
            <LockedChart tier="Enterprise" onUpgrade={openLoginModel} t={t} />
          )}
        </div>

        {/* Customers by Segment - Pro+ */}
        <div style={{ ...styles.chartCard, background: t.cardBg, border: `1px solid ${t.border}` }}>
          <div style={styles.chartHeader}>
            <div>
              <div style={{ ...styles.chartTitle, color: t.textPrimary }}>Customers by Segment</div>
              <div style={{ ...styles.chartSub, color: t.textSecondary }}>Customer count per client segment</div>
            </div>
            <span style={{ ...styles.planPill, background: "#dbeafe", color: "#1d4ed8" }}>Pro+</span>
          </div>
          {hasFeature("Pro") ? (
            segmentData.length > 0 ? (
              <div ref={segmentChartRef} style={{ width: "100%", marginTop: "8px" }} />
            ) : (
              <div style={{ ...styles.stateBox, color: t.textSecondary }}>
                {loading ? "Loading..." : "No segment data"}
              </div>
            )
          ) : (
            <LockedChart tier="Pro" onUpgrade={openLoginModel} t={t} />
          )}
        </div>

      </div>

      {/* Recent Sales Table */}
      <div style={{ ...styles.tableCard, background: t.cardBg, border: `1px solid ${t.border}` }}>
        <div style={styles.tableHeader}>
          <div>
            <div style={{ ...styles.chartTitle, color: t.textPrimary }}>
              Recent Sales
              {user && !hasFeature("Pro") && (
                <span style={{ ...styles.limitedTag, color: t.textSecondary }}> - limited preview</span>
              )}
            </div>
            <div style={{ ...styles.chartSub, color: t.textSecondary }}>Latest sales orders</div>
          </div>
          {user && !hasFeature("Pro") && (
            <button style={styles.upgradeBtn} onClick={openLoginModel}>Upgrade to Pro</button>
          )}
        </div>

        {loading ? (
          <div style={{ ...styles.stateBox, color: t.textSecondary }}>Loading...</div>
        ) : (
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${t.border}` }}>
                  {["Order No.", "Order Date", "Ship Date", "Quantity", "Sales Amount"].map((h) => (
                    <th key={h} style={{ ...styles.th, color: t.textSecondary }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {visibleSales.map((s, i) => (
                  <tr key={i} style={{ borderBottom: `1px solid ${t.borderLight}` }}>
                    <td style={{ ...styles.td, color: t.textSecondary, fontFamily: "monospace" }}>
                      {s.orderNumber}
                    </td>
                    <td style={{ ...styles.td, color: t.textSecondary }}>{s.orderDate}</td>
                    <td style={{ ...styles.td, color: t.textSecondary }}>{s.shipDate}</td>
                    <td style={{ ...styles.td, color: t.textSecondary }}>{s.quantity}</td>
                    <td style={{ ...styles.td, color: t.textPrimary, fontWeight: 600 }}>
                      €{s.salesAmount?.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {user && !hasFeature("Pro") && (
          <div style={{
            ...styles.tableGradient,
            background: isDark
              ? "linear-gradient(to bottom, transparent, #1e293b)"
              : "linear-gradient(to bottom, transparent, #ffffff)",
          }} />
        )}
      </div>

    </div>
  );
}

function LockedChart({ tier, onUpgrade, t }) {
  const colors = { Pro: "#1d4ed8", Enterprise: "#7c3aed" };
  const bgs    = { Pro: "#dbeafe", Enterprise: "#ede9fe"  };
  return (
    <div style={styles.locked}>
      <div style={{ ...styles.lockedBadge, background: bgs[tier], color: colors[tier] }}>
        {tier} Plan Required
      </div>
      <p style={{ ...styles.lockedText, color: t.textSecondary }}>
        Upgrade to unlock this chart.
      </p>
      <button style={{ ...styles.lockedBtn, background: colors[tier] }} onClick={onUpgrade}>
        Upgrade to {tier}
      </button>
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
  banner: {
    padding:        "16px 20px",
    borderRadius:   "10px",
    display:        "flex",
    justifyContent: "space-between",
    alignItems:     "center",
    gap:            "16px",
  },
  bannerTitle: {
    fontSize:     "15px",
    fontWeight:   "700",
    marginBottom: "4px",
  },
  bannerSub: {
    fontSize: "13px",
  },
  bannerBtn: {
    padding:      "8px 20px",
    background:   "#1a2a6c",
    color:        "#fff",
    border:       "none",
    borderRadius: "6px",
    fontSize:     "13px",
    fontWeight:   "600",
    cursor:       "pointer",
    whiteSpace:   "nowrap",
  },
  kpiGrid: {
    display:             "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap:                 "16px",
  },
  kpiCard: {
    padding:      "18px 20px",
    borderRadius: "10px",
  },
  kpiTop: {
    display:        "flex",
    justifyContent: "space-between",
    alignItems:     "center",
    marginBottom:   "10px",
  },
  kpiLabel: {
    fontSize:   "12px",
    fontWeight: "500",
  },
  kpiValue: {
    fontSize:   "26px",
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
    marginBottom:   "8px",
  },
  chartTitle: {
    fontSize:     "13px",
    fontWeight:   "600",
    marginBottom: "2px",
  },
  chartSub: {
    fontSize: "11px",
  },
  planPill: {
    fontSize:     "10px",
    fontWeight:   "700",
    padding:      "2px 8px",
    borderRadius: "20px",
    whiteSpace:   "nowrap",
  },
  stateBox: {
    padding:   "40px",
    textAlign: "center",
    fontSize:  "13px",
  },
  locked: {
    display:        "flex",
    flexDirection:  "column",
    alignItems:     "center",
    justifyContent: "center",
    gap:            "10px",
    padding:        "28px 16px",
    minHeight:      "200px",
  },
  lockedBadge: {
    padding:      "4px 12px",
    borderRadius: "20px",
    fontSize:     "11px",
    fontWeight:   "700",
  },
  lockedText: {
    fontSize:  "12px",
    margin:    0,
    textAlign: "center",
  },
  lockedBtn: {
    padding:      "7px 18px",
    border:       "none",
    borderRadius: "6px",
    color:        "#fff",
    fontSize:     "12px",
    fontWeight:   "600",
    cursor:       "pointer",
  },
  tableCard: {
    padding:      "20px",
    borderRadius: "10px",
    position:     "relative",
    overflow:     "hidden",
  },
  tableHeader: {
    display:        "flex",
    justifyContent: "space-between",
    alignItems:     "flex-start",
    marginBottom:   "16px",
  },
  limitedTag: {
    fontSize:   "12px",
    fontWeight: "400",
  },
  upgradeBtn: {
    padding:      "6px 14px",
    background:   "#1a2a6c",
    color:        "#fff",
    border:       "none",
    borderRadius: "6px",
    fontSize:     "12px",
    fontWeight:   "600",
    cursor:       "pointer",
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
  tableGradient: {
    position: "absolute",
    bottom:   0,
    left:     0,
    right:    0,
    height:   "64px",
  },
};

export default Overview;
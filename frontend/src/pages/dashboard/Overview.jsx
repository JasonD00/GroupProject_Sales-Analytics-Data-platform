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
import ChartToggle from "../../components/ChartToggle";

function Overview() {
  const { user, token, openLoginModel, hasFeature } = useAuth();
  const { isDark } = useTheme();
  const t    = isDark ? dark : light;
  const tier = user?.tier || "Growth";

  // API state
  const [totalRevenue,  setTotalRevenue]  = useState(null);
  const [customerStats, setCustomerStats] = useState(null);
  const [recentSales,   setRecentSales]   = useState([]);
  const [territory,     setTerritory]     = useState([]);
  const [loading,       setLoading]       = useState(true);

  // Auth header for every API call
  const authHeader = {
    "Authorization": `Bearer ${token}`,
    "Content-Type":  "application/json",
  };

  useEffect(() => {
    if (!token) return;

    const fetches = [
      // Total revenue — all tiers
      fetch("http://localhost:8080/api/sales/total-revenue", { headers: authHeader })
        .then(r => r.ok ? r.json() : null)
        .then(d => setTotalRevenue(d)),

      // Customer summary — all tiers
      fetch("http://localhost:8080/api/clients/summary", { headers: authHeader })
        .then(r => r.ok ? r.json() : null)
        .then(d => {
          if (d) {
            setCustomerStats({
              total:  d.length,
              active: d.filter(c => c.accountStatus === "Active").length,
            });
          }
        }),

      // Recent sales — all tiers
      fetch("http://localhost:8080/api/sales", { headers: authHeader })
        .then(r => r.ok ? r.json() : [])
        .then(d => setRecentSales(d.slice(0, 8))),
    ];

    // Territory data — Pro+ only
    if (hasFeature("Pro")) {
      fetches.push(
        fetch("http://localhost:8080/api/sales/territory", { headers: authHeader })
          .then(r => r.ok ? r.json() : [])
          .then(d => setTerritory(d))
      );
    }

    Promise.all(fetches).finally(() => setLoading(false));
  }, [token]);

  // Build KPI cards using data from database
  const kpiCards = [
    {
      label:    "Total Revenue",
      value:    totalRevenue != null ? `€${(totalRevenue / 1000).toFixed(0)}K` : "—",
      positive: true,
    },
    {
      label:    "Total Customers",
      value:    customerStats ? customerStats.total : "—",
      positive: true,
    },
    {
      label:    "Active Customers",
      value:    customerStats ? customerStats.active : "—",
      positive: true,
    },
    {
      label:    "Recent Sales",
      value:    recentSales.length > 0 ? recentSales.length : "—",
      positive: true,
    },
  ];

  // Build territory chart data
  // GET /api/sales/territory returns: { country, clientSegment, totalRevenue, orderCount, avgOrderValue }
  const territoryChartData = territory.map((t, i) => ({
    monthNum: i + 1,
    revenue:  t.totalRevenue || 0,
    label:    `${t.country} - ${t.clientSegment}`,
  }));

  // Recent transactions from sales data
  // GET /api/sales returns: { salesOrdNum, salesOrderDt, salesSales, salesQuantity, salesPrice }
  const visibleSales = hasFeature("Pro") ? recentSales : recentSales.slice(0, 3);

  const getStatusBg  = (s) => ({ Success: t.success, Failed: t.danger, Pending: t.warning }[s] || t.textSecondary);

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

      {/* Tier shown in sidebar */}

      {/* KPI Cards */}
      <div style={styles.kpiGrid}>
        {kpiCards.map((kpi) => (
          <div key={kpi.label} style={{ ...styles.kpiCard, background: t.cardBg, border: `1px solid ${t.border}` }}>
            <div style={styles.kpiTop}>
              <span style={{ ...styles.kpiLabel, color: t.textSecondary }}>{kpi.label}</span>
            </div>
            <div style={{ ...styles.kpiValue, color: t.textPrimary }}>
              {loading ? "—" : kpi.value}
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div style={styles.chartsGrid}>

        {/* Revenue by territory — Pro+ */}
        <div style={{ ...styles.chartCard, background: t.cardBg, border: `1px solid ${t.border}` }}>
          <div style={styles.chartHeader}>
            <div>
              <div style={{ ...styles.chartTitle, color: t.textPrimary }}>Revenue by Territory</div>
              <div style={{ ...styles.chartSub, color: t.textSecondary }}>Revenue grouped by country and segment</div>
            </div>
            <span style={{ ...styles.planPill, background: "#dbeafe", color: "#1d4ed8" }}>Pro+</span>
          </div>
          {hasFeature("Pro") ? (
            <TerritoryChart data={territory} isDark={isDark} t={t} />
          ) : (
            <LockedChart tier="Pro" onUpgrade={openLoginModel} t={t} />
          )}
        </div>

        {/* Mock revenue trend — all tiers */}
        <div style={{ ...styles.chartCard, background: t.cardBg, border: `1px solid ${t.border}` }}>
          <div style={styles.chartHeader}>
            <div>
              <div style={{ ...styles.chartTitle, color: t.textPrimary }}>Revenue Trend</div>
              <div style={{ ...styles.chartSub, color: t.textSecondary }}>Monthly revenue this year</div>
            </div>
            <span style={{ ...styles.planPill, background: t.successLight, color: t.success }}>All Plans</span>
          </div>
          <ChartToggle
            data={MOCK_REVENUE}
            xKey="monthNum"
            yKey="revenue"
            xFormat={(d) => ["","Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][d]}
            xDomain={[0.5, 12.5]}
            yLabel="Revenue (€)"
            height={200}
            tier={user?.tier || "GROWTH"}
          />
        </div>

        {/* Invoice revenue — Pro+ */}
        <div style={{ ...styles.chartCard, background: t.cardBg, border: `1px solid ${t.border}` }}>
          <div style={styles.chartHeader}>
            <div>
              <div style={{ ...styles.chartTitle, color: t.textPrimary }}>Invoice Revenue</div>
              <div style={{ ...styles.chartSub, color: t.textSecondary }}>Monthly paid invoices</div>
            </div>
            <span style={{ ...styles.planPill, background: "#dbeafe", color: "#1d4ed8" }}>Pro+</span>
          </div>
          {hasFeature("Pro") ? (
            <ChartToggle
              data={MOCK_INVOICE_REVENUE}
              xKey="monthNum"
              yKey="amount"
              xFormat={(d) => ["","Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][d]}
              xDomain={[0.5, 12.5]}
              yLabel="Amount (€)"
              height={200}
              tier={user?.tier || "GROWTH"}
            />
          ) : (
            <LockedChart tier="Pro" onUpgrade={openLoginModel} t={t} />
          )}
        </div>

        {/* Transaction volume — Enterprise */}
        <div style={{ ...styles.chartCard, background: t.cardBg, border: `1px solid ${t.border}` }}>
          <div style={styles.chartHeader}>
            <div>
              <div style={{ ...styles.chartTitle, color: t.textPrimary }}>Transaction Volume</div>
              <div style={{ ...styles.chartSub, color: t.textSecondary }}>Daily transaction count</div>
            </div>
            <span style={{ ...styles.planPill, background: "#ede9fe", color: "#7c3aed" }}>Enterprise</span>
          </div>
          {hasFeature("Enterprise") ? (
            <ChartToggle
              data={MOCK_TRANSACTION_VOLUME}
              xKey="day"
              yKey="count"
              yLabel="Count"
              height={200}
              tier={user?.tier || "GROWTH"}
            />
          ) : (
            <LockedChart tier="Enterprise" onUpgrade={openLoginModel} t={t} />
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
                <span style={{ ...styles.limitedTag, color: t.textSecondary }}> — limited preview</span>
              )}
            </div>
            <div style={{ ...styles.chartSub, color: t.textSecondary }}>Latest sales activity</div>
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
                  {["Order No.","Order Date","Amount","Quantity","Price"].map((h) => (
                    <th key={h} style={{ ...styles.th, color: t.textSecondary }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {visibleSales.map((s, i) => (
                  <tr key={i} style={{ borderBottom: `1px solid ${t.borderLight}` }}>
                    <td style={{ ...styles.td, color: t.textSecondary, fontFamily: "monospace" }}>
                      {s.salesOrdNum}
                    </td>
                    <td style={{ ...styles.td, color: t.textSecondary }}>{s.salesOrderDt}</td>
                    <td style={{ ...styles.td, color: t.textPrimary, fontWeight: 600 }}>
                      €{s.salesSales?.toLocaleString() || "—"}
                    </td>
                    <td style={{ ...styles.td, color: t.textSecondary }}>{s.salesQuantity}</td>
                    <td style={{ ...styles.td, color: t.textSecondary }}>
                      €{s.salesPrice?.toLocaleString() || "—"}
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

// Territory chart 
// Uses Observable Plot 
function TerritoryChart({ data, isDark, t }) {
  const chartRef = useRef(null);

  useEffect(() => {
    if (!chartRef.current || !data || data.length === 0) return;
    chartRef.current.innerHTML = "";

    const Plot = window.Plot;

    // Map territory data to chart format
    // GET /api/sales/territory returns: { country, clientSegment, totalRevenue, orderCount, avgOrderValue }
    const chartData = data.map(d => ({
      label:   `${d.country}`,
      revenue: d.totalRevenue || 0,
    }));

    const accent = isDark ? "#7c9fff" : "#1a2a6c";

    import("@observablehq/plot").then((Plot) => {
      const plot = Plot.plot({
        width:        chartRef.current.offsetWidth || 400,
        height:       200,
        marginLeft:   100,
        marginBottom: 30,
        marginTop:    8,
        marginRight:  16,
        marks: [
          Plot.barX(chartData, {
            x:    "revenue",
            y:    "label",
            fill: accent,
            rx:   3,
            sort: { y: "-x" },
          }),
          Plot.ruleX([0]),
        ],
        x: {
          label:       "Revenue (€)",
          grid:        true,
          tickFormat:  d => `€${(d/1000).toFixed(0)}K`,
          tickPadding: 6,
        },
        y: { label: null },
        style: {
          fontSize:   "11px",
          color:      isDark ? "#94a3b8" : "#555",
          background: "transparent",
        },
      });
      chartRef.current.appendChild(plot);
    });

    return () => {
      if (chartRef.current) chartRef.current.innerHTML = "";
    };
  }, [data, isDark]);

  if (!data || data.length === 0) {
    return (
      <div style={{ padding: "40px", textAlign: "center", fontSize: "12px", color: t.textSecondary }}>
        No territory data available
      </div>
    );
  }

  return <div ref={chartRef} style={{ width: "100%", marginTop: "8px" }} />;
}

function LockedChart({ tier, onUpgrade, t }) {
  const colors = { Pro: "#1d4ed8", Enterprise: "#7c3aed" };
  const bgs    = { Pro: "#dbeafe",  Enterprise: "#ede9fe"  };
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

// Mock data — will remove when all endpoints are connected
const MOCK_REVENUE = [
  { monthNum: 1,  revenue: 28500 }, { monthNum: 2,  revenue: 32000 },
  { monthNum: 3,  revenue: 29800 }, { monthNum: 4,  revenue: 35200 },
  { monthNum: 5,  revenue: 31500 }, { monthNum: 6,  revenue: 38000 },
  { monthNum: 7,  revenue: 34200 }, { monthNum: 8,  revenue: 36800 },
  { monthNum: 9,  revenue: 33500 }, { monthNum: 10, revenue: 37200 },
  { monthNum: 11, revenue: 35800 }, { monthNum: 12, revenue: 41500 },
];

const MOCK_INVOICE_REVENUE = [
  { monthNum: 1, amount: 28500 }, { monthNum: 2, amount: 32400 }, { monthNum: 3, amount: 35200 },
  { monthNum: 4, amount: 31800 }, { monthNum: 5, amount: 38900 }, { monthNum: 6, amount: 42100 },
  { monthNum: 7, amount: 39500 }, { monthNum: 8, amount: 44200 }, { monthNum: 9, amount: 41800 },
  { monthNum: 10, amount: 48500 }, { monthNum: 11, amount: 46300 }, { monthNum: 12, amount: 52800 },
];

const MOCK_TRANSACTION_VOLUME = [
  { day: 1, count: 12 }, { day: 2, count: 15 }, { day: 3, count: 18 },
  { day: 4, count: 14 }, { day: 5, count: 22 }, { day: 6, count: 19 },
  { day: 7, count: 25 }, { day: 8, count: 21 }, { day: 9, count: 28 },
  { day: 10, count: 24 }, { day: 11, count: 26 }, { day: 12, count: 29 },
  { day: 13, count: 23 }, { day: 14, count: 27 }, { day: 15, count: 32 },
];

const TIER_STYLES = {
  Growth:     { bg: "#dcfce7", text: "#16a34a" },
  Pro:        { bg: "#dbeafe", text: "#1d4ed8" },
  Enterprise: { bg: "#ede9fe", text: "#7c3aed" },
};

const light = {
  textPrimary:   "#1a2a6c", textSecondary: "#555",
  cardBg:        "#ffffff", border: "#e0e4ef", borderLight: "#f0f2f7",
  accent:        "#1a2a6c", accentLight: "#e0e7ff",
  success:       "#16a34a", successLight: "#dcfce7",
  warning:       "#f59e0b", warningLight: "#fef3c7",
  danger:        "#dc2626", dangerLight: "#fee2e2",
};

const dark = {
  textPrimary:   "#e2e8f0", textSecondary: "#94a3b8",
  cardBg:        "#1e293b", border: "#334155", borderLight: "#1e293b",
  accent:        "#7c9fff", accentLight: "#1e3a8a",
  success:       "#22c55e", successLight: "#064e3b",
  warning:       "#fbbf24", warningLight: "#78350f",
  danger:        "#ef4444", dangerLight: "#7f1d1d",
};

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
  tierRow: {
    padding:      "10px 16px",
    borderRadius: "8px",
    display:      "flex",
    alignItems:   "center",
    gap:          "10px",
    flexWrap:     "wrap",
  },
  tierLabel: {
    fontSize: "12px",
  },
  tierPill: {
    padding:      "3px 10px",
    borderRadius: "20px",
    fontSize:     "11px",
    fontWeight:   "700",
  },
  tierHint: {
    fontSize: "12px",
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
  tableGradient: {
    position: "absolute",
    bottom:   0,
    left:     0,
    right:    0,
    height:   "64px",
  },
};

export default Overview;
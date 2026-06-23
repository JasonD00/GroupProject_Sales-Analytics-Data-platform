/*
  Overview:
  Shows a switchable revenue trend chart, bar charts for sales by rep and by region and a team performance
  table that compares each reps sales against their target
*/

import { useState, useEffect, useRef } from "react";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import * as Plot from "@observablehq/plot";
import ChartToggle from "../../components/ChartToggle";

function Sales() {
  const { isDark } = useTheme();
  const { user }   = useAuth();
  const t = isDark ? dark : light;

  const repChartRef    = useRef(null);
  const regionChartRef = useRef(null);

  const [dateRange,      setDateRange]      = useState("12months");
  const [selectedRep,    setSelectedRep]    = useState("all");
  const [selectedRegion, setSelectedRegion] = useState("all");

  const tier = user?.tier || "Growth";

  // Sales by rep
  useEffect(() => {
    if (!repChartRef.current) return;
    repChartRef.current.innerHTML = "";
    const accent = isDark ? "#7c9fff" : "#1a2a6c";
    const plot = Plot.plot({
      width:        repChartRef.current.offsetWidth || 400,
      height:       180,
      marginLeft:   110,
      marginBottom: 30,
      marginTop:    8,
      marks: [
        Plot.barX(MOCK_SALES_BY_REP, {
          x: "sales", y: "name",
          fill:  accent,
          rx:    3,
          sort: { y: "-x" },
        }),
        Plot.text(MOCK_SALES_BY_REP, {
          x: "sales", y: "name",
          text: (d) => `€${(d.sales / 1000).toFixed(0)}K`,
          dx:   6,
          fill: isDark ? "#e2e8f0" : "#1a2a6c",
          fontSize: "11px",
          fontWeight: "600",
        }),
        Plot.ruleX([0]),
      ],
      x: { label: null, grid: true, tickFormat: (d) => `€${(d/1000).toFixed(0)}K` },
      y: { label: null },
      style: { fontSize: "11px", color: t.textSecondary, background: "transparent" },
    });
    repChartRef.current.appendChild(plot);
    return () => plot.remove();
  }, [isDark]);

  // Sales by region
  useEffect(() => {
    if (!regionChartRef.current) return;
    regionChartRef.current.innerHTML = "";
    const accent = isDark ? "#60a5fa" : "#3b82f6";
    const plot = Plot.plot({
      width:        regionChartRef.current.offsetWidth || 400,
      height:       140,
      marginLeft:   110,
      marginBottom: 30,
      marginTop:    8,
      marks: [
        Plot.barX(MOCK_SALES_BY_REGION, {
          x: "sales", y: "name",
          fill:  accent,
          rx:    3,
          sort: { y: "-x" },
        }),
        Plot.text(MOCK_SALES_BY_REGION, {
          x: "sales", y: "name",
          text: (d) => `€${(d.sales / 1000).toFixed(0)}K`,
          dx:   6,
          fill: isDark ? "#e2e8f0" : "#1a2a6c",
          fontSize: "11px",
          fontWeight: "600",
        }),
        Plot.ruleX([0]),
      ],
      x: { label: null, grid: true, tickFormat: (d) => `€${(d/1000).toFixed(0)}K` },
      y: { label: null },
      style: { fontSize: "11px", color: t.textSecondary, background: "transparent" },
    });
    regionChartRef.current.appendChild(plot);
    return () => plot.remove();
  }, [isDark]);

  return (
    <div style={styles.wrapper}>

      {/* Filters */}
      <div style={{ ...styles.filterBar, background: t.cardBg, border: `1px solid ${t.border}` }}>
        <div style={styles.filterGroup}>
          <label style={{ ...styles.filterLabel, color: t.textSecondary }}>Date Range</label>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            style={{ ...styles.select, background: t.inputBg, border: `1px solid ${t.border}`, color: t.textPrimary }}
          >
            <option value="3months">Last 3 Months</option>
            <option value="6months">Last 6 Months</option>
            <option value="12months">Last 12 Months</option>
            <option value="ytd">Year to Date</option>
          </select>
        </div>
        <div style={styles.filterGroup}>
          <label style={{ ...styles.filterLabel, color: t.textSecondary }}>Sales Rep</label>
          <select
            value={selectedRep}
            onChange={(e) => setSelectedRep(e.target.value)}
            style={{ ...styles.select, background: t.inputBg, border: `1px solid ${t.border}`, color: t.textPrimary }}
          >
            <option value="all">All Reps</option>
            <option value="john">John Smith</option>
            <option value="sarah">Sarah Johnson</option>
            <option value="michael">Michael Chen</option>
            <option value="emily">Emily Davis</option>
          </select>
        </div>
        <div style={styles.filterGroup}>
          <label style={{ ...styles.filterLabel, color: t.textSecondary }}>Region</label>
          <select
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            style={{ ...styles.select, background: t.inputBg, border: `1px solid ${t.border}`, color: t.textPrimary }}
          >
            <option value="all">All Regions</option>
            <option value="na">North America</option>
            <option value="eu">Europe</option>
            <option value="asia">Asia</option>
          </select>
        </div>
      </div>

      {/* Switchable revenue trend chart */}
      <div style={{ ...styles.chartCard, background: t.cardBg, border: `1px solid ${t.border}` }}>
        <div style={styles.chartHeader}>
          <div>
            <h3 style={{ ...styles.chartTitle, color: t.textPrimary }}>Revenue Trend</h3>
            <p style={{ ...styles.chartSub, color: t.textSecondary }}>Monthly revenue over selected period</p>
          </div>
          <div style={{ ...styles.totalPill, background: t.accentLight, color: t.accent }}>
            Total: €414K
          </div>
        </div>
        <ChartToggle
          data={MOCK_REVENUE}
          xKey="monthNum"
          yKey="revenue"
          xFormat={(d) => ["","Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][d]}
          xDomain={[0.5, 12.5]}
          yLabel="Revenue (€)"
          height={280}
          tier={tier}
        />
      </div>

      {/* Sales by rep + region */}
      <div style={styles.chartsRow}>
        <div style={{ ...styles.chartCard, background: t.cardBg, border: `1px solid ${t.border}` }}>
          <h3 style={{ ...styles.chartTitle, color: t.textPrimary }}>Sales by Rep</h3>
          <p style={{ ...styles.chartSub, color: t.textSecondary }}>Year to date performance</p>
          <div ref={repChartRef} style={{ width: "100%", marginTop: "12px" }} />
        </div>
        <div style={{ ...styles.chartCard, background: t.cardBg, border: `1px solid ${t.border}` }}>
          <h3 style={{ ...styles.chartTitle, color: t.textPrimary }}>Sales by Region</h3>
          <p style={{ ...styles.chartSub, color: t.textSecondary }}>Year to date performance</p>
          <div ref={regionChartRef} style={{ width: "100%", marginTop: "12px" }} />
        </div>
      </div>

      {/* Team performance table*/}
      <div style={{ ...styles.tableCard, background: t.cardBg, border: `1px solid ${t.border}` }}>
        <h3 style={{ ...styles.chartTitle, color: t.textPrimary, marginBottom: "4px" }}>Team Performance</h3>
        <p style={{ ...styles.chartSub, color: t.textSecondary, marginBottom: "16px" }}>Individual rep breakdown</p>
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${t.border}` }}>
                {["Sales Rep", "Region", "Sales", "Deals", "Avg Deal", "Target", "% of Target"].map((h) => (
                  <th key={h} style={{ ...styles.th, color: t.textSecondary }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {TEAM_PERFORMANCE.map((rep) => (
                <tr key={rep.name} style={{ borderBottom: `1px solid ${t.borderLight}` }}>
                  <td style={{ ...styles.td, color: t.textPrimary, fontWeight: "500" }}>{rep.name}</td>
                  <td style={{ ...styles.td, color: t.textSecondary }}>{rep.region}</td>
                  <td style={{ ...styles.td, color: t.textPrimary, fontWeight: "600" }}>€{rep.sales.toLocaleString()}</td>
                  <td style={{ ...styles.td, color: t.textSecondary }}>{rep.deals}</td>
                  <td style={{ ...styles.td, color: t.textSecondary }}>€{rep.avgDeal.toLocaleString()}</td>
                  <td style={{ ...styles.td, color: t.textSecondary }}>€{rep.target.toLocaleString()}</td>
                  <td style={{ ...styles.td }}>
                    <span style={{
                      ...styles.pctBadge,
                      background: rep.percent >= 100 ? t.successLight : t.warningLight,
                      color:      rep.percent >= 100 ? t.success      : t.warning,
                    }}>
                      {rep.percent}%
                    </span>
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
// TODO: Remove once backend is connected — replace each with API fetch 
const MOCK_REVENUE = [
  { monthNum: 1,  revenue: 28500 }, { monthNum: 2,  revenue: 32000 },
  { monthNum: 3,  revenue: 29800 }, { monthNum: 4,  revenue: 35200 },
  { monthNum: 5,  revenue: 31500 }, { monthNum: 6,  revenue: 38000 },
  { monthNum: 7,  revenue: 34200 }, { monthNum: 8,  revenue: 36800 },
  { monthNum: 9,  revenue: 33500 }, { monthNum: 10, revenue: 37200 },
  { monthNum: 11, revenue: 35800 }, { monthNum: 12, revenue: 41500 },
];

const MOCK_SALES_BY_REP = [
  { name: "John Smith",    sales: 45000 },
  { name: "Sarah Johnson", sales: 38500 },
  { name: "Michael Chen",  sales: 42000 },
  { name: "Emily Davis",   sales: 35200 },
];

const MOCK_SALES_BY_REGION = [
  { name: "North America", sales: 52000 },
  { name: "Europe",        sales: 48500 },
  { name: "Asia",          sales: 42200 },
];

const TEAM_PERFORMANCE = [
  { name: "John Smith",    region: "North America", sales: 45000, deals: 32, avgDeal: 1406, target: 40000, percent: 112 },
  { name: "Sarah Johnson", region: "Europe",        sales: 38500, deals: 28, avgDeal: 1375, target: 35000, percent: 110 },
  { name: "Michael Chen",  region: "Asia",          sales: 42000, deals: 30, avgDeal: 1400, target: 45000, percent: 93  },
  { name: "Emily Davis",   region: "North America", sales: 35200, deals: 25, avgDeal: 1408, target: 40000, percent: 88  },
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
  accentLight:   "#e0e7ff",
  success:       "#16a34a",
  successLight:  "#dcfce7",
  warning:       "#f59e0b",
  warningLight:  "#fef3c7",
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
};

// STYLING
const styles = {
  wrapper: {
    display:       "flex",
    flexDirection: "column",
    gap:           "20px",
  },
  filterBar: {
    padding:    "16px 20px",
    borderRadius:"10px",
    display:    "flex",
    gap:        "24px",
    flexWrap:   "wrap",
    alignItems: "center",
  },
  filterGroup: {
    display:    "flex",
    alignItems: "center",
    gap:        "8px",
  },
  filterLabel: {
    fontSize:   "12px",
    fontWeight: "500",
    whiteSpace: "nowrap",
  },
  select: {
    padding:      "7px 12px",
    borderRadius: "6px",
    fontSize:     "13px",
    cursor:       "pointer",
    outline:      "none",
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
    margin:     "0 0 4px 0",
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
  chartsRow: {
    display:             "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap:                 "20px",
  },
  tableCard: {
    padding:      "20px",
    borderRadius: "10px",
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
  pctBadge: {
    padding:      "3px 9px",
    borderRadius: "20px",
    fontSize:     "11px",
    fontWeight:   "600",
  },
};

export default Sales;
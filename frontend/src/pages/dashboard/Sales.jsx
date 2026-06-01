import { useState, useEffect } from "react";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import SalesChart from "../../components/SalesChart";

function Sales() {
  const { isDark } = useTheme();
  const { user } = useAuth();
  const t = isDark ? dark : light;

  const [dateRange, setDateRange] = useState("12months");
  const [selectedRep, setSelectedRep] = useState("all");
  const [selectedRegion, setSelectedRegion] = useState("all");

  // Mock data
  const [revenueData, setRevenueData] = useState([]);
  const [salesByRep, setSalesByRep] = useState([]);
  const [salesByRegion, setSalesByRegion] = useState([]);

  useEffect(() => {
    // Simulate API call
    setRevenueData(MOCK_REVENUE);
    setSalesByRep(MOCK_SALES_BY_REP);
    setSalesByRegion(MOCK_SALES_BY_REGION);
  }, [dateRange, selectedRep, selectedRegion]);

  return (
    <div style={styles.wrapper}>
      
      {/* Filters */}
      <div style={{ ...styles.filterBar, background: t.cardBg, border: `1px solid ${t.border}` }}>
        <div style={styles.filterGroup}>
          <label style={{ ...styles.label, color: t.textSecondary }}>Date Range:</label>
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
          <label style={{ ...styles.label, color: t.textSecondary }}>Sales Rep:</label>
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
          <label style={{ ...styles.label, color: t.textSecondary }}>Region:</label>
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

      {/* Revenue Chart */}
      <SalesChart 
        data={revenueData} 
        type="line" 
        title="Revenue Trend" 
        isDetailed={true}
      />

      {/* Sales by Rep and Region */}
      <div style={styles.chartsGrid}>
        <div style={{ ...styles.chartCard, background: t.cardBg, border: `1px solid ${t.border}` }}>
          <h3 style={{ ...styles.chartTitle, color: t.textPrimary }}>Sales by Rep</h3>
          <div style={styles.barChartContainer}>
            {salesByRep.map((rep) => (
              <div key={rep.name} style={styles.barRow}>
                <span style={{ ...styles.barLabel, color: t.textSecondary }}>{rep.name}</span>
                <div style={styles.barTrack}>
                  <div
                    style={{
                      ...styles.barFill,
                      width: `${(rep.sales / 50000) * 100}%`,
                      background: t.accent,
                    }}
                  />
                </div>
                <span style={{ ...styles.barValue, color: t.textPrimary }}>€{rep.sales.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ ...styles.chartCard, background: t.cardBg, border: `1px solid ${t.border}` }}>
          <h3 style={{ ...styles.chartTitle, color: t.textPrimary }}>Sales by Region</h3>
          <div style={styles.barChartContainer}>
            {salesByRegion.map((region) => (
              <div key={region.name} style={styles.barRow}>
                <span style={{ ...styles.barLabel, color: t.textSecondary }}>{region.name}</span>
                <div style={styles.barTrack}>
                  <div
                    style={{
                      ...styles.barFill,
                      width: `${(region.sales / 60000) * 100}%`,
                      background: t.accentAlt,
                    }}
                  />
                </div>
                <span style={{ ...styles.barValue, color: t.textPrimary }}>€{region.sales.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Performance Table */}
      <div style={{ ...styles.tableCard, background: t.cardBg, border: `1px solid ${t.border}` }}>
        <h3 style={{ ...styles.tableTitle, color: t.textPrimary }}>Team Performance</h3>
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr style={{ borderBottom: `2px solid ${t.border}` }}>
                <th style={{ ...styles.th, color: t.textPrimary }}>Sales Rep</th>
                <th style={{ ...styles.th, color: t.textPrimary }}>Region</th>
                <th style={{ ...styles.th, color: t.textPrimary }}>Sales</th>
                <th style={{ ...styles.th, color: t.textPrimary }}>Deals Closed</th>
                <th style={{ ...styles.th, color: t.textPrimary }}>Avg Deal Size</th>
                <th style={{ ...styles.th, color: t.textPrimary }}>Target</th>
                <th style={{ ...styles.th, color: t.textPrimary }}>% of Target</th>
              </tr>
            </thead>
            <tbody>
              {TEAM_PERFORMANCE.map((rep) => (
                <tr key={rep.name} style={{ borderBottom: `1px solid ${t.borderLight}` }}>
                  <td style={{ ...styles.td, color: t.textPrimary, fontWeight: "500" }}>{rep.name}</td>
                  <td style={{ ...styles.td, color: t.textSecondary }}>{rep.region}</td>
                  <td style={{ ...styles.td, color: t.textPrimary }}>€{rep.sales.toLocaleString()}</td>
                  <td style={{ ...styles.td, color: t.textSecondary }}>{rep.deals}</td>
                  <td style={{ ...styles.td, color: t.textSecondary }}>€{rep.avgDeal.toLocaleString()}</td>
                  <td style={{ ...styles.td, color: t.textSecondary }}>€{rep.target.toLocaleString()}</td>
                  <td style={{ ...styles.td, color: rep.percent >= 100 ? t.success : t.warning }}>
                    {rep.percent}%
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
const MOCK_REVENUE = [
  { month: "Jan", revenue: 28500 },
  { month: "Feb", revenue: 32000 },
  { month: "Mar", revenue: 29800 },
  { month: "Apr", revenue: 35200 },
  { month: "May", revenue: 31500 },
  { month: "Jun", revenue: 38000 },
  { month: "Jul", revenue: 34200 },
  { month: "Aug", revenue: 36800 },
  { month: "Sep", revenue: 33500 },
  { month: "Oct", revenue: 37200 },
  { month: "Nov", revenue: 35800 },
  { month: "Dec", revenue: 41500 },
];

const MOCK_SALES_BY_REP = [
  { name: "John Smith", sales: 45000 },
  { name: "Sarah Johnson", sales: 38500 },
  { name: "Michael Chen", sales: 42000 },
  { name: "Emily Davis", sales: 35200 },
];

const MOCK_SALES_BY_REGION = [
  { name: "North America", sales: 52000 },
  { name: "Europe", sales: 48500 },
  { name: "Asia", sales: 42200 },
];

const TEAM_PERFORMANCE = [
  { name: "John Smith", region: "North America", sales: 45000, deals: 32, avgDeal: 1406, target: 40000, percent: 112 },
  { name: "Sarah Johnson", region: "Europe", sales: 38500, deals: 28, avgDeal: 1375, target: 35000, percent: 110 },
  { name: "Michael Chen", region: "Asia", sales: 42000, deals: 30, avgDeal: 1400, target: 45000, percent: 93 },
  { name: "Emily Davis", region: "North America", sales: 35200, deals: 25, avgDeal: 1408, target: 40000, percent: 88 },
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
  accentAlt: "#7c9fff",
  success: "#16a34a",
  warning: "#f59e0b",
};

const dark = {
  textPrimary: "#e2e8f0",
  textSecondary: "#94a3b8",
  cardBg: "#1e293b",
  border: "#334155",
  borderLight: "#334155",
  inputBg: "#0f172a",
  accent: "#7c9fff",
  accentAlt: "#60a5fa",
  success: "#22c55e",
  warning: "#fbbf24",
};

// STYLES
const styles = {
  wrapper: {
    display: "flex",
    flexDirection: "column",
    gap: "24px",
  },
  filterBar: {
    padding: "20px",
    borderRadius: "10px",
    display: "flex",
    gap: "20px",
    flexWrap: "wrap",
  },
  filterGroup: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  label: {
    fontSize: "13px",
    fontWeight: "500",
  },
  select: {
    padding: "6px 12px",
    borderRadius: "6px",
    fontSize: "13px",
    cursor: "pointer",
    outline: "none",
  },
  chartsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "24px",
  },
  chartCard: {
    padding: "24px",
    borderRadius: "10px",
  },
  chartTitle: {
    margin: "0 0 20px 0",
    fontSize: "16px",
    fontWeight: "700",
  },
  barChartContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  barRow: {
    display: "grid",
    gridTemplateColumns: "120px 1fr 80px",
    gap: "12px",
    alignItems: "center",
  },
  barLabel: {
    fontSize: "13px",
  },
  barTrack: {
    height: "20px",
    background: "rgba(0,0,0,0.05)",
    borderRadius: "10px",
    overflow: "hidden",
  },
  barFill: {
    height: "100%",
    borderRadius: "10px",
    transition: "width 0.3s",
  },
  barValue: {
    fontSize: "13px",
    fontWeight: "600",
    textAlign: "right",
  },
  tableCard: {
    padding: "24px",
    borderRadius: "10px",
  },
  tableTitle: {
    margin: "0 0 20px 0",
    fontSize: "16px",
    fontWeight: "700",
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
};

export default Sales;
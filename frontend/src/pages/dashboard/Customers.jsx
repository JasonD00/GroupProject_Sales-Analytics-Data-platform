import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import * as Plot from "@observablehq/plot";
import ChartToggle from "../../components/ChartToggle";

function Customers() {
  const { isDark }  = useTheme();
  const { user }    = useAuth();
  const navigate    = useNavigate();
  const t           = isDark ? dark : light;
  const tier        = user?.tier || "Growth";

  const statusChartRef = useRef(null);

  const [customers, setCustomers] = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState(null);

  const [regionFilter, setRegionFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm,   setSearchTerm]   = useState("");
  const [sortBy,       setSortBy]       = useState("name");

  useEffect(() => {
    fetch("http://localhost:8080/api/clients")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch customers");
        return res.json();
      })
      .then((data) => {
        const mapped = data.map((c) => ({
          id:         c.clientId,
          name:       `${c.firstName} ${c.lastName}`,
          email:      c.email      || "N/A",
          region:     c.country,
          totalSpend: c.totalSpend || 0,
          orders:     c.orders     || 0,
          lastOrder:  c.createDate || "N/A",
          status:     c.accountStatus,
          segment:    c.clientSegment,
        }));
        setCustomers(mapped);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  // Filter + sort
  let filtered = customers.filter((c) => {
    const matchRegion = regionFilter === "all" || c.region === regionFilter;
    const matchStatus = statusFilter === "all" || c.status === statusFilter;
    const matchSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(c.id).toLowerCase().includes(searchTerm.toLowerCase());
    return matchRegion && matchStatus && matchSearch;
  });

  if (sortBy === "spend") filtered.sort((a, b) => b.totalSpend - a.totalSpend);
  if (sortBy === "name")  filtered.sort((a, b) => a.name.localeCompare(b.name));
  if (sortBy === "orders") filtered.sort((a, b) => b.orders - a.orders);

  // KPIs 
  const totalCustomers  = customers.length;
  const activeCount     = customers.filter(c => c.status === "Active").length;
  const inactiveCount   = customers.filter(c => c.status === "Inactive").length;
  const avgSpend        = totalCustomers > 0
    ? Math.round(customers.reduce((s, c) => s + c.totalSpend, 0) / totalCustomers)
    : 0;

  // Mock monthly new customer data for chart
  // TODO: replace with GET /api/clients/monthly
  const MOCK_MONTHLY = [
    { monthNum: 1, count: 42 }, { monthNum: 2, count: 38 },
    { monthNum: 3, count: 55 }, { monthNum: 4, count: 49 },
    { monthNum: 5, count: 61 }, { monthNum: 6, count: 58 },
    { monthNum: 7, count: 72 }, { monthNum: 8, count: 65 },
    { monthNum: 9, count: 70 }, { monthNum: 10, count: 83 },
    { monthNum: 11, count: 78 }, { monthNum: 12, count: 90 },
  ];

  // Status charts
  useEffect(() => {
    if (!statusChartRef.current) return;
    statusChartRef.current.innerHTML = "";

    const statusData = [
      { status: "Active",   count: customers.filter(c => c.status === "Active").length,   color: isDark ? "#22c55e" : "#16a34a" },
      { status: "Inactive", count: customers.filter(c => c.status === "Inactive").length, color: isDark ? "#fbbf24" : "#f59e0b" },
    ];

    if (statusData.every(d => d.count === 0)) return;

    const plot = Plot.plot({
      width:        statusChartRef.current.offsetWidth || 400,
      height:       110,
      marginLeft:   88,
      marginBottom: 38,
      marginTop:    8,
      marks: [
        Plot.barX(statusData, { x: "count", y: "status", fill: (d) => d.color, rx: 3 }),
        Plot.text(statusData, {
          x: "count", y: "status",
          text: (d) => d.count,
          dx: 8,
          fill: isDark ? "#e2e8f0" : "#1a2a6c",
          fontSize: "11px", fontWeight: "600",
        }),
        Plot.ruleX([0]),
      ],
      x: { label: "Count", grid: true },
      y: { label: null },
      style: { fontSize: "11px", color: t.textSecondary, background: "transparent" },
    });

    statusChartRef.current.appendChild(plot);
    return () => plot.remove();
  }, [isDark, customers]);

  return (
    <div style={styles.wrapper}>

      {/* Summary Cards */}
      <div style={styles.summaryGrid}>
        {[
          { label: "Total Customers",    value: totalCustomers,                           accent: t.accentLight  },
          { label: "Active",             value: activeCount,                              accent: t.successLight },
          { label: "Inactive",           value: inactiveCount,                            accent: t.warningLight },
          { label: "Avg Lifetime Value", value: `€${(avgSpend/1000).toFixed(1)}K`,        accent: t.accentLight  },
        ].map((card) => (
          <div key={card.label} style={{ ...styles.summaryCard, background: t.cardBg, border: `1px solid ${t.border}` }}>
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

        {/* New monthly customers*/}
        <div style={{ ...styles.chartCard, background: t.cardBg, border: `1px solid ${t.border}` }}>
          <h3 style={{ ...styles.chartTitle, color: t.textPrimary }}>New Customers per Month</h3>
          <p style={{ ...styles.chartSub, color: t.textSecondary }}>Monthly gain trend</p>
          <ChartToggle
            data={MOCK_MONTHLY}
            xKey="monthNum"
            yKey="count"
            xFormat={(d) => ["","Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][d]}
            xDomain={[0.5, 12.5]}
            yLabel="New Customers"
            height={220}
            tier={tier}
          />
        </div>

        <div style={{ ...styles.chartCard, background: t.cardBg, border: `1px solid ${t.border}` }}>
          <h3 style={{ ...styles.chartTitle, color: t.textPrimary }}>Customer Status</h3>
          <p style={{ ...styles.chartSub, color: t.textSecondary }}>Active vs inactive breakdown</p>
          {loading ? (
            <div style={{ ...styles.loadingText, color: t.textSecondary }}>Loading...</div>
          ) : (
            <div ref={statusChartRef} style={{ width: "100%", marginTop: "12px" }} />
          )}
        </div>
      </div>

      {/* Filters */}
      <div style={{ ...styles.filterBar, background: t.cardBg, border: `1px solid ${t.border}` }}>
        <input
          type="text"
          placeholder="Search by name, email or ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ ...styles.searchInput, background: t.inputBg, border: `1px solid ${t.border}`, color: t.textPrimary }}
        />
        <select value={regionFilter} onChange={(e) => setRegionFilter(e.target.value)}
          style={{ ...styles.select, background: t.inputBg, border: `1px solid ${t.border}`, color: t.textPrimary }}>
          <option value="all">All Regions</option>
          <option value="North America">North America</option>
          <option value="Europe">Europe</option>
          <option value="Asia">Asia</option>
          <option value="South America">South America</option>
        </select>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
          style={{ ...styles.select, background: t.inputBg, border: `1px solid ${t.border}`, color: t.textPrimary }}>
          <option value="all">All Status</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
          style={{ ...styles.select, background: t.inputBg, border: `1px solid ${t.border}`, color: t.textPrimary }}>
          <option value="name">Sort by Name</option>
          <option value="spend">Sort by Spend</option>
          <option value="orders">Sort by Orders</option>
        </select>
      </div>

      {/* Table */}
      <div style={{ ...styles.tableCard, background: t.cardBg, border: `1px solid ${t.border}` }}>
        <div style={styles.tableHeader}>
          <div>
            <h3 style={{ ...styles.chartTitle, color: t.textPrimary }}>Customer Directory</h3>
            <p style={{ ...styles.chartSub, color: t.textSecondary }}>{filtered.length} results</p>
          </div>
          <button style={styles.addBtn}>+ Add Customer</button>
        </div>

        {loading ? (
          <div style={{ ...styles.loadingText, color: t.textSecondary }}>Loading customers...</div>
        ) : error ? (
          <div style={{ ...styles.errorText, color: t.danger }}>Error: {error}</div>
        ) : (
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${t.border}` }}>
                  {["ID","Name","Email","Region","Total Spend","Orders","Avg Order","Last Order","Status",""].map((h) => (
                    <th key={h} style={{ ...styles.th, color: t.textSecondary }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((c) => (
                  <tr key={c.id} style={{ borderBottom: `1px solid ${t.borderLight}` }}>
                    <td style={{ ...styles.td, color: t.textSecondary, fontFamily: "monospace" }}>{c.id}</td>
                    <td style={{ ...styles.td, color: t.textPrimary,   fontWeight: "500" }}>{c.name}</td>
                    <td style={{ ...styles.td, color: t.textSecondary, fontSize: "12px" }}>{c.email}</td>
                    <td style={{ ...styles.td, color: t.textSecondary }}>{c.region}</td>
                    <td style={{ ...styles.td, color: t.textPrimary,   fontWeight: "600" }}>€{c.totalSpend.toLocaleString()}</td>
                    <td style={{ ...styles.td, color: t.textSecondary }}>{c.orders}</td>
                    <td style={{ ...styles.td, color: t.textSecondary }}>
                      {c.orders > 0 ? `€${Math.round(c.totalSpend / c.orders).toLocaleString()}` : "—"}
                    </td>
                    <td style={{ ...styles.td, color: t.textSecondary }}>{c.lastOrder}</td>
                    <td style={{ ...styles.td }}>
                      <span style={{
                        ...styles.statusBadge,
                        background: c.status === "Active" ? t.success : t.warning,
                        color: "#fff",
                      }}>
                        {c.status}
                      </span>
                    </td>
                    <td style={{ ...styles.td }}>
                      <button
                        onClick={() => navigate(`/customers/${c.id}`)}
                        style={{ ...styles.actionBtn, color: t.accent }}
                      >
                        View
                      </button>
                    </td>
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
  textPrimary:   "#1a2a6c", textSecondary: "#555",
  cardBg:        "#ffffff", border: "#e0e4ef", borderLight: "#f0f2f7",
  inputBg:       "#ffffff", accent: "#1a2a6c",
  success:       "#16a34a", successLight: "#dcfce7",
  warning:       "#f59e0b", warningLight: "#fef3c7",
  danger:        "#dc2626",
  accentLight:   "#e0e7ff",
};
const dark = {
  textPrimary:   "#e2e8f0", textSecondary: "#94a3b8",
  cardBg:        "#1e293b", border: "#334155", borderLight: "#1e293b",
  inputBg:       "#0f172a", accent: "#7c9fff",
  success:       "#22c55e", successLight: "#064e3b",
  warning:       "#fbbf24", warningLight: "#78350f",
  danger:        "#ef4444",
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
  loadingText: {
    padding:   "40px",
    textAlign: "center",
    fontSize:  "13px",
  },
  errorText: {
    padding:   "20px",
    textAlign: "center",
    fontSize:  "13px",
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

export default Customers;
/*
  Endpoint used:
    GET /api/invoices/summary
    Requires JWT token in Authorization header.

  API response shape:
    {
      orderNumber:   string,  e.g. "SO00000099"
      customerName:  string,  e.g. "Iarlaith Gleeson"
      salesAmount:   number,  e.g. 180.0
      orderDate:     string,  e.g. "2025-02-24"
      dueDate:       string,  e.g. "2025-03-03"
      invoiceStatus: string,  e.g. "Paid" | "Overdue" | "Pending" | "Cancelled"
    }
*/

import { useState, useEffect, useRef } from "react";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import * as Plot from "@observablehq/plot";

function Invoices() {
  const { isDark } = useTheme();
  const { user, token } = useAuth();
  const t = isDark ? dark : light;
  const tier = user?.tier || "GROWTH";

  const statusChartRef      = useRef(null);
  const topInvoicesChartRef = useRef(null);

  const [invoices, setInvoices] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);

  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm,   setSearchTerm]   = useState("");
  const [sortBy,       setSortBy]       = useState("orderDate");

  useEffect(() => {
    if (!token) return;

    fetch("http://localhost:8080/api/invoices/summary", {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type":  "application/json",
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch invoices");
        return res.json();
      })
      .then((data) => {
        const mapped = data.map((i) => ({
          orderNumber:  i.orderNumber,
          customerName: i.customerName,
          amount:       i.salesAmount,
          orderDate:    i.orderDate,
          dueDate:      i.dueDate,
          status:       i.invoiceStatus,
        }));
        setInvoices(mapped);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [token]);

  let filtered = invoices.filter((i) => {
    const matchStatus = statusFilter === "all" || i.status === statusFilter;
    const matchSearch =
      i.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      i.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      i.status?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchStatus && matchSearch;
  });

  if (sortBy === "orderDate")   filtered.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
  if (sortBy === "dueDate")     filtered.sort((a, b) => new Date(a.dueDate)   - new Date(b.dueDate));
  if (sortBy === "amount")      filtered.sort((a, b) => (b.amount || 0)       - (a.amount || 0));
  if (sortBy === "customer")    filtered.sort((a, b) => a.customerName?.localeCompare(b.customerName));
  if (sortBy === "status")      filtered.sort((a, b) => a.status?.localeCompare(b.status));

  const totalInvoices  = invoices.length;
  const paidCount      = invoices.filter((i) => i.status === "Paid").length;
  const overdueCount   = invoices.filter((i) => i.status === "Overdue").length;
  const pendingAmount  = invoices
    .filter((i) => i.status !== "Paid" && i.status !== "Cancelled")
    .reduce((s, i) => s + (i.amount || 0), 0);

  const topInvoices = [...invoices]
    .sort((a, b) => (b.amount || 0) - (a.amount || 0))
    .slice(0, 10);

  useEffect(() => {
    if (!statusChartRef.current || invoices.length === 0) return;
    statusChartRef.current.innerHTML = "";

    const statusColors = {
      Paid:      isDark ? "#22c55e" : "#16a34a",
      Pending:   isDark ? "#fbbf24" : "#f59e0b",
      Overdue:   isDark ? "#ef4444" : "#dc2626",
      Cancelled: isDark ? "#94a3b8" : "#64748b",
    };

    const map = {};
    invoices.forEach((i) => {
      const status = i.status || "Unknown";
      map[status] = (map[status] || 0) + 1;
    });
    const statusData = Object.entries(map).map(([status, count]) => ({ status, count }));

    const plot = Plot.plot({
      width:        statusChartRef.current.offsetWidth || 400,
      height:       Math.max(140, statusData.length * 36 + 40),
      marginLeft:   90,
      marginBottom: 34,
      marginTop:    8,
      marginRight:  40,
      marks: [
        Plot.barX(statusData, {
          x:    "count",
          y:    "status",
          fill: (d) => statusColors[d.status] || (isDark ? "#7c9fff" : "#1a2a6c"),
          rx:   3,
          sort: { y: "-x" },
        }),
        Plot.text(statusData, {
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
      x: { label: "Count", grid: true },
      y: { label: null },
      style: { fontSize: "11px", color: t.textSecondary, background: "transparent" },
    });

    statusChartRef.current.appendChild(plot);
    return () => plot.remove();
  }, [isDark, invoices]);

  useEffect(() => {
    if (!topInvoicesChartRef.current || topInvoices.length === 0) return;
    topInvoicesChartRef.current.innerHTML = "";

    const chartData = topInvoices.map(i => ({
      order:  i.orderNumber,
      amount: i.amount || 0,
    }));

    const plot = Plot.plot({
      width:        topInvoicesChartRef.current.offsetWidth || 400,
      height:       260,
      marginLeft:   120,
      marginBottom: 38,
      marginTop:    8,
      marginRight:  16,
      marks: [
        Plot.barX(chartData, {
          x:    "amount",
          y:    "order",
          fill: isDark ? "#7c9fff" : "#1a2a6c",
          rx:   3,
          sort: { y: "-x" },
        }),
        Plot.text(chartData, {
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
        label:       "Amount (€)",
        grid:        true,
        tickPadding: 6,
        tickFormat:  d => `€${(d/1000).toFixed(0)}K`,
      },
      y: { label: null },
      style: { fontSize: "11px", color: t.textSecondary, background: "transparent" },
    });

    topInvoicesChartRef.current.appendChild(plot);
    return () => plot.remove();
  }, [isDark, invoices]);

  const getStatusStyle = (status) => {
    if (status === "Paid")      return { background: t.success, color: "#fff" };
    if (status === "Overdue")   return { background: t.danger,  color: "#fff" };
    if (status === "Cancelled") return { background: t.muted,   color: "#fff" };
    return { background: t.warning, color: "#fff" };
  };

  if (!user) {
    return (
      <div style={{ ...styles.loadingText, color: t.textSecondary }}>
        Please sign in to view invoices.
      </div>
    );
  }

  return (
    <div style={styles.wrapper}> 

      <div style={styles.summaryGrid}>
        {[
          { label: "Total Invoices", value: loading ? "-" : totalInvoices,                          accent: t.accentLight  },
          { label: "Paid",           value: loading ? "-" : paidCount,                               accent: t.successLight },
          { label: "Overdue",        value: loading ? "-" : overdueCount,                            accent: t.dangerLight  },
          { label: "Pending Amount", value: loading ? "-" : `€${(pendingAmount/1000).toFixed(1)}K`, accent: t.warningLight },
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

      <div style={styles.chartsGrid}>
        <div style={{ ...styles.chartCard, background: t.cardBg, border: `1px solid ${t.border}` }}>
          <h3 style={{ ...styles.chartTitle, color: t.textPrimary }}>Top 10 Invoices by Amount</h3>
          <p style={{ ...styles.chartSub, color: t.textSecondary }}>Highest value invoices</p>
          {topInvoices.length > 0 ? (
            <div ref={topInvoicesChartRef} style={{ width: "100%", marginTop: "12px" }} />
          ) : (
            <div style={{ ...styles.loadingText, color: t.textSecondary }}>
              {loading ? "Loading..." : "No invoice data"}
            </div>
          )}
        </div>

        <div style={{ ...styles.chartCard, background: t.cardBg, border: `1px solid ${t.border}` }}>
          <h3 style={{ ...styles.chartTitle, color: t.textPrimary }}>Invoice Status</h3>
          <p style={{ ...styles.chartSub, color: t.textSecondary }}>Paid, pending, overdue and cancelled</p>
          {loading ? (
            <div style={{ ...styles.loadingText, color: t.textSecondary }}>Loading...</div>
          ) : (
            <div ref={statusChartRef} style={{ width: "100%", marginTop: "12px" }} />
          )}
        </div>
      </div>

      <div style={{ ...styles.filterBar, background: t.cardBg, border: `1px solid ${t.border}` }}>
        <input
          type="text"
          placeholder="Search by order number, customer or status..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ ...styles.searchInput, background: t.inputBg, border: `1px solid ${t.border}`, color: t.textPrimary }}
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{ ...styles.select, background: t.inputBg, border: `1px solid ${t.border}`, color: t.textPrimary }}
        >
          <option value="all">All Status</option>
          <option value="Paid">Paid</option>
          <option value="Pending">Pending</option>
          <option value="Overdue">Overdue</option>
          <option value="Cancelled">Cancelled</option>
        </select>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          style={{ ...styles.select, background: t.inputBg, border: `1px solid ${t.border}`, color: t.textPrimary }}
        >
          <option value="orderDate">Sort by Order Date</option>
          <option value="dueDate">Sort by Due Date</option>
          <option value="amount">Sort by Amount</option>
          <option value="customer">Sort by Customer</option>
          <option value="status">Sort by Status</option>
        </select>
      </div>

      <div style={{ ...styles.tableCard, background: t.cardBg, border: `1px solid ${t.border}` }}>
        <div style={styles.tableHeader}>
          <div>
            <h3 style={{ ...styles.chartTitle, color: t.textPrimary }}>Invoice Directory</h3>
            <p style={{ ...styles.chartSub, color: t.textSecondary }}>{filtered.length} results</p>
          </div>
        </div>

        {loading ? (
          <div style={{ ...styles.loadingText, color: t.textSecondary }}>Loading invoices...</div>
        ) : error ? (
          <div style={{ ...styles.errorText, color: t.danger }}>Error: {error}</div>
        ) : filtered.length === 0 ? (
          <div style={{ ...styles.loadingText, color: t.textSecondary }}>No invoices match your filters.</div>
        ) : (
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${t.border}` }}>
                  {["Order No.", "Customer", "Amount", "Order Date", "Due Date", "Status"].map((h) => (
                    <th key={h} style={{ ...styles.th, color: t.textSecondary }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((i, idx) => (
                  <tr key={idx} style={{ borderBottom: `1px solid ${t.borderLight}` }}>
                    <td style={{ ...styles.td, color: t.textSecondary, fontFamily: "monospace" }}>
                      {i.orderNumber}
                    </td>
                    <td style={{ ...styles.td, color: t.textPrimary, fontWeight: "500" }}>
                      {i.customerName}
                    </td>
                    <td style={{ ...styles.td, color: t.textPrimary, fontWeight: "600" }}>
                      €{i.amount?.toLocaleString()}
                    </td>
                    <td style={{ ...styles.td, color: t.textSecondary }}>{i.orderDate}</td>
                    <td style={{ ...styles.td, color: t.textSecondary }}>{i.dueDate}</td>
                    <td style={{ ...styles.td }}>
                      <span style={{ ...styles.statusBadge, ...getStatusStyle(i.status) }}>
                        {i.status}
                      </span>
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
  muted:         "#64748b",
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
  muted:         "#64748b",
  accentLight:   "#1e3a8a",
};

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
};

export default Invoices;
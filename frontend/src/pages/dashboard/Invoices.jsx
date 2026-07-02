import { useState, useEffect, useRef } from "react";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import * as Plot from "@observablehq/plot";
import ChartToggle from "../../components/ChartToggle";

function Invoices() {
  const { isDark } = useTheme();
  const { user } = useAuth();
  const t = isDark ? dark : light;
  const tier = user?.tier || "Growth";

  const statusChartRef = useRef(null);

  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("issueDate");

  useEffect(() => {
    fetch("http://localhost:8080/api/invoices")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch invoices");
        return res.json();
      })
      .then((data) => {
        const mapped = data.map((i) => ({
          id: i.invoiceId,
          orderNumber: i.invoiceOrdNum || i.invoiceOrderNumber || "N/A",
          status: i.invoiceStatus || "N/A",
          issueDate: i.invoiceIssueDt || i.invoiceIssueDate || "N/A",
          createdDate: i.dwCreateDate || "N/A",
        }));
        setInvoices(mapped);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  let filtered = invoices.filter((i) => {
    const matchStatus = statusFilter === "all" || i.status === statusFilter;
    const matchSearch =
      String(i.id).toLowerCase().includes(searchTerm.toLowerCase()) ||
      i.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      i.status.toLowerCase().includes(searchTerm.toLowerCase());

    return matchStatus && matchSearch;
  });

  if (sortBy === "issueDate") {
    filtered.sort((a, b) => new Date(b.issueDate) - new Date(a.issueDate));
  }

  if (sortBy === "status") {
    filtered.sort((a, b) => a.status.localeCompare(b.status));
  }

  if (sortBy === "invoiceId") {
    filtered.sort((a, b) => String(a.id).localeCompare(String(b.id)));
  }

  const totalInvoices = invoices.length;
  const paidCount = invoices.filter((i) => i.status === "Paid").length;
  const unpaidCount = invoices.filter((i) => i.status === "Unpaid").length;
  const overdueCount = invoices.filter((i) => i.status === "Overdue").length;
  const cancelledCount = invoices.filter((i) => i.status === "Cancelled").length;

  const monthlyInvoices = Array.from({ length: 12 }, (_, index) => ({
    monthNum: index + 1,
    count: invoices.filter((i) => {
      if (!i.issueDate || i.issueDate === "N/A") return false;
      return new Date(i.issueDate).getMonth() === index;
    }).length,
  }));

  useEffect(() => {
    if (!statusChartRef.current) return;
    statusChartRef.current.innerHTML = "";

    const statusData = [
      { status: "Paid", count: paidCount, color: isDark ? "#22c55e" : "#16a34a" },
      { status: "Unpaid", count: unpaidCount, color: isDark ? "#fbbf24" : "#f59e0b" },
      { status: "Overdue", count: overdueCount, color: isDark ? "#ef4444" : "#dc2626" },
      { status: "Cancelled", count: cancelledCount, color: isDark ? "#94a3b8" : "#64748b" },
    ];

    if (statusData.every((d) => d.count === 0)) return;

    const plot = Plot.plot({
      width: statusChartRef.current.offsetWidth || 400,
      height: 140,
      marginLeft: 90,
      marginBottom: 38,
      marginTop: 8,
      marks: [
        Plot.barX(statusData, {
          x: "count",
          y: "status",
          fill: (d) => d.color,
          rx: 3,
        }),
        Plot.text(statusData, {
          x: "count",
          y: "status",
          text: (d) => d.count,
          dx: 8,
          fill: isDark ? "#e2e8f0" : "#1a2a6c",
          fontSize: "11px",
          fontWeight: "600",
        }),
        Plot.ruleX([0]),
      ],
      x: { label: "Count", grid: true },
      y: { label: null },
      style: {
        fontSize: "11px",
        color: t.textSecondary,
        background: "transparent",
      },
    });

    statusChartRef.current.appendChild(plot);
    return () => plot.remove();
  }, [isDark, invoices]);

  return (
    <div style={styles.wrapper}>
      <div style={styles.summaryGrid}>
        {[
          { label: "Total Invoices", value: totalInvoices, accent: t.accentLight },
          { label: "Paid", value: paidCount, accent: t.successLight },
          { label: "Unpaid", value: unpaidCount, accent: t.warningLight },
          { label: "Overdue", value: overdueCount, accent: t.dangerLight },
        ].map((card) => (
          <div
            key={card.label}
            style={{
              ...styles.summaryCard,
              background: t.cardBg,
              border: `1px solid ${t.border}`,
            }}
          >
            <div style={{ ...styles.summaryAccent, background: card.accent }} />
            <div>
              <div style={{ ...styles.summaryLabel, color: t.textSecondary }}>
                {card.label}
              </div>
              <div style={{ ...styles.summaryValue, color: t.textPrimary }}>
                {card.value}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={styles.chartsGrid}>
        <div style={{ ...styles.chartCard, background: t.cardBg, border: `1px solid ${t.border}` }}>
          <h3 style={{ ...styles.chartTitle, color: t.textPrimary }}>Invoices per Month</h3>
          <p style={{ ...styles.chartSub, color: t.textSecondary }}>Monthly invoice trend</p>
          <ChartToggle
            data={monthlyInvoices}
            xKey="monthNum"
            yKey="count"
            xFormat={(d) => ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][d]}
            xDomain={[0.5, 12.5]}
            yLabel="Invoices"
            height={220}
            tier={tier}
          />
        </div>

        <div style={{ ...styles.chartCard, background: t.cardBg, border: `1px solid ${t.border}` }}>
          <h3 style={{ ...styles.chartTitle, color: t.textPrimary }}>Invoice Status</h3>
          <p style={{ ...styles.chartSub, color: t.textSecondary }}>Paid, unpaid, overdue and cancelled</p>
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
          placeholder="Search by invoice ID, order number or status..."
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
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{
            ...styles.select,
            background: t.inputBg,
            border: `1px solid ${t.border}`,
            color: t.textPrimary,
          }}
        >
          <option value="all">All Status</option>
          <option value="Paid">Paid</option>
          <option value="Unpaid">Unpaid</option>
          <option value="Overdue">Overdue</option>
          <option value="Cancelled">Cancelled</option>
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          style={{
            ...styles.select,
            background: t.inputBg,
            border: `1px solid ${t.border}`,
            color: t.textPrimary,
          }}
        >
          <option value="issueDate">Sort by Issue Date</option>
          <option value="invoiceId">Sort by Invoice ID</option>
          <option value="status">Sort by Status</option>
        </select>
      </div>

      <div style={{ ...styles.tableCard, background: t.cardBg, border: `1px solid ${t.border}` }}>
        <div style={styles.tableHeader}>
          <div>
            <h3 style={{ ...styles.chartTitle, color: t.textPrimary }}>Invoice Directory</h3>
            <p style={{ ...styles.chartSub, color: t.textSecondary }}>{filtered.length} results</p>
          </div>
          <button style={styles.addBtn}>+ Add Invoice</button>
        </div>

        {loading ? (
          <div style={{ ...styles.loadingText, color: t.textSecondary }}>Loading invoices...</div>
        ) : error ? (
          <div style={{ ...styles.errorText, color: t.danger }}>Error: {error}</div>
        ) : (
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${t.border}` }}>
                  {["Invoice ID", "Order Number", "Status", "Issue Date", "Created Date", ""].map((h) => (
                    <th key={h} style={{ ...styles.th, color: t.textSecondary }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((i) => (
                  <tr key={i.id} style={{ borderBottom: `1px solid ${t.borderLight}` }}>
                    <td style={{ ...styles.td, color: t.textSecondary, fontFamily: "monospace" }}>
                      {i.id}
                    </td>
                    <td style={{ ...styles.td, color: t.textPrimary, fontWeight: "500" }}>
                      {i.orderNumber}
                    </td>
                    <td style={{ ...styles.td }}>
                      <span
                        style={{
                          ...styles.statusBadge,
                          background:
                            i.status === "Paid"
                              ? t.success
                              : i.status === "Overdue"
                              ? t.danger
                              : i.status === "Cancelled"
                              ? t.muted
                              : t.warning,
                          color: "#fff",
                        }}
                      >
                        {i.status}
                      </span>
                    </td>
                    <td style={{ ...styles.td, color: t.textSecondary }}>{i.issueDate}</td>
                    <td style={{ ...styles.td, color: t.textSecondary }}>{i.createdDate}</td>
                    <td style={{ ...styles.td }}>
                      <button style={{ ...styles.actionBtn, color: t.accent }}>
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

const light = {
  textPrimary: "#1a2a6c",
  textSecondary: "#555",
  cardBg: "#ffffff",
  border: "#e0e4ef",
  borderLight: "#f0f2f7",
  inputBg: "#ffffff",
  accent: "#1a2a6c",
  success: "#16a34a",
  successLight: "#dcfce7",
  warning: "#f59e0b",
  warningLight: "#fef3c7",
  danger: "#dc2626",
  dangerLight: "#fee2e2",
  muted: "#64748b",
  accentLight: "#e0e7ff",
};

const dark = {
  textPrimary: "#e2e8f0",
  textSecondary: "#94a3b8",
  cardBg: "#1e293b",
  border: "#334155",
  borderLight: "#1e293b",
  inputBg: "#0f172a",
  accent: "#7c9fff",
  success: "#22c55e",
  successLight: "#064e3b",
  warning: "#fbbf24",
  warningLight: "#78350f",
  danger: "#ef4444",
  dangerLight: "#7f1d1d",
  muted: "#64748b",
  accentLight: "#1e3a8a",
};

const styles = {
  wrapper: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  summaryGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "16px",
  },
  summaryCard: {
    padding: "18px 20px",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    gap: "14px",
  },
  summaryAccent: {
    width: "4px",
    height: "40px",
    borderRadius: "4px",
    flexShrink: 0,
  },
  summaryLabel: {
    fontSize: "12px",
    marginBottom: "4px",
  },
  summaryValue: {
    fontSize: "24px",
    fontWeight: "700",
  },
  chartsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "16px",
  },
  chartCard: {
    padding: "20px",
    borderRadius: "10px",
  },
  chartTitle: {
    margin: "0 0 2px 0",
    fontSize: "14px",
    fontWeight: "600",
  },
  chartSub: {
    margin: 0,
    fontSize: "12px",
  },
  loadingText: {
    padding: "40px",
    textAlign: "center",
    fontSize: "13px",
  },
  errorText: {
    padding: "20px",
    textAlign: "center",
    fontSize: "13px",
  },
  filterBar: {
    padding: "16px 20px",
    borderRadius: "10px",
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
    alignItems: "center",
  },
  searchInput: {
    flex: 1,
    minWidth: "220px",
    padding: "8px 14px",
    borderRadius: "6px",
    fontSize: "13px",
    outline: "none",
  },
  select: {
    padding: "8px 12px",
    borderRadius: "6px",
    fontSize: "13px",
    cursor: "pointer",
    outline: "none",
  },
  tableCard: {
    padding: "20px",
    borderRadius: "10px",
  },
  tableHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "16px",
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
    padding: "10px 14px",
    textAlign: "left",
    fontSize: "11px",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: "0.4px",
  },
  td: {
    padding: "11px 14px",
    fontSize: "13px",
  },
  statusBadge: {
    padding: "3px 9px",
    borderRadius: "20px",
    fontSize: "11px",
    fontWeight: "600",
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

export default Invoices;
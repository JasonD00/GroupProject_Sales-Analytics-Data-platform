/*
  Endpoints used:
    GET /api/clients/summary  → top customers by spend
    GET /api/products/summary → top products by revenue
    GET /api/invoices/summary → invoice overview + recent invoices

  All endpoints require JWT token in Authorization header.
*/

import { useState, useEffect, useRef } from "react";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import * as Plot from "@observablehq/plot";

function Summaries() {
  const { isDark }      = useTheme();
  const { user, token } = useAuth();
  const t  = isDark ? dark : light;

  const invoiceChartRef = useRef(null);

  // API state
  const [customerSummary, setCustomerSummary] = useState([]);
  const [productSummary,  setProductSummary]  = useState([]);
  const [invoiceSummary,  setInvoiceSummary]  = useState([]);
  const [loading,         setLoading]         = useState(true);
  const [error,           setError]           = useState(null);

  const authHeader = {
    "Authorization": `Bearer ${token}`,
    "Content-Type":  "application/json",
  };

  useEffect(() => {
    if (!token) return;

    Promise.all([
      fetch("http://localhost:8080/api/clients/summary",  { headers: authHeader }),
      fetch("http://localhost:8080/api/products/summary", { headers: authHeader }),
      fetch("http://localhost:8080/api/invoices/summary", { headers: authHeader }),
    ])
      .then(async ([clientsRes, productsRes, invoicesRes]) => {
        if (!clientsRes.ok || !productsRes.ok || !invoicesRes.ok) {
          throw new Error("Failed to fetch summary data");
        }
        setCustomerSummary(await clientsRes.json());
        setProductSummary(await productsRes.json());
        setInvoiceSummary(await invoicesRes.json());
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [token]);

  // Customer calculations
  const totalCustomerRevenue = customerSummary.reduce((s, c) => s + (c.totalSpend || 0), 0);
  const avgCustomerSpend     = customerSummary.length > 0
    ? totalCustomerRevenue / customerSummary.length
    : 0;
  const topCustomers = [...customerSummary]
    .sort((a, b) => (b.totalSpend || 0) - (a.totalSpend || 0))
    .slice(0, 10);

  // Product calculations 
  const totalProductRevenue = productSummary.reduce((s, p) => s + (p.totalRevenue || 0), 0);
  const totalUnitsSold      = productSummary.reduce((s, p) => s + (p.soldAmount   || 0), 0);
  const topProducts = [...productSummary]
    .sort((a, b) => (b.totalRevenue || 0) - (a.totalRevenue || 0))
    .slice(0, 10);

  // Invoice calculations 
  const totalInvoices  = invoiceSummary.length;
  const paidCount      = invoiceSummary.filter(i => i.invoiceStatus === "Paid").length;
  const overdueCount   = invoiceSummary.filter(i => i.invoiceStatus === "Overdue").length;
  const pendingAmount  = invoiceSummary
    .filter(i => i.invoiceStatus !== "Paid" && i.invoiceStatus !== "Cancelled")
    .reduce((s, i) => s + (i.salesAmount || 0), 0);

  const recentInvoices = [...invoiceSummary]
    .sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate))
    .slice(0, 10);

  // Overdue invoices - sorted by amount, highest first
  const overdueInvoices = invoiceSummary
    .filter(i => i.invoiceStatus === "Overdue")
    .sort((a, b) => (b.salesAmount || 0) - (a.salesAmount || 0))
    .slice(0, 4);

  // Invoice status breakdown 
  const invoiceStatusData = (() => {
    const map = {};
    invoiceSummary.forEach((inv) => {
      const status = inv.invoiceStatus || "Unknown";
      map[status] = (map[status] || 0) + 1;
    });
    return Object.entries(map).map(([status, count]) => ({ status, count }));
  })();

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
      width:        invoiceChartRef.current.offsetWidth || 400,
      height:       180,
      marginLeft:   90,
      marginBottom: 34,
      marginTop:    8,
      marginRight:  40,
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
      x: { label: "Invoices", grid: true, tickPadding: 6 },
      y: { label: null },
      style: { fontSize: "11px", color: t.textSecondary, background: "transparent" },
    });

    invoiceChartRef.current.appendChild(plot);
    return () => plot.remove();
  }, [isDark, invoiceSummary]);

  const getInvoiceStatusStyle = (status) => {
    if (status === "Paid")      return { background: t.successLight, color: t.success };
    if (status === "Pending")   return { background: t.warningLight, color: t.warning };
    if (status === "Overdue")   return { background: t.dangerLight,  color: t.danger  };
    return { background: t.borderLight, color: t.textSecondary };
  };

  if (!user) {
    return (
      <div style={{ ...styles.stateBox, color: t.textSecondary }}>
        Please sign in to view summaries.
      </div>
    );
  }

  return (
    <div style={styles.wrapper}>

      {/* Customer Section */}
      <div>
        <h2 style={{ ...styles.sectionTitle, color: t.textPrimary }}>Top Customers</h2>

        <div style={styles.summaryGrid}>
          {[
            { label: "Total Customers", value: loading ? "-" : customerSummary.length,                    accent: t.accentLight  },
            { label: "Total Revenue",   value: loading ? "-" : `€${(totalCustomerRevenue/1000).toFixed(1)}K`, accent: t.successLight },
            { label: "Avg Spend",       value: loading ? "-" : `€${avgCustomerSpend.toFixed(0)}`,          accent: t.warningLight },
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

        <div style={{ ...styles.tableCard, background: t.cardBg, border: `1px solid ${t.border}` }}>
          <p style={{ ...styles.tableSub, color: t.textSecondary }}>Top 10 customers by total spend</p>
          {loading ? (
            <div style={{ ...styles.stateBox, color: t.textSecondary }}>Loading...</div>
          ) : (
            <div style={styles.tableWrapper}>
              <table style={styles.table}>
                <thead>
                  <tr style={{ borderBottom: `1px solid ${t.border}` }}>
                    {["Name","Country","Segment","Total Spend","Orders","Last Order"].map(h => (
                      <th key={h} style={{ ...styles.th, color: t.textSecondary }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {topCustomers.map((c, i) => (
                    <tr key={i} style={{ borderBottom: `1px solid ${t.borderLight}` }}>
                      <td style={{ ...styles.td, color: t.textPrimary, fontWeight: "500" }}>
                        {c.firstName} {c.lastName}
                      </td>
                      <td style={{ ...styles.td, color: t.textSecondary }}>{c.country}</td>
                      <td style={{ ...styles.td, color: t.textSecondary }}>{c.clientSegment}</td>
                      <td style={{ ...styles.td, color: t.textPrimary, fontWeight: "600" }}>
                        €{c.totalSpend?.toLocaleString()}
                      </td>
                      <td style={{ ...styles.td, color: t.textSecondary }}>{c.orderCount}</td>
                      <td style={{ ...styles.td, color: t.textSecondary }}>{c.lastOrderDate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Products Section */}
      <div>
        <h2 style={{ ...styles.sectionTitle, color: t.textPrimary }}>Top Products</h2>

        <div style={styles.summaryGrid}>
          {[
            { label: "Total Products", value: loading ? "-" : productSummary.length,                       accent: t.accentLight  },
            { label: "Total Revenue",  value: loading ? "-" : `€${(totalProductRevenue/1000).toFixed(1)}K`, accent: t.successLight },
            { label: "Units Sold",     value: loading ? "-" : totalUnitsSold.toLocaleString(),              accent: t.warningLight },
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

        <div style={{ ...styles.tableCard, background: t.cardBg, border: `1px solid ${t.border}` }}>
          <p style={{ ...styles.tableSub, color: t.textSecondary }}>Top 10 products by total revenue</p>
          {loading ? (
            <div style={{ ...styles.stateBox, color: t.textSecondary }}>Loading...</div>
          ) : (
            <div style={styles.tableWrapper}>
              <table style={styles.table}>
                <thead>
                  <tr style={{ borderBottom: `1px solid ${t.border}` }}>
                    {["Product","Category","Type","Units Sold","Revenue"].map(h => (
                      <th key={h} style={{ ...styles.th, color: t.textSecondary }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {topProducts.map((p, i) => (
                    <tr key={i} style={{ borderBottom: `1px solid ${t.borderLight}` }}>
                      <td style={{ ...styles.td, color: t.textPrimary, fontWeight: "500" }}>{p.productName}</td>
                      <td style={{ ...styles.td, color: t.textSecondary }}>{p.category}</td>
                      <td style={{ ...styles.td, color: t.textSecondary }}>{p.productType}</td>
                      <td style={{ ...styles.td, color: t.textSecondary }}>{p.soldAmount}</td>
                      <td style={{ ...styles.td, color: t.textPrimary, fontWeight: "600" }}>
                        €{p.totalRevenue?.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Invoices Section */}
      <div>
        <h2 style={{ ...styles.sectionTitle, color: t.textPrimary }}>Invoice Overview</h2>

        <div style={styles.summaryGrid4}>
          {[
            { label: "Total Invoices",  value: loading ? "-" : totalInvoices,                          accent: t.accentLight  },
            { label: "Paid",            value: loading ? "-" : paidCount,                               accent: t.successLight },
            { label: "Overdue",         value: loading ? "-" : overdueCount,                            accent: t.dangerLight  },
            { label: "Pending Amount",  value: loading ? "-" : `€${(pendingAmount/1000).toFixed(1)}K`, accent: t.warningLight },
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

        {/* Invoice status chart + recent invoices */}
        <div style={styles.invoiceGrid}>
          <div style={{ ...styles.chartCard, background: t.cardBg, border: `1px solid ${t.border}` }}>
            <h3 style={{ ...styles.chartTitle, color: t.textPrimary }}>Invoice Status Breakdown</h3>
            {invoiceStatusData.length > 0 ? (
              <div ref={invoiceChartRef} style={{ width: "100%", marginTop: "12px" }} />
            ) : (
              <div style={{ ...styles.stateBox, color: t.textSecondary }}>
                {loading ? "Loading..." : "No invoice data"}
              </div>
            )}

            {/* Overdue invoices list */}
            {overdueInvoices.length > 0 && (
              <div style={styles.overdueSection}>
                <div style={{ ...styles.overdueHeader, color: t.textSecondary, borderTop: `1px solid ${t.border}` }}>
                  Highest Value Overdue
                </div>
                {overdueInvoices.map((inv, i) => (
                  <div key={i} style={{ ...styles.overdueRow, borderBottom: `1px solid ${t.borderLight}` }}>
                    <div>
                      <div style={{ ...styles.overdueCustomer, color: t.textPrimary }}>{inv.customerName}</div>
                      <div style={{ ...styles.overdueOrder, color: t.textSecondary }}>{inv.orderNumber} · Due {inv.dueDate}</div>
                    </div>
                    <div style={{ ...styles.overdueAmount, color: t.danger }}>
                      €{inv.salesAmount?.toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{ ...styles.tableCard, background: t.cardBg, border: `1px solid ${t.border}` }}>
            <h3 style={{ ...styles.chartTitle, color: t.textPrimary }}>Recent Invoices</h3>
            {loading ? (
              <div style={{ ...styles.stateBox, color: t.textSecondary }}>Loading...</div>
            ) : (
              <div style={styles.tableWrapper}>
                <table style={styles.table}>
                  <thead>
                    <tr style={{ borderBottom: `1px solid ${t.border}` }}>
                      {["Order No.","Customer","Amount","Due Date","Status"].map(h => (
                        <th key={h} style={{ ...styles.th, color: t.textSecondary }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {recentInvoices.map((inv, i) => (
                      <tr key={i} style={{ borderBottom: `1px solid ${t.borderLight}` }}>
                        <td style={{ ...styles.td, color: t.textSecondary, fontFamily: "monospace" }}>
                          {inv.orderNumber}
                        </td>
                        <td style={{ ...styles.td, color: t.textPrimary, fontWeight: "500" }}>
                          {inv.customerName}
                        </td>
                        <td style={{ ...styles.td, color: t.textPrimary, fontWeight: "600" }}>
                          €{inv.salesAmount?.toLocaleString()}
                        </td>
                        <td style={{ ...styles.td, color: t.textSecondary }}>{inv.dueDate}</td>
                        <td style={{ ...styles.td }}>
                          <span style={{ ...styles.statusBadge, ...getInvoiceStatusStyle(inv.invoiceStatus) }}>
                            {inv.invoiceStatus}
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
      </div>

      {error && (
        <div style={{ ...styles.stateBox, color: t.danger }}>Error: {error}</div>
      )}

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
    gap:           "32px",
  },
  sectionTitle: {
    fontSize:     "16px",
    fontWeight:   "700",
    marginBottom: "12px",
  },
  summaryGrid: {
    display:             "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap:                 "16px",
    marginBottom:        "16px",
  },
  summaryGrid4: {
    display:             "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap:                 "16px",
    marginBottom:        "16px",
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
    fontSize:   "22px",
    fontWeight: "700",
  },
  invoiceGrid: {
    display:             "grid",
    gridTemplateColumns: "1fr 1.2fr",
    gap:                 "16px",
    alignItems:          "stretch",
  },
  chartCard: {
    padding:       "20px",
    borderRadius:  "10px",
    display:       "flex",
    flexDirection: "column",
  },
  chartTitle: {
    margin:       "0 0 4px 0",
    fontSize:     "14px",
    fontWeight:   "600",
  },
  tableCard: {
    padding:      "20px",
    borderRadius: "10px",
  },
  tableSub: {
    margin:       "0 0 12px 0",
    fontSize:     "12px",
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
  statusBadge: {
    padding:      "3px 9px",
    borderRadius: "20px",
    fontSize:     "11px",
    fontWeight:   "600",
  },
  overdueSection: {
    marginTop: "auto",
  },
  overdueHeader: {
    fontSize:      "11px",
    fontWeight:    "600",
    textTransform: "uppercase",
    letterSpacing: "0.4px",
    paddingTop:    "16px",
    paddingBottom: "10px",
  },
  overdueRow: {
    display:        "flex",
    justifyContent: "space-between",
    alignItems:     "center",
    padding:        "10px 0",
  },
  overdueCustomer: {
    fontSize:   "13px",
    fontWeight: "500",
  },
  overdueOrder: {
    fontSize:  "11px",
    marginTop: "2px",
  },
  overdueAmount: {
    fontSize:   "13px",
    fontWeight: "700",
  },
};

export default Summaries;
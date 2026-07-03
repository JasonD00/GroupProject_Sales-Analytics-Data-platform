/*
  Overview:
  Shows a daily volume chart, transaction type breakdown and a table with amount range filters and success rate tracking
*/

import { useRef, useEffect, useState } from "react";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import * as Plot from "@observablehq/plot";
import ChartToggle from "../../components/ChartToggle";

function Transactions() {
  const { isDark } = useTheme();
  const { user }   = useAuth();
  const t    = isDark ? dark : light;
  const tier = user?.tier || "Growth";

  const typeChartRef = useRef(null);

  const [typeFilter,   setTypeFilter]   = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm,   setSearchTerm]   = useState("");
  const [minAmount,    setMinAmount]    = useState("");
  const [maxAmount,    setMaxAmount]    = useState("");

  const filteredTransactions = MOCK_TRANSACTIONS.filter((tx) => {
    const matchesType   = typeFilter   === "all" || tx.type   === typeFilter;
    const matchesStatus = statusFilter === "all" || tx.status === statusFilter;
    const matchesSearch = tx.transactionId.toString().includes(searchTerm) ||
                          tx.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMin    = !minAmount || tx.amount >= parseFloat(minAmount);
    const matchesMax    = !maxAmount || tx.amount <= parseFloat(maxAmount);
    return matchesType && matchesStatus && matchesSearch && matchesMin && matchesMax;
  });

  // Distribution of transactions type
  useEffect(() => {
    if (!typeChartRef.current) return;
    typeChartRef.current.innerHTML = "";

    const typeData = [
      { type: "Sale",   count: MOCK_TRANSACTIONS.filter(t => t.type === "Sale").length,   color: isDark ? "#22c55e" : "#16a34a" },
      { type: "Return", count: MOCK_TRANSACTIONS.filter(t => t.type === "Return").length, color: isDark ? "#fbbf24" : "#f59e0b" },
      { type: "Refund", count: MOCK_TRANSACTIONS.filter(t => t.type === "Refund").length, color: isDark ? "#ef4444" : "#dc2626" },
    ];

    const plot = Plot.plot({
      width:        typeChartRef.current.offsetWidth || 400,
      height:       160,
      marginLeft:   88,
      marginBottom: 38,
      marginTop:    8,
      marks: [
        Plot.barX(typeData, {
          x: "count", y: "type",
          fill: (d) => d.color,
          rx:   3,
        }),
        Plot.text(typeData, {
          x: "count", y: "type",
          text: (d) => d.count,
          dx:   8,
          fill: isDark ? "#e2e8f0" : "#1a2a6c",
          fontSize:   "11px",
          fontWeight: "600",
        }),
        Plot.ruleX([0]),
      ],
      x: { label: "Count", grid: true },
      y: { label: null },
      style: { fontSize: "11px", color: t.textSecondary, background: "transparent" },
    });

    typeChartRef.current.appendChild(plot);
    return () => plot.remove();
  }, [isDark]);

  const totalTransactions   = MOCK_TRANSACTIONS.length;
  const successTransactions = MOCK_TRANSACTIONS.filter(t => t.status === "Success").length;
  const totalAmount         = MOCK_TRANSACTIONS.filter(t => t.status === "Success").reduce((s, t) => s + t.amount, 0);
  const failedCount         = MOCK_TRANSACTIONS.filter(t => t.status === "Failed").length;
  const successRate         = ((successTransactions / totalTransactions) * 100).toFixed(1);

  const getStatusColor = (status) => ({
    Success: t.success,
    Failed:  t.danger,
    Pending: t.warning,
  }[status] || t.textSecondary);

  const getTypeColor = (type) => ({
    Sale:   t.success,
    Return: t.warning,
    Refund: t.danger,
  }[type] || t.textSecondary);

  return (
    <div style={styles.wrapper}>

      {/* Summary Cards */}
      <div style={styles.summaryGrid}>
        {[
          { label: "Total Transactions", value: totalTransactions,                  bg: t.accentLight  },
          { label: "Total Amount",       value: `€${(totalAmount/1000).toFixed(1)}K`, bg: t.successLight },
          { label: "Success Rate",       value: `${successRate}%`,                  bg: t.successLight },
          { label: "Failed",             value: failedCount,                         bg: t.dangerLight  },
        ].map((card) => (
          <div key={card.label} style={{ ...styles.summaryCard, background: t.cardBg, border: `1px solid ${t.border}` }}>
            <div style={{ ...styles.summaryAccent, background: card.bg }} />
            <div>
              <div style={{ ...styles.summaryLabel, color: t.textSecondary }}>{card.label}</div>
              <div style={{ ...styles.summaryValue, color: t.textPrimary }}>{card.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div style={styles.chartsGrid}>

        {/* Switchable volume over time*/}
        <div style={{ ...styles.chartCard, background: t.cardBg, border: `1px solid ${t.border}` }}>
          <h3 style={{ ...styles.chartTitle, color: t.textPrimary }}>Transaction Volume</h3>
          <p style={{ ...styles.chartSub, color: t.textSecondary }}>Daily transaction count</p>
          <ChartToggle
            data={MOCK_TRANSACTION_VOLUME}
            xKey="day"
            yKey="count"
            yLabel="Count"
            height={240}
            tier={tier}
          />
        </div>

        {/* Type breakdown */}
        <div style={{ ...styles.chartCard, background: t.cardBg, border: `1px solid ${t.border}` }}>
          <h3 style={{ ...styles.chartTitle, color: t.textPrimary }}>Transaction Types</h3>
          <p style={{ ...styles.chartSub, color: t.textSecondary }}>Breakdown by transaction type</p>
          <div ref={typeChartRef} style={{ width: "100%", marginTop: "12px" }} />
        </div>
      </div>

      {/* Filters */}
      <div style={{ ...styles.filterBar, background: t.cardBg, border: `1px solid ${t.border}` }}>
        <input
          type="text"
          placeholder="Search transactions..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ ...styles.searchInput, background: t.inputBg, border: `1px solid ${t.border}`, color: t.textPrimary }}
        />
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          style={{ ...styles.select, background: t.inputBg, border: `1px solid ${t.border}`, color: t.textPrimary }}
        >
          <option value="all">All Types</option>
          <option value="Sale">Sale</option>
          <option value="Return">Return</option>
          <option value="Refund">Refund</option>
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{ ...styles.select, background: t.inputBg, border: `1px solid ${t.border}`, color: t.textPrimary }}
        >
          <option value="all">All Status</option>
          <option value="Success">Success</option>
          <option value="Failed">Failed</option>
          <option value="Pending">Pending</option>
        </select>
        <input
          type="number"
          placeholder="Min €"
          value={minAmount}
          onChange={(e) => setMinAmount(e.target.value)}
          style={{ ...styles.amountInput, background: t.inputBg, border: `1px solid ${t.border}`, color: t.textPrimary }}
        />
        <input
          type="number"
          placeholder="Max €"
          value={maxAmount}
          onChange={(e) => setMaxAmount(e.target.value)}
          style={{ ...styles.amountInput, background: t.inputBg, border: `1px solid ${t.border}`, color: t.textPrimary }}
        />
      </div>

      {/* Transactions Table */}
      <div style={{ ...styles.tableCard, background: t.cardBg, border: `1px solid ${t.border}` }}>
        <div style={styles.tableHeader}>
          <div>
            <h3 style={{ ...styles.chartTitle, color: t.textPrimary }}>Transaction Details</h3>
            <p style={{ ...styles.chartSub, color: t.textSecondary }}>{filteredTransactions.length} results</p>
          </div>
          <button style={styles.addBtn}>+ New Transaction</button>
        </div>
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${t.border}` }}>
                {["ID", "Date", "Amount", "Type", "Description", "Customer", "Status", ""].map((h) => (
                  <th key={h} style={{ ...styles.th, color: t.textSecondary }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((tx) => (
                <tr key={tx.transactionId} style={{ borderBottom: `1px solid ${t.borderLight}` }}>
                  <td style={{ ...styles.td, color: t.textSecondary, fontFamily: "monospace" }}>{tx.transactionId}</td>
                  <td style={{ ...styles.td, color: t.textSecondary }}>{new Date(tx.transactionDate).toLocaleDateString()}</td>
                  <td style={{ ...styles.td, color: t.textPrimary, fontWeight: "600" }}>€{tx.amount.toLocaleString()}</td>
                  <td style={{ ...styles.td }}>
                    <span style={{ ...styles.typeBadge, background: getTypeColor(tx.type) + "22", color: getTypeColor(tx.type) }}>
                      {tx.type}
                    </span>
                  </td>
                  <td style={{ ...styles.td, color: t.textSecondary }}>{tx.description}</td>
                  <td style={{ ...styles.td, color: t.textSecondary }}>{tx.customerId}</td>
                  <td style={{ ...styles.td }}>
                    <span style={{ ...styles.statusBadge, background: getStatusColor(tx.status), color: "#fff" }}>
                      {tx.status}
                    </span>
                  </td>
                  <td style={{ ...styles.td }}>
                    <button style={{ ...styles.actionBtn, color: t.accent }}>View</button>
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
// TODO: Remove once backend is connected — replace with API fetch 
const MOCK_TRANSACTIONS = [
  { transactionId: 1001, transactionDate: "2024-01-20", amount: 2500, type: "Sale",   status: "Success", description: "Customer purchase", customerId: 456 },
  { transactionId: 1002, transactionDate: "2024-01-21", amount: 1200, type: "Sale",   status: "Success", description: "Order #ORD-5001",   customerId: 789 },
  { transactionId: 1003, transactionDate: "2024-01-21", amount: 500,  type: "Return", status: "Success", description: "Product return",     customerId: 123 },
  { transactionId: 1004, transactionDate: "2024-01-22", amount: 3400, type: "Sale",   status: "Success", description: "Bulk order",         customerId: 321 },
  { transactionId: 1005, transactionDate: "2024-01-22", amount: 750,  type: "Refund", status: "Success", description: "Full refund",        customerId: 654 },
  { transactionId: 1006, transactionDate: "2024-01-23", amount: 1800, type: "Sale",   status: "Failed",  description: "Payment declined",   customerId: 987 },
  { transactionId: 1007, transactionDate: "2024-01-23", amount: 2100, type: "Sale",   status: "Success", description: "Online purchase",    customerId: 111 },
  { transactionId: 1008, transactionDate: "2024-01-24", amount: 3600, type: "Sale",   status: "Pending", description: "Processing",         customerId: 222 },
  { transactionId: 1009, transactionDate: "2024-01-24", amount: 900,  type: "Return", status: "Success", description: "Exchange",           customerId: 333 },
  { transactionId: 1010, transactionDate: "2024-01-25", amount: 2900, type: "Sale",   status: "Success", description: "Corporate order",    customerId: 444 },
  { transactionId: 1011, transactionDate: "2024-01-25", amount: 650,  type: "Refund", status: "Success", description: "Partial refund",     customerId: 555 },
  { transactionId: 1012, transactionDate: "2024-01-26", amount: 4100, type: "Sale",   status: "Success", description: "Large purchase",     customerId: 666 },
];

const MOCK_TRANSACTION_VOLUME = [
  { day: 1, count: 12 }, { day: 2, count: 15 }, { day: 3, count: 18 },
  { day: 4, count: 14 }, { day: 5, count: 22 }, { day: 6, count: 19 },
  { day: 7, count: 25 }, { day: 8, count: 21 }, { day: 9, count: 28 },
  { day: 10, count: 24 }, { day: 11, count: 26 }, { day: 12, count: 29 },
  { day: 13, count: 23 }, { day: 14, count: 27 }, { day: 15, count: 32 },
];

// THEME
const light = {
  textPrimary:   "#1a2a6c", textSecondary: "#555",
  cardBg:        "#ffffff", border: "#e0e4ef", borderLight: "#f0f2f7",
  inputBg:       "#ffffff", accent: "#1a2a6c",
  success:       "#16a34a", successLight: "#dcfce7",
  warning:       "#f59e0b", warningLight: "#fef3c7",
  danger:        "#dc2626", dangerLight: "#fee2e2",
  accentLight:   "#e0e7ff",
};

const dark = {
  textPrimary:   "#e2e8f0", textSecondary: "#94a3b8",
  cardBg:        "#1e293b", border: "#334155", borderLight: "#1e293b",
  inputBg:       "#0f172a", accent: "#7c9fff",
  success:       "#22c55e", successLight: "#064e3b",
  warning:       "#fbbf24", warningLight: "#78350f",
  danger:        "#ef4444", dangerLight: "#7f1d1d",
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
    minWidth:     "200px",
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
  amountInput: {
    width:        "80px",
    padding:      "8px 12px",
    borderRadius: "6px",
    fontSize:     "13px",
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
  typeBadge: {
    padding:      "3px 9px",
    borderRadius: "20px",
    fontSize:     "11px",
    fontWeight:   "600",
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

export default Transactions;
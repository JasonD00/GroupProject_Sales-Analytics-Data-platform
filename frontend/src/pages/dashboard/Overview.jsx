/*
  Overview:
  Main dashboard page
  Shows KPIs cards
  4 mini charts that shows revenue, customers, invoices and transactions and a recent transactions table underneath
*/

import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import ChartToggle from "../../components/ChartToggle";

function Overview() {
  const { user, openLoginModel, hasFeature } = useAuth();
  const { isDark } = useTheme();
  const t    = isDark ? dark : light;
  const tier = user?.tier || "Growth";

  const visibleTransactions = hasFeature("Pro")
    ? MOCK_RECENT_TRANSACTIONS
    : MOCK_RECENT_TRANSACTIONS.slice(0, 3);

  const getStatusBg   = (s) => ({ Success: t.success, Failed: t.danger, Pending: t.warning }[s] || t.textSecondary);
  const getTypeBg     = (tp) => tp === "Sale" ? t.accentLight : t.warningLight;
  const getTypeColor  = (tp) => tp === "Sale" ? t.accent      : t.warning;

  return (
    <div style={styles.wrapper}>

      {/* Not logged in banner */}
      {!user && (
        <div style={{ ...styles.banner, background: t.cardBg, border: `1px solid ${t.border}` }}>
          <div>
            <div style={{ ...styles.bannerTitle, color: t.textPrimary }}>Welcome to Sales Analytics</div>
            <div style={{ ...styles.bannerSub,   color: t.textSecondary }}>
              Sign in to unlock full dashboard access based on your subscription plan.
            </div>
          </div>
          <button style={styles.bannerBtn} onClick={openLoginModel}>Sign In</button>
        </div>
      )}

      {/* Indicator showing tiers */}
      {user && (
        <div style={{ ...styles.tierRow, background: t.cardBg, border: `1px solid ${t.border}` }}>
          <span style={{ ...styles.tierLabel, color: t.textSecondary }}>Active plan</span>
          <span style={{ ...styles.tierPill, background: TIER_STYLES[user.tier]?.bg, color: TIER_STYLES[user.tier]?.text }}>
            {user.tier}
          </span>
          <span style={{ ...styles.tierHint, color: t.textSecondary }}>
            {user.tier === "Growth"     && "Upgrade to Pro to unlock customer, invoice and additional charts"}
            {user.tier === "Pro"        && "Upgrade to Enterprise to unlock transaction analytics"}
            {user.tier === "Enterprise" && "Full access enabled"}
          </span>
        </div>
      )}

      {/* KPI Cards */}
      <div style={styles.kpiGrid}>
        {KPI_DATA.map((kpi) => (
          <div key={kpi.label} style={{ ...styles.kpiCard, background: t.cardBg, border: `1px solid ${t.border}` }}>
            <div style={styles.kpiTop}>
              <span style={{ ...styles.kpiLabel, color: t.textSecondary }}>{kpi.label}</span>
              <span style={{
                ...styles.kpiChange,
                background: kpi.positive ? t.successLight : t.dangerLight,
                color:      kpi.positive ? t.success      : t.danger,
              }}>
                {kpi.change}
              </span>
            </div>
            <div style={{ ...styles.kpiValue, color: t.textPrimary }}>{kpi.value}</div>
          </div>
        ))}
      </div>

      <div style={styles.chartsGrid}>

        {/* Revenue — all tiers */}
        <div style={{ ...styles.chartCard, background: t.cardBg, border: `1px solid ${t.border}` }}>
          <div style={styles.chartHeader}>
            <div>
              <div style={{ ...styles.chartTitle, color: t.textPrimary }}>Revenue Trend</div>
              <div style={{ ...styles.chartSub,   color: t.textSecondary }}>Monthly revenue this year</div>
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
            height={180}
            tier={tier}
          />
          <div style={{ ...styles.chartFooter, color: t.textSecondary }}>
            YTD — <span style={{ color: t.textPrimary, fontWeight: 600 }}>€414,000</span>
          </div>
        </div>

        {/* New customers — Pro+ tier */}
        <div style={{ ...styles.chartCard, background: t.cardBg, border: `1px solid ${t.border}` }}>
          <div style={styles.chartHeader}>
            <div>
              <div style={{ ...styles.chartTitle, color: t.textPrimary }}>New Customers</div>
              <div style={{ ...styles.chartSub,   color: t.textSecondary }}>Monthly Gain</div>
            </div>
            <span style={{ ...styles.planPill, background: "#dbeafe", color: "#1d4ed8" }}>Pro+</span>
          </div>
          {hasFeature("Pro") ? (
            <>
              <ChartToggle
                data={MOCK_CUSTOMERS_MONTHLY}
                xKey="monthNum"
                yKey="count"
                xFormat={(d) => ["","Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][d]}
                xDomain={[0.5, 12.5]}
                yLabel="Customers"
                height={180}
                tier={tier}
              />
              <div style={{ ...styles.chartFooter, color: t.textSecondary }}>
                Total — <span style={{ color: t.textPrimary, fontWeight: 600 }}>856 customers</span>
              </div>
            </>
          ) : (
            <LockedChart tier="Pro" onUpgrade={openLoginModel} t={t} />
          )}
        </div>

        {/* Invoice revenue — Pro+ tier */}
        <div style={{ ...styles.chartCard, background: t.cardBg, border: `1px solid ${t.border}` }}>
          <div style={styles.chartHeader}>
            <div>
              <div style={{ ...styles.chartTitle, color: t.textPrimary }}>Invoice Revenue</div>
              <div style={{ ...styles.chartSub,   color: t.textSecondary }}>Monthly paid invoices</div>
            </div>
            <span style={{ ...styles.planPill, background: "#dbeafe", color: "#1d4ed8" }}>Pro+</span>
          </div>
          {hasFeature("Pro") ? (
            <>
              <ChartToggle
                data={MOCK_INVOICE_REVENUE}
                xKey="monthNum"
                yKey="amount"
                xFormat={(d) => ["","Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][d]}
                xDomain={[0.5, 12.5]}
                yLabel="Amount (€)"
                height={180}
                tier={tier}
              />
              <div style={{ ...styles.chartFooter, color: t.textSecondary }}>
                Overdue — <span style={{ color: t.danger, fontWeight: 600 }}>2 invoices</span>
              </div>
            </>
          ) : (
            <LockedChart tier="Pro" onUpgrade={openLoginModel} t={t} />
          )}
        </div>

        {/* Transaction volume — Enterprise tier */}
        <div style={{ ...styles.chartCard, background: t.cardBg, border: `1px solid ${t.border}` }}>
          <div style={styles.chartHeader}>
            <div>
              <div style={{ ...styles.chartTitle, color: t.textPrimary }}>Transaction Volume</div>
              <div style={{ ...styles.chartSub,   color: t.textSecondary }}>Daily transaction count</div>
            </div>
            <span style={{ ...styles.planPill, background: "#ede9fe", color: "#7c3aed" }}>Enterprise</span>
          </div>
          {hasFeature("Enterprise") ? (
            <>
              <ChartToggle
                data={MOCK_TRANSACTION_VOLUME}
                xKey="day"
                yKey="count"
                yLabel="Count"
                height={180}
                tier={tier}
              />
              <div style={{ ...styles.chartFooter, color: t.textSecondary }}>
                Success rate — <span style={{ color: t.success, fontWeight: 600 }}>91.7%</span>
              </div>
            </>
          ) : (
            <LockedChart tier="Enterprise" onUpgrade={openLoginModel} t={t} />
          )}
        </div>

      </div>

      {/* Recent transactions */}
      <div style={{ ...styles.tableCard, background: t.cardBg, border: `1px solid ${t.border}` }}>
        <div style={styles.tableHeader}>
          <div>
            <div style={{ ...styles.chartTitle, color: t.textPrimary }}>
              Recent Transactions
              {user && !hasFeature("Pro") && (
                <span style={{ ...styles.limitedTag, color: t.textSecondary }}> — limited preview</span>
              )}
            </div>
            <div style={{ ...styles.chartSub, color: t.textSecondary }}>Latest activity across all accounts</div>
          </div>
          {user && !hasFeature("Pro") && (
            <button style={styles.upgradeBtn} onClick={openLoginModel}>Upgrade to Pro</button>
          )}
        </div>

        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${t.border}` }}>
                {["ID","Date","Customer","Amount","Type","Status"].map((h) => (
                  <th key={h} style={{ ...styles.th, color: t.textSecondary }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {visibleTransactions.map((tx) => (
                <tr key={tx.id} style={{ borderBottom: `1px solid ${t.borderLight}` }}>
                  <td style={{ ...styles.td, color: t.textSecondary, fontFamily: "monospace" }}>#{tx.id}</td>
                  <td style={{ ...styles.td, color: t.textSecondary }}>{new Date(tx.date).toLocaleDateString()}</td>
                  <td style={{ ...styles.td, color: t.textPrimary,   fontWeight: 500 }}>{tx.customer}</td>
                  <td style={{ ...styles.td, color: t.textPrimary,   fontWeight: 600 }}>€{tx.amount.toLocaleString()}</td>
                  <td style={{ ...styles.td }}>
                    <span style={{ ...styles.typeBadge, background: getTypeBg(tx.type), color: getTypeColor(tx.type) }}>
                      {tx.type}
                    </span>
                  </td>
                  <td style={{ ...styles.td }}>
                    <span style={{ ...styles.statusBadge, background: getStatusBg(tx.status), color: "#fff" }}>
                      {tx.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

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

// Chart placeholder
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

// MOCK DATA
// TODO: Remove mock data once API endpoint is connected
const KPI_DATA = [
  { label: "Total Revenue",       value: "€414K", change: "+12.4%",   positive: true  },
  { label: "Active Customers",    value: "742",   change: "+8.2%",    positive: true  },
  { label: "Open Invoices",       value: "13",    change: "2 overdue", positive: false },
  { label: "Transactions (MTD)",  value: "128",   change: "+15.3%",   positive: true  },
];

const MOCK_REVENUE = [
  { monthNum: 1,  revenue: 28500 }, { monthNum: 2,  revenue: 32000 },
  { monthNum: 3,  revenue: 29800 }, { monthNum: 4,  revenue: 35200 },
  { monthNum: 5,  revenue: 31500 }, { monthNum: 6,  revenue: 38000 },
  { monthNum: 7,  revenue: 34200 }, { monthNum: 8,  revenue: 36800 },
  { monthNum: 9,  revenue: 33500 }, { monthNum: 10, revenue: 37200 },
  { monthNum: 11, revenue: 35800 }, { monthNum: 12, revenue: 41500 },
];

const MOCK_CUSTOMERS_MONTHLY = [
  { monthNum: 1, count: 42 }, { monthNum: 2, count: 38 }, { monthNum: 3, count: 55 },
  { monthNum: 4, count: 49 }, { monthNum: 5, count: 61 }, { monthNum: 6, count: 58 },
  { monthNum: 7, count: 72 }, { monthNum: 8, count: 65 }, { monthNum: 9, count: 70 },
  { monthNum: 10, count: 83 }, { monthNum: 11, count: 78 }, { monthNum: 12, count: 90 },
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

const MOCK_RECENT_TRANSACTIONS = [
  { id: 1001, date: "2024-01-26", customer: "Acme Corp",       amount: 4100, type: "Sale",   status: "Success" },
  { id: 1002, date: "2024-01-25", customer: "Beta Ltd",        amount: 2900, type: "Sale",   status: "Success" },
  { id: 1003, date: "2024-01-25", customer: "Gamma Inc",       amount: 650,  type: "Refund", status: "Success" },
  { id: 1004, date: "2024-01-24", customer: "Delta Co",        amount: 3600, type: "Sale",   status: "Pending" },
  { id: 1005, date: "2024-01-24", customer: "Epsilon LLC",     amount: 900,  type: "Return", status: "Success" },
  { id: 1006, date: "2024-01-23", customer: "Zeta Industries", amount: 2100, type: "Sale",   status: "Success" },
  { id: 1007, date: "2024-01-23", customer: "Theta Systems",   amount: 1800, type: "Sale",   status: "Failed"  },
  { id: 1008, date: "2024-01-22", customer: "Lambda Corp",     amount: 3400, type: "Sale",   status: "Success" },
];

const TIER_STYLES = {
  Growth:     { bg: "#dcfce7", text: "#16a34a" },
  Pro:        { bg: "#dbeafe", text: "#1d4ed8" },
  Enterprise: { bg: "#ede9fe", text: "#7c3aed" },
};

// THEME
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
  kpiChange: {
    fontSize:     "10px",
    fontWeight:   "600",
    padding:      "2px 7px",
    borderRadius: "20px",
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
  chartFooter: {
    fontSize:  "11px",
    marginTop: "6px",
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
    minHeight:      "180px",
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
    color:        "#fff",
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
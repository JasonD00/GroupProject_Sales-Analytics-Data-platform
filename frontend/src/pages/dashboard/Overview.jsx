import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import KPICard from "../../components/KPICard";
import SalesChart from "../../components/SalesChart";
import TransactionsTable from "../../components/TransactionsTable";
import PricingSection from "../../components/PricingSection";

import {
  getMonthlyRevenue,
  getTransactions,
  getKPIs,
} from "../../services/salesService";

function Overview() {
  const { user, openLoginModel } = useAuth();
  const { isDark } = useTheme();
  const t = isDark ? dark : light;

  const [kpis, setKpis] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    getKPIs().then(setKpis);
    getMonthlyRevenue().then(setRevenueData);
    getTransactions().then(setTransactions);
  }, []);

  // Limited data for non-authenticated users
  const limitedRevenueData = revenueData.slice(-3);
  const limitedTransactions = transactions.slice(0, 3);

  return (
    <div style={styles.wrapper}>
      <div style={styles.kpiGrid}>
        {kpis.map((kpi) => (
          <KPICard key={kpi.label} {...kpi} />
        ))}
      </div>

      {user ? (
        <SalesChart 
          data={revenueData} 
          type="line" 
          title="Monthly Revenue - Detailed View" 
          isDetailed={true}
        />
      ) : (
        <div style={styles.chartWrapper}>
          <SalesChart 
            data={limitedRevenueData} 
            type="line" 
            title="Monthly Revenue - Preview" 
            isDetailed={false}
          />
          <div style={{ ...styles.overlay, background: t.overlayBg }}>
            <div style={{ ...styles.lockBox, background: t.lockBoxBg }}>
              <div style={styles.lockIcon}>🚫🔫</div>
              <h3 style={{ ...styles.lockTitle, color: t.textPrimary }}>Premium Analytics</h3>
              <p style={{ ...styles.lockText, color: t.textSecondary }}>
                Sign in to view full 12-month data and advanced filters
              </p>
              <button style={styles.unlockBtn} onClick={openLoginModel}>
                View Detailed Analytics
              </button>
            </div>
          </div>
        </div>
      )}

      <h2 style={{ ...styles.sectionTitle, color: t.textPrimary }}>
        Recent Transactions {!user && "(Limited Preview)"}
      </h2>

      <TransactionsTable transactions={user ? transactions : limitedTransactions} />

      {!user && <PricingSection />}
    </div>
  );
}

const light = { 
  textPrimary: "#1a2a6c",
  textSecondary: "#555",
  overlayBg: "rgba(255, 255, 255, 0.92)",
  lockBoxBg: "#ffffff",
};

const dark = { 
  textPrimary: "#e2e8f0",
  textSecondary: "#94a3b8",
  overlayBg: "rgba(15, 23, 42, 0.92)",
  lockBoxBg: "#1e293b",
};

const styles = {
  wrapper: {
    display: "flex",
    flexDirection: "column",
    gap: "24px",
  },
  kpiGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "16px",
  },
  sectionTitle: {
    margin: 0,
    fontSize: "16px",
    fontWeight: "700",
  },
  chartWrapper: {
    position: "relative",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: "10px",
    backdropFilter: "blur(4px)",
  },
  lockBox: {
    padding: "32px",
    borderRadius: "12px",
    textAlign: "center",
    maxWidth: "320px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
  },
  lockIcon: {
    fontSize: "48px",
    marginBottom: "16px",
  },
  lockTitle: {
    margin: "0 0 8px 0",
    fontSize: "20px",
    fontWeight: "700",
  },
  lockText: {
    margin: "0 0 20px 0",
    fontSize: "14px",
    lineHeight: "1.5",
  },
  unlockBtn: {
    padding: "10px 24px",
    borderRadius: "8px",
    border: "none",
    background: "#1a2a6c",
    color: "#fff",
    fontWeight: "600",
    fontSize: "14px",
    cursor: "pointer",
  },
};

export default Overview;
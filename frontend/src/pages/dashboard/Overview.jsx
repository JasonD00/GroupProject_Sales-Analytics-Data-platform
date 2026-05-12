import { useEffect, useState } from "react";
import { useTheme } from "../../context/ThemeContext";
import KPICard from "../../components/KPICard";
import SalesChart from "../../components/SalesChart";
import TransactionsTable from "../../components/TransactionsTable";

import {
  getMonthlyRevenue,
  getTransactions,
  getKPIs,
} from "../../services/salesService";

function Overview() {
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

  return (
    <div style={styles.wrapper}>
      <div style={styles.kpiGrid}>
        {kpis.map((kpi) => (
          <KPICard key={kpi.label} {...kpi} />
        ))}
      </div>

      <SalesChart data={revenueData} type="line" title="Monthly Revenue" />

      <h2 style={{ ...styles.sectionTitle, color: t.textPrimary }}>
        Recent Transactions
      </h2>

      <TransactionsTable transactions={transactions} />
    </div>
  );
}

const light = { textPrimary: "#1a2a6c" };
const dark = { textPrimary: "#e2e8f0" };

const styles = {
  wrapper: {
    display: "flex",
    flexDirection: "column",
    gap: "24px",
  },
  kpiGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
    gap: "16px",
  },
  sectionTitle: {
    margin: 0,
    fontSize: "16px",
    fontWeight: "700",
  },
};

export default Overview;
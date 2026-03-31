import KPICard from "../../components/KPICard";
import SalesChart from "../../components/SalesChart";
import TransactionsTable from "../../components/TransactionsTable";

const kpis = [
  { label: "Total Revenue",    value: "€0",  change: "0%",  up: true },
  { label: "Total Orders",     value: "0",   change: "0%",  up: true },
  { label: "Active Customers", value: "0",   change: "0%",  up: true },
  { label: "Avg Order Value",  value: "€0",  change: "0%",  up: true },
];

function Overview() {
  return (
    <div style={styles.wrapper}>

      <div style={styles.kpiGrid}>
        {kpis.map((kpi) => (
          <KPICard
            key={kpi.label}
            label={kpi.label}
            value={kpi.value}
            change={kpi.change}
            up={kpi.up}
          />
        ))}
      </div>

      <SalesChart data={[]} type="line" title="Monthly Revenue" />

      <h2 style={styles.sectionTitle}>Recent Transactions</h2>
      <TransactionsTable transactions={[]} />

    </div>
  );
}

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
    color: "#1a2a6c",
  },
};

export default Overview;
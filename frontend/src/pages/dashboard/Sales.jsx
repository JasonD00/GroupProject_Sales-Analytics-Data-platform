import { useEffect, useState } from "react";
import { useTheme } from "../../context/ThemeContext";
import SalesChart from "../../components/SalesChart";

import {
  getMonthlyRevenue,
  getSalesByRegion,
  getSalesByRep,
} from "../../services/salesService";

function Sales() {
  const { isDark } = useTheme();
  const t = isDark ? dark : light;

  const [monthly, setMonthly] = useState([]);
  const [region, setRegion] = useState([]);
  const [rep, setRep] = useState([]);

  useEffect(() => {
    getMonthlyRevenue().then(setMonthly);
    getSalesByRegion().then(setRegion);
    getSalesByRep().then(setRep);
  }, []);

  return (
    <div style={styles.wrapper}>
      <div style={styles.header}>
        <h2 style={{ ...styles.title, color: t.textPrimary }}>Sales</h2>
      </div>

      <SalesChart data={monthly} type="bar" title="Monthly Revenue" />

      <div style={styles.row}>
        <SalesChart data={region} type="bar" title="Sales by Region" />
        <SalesChart data={rep} type="bar" title="Sales by Rep" />
      </div>
    </div>
  );
}

const light = { textPrimary: "#1a2a6c" };
const dark = { textPrimary: "#e2e8f0" };

const styles = {
  wrapper: { display: "flex", flexDirection: "column", gap: "24px" },
  header: { display: "flex", justifyContent: "space-between" },
  title: { margin: 0, fontSize: "18px", fontWeight: "700" },
  row: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" },
};

export default Sales;
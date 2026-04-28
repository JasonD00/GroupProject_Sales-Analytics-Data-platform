import { useTheme } from "../../context/ThemeContext";
import TransactionsTable from "../../components/TransactionsTable";

function Transactions() {
  const { isDark } = useTheme();
  const t = isDark ? dark : light;

  return (
    <div style={styles.wrapper}>
      <div style={styles.header}>
        <h2 style={{ ...styles.title, color: t.textPrimary }}>Transactions</h2>
        <button style={{ ...styles.addBtn, background: t.btnBg, color: t.btnText }}>+ New Transaction</button>
      </div>
      <TransactionsTable transactions={[]} />
    </div>
  );
}

const light = { textPrimary: "#1a2a6c", btnBg: "#1a2a6c", btnText: "#fff" };
const dark  = { textPrimary: "#e2e8f0", btnBg: "#7c9fff", btnText: "#0f172a" };

const styles = {
  wrapper: { display: "flex", flexDirection: "column", gap: "20px" },
  header:  { display: "flex", justifyContent: "space-between", alignItems: "center" },
  title:   { margin: 0, fontSize: "18px", fontWeight: "700" },
  addBtn:  { padding: "9px 18px", borderRadius: "6px", border: "none", fontWeight: "600", cursor: "pointer", fontSize: "14px" },
};

export default Transactions;
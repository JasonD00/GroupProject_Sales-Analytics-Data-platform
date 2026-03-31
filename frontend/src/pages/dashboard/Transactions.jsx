import TransactionsTable from "../../components/TransactionsTable";

function Transactions() {
  return (
    <div style={styles.wrapper}>
      <div style={styles.header}>
        <h2 style={styles.title}>Transactions</h2>
        <button style={styles.addBtn}>+ New Transaction</button>
      </div>
      <TransactionsTable transactions={[]} />
    </div>
  );
}

const styles = {
  wrapper: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    margin: 0,
    fontSize: "18px",
    fontWeight: "700",
    color: "#1a2a6c",
  },
  addBtn: {
    padding: "9px 18px",
    borderRadius: "6px",
    border: "none",
    background: "#1a2a6c",
    color: "#fff",
    fontWeight: "600",
    cursor: "pointer",
    fontSize: "14px",
  },
};

export default Transactions;
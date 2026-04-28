import { useState } from "react";
import { useTheme } from "../context/ThemeContext";
import Sidebar from "../components/Sidebar";
import TopBar from "../components/TopBar";
import Overview from "./dashboard/Overview";
import Sales from "./dashboard/Sales";
import Products from "./dashboard/Products";
import Customers from "./dashboard/Customers";
import Transactions from "./dashboard/Transactions";

const pageTitles = {
  overview:     "Overview",
  sales:        "Sales",
  products:     "Products",
  customers:    "Customers",
  transactions: "Transactions",
  reports:      "Reports",
  users:        "User Management",
};

function Dashboard() {
  const { isDark } = useTheme();
  const [activeNav, setActiveNav] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const t = isDark ? dark : light;

  return (
    <div style={{ ...styles.shell, background: t.pageBg }}>
      <Sidebar
        activeNav={activeNav}
        setActiveNav={setActiveNav}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />
      <main style={styles.main}>
        <TopBar pageTitle={pageTitles[activeNav]} />
        <div style={styles.content}>
          {activeNav === "overview"     && <Overview />}
          {activeNav === "sales"        && <Sales />}
          {activeNav === "products"     && <Products />}
          {activeNav === "customers"    && <Customers />}
          {activeNav === "transactions" && <Transactions />}
          {activeNav === "reports"      && <Reports />}
          {activeNav === "users"        && <UserManagement />}
        </div>
      </main>
    </div>
  );
}

const light = { pageBg: "#f0f2f7" };
const dark  = { pageBg: "#0f172a" };

const styles = {
  shell: {
    display: "flex",
    height: "100vh",
    width: "100vw",
    fontFamily: "Arial, sans-serif",
    overflow: "hidden",
  },
  main: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },
  content: {
    flex: 1,
    overflowY: "auto",
    padding: "24px 28px",
  },
};

export default Dashboard;
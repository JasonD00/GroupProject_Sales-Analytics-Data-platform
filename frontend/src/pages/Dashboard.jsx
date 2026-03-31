import { useState } from "react";
import Sidebar from "../components/SideBar";
import TopBar from "../components/TopBar";
import Overview from "./dashboard/Overview";
import Sales from "./dashboard/Sales";
import Products from "./dashboard/Products";
import Customers from "./dashboard/Customers";
import Transactions from "./dashboard/Transactions";

function Dashboard() {
  const [activeNav, setActiveNav] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const pageTitles = {
    overview:     "Overview",
    sales:        "Sales",
    products:     "Products",
    customers:    "Customers",
    transactions: "Transactions",
  };

  return (
    <div style={styles.shell}>

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
        </div>
      </main>

    </div>
  );
}

const styles = {
  shell: {
    display: "flex",
    height: "100vh",
    width: "100vw",
    background: "#f0f2f7",
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
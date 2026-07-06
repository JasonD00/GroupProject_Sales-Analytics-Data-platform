/*
  Main layout, renders the sidebar, topbar and the currently active page
  components based on activeNav state
  Also renders the login model when its
 */

import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import Sidebar from "../components/Sidebar";
import TopBar from "../components/TopBar";
import LoginModel from "../components/LoginModel";
import Overview from "./dashboard/Overview";
import Sales from "./dashboard/Sales";
import Products from "./dashboard/Products";
import Customers from "./dashboard/Customers";
import Territory from "./dashboard/Territory";
import Invoices from "./dashboard/Invoices";
//import Reports from "./dashboard/Reports";
import DataExport from "./dashboard/DataExport";
import Settings from "./dashboard/Settings";

const pageTitles = {
  overview:     "Overview",
  sales:        "Sales",
  products:     "Products",
  customers:    "Customers",
  territory:     "Territory",
  invoices:     "Invoices",
  reports:      "Performance Reports",
  export:       "Data Export",
  settings:     "Settings",
};

function Dashboard() {
  const { showLoginModel } = useAuth();
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
          {activeNav === "territory"    && <Territory />}
          {activeNav === "invoices"     && <Invoices />}
          {activeNav === "reports"      && <Reports />}
          {activeNav === "export"       && <DataExport />}
          {activeNav === "settings"     && <Settings />}
        </div>
      </main>

      {showLoginModel && <LoginModel />}
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
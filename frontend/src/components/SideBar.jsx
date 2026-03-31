import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const ALL_NAV_ITEMS = [
  { id: "overview",     label: "Overview",     roles: ["ADMIN", "SALES_MANAGER", "SALES_REP", "ANALYST"] },
  { id: "sales",        label: "Sales",        roles: ["ADMIN", "SALES_MANAGER", "SALES_REP", "ANALYST"] },
  { id: "products",     label: "Products",     roles: ["ADMIN", "SALES_MANAGER", "SALES_REP", "ANALYST"] },
  { id: "customers",    label: "Customers",    roles: ["ADMIN", "SALES_MANAGER", "SALES_REP", "ANALYST"] },
  { id: "transactions", label: "Transactions", roles: ["ADMIN", "SALES_MANAGER", "SALES_REP", "ANALYST"] },
];

function Sidebar({ activeNav, setActiveNav, sidebarOpen, setSidebarOpen }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const visibleItems = ALL_NAV_ITEMS.filter((item) =>
    item.roles.includes(user?.role)
  );

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <aside style={{ ...styles.sidebar, width: sidebarOpen ? "220px" : "60px" }}>
      <div style={styles.sidebarTop}>
        {sidebarOpen && <span style={styles.logoText}>Sales Analytics</span>}
        <button style={styles.toggleBtn} onClick={() => setSidebarOpen(!sidebarOpen)}>
          {sidebarOpen ? "◀" : "▶"}
        </button>
      </div>

      <nav style={styles.nav}>
        {visibleItems.map((item) => (
          <button
            key={item.id}
            style={{
              ...styles.navItem,
              ...(activeNav === item.id ? styles.navItemActive : {}),
            }}
            onClick={() => setActiveNav(item.id)}
          >
            {sidebarOpen && <span>{item.label}</span>}
            {!sidebarOpen && <span style={styles.navInitial}>{item.label[0]}</span>}
          </button>
        ))}
      </nav>

      <div style={styles.sidebarBottom}>
        <button style={styles.logoutBtn} onClick={handleLogout}>
          {sidebarOpen ? <span>Logout</span> : <span>↩</span>}
        </button>
      </div>
    </aside>
  );
}

const styles = {
  sidebar: {
    background: "#1a2a6c",
    color: "#fff",
    display: "flex",
    flexDirection: "column",
    flexShrink: 0,
    transition: "width 0.25s ease",
    overflow: "hidden",
  },
  sidebarTop: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "20px 14px 16px",
    borderBottom: "1px solid rgba(255,255,255,0.1)",
  },
  logoText: {
    fontSize: "16px",
    fontWeight: "700",
    letterSpacing: "0.5px",
    whiteSpace: "nowrap",
  },
  toggleBtn: {
    background: "transparent",
    border: "none",
    color: "#fff",
    cursor: "pointer",
    fontSize: "14px",
    padding: "4px 6px",
    borderRadius: "4px",
    flexShrink: 0,
  },
  nav: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    padding: "12px 0",
    gap: "2px",
  },
  navItem: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: "10px",
    padding: "10px 14px",
    background: "transparent",
    border: "none",
    color: "rgba(255,255,255,0.75)",
    cursor: "pointer",
    textAlign: "left",
    fontSize: "14px",
    whiteSpace: "nowrap",
    width: "100%",
  },
  navItemActive: {
    background: "rgba(255,255,255,0.15)",
    color: "#fff",
    borderLeft: "3px solid #7c9fff",
  },
  navInitial: {
    width: "100%",
    textAlign: "center",
    fontWeight: "700",
  },
  sidebarBottom: {
    padding: "14px 0",
    borderTop: "1px solid rgba(255,255,255,0.1)",
  },
  logoutBtn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    padding: "10px 14px",
    background: "transparent",
    border: "none",
    color: "rgba(255,255,255,0.65)",
    cursor: "pointer",
    fontSize: "14px",
    width: "100%",
    whiteSpace: "nowrap",
  },
};

export default Sidebar;
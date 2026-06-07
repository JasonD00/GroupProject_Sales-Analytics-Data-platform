import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

const NAV_ITEMS = [
  {
    id: "overview",
    label: "Overview",
    roles: ["ADMIN", "ANALYST", "SALES_MANAGER", "SALES_REP"], 
  },
  {
    id: "sales",
    label: "Sales",
    roles: ["ADMIN", "ANALYST", "SALES_MANAGER"], 
  },
  {
    id: "products",
    label: "Products",
    roles: ["ADMIN", "SALES_MANAGER"], 
  },
  {
    id: "customers",
    label: "Customers",
    roles: ["ADMIN", "SALES_MANAGER", "SALES_REP"], 
  },
  {
    id: "transactions",
    label: "Transactions",
    roles: ["ADMIN", "ANALYST", "SALES_MANAGER"], 
  },
  {
    id: "invoices",
    label: "Invoices",
    roles: ["ADMIN", "SALES_MANAGER"],
  },
];

const FEATURE_ITEMS = [
  {
    id: "reports",
    label: "Reports",
    roles: ["ADMIN", "ANALYST", "SALES_MANAGER"],
  },
  {
    id: "export",
    label: "Data Export",
    roles: ["ADMIN", "ANALYST", "SALES_MANAGER"],
  },
  {
    id: "settings",
    label: "Settings",
    roles: ["ADMIN", "ANALYST", "SALES_MANAGER", "SALES_REP"],
  },
];

function Sidebar({ activeNav, setActiveNav, sidebarOpen, setSidebarOpen }) {
  const { user } = useAuth();
  const { isDark } = useTheme();
  const t = isDark ? dark : light;

  const visibleNavItems = NAV_ITEMS.filter((item) => {
    if (!user) return item.id === "overview";
    return item.roles.includes(user.role);
  });

  const visibleFeatureItems = FEATURE_ITEMS.filter((item) => {
    if (!user) return false;
    return item.roles.includes(user.role);
  });

  return (
    <div
      style={{
        ...styles.sidebar,
        width: sidebarOpen ? "220px" : "60px",
        background: t.bg,
        borderRight: `1px solid ${t.border}`,
      }}
    >
      <div style={styles.toggleContainer}>
        <button
          style={{ ...styles.toggleBtn, color: t.text }}
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? "◀" : "▶"}
        </button>
      </div>

      <nav style={styles.nav}>
        {/* Main Navigation */}
        {visibleNavItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveNav(item.id)}
            style={{
              ...styles.navItem,
              background: activeNav === item.id ? t.activeBg : "transparent",
              color: activeNav === item.id ? t.activeText : t.text,
            }}
          >
            <span style={styles.icon}>{item.icon}</span>
            {sidebarOpen && <span style={styles.label}>{item.label}</span>}
          </button>
        ))}

        {visibleFeatureItems.length > 0 && (
          <div style={{ ...styles.divider, borderColor: t.border, display: sidebarOpen ? "block" : "none" }} />
        )}

        {visibleFeatureItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveNav(item.id)}
            style={{
              ...styles.navItem,
              background: activeNav === item.id ? t.activeBg : "transparent",
              color: activeNav === item.id ? t.activeText : t.text,
              fontSize: sidebarOpen ? "13px" : "13px",
            }}
          >
            <span style={styles.icon}>{item.icon}</span>
            {sidebarOpen && <span style={styles.label}>{item.label}</span>}
          </button>
        ))}
      </nav>

      {/* User Role Badge at bottom */}
      {user && sidebarOpen && (
        <div style={{ ...styles.roleBadge, background: t.badgeBg, color: t.badgeText }}>
          {user.role}
        </div>
      )}
    </div>
  );
}

const light = {
  bg: "#ffffff",
  border: "#e0e4ef",
  text: "#555",
  activeBg: "#1a2a6c",
  activeText: "#fff",
  badgeBg: "#f0f2f7",
  badgeText: "#1a2a6c",
};

const dark = {
  bg: "#1e293b",
  border: "#334155",
  text: "#94a3b8",
  activeBg: "#7c9fff",
  activeText: "#0f172a",
  badgeBg: "#334155",
  badgeText: "#e2e8f0",
};

const styles = {
  sidebar: {
    display: "flex",
    flexDirection: "column",
    transition: "width 0.3s",
    overflow: "hidden",
  },
  toggleContainer: {
    padding: "16px",
    borderBottom: "1px solid rgba(0,0,0,0.1)",
  },
  toggleBtn: {
    background: "transparent",
    border: "none",
    fontSize: "18px",
    cursor: "pointer",
    padding: "4px",
  },
  nav: {
    flex: 1,
    padding: "16px 0",
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    overflowY: "auto",
  },
  navItem: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "12px 16px",
    border: "none",
    fontSize: "14px",
    fontWeight: "500",
    cursor: "pointer",
    textAlign: "left",
    transition: "background 0.2s",
    borderRadius: "0",
  },
  icon: {
    fontSize: "18px",
    minWidth: "20px",
  },
  label: {
    whiteSpace: "nowrap",
  },
  divider: {
    height: "1px",
    margin: "8px 0",
    borderTop: "1px solid",
  },
  roleBadge: {
    margin: "16px",
    padding: "8px 12px",
    borderRadius: "6px",
    fontSize: "11px",
    fontWeight: "700",
    textAlign: "center",
    textTransform: "uppercase",
  },
};

export default Sidebar;
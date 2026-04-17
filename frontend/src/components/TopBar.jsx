import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

function TopBar({ pageTitle }) {
  const { user } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  const t = isDark ? dark : light;

  return (
    <header style={{ ...styles.topBar, background: t.cardBg, borderBottom: `1px solid ${t.border}` }}>
      <h1 style={{ ...styles.pageTitle, color: t.textPrimary }}>{pageTitle}</h1>
      <div style={styles.right}>
        
        <div style={styles.userInfo}>
          <span style={{ ...styles.username, color: t.textSecondary }}>{user?.username}</span>
          <span style={{ ...styles.roleBadge, background: t.badgeBg, color: t.textPrimary }}>{user?.role}</span>
        </div>
        <button style={{ ...styles.themeBtn, background: t.toggleBg, color: t.textPrimary }} onClick={toggleTheme}>
          {isDark ? " Light" : "Dark"}
        </button>
      </div>
    </header>
  );
}

const light = {
  cardBg: "#ffffff",
  border: "#e0e4ef",
  textPrimary: "#1a2a6c",
  textSecondary: "#555",
  toggleBg: "#f0f2f7",
  badgeBg: "#eef0fb",
};

const dark = {
  cardBg: "#1e293b",
  border: "#334155",
  textPrimary: "#e2e8f0",
  textSecondary: "#94a3b8",
  toggleBg: "#334155",
  badgeBg: "#0f172a",
};

const styles = {
  topBar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "16px 28px",
    flexShrink: 0,
  },
  pageTitle: {
    margin: 0,
    fontSize: "20px",
    fontWeight: "700",
  },
  right: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  themeBtn: {
    padding: "6px 14px",
    borderRadius: "20px",
    border: "none",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: "600",
  },
  userInfo: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  username: {
    fontSize: "14px",
    fontWeight: "500",
  },
  roleBadge: {
    padding: "5px 12px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "700",
    letterSpacing: "0.3px",
  },
};

export default TopBar;
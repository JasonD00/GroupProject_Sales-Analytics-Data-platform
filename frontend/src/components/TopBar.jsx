import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

function TopBar({ pageTitle }) {
  const { user, logout, openLoginModel } = useAuth();
  const { isDark, toggleTheme }          = useTheme();
  const navigate                         = useNavigate();
  const t = isDark ? dark : light;

  return (
    <header style={{ ...styles.topBar, background: t.cardBg, borderBottom: `1px solid ${t.border}` }}>
      <h1 style={{ ...styles.pageTitle, color: t.textPrimary }}>{pageTitle}</h1>
      <div style={styles.right}>

        {/* About Us button */}
        <button
          style={{ ...styles.aboutBtn, color: t.textSecondary, border: `1px solid ${t.border}` }}
          onClick={() => navigate("/")}
        >
          About Us
        </button>

        {user ? (
          <>
            {/* Username display */}
            <span style={{ ...styles.username, color: t.textSecondary }}>
              {user.username}
            </span>

            {/* Logout */}
            <button
              style={{ ...styles.logoutBtn, background: t.toggleBg, color: t.textPrimary }}
              onClick={() => { logout(); navigate("/"); }}
            >
              Sign Out
            </button>
          </>
        ) : (
          <button style={styles.loginBtn} onClick={openLoginModel}>
            Sign In
          </button>
        )}

        {/* Theme toggle */}
        <button
          style={{ ...styles.themeBtn, background: t.toggleBg, color: t.textPrimary }}
          onClick={toggleTheme}
        >
          {isDark ? "Light" : "Dark"}
        </button>
      </div>
    </header>
  );
}

const light = {
  cardBg:        "#ffffff",
  border:        "#e0e4ef",
  textPrimary:   "#1a2a6c",
  textSecondary: "#555",
  toggleBg:      "#f0f2f7",
};

const dark = {
  cardBg:        "#1e293b",
  border:        "#334155",
  textPrimary:   "#e2e8f0",
  textSecondary: "#94a3b8",
  toggleBg:      "#334155",
};

const styles = {
  topBar: {
    display:        "flex",
    alignItems:     "center",
    justifyContent: "space-between",
    padding:        "16px 28px",
    flexShrink:     0,
  },
  pageTitle: {
    margin:     0,
    fontSize:   "20px",
    fontWeight: "700",
  },
  right: {
    display:    "flex",
    alignItems: "center",
    gap:        "12px",
  },
  aboutBtn: {
    padding:      "6px 14px",
    borderRadius: "20px",
    background:   "transparent",
    fontSize:     "13px",
    fontWeight:   "500",
    cursor:       "pointer",
  },
  username: {
    fontSize:   "13px",
    fontWeight: "500",
  },
  logoutBtn: {
    padding:      "6px 14px",
    borderRadius: "20px",
    border:       "none",
    cursor:       "pointer",
    fontSize:     "13px",
    fontWeight:   "600",
  },
  loginBtn: {
    padding:      "8px 20px",
    borderRadius: "20px",
    border:       "none",
    background:   "#1a2a6c",
    color:        "#fff",
    cursor:       "pointer",
    fontSize:     "14px",
    fontWeight:   "600",
  },
  themeBtn: {
    padding:      "6px 14px",
    borderRadius: "20px",
    border:       "none",
    cursor:       "pointer",
    fontSize:     "13px",
    fontWeight:   "600",
  },
};

export default TopBar;
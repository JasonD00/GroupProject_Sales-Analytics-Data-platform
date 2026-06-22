/*
  Overview:
  Sign in model that gets the username, password and subscription tier
  Calls "login()" from AuthContext when submit button is pressed

  Needs to be replaced with the API call when backend is connected
*/

import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

function LoginModel() {
  const { login, closeLoginModel } = useAuth();
  const { isDark } = useTheme();
  const t = isDark ? dark : light;

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  console.log("LoginModel rendered"); // Debug log

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!username || !password) {
      setError("Please enter both username and password");
      return;
    }

    if (username === "admin" && password === "admin123") {
      login({ username: "admin", role: "ADMIN" });
      closeLoginModel();
    } else if (username === "analyst" && password === "analyst123") {
      login({ username: "analyst", role: "ANALYST" });
      closeLoginModel();
    } else {
      setError("Invalid credentials. Try admin/admin123 or analyst/analyst123");
    }
  };

  return (
    <div style={styles.backdrop} onClick={closeLoginModel}>
      <div style={{ ...styles.model, background: t.cardBg }} onClick={(e) => e.stopPropagation()}>
        <div style={styles.header}>
          <h2 style={{ ...styles.title, color: t.textPrimary }}>Login Required</h2>
          <button style={{ ...styles.closeBtn, color: t.textSecondary }} onClick={closeLoginModel}>✕</button>
        </div>

        <p style={{ ...styles.subtitle, color: t.textSecondary }}>
          Sign in to view full analytics and detailed insights
        </p>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{ ...styles.input, background: t.inputBg, border: `1px solid ${t.border}`, color: t.textPrimary }}
            autoFocus
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ ...styles.input, background: t.inputBg, border: `1px solid ${t.border}`, color: t.textPrimary }}
          />
          <button type="submit" style={styles.submitBtn}>Sign In</button>
        </form>

        <div style={{ ...styles.hint, color: t.textMuted }}>
          Demo credentials: admin/admin123 or analyst/analyst123
        </div>
      </div>
    </div>
  );
}

// STYLING

const light = {
  textPrimary:   "#1a2a6c",
  textSecondary: "#555",
  cardBg:        "#ffffff",
  border:        "#e0e4ef",
  inputBg:       "#f8f9fc",
};

const dark = {
  textPrimary:   "#e2e8f0",
  textSecondary: "#94a3b8",
  cardBg:        "#1e293b",
  border:        "#334155",
  inputBg:       "#0f172a",
};

const styles = {
  overlay: {
    position:       "fixed",
    inset:          0,
    background:     "rgba(0,0,0,0.5)",
    display:        "flex",
    alignItems:     "center",
    justifyContent: "center",
    zIndex:         1000,
    backdropFilter: "blur(4px)",
  },
  modal: {
    width:        "100%",
    maxWidth:     "460px",
    borderRadius: "12px",
    padding:      "32px",
    boxShadow:    "0 20px 60px rgba(0,0,0,0.25)",
  },
  header: {
    display:        "flex",
    justifyContent: "space-between",
    alignItems:     "flex-start",
    marginBottom:   "24px",
  },
  title: {
    margin:     "0 0 4px 0",
    fontSize:   "20px",
    fontWeight: "700",
  },
  subtitle: {
    margin:   0,
    fontSize: "13px",
  },
  closeBtn: {
    background: "transparent",
    border:     "none",
    fontSize:   "16px",
    cursor:     "pointer",
    padding:    "4px 8px",
    lineHeight: 1,
  },
  errorBox: {
    background:   "#fee2e2",
    color:        "#dc2626",
    padding:      "10px 14px",
    borderRadius: "6px",
    fontSize:     "13px",
    marginBottom: "16px",
  },
  field: {
    marginBottom: "18px",
  },
  label: {
    display:       "block",
    fontSize:      "11px",
    fontWeight:    "600",
    marginBottom:  "6px",
    textTransform: "uppercase",
    letterSpacing: "0.6px",
  },
  input: {
    width:        "100%",
    padding:      "10px 14px",
    borderRadius: "6px",
    fontSize:     "14px",
    outline:      "none",
    boxSizing:    "border-box",
  },
  tierGrid: {
    display:             "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap:                 "8px",
  },
  tierBtn: {
    padding:      "14px 8px",
    borderRadius: "8px",
    cursor:       "pointer",
    textAlign:    "center",
    transition:   "all 0.15s",
    display:      "flex",
    flexDirection:"column",
    alignItems:   "center",
    gap:          "4px",
  },
  tierDot: {
    width:        "8px",
    height:       "8px",
    borderRadius: "50%",
    marginBottom: "2px",
  },
  tierName: {
    fontSize:   "13px",
    fontWeight: "700",
  },
  tierPrice: {
    fontSize:   "11px",
    fontWeight: "600",
  },
  tierDesc: {
    fontSize: "10px",
  },
  loginBtn: {
    width:        "100%",
    padding:      "12px",
    background:   "#1a2a6c",
    color:        "#fff",
    border:       "none",
    borderRadius: "8px",
    fontSize:     "14px",
    fontWeight:   "600",
    cursor:       "pointer",
    marginBottom: "12px",
  },
  note: {
    fontSize:  "12px",
    textAlign: "center",
    margin:    0,
  },
};

export default LoginModel;
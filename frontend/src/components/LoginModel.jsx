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

  const handleSubmit = (e) => {
    e.preventDefault();
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
      setError("Invalid credentials");
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
          Demo: admin/admin123 or analyst/analyst123
        </div>
      </div>
    </div>
  );
}

const light = {
  cardBg: "#ffffff",
  textPrimary: "#1a2a6c",
  textSecondary: "#555",
  textMuted: "#888",
  inputBg: "#ffffff",
  border: "#ddd",
};

const dark = {
  cardBg: "#1e293b",
  textPrimary: "#e2e8f0",
  textSecondary: "#94a3b8",
  textMuted: "#64748b",
  inputBg: "#0f172a",
  border: "#334155",
};

const styles = {
  backdrop: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0, 0, 0, 0.6)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  model: {
    borderRadius: "12px",
    padding: "32px",
    width: "90%",
    maxWidth: "420px",
    boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "8px",
  },
  title: {
    margin: 0,
    fontSize: "22px",
    fontWeight: "700",
  },
  closeBtn: {
    background: "transparent",
    border: "none",
    fontSize: "24px",
    cursor: "pointer",
    padding: "0",
    width: "32px",
    height: "32px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  subtitle: {
    margin: "0 0 24px 0",
    fontSize: "14px",
  },
  error: {
    padding: "10px 14px",
    background: "#fee2e2",
    border: "1px solid #fca5a5",
    borderRadius: "6px",
    color: "#dc2626",
    fontSize: "13px",
    marginBottom: "16px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "14px",
  },
  input: {
    padding: "12px 16px",
    borderRadius: "6px",
    fontSize: "15px",
    outline: "none",
  },
  submitBtn: {
    padding: "12px",
    borderRadius: "6px",
    border: "none",
    background: "#1a2a6c",
    color: "#fff",
    fontWeight: "600",
    fontSize: "15px",
    cursor: "pointer",
    marginTop: "8px",
  },
  hint: {
    marginTop: "16px",
    fontSize: "12px",
    textAlign: "center",
  },
};

export default LoginModel;
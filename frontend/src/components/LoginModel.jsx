/*
    Calls the backend API to verify user information when logging in

    Flow:
      1. User enters username + password
      2. Sends POST /api/auth/login to Spring Boot
      3. If successful - stores user in AuthContext -> closes model -> redirects to /dashboard
      4. If failed -> shows error message
*/

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

function LoginModel() {
  const { login, closeLoginModel } = useAuth();
  const { isDark }                 = useTheme();
  const navigate                   = useNavigate();
  const t = isDark ? dark : light;

  const [username,  setUsername]  = useState("");
  const [password,  setPassword]  = useState("");
  const [error,     setError]     = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!username.trim()) { setError("Please enter your username"); return; }
    if (!password.trim()) { setError("Please enter your password"); return; }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:8080/api/auth/login", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({
          username: username.trim(),
          password: password,
        }),
      });

      if (!response.ok) {
        setError("Invalid username or password");
        return;
      }

      const data = await response.json();

      // Store user in AuthContext
      login({
        username: data.username,
        tier:     data.tier,
        token:    data.token,
      });

      // Close modal and redirect to dashboard
      closeLoginModel();
      navigate("/dashboard");

    } catch (err) {
      setError("Could not connect to server. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleLogin();
  };

  return (
    <div style={styles.overlay}>
      <div style={{ ...styles.modal, background: t.cardBg, border: `1px solid ${t.border}` }}>

        {/* Header */}
        <div style={styles.header}>
          <div>
            <h2 style={{ ...styles.title, color: t.textPrimary }}>Sign In</h2>
            <p style={{ ...styles.subtitle, color: t.textSecondary }}>
              Access your analytics dashboard
            </p>
          </div>
          <button
            onClick={closeLoginModel}
            style={{ ...styles.closeBtn, color: t.textSecondary }}
          >
            x
          </button>
        </div>

        {/* Error */}
        {error && (
          <div style={styles.errorBox}>{error}</div>
        )}

        {/* Username */}
        <div style={styles.field}>
          <label style={{ ...styles.label, color: t.textSecondary }}>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => { setUsername(e.target.value); setError(""); }}
            onKeyDown={handleKeyDown}
            placeholder="Enter your username"
            disabled={isLoading}
            style={{
              ...styles.input,
              background: t.inputBg,
              border:     `1px solid ${t.border}`,
              color:      t.textPrimary,
              opacity:    isLoading ? 0.6 : 1,
            }}
          />
        </div>

        {/* Password */}
        <div style={styles.field}>
          <label style={{ ...styles.label, color: t.textSecondary }}>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError(""); }}
            onKeyDown={handleKeyDown}
            placeholder="Enter your password"
            disabled={isLoading}
            style={{
              ...styles.input,
              background: t.inputBg,
              border:     `1px solid ${t.border}`,
              color:      t.textPrimary,
              opacity:    isLoading ? 0.6 : 1,
            }}
          />
        </div>

        {/* Submit */}
        <button
          style={{
            ...styles.loginBtn,
            opacity: isLoading ? 0.7 : 1,
            cursor:  isLoading ? "not-allowed" : "pointer",
          }}
          onClick={handleLogin}
          disabled={isLoading}
        >
          {isLoading ? "Signing in..." : "Sign In"}
        </button>

      </div>
    </div>
  );
}

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
    maxWidth:     "420px",
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
  loginBtn: {
    width:        "100%",
    padding:      "12px",
    background:   "#1a2a6c",
    color:        "#fff",
    border:       "none",
    borderRadius: "8px",
    fontSize:     "14px",
    fontWeight:   "600",
    marginTop:    "4px",
  },
};

export default LoginModel;
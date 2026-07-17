/*
    Calls the backend API to verify user information when logging in

    Flow (Login):
      1. User enters username + password
      2. Sends POST /api/auth/login to Spring Boot
      3. If successful - stores user in AuthContext -> closes model -> redirects to /dashboard
      4. If failed -> shows error message

    Flow (Create Account):
      1. User enters username + password + select a tier
      2. Sends POST /api/auth/register to Spring Boot
      3. If successful -> switches back to login with a success message
      4. If failed -> shows error message
*/

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

const TIERS = [
  { value: "GROWTH",     label: "Growth",     desc: "Basic analytics"   },
  { value: "PRO",        label: "Pro",        desc: "Full analytics"    },
  { value: "ENTERPRISE", label: "Enterprise", desc: "All features"      },
];

const TIER_COLORS = {
  GROWTH:     "#16a34a",
  PRO:        "#1a2a6c",
  ENTERPRISE: "#7c3aed",
};

function LoginModel() {
  const { login, closeLoginModel } = useAuth();
  const { isDark }                 = useTheme();
  const navigate                   = useNavigate();
  const t = isDark ? dark : light;

  // "login" or "register"
  const [mode, setMode] = useState("login");

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [tier,     setTier]     = useState("GROWTH"); //default

  const [error,     setError]     = useState("");
  const [success,   setSuccess]   = useState("");
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

      login({
        username: data.username,
        tier:     data.tier,
        token:    data.token,
      });

      closeLoginModel();
      navigate("/dashboard");

    } catch (err) {
      setError("Could not connect to server. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!username.trim()) { setError("Please enter a username"); return; }
    if (!password.trim()) { setError("Please enter a password"); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters"); return; }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:8080/api/auth/register", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({
          username: username.trim(),
          password: password,
          tier:     tier,
        }),
      });

      if (!response.ok) {
        setError("Username already exists or account could not be created");
        return;
      }

      // Switch to login, keeps the username and clears the password field
      setMode("login");
      setPassword("");
      setSuccess("Account created! Please sign in.");

    } catch (err) {
      setError("Could not connect to server. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key !== "Enter") return;
    if (mode === "login") handleLogin();
    else handleRegister();
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    setError("");
    setSuccess("");
    setPassword("");
  };

  return (
    <div style={styles.overlay}>
      <div style={{ ...styles.modal, background: t.cardBg, border: `1px solid ${t.border}` }}>

        {/* Header */}
        <div style={styles.header}>
          <div>
            <h2 style={{ ...styles.title, color: t.textPrimary }}>
              {mode === "login" ? "Sign In" : "Create Account"}
            </h2>
            <p style={{ ...styles.subtitle, color: t.textSecondary }}>
              {mode === "login"
                ? "Access your analytics dashboard"
                : "Set up a new account to get started"}
            </p>
          </div>
          <button
            onClick={closeLoginModel}
            style={{ ...styles.closeBtn, color: t.textSecondary }}
          >
            x
          </button>
        </div>

        <div style={{ ...styles.tabRow, borderBottom: `1px solid ${t.border}` }}>
          <button
            onClick={() => switchMode("login")}
            style={{
              ...styles.tab,
              color:       mode === "login" ? t.textPrimary : t.textSecondary,
              borderBottom: mode === "login" ? `2px solid #1a2a6c` : "2px solid transparent",
              fontWeight:  mode === "login" ? "700" : "500",
            }}
          >
            Sign In
          </button>
          <button
            onClick={() => switchMode("register")}
            style={{
              ...styles.tab,
              color:       mode === "register" ? t.textPrimary : t.textSecondary,
              borderBottom: mode === "register" ? `2px solid #1a2a6c` : "2px solid transparent",
              fontWeight:  mode === "register" ? "700" : "500",
            }}
          >
            Create Account
          </button>
        </div>

        {/* Error message */}
        {error && (
          <div style={styles.errorBox}>{error}</div>
        )}

        {/* Success message */}
        {success && !error && (
          <div style={styles.successBox}>{success}</div>
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
            placeholder={mode === "login" ? "Enter your password" : "At least 6 characters"}
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

        {/* Tier selection - only for register */}
        {mode === "register" && (
          <div style={styles.field}>
            <label style={{ ...styles.label, color: t.textSecondary }}>Subscription Plan</label>
            <div style={styles.tierGrid}>
              {TIERS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setTier(option.value)}
                  style={{
                    ...styles.tierBtn,
                    border: tier === option.value
                      ? `2px solid ${TIER_COLORS[option.value]}`
                      : `1px solid ${t.border}`,
                    background: tier === option.value
                      ? isDark ? "rgba(124,159,255,0.08)" : "rgba(26,42,108,0.04)"
                      : t.inputBg,
                  }}
                >
                  <div style={{ ...styles.tierDot, background: TIER_COLORS[option.value] }} />
                  <div style={{ ...styles.tierName, color: TIER_COLORS[option.value] }}>{option.label}</div>
                  <div style={{ ...styles.tierDesc, color: t.textSecondary }}>{option.desc}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Submit */}
        <button
          style={{
            ...styles.loginBtn,
            opacity: isLoading ? 0.7 : 1,
            cursor:  isLoading ? "not-allowed" : "pointer",
          }}
          onClick={mode === "login" ? handleLogin : handleRegister}
          disabled={isLoading}
        >
          {isLoading
            ? (mode === "login" ? "Signing in..." : "Creating account...")
            : (mode === "login" ? "Sign In" : "Create Account")}
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
    maxWidth:     "440px",
    borderRadius: "12px",
    padding:      "32px",
    boxShadow:    "0 20px 60px rgba(0,0,0,0.25)",
  },
  header: {
    display:        "flex",
    justifyContent: "space-between",
    alignItems:     "flex-start",
    marginBottom:   "20px",
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
  tabRow: {
    display:      "flex",
    gap:          "8px",
    marginBottom: "20px",
  },
  tab: {
    flex:         1,
    padding:      "10px 0",
    background:   "transparent",
    border:       "none",
    fontSize:     "14px",
    cursor:       "pointer",
    transition:   "all 0.15s",
  },
  errorBox: {
    background:   "#fee2e2",
    color:        "#dc2626",
    padding:      "10px 14px",
    borderRadius: "6px",
    fontSize:     "13px",
    marginBottom: "16px",
  },
  successBox: {
    background:   "#dcfce7",
    color:        "#16a34a",
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
    padding:       "12px 8px",
    borderRadius:  "8px",
    cursor:        "pointer",
    textAlign:     "center",
    transition:    "all 0.15s",
    display:       "flex",
    flexDirection: "column",
    alignItems:    "center",
    gap:           "4px",
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
    marginTop:    "4px",
  },
};

export default LoginModel;
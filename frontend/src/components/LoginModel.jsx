/*
  Overview:
  Sign in model that gets the username, password and subscription tier
  Calls "login()" from AuthContext when submit button is pressed

  Needs to be replaced with the API call when backend is connected
*/

import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

const TIERS = [
  { name: "Growth",     price: "€29/mo",  description: "Basic analytics"   },
  { name: "Pro",        price: "€75/mo",  description: "Full analytics"     },
  { name: "Enterprise", price: "Custom",  description: "All features"       },
];

const TIER_COLORS = {
  Growth:     "#16a34a",
  Pro:        "#1a2a6c",
  Enterprise: "#7c3aed",
};

function LoginModel() {
  const { login, closeLoginModel } = useAuth();
  const { isDark } = useTheme();
  const t = isDark ? dark : light;

  const [username, setUsername]         = useState("");
  const [password, setPassword]         = useState("");
  const [selectedTier, setSelectedTier] = useState("Pro");
  const [error, setError]               = useState("");

  const handleLogin = () => {
    if (!username.trim()) { setError("Please enter a username"); return; }
    if (!password.trim()) { setError("Please enter a password"); return; }

    // TODO: Replace with real API call to POST /api/auth/login
    login({ username: username.trim(), tier: selectedTier });
    closeLoginModel();
  };

  return (
    <div style={styles.overlay}>
      <div style={{ ...styles.modal, background: t.cardBg, border: `1px solid ${t.border}` }}>

        {/* Header */}
        <div style={styles.header}>
          <div>
            <h2 style={{ ...styles.title, color: t.textPrimary }}>Sign In</h2>
            <p style={{ ...styles.subtitle, color: t.textSecondary }}>Access your analytics dashboard</p>
          </div>
          <button onClick={closeLoginModel} style={{ ...styles.closeBtn, color: t.textSecondary }}>
            x
          </button>
        </div>

        {/* Error - not implemented yet*/}
        {error && <div style={styles.errorBox}>{error}</div>}

        {/* Username */}
        <div style={styles.field}>
          <label style={{ ...styles.label, color: t.textSecondary }}>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => { setUsername(e.target.value); setError(""); }}
            placeholder="Enter your username"
            style={{ ...styles.input, background: t.inputBg, border: `1px solid ${t.border}`, color: t.textPrimary }}
          />
        </div>

        {/* Password */}
        <div style={styles.field}>
          <label style={{ ...styles.label, color: t.textSecondary }}>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError(""); }}
            placeholder="Enter your password"
            style={{ ...styles.input, background: t.inputBg, border: `1px solid ${t.border}`, color: t.textPrimary }}
          />
        </div>

        {/* Tier selection */}
        <div style={styles.field}>
          <label style={{ ...styles.label, color: t.textSecondary }}>Subscription Plan</label>
          <div style={styles.tierGrid}>
            {TIERS.map((tier) => (
              <button
                key={tier.name}
                onClick={() => setSelectedTier(tier.name)}
                style={{
                  ...styles.tierBtn,
                  border: selectedTier === tier.name
                    ? `2px solid ${TIER_COLORS[tier.name]}`
                    : `1px solid ${t.border}`,
                  background: selectedTier === tier.name
                    ? isDark ? "rgba(124,159,255,0.08)" : "rgba(26,42,108,0.04)"
                    : t.inputBg,
                }}
              >
                <div style={{ ...styles.tierDot, background: TIER_COLORS[tier.name] }} />
                <div style={{ ...styles.tierName, color: TIER_COLORS[tier.name] }}>{tier.name}</div>
                <div style={{ ...styles.tierPrice, color: t.textSecondary }}>{tier.price}</div>
                <div style={{ ...styles.tierDesc, color: t.textSecondary }}>{tier.description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Submit button */}
        <button style={styles.loginBtn} onClick={handleLogin}>
          Sign In
        </button>

        <p style={{ ...styles.note, color: t.textSecondary }}>
          Demo mode — select a plan to explore the dashboard
        </p>
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
/*
  What it does:
    - Shows nav items filtered by the user's subscription tier
    - Highlights the currently active page
    - Collapses to icon-only mode via the toggle button
    - Shows the user's tier badge at the bottom when expanded

  Tier access rules:
    - GROWTH - Overview, Customers, Settings
    - PRO - + Sales, Territory, Invoices, Reports, Data Export
    - ENTERPRISE - + Products (and all PRO features)

  Props:
    - activeNav (string)   - ID of the currently active page
    - setActiveNav (function) - Called when a nav item is clicked
    - sidebarOpen (boolean)  - Whether the sidebar is expanded
    - setSidebarOpen (function) - Toggles the sidebar open/closed

  Reads from AuthContext:
    - user - Used to filter nav items by tier
*/

import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

// Main navigation items
// Tiers are uppercase to match what the backend JWT returns
const NAV_ITEMS = [
  { id: "overview",   label: "Overview",   tiers: ["GROWTH", "PRO", "ENTERPRISE"] },
  { id: "sales",      label: "Sales",      tiers: ["PRO", "ENTERPRISE"]           },
  { id: "customers",  label: "Customers",  tiers: ["GROWTH", "PRO", "ENTERPRISE"] },
  { id: "products",   label: "Products",   tiers: ["ENTERPRISE"]                  },
  { id: "territory",  label: "Territory",  tiers: ["PRO", "ENTERPRISE"]           },
  { id: "invoices",   label: "Invoices",   tiers: ["PRO", "ENTERPRISE"]           },
  { id: "summaries",   label: "Summaries", tiers: ["ENTERPRISE"]                  },
];

// Feature items shown below a divider
const FEATURE_ITEMS = [
  { id: "reports",  label: "Reports",     tiers: ["PRO", "ENTERPRISE"]           },
  { id: "export",   label: "Data Export", tiers: ["PRO", "ENTERPRISE"]           },
  { id: "settings", label: "Settings",    tiers: ["GROWTH", "PRO", "ENTERPRISE"] },
];

// Supports uppercase (from backend) and capitalised
const TIER_COLORS = {
  GROWTH:     { bg: "#dcfce7", text: "#16a34a" },
  PRO:        { bg: "#dbeafe", text: "#1d4ed8" },
  ENTERPRISE: { bg: "#ede9fe", text: "#7c3aed" },
  Growth:     { bg: "#dcfce7", text: "#16a34a" },
  Pro:        { bg: "#dbeafe", text: "#1d4ed8" },
  Enterprise: { bg: "#ede9fe", text: "#7c3aed" },
};

const DEFAULT_TIER_COLOR = { bg: "#ede9fe", text: "#7c3aed" };

function Sidebar({ activeNav, setActiveNav, sidebarOpen, setSidebarOpen }) {
  const { user }   = useAuth();
  const { isDark } = useTheme();
  const t          = isDark ? dark : light;

  // Filter nav items by tier - show only Overview if not logged in
  const visibleNavItems = NAV_ITEMS.filter((item) => {
    if (!user) return item.id === "overview";
    return item.tiers.includes(user.tier);
  });

  const visibleFeatureItems = FEATURE_ITEMS.filter((item) => {
    if (!user) return false;
    return item.tiers.includes(user.tier);
  });

  const tierColors = user
  ? (TIER_COLORS[user.tier] || DEFAULT_TIER_COLOR)
  : null;


  // Display tier capitalised e.g. ENTERPRISE -> Enterprise
  const displayTier = user?.tier
    ? user.tier.charAt(0) + user.tier.slice(1).toLowerCase()
    : "";

  return (
    <div
      style={{
        ...styles.sidebar,
        width:       sidebarOpen ? "220px" : "60px",
        background:  t.bg,
        borderRight: `1px solid ${t.border}`,
      }}
    >
      {/* Toggle button */}
      <div style={{ ...styles.toggleContainer, borderBottom: `1px solid ${t.border}` }}>
        <button
          style={{ ...styles.toggleBtn, color: t.textMuted }}
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? "<" : ">"}
        </button>
      </div>

      {/* Navigation */}
      <nav style={styles.nav}>

        {/* Main nav items */}
        {visibleNavItems.map((item) => {
          const isActive = activeNav === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveNav(item.id)}
              style={{
                ...styles.navItem,
                background:  isActive ? t.activeBg    : "transparent",
                color:       isActive ? t.activeText  : t.text,
                borderLeft:  isActive ? `3px solid ${t.activeAccent}` : "3px solid transparent",
              }}
            >
              <span style={{ ...styles.dot, background: isActive ? t.activeAccent : t.textMuted }} />
              {sidebarOpen && <span style={styles.label}>{item.label}</span>}
            </button>
          );
        })}

        {/* Divider */}
        {visibleFeatureItems.length > 0 && (
          <div style={{
            ...styles.divider,
            borderColor: t.border,
            margin:      sidebarOpen ? "8px 16px" : "8px auto",
            width:       sidebarOpen ? "auto" : "24px",
          }} />
        )}

        {/* Feature items */}
        {visibleFeatureItems.map((item) => {
          const isActive = activeNav === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveNav(item.id)}
              style={{
                ...styles.navItem,
                background:  isActive ? t.activeBg    : "transparent",
                color:       isActive ? t.activeText  : t.text,
                borderLeft:  isActive ? `3px solid ${t.activeAccent}` : "3px solid transparent",
                fontSize:    "13px",
              }}
            >
              <span style={{ ...styles.dot, background: isActive ? t.activeAccent : t.textMuted }} />
              {sidebarOpen && <span style={styles.label}>{item.label}</span>}
            </button>
          );
        })}
      </nav>

      {/* Tier badge */}
      {user && sidebarOpen && (
        <div style={styles.bottomSection}>
          <div style={{ ...styles.tierBadge, background: tierColors.bg, color: tierColors.text }}>
            {displayTier} Plan
          </div>
          <div style={{ ...styles.userLabel, color: t.textMuted }}>
            {user.username}
          </div>
        </div>
      )}

      {/* Collapsed tier dot */}
      {user && !sidebarOpen && (
        <div style={styles.collapsedBottom}>
          <div
            style={{ ...styles.tierDot, background: tierColors?.text || "#7c3aed" }}
            title={`${displayTier} Plan`}
          />
        </div>
      )}
    </div>
  );
}

const light = {
  bg:           "#ffffff",
  border:       "#e0e4ef",
  text:         "#555",
  textMuted:    "#bbb",
  activeBg:     "rgba(26,42,108,0.06)",
  activeText:   "#1a2a6c",
  activeAccent: "#1a2a6c",
};

const dark = {
  bg:           "#1e293b",
  border:       "#334155",
  text:         "#94a3b8",
  textMuted:    "#475569",
  activeBg:     "rgba(124,159,255,0.1)",
  activeText:   "#7c9fff",
  activeAccent: "#7c9fff",
};

const styles = {
  sidebar: {
    display:       "flex",
    flexDirection: "column",
    transition:    "width 0.25s ease",
    overflow:      "hidden",
    flexShrink:    0,
    height:        "100vh",
  },
  toggleContainer: {
    padding:    "14px 16px",
    display:    "flex",
    alignItems: "center",
  },
  toggleBtn: {
    background: "transparent",
    border:     "none",
    fontSize:   "14px",
    cursor:     "pointer",
    padding:    "4px",
    fontWeight: "600",
    lineHeight: 1,
  },
  nav: {
    flex:          1,
    padding:       "12px 0",
    display:       "flex",
    flexDirection: "column",
    gap:           "2px",
    overflowY:     "auto",
  },
  navItem: {
    display:    "flex",
    alignItems: "center",
    gap:        "12px",
    padding:    "11px 18px",
    border:     "none",
    fontSize:   "14px",
    fontWeight: "500",
    cursor:     "pointer",
    textAlign:  "left",
    transition: "all 0.15s",
    width:      "100%",
  },
  dot: {
    width:        "6px",
    height:       "6px",
    borderRadius: "50%",
    flexShrink:   0,
  },
  label: {
    whiteSpace: "nowrap",
    fontSize:   "14px",
  },
  divider: {
    height:    0,
    borderTop: "1px solid",
  },
  bottomSection: {
    padding:       "14px",
    display:       "flex",
    flexDirection: "column",
    gap:           "6px",
  },
  tierBadge: {
    padding:       "7px 12px",
    borderRadius:  "6px",
    fontSize:      "11px",
    fontWeight:    "700",
    textAlign:     "center",
    letterSpacing: "0.3px",
  },
  userLabel: {
    fontSize:  "11px",
    textAlign: "center",
  },
  collapsedBottom: {
    padding:        "14px",
    display:        "flex",
    justifyContent: "center",
  },
  tierDot: {
    width:        "8px",
    height:       "8px",
    borderRadius: "50%",
  },
};

export default Sidebar;
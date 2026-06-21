/*
  Overview:
  Left navigation panel
  Filters nav links by the users sub tier, highlights the active page the users on 
  Shows a tier badge at the bottom
*/

import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

// Main nav items
const NAV_ITEMS = [
  { id: "overview",      label: "Overview",      tiers: ["Growth", "Pro", "Enterprise"] },
  { id: "sales",         label: "Sales",          tiers: ["Pro", "Enterprise"]           },
  { id: "customers",     label: "Customers",      tiers: ["Growth", "Pro", "Enterprise"] },
  { id: "products",      label: "Products",       tiers: ["Enterprise"]                  },
  { id: "transactions",  label: "Transactions",   tiers: ["Pro", "Enterprise"]           },
  { id: "invoices",      label: "Invoices",       tiers: ["Pro", "Enterprise"]           },
];

// Shows items shown below the sidebar divider - depends on tier 
const FEATURE_ITEMS = [
  { id: "reports",  label: "Reports",      tiers: ["Pro", "Enterprise"]           },
  { id: "export",   label: "Data Export",  tiers: ["Pro", "Enterprise"]           },
  { id: "settings", label: "Settings",     tiers: ["Growth", "Pro", "Enterprise"] },
];

const TIER_COLORS = {
  Growth:     { bg: "#dcfce7", text: "#16a34a" },
  Pro:        { bg: "#dbeafe", text: "#1d4ed8" },
  Enterprise: { bg: "#ede9fe", text: "#7c3aed" },
};

function Sidebar({ activeNav, setActiveNav, sidebarOpen, setSidebarOpen }) {
  const { user } = useAuth();
  const { isDark } = useTheme();
  const t = isDark ? dark : light;

  // Filter nav items depending on the users tier
  const visibleNavItems = NAV_ITEMS.filter((item) => {
    if (!user) return item.id === "overview";
    return item.tiers.includes(user.tier);
  });

  const visibleFeatureItems = FEATURE_ITEMS.filter((item) => {
    if (!user) return false;
    return item.tiers.includes(user.tier);
  });

  const tierColors = user ? TIER_COLORS[user.tier] : null;

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

      <nav style={styles.nav}>

        {/* Nav items */}
        {visibleNavItems.map((item) => {
          const isActive = activeNav === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveNav(item.id)}
              style={{
                ...styles.navItem,
                background:  isActive ? t.activeBg  : "transparent",
                color:       isActive ? t.activeText : t.text,
                borderLeft:  isActive ? `3px solid ${t.activeAccent}` : "3px solid transparent",
              }}
            >
              <span style={{ ...styles.dot, background: isActive ? t.activeAccent : t.textMuted }} />
              {sidebarOpen && <span style={styles.label}>{item.label}</span>}
            </button>
          );
        })}

        {/* Divider between nav and features */}
        {visibleFeatureItems.length > 0 && (
          <div style={{ ...styles.divider, borderColor: t.border, margin: sidebarOpen ? "8px 16px" : "8px auto", width: sidebarOpen ? "auto" : "24px" }} />
        )}

        {visibleFeatureItems.map((item) => {
          const isActive = activeNav === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveNav(item.id)}
              style={{
                ...styles.navItem,
                background:  isActive ? t.activeBg  : "transparent",
                color:       isActive ? t.activeText : t.text,
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

      {/* Tier badge — shown at bottom */}
      {user && sidebarOpen && (
        <div style={styles.bottomSection}>
          <div style={{ ...styles.tierBadge, background: tierColors.bg, color: tierColors.text }}>
            {user.tier} Plan
          </div>
          <div style={{ ...styles.userLabel, color: t.textMuted }}>
            {user.username}
          </div>
        </div>
      )}

      {user && !sidebarOpen && (
        <div style={styles.collapsedBottom}>
          <div style={{ ...styles.tierDot, background: tierColors.text }} title={`${user.tier} Plan`} />
        </div>
      )}
    </div>
  );
}

// STYLING
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
    display:        "flex",
    flexDirection:  "column",
    transition:     "width 0.25s ease",
    overflow:       "hidden",
    flexShrink:     0,
    height:         "100vh",
  },
  toggleContainer: {
    padding:        "14px 16px",
    display:        "flex",
    alignItems:     "center",
  },
  toggleBtn: {
    background:  "transparent",
    border:      "none",
    fontSize:    "14px",
    cursor:      "pointer",
    padding:     "4px",
    fontWeight:  "600",
    lineHeight:  1,
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
    padding:      "7px 12px",
    borderRadius: "6px",
    fontSize:     "11px",
    fontWeight:   "700",
    textAlign:    "center",
    letterSpacing:"0.3px",
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
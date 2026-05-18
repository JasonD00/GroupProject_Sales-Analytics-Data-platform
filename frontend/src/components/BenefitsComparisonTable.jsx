import { useTheme } from "../context/ThemeContext";

const FEATURES = [
{   
    name: "Team members", 
    growth: "Up to 5", 
    pro: "Unlimited", 
    enterprise: "Unlimited"
},

{   
    name: "Sales analytics dashboard", 
    growth: true, 
    pro: true, 
    enterprise: true
},

{   
    name: "Performance reports", 
    growth: "Monthly", 
    pro: "Custom", 
    enterprise: "Custom"
},

{   
    name: "Support channels", 
    growth: "Email & SMS", 
    pro: "Email, Phone, Chat", 
    enterprise: "24/7 Phone & Priority"
},

{   
    name: "Mobile app access", 
    growth: true, 
    pro: true, 
    enterprise: true
},

{   
    name: "Data export", 
    growth: "CSV", 
    pro: "CSV, Excel, PDF", 
    enterprise: "All formats"
},

{   
    name: "Advanced forecasting", 
    growth: false, 
    pro: true, 
    enterprise: true
},

{   
    name: "Real-time data sync", 
    growth: false, 
    pro: true, 
    enterprise: true
},

{   
    name: "API Access", 
    growth: false, 
    pro: true, 
    enterprise: true
},

{   
    name: "Custom dashboards", 
    growth: false, 
    pro: true, 
    enterprise: true
},

{   
    name: "Automated alerts", 
    growth: false, 
    pro: true, 
    enterprise: true
},

{   
    name: "Dedicated account manager", 
    growth: false, 
    pro: false, 
    enterprise: true
},

{   
    name: "Custom integrations", 
    growth: false, 
    pro: false, 
    enterprise: true
},

{   
    name: "SSO & 2FA", 
    growth: false, 
    pro: false, 
    enterprise: true
},

{   
    name: "SLA guarantees", 
    growth: false, 
    pro: false, 
    enterprise: "99.9% uptime"
},

{   
    name: "On-premise deployment", 
    growth: false, 
    pro: false, 
    enterprise: true
},

{   
    name: "White-label branding", 
    growth: false, 
    pro: false, 
    enterprise: true
},
];

function BenefitsComparisonTable() {
  const { isDark } = useTheme();
  const t = isDark ? dark : light;
 
  const renderCell = (value) => {
    if (value === true) {
      return <span style={{ ...styles.check, color: t.checkColor }}>✓</span>;
    }
    if (value === false) {
      return <span style={{ ...styles.cross, color: t.crossColor }}>✕</span>;
    }
    return <span style={{ ...styles.text, color: t.textPrimary }}>{value}</span>;
  };
 
  return (
    <div style={styles.wrapper}>
      <div style={styles.header}>
        <h2 style={{ ...styles.title, color: t.textPrimary }}>Compare Plans</h2>
        <p style={{ ...styles.subtitle, color: t.textSecondary }}>
          See what's included in each tier
        </p>
      </div>
 
      <div style={{ ...styles.tableWrapper, background: t.cardBg, border: `1px solid ${t.border}` }}>
        <table style={styles.table}>
          <thead>
            <tr style={{ borderBottom: `2px solid ${t.border}` }}>
              <th style={{ ...styles.th, ...styles.featureColumn, color: t.textPrimary, background: t.headerBg }}>
                Feature
              </th>
              <th style={{ ...styles.th, color: t.textPrimary, background: t.headerBg }}>Growth</th>
              <th style={{ ...styles.th, ...styles.popularHeader, color: t.popularText, background: t.popularHeaderBg }}>
                Pro
                <span style={styles.popularBadge}>Most Popular</span>
              </th>
              <th style={{ ...styles.th, color: t.textPrimary, background: t.headerBg }}>Enterprise</th>
            </tr>
          </thead>
          <tbody>
            {FEATURES.map((feature, index) => (
              <tr key={index} style={{ borderBottom: `1px solid ${t.borderLight}` }}>
                <td style={{ ...styles.td, ...styles.featureColumn, color: t.textPrimary, fontWeight: "500" }}>
                  {feature.name}
                </td>
                <td style={{ ...styles.td, textAlign: "center" }}>{renderCell(feature.growth)}</td>
                <td style={{ ...styles.td, ...styles.popularColumn, textAlign: "center" }}>
                  {renderCell(feature.pro)}
                </td>
                <td style={{ ...styles.td, textAlign: "center" }}>{renderCell(feature.enterprise)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
 
const light = {
  textPrimary: "#1a2a6c",
  textSecondary: "#555",
  cardBg: "#ffffff",
  border: "#e0e4ef",
  borderLight: "#f0f2f7",
  headerBg: "#f8f9fc",
  popularHeaderBg: "#eef0fb",
  popularText: "#1a2a6c",
  checkColor: "#16a34a",
  crossColor: "#dc2626",
};
 
const dark = {
  textPrimary: "#e2e8f0",
  textSecondary: "#94a3b8",
  cardBg: "#1e293b",
  border: "#334155",
  borderLight: "#334155",
  headerBg: "#0f172a",
  popularHeaderBg: "#1e3a8a",
  popularText: "#e2e8f0",
  checkColor: "#22c55e",
  crossColor: "#ef4444",
};
 
const styles = {
  wrapper: {
    padding: "40px 0",
  },
  header: {
    textAlign: "center",
    marginBottom: "32px",
  },
  title: {
    margin: "0 0 8px 0",
    fontSize: "28px",
    fontWeight: "700",
  },
  subtitle: {
    margin: 0,
    fontSize: "15px",
  },
  tableWrapper: {
    borderRadius: "12px",
    overflow: "hidden",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  th: {
    padding: "16px 20px",
    fontWeight: "600",
    fontSize: "14px",
    textAlign: "left",
  },
  featureColumn: {
    width: "35%",
  },
  popularHeader: {
    position: "relative",
  },
  popularBadge: {
    display: "block",
    fontSize: "11px",
    fontWeight: "600",
    marginTop: "4px",
    opacity: 0.8,
  },
  td: {
    padding: "14px 20px",
    fontSize: "14px",
  },
  popularColumn: {
    background: "rgba(26, 42, 108, 0.02)",
  },
  check: {
    fontSize: "18px",
    fontWeight: "700",
  },
  cross: {
    fontSize: "18px",
    fontWeight: "700",
  },
  text: {
    fontSize: "13px",
  },
};
 
export default BenefitsComparisonTable;
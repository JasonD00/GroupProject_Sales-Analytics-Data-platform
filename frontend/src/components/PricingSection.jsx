import { useTheme } from "../context/ThemeContext";

const PLANS = [
  {
    name: "Growth",
    price: "€29",
    period: "Billed Monthly",
    features: [
      "Up to 5 team members",
      "Basic sales analytics dashboard",
      "Monthly performance reports",
      "Email and SMS support",
      "Mobile app access",
      "Basic data export (CSV)",
      "Community forum access",
    ],
  },
  {
    name: "Pro",
    price: "€75",
    period: "Billed Monthly",
    features: [
      "Unlimited team members",
      "Advanced analytics & forecasting",
      "Custom report builder",
      "Real-time data sync",
      "Priority email & phone support",
      "Advanced data export (CSV, Excel, PDF)",
      "API access for integrations",
      "Custom dashboards",
      "Automated alerts & notifications",
    ],
    popular: true,
  },
  {
    name: "Enterprise",
    price: "€115",
    period: "Billed Monthly",
    features: [
      "Everything in Pro, plus:",
      "Dedicated account manager",
      "Custom integrations & workflows",
      "Advanced security features (SSO, 2FA)",
      "SLA guarantees (99.9% uptime)",
      "On-premise deployment option",
      "White-label branding",
      "Advanced user permissions",
      "Audit logs & compliance reporting",
      "24/7 phone support",
    ],
  },
];

function PricingSection() {
  const { isDark } = useTheme();
  const t = isDark ? dark : light;
 
  return (
    <div style={styles.wrapper}>
      <div style={styles.header}>
        <h2 style={{ ...styles.title, color: t.textPrimary }}>Unlock Full Analytics</h2>
        <p style={{ ...styles.subtitle, color: t.textSecondary }}>
          Choose the plan that fits your business needs
        </p>
      </div>
 
      <div style={styles.grid}>
        {PLANS.map((plan) => (
          <div
            key={plan.name}
            style={{
              ...styles.card,
              background: plan.popular ? t.popularBg : t.cardBg,
              border: plan.popular ? `2px solid ${t.accent}` : `1px solid ${t.border}`,
            }}
          >
            {plan.popular && (
              <div style={{ ...styles.badge, background: t.accent }}>Most Popular</div>
            )}
            <h3 style={{ ...styles.planName, color: plan.popular ? "#fff" : t.textPrimary }}>
              {plan.name}
            </h3>
            <div style={styles.priceRow}>
              <span style={{ ...styles.price, color: plan.popular ? "#fff" : t.textPrimary }}>
                {plan.price}
              </span>
            </div>
            <p style={{ ...styles.period, color: plan.popular ? "rgba(255,255,255,0.8)" : t.textSecondary }}>
              {plan.period}
            </p>
            <ul style={styles.features}>
              {plan.features.map((feature, i) => (
                <li key={i} style={{ ...styles.feature, color: plan.popular ? "rgba(255,255,255,0.9)" : t.textSecondary }}>
                  <span style={{ ...styles.checkmark, color: plan.popular ? "#fff" : t.accent }}>✓</span>
                  {feature}
                </li>
              ))}
            </ul>
            <button
              style={{
                ...styles.btn,
                background: plan.popular ? "#fff" : t.btnBg,
                color: plan.popular ? t.accent : t.textPrimary,
              }}
            >
              Get Started
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
 
const light = {
  textPrimary: "#1a2a6c",
  textSecondary: "#555",
  cardBg: "#ffffff",
  popularBg: "#1a2a6c",
  border: "#e0e4ef",
  accent: "#1a2a6c",
  btnBg: "#f0f2f7",
};
 
const dark = {
  textPrimary: "#e2e8f0",
  textSecondary: "#94a3b8",
  cardBg: "#1e293b",
  popularBg: "#7c9fff",
  border: "#334155",
  accent: "#7c9fff",
  btnBg: "#334155",
};
 
const styles = {
  wrapper: {
    padding: "40px 0",
  },
  header: {
    textAlign: "center",
    marginBottom: "40px",
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
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "24px",
  },
  card: {
    borderRadius: "12px",
    padding: "32px 24px",
    position: "relative",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
  },
  badge: {
    position: "absolute",
    top: "-12px",
    left: "50%",
    transform: "translateX(-50%)",
    padding: "4px 16px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "700",
    color: "#fff",
  },
  planName: {
    margin: "0 0 12px 0",
    fontSize: "20px",
    fontWeight: "700",
  },
  priceRow: {
    marginBottom: "8px",
  },
  price: {
    fontSize: "36px",
    fontWeight: "700",
  },
  period: {
    fontSize: "13px",
    marginBottom: "20px",
  },
  features: {
    listStyle: "none",
    padding: 0,
    margin: "0 0 24px 0",
  },
  feature: {
    padding: "6px 0",
    fontSize: "14px",
    lineHeight: "1.5",
    display: "flex",
    alignItems: "flex-start",
    gap: "8px",
  },
  checkmark: {
    fontWeight: "700",
    fontSize: "16px",
    flexShrink: 0,
  },
  btn: {
    width: "100%",
    padding: "12px",
    borderRadius: "8px",
    border: "none",
    fontWeight: "600",
    fontSize: "15px",
    cursor: "pointer",
  },
};
 
export default PricingSection;
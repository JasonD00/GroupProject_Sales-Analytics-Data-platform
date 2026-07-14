import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import LoginModel from "../components/LoginModel";

function AboutUs() {
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();
  const { user, openLoginModel, logout, showLoginModel } = useAuth();
  const t = isDark ? dark : light;

  return (
    <div style={styles.container}>

      {/* Top Nav */}
      <nav style={{ ...styles.topNav, background: t.cardBg, borderBottom: `1px solid ${t.border}` }}>
        <div style={styles.navContent}>
          <h1 style={{ ...styles.logo, color: t.textPrimary }}>Sales Analytics</h1>
          <div style={styles.navButtons}>

            {/* Sign In button */}
            {!user && (
              <button
                style={{ ...styles.signInBtn }}
                onClick={openLoginModel}
              >
                Sign In
              </button>
            )}

            {/* Dashboard button */}
            <button
              style={{ ...styles.navBtn, color: t.textPrimary }}
              onClick={() => navigate("/dashboard")}
            >
              Dashboard
            </button>

            {/* Sign Out  */}
            {user && (
              <button
                style={{ ...styles.signInBtn }}
                onClick={() => logout()}
              >
                Sign Out
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
        </div>
      </nav>

      <main style={{ ...styles.pageWrapper, background: t.pageBg }}>

        {/* Hero */}
        <section style={styles.heroSection}>
          <div style={styles.heroContent}>
            <h2 style={{ ...styles.heroTitle, color: t.textPrimary }}>
              Transform Your Sales Data Into Actionable Insights
            </h2>
            <p style={{ ...styles.heroDescription, color: t.textSecondary }}>
              A modern platform that brings all your sales metrics together in one place.
              Make data-driven decisions faster and close more deals with real-time visibility into your pipeline.
            </p>
            <div style={styles.heroButtons}>
              {user ? (
                <button
                  style={styles.primaryButton}
                  onClick={() => navigate("/dashboard")}
                >
                  Go to Dashboard
                </button>
              ) : (
                <button
                  style={styles.primaryButton}
                  onClick={openLoginModel}
                >
                  Sign In to Get Started
                </button>
              )}
            </div>
          </div>
        </section>

        {/* Problems */}
        <section style={{ ...styles.section, background: t.cardBg }}>
          <div style={styles.sectionInner}>
            <h2 style={{ ...styles.sectionTitle, color: t.textPrimary }}>
              The Challenge Sales Teams Face
            </h2>
            <p style={{ ...styles.sectionSubtitle, color: t.textSecondary }}>
              Most teams struggle with fragmented data across multiple systems, manual reporting, and delayed insights.
            </p>
            <div style={styles.problemsGrid}>
              {PROBLEMS.map((problem, idx) => (
                <div key={idx} style={{ ...styles.problemCard, background: t.pageBg, border: `1px solid ${t.border}` }}>
                  <h3 style={{ ...styles.problemTitle, color: t.textPrimary }}>{problem.title}</h3>
                  <p style={{ ...styles.problemText, color: t.textSecondary }}>{problem.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Solution */}
        <section style={styles.section}>
          <div style={styles.sectionInner}>
            <h2 style={{ ...styles.sectionTitle, color: t.textPrimary }}>
              One Platform, Complete Visibility
            </h2>
            <p style={{ ...styles.sectionSubtitle, color: t.textSecondary }}>
              Get everything you need to manage sales performance in a single, intuitive dashboard.
            </p>
            <div style={{ ...styles.solutionBox, background: t.cardBg, border: `1px solid ${t.border}` }}>
              <div style={{ ...styles.solutionPreview, background: t.pageBg }}>
                <h3 style={{ color: t.textPrimary, marginTop: 0, fontSize: "16px" }}>Dashboard Includes:</h3>
                <ul style={styles.featureList}>
                  <li style={{ color: t.textSecondary }}>Real-time KPIs and performance metrics</li>
                  <li style={{ color: t.textSecondary }}>Revenue trends and forecasting</li>
                  <li style={{ color: t.textSecondary }}>Complete customer and transaction history</li>
                  <li style={{ color: t.textSecondary }}>Customizable reports and data exports</li>
                  <li style={{ color: t.textSecondary }}>Role-based access for your entire team</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section style={{ ...styles.section, background: t.cardBg }}>
          <div style={styles.sectionInner}>
            <h2 style={{ ...styles.sectionTitle, color: t.textPrimary }}>
              Simple, Transparent Pricing
            </h2>
            <p style={{ ...styles.sectionSubtitle, color: t.textSecondary }}>
              Start free, upgrade when you're ready. No credit card required.
            </p>
            <div style={styles.pricingGrid}>
              {PRICING.map((plan, idx) => (
                <div
                  key={idx}
                  style={{
                    ...styles.pricingCard,
                    background: plan.highlighted ? t.accent : t.pageBg,
                    border:     plan.highlighted ? "none" : `1px solid ${t.border}`,
                  }}
                >
                  {plan.highlighted && (
                    <div style={styles.popularLabel}>Most Popular</div>
                  )}
                  <h3 style={{ ...styles.pricingName, color: plan.highlighted ? "#fff" : t.textPrimary }}>
                    {plan.name}
                  </h3>
                  <div style={{ ...styles.pricingPrice, color: plan.highlighted ? "#fff" : t.textPrimary }}>
                    {plan.price}
                  </div>
                  <p style={{ ...styles.pricingFor, color: plan.highlighted ? "rgba(255,255,255,0.9)" : t.textSecondary }}>
                    {plan.description}
                  </p>
                  <button
                    style={{
                      ...styles.pricingButton,
                      background: plan.highlighted ? "#fff" : t.accent,
                      color:      plan.highlighted ? t.accent : "#fff",
                    }}
                    onClick={user ? () => navigate("/dashboard") : openLoginModel}
                  >
                    {user ? "Go to Dashboard" : "Get Started"}
                  </button>
                  <ul style={styles.pricingFeatures}>
                    {plan.features.map((feature, fidx) => (
                      <li
                        key={fidx}
                        style={{
                          ...styles.pricingFeature,
                          color: feature.included
                            ? (plan.highlighted ? "rgba(255,255,255,0.9)" : t.textSecondary)
                            : (plan.highlighted ? "rgba(255,255,255,0.4)" : "#ccc"),
                        }}
                      >
                        <span style={styles.featureCheck}>{feature.included ? "✓" : "-"}</span>
                        {feature.name}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section style={styles.section}>
          <div style={styles.finalCTABox}>
            <h2 style={{ ...styles.finalCTATitle, color: t.textPrimary }}>
              Ready to transform your sales analytics?
            </h2>
            <p style={{ ...styles.finalCTAText, color: t.textSecondary }}>
              Start making data-driven decisions today. Get instant access to real-time insights and performance metrics.
            </p>
            <div style={styles.finalCTAButtons}>
              {user ? (
                <button style={styles.primaryButton} onClick={() => navigate("/dashboard")}>
                  Go to Dashboard
                </button>
              ) : (
                <button style={styles.primaryButton} onClick={openLoginModel}>
                  Sign In to Get Started
                </button>
              )}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer style={{ ...styles.footer, background: t.cardBg, borderTop: `1px solid ${t.border}` }}>
          <div style={styles.sectionInner}>
            <p style={{ ...styles.footerText, color: t.textSecondary }}>
              © 2026 Sales Analytics. All rights reserved.
            </p>
          </div>
        </footer>

      </main>
      {showLoginModel && <LoginModel />}
    </div>
  );
}

// DATA
const PROBLEMS = [
  {
    title:       "Scattered Data",
    description: "Sales data lives in multiple systems-CRM, spreadsheets, email. Finding what you need takes hours instead of seconds.",
  },
  {
    title:       "Manual Reporting",
    description: "Your team spends hours every week compiling spreadsheets and creating reports instead of selling.",
  },
  {
    title:       "Delayed Insights",
    description: "By the time you spot a trend, the opportunity is gone. You need real-time visibility, not last week's numbers.",
  },
];

const PRICING = [
  {
    name:        "Growth",
    price:       "€29/mo",
    description: "Perfect for small teams",
    highlighted: false,
    features: [
      { name: "Sales analytics dashboard",     included: true  },
      { name: "Custom Dashboard",              included: true  },
      { name: "Data export (CSV, PDF)",        included: true  },
      { name: "Automated alerts",              included: true  },
      { name: "Performance reports - Monthly", included: true  },
    ],
  },
  {
    name:        "Pro",
    price:       "€75/mo",
    description: "For growing sales organizations",
    highlighted: true,
    features: [
      { name: "Sales analytics dashboard",     included: true  },
      { name: "Custom Dashboard",              included: true  },
      { name: "Data export (CSV, PDF)",        included: true  },
      { name: "Automated alerts",              included: true  },
      { name: "Performance reports - Custom",  included: true  },
    ],
  },
  {
    name:        "Enterprise",
    price:       "Custom",
    description: "For large organizations",
    highlighted: false,
    features: [
      { name: "Sales analytics dashboard",     included: true  },
      { name: "Custom Dashboard",              included: true  },
      { name: "Data export (CSV, PDF)",        included: true  },
      { name: "Automated alerts",              included: true  },
      { name: "Performance reports - Custom",  included: true  },
    ],
  },
];

// THEME
const light = {
  textPrimary:   "#1a2a6c",
  textSecondary: "#555",
  cardBg:        "#ffffff",
  border:        "#e0e4ef",
  pageBg:        "#f0f2f7",
  accent:        "#1a2a6c",
  toggleBg:      "#e0e4ef",
};

const dark = {
  textPrimary:   "#e2e8f0",
  textSecondary: "#94a3b8",
  cardBg:        "#1e293b",
  border:        "#334155",
  pageBg:        "#0f172a",
  accent:        "#1a2a6c",
  toggleBg:      "#334155",
};

// STYLING
const styles = {
  container: {
    minHeight:  "100vh",
    fontFamily: "Arial, sans-serif",
  },
  topNav: {
    position:  "sticky",
    top:       0,
    zIndex:    100,
    padding:   "0 40px",
    height:    "60px",
    display:   "flex",
    alignItems:"center",
  },
  navContent: {
    display:        "flex",
    justifyContent: "space-between",
    alignItems:     "center",
    width:          "100%",
    maxWidth:       "1200px",
    margin:         "0 auto",
  },
  logo: {
    margin:     0,
    fontSize:   "20px",
    fontWeight: "700",
  },
  navButtons: {
    display:    "flex",
    alignItems: "center",
    gap:        "12px",
  },
  navBtn: {
    background: "transparent",
    border:     "none",
    fontSize:   "14px",
    fontWeight: "500",
    cursor:     "pointer",
    padding:    "6px 12px",
  },
  signInBtn: {
    padding:      "8px 20px",
    background:   "#1a2a6c",
    color:        "#fff",
    border:       "none",
    borderRadius: "6px",
    fontSize:     "14px",
    fontWeight:   "600",
    cursor:       "pointer",
  },
  userRow: {
    display:    "flex",
    alignItems: "center",
    gap:        "10px",
  },
  userLabel: {
    fontSize:   "13px",
    fontWeight: "500",
  },
  themeBtn: {
    padding:      "7px 16px",
    borderRadius: "6px",
    border:       "none",
    fontSize:     "13px",
    fontWeight:   "500",
    cursor:       "pointer",
  },
  pageWrapper: {
    minHeight: "calc(100vh - 60px)",
  },
  heroSection: {
    padding:    "80px 40px",
    maxWidth:   "1200px",
    margin:     "0 auto",
    textAlign:  "center",
  },
  heroContent: {
    maxWidth: "700px",
    margin:   "0 auto",
  },
  heroTitle: {
    fontSize:     "36px",
    fontWeight:   "700",
    marginBottom: "16px",
    lineHeight:   1.3,
  },
  heroDescription: {
    fontSize:     "16px",
    lineHeight:   1.7,
    marginBottom: "32px",
  },
  heroButtons: {
    display:        "flex",
    justifyContent: "center",
    gap:            "12px",
  },
  primaryButton: {
    padding:      "12px 28px",
    background:   "#1a2a6c",
    color:        "#fff",
    border:       "none",
    borderRadius: "8px",
    fontSize:     "15px",
    fontWeight:   "600",
    cursor:       "pointer",
  },
  section: {
    padding: "60px 40px",
  },
  sectionInner: {
    maxWidth: "1200px",
    margin:   "0 auto",
  },
  sectionTitle: {
    fontSize:     "28px",
    fontWeight:   "700",
    textAlign:    "center",
    marginBottom: "12px",
  },
  sectionSubtitle: {
    fontSize:     "15px",
    textAlign:    "center",
    marginBottom: "40px",
    lineHeight:   1.6,
  },
  problemsGrid: {
    display:             "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap:                 "20px",
  },
  problemCard: {
    padding:      "24px",
    borderRadius: "10px",
  },
  problemTitle: {
    fontSize:     "16px",
    fontWeight:   "600",
    marginBottom: "8px",
  },
  problemText: {
    fontSize:   "14px",
    lineHeight: 1.6,
    margin:     0,
  },
  solutionBox: {
    borderRadius: "10px",
    padding:      "28px",
  },
  solutionPreview: {
    padding:      "20px",
    borderRadius: "8px",
  },
  featureList: {
    paddingLeft: "20px",
    lineHeight:  1.9,
    fontSize:    "14px",
  },
  pricingGrid: {
    display:             "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap:                 "20px",
  },
  pricingCard: {
    padding:      "28px 24px",
    borderRadius: "10px",
    position:     "relative",
  },
  popularLabel: {
    position:     "absolute",
    top:          "-12px",
    left:         "50%",
    transform:    "translateX(-50%)",
    background:   "#c2650a",
    color:        "#fff",
    fontSize:     "11px",
    fontWeight:   "700",
    padding:      "4px 14px",
    borderRadius: "20px",
    whiteSpace:   "nowrap",
  },
  pricingName: {
    fontSize:     "18px",
    fontWeight:   "700",
    marginBottom: "8px",
    marginTop:    "8px",
  },
  pricingPrice: {
    fontSize:     "32px",
    fontWeight:   "700",
    marginBottom: "4px",
  },
  pricingFor: {
    fontSize:     "13px",
    marginBottom: "20px",
  },
  pricingButton: {
    width:        "100%",
    padding:      "10px",
    borderRadius: "6px",
    border:       "none",
    fontSize:     "14px",
    fontWeight:   "600",
    cursor:       "pointer",
    marginBottom: "20px",
  },
  pricingFeatures: {
    listStyle:  "none",
    padding:    0,
    margin:     0,
  },
  pricingFeature: {
    fontSize:     "13px",
    marginBottom: "8px",
    display:      "flex",
    alignItems:   "center",
    gap:          "8px",
  },
  featureCheck: {
    fontWeight: "700",
    fontSize:   "14px",
  },
  finalCTABox: {
    maxWidth:  "600px",
    margin:    "0 auto",
    textAlign: "center",
  },
  finalCTATitle: {
    fontSize:     "28px",
    fontWeight:   "700",
    marginBottom: "12px",
  },
  finalCTAText: {
    fontSize:     "15px",
    lineHeight:   1.6,
    marginBottom: "28px",
  },
  finalCTAButtons: {
    display:        "flex",
    justifyContent: "center",
  },
  footer: {
    padding: "24px 40px",
  },
  footerText: {
    textAlign: "center",
    fontSize:  "13px",
    margin:    0,
  },
};

export default AboutUs;
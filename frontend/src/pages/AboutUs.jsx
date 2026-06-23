import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

function AboutUs() {
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();
  const t = isDark ? dark : light;

  return (
    <div style={styles.container}>
      
      <nav style={{ ...styles.topNav, background: t.cardBg, borderBottom: `1px solid ${t.border}` }}>
        <div style={styles.navContent}>
          <h1 style={{ ...styles.logo, color: t.textPrimary }}>Sales Analytics</h1>
          <div style={styles.navButtons}>
            <button 
              style={{ ...styles.navBtn, color: t.textPrimary }} 
              onClick={() => navigate('/dashboard')}
            >
              Dashboard
            </button>
            <button 
              style={{ ...styles.themeBtn, background: t.toggleBg, color: t.textPrimary }} 
              onClick={toggleTheme}
            >
              {isDark ? "Light" : "Dark"}
            </button>
          </div>
        </div>
      </nav>

      <div style={{ ...styles.pageWrapper, background: t.pageBg }}>
        
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
              <button 
                style={styles.primaryButton} 
                onClick={() => navigate('/dashboard')}
              >
                Get Started Free
              </button>
            </div>
          </div>
        </section>

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
                  <h3 style={{ ...styles.problemTitle, color: t.textPrimary }}>
                    {problem.title}
                  </h3>
                  <p style={{ ...styles.problemText, color: t.textSecondary }}>
                    {problem.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

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
                <h4 style={{ color: t.textPrimary, marginTop: 0 }}>Dashboard Includes:</h4>
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
                    border: plan.highlighted ? "none" : `1px solid ${t.border}`,
                  }}
                >
                  {plan.highlighted && (
                    <div style={styles.popularLabel}>Most Popular</div>
                  )}
                  
                  <h3 style={{ 
                    ...styles.pricingName, 
                    color: plan.highlighted ? "#fff" : t.textPrimary 
                  }}>
                    {plan.name}
                  </h3>
                  
                  <div style={{ 
                    ...styles.pricingPrice, 
                    color: plan.highlighted ? "#fff" : t.textPrimary 
                  }}>
                    {plan.price}
                  </div>
                  
                  <p style={{ 
                    ...styles.pricingFor, 
                    color: plan.highlighted ? "rgba(255,255,255,0.9)" : t.textSecondary 
                  }}>
                    {plan.description}
                  </p>
                  
                  <button 
                    style={{ 
                      ...styles.pricingButton, 
                      background: plan.highlighted ? "#fff" : t.accent,
                      color: plan.highlighted ? t.accent : "#fff",
                    }}
                    onClick={() => navigate('/dashboard')}
                  >
                    Get Started
                  </button>

                  <ul style={styles.pricingFeatures}>
                    {plan.features.map((feature, fidx) => (
                      <li 
                        key={fidx} 
                        style={{
                          ...styles.pricingFeature,
                          color: feature.included 
                            ? (plan.highlighted ? "rgba(255,255,255,0.9)" : t.textSecondary)
                            : (plan.highlighted ? "rgba(255,255,255,0.4)" : "#ccc")
                        }}
                      >
                        <span style={styles.featureCheck}>
                          {feature.included ? "✓" : "—"}
                        </span>
                        {feature.name}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section style={styles.section}>
          <div style={styles.finalCTABox}>
            <h2 style={{ ...styles.finalCTATitle, color: t.textPrimary }}>
              Ready to transform your sales analytics?
            </h2>
            <p style={{ ...styles.finalCTAText, color: t.textSecondary }}>
              Start making data-driven decisions today. Get instant access to real-time insights and performance metrics.
            </p>
            <div style={styles.finalCTAButtons}>
              <button 
                style={styles.primaryButton} 
                onClick={() => navigate('/dashboard')}
              >
                Start Free Trial
              </button>
            </div>
          </div>
        </section>

        <footer style={{ ...styles.footer, background: t.cardBg, borderTop: `1px solid ${t.border}` }}>
          <div style={styles.sectionInner}>
            <p style={{ ...styles.footerText, color: t.textSecondary }}>
              © 2026 Sales Analytics. All rights reserved.
            </p>
          </div>
        </footer>

      </div>
    </div>
  );
}

// DATA
const PROBLEMS = [
  {
    title: "Scattered Data",
    description: "Sales data lives in multiple systems—CRM, spreadsheets, email. Finding what you need takes hours instead of seconds."
  },
  {
    title: "Manual Reporting",
    description: "Your team spends hours every week compiling spreadsheets and creating reports instead of selling."
  },
  {
    title: "Delayed Insights",
    description: "By the time you spot a trend, the opportunity is gone. You need real-time visibility, not last week's numbers."
  }
];

const PRICING = [
  { 
    name: "Growth", 
    price: "€29/mo", 
    description: "Perfect for small teams",
    highlighted: false,
    features: [
      { name: "Sales analytics dashboard", included: true },
      { name: "Custom Dashboard (themes/colors)", included: true },
      { name: "Data export (CSV, PDF)", included: true },
      { name: "Automated alerts", included: true },
      { name: "Performance reports - Monthly", included: true },
    ]
  },
  { 
    name: "Pro", 
    price: "€75/mo", 
    description: "For growing sales organizations",
    highlighted: true,
    features: [
      { name: "Sales analytics dashboard", included: true },
      { name: "Custom Dashboard (themes/colors)", included: true },
      { name: "Data export (CSV, PDF)", included: true },
      { name: "Automated alerts", included: true },
      { name: "Performance reports - Custom", included: true },
    ]
  },
  { 
    name: "Enterprise", 
    price: "Custom", 
    description: "For large organizations",
    highlighted: false,
    features: [
      { name: "Sales analytics dashboard", included: true },
      { name: "Custom Dashboard (themes/colors)", included: true },
      { name: "Data export (CSV, PDF)", included: true },
      { name: "Automated alerts", included: true },
      { name: "Performance reports - Custom", included: true },
    ]
  }
];

const light = {
  textPrimary: "#1a2a6c",
  textSecondary: "#555",
  cardBg: "#ffffff",
  pageBg: "#f0f2f7",
  border: "#e0e4ef",
  accent: "#1a2a6c",
  toggleBg: "#f0f2f7",
};

const dark = {
  textPrimary: "#e2e8f0",
  textSecondary: "#94a3b8",
  cardBg: "#1e293b",
  pageBg: "#0f172a",
  border: "#334155",
  accent: "#7c9fff",
  toggleBg: "#334155",
};

const styles = {
  container: {
    width: "100%",
    minHeight: "100vh",
  },

  topNav: {
    position: "sticky",
    top: 0,
    zIndex: 100,
    padding: "16px 24px",
  },
  navContent: {
    maxWidth: "1200px",
    margin: "0 auto",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logo: {
    fontSize: "18px",
    fontWeight: "700",
    margin: 0,
  },
  navButtons: {
    display: "flex",
    gap: "12px",
    alignItems: "center",
  },
  navBtn: {
    background: "transparent",
    border: "none",
    fontSize: "14px",
    fontWeight: "500",
    cursor: "pointer",
    padding: "8px 16px",
  },
  themeBtn: {
    padding: "6px 14px",
    borderRadius: "20px",
    border: "none",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: "600",
  },

  pageWrapper: {
    width: "100%",
    minHeight: "100vh",
  },

  section: {
    padding: "60px 24px",
  },
  sectionInner: {
    maxWidth: "1200px",
    margin: "0 auto",
  },
  sectionTitle: {
    fontSize: "32px",
    fontWeight: "700",
    textAlign: "center",
    margin: "0 0 12px 0",
  },
  sectionSubtitle: {
    fontSize: "16px",
    textAlign: "center",
    margin: "0 0 40px 0",
    lineHeight: "1.6",
  },

  heroSection: {
    padding: "80px 24px 60px",
    textAlign: "center",
  },
  heroContent: {
    maxWidth: "900px",
    margin: "0 auto",
  },
  heroTitle: {
    fontSize: "48px",
    fontWeight: "700",
    margin: "0 0 24px 0",
    lineHeight: "1.2",
  },
  heroDescription: {
    fontSize: "18px",
    lineHeight: "1.6",
    margin: "0 0 32px 0",
  },
  heroButtons: {
    display: "flex",
    gap: "16px",
    justifyContent: "center",
    flexWrap: "wrap",
  },

  primaryButton: {
    padding: "14px 32px",
    background: "#1a2a6c",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "15px",
    fontWeight: "600",
    cursor: "pointer",
  },
  secondaryButton: {
    padding: "14px 32px",
    background: "transparent",
    borderRadius: "8px",
    fontSize: "15px",
    fontWeight: "600",
    cursor: "pointer",
  },

  problemsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "24px",
  },
  problemCard: {
    padding: "28px",
    borderRadius: "8px",
  },
  problemTitle: {
    fontSize: "18px",
    fontWeight: "600",
    margin: "0 0 12px 0",
  },
  problemText: {
    fontSize: "14px",
    lineHeight: "1.6",
    margin: 0,
  },

  solutionBox: {
    padding: "40px",
    borderRadius: "8px",
    maxWidth: "800px",
    margin: "0 auto",
  },
  solutionPreview: {
    padding: "32px",
    borderRadius: "6px",
  },
  featureList: {
    listStyle: "none",
    padding: 0,
    margin: "0",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "12px",
    fontSize: "14px",
    lineHeight: "1.8",
  },

  pricingGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "24px",
    maxWidth: "1200px",
    margin: "0 auto",
  },
  pricingCard: {
    padding: "32px 24px",
    borderRadius: "8px",
    textAlign: "center",
    position: "relative",
  },
  popularLabel: {
    position: "absolute",
    top: "-12px",
    left: "50%",
    transform: "translateX(-50%)",
    background: "#16a34a",
    color: "#fff",
    padding: "4px 16px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "600",
  },
  pricingName: {
    fontSize: "18px",
    fontWeight: "700",
    margin: "0 0 12px 0",
  },
  pricingPrice: {
    fontSize: "32px",
    fontWeight: "700",
    margin: "0 0 8px 0",
  },
  pricingFor: {
    fontSize: "14px",
    margin: "0 0 24px 0",
  },
  pricingButton: {
    padding: "10px 24px",
    border: "none",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    width: "100%",
    marginBottom: "20px",
  },
  pricingFeatures: {
    listStyle: "none",
    padding: "20px 0 0 0",
    margin: "0",
    borderTop: "1px solid rgba(0,0,0,0.1)",
    textAlign: "left",
  },
  pricingFeature: {
    fontSize: "13px",
    padding: "10px 0",
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  featureCheck: {
    color: "#16a34a",
    fontWeight: "bold",
  },

  finalCTABox: {
    background: "transparent",
    textAlign: "center",
    padding: "0",
  },
  finalCTATitle: {
    fontSize: "36px",
    fontWeight: "700",
    margin: "0 0 16px 0",
  },
  finalCTAText: {
    fontSize: "16px",
    lineHeight: "1.6",
    margin: "0 0 32px 0",
  },
  finalCTAButtons: {
    display: "flex",
    gap: "16px",
    justifyContent: "center",
    flexWrap: "wrap",
  },

  footer: {
    padding: "32px 24px",
    textAlign: "center",
  },
  footerText: {
    fontSize: "14px",
    margin: 0,
  },
};

export default AboutUs;
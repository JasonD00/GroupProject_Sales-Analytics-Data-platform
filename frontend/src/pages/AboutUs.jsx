import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

function AboutUs() {
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();
  const t = isDark ? dark : light;

  const handleNavToDashboard = () => {
    console.log("Navigating to dashboard"); 
    navigate('/dashboard');
  };

  return (
    <div style={styles.scrollContainer}>
      
      {/* TOP NAVIGATION BAR */}
      <div style={{ ...styles.topNav, background: t.cardBg, borderBottom: `1px solid ${t.border}` }}>
        <div style={styles.topNavContent}>
          <h2 style={{ ...styles.logo, color: t.textPrimary }}>Sales Analytics</h2>
          <div style={styles.topNavRight}>
            <button 
              style={{ ...styles.navBtn, color: t.textPrimary }} 
              onClick={handleNavToDashboard}
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
      </div>

      <div style={styles.wrapper}>
        
        {/* HERO SECTION */}
        <section style={{ ...styles.hero, background: t.pageBg }}>
          <div style={styles.heroContent}>
            <div style={styles.heroIcon}>📊</div>
            <h1 style={{ ...styles.heroTitle, color: t.textPrimary }}>
              Transform Your Sales Data Into Actionable Insights
            </h1>
            <p style={{ ...styles.heroSubtitle, color: t.textSecondary }}>
              Stop drowning in spreadsheets. Start making data-driven decisions with our 
              comprehensive sales analytics platform that brings all your data together in one place.
            </p>
            <div style={styles.heroCTAs}>
              <button style={styles.primaryCTA} onClick={handleNavToDashboard}>
                Get Started Free
              </button>
              <button style={{ ...styles.secondaryCTA, border: `2px solid ${t.border}`, color: t.textPrimary }}>
                View Demo
              </button>
            </div>
          </div>
        </section>

        {/* PROBLEM SECTION */}
        <section style={styles.section}>
          <h2 style={{ ...styles.sectionTitle, color: t.textPrimary }}>
            The Challenge Sales Teams Face
          </h2>
          <div style={styles.cardGrid}>
            {PROBLEMS.map((problem, index) => (
              <div key={index} style={{ ...styles.card, background: t.cardBg, border: `1px solid ${t.border}` }}>
                <div style={styles.cardIcon}>{problem.icon}</div>
                <h3 style={{ ...styles.cardTitle, color: t.textPrimary }}>{problem.title}</h3>
                <p style={{ ...styles.cardText, color: t.textSecondary }}>{problem.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* SOLUTION SECTION */}
        <section style={{ ...styles.section, background: t.solutionBg }}>
          <h2 style={{ ...styles.sectionTitle, color: t.textPrimary }}>
            One Platform, Complete Visibility
          </h2>
          <div style={{ ...styles.screenshotBox, background: t.cardBg, border: `1px solid ${t.border}` }}>
            <div style={{ ...styles.screenshotPlaceholder, background: t.pageBg }}>
              <p style={{ color: t.textMuted }}>Dashboard Preview Screenshot</p>
              <ul style={{ ...styles.screenshotList, color: t.textSecondary }}>
                <li>✓ Real-time KPIs and performance metrics</li>
                <li>✓ Revenue trends and forecasting</li>
                <li>✓ Complete transaction history</li>
                <li>✓ Customizable reports and exports</li>
              </ul>
            </div>
          </div>
        </section>

        {/* FEATURES SECTION */}
        <section style={styles.section}>
          <h2 style={{ ...styles.sectionTitle, color: t.textPrimary }}>
            Everything You Need To Succeed
          </h2>
          <div style={styles.featuresGrid}>
            {FEATURES.map((feature, index) => (
              <div key={index} style={{ ...styles.featureCard, background: t.cardBg, border: `1px solid ${t.border}` }}>
                <div style={styles.featureIcon}>{feature.icon}</div>
                <h3 style={{ ...styles.featureTitle, color: t.textPrimary }}>{feature.title}</h3>
                <p style={{ ...styles.featureText, color: t.textSecondary }}>{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* HOW IT WORKS SECTION */}
        <section style={{ ...styles.section, background: t.solutionBg }}>
          <h2 style={{ ...styles.sectionTitle, color: t.textPrimary }}>
            Simple Setup, Powerful Results
          </h2>
          <div style={styles.stepsContainer}>
            {STEPS.map((step, index) => (
              <div key={index} style={styles.step}>
                <div style={{ ...styles.stepNumber, background: t.accent, color: "#fff" }}>
                  {index + 1}
                </div>
                <h3 style={{ ...styles.stepTitle, color: t.textPrimary }}>{step.title}</h3>
                <p style={{ ...styles.stepText, color: t.textSecondary }}>{step.description}</p>
                {index < STEPS.length - 1 && <div style={{ ...styles.stepArrow, color: t.textMuted }}>→</div>}
              </div>
            ))}
          </div>
        </section>

        {/* WHO IT'S FOR SECTION */}
        <section style={styles.section}>
          <h2 style={{ ...styles.sectionTitle, color: t.textPrimary }}>
            Built For Every Role On Your Team
          </h2>
          <div style={styles.cardGrid}>
            {PERSONAS.map((persona, index) => (
              <div key={index} style={{ ...styles.card, background: t.cardBg, border: `1px solid ${t.border}` }}>
                <div style={styles.cardIcon}>{persona.icon}</div>
                <h3 style={{ ...styles.cardTitle, color: t.textPrimary }}>{persona.title}</h3>
                <p style={{ ...styles.cardText, color: t.textSecondary }}>{persona.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* STATS SECTION */}
        <section style={{ ...styles.statsSection, background: t.accent }}>
          <h2 style={{ ...styles.sectionTitle, color: "#fff" }}>
            Trusted By Sales Teams Worldwide
          </h2>
          <div style={styles.statsGrid}>
            {STATS.map((stat, index) => (
              <div key={index} style={styles.stat}>
                <div style={styles.statNumber}>{stat.number}</div>
                <div style={styles.statLabel}>{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* PRICING PREVIEW */}
        <section style={styles.section}>
          <h2 style={{ ...styles.sectionTitle, color: t.textPrimary }}>
            Choose The Right Plan For You
          </h2>
          <p style={{ ...styles.pricingSubtitle, color: t.textSecondary }}>
            Start with our free trial, upgrade when you're ready
          </p>
          <div style={styles.pricingGrid}>
            {PRICING_PREVIEW.map((plan, index) => (
              <div 
                key={index} 
                style={{ 
                  ...styles.pricingCard, 
                  background: plan.popular ? t.accent : t.cardBg,
                  border: plan.popular ? "none" : `1px solid ${t.border}`,
                }}
              >
                {plan.popular && <div style={styles.popularBadge}>Most Popular</div>}
                <h3 style={{ ...styles.pricingName, color: plan.popular ? "#fff" : t.textPrimary }}>
                  {plan.name}
                </h3>
                <div style={{ ...styles.pricingPrice, color: plan.popular ? "#fff" : t.textPrimary }}>
                  {plan.price}
                </div>
                <p style={{ ...styles.pricingFor, color: plan.popular ? "rgba(255,255,255,0.9)" : t.textSecondary }}>
                  {plan.for}
                </p>
                <button 
                  style={{ 
                    ...styles.pricingCTA, 
                    background: plan.popular ? "#fff" : t.accent,
                    color: plan.popular ? t.accent : "#fff",
                  }}
                  onClick={handleNavToDashboard}
                >
                  See Details
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* FINAL CTA */}
        <section style={{ ...styles.finalCTA, background: t.pageBg }}>
          <h2 style={{ ...styles.finalCTATitle, color: t.textPrimary }}>
            Ready To Transform Your Sales Analytics?
          </h2>
          <p style={{ ...styles.finalCTAText, color: t.textSecondary }}>
            Start making data-driven decisions today. No credit card required. Cancel anytime.
          </p>
          <div style={styles.finalCTAButtons}>
            <button style={styles.primaryCTA} onClick={handleNavToDashboard}>
              Start Free Trial
            </button>
            <p style={{ ...styles.finalCTAOr, color: t.textMuted }}>or</p>
            <button style={{ ...styles.secondaryCTA, border: `2px solid ${t.border}`, color: t.textPrimary }}>
              Schedule a Demo
            </button>
          </div>
        </section>

      </div>
    </div>
  );
}

// DATA
const PROBLEMS = [
  {
    icon: "📊",
    title: "Scattered Data",
    description: "Sales data lives in multiple systems—CRM, spreadsheets, email. Finding what you need takes hours instead of seconds."
  },
  {
    icon: "⏰",
    title: "Manual Reporting",
    description: "Your team spends hours every week compiling spreadsheets and creating reports instead of selling."
  },
  {
    icon: "📈",
    title: "Delayed Insights",
    description: "By the time you spot a trend, the opportunity is gone. You need real-time visibility, not last week's numbers."
  }
];

const FEATURES = [
  {
    icon: "⚡",
    title: "Real-Time Analytics",
    description: "Live KPIs and dashboards that update instantly as your data changes. No more stale reports."
  },
  {
    icon: "🔮",
    title: "Advanced Forecasting",
    description: "Predict trends with AI-powered insights. See what's coming before it happens."
  },
  {
    icon: "👥",
    title: "Role-Based Access",
    description: "Different views for Admins, Sales Reps, and Managers. Everyone sees what they need."
  },
  {
    icon: "📝",
    title: "Custom Reports",
    description: "Build your own reports with drag-and-drop. No technical skills required."
  },
  {
    icon: "📤",
    title: "Multiple Exports",
    description: "CSV, Excel, PDF exports with one click. Share insights with anyone, anywhere."
  },
  {
    icon: "🔔",
    title: "Automated Alerts",
    description: "Get notified of critical changes instantly. Never miss an important trend."
  }
];

const STEPS = [
  {
    title: "Connect Your Data",
    description: "Link your existing systems or upload files. We support all major CRMs and formats."
  },
  {
    title: "Import Historical Data",
    description: "Upload CSV files or connect via API. Bring in months or years of data instantly."
  },
  {
    title: "Analyze In Real Time",
    description: "Dashboard updates instantly as new data arrives. No refresh needed."
  },
  {
    title: "Make Decisions",
    description: "Act on insights immediately. Export reports, share dashboards, close more deals."
  }
];

const PERSONAS = [
  {
    icon: "💼",
    title: "Sales Teams",
    description: "Track your personal performance, see your pipeline, and close deals faster with real-time insights."
  },
  {
    icon: "👔",
    title: "Sales Managers",
    description: "Monitor team performance, identify coaching opportunities, and spot trends before they become problems."
  },
  {
    icon: "📊",
    title: "Analysts",
    description: "Dive deep into data trends, build custom reports, and provide strategic insights to leadership."
  }
];

const STATS = [
  { number: "500+", label: "Companies" },
  { number: "40%", label: "Faster Reporting" },
  { number: "24hrs", label: "Saved Per Week" }
];

const PRICING_PREVIEW = [
  { name: "Growth", price: "€29", for: "For small teams", popular: false },
  { name: "Pro", price: "€75", for: "For growing teams", popular: true },
  { name: "Enterprise", price: "€115", for: "For large organizations", popular: false }
];

// THEME - Matching Dashboard Colors
const light = {
  textPrimary: "#1a2a6c",
  textSecondary: "#555",
  textMuted: "#888",
  cardBg: "#ffffff",
  pageBg: "#f0f2f7",
  solutionBg: "#f8f9fc",
  border: "#e0e4ef",
  accent: "#1a2a6c",
  toggleBg: "#f0f2f7",
};

const dark = {
  textPrimary: "#e2e8f0",
  textSecondary: "#94a3b8",
  textMuted: "#64748b",
  cardBg: "#1e293b",
  pageBg: "#0f172a",
  solutionBg: "#1e293b",
  border: "#334155",
  accent: "#7c9fff",
  toggleBg: "#334155",
};

// STYLES
const styles = {
  scrollContainer: {
    height: "100vh",
    width: "100vw",
    overflowY: "auto",
    overflowX: "hidden",
  },
  wrapper: {
    width: "100%",
    minHeight: "100%",
  },

  // Top Nav
  topNav: {
    position: "sticky",
    top: 0,
    zIndex: 100,
    padding: "16px 24px",
  },
  topNavContent: {
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
  topNavRight: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  navBtn: {
    background: "transparent",
    border: "none",
    fontSize: "15px",
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
  
  // Hero
  hero: {
    padding: "80px 24px",
    textAlign: "center",
  },
  heroContent: {
    maxWidth: "800px",
    margin: "0 auto",
  },
  heroIcon: {
    fontSize: "64px",
    marginBottom: "24px",
  },
  heroTitle: {
    fontSize: "42px",
    fontWeight: "700",
    margin: "0 0 16px 0",
    lineHeight: "1.2",
  },
  heroSubtitle: {
    fontSize: "18px",
    lineHeight: "1.6",
    margin: "0 0 32px 0",
  },
  heroCTAs: {
    display: "flex",
    gap: "16px",
    justifyContent: "center",
    flexWrap: "wrap",
  },
  primaryCTA: {
    padding: "14px 32px",
    background: "#1a2a6c",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
  },
  secondaryCTA: {
    padding: "14px 32px",
    background: "transparent",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
  },

  // Sections
  section: {
    padding: "60px 24px",
    maxWidth: "1200px",
    margin: "0 auto",
  },
  sectionTitle: {
    fontSize: "32px",
    fontWeight: "700",
    textAlign: "center",
    margin: "0 0 48px 0",
  },

  // Cards
  cardGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "24px",
  },
  card: {
    padding: "32px",
    borderRadius: "12px",
    textAlign: "center",
  },
  cardIcon: {
    fontSize: "48px",
    marginBottom: "16px",
  },
  cardTitle: {
    fontSize: "20px",
    fontWeight: "600",
    margin: "0 0 12px 0",
  },
  cardText: {
    fontSize: "15px",
    lineHeight: "1.6",
    margin: 0,
  },

  // Screenshot
  screenshotBox: {
    padding: "40px",
    borderRadius: "12px",
    maxWidth: "900px",
    margin: "0 auto",
  },
  screenshotPlaceholder: {
    borderRadius: "8px",
    padding: "100px 40px",
    textAlign: "center",
  },
  screenshotList: {
    listStyle: "none",
    padding: 0,
    margin: "24px 0 0 0",
    fontSize: "15px",
    lineHeight: "2",
  },

  // Features
  featuresGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
    gap: "24px",
  },
  featureCard: {
    padding: "24px",
    borderRadius: "12px",
  },
  featureIcon: {
    fontSize: "40px",
    marginBottom: "12px",
  },
  featureTitle: {
    fontSize: "18px",
    fontWeight: "600",
    margin: "0 0 8px 0",
  },
  featureText: {
    fontSize: "14px",
    lineHeight: "1.6",
    margin: 0,
  },

  // Steps
  stepsContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "32px",
    maxWidth: "1000px",
    margin: "0 auto",
  },
  step: {
    textAlign: "center",
    position: "relative",
  },
  stepNumber: {
    width: "56px",
    height: "56px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "24px",
    fontWeight: "700",
    margin: "0 auto 16px",
  },
  stepTitle: {
    fontSize: "18px",
    fontWeight: "600",
    margin: "0 0 8px 0",
  },
  stepText: {
    fontSize: "14px",
    lineHeight: "1.6",
    margin: 0,
  },
  stepArrow: {
    position: "absolute",
    top: "28px",
    right: "-16px",
    fontSize: "24px",
  },

  // Stats
  statsSection: {
    padding: "60px 24px",
    textAlign: "center",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "48px",
    maxWidth: "800px",
    margin: "0 auto",
  },
  stat: {
    color: "#fff",
  },
  statNumber: {
    fontSize: "48px",
    fontWeight: "700",
    marginBottom: "8px",
  },
  statLabel: {
    fontSize: "16px",
    opacity: 0.9,
  },

  // Pricing
  pricingSubtitle: {
    textAlign: "center",
    fontSize: "16px",
    margin: "-32px 0 40px 0",
  },
  pricingGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "24px",
    maxWidth: "900px",
    margin: "0 auto",
  },
  pricingCard: {
    padding: "32px 24px",
    borderRadius: "12px",
    textAlign: "center",
    position: "relative",
  },
  popularBadge: {
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
    fontSize: "20px",
    fontWeight: "700",
    margin: "0 0 8px 0",
  },
  pricingPrice: {
    fontSize: "36px",
    fontWeight: "700",
    margin: "0 0 8px 0",
  },
  pricingFor: {
    fontSize: "14px",
    margin: "0 0 24px 0",
  },
  pricingCTA: {
    padding: "10px 24px",
    border: "none",
    borderRadius: "8px",
    fontSize: "15px",
    fontWeight: "600",
    cursor: "pointer",
    width: "100%",
  },

  // Final CTA
  finalCTA: {
    padding: "80px 24px",
    textAlign: "center",
  },
  finalCTATitle: {
    fontSize: "36px",
    fontWeight: "700",
    margin: "0 0 16px 0",
  },
  finalCTAText: {
    fontSize: "18px",
    lineHeight: "1.6",
    margin: "0 0 32px 0",
    maxWidth: "600px",
    marginLeft: "auto",
    marginRight: "auto",
  },
  finalCTAButtons: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "12px",
  },
  finalCTAOr: {
    fontSize: "14px",
    margin: 0,
  },
};

export default AboutUs;
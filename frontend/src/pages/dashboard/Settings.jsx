import { useState } from "react";
import { useTheme } from "../../context/ThemeContext";

function Settings() {
  const { isDark } = useTheme();
  const t = isDark ? dark : light;

  const [accentColor, setAccentColor] = useState("#1a2a6c");

  const ACCENT_COLORS = [
    { name: "Navy", value: "#1a2a6c" },
    { name: "Blue", value: "#2563eb" },
    { name: "Purple", value: "#7c3aed" },
    { name: "Green", value: "#059669" },
    { name: "Red", value: "#dc2626" },
    { name: "Orange", value: "#f59e0b" },
    { name: "Cyan", value: "#0891b2" },
    { name: "Pink", value: "#ec4899" },
  ];

  const handleColorChange = (color) => {
    setAccentColor(color);
    document.documentElement.style.setProperty('--accent-color', color);
    localStorage.setItem('accentColor', color);
  };

  return (
    <div style={{ ...styles.container, background: t.pageBg }}>
      
      <div style={styles.header}>
        <h2 style={{ ...styles.title, color: t.textPrimary }}>Settings</h2>
        <p style={{ ...styles.subtitle, color: t.textSecondary }}>
          Customize your dashboard colors
        </p>
      </div>

      <div style={{ ...styles.card, background: t.cardBg, border: `1px solid ${t.border}` }}>
        <h3 style={{ ...styles.cardTitle, color: t.textPrimary }}>Accent Color</h3>
        <p style={{ ...styles.description, color: t.textSecondary }}>
          Choose your preferred accent color for buttons, links, and highlights throughout the dashboard
        </p>

        <div style={styles.colorGrid}>
          {ACCENT_COLORS.map((color) => (
            <button
              key={color.value}
              onClick={() => handleColorChange(color.value)}
              style={{
                ...styles.colorOption,
                background: color.value,
                border: accentColor === color.value 
                  ? `4px solid #000` 
                  : `2px solid rgba(0,0,0,0.2)`,
                outline: "none",
                cursor: "pointer",
                transform: accentColor === color.value ? "scale(1.1)" : "scale(1)",
                transition: "all 0.2s",
              }}
              title={color.name}
            >
              {accentColor === color.value && (
                <span style={styles.checkmark}>✓</span>
              )}
            </button>
          ))}
        </div>

        <div style={styles.colorInfo}>
          <p style={{ ...styles.selectedColor, color: t.textPrimary }}>
            Selected Color: <strong style={{ color: accentColor }}>{accentColor}</strong>
          </p>
          <p style={{ ...styles.colorDesc, color: t.textSecondary }}>
            Changes apply immediately across your dashboard
          </p>
        </div>
      </div>

      <div style={{ ...styles.card, background: t.cardBg, border: `1px solid ${t.border}` }}>
        <h3 style={{ ...styles.cardTitle, color: t.textPrimary }}>Preview</h3>
        
        <div style={styles.previewGrid}>
          <div style={styles.previewItem}>
            <p style={{ ...styles.previewLabel, color: t.textSecondary }}>Primary Button</p>
            <button 
              style={{ 
                ...styles.previewButton, 
                background: accentColor,
                color: "#fff"
              }}
              disabled
            >
              Click Me
            </button>
          </div>

          <div style={styles.previewItem}>
            <p style={{ ...styles.previewLabel, color: t.textSecondary }}>Link Color</p>
            <span style={{ ...styles.previewLink, color: accentColor }}>
              This is a link
            </span>
          </div>

          <div style={styles.previewItem}>
            <p style={{ ...styles.previewLabel, color: t.textSecondary }}>Highlight</p>
            <div style={{ 
              ...styles.previewHighlight, 
              background: accentColor,
              opacity: 0.2
            }}>
              Highlighted text
            </div>
          </div>

          <div style={styles.previewItem}>
            <p style={{ ...styles.previewLabel, color: t.textSecondary }}>Badge</p>
            <span style={{ 
              ...styles.previewBadge, 
              background: accentColor,
              color: "#fff"
            }}>
              Status
            </span>
          </div>
        </div>
      </div>

      <div style={{ ...styles.infoBox, background: accentColor, color: "#fff" }}>
        <h4 style={{ margin: "0 0 8px 0" }}>Personalization</h4>
        <p style={{ margin: 0, opacity: 0.95 }}>
          Your color preference is saved automatically and will be applied across all pages and components in your dashboard.
        </p>
      </div>
    </div>
  );
}

const light = {
  pageBg: "#f0f2f7",
  cardBg: "#ffffff",
  textPrimary: "#1a2a6c",
  textSecondary: "#555",
  border: "#e0e4ef",
};

const dark = {
  pageBg: "#0f172a",
  cardBg: "#1e293b",
  textPrimary: "#e2e8f0",
  textSecondary: "#94a3b8",
  border: "#334155",
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    gap: "24px",
  },
  header: {
    marginBottom: "8px",
  },
  title: {
    fontSize: "28px",
    fontWeight: "700",
    margin: "0 0 8px 0",
  },
  subtitle: {
    fontSize: "14px",
    margin: 0,
  },
  card: {
    padding: "24px",
    borderRadius: "8px",
  },
  cardTitle: {
    fontSize: "18px",
    fontWeight: "600",
    margin: "0 0 8px 0",
  },
  description: {
    fontSize: "13px",
    margin: "0 0 20px 0",
    lineHeight: "1.5",
  },
  colorGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(80px, 1fr))",
    gap: "16px",
    marginBottom: "20px",
  },
  colorOption: {
    width: "100%",
    aspectRatio: "1",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "28px",
  },
  checkmark: {
    color: "#fff",
  },
  colorInfo: {
    paddingTop: "16px",
    borderTop: "1px solid rgba(0,0,0,0.1)",
  },
  selectedColor: {
    fontSize: "14px",
    margin: "0 0 8px 0",
  },
  colorDesc: {
    fontSize: "12px",
    margin: 0,
  },
  previewGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
    gap: "20px",
  },
  previewItem: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  previewLabel: {
    fontSize: "12px",
    fontWeight: "600",
    margin: 0,
  },
  previewButton: {
    padding: "8px 16px",
    border: "none",
    borderRadius: "6px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "not-allowed",
  },
  previewLink: {
    fontSize: "14px",
    fontWeight: "500",
    textDecoration: "underline",
  },
  previewHighlight: {
    padding: "8px 12px",
    borderRadius: "4px",
    fontSize: "14px",
  },
  previewBadge: {
    display: "inline-block",
    padding: "4px 10px",
    borderRadius: "12px",
    fontSize: "12px",
    fontWeight: "600",
  },
  infoBox: {
    padding: "16px",
    borderRadius: "8px",
  },
};

export default Settings;
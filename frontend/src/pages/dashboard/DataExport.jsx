import { useState } from "react";
import { useTheme } from "../../context/ThemeContext";

function DataExport() {
  const { isDark } = useTheme();
  const t = isDark ? dark : light;

  const [selectedData, setSelectedData] = useState("customers");
  const [selectedFormat, setSelectedFormat] = useState("csv");
  const [dateRange, setDateRange] = useState("all");
  const [isExporting, setIsExporting] = useState(false);

  const DATA_OPTIONS = [
    { id: "customers", label: "Customer Data", records: 856 },
    { id: "transactions", label: "Transactions", records: 12453 },
    { id: "sales", label: "Sales Data", records: 2341 },
    { id: "products", label: "Product Data", records: 542 },
  ];

  const FORMAT_OPTIONS = [
    { id: "csv", label: "CSV", description: "Best for spreadsheets" },
    { id: "pdf", label: "PDF", description: "Professional reports" },
    { id: "excel", label: "Excel", description: "Excel workbook format" },
    { id: "json", label: "JSON", description: "Data interchange format" },
  ];

  const DATE_RANGES = [
    { id: "all", label: "All Data" },
    { id: "this_month", label: "This Month" },
    { id: "last_month", label: "Last Month" },
    { id: "last_3_months", label: "Last 3 Months" },
    { id: "this_year", label: "This Year" },
  ];

  const generateSampleData = () => {
    const dataType = DATA_OPTIONS.find(d => d.id === selectedData);
    
    const sampleRows = [];
    
    if (selectedData === "customers") {
      sampleRows.push("ID,Name,Email,Region,Total Spend,Status");
      for (let i = 1; i <= 10; i++) {
        sampleRows.push(`CUS-00${i},Customer ${i},customer${i}@email.com,Europe,€${(Math.random() * 50000).toFixed(2)},Active`);
      }
    } else if (selectedData === "transactions") {
      sampleRows.push("ID,Date,Customer,Product,Amount,Status");
      for (let i = 1; i <= 10; i++) {
        sampleRows.push(`TRX-00${i},2024-01-${String(i).padStart(2, '0')},Customer ${i},Product ${Math.floor(Math.random() * 10)},€${(Math.random() * 5000).toFixed(2)},Completed`);
      }
    } else if (selectedData === "sales") {
      sampleRows.push("Date,Region,Sales Rep,Amount,Target,Achievement");
      for (let i = 1; i <= 10; i++) {
        sampleRows.push(`2024-01-${String(i).padStart(2, '0')},North America,Rep ${i},€${(Math.random() * 10000).toFixed(2)},€8000,${(Math.random() * 150).toFixed(0)}%`);
      }
    } else if (selectedData === "products") {
      sampleRows.push("ID,Product Name,Category,Price,Stock,Supplier");
      for (let i = 1; i <= 10; i++) {
        sampleRows.push(`PRD-00${i},Product ${i},Category ${Math.floor(Math.random() * 5)},€${(Math.random() * 500).toFixed(2)},${Math.floor(Math.random() * 100)},Supplier ${Math.floor(Math.random() * 5)}`);
      }
    }
    
    return sampleRows.join("\n");
  };

  const handleExport = () => {
    setIsExporting(true);
    
    setTimeout(() => {
      const data = DATA_OPTIONS.find(d => d.id === selectedData);
      const content = generateSampleData();
      
      let fileExtension = selectedFormat;
      if (selectedFormat === "excel") fileExtension = "xlsx";
      
      const blob = new Blob([content], { type: "text/plain" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${data.label}-${dateRange}.${fileExtension}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      setIsExporting(false);
      alert(`✓ Successfully exported ${data.label} as ${selectedFormat.toUpperCase()}`);
    }, 1000);
  };

  return (
    <div style={{ ...styles.container, background: t.pageBg }}>
      
      <div style={styles.header}>
        <h2 style={{ ...styles.title, color: t.textPrimary }}>Data Export</h2>
        <p style={{ ...styles.subtitle, color: t.textSecondary }}>
          Export your data in multiple formats for analysis or sharing
        </p>
      </div>

      <div style={{ ...styles.card, background: t.cardBg, border: `1px solid ${t.border}` }}>
        <h3 style={{ ...styles.cardTitle, color: t.textPrimary }}>Export Configuration</h3>

        <div style={styles.formGrid}>
          
          <div style={styles.formGroup}>
            <label style={{ ...styles.label, color: t.textSecondary }}>Select Data to Export</label>
            <div style={styles.radioGroup}>
              {DATA_OPTIONS.map((option) => (
                <label key={option.id} style={styles.radioLabel}>
                  <input
                    type="radio"
                    name="data"
                    value={option.id}
                    checked={selectedData === option.id}
                    onChange={(e) => setSelectedData(e.target.value)}
                    style={styles.radioInput}
                  />
                  <span style={{ color: t.textPrimary }}>
                    {option.label}
                  </span>
                  <span style={{ ...styles.recordCount, color: t.textSecondary }}>
                    ({option.records} records)
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={{ ...styles.label, color: t.textSecondary }}>Select Export Format</label>
            <div style={styles.formatGrid}>
              {FORMAT_OPTIONS.map((format) => (
                <button
                  key={format.id}
                  onClick={() => setSelectedFormat(format.id)}
                  style={{
                    ...styles.formatCard,
                    background: selectedFormat === format.id ? t.accent : t.pageBg,
                    border: selectedFormat === format.id 
                      ? `2px solid ${t.accent}`
                      : `1px solid ${t.border}`,
                    color: selectedFormat === format.id ? "#fff" : t.textPrimary,
                  }}
                >
                  <div style={styles.formatName}>{format.label}</div>
                  <div style={styles.formatDesc}>{format.description}</div>
                </button>
              ))}
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={{ ...styles.label, color: t.textSecondary }}>Date Range</label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              style={{ ...styles.select, background: t.inputBg, border: `1px solid ${t.border}`, color: t.textPrimary }}
            >
              {DATE_RANGES.map((range) => (
                <option key={range.id} value={range.id}>{range.label}</option>
              ))}
            </select>
          </div>
        </div>

        <button 
          onClick={handleExport}
          disabled={isExporting}
          style={{ ...styles.exportBtn, background: t.accent, color: "#fff", opacity: isExporting ? 0.7 : 1 }}
        >
          {isExporting ? "Exporting..." : `Export ${selectedFormat.toUpperCase()}`}
        </button>
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
  inputBg: "#ffffff",
  accent: "#1a2a6c",
};

const dark = {
  pageBg: "#0f172a",
  cardBg: "#1e293b",
  textPrimary: "#e2e8f0",
  textSecondary: "#94a3b8",
  border: "#334155",
  inputBg: "#0f172a",
  accent: "#7c9fff",
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
    margin: "0 0 20px 0",
  },
  formGrid: {
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: "24px",
    marginBottom: "24px",
  },
  formGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  label: {
    fontSize: "13px",
    fontWeight: "600",
  },
  radioGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  radioLabel: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    cursor: "pointer",
    fontSize: "14px",
  },
  radioInput: {
    cursor: "pointer",
  },
  recordCount: {
    fontSize: "12px",
  },
  formatGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
    gap: "12px",
  },
  formatCard: {
    padding: "16px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    textAlign: "center",
    transition: "all 0.2s",
  },
  formatName: {
    fontSize: "14px",
    fontWeight: "600",
    marginBottom: "4px",
  },
  formatDesc: {
    fontSize: "12px",
    opacity: 0.8,
  },
  select: {
    padding: "8px 12px",
    borderRadius: "6px",
    fontSize: "14px",
    fontFamily: "Arial, sans-serif",
  },
  exportBtn: {
    padding: "10px 24px",
    border: "none",
    borderRadius: "6px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
  },
};

export default DataExport;
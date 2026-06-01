import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";

function Customers() {
  const { isDark } = useTheme();
  const t = isDark ? dark : light;
  
  const navigate = useNavigate();


  const [regionFilter, setRegionFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("spend");

  let filteredCustomers = MOCK_CUSTOMERS.filter((customer) => {
    const matchesRegion = regionFilter === "all" || customer.region === regionFilter;
    const matchesStatus = statusFilter === "all" || customer.status === statusFilter;
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesRegion && matchesStatus && matchesSearch;
  });

  if (sortBy === "spend") {
    filteredCustomers.sort((a, b) => b.totalSpend - a.totalSpend);
  } else if (sortBy === "name") {
    filteredCustomers.sort((a, b) => a.name.localeCompare(b.name));
  }

  return (
    <div style={styles.wrapper}>
      
      <div style={styles.summaryGrid}>
        <div style={{ ...styles.summaryCard, background: t.cardBg, border: `1px solid ${t.border}` }}>
          <div style={{ ...styles.summaryIcon, background: t.accentLight }}>👥</div>
          <div>
            <div style={{ ...styles.summaryLabel, color: t.textSecondary }}>Total Customers</div>
            <div style={{ ...styles.summaryValue, color: t.textPrimary }}>856</div>
          </div>
        </div>

        <div style={{ ...styles.summaryCard, background: t.cardBg, border: `1px solid ${t.border}` }}>
          <div style={{ ...styles.summaryIcon, background: t.successLight }}>✓</div>
          <div>
            <div style={{ ...styles.summaryLabel, color: t.textSecondary }}>Active</div>
            <div style={{ ...styles.summaryValue, color: t.textPrimary }}>742</div>
          </div>
        </div>

        <div style={{ ...styles.summaryCard, background: t.cardBg, border: `1px solid ${t.border}` }}>
          <div style={{ ...styles.summaryIcon, background: t.warningLight }}>⏸</div>
          <div>
            <div style={{ ...styles.summaryLabel, color: t.textSecondary }}>Inactive</div>
            <div style={{ ...styles.summaryValue, color: t.textPrimary }}>114</div>
          </div>
        </div>

        <div style={{ ...styles.summaryCard, background: t.cardBg, border: `1px solid ${t.border}` }}>
          <div style={{ ...styles.summaryIcon, background: t.accentLight }}>💰</div>
          <div>
            <div style={{ ...styles.summaryLabel, color: t.textSecondary }}>Avg Lifetime Value</div>
            <div style={{ ...styles.summaryValue, color: t.textPrimary }}>€12.4K</div>
          </div>
        </div>
      </div>

      <div style={{ ...styles.filterBar, background: t.cardBg, border: `1px solid ${t.border}` }}>
        <input
          type="text"
          placeholder="Search customers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            ...styles.searchInput,
            background: t.inputBg,
            border: `1px solid ${t.border}`,
            color: t.textPrimary,
          }}
        />

        <select
          value={regionFilter}
          onChange={(e) => setRegionFilter(e.target.value)}
          style={{ ...styles.select, background: t.inputBg, border: `1px solid ${t.border}`, color: t.textPrimary }}
        >
          <option value="all">All Regions</option>
          <option value="North America">North America</option>
          <option value="Europe">Europe</option>
          <option value="Asia">Asia</option>
          <option value="South America">South America</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{ ...styles.select, background: t.inputBg, border: `1px solid ${t.border}`, color: t.textPrimary }}
        >
          <option value="all">All Status</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          style={{ ...styles.select, background: t.inputBg, border: `1px solid ${t.border}`, color: t.textPrimary }}
        >
          <option value="spend">Sort by Spend</option>
          <option value="name">Sort by Name</option>
        </select>
      </div>

      <div style={{ ...styles.tableCard, background: t.cardBg, border: `1px solid ${t.border}` }}>
        <div style={styles.tableHeader}>
          <h3 style={{ ...styles.tableTitle, color: t.textPrimary }}>
            Customer Directory ({filteredCustomers.length})
          </h3>
          <button style={styles.addBtn}>+ Add Customer</button>
        </div>
        
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr style={{ borderBottom: `2px solid ${t.border}` }}>
                <th style={{ ...styles.th, color: t.textPrimary }}>Customer ID</th>
                <th style={{ ...styles.th, color: t.textPrimary }}>Name</th>
                <th style={{ ...styles.th, color: t.textPrimary }}>Email</th>
                <th style={{ ...styles.th, color: t.textPrimary }}>Region</th>
                <th style={{ ...styles.th, color: t.textPrimary }}>Total Spend</th>
                <th style={{ ...styles.th, color: t.textPrimary }}>Orders</th>
                <th style={{ ...styles.th, color: t.textPrimary }}>Avg Order</th>
                <th style={{ ...styles.th, color: t.textPrimary }}>Last Order</th>
                <th style={{ ...styles.th, color: t.textPrimary }}>Status</th>
                <th style={{ ...styles.th, color: t.textPrimary }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map((customer) => (
                <tr key={customer.id} style={{ borderBottom: `1px solid ${t.borderLight}` }}>
                  <td style={{ ...styles.td, color: t.textSecondary, fontFamily: "monospace" }}>
                    {customer.id}
                  </td>
                  <td style={{ ...styles.td, color: t.textPrimary, fontWeight: "500" }}>
                    {customer.name}
                  </td>
                  <td style={{ ...styles.td, color: t.textSecondary, fontSize: "12px" }}>
                    {customer.email}
                  </td>
                  <td style={{ ...styles.td, color: t.textSecondary }}>{customer.region}</td>
                  <td style={{ ...styles.td, color: t.textPrimary, fontWeight: "600" }}>
                    €{customer.totalSpend.toLocaleString()}
                  </td>
                  <td style={{ ...styles.td, color: t.textSecondary }}>{customer.orders}</td>
                  <td style={{ ...styles.td, color: t.textSecondary }}>
                    €{Math.round(customer.totalSpend / customer.orders).toLocaleString()}
                  </td>
                  <td style={{ ...styles.td, color: t.textSecondary }}>{customer.lastOrder}</td>
                  <td style={{ ...styles.td }}>
                    <span
                      style={{
                        ...styles.statusBadge,
                        background: customer.status === "Active" ? t.success : t.warning,
                      }}
                    >
                      {customer.status}
                    </span>
                  </td>
                  <td style={{ ...styles.td }}>
                    <button
                      onClick={() => navigate(`/customers/${customer.id}`)}
                      style={{ ...styles.actionBtn, color: t.accent }}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

const MOCK_CUSTOMERS = [
  {
    id: "CUS-001",
    name: "Acme Corp",
    email: "contact@acmecorp.com",
    region: "North America",
    totalSpend: 45000,
    orders: 23,
    lastOrder: "2024-01-15",
    status: "Active",
  },
  {
    id: "CUS-002",
    name: "Beta Ltd",
    email: "info@betaltd.com",
    region: "Europe",
    totalSpend: 68000,
    orders: 34,
    lastOrder: "2024-01-18",
    status: "Active",
  },
  {
    id: "CUS-003",
    name: "Gamma Inc",
    email: "hello@gammainc.com",
    region: "Asia",
    totalSpend: 92000,
    orders: 45,
    lastOrder: "2024-01-20",
    status: "Active",
  },
  {
    id: "CUS-004",
    name: "Delta Co",
    email: "support@deltaco.com",
    region: "North America",
    totalSpend: 28500,
    orders: 18,
    lastOrder: "2024-01-12",
    status: "Active",
  },
  {
    id: "CUS-005",
    name: "Epsilon LLC",
    email: "contact@epsilonllc.com",
    region: "Europe",
    totalSpend: 15200,
    orders: 12,
    lastOrder: "2023-11-28",
    status: "Inactive",
  },
  {
    id: "CUS-006",
    name: "Zeta Industries",
    email: "info@zetaind.com",
    region: "Asia",
    totalSpend: 54000,
    orders: 28,
    lastOrder: "2024-01-19",
    status: "Active",
  },
  {
    id: "CUS-007",
    name: "Theta Systems",
    email: "contact@thetasys.com",
    region: "North America",
    totalSpend: 38000,
    orders: 21,
    lastOrder: "2024-01-17",
    status: "Active",
  },
  {
    id: "CUS-008",
    name: "Iota Partners",
    email: "hello@iotapartners.com",
    region: "South America",
    totalSpend: 22000,
    orders: 15,
    lastOrder: "2024-01-14",
    status: "Active",
  },
  {
    id: "CUS-009",
    name: "Kappa Group",
    email: "info@kappagroup.com",
    region: "Europe",
    totalSpend: 12000,
    orders: 8,
    lastOrder: "2023-10-15",
    status: "Inactive",
  },
  {
    id: "CUS-010",
    name: "Lambda Corp",
    email: "contact@lambdacorp.com",
    region: "Asia",
    totalSpend: 76000,
    orders: 38,
    lastOrder: "2024-01-21",
    status: "Active",
  },
];

const light = {
  textPrimary: "#1a2a6c",
  textSecondary: "#555",
  cardBg: "#ffffff",
  border: "#e0e4ef",
  borderLight: "#f0f2f7",
  inputBg: "#ffffff",
  accent: "#1a2a6c",
  success: "#16a34a",
  warning: "#f59e0b",
  accentLight: "#e0e7ff",
  successLight: "#dcfce7",
  warningLight: "#fef3c7",
};

const dark = {
  textPrimary: "#e2e8f0",
  textSecondary: "#94a3b8",
  cardBg: "#1e293b",
  border: "#334155",
  borderLight: "#334155",
  inputBg: "#0f172a",
  accent: "#7c9fff",
  success: "#22c55e",
  warning: "#fbbf24",
  accentLight: "#1e3a8a",
  successLight: "#065f46",
  warningLight: "#78350f",
};

const styles = {
  wrapper: {
    display: "flex",
    flexDirection: "column",
    gap: "24px",
  },
  summaryGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "16px",
  },
  summaryCard: {
    padding: "20px",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    gap: "16px",
  },
  summaryIcon: {
    width: "48px",
    height: "48px",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "24px",
  },
  summaryLabel: {
    fontSize: "12px",
    marginBottom: "4px",
  },
  summaryValue: {
    fontSize: "24px",
    fontWeight: "700",
  },
  filterBar: {
    padding: "20px",
    borderRadius: "10px",
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
  },
  searchInput: {
    flex: 1,
    minWidth: "200px",
    padding: "8px 14px",
    borderRadius: "6px",
    fontSize: "13px",
    outline: "none",
  },
  select: {
    padding: "8px 14px",
    borderRadius: "6px",
    fontSize: "13px",
    cursor: "pointer",
    outline: "none",
  },
  tableCard: {
    padding: "24px",
    borderRadius: "10px",
  },
  tableHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },
  tableTitle: {
    margin: 0,
    fontSize: "16px",
    fontWeight: "700",
  },
  addBtn: {
    padding: "8px 16px",
    background: "#1a2a6c",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    fontSize: "13px",
    fontWeight: "600",
    cursor: "pointer",
  },
  tableWrapper: {
    overflowX: "auto",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  th: {
    padding: "12px 16px",
    textAlign: "left",
    fontSize: "13px",
    fontWeight: "600",
  },
  td: {
    padding: "12px 16px",
    fontSize: "13px",
  },
  statusBadge: {
    padding: "4px 10px",
    borderRadius: "12px",
    fontSize: "11px",
    fontWeight: "600",
    color: "#fff",
  },
  actionBtn: {
    background: "transparent",
    border: "none",
    fontSize: "13px",
    fontWeight: "500",
    cursor: "pointer",
    textDecoration: "underline",
  },
};

export default Customers;
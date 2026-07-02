import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useTheme } from "../context/ThemeContext";

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
    phone: "+1-555-0101",
    address: "123 Business Ave, New York, NY",
    joinDate: "2023-01-15",
    notes: "Premium customer - Priority support",
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
    phone: "+44-20-7946-0958",
    address: "456 Enterprise Rd, London, UK",
    joinDate: "2022-06-20",
    notes: "Long-standing partner",
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
    phone: "+81-3-1234-5678",
    address: "789 Tech Plaza, Tokyo, Japan",
    joinDate: "2021-03-10",
    notes: "Top tier customer",
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
    phone: "+1-555-0102",
    address: "321 Commerce St, Toronto, Canada",
    joinDate: "2023-05-12",
    notes: "Steady growth",
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
    phone: "+33-1-42-86-82-00",
    address: "654 Business Blvd, Paris, France",
    joinDate: "2023-08-22",
    notes: "Dormant account",
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
    phone: "+86-10-5879-0000",
    address: "987 Industrial Way, Beijing, China",
    joinDate: "2022-11-05",
    notes: "Growing partnership",
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
    phone: "+1-555-0103",
    address: "111 Tech Drive, San Francisco, CA",
    joinDate: "2023-02-14",
    notes: "Regular customer",
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
    phone: "+55-11-3665-0000",
    address: "222 Partnership Ave, São Paulo, Brazil",
    joinDate: "2023-04-18",
    notes: "New market opportunity",
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
    phone: "+39-02-7252-4521",
    address: "333 Corporate Plaza, Milan, Italy",
    joinDate: "2023-09-30",
    notes: "Inactive - follow up needed",
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
    phone: "+65-6842-5678",
    address: "444 Enterprise Hub, Singapore",
    joinDate: "2021-12-01",
    notes: "Excellent customer",
  },
];

const CustomerProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const t = isDark ? dark : light;
  
  const [customer, setCustomer] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      const foundCustomer = MOCK_CUSTOMERS.find(c => c.id === id);
      
      if (foundCustomer) {
        setCustomer(foundCustomer);
        
        const mockTransactions = [
          { id: 1, date: '2024-05-22', product: 'Laptop Pro 15"', amount: 1299.99, status: 'COMPLETED' },
          { id: 2, date: '2024-05-15', product: 'Wireless Mouse', amount: 29.99, status: 'COMPLETED' },
          { id: 3, date: '2024-05-10', product: 'USB-C Hub', amount: 49.99, status: 'COMPLETED' },
          { id: 4, date: '2024-04-28', product: 'Office Chair', amount: 249.99, status: 'COMPLETED' },
          { id: 5, date: '2024-04-15', product: 'Standing Desk', amount: 399.99, status: 'COMPLETED' },
        ];
        setTransactions(mockTransactions);
      }
      setLoading(false);
    }, 500);
  }, [id]);

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
      </div>
    );
  }

  if (!customer) {
    return (
      <div style={styles.errorContainer}>
        <h2 style={{ ...styles.errorTitle, color: t.textPrimary }}>Customer Not Found</h2>
        <button 
          onClick={() => navigate('/dashboard')}
          style={{ ...styles.backBtn, color: t.accent }}
        >
           Back to Dashboard
        </button>
      </div>
    );
  }

  const totalOrders = customer.orders;
  const averageOrderValue = customer.totalSpend / totalOrders;
  const lastOrderDays = Math.floor((new Date() - new Date(customer.lastOrder)) / (1000 * 60 * 60 * 24));

  const monthlyData = [
    { month: 'Jan', amount: 5000 },
    { month: 'Feb', amount: 6500 },
    { month: 'Mar', amount: 4200 },
    { month: 'Apr', amount: 7800 },
    { month: 'May', amount: customer.totalSpend / 12 },
  ];

  const categoryData = [
    { name: 'Electronics', value: customer.totalSpend * 0.6, color: '#3B82F6' },
    { name: 'Furniture', value: customer.totalSpend * 0.25, color: '#10B981' },
    { name: 'Accessories', value: customer.totalSpend * 0.15, color: '#F59E0B' },
  ];

  return (
    <div style={{ ...styles.wrapper, background: t.bg }}>
      <div style={styles.headerSection}>
        <button
          onClick={() => navigate('/dashboard')}
          style={{ ...styles.backButton, color: t.textSecondary }}
        >
           Back to Dashboard 
        </button>
        
        <div style={styles.headerContent}>
          <h1 style={{ ...styles.title, color: t.textPrimary }}>
            {customer.name}
          </h1>
          <p style={{ ...styles.subtitle, color: t.textSecondary }}>
            Customer since {new Date(customer.joinDate).toLocaleDateString()}
          </p>
        </div>

        <span style={{ 
          ...styles.statusBadge, 
          background: customer.status === 'Active' ? t.success : t.warning,
          color: '#fff'
        }}>
          {customer.status}
        </span>
      </div>

      <div style={styles.statGrid}>
        <div style={{ ...styles.statCard, background: t.cardBg, border: `1px solid ${t.border}` }}>
          <div style={{ ...styles.statLabel, color: t.textSecondary }}>Total Spend</div>
          <div style={{ ...styles.statValue, color: t.textPrimary }}>
            €{customer.totalSpend.toLocaleString()}
          </div>
        </div>

        <div style={{ ...styles.statCard, background: t.cardBg, border: `1px solid ${t.border}` }}>
          <div style={{ ...styles.statLabel, color: t.textSecondary }}>Total Orders</div>
          <div style={{ ...styles.statValue, color: t.textPrimary }}>
            {totalOrders}
          </div>
        </div>

        <div style={{ ...styles.statCard, background: t.cardBg, border: `1px solid ${t.border}` }}>
          <div style={{ ...styles.statLabel, color: t.textSecondary }}>Avg Order Value</div>
          <div style={{ ...styles.statValue, color: t.textPrimary }}>
            €{averageOrderValue.toFixed(0)}
          </div>
        </div>

        <div style={{ ...styles.statCard, background: t.cardBg, border: `1px solid ${t.border}` }}>
          <div style={{ ...styles.statLabel, color: t.textSecondary }}>Last Order</div>
          <div style={{ ...styles.statValue, color: t.textPrimary }}>
            {lastOrderDays}d ago
          </div>
        </div>
      </div>

      <div style={styles.contentGrid}>
        <div style={{ ...styles.card, background: t.cardBg, border: `1px solid ${t.border}` }}>
          <h3 style={{ ...styles.cardTitle, color: t.textPrimary }}>Customer Information</h3>
          
          <div style={styles.infoSection}>
            <div style={styles.infoRow}>
              <span style={{ ...styles.infoLabel, color: t.textSecondary }}>Email</span>
              <span style={{ ...styles.infoValue, color: t.textPrimary }}>{customer.email}</span>
            </div>
            <div style={styles.infoRow}>
              <span style={{ ...styles.infoLabel, color: t.textSecondary }}>Phone</span>
              <span style={{ ...styles.infoValue, color: t.textPrimary }}>{customer.phone}</span>
            </div>
            <div style={styles.infoRow}>
              <span style={{ ...styles.infoLabel, color: t.textSecondary }}>Region</span>
              <span style={{ ...styles.infoValue, color: t.textPrimary }}>{customer.region}</span>
            </div>
            <div style={styles.infoRow}>
              <span style={{ ...styles.infoLabel, color: t.textSecondary }}>Address</span>
              <span style={{ ...styles.infoValue, color: t.textPrimary }}>{customer.address}</span>
            </div>
            <div style={styles.infoRow}>
              <span style={{ ...styles.infoLabel, color: t.textSecondary }}>Notes</span>
              <span style={{ ...styles.infoValue, color: t.textPrimary }}>{customer.notes}</span>
            </div>
          </div>

          <div style={styles.buttonGroup}>
            <button style={{ ...styles.primaryBtn, background: t.accent, color: '#fff' }}>
              Edit Customer
            </button>
            <button style={{ ...styles.secondaryBtn, background: t.inputBg, color: t.textPrimary, border: `1px solid ${t.border}` }}>
              Send Email
            </button>
          </div>
        </div>

        <div style={styles.chartsSection}>
          {/* Monthly Spending Chart */}
          <div style={{ ...styles.card, background: t.cardBg, border: `1px solid ${t.border}`, marginBottom: '20px' }}>
            <h3 style={{ ...styles.cardTitle, color: t.textPrimary }}>Monthly Spending</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                <XAxis dataKey="month" stroke={t.textSecondary} />
                <YAxis stroke={t.textSecondary} />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: t.cardBg,
                    border: `1px solid ${t.border}`,
                    borderRadius: '8px',
                    color: t.textPrimary
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="amount" 
                  stroke="#3B82F6" 
                  strokeWidth={2}
                  dot={{ fill: '#3B82F6', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div style={{ ...styles.card, background: t.cardBg, border: `1px solid ${t.border}` }}>
            <h3 style={{ ...styles.cardTitle, color: t.textPrimary }}>Purchase Categories</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div style={{ ...styles.card, background: t.cardBg, border: `1px solid ${t.border}` }}>
        <h3 style={{ ...styles.cardTitle, color: t.textPrimary }}>Recent Purchases</h3>
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr style={{ borderBottom: `2px solid ${t.border}` }}>
                <th style={{ ...styles.th, color: t.textPrimary }}>Date</th>
                <th style={{ ...styles.th, color: t.textPrimary }}>Product</th>
                <th style={{ ...styles.th, color: t.textPrimary, textAlign: 'right' }}>Amount</th>
                <th style={{ ...styles.th, color: t.textPrimary, textAlign: 'center' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction.id} style={{ borderBottom: `1px solid ${t.border}` }}>
                  <td style={{ ...styles.td, color: t.textPrimary }}>
                    {new Date(transaction.date).toLocaleDateString()}
                  </td>
                  <td style={{ ...styles.td, color: t.textPrimary }}>
                    {transaction.product}
                  </td>
                  <td style={{ ...styles.td, color: t.textPrimary, textAlign: 'right', fontWeight: '600' }}>
                    €{transaction.amount.toFixed(2)}
                  </td>
                  <td style={{ ...styles.td, textAlign: 'center' }}>
                    <span style={{ ...styles.statusBadge, background: t.success, color: '#fff' }}>
                      {transaction.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const light = {
  bg: "#f9fafb",
  textPrimary: "#1a2a6c",
  textSecondary: "#555",
  cardBg: "#ffffff",
  border: "#e0e4ef",
  inputBg: "#ffffff",
  accent: "#1a2a6c",
  success: "#16a34a",
  warning: "#f59e0b",
};

const dark = {
  bg: "#0f172a",
  textPrimary: "#e2e8f0",
  textSecondary: "#94a3b8",
  cardBg: "#1e293b",
  border: "#334155",
  inputBg: "#0f172a",
  accent: "#7c9fff",
  success: "#22c55e",
  warning: "#fbbf24",
};

const styles = {
  wrapper: {
    padding: "24px",
    display: "flex",
    flexDirection: "column",
    gap: "24px",
    minHeight: "100vh",
  },
  loadingContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
  },
  spinner: {
    width: "40px",
    height: "40px",
    border: "4px solid rgba(0,0,0,0.1)",
    borderTop: "4px solid #3B82F6",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
  errorContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    gap: "16px",
  },
  errorTitle: {
    fontSize: "24px",
    fontWeight: "600",
  },
  backButton: {
    background: "transparent",
    border: "none",
    fontSize: "14px",
    cursor: "pointer",
    marginBottom: "16px",
  },
  backBtn: {
    background: "transparent",
    border: "none",
    fontSize: "14px",
    cursor: "pointer",
    textDecoration: "underline",
  },
  headerSection: {
    display: "flex",
    alignItems: "center",
    gap: "24px",
    justifyContent: "space-between",
  },
  headerContent: {
    flex: 1,
  },
  title: {
    fontSize: "32px",
    fontWeight: "700",
    margin: "0 0 8px 0",
  },
  subtitle: {
    fontSize: "14px",
    margin: 0,
  },
  statusBadge: {
    padding: "6px 12px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "600",
  },
  statGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "16px",
  },
  statCard: {
    padding: "20px",
    borderRadius: "10px",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  statLabel: {
    fontSize: "12px",
    fontWeight: "500",
  },
  statValue: {
    fontSize: "24px",
    fontWeight: "700",
  },
  contentGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1.5fr",
    gap: "24px",
  },
  chartsSection: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  card: {
    padding: "24px",
    borderRadius: "10px",
  },
  cardTitle: {
    fontSize: "16px",
    fontWeight: "700",
    margin: "0 0 16px 0",
  },
  infoSection: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    marginBottom: "20px",
  },
  infoRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  infoLabel: {
    fontSize: "12px",
    fontWeight: "500",
  },
  infoValue: {
    fontSize: "14px",
    fontWeight: "500",
  },
  buttonGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    marginTop: "20px",
    paddingTop: "20px",
    borderTop: "1px solid",
  },
  primaryBtn: {
    padding: "10px 16px",
    border: "none",
    borderRadius: "6px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
  },
  secondaryBtn: {
    padding: "10px 16px",
    border: "1px solid",
    borderRadius: "6px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    background: "transparent",
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
    fontSize: "12px",
    fontWeight: "600",
  },
  td: {
    padding: "12px 16px",
    fontSize: "13px",
  },
};

export default CustomerProfile;
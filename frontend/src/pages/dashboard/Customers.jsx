/*
  Customers page

  Endpoints used:
    GET /api/clients → full customer list (name, region, status, segment etc)
    GET /api/clients/summary → adds totalSpend, orders, avgOrder, lastOrder per customer

  API fields:
    clientID - id
    firstName + lastName - name
    country - region
    accountStatus - status (Active, Suspended, Closed)
    clientSegment - segment (Retail, Corporate, Wholesale, etc)
    birthDate - birthDate
    createDate - createDate

  What it shows:
    - Summary cards: Total, Active, Suspended/Closed, unique regions
    - Filters: search, region, status, segment, sort
    - Customer table with all the fields from the database
*/

import { useState, useEffect } from "react";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
 
function Customers() {
  const { isDark }      = useTheme();
  const { user, token } = useAuth();
  const t               = isDark ? dark : light;
 
  // API state
  const [customers, setCustomers] = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState(null);
 
  // Filter state
  const [searchTerm,    setSearchTerm]    = useState("");
  const [regionFilter,  setRegionFilter]  = useState("all");
  const [statusFilter,  setStatusFilter]  = useState("all");
  const [segmentFilter, setSegmentFilter] = useState("all");
  const [sortBy,        setSortBy]        = useState("name");
 
  // Auth header used for every API call
  const authHeader = {
    "Authorization": `Bearer ${token}`,
    "Content-Type":  "application/json",
  };
 
  useEffect(() => {
    console.log("Token: "+token);
    if (!token) return;
 
    // Fetch both endpoints 
    Promise.all([
      fetch("http://localhost:8080/api/clients", { headers: authHeader }),
      fetch("http://localhost:8080/api/clients/summary", { headers: authHeader }),
    ])
      .then(async ([clientsRes, summaryRes]) => {
        if (!clientsRes.ok) throw new Error("Failed to fetch customers");
 
        const clientsData = await clientsRes.json();
 
        
        let summaryData = [];
        if (summaryRes.ok) {
          summaryData = await summaryRes.json();
        }
 
        // Create a lookup map thats used for the summary data by clientId
        // Summary fields: clientId, totalSpend, orders, avgOrder, lastOrder
        const summaryMap = {};
        summaryData.forEach((s) => {
          summaryMap[s.clientId] = s;
        });
 
        const mapped = clientsData.map((c) => {
          const summary = summaryMap[c.clientId] || {};
          return {
            id:            c.clientId,
            clientNumber:  c.clientNumber,
            name:          `${c.firstName} ${c.lastName}`,
            gender:        c.gender,
            maritalStatus: c.maritalStatus,
            region:        c.country,
            status:        c.accountStatus,
            segment:       c.clientSegment,
            birthDate:     c.birthDate,
            createDate:    c.createDate,
            // From summary endpoint
            totalSpend:    summary.totalSpend    || null,
            orders:        summary.orders        || null,
            avgOrder:      summary.avgOrder      || null,
            lastOrder:     summary.lastOrder     || null,
          };
        });
 
        setCustomers(mapped);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [token]);
 
  // Unique values for filter dropdowns
  const uniqueRegions  = [...new Set(customers.map(c => c.region))].filter(Boolean).sort();
  const uniqueSegments = [...new Set(customers.map(c => c.segment))].filter(Boolean).sort();
 
  // Filter + sort
  let filtered = customers.filter((c) => {
    const matchSearch  = c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         String(c.id).includes(searchTerm) ||
                         c.clientNumber?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchRegion  = regionFilter  === "all" || c.region  === regionFilter;
    const matchStatus  = statusFilter  === "all" || c.status  === statusFilter;
    const matchSegment = segmentFilter === "all" || c.segment === segmentFilter;
    return matchSearch && matchRegion && matchStatus && matchSegment;
  });
 
  if (sortBy === "name")       filtered.sort((a, b) => a.name.localeCompare(b.name));
  if (sortBy === "region")     filtered.sort((a, b) => a.region.localeCompare(b.region));
  if (sortBy === "createDate") filtered.sort((a, b) => new Date(b.createDate) - new Date(a.createDate));
  if (sortBy === "segment")    filtered.sort((a, b) => a.segment.localeCompare(b.segment));
  if (sortBy === "spend")      filtered.sort((a, b) => (b.totalSpend || 0) - (a.totalSpend || 0));
 
  // KPI values
  const totalCustomers    = customers.length;
  const activeCount       = customers.filter(c => c.status === "Active").length;
  const suspendedCount    = customers.filter(c => c.status === "Suspended").length;
  const uniqueRegionCount = [...new Set(customers.map(c => c.region))].length;
 
  const getStatusStyle = (status) => {
    if (status === "Active")    return { background: t.successLight, color: t.success };
    if (status === "Suspended") return { background: t.warningLight, color: t.warning };
    if (status === "Closed")    return { background: t.dangerLight,  color: t.danger  };
    return { background: t.borderLight, color: t.textSecondary };
  };
 
  // Show message if not logged in
  if (!user) {
    return (
      <div style={{ ...styles.stateBox, color: t.textSecondary }}>
        Please sign in to view customer data.
      </div>
    );
  }
 
  return (
    <div style={styles.wrapper}>
 
      {/* Summary Cards */}
      <div style={styles.summaryGrid}>
        {[
          { label: "Total Customers", value: totalCustomers,    accent: t.accentLight  },
          { label: "Active",          value: activeCount,       accent: t.successLight },
          { label: "Suspended",       value: suspendedCount,    accent: t.warningLight },
          { label: "Regions",         value: uniqueRegionCount, accent: t.accentLight  },
        ].map((card) => (
          <div
            key={card.label}
            style={{
              ...styles.summaryCard,
              background: t.cardBg,
              border:     `1px solid ${t.border}`,
            }}
          >
            <div style={{ ...styles.summaryAccent, background: card.accent }} />
            <div>
              <div style={{ ...styles.summaryLabel, color: t.textSecondary }}>{card.label}</div>
              <div style={{ ...styles.summaryValue, color: t.textPrimary }}>
                {loading ? "—" : card.value}
              </div>
            </div>
          </div>
        ))}
      </div>
 
      {/* Filters */}
      <div style={{ ...styles.filterBar, background: t.cardBg, border: `1px solid ${t.border}` }}>
        <input
          type="text"
          placeholder="Search by name, ID or client number..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            ...styles.searchInput,
            background: t.inputBg,
            border:     `1px solid ${t.border}`,
            color:      t.textPrimary,
          }}
        />
        <select
          value={regionFilter}
          onChange={(e) => setRegionFilter(e.target.value)}
          style={{ ...styles.select, background: t.inputBg, border: `1px solid ${t.border}`, color: t.textPrimary }}
        >
          <option value="all">All Regions</option>
          {uniqueRegions.map(r => <option key={r} value={r}>{r}</option>)}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{ ...styles.select, background: t.inputBg, border: `1px solid ${t.border}`, color: t.textPrimary }}
        >
          <option value="all">All Status</option>
          <option value="Active">Active</option>
          <option value="Suspended">Suspended</option>
          <option value="Closed">Closed</option>
        </select>
        <select
          value={segmentFilter}
          onChange={(e) => setSegmentFilter(e.target.value)}
          style={{ ...styles.select, background: t.inputBg, border: `1px solid ${t.border}`, color: t.textPrimary }}
        >
          <option value="all">All Segments</option>
          {uniqueSegments.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          style={{ ...styles.select, background: t.inputBg, border: `1px solid ${t.border}`, color: t.textPrimary }}
        >
          <option value="name">Sort by Name</option>
          <option value="region">Sort by Region</option>
          <option value="segment">Sort by Segment</option>
          <option value="spend">Sort by Spend</option>
          <option value="createDate">Sort by Join Date</option>
        </select>
      </div>
 
      {/* Table */}
      <div style={{ ...styles.tableCard, background: t.cardBg, border: `1px solid ${t.border}` }}>
        <div style={styles.tableHeader}>
          <div>
            <h3 style={{ ...styles.tableTitle, color: t.textPrimary }}>Customer Directory</h3>
            <p style={{ ...styles.tableSub, color: t.textSecondary }}>
              {loading ? "Loading..." : `${filtered.length} of ${totalCustomers} customers`}
            </p>
          </div>
          <button style={styles.addBtn}>+ Add Customer</button>
        </div>
 
        {loading && (
          <div style={{ ...styles.stateBox, color: t.textSecondary }}>Loading customers...</div>
        )}
        {error && !loading && (
          <div style={{ ...styles.stateBox, color: t.danger }}>Error: {error}</div>
        )}
        {!loading && !error && filtered.length === 0 && (
          <div style={{ ...styles.stateBox, color: t.textSecondary }}>No customers match your filters.</div>
        )}
 
        {!loading && !error && filtered.length > 0 && (
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${t.border}` }}>
                  {[
                    "Client No.",
                    "Name",
                    "Gender",
                    "Region",
                    "Segment",
                    "Total Spend",
                    "Orders",
                    "Avg Order",
                    "Last Order",
                    "Join Date",
                    "Status",
                  ].map((h) => (
                    <th key={h} style={{ ...styles.th, color: t.textSecondary }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((c) => (
                  <tr key={c.id} style={{ borderBottom: `1px solid ${t.borderLight}` }}>
                    <td style={{ ...styles.td, color: t.textSecondary, fontFamily: "monospace" }}>
                      {c.clientNumber}
                    </td>
                    <td style={{ ...styles.td, color: t.textPrimary, fontWeight: "500" }}>
                      {c.name}
                    </td>
                    <td style={{ ...styles.td, color: t.textSecondary }}>{c.gender}</td>
                    <td style={{ ...styles.td, color: t.textSecondary }}>{c.region}</td>
                    <td style={{ ...styles.td, color: t.textSecondary }}>{c.segment}</td>
                    <td style={{ ...styles.td, color: t.textPrimary, fontWeight: "600" }}>
                      {c.totalSpend != null ? `€${c.totalSpend.toLocaleString()}` : "—"}
                    </td>
                    <td style={{ ...styles.td, color: t.textSecondary }}>
                      {c.orders != null ? c.orders : "—"}
                    </td>
                    <td style={{ ...styles.td, color: t.textSecondary }}>
                      {c.avgOrder != null ? `€${c.avgOrder.toLocaleString()}` : "—"}
                    </td>
                    <td style={{ ...styles.td, color: t.textSecondary }}>
                      {c.lastOrder || "—"}
                    </td>
                    <td style={{ ...styles.td, color: t.textSecondary }}>{c.createDate}</td>
                    <td style={{ ...styles.td }}>
                      <span style={{ ...styles.statusBadge, ...getStatusStyle(c.status) }}>
                        {c.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
 
    </div>
  );
}
 
// THEMES
const light = {
  textPrimary:   "#1a2a6c",
  textSecondary: "#555",
  cardBg:        "#ffffff",
  border:        "#e0e4ef",
  borderLight:   "#f0f2f7",
  inputBg:       "#ffffff",
  accent:        "#1a2a6c",
  accentLight:   "#e0e7ff",
  success:       "#16a34a",
  successLight:  "#dcfce7",
  warning:       "#f59e0b",
  warningLight:  "#fef3c7",
  danger:        "#dc2626",
  dangerLight:   "#fee2e2",
};
 
const dark = {
  textPrimary:   "#e2e8f0",
  textSecondary: "#94a3b8",
  cardBg:        "#1e293b",
  border:        "#334155",
  borderLight:   "#1e293b",
  inputBg:       "#0f172a",
  accent:        "#7c9fff",
  accentLight:   "#1e3a8a",
  success:       "#22c55e",
  successLight:  "#064e3b",
  warning:       "#fbbf24",
  warningLight:  "#78350f",
  danger:        "#ef4444",
  dangerLight:   "#7f1d1d",
};
 
// STYLING
const styles = {
  wrapper: {
    display:       "flex",
    flexDirection: "column",
    gap:           "20px",
  },
  summaryGrid: {
    display:             "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap:                 "16px",
  },
  summaryCard: {
    padding:      "18px 20px",
    borderRadius: "10px",
    display:      "flex",
    alignItems:   "center",
    gap:          "14px",
  },
  summaryAccent: {
    width:        "4px",
    height:       "40px",
    borderRadius: "4px",
    flexShrink:   0,
  },
  summaryLabel: {
    fontSize:     "12px",
    marginBottom: "4px",
  },
  summaryValue: {
    fontSize:   "24px",
    fontWeight: "700",
  },
  filterBar: {
    padding:      "16px 20px",
    borderRadius: "10px",
    display:      "flex",
    gap:          "10px",
    flexWrap:     "wrap",
    alignItems:   "center",
  },
  searchInput: {
    flex:         1,
    minWidth:     "220px",
    padding:      "8px 14px",
    borderRadius: "6px",
    fontSize:     "13px",
    outline:      "none",
  },
  select: {
    padding:      "8px 12px",
    borderRadius: "6px",
    fontSize:     "13px",
    cursor:       "pointer",
    outline:      "none",
  },
  tableCard: {
    padding:      "20px",
    borderRadius: "10px",
  },
  tableHeader: {
    display:        "flex",
    justifyContent: "space-between",
    alignItems:     "flex-start",
    marginBottom:   "16px",
  },
  tableTitle: {
    margin:     "0 0 2px 0",
    fontSize:   "14px",
    fontWeight: "600",
  },
  tableSub: {
    margin:   0,
    fontSize: "12px",
  },
  addBtn: {
    padding:      "8px 16px",
    background:   "#1a2a6c",
    color:        "#fff",
    border:       "none",
    borderRadius: "6px",
    fontSize:     "13px",
    fontWeight:   "600",
    cursor:       "pointer",
  },
  stateBox: {
    padding:   "40px",
    textAlign: "center",
    fontSize:  "13px",
  },
  tableWrapper: {
    overflowX: "auto",
  },
  table: {
    width:          "100%",
    borderCollapse: "collapse",
  },
  th: {
    padding:       "10px 14px",
    textAlign:     "left",
    fontSize:      "11px",
    fontWeight:    "600",
    textTransform: "uppercase",
    letterSpacing: "0.4px",
  },
  td: {
    padding:  "11px 14px",
    fontSize: "13px",
  },
  statusBadge: {
    padding:      "3px 9px",
    borderRadius: "20px",
    fontSize:     "11px",
    fontWeight:   "600",
  },
};
 
export default Customers;
/*
  Endpoints used:
    GET /api/sales/territory → revenue, orders and avg order value by country/segment

  Requires JWT token in Authorization header.

  Map:
    Uses React Leaflet for an interactive world map.
    Countries with sales data are shown as circle markers
    sized and coloured by total revenue.
    Users can zoom in/out and click/drag the map.

  Install required packages:
    npm install react-leaflet leaflet
*/

import { useState, useEffect, useRef } from "react";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import * as Plot from "@observablehq/plot";
import { MapContainer, TileLayer, CircleMarker, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";

// Country name and coordinates lookup
const COUNTRY_COORDS = {
  "Ireland":   [53.1424, -7.6921],
  "UK":        [55.3781, -3.4360],
  "Germany":   [51.1657,  10.4515],
  "France":    [46.2276,   2.2137],
  "USA":       [37.0902, -95.7129],
  "Australia": [-25.2744, 133.7751],
};

function Territory() {
  const { isDark } = useTheme();
  const { user, token } = useAuth();
  const t = isDark ? dark : light;

  const revenueChartRef = useRef(null);
  const segmentChartRef = useRef(null);

  // API state
  const [territory, setTerritory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter state
  const [segmentFilter, setSegmentFilter] = useState("all");
  const [sortBy, setSortBy] = useState("revenue");

  const authHeader = {
    "Authorization": `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  useEffect(() => {
    if (!token) return;
    fetch("http://localhost:8080/api/sales/territory", { headers: authHeader })
      .then(r => r.ok ? r.json() : [])
      .then(data => setTerritory(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [token]);

  // Group by country - sum revenue and orders
  const byCountry = (() => {
    const map = {};
    territory.forEach((d) => {
      if (!map[d.country]) {
        map[d.country] = { country: d.country, totalRevenue: 0, totalOrders: 0 };
      }
      map[d.country].totalRevenue += d.totalRevenue || 0;
      map[d.country].totalOrders  += d.totalOrders  || 0;
    });
    return Object.values(map).sort((a, b) => b.totalRevenue - a.totalRevenue);
  })();

  // Max revenue for scaling circle sizes on map
  const maxRevenue = Math.max(...byCountry.map(d => d.totalRevenue), 1);

  // Segments for filter dropdown
  const uniqueSegments = [...new Set(territory.map(d => d.clientSegment))].filter(Boolean).sort();

  // Filtered table data
  let filtered = territory.filter(d =>
    segmentFilter === "all" || d.clientSegment === segmentFilter
  );

  if (sortBy === "revenue") filtered.sort((a, b) => b.totalRevenue  - a.totalRevenue);
  if (sortBy === "orders")  filtered.sort((a, b) => b.totalOrders   - a.totalOrders);
  if (sortBy === "avg")     filtered.sort((a, b) => b.avgOrderValue - a.avgOrderValue);
  if (sortBy === "country") filtered.sort((a, b) => a.country.localeCompare(b.country));

  // KPI values
  const totalRevenue  = byCountry.reduce((s, d) => s + d.totalRevenue, 0);
  const totalOrders   = byCountry.reduce((s, d) => s + d.totalOrders,  0);
  const topCountry    = byCountry[0]?.country || "-";
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  // Revenue by country chart
  useEffect(() => {
    if (!revenueChartRef.current || byCountry.length === 0) return;
    revenueChartRef.current.innerHTML = "";

    const plot = Plot.plot({
      width: revenueChartRef.current.offsetWidth || 400,
      height: Math.max(180, byCountry.length * 40 + 40),
      marginLeft: 110,
      marginBottom: 38,
      marginTop: 8,
      marginRight: 60,
      marks: [
        Plot.barX(byCountry, {
          x: "totalRevenue",
          y: "country",
          fill: isDark ? "#7c9fff" : "#1a2a6c",
          rx: 3,
          sort: { y: "-x" },
        }),
        Plot.text(byCountry, {
          x: "totalRevenue",
          y: "country",
          text: (d) => `€${(d.totalRevenue / 1000).toFixed(1)}K`,
          dx: 8,
          fill: isDark ? "#e2e8f0" : "#1a2a6c",
          fontSize: "11px",
          fontWeight: "600",
        }),
        Plot.ruleX([0]),
      ],
      x: {
        label: "Revenue (€)",
        grid: true,
        tickPadding: 6,
        tickFormat: d => `€${(d / 1000).toFixed(0)}K`,
        labelOffset: 56,
        labelAnchor: "center",
      },
      y: { label: null },
      style: {
        fontSize: "11px",
        color: t.textSecondary,
        background: "transparent",
      },
    });

    revenueChartRef.current.appendChild(plot);
    return () => plot.remove();
  }, [isDark, byCountry]);

  // Revenue by segment chart
  useEffect(() => {
    if (!segmentChartRef.current || territory.length === 0) return;
    segmentChartRef.current.innerHTML = "";

    const bySegment = {};
    territory.forEach(d => {
      bySegment[d.clientSegment] = (bySegment[d.clientSegment] || 0) + d.totalRevenue;
    });
    const segmentData = Object.entries(bySegment)
      .map(([segment, revenue]) => ({ segment, revenue }))
      .sort((a, b) => b.revenue - a.revenue);

    const plot = Plot.plot({
      width: segmentChartRef.current.offsetWidth || 400,
      height: Math.max(160, segmentData.length * 44 + 40),
      marginLeft: 110,
      marginBottom: 38,
      marginTop: 8,
      marginRight: 60,
      marks: [
        Plot.barX(segmentData, {
          x: "revenue",
          y: "segment",
          fill: isDark ? "#60a5fa" : "#3b82f6",
          rx: 3,
          sort: { y: "-x" },
        }),
        Plot.text(segmentData, {
          x: "revenue",
          y: "segment",
          text: (d) => `€${(d.revenue / 1000).toFixed(1)}K`,
          dx: 8,
          fill: isDark ? "#e2e8f0" : "#1a2a6c",
          fontSize: "11px",
          fontWeight: "600",
        }),
        Plot.ruleX([0]),
      ],
      x: {
        label: "Revenue (€)",
        grid: true,
        tickPadding: 6,
        tickFormat: d => `€${(d / 1000).toFixed(0)}K`,
        labelOffset: 56,
        labelAnchor: "center",
      },
      y: { label: null },
      style: {
        fontSize: "11px",
        color: t.textSecondary,
        background: "transparent",
      },
    });

    segmentChartRef.current.appendChild(plot);
    return () => plot.remove();
  }, [isDark, territory]);

  if (!user) {
    return (
      <div style={{ ...styles.stateBox, color: t.textSecondary }}>
        Please sign in to view territory data.
      </div>
    );
  }

  return (
    <div style={styles.wrapper}>

      {/* Summary Cards */}
      <div style={styles.summaryGrid}>
        {[
          { label: "Total Revenue",   value: loading ? "-" : `€${(totalRevenue / 1000).toFixed(1)}K`, accent: t.successLight },
          { label: "Total Orders",    value: loading ? "-" : totalOrders.toLocaleString(),             accent: t.accentLight  },
          { label: "Top Country",     value: loading ? "-" : topCountry,                               accent: t.accentLight  },
          { label: "Avg Order Value", value: loading ? "-" : `€${avgOrderValue.toFixed(0)}`,           accent: t.warningLight },
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
              <div style={{ ...styles.summaryValue, color: t.textPrimary }}>{card.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Interactive Map */}
      <div style={{ ...styles.mapCard, background: t.cardBg, border: `1px solid ${t.border}` }}>
        <h3 style={{ ...styles.chartTitle, color: t.textPrimary }}>Interactive Territory Map</h3>
        <p style={{ ...styles.chartSub, color: t.textSecondary }}>
          Scroll to zoom · Click and drag to pan · Hover markers for details
        </p>

        {loading ? (
          <div style={{ ...styles.stateBox, color: t.textSecondary }}>Loading map...</div>
        ) : (
          <div style={styles.mapWrapper}>
            <MapContainer
              center={[30, 10]}
              zoom={2}
              style={{ height: "400px", width: "100%", borderRadius: "8px" }}
              scrollWheelZoom={true}
            >
              {/* Map tiles - dark or light depending on the theme */}
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url={isDark
                  ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                  : "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                }
              />

              {/* Circle markers for each country */}
              {byCountry.map((country) => {
                const coords = COUNTRY_COORDS[country.country];
                if (!coords) return null;

                // Scale the radius between 12 and 40 based on the revenue
                const radius = 12 + (country.totalRevenue / maxRevenue) * 28;

                return (
                  <CircleMarker
                    key={country.country}
                    center={coords}
                    radius={radius}
                    pathOptions={{
                      fillColor:   isDark ? "#7c9fff" : "#1a2a6c",
                      fillOpacity: 0.7,
                      color: isDark ? "#bfdbfe" : "#ffffff",
                      weight: 2,
                    }}
                  >
                    <Tooltip permanent={false} direction="top">
                      <div style={{ fontSize: "12px", fontWeight: "600" }}>
                        {country.country}
                      </div>
                      <div style={{ fontSize: "11px" }}>
                        Revenue: €{country.totalRevenue.toLocaleString()}
                      </div>
                      <div style={{ fontSize: "11px" }}>
                        Orders: {country.totalOrders}
                      </div>
                    </Tooltip>
                  </CircleMarker>
                );
              })}
            </MapContainer>

            {/* Map legend */}
            <div style={{ ...styles.mapLegend, background: t.cardBg, border: `1px solid ${t.border}` }}>
              <div style={{ ...styles.legendTitle, color: t.textSecondary }}>Circle size = Revenue</div>
              {byCountry.slice(0, 3).map(d => (
                <div key={d.country} style={styles.legendItem}>
                  <div style={{
                    ...styles.legendDot,
                    background: isDark ? "#7c9fff" : "#1a2a6c",
                    opacity:    0.7,
                  }} />
                  <span style={{ ...styles.legendLabel, color: t.textSecondary }}>
                    {d.country} - €{(d.totalRevenue / 1000).toFixed(1)}K
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Revenue + Segment Charts */}
      <div style={styles.chartsGrid}>
        <div style={{ ...styles.chartCard, background: t.cardBg, border: `1px solid ${t.border}` }}>
          <h3 style={{ ...styles.chartTitle, color: t.textPrimary }}>Revenue by Country</h3>
          <p style={{ ...styles.chartSub, color: t.textSecondary }}>Total revenue per country</p>
          <div ref={revenueChartRef} style={{ width: "100%", marginTop: "12px" }} />
        </div>

        <div style={{ ...styles.chartCard, background: t.cardBg, border: `1px solid ${t.border}` }}>
          <h3 style={{ ...styles.chartTitle, color: t.textPrimary }}>Revenue by Segment</h3>
          <p style={{ ...styles.chartSub, color: t.textSecondary }}>Total revenue per client segment</p>
          <div ref={segmentChartRef} style={{ width: "100%", marginTop: "12px" }} />
        </div>
      </div>

      {/* Filters */}
      <div style={{ ...styles.filterBar, background: t.cardBg, border: `1px solid ${t.border}` }}>
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
          <option value="revenue">Sort by Revenue</option>
          <option value="orders">Sort by Orders</option>
          <option value="avg">Sort by Avg Order Value</option>
          <option value="country">Sort by Country</option>
        </select>
      </div>

      {/* Territory Table */}
      <div style={{ ...styles.tableCard, background: t.cardBg, border: `1px solid ${t.border}` }}>
        <div style={styles.tableHeader}>
          <div>
            <h3 style={{ ...styles.chartTitle, color: t.textPrimary }}>Territory Breakdown</h3>
            <p style={{ ...styles.chartSub, color: t.textSecondary }}>
              {loading ? "Loading..." : `${filtered.length} territory segments`}
            </p>
          </div>
        </div>

        {loading && (
          <div style={{ ...styles.stateBox, color: t.textSecondary }}>Loading territory data...</div>
        )}
        {error && !loading && (
          <div style={{ ...styles.stateBox, color: t.danger }}>Error: {error}</div>
        )}
        {!loading && !error && filtered.length === 0 && (
          <div style={{ ...styles.stateBox, color: t.textSecondary }}>No data available.</div>
        )}

        {!loading && !error && filtered.length > 0 && (
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${t.border}` }}>
                  {["Country", "Segment", "Total Revenue", "Total Orders", "Avg Order Value"].map((h) => (
                    <th key={h} style={{ ...styles.th, color: t.textSecondary }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((d, i) => (
                  <tr key={i} style={{ borderBottom: `1px solid ${t.borderLight}` }}>
                    <td style={{ ...styles.td, color: t.textPrimary, fontWeight: "500" }}>{d.country}</td>
                    <td style={{ ...styles.td, color: t.textSecondary }}>{d.clientSegment}</td>
                    <td style={{ ...styles.td, color: t.textPrimary, fontWeight: "600" }}>
                      €{d.totalRevenue.toLocaleString()}
                    </td>
                    <td style={{ ...styles.td, color: t.textSecondary }}>{d.totalOrders}</td>
                    <td style={{ ...styles.td, color: t.textSecondary }}>
                      €{d.avgOrderValue.toFixed(2)}
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

// THEME
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
    fontSize:   "22px",
    fontWeight: "700",
  },
  mapCard: {
    padding:      "20px",
    borderRadius: "10px",
  },
  mapWrapper: {
    position:   "relative",
    marginTop:  "12px",
  },
  mapLegend: {
    position:     "absolute",
    bottom:       "12px",
    right:        "12px",
    padding:      "10px 14px",
    borderRadius: "8px",
    zIndex:       1000,
    minWidth:     "160px",
  },
  legendTitle: {
    fontSize:     "10px",
    fontWeight:   "600",
    marginBottom: "6px",
    textTransform:"uppercase",
    letterSpacing:"0.4px",
  },
  legendItem: {
    display:    "flex",
    alignItems: "center",
    gap:        "6px",
    marginBottom:"4px",
  },
  legendDot: {
    width:        "10px",
    height:       "10px",
    borderRadius: "50%",
    flexShrink:   0,
  },
  legendLabel: {
    fontSize: "11px",
  },
  chartsGrid: {
    display:             "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap:                 "16px",
  },
  chartCard: {
    padding:      "20px",
    borderRadius: "10px",
  },
  chartTitle: {
    margin:     "0 0 2px 0",
    fontSize:   "14px",
    fontWeight: "600",
  },
  chartSub: {
    margin:   0,
    fontSize: "12px",
  },
  filterBar: {
    padding:      "16px 20px",
    borderRadius: "10px",
    display:      "flex",
    gap:          "10px",
    flexWrap:     "wrap",
    alignItems:   "center",
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
};

export default Territory;
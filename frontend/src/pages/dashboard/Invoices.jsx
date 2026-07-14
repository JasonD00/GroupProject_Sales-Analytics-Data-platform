/*
Sarah Molloy
*/

import { useEffect, useMemo, useRef, useState } from "react";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import * as Plot from "@observablehq/plot";
import ChartToggle from "../../components/ChartToggle";

function Invoices() {
  const { isDark } = useTheme();
  const { user } = useAuth();

  const t = isDark ? dark : light;
  const tier = user?.tier || "Growth";

  const statusChartRef = useRef(null);

  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("orderDate");

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          "http://localhost:8080/api/invoices/summary"
        );

        if (!response.ok) {
          throw new Error(
            `Failed to fetch invoices. Status: ${response.status}`
          );
        }

        const data = await response.json();

        const mappedInvoices = data.map((invoice, index) => ({
          id: `${invoice.orderNumber || "invoice"}-${index}`,
          orderNumber: invoice.orderNumber || "N/A",
          customerName: invoice.customerName || "Unknown customer",
          salesAmount: Number(invoice.salesAmount) || 0,
          orderDate: invoice.orderDate || null,
          dueDate: invoice.dueDate || null,
          status: invoice.invoiceStatus || "N/A",
        }));

        setInvoices(mappedInvoices);
      } catch (err) {
        console.error("Invoice fetch error:", err);
        setError(err.message || "Unable to load invoices");
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, []);

  const normaliseStatus = (status) => {
    return String(status || "")
      .trim()
      .toLowerCase();
  };

  const paidCount = invoices.filter(
    (invoice) => normaliseStatus(invoice.status) === "paid"
  ).length;

  const unpaidCount = invoices.filter(
    (invoice) => normaliseStatus(invoice.status) === "unpaid"
  ).length;

  const overdueCount = invoices.filter(
    (invoice) => normaliseStatus(invoice.status) === "overdue"
  ).length;

  const cancelledCount = invoices.filter(
    (invoice) => normaliseStatus(invoice.status) === "cancelled"
  ).length;

  const totalInvoices = invoices.length;

  const monthlyInvoices = useMemo(() => {
    return Array.from({ length: 12 }, (_, index) => {
      const monthNumber = index + 1;

      const count = invoices.filter((invoice) => {
        if (!invoice.orderDate) {
          return false;
        }

        const date = new Date(`${invoice.orderDate}T00:00:00`);

        if (Number.isNaN(date.getTime())) {
          return false;
        }

        return date.getMonth() === index;
      }).length;

      return {
        monthNum: monthNumber,
        count,
      };
    });
  }, [invoices]);

  const filteredInvoices = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    const results = invoices.filter((invoice) => {
      const matchesStatus =
        statusFilter === "all" ||
        normaliseStatus(invoice.status) === statusFilter;

      const matchesSearch =
        search === "" ||
        String(invoice.orderNumber).toLowerCase().includes(search) ||
        String(invoice.customerName).toLowerCase().includes(search) ||
        String(invoice.status).toLowerCase().includes(search) ||
        String(invoice.salesAmount).toLowerCase().includes(search);

      return matchesStatus && matchesSearch;
    });

    return [...results].sort((a, b) => {
      if (sortBy === "orderDate") {
        const dateA = a.orderDate
          ? new Date(`${a.orderDate}T00:00:00`).getTime()
          : 0;

        const dateB = b.orderDate
          ? new Date(`${b.orderDate}T00:00:00`).getTime()
          : 0;

        return dateB - dateA;
      }

      if (sortBy === "dueDate") {
        const dateA = a.dueDate
          ? new Date(`${a.dueDate}T00:00:00`).getTime()
          : 0;

        const dateB = b.dueDate
          ? new Date(`${b.dueDate}T00:00:00`).getTime()
          : 0;

        return dateB - dateA;
      }

      if (sortBy === "status") {
        return a.status.localeCompare(b.status);
      }

      if (sortBy === "customerName") {
        return a.customerName.localeCompare(b.customerName);
      }

      if (sortBy === "salesAmountHigh") {
        return b.salesAmount - a.salesAmount;
      }

      if (sortBy === "salesAmountLow") {
        return a.salesAmount - b.salesAmount;
      }

      return 0;
    });
  }, [invoices, searchTerm, statusFilter, sortBy]);

  useEffect(() => {
    if (!statusChartRef.current) {
      return undefined;
    }

    statusChartRef.current.innerHTML = "";

    const statusData = [
      {
        status: "Paid",
        count: paidCount,
        color: isDark ? "#22c55e" : "#16a34a",
      },
      {
        status: "Unpaid",
        count: unpaidCount,
        color: isDark ? "#fbbf24" : "#f59e0b",
      },
      {
        status: "Overdue",
        count: overdueCount,
        color: isDark ? "#ef4444" : "#dc2626",
      },
      {
        status: "Cancelled",
        count: cancelledCount,
        color: isDark ? "#94a3b8" : "#64748b",
      },
    ];

    if (statusData.every((item) => item.count === 0)) {
      return undefined;
    }

    const plot = Plot.plot({
      width: statusChartRef.current.offsetWidth || 400,
      height: 160,
      marginLeft: 90,
      marginRight: 35,
      marginBottom: 38,
      marginTop: 8,

      marks: [
        Plot.barX(statusData, {
          x: "count",
          y: "status",
          fill: (item) => item.color,
          rx: 3,
        }),

        Plot.text(statusData, {
          x: "count",
          y: "status",
          text: (item) => item.count,
          dx: 8,
          fill: isDark ? "#e2e8f0" : "#1a2a6c",
          fontSize: "11px",
          fontWeight: "600",
        }),

        Plot.ruleX([0]),
      ],

      x: {
        label: "Count",
        grid: true,
      },

      y: {
        label: null,
      },

      style: {
        fontSize: "11px",
        color: t.textSecondary,
        background: "transparent",
      },
    });

    statusChartRef.current.appendChild(plot);

    return () => {
      plot.remove();
    };
  }, [
    isDark,
    paidCount,
    unpaidCount,
    overdueCount,
    cancelledCount,
    t.textSecondary,
  ]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IE", {
      style: "currency",
      currency: "EUR",
    }).format(amount || 0);
  };

  const formatDate = (dateValue) => {
    if (!dateValue) {
      return "N/A";
    }

    const date = new Date(`${dateValue}T00:00:00`);

    if (Number.isNaN(date.getTime())) {
      return dateValue;
    }

    return date.toLocaleDateString("en-IE");
  };

  const getStatusStyle = (status) => {
    const normalisedStatus = normaliseStatus(status);

    if (normalisedStatus === "paid") {
      return t.success;
    }

    if (normalisedStatus === "overdue") {
      return t.danger;
    }

    if (normalisedStatus === "cancelled") {
      return t.muted;
    }

    if (normalisedStatus === "unpaid") {
      return t.warning;
    }

    return t.muted;
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.summaryGrid}>
        {[
          {
            label: "Total Invoices",
            value: totalInvoices,
            accent: t.accentLight,
          },
          {
            label: "Paid",
            value: paidCount,
            accent: t.successLight,
          },
          {
            label: "Unpaid",
            value: unpaidCount,
            accent: t.warningLight,
          },
          {
            label: "Overdue",
            value: overdueCount,
            accent: t.dangerLight,
          },
        ].map((card) => (
          <div
            key={card.label}
            style={{
              ...styles.summaryCard,
              background: t.cardBg,
              border: `1px solid ${t.border}`,
            }}
          >
            <div
              style={{
                ...styles.summaryAccent,
                background: card.accent,
              }}
            />

            <div>
              <div
                style={{
                  ...styles.summaryLabel,
                  color: t.textSecondary,
                }}
              >
                {card.label}
              </div>

              <div
                style={{
                  ...styles.summaryValue,
                  color: t.textPrimary,
                }}
              >
                {card.value}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={styles.chartsGrid}>
        <div
          style={{
            ...styles.chartCard,
            background: t.cardBg,
            border: `1px solid ${t.border}`,
          }}
        >
          <h3
            style={{
              ...styles.chartTitle,
              color: t.textPrimary,
            }}
          >
            Invoices per Month
          </h3>

          <p
            style={{
              ...styles.chartSub,
              color: t.textSecondary,
            }}
          >
            Monthly invoice trend
          </p>

          <ChartToggle
            data={monthlyInvoices}
            xKey="monthNum"
            yKey="count"
            xFormat={(monthNumber) =>
              [
                "",
                "Jan",
                "Feb",
                "Mar",
                "Apr",
                "May",
                "Jun",
                "Jul",
                "Aug",
                "Sep",
                "Oct",
                "Nov",
                "Dec",
              ][monthNumber]
            }
            xDomain={[0.5, 12.5]}
            yLabel="Invoices"
            height={220}
            tier={tier}
          />
        </div>

        <div
          style={{
            ...styles.chartCard,
            background: t.cardBg,
            border: `1px solid ${t.border}`,
          }}
        >
          <h3
            style={{
              ...styles.chartTitle,
              color: t.textPrimary,
            }}
          >
            Invoice Status
          </h3>

          <p
            style={{
              ...styles.chartSub,
              color: t.textSecondary,
            }}
          >
            Paid, unpaid, overdue and cancelled
          </p>

          {loading ? (
            <div
              style={{
                ...styles.loadingText,
                color: t.textSecondary,
              }}
            >
              Loading chart...
            </div>
          ) : paidCount === 0 &&
            unpaidCount === 0 &&
            overdueCount === 0 &&
            cancelledCount === 0 ? (
            <div
              style={{
                ...styles.loadingText,
                color: t.textSecondary,
              }}
            >
              No recognised invoice statuses found.
            </div>
          ) : (
            <div
              ref={statusChartRef}
              style={{
                width: "100%",
                marginTop: "12px",
              }}
            />
          )}
        </div>
      </div>

      <div
        style={{
          ...styles.filterBar,
          background: t.cardBg,
          border: `1px solid ${t.border}`,
        }}
      >
        <input
          type="text"
          placeholder="Search by order number, customer, amount or status..."
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          style={{
            ...styles.searchInput,
            background: t.inputBg,
            border: `1px solid ${t.border}`,
            color: t.textPrimary,
          }}
        />

        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
          style={{
            ...styles.select,
            background: t.inputBg,
            border: `1px solid ${t.border}`,
            color: t.textPrimary,
          }}
        >
          <option value="all">All Statuses</option>
          <option value="paid">Paid</option>
          <option value="unpaid">Unpaid</option>
          <option value="overdue">Overdue</option>
          <option value="cancelled">Cancelled</option>
        </select>

        <select
          value={sortBy}
          onChange={(event) => setSortBy(event.target.value)}
          style={{
            ...styles.select,
            background: t.inputBg,
            border: `1px solid ${t.border}`,
            color: t.textPrimary,
          }}
        >
          <option value="orderDate">Sort by Order Date</option>
          <option value="dueDate">Sort by Due Date</option>
          <option value="customerName">Sort by Customer</option>
          <option value="status">Sort by Status</option>
          <option value="salesAmountHigh">Amount: Highest First</option>
          <option value="salesAmountLow">Amount: Lowest First</option>
        </select>
      </div>

      <div
        style={{
          ...styles.tableCard,
          background: t.cardBg,
          border: `1px solid ${t.border}`,
        }}
      >
        <div style={styles.tableHeader}>
          <div>
            <h3
              style={{
                ...styles.chartTitle,
                color: t.textPrimary,
              }}
            >
              Invoice Directory
            </h3>

            <p
              style={{
                ...styles.chartSub,
                color: t.textSecondary,
              }}
            >
              {filteredInvoices.length} results
            </p>
          </div>
        </div>

        {loading ? (
          <div
            style={{
              ...styles.loadingText,
              color: t.textSecondary,
            }}
          >
            Loading invoices...
          </div>
        ) : error ? (
          <div
            style={{
              ...styles.errorText,
              color: t.danger,
            }}
          >
            Error: {error}
          </div>
        ) : filteredInvoices.length === 0 ? (
          <div
            style={{
              ...styles.loadingText,
              color: t.textSecondary,
            }}
          >
            No invoice records found.
          </div>
        ) : (
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr
                  style={{
                    borderBottom: `1px solid ${t.border}`,
                  }}
                >
                  {[
                    "Order Number",
                    "Customer",
                    "Sales Amount",
                    "Order Date",
                    "Due Date",
                    "Status",
                  ].map((heading) => (
                    <th
                      key={heading}
                      style={{
                        ...styles.th,
                        color: t.textSecondary,
                      }}
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {filteredInvoices.map((invoice) => (
                  <tr
                    key={invoice.id}
                    style={{
                      borderBottom: `1px solid ${t.borderLight}`,
                    }}
                  >
                    <td
                      style={{
                        ...styles.td,
                        color: t.textPrimary,
                        fontFamily: "monospace",
                        fontWeight: "600",
                      }}
                    >
                      {invoice.orderNumber}
                    </td>

                    <td
                      style={{
                        ...styles.td,
                        color: t.textPrimary,
                        fontWeight: "500",
                      }}
                    >
                      {invoice.customerName}
                    </td>

                    <td
                      style={{
                        ...styles.td,
                        color: t.textPrimary,
                        fontWeight: "600",
                      }}
                    >
                      {formatCurrency(invoice.salesAmount)}
                    </td>

                    <td
                      style={{
                        ...styles.td,
                        color: t.textSecondary,
                      }}
                    >
                      {formatDate(invoice.orderDate)}
                    </td>

                    <td
                      style={{
                        ...styles.td,
                        color: t.textSecondary,
                      }}
                    >
                      {formatDate(invoice.dueDate)}
                    </td>

                    <td style={styles.td}>
                      <span
                        style={{
                          ...styles.statusBadge,
                          background: getStatusStyle(invoice.status),
                          color: "#ffffff",
                        }}
                      >
                        {invoice.status}
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

const light = {
  textPrimary: "#1a2a6c",
  textSecondary: "#555",
  cardBg: "#ffffff",
  border: "#e0e4ef",
  borderLight: "#f0f2f7",
  inputBg: "#ffffff",
  accent: "#1a2a6c",
  success: "#16a34a",
  successLight: "#dcfce7",
  warning: "#f59e0b",
  warningLight: "#fef3c7",
  danger: "#dc2626",
  dangerLight: "#fee2e2",
  muted: "#64748b",
  accentLight: "#e0e7ff",
};

const dark = {
  textPrimary: "#e2e8f0",
  textSecondary: "#94a3b8",
  cardBg: "#1e293b",
  border: "#334155",
  borderLight: "#1e293b",
  inputBg: "#0f172a",
  accent: "#7c9fff",
  success: "#22c55e",
  successLight: "#064e3b",
  warning: "#fbbf24",
  warningLight: "#78350f",
  danger: "#ef4444",
  dangerLight: "#7f1d1d",
  muted: "#64748b",
  accentLight: "#1e3a8a",
};

const styles = {
  wrapper: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },

  summaryGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "16px",
  },

  summaryCard: {
    padding: "18px 20px",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    gap: "14px",
  },

  summaryAccent: {
    width: "4px",
    height: "40px",
    borderRadius: "4px",
    flexShrink: 0,
  },

  summaryLabel: {
    fontSize: "12px",
    marginBottom: "4px",
  },

  summaryValue: {
    fontSize: "24px",
    fontWeight: "700",
  },

  chartsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
    gap: "16px",
  },

  chartCard: {
    padding: "20px",
    borderRadius: "10px",
    minWidth: 0,
  },

  chartTitle: {
    margin: "0 0 2px 0",
    fontSize: "14px",
    fontWeight: "600",
  },

  chartSub: {
    margin: 0,
    fontSize: "12px",
  },

  loadingText: {
    padding: "40px",
    textAlign: "center",
    fontSize: "13px",
  },

  errorText: {
    padding: "20px",
    textAlign: "center",
    fontSize: "13px",
  },

  filterBar: {
    padding: "16px 20px",
    borderRadius: "10px",
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
    alignItems: "center",
  },

  searchInput: {
    flex: 1,
    minWidth: "220px",
    padding: "8px 14px",
    borderRadius: "6px",
    fontSize: "13px",
    outline: "none",
  },

  select: {
    padding: "8px 12px",
    borderRadius: "6px",
    fontSize: "13px",
    cursor: "pointer",
    outline: "none",
  },

  tableCard: {
    padding: "20px",
    borderRadius: "10px",
  },

  tableHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "16px",
  },

  tableWrapper: {
    overflowX: "auto",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    minWidth: "850px",
  },

  th: {
    padding: "10px 14px",
    textAlign: "left",
    fontSize: "11px",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: "0.4px",
  },

  td: {
    padding: "11px 14px",
    fontSize: "13px",
  },

  statusBadge: {
    display: "inline-block",
    padding: "3px 9px",
    borderRadius: "20px",
    fontSize: "11px",
    fontWeight: "600",
  },
};

export default Invoices;
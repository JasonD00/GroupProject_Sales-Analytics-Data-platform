import {
  monthlyRevenue,
  salesByRegion,
  salesByRep,
  transactions,
} from "../data/mockData";

// simulate API delay
const delay = (ms) => new Promise((res) => setTimeout(res, ms));

export const getMonthlyRevenue = async () => {
  await delay(300);
  return monthlyRevenue;
};

export const getSalesByRegion = async () => {
  await delay(300);
  return salesByRegion;
};

export const getSalesByRep = async () => {
  await delay(300);
  return salesByRep;
};

export const getTransactions = async () => {
  await delay(300);
  return transactions;
};

// KPI calculations
export const getKPIs = async () => {
  await delay(300);

  const totalRevenue = transactions.reduce((sum, tx) => sum + tx.amount, 0);
  const totalOrders = transactions.length;

  const uniqueCustomers = new Set(transactions.map((t) => t.customer)).size;

  const avgOrderValue = totalOrders ? totalRevenue / totalOrders : 0;

  return [
    {
      label: "Total Revenue",
      value: `$${totalRevenue.toLocaleString()}`,
      change: "12%",
      up: true,
    },
    {
      label: "Total Orders",
      value: totalOrders.toString(),
      change: "8%",
      up: true,
    },
    {
      label: "Active Customers",
      value: uniqueCustomers.toString(),
      change: "5%",
      up: true,
    },
    {
      label: "Avg Order Value",
      value: `$${Math.round(avgOrderValue)}`,
      change: "3%",
      up: true,
    },
  ];
};
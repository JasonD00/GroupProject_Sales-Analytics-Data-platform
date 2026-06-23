// TO-DO

import { useTheme } from "../../context/ThemeContext";

function Invoices() {
  const { isDark } = useTheme();
  const t = isDark ? dark : light;

  return (
    <div style={{ padding: "40px", textAlign: "center" }}>
    </div>
  );
}

const light = { textSecondary: "#555" };
const dark  = { textSecondary: "#94a3b8" };

export default Invoices;
import { useEffect, useRef } from "react";
import * as Plot from "@observablehq/plot";
import { useTheme } from "../context/ThemeContext";

function RevenueAreaChart({ data, title }) {
  const containerRef = useRef(null);
  const { isDark } = useTheme();
  const t = isDark ? dark : light;

  useEffect(() => {
    if (!containerRef.current || !data || data.length === 0) return;

    containerRef.current.innerHTML = "";

    try {
      const plot = Plot.plot({
        width: containerRef.current.parentElement.offsetWidth - 48,
        height: 350,
        marginLeft: 60,
        marginRight: 20,
        marginTop: 20,
        marginBottom: 40,
        y: { 
          grid: true,
          label: "Revenue (€)",
          tickFormat: d => `€${(d / 1000).toFixed(0)}k`
        },
        x: {
          label: null,
          domain: [0.5, 12.5],
          tickFormat: (d) => {
            const monthNames = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            return monthNames[d] || "";
          },
        },
        color: { 
          legend: false,
        },
        style: {
          fontSize: "12px",
          fontFamily: "Arial, sans-serif",
          color: t.textSecondary,
        },
        marks: [
          () => {
            const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
            const gradient = document.createElementNS("http://www.w3.org/2000/svg", "linearGradient");
            
            gradient.setAttribute("id", `gradient-${Math.random()}`);
            gradient.setAttribute("gradientTransform", "rotate(90)");
            
            const stop1 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
            stop1.setAttribute("offset", "20%");
            stop1.setAttribute("stop-color", t.accent);
            stop1.setAttribute("stop-opacity", "0.6");
            
            const stop2 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
            stop2.setAttribute("offset", "100%");
            stop2.setAttribute("stop-color", t.accent);
            stop2.setAttribute("stop-opacity", "0");
            
            gradient.appendChild(stop1);
            gradient.appendChild(stop2);
            defs.appendChild(gradient);
            svg.appendChild(defs);
            
            return svg;
          },
          
          Plot.areaY(data, {
            x: "monthNum",
            y: "revenue",
            fill: isDark ? "#7c9fff" : "#1a2a6c",
            opacity: 0.2,
          }),
          
          Plot.lineY(data, {
            x: "monthNum",
            y: "revenue",
            stroke: t.accent,
            strokeWidth: 2.5,
          }),
          
          Plot.dot(data, {
            x: "monthNum",
            y: "revenue",
            fill: t.accent,
            r: 4,
            strokeWidth: 0,
          }),
          
          Plot.ruleY([0], { stroke: t.border }),
        ],
      });

      containerRef.current.appendChild(plot);
    } catch (error) {
      console.error("Error rendering plot:", error);
      containerRef.current.innerHTML = "<p>Error rendering chart</p>";
    }

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
    };
  }, [data, isDark, t.accent, t.textSecondary, t.border]);

  return (
    <div style={{ ...styles.container }}>
      <h3 style={{ ...styles.title, color: t.textPrimary }}>{title}</h3>
      <div 
        ref={containerRef} 
        style={{ ...styles.chartContainer, background: t.cardBg, borderColor: t.border }}
      />
    </div>
  );
}

const light = {
  textPrimary: "#1a2a6c",
  textSecondary: "#555",
  cardBg: "#ffffff",
  border: "#e0e4ef",
  accent: "#1a2a6c",
};

const dark = {
  textPrimary: "#e2e8f0",
  textSecondary: "#94a3b8",
  cardBg: "#1e293b",
  border: "#334155",
  accent: "#7c9fff",
};

const styles = {
  container: {
    borderRadius: "10px",
    overflow: "hidden",
  },
  title: {
    margin: "0 0 16px 24px",
    fontSize: "16px",
    fontWeight: "700",
  },
  chartContainer: {
    padding: "24px",
    border: "1px solid",
    borderRadius: "10px",
  },
};

export default RevenueAreaChart;
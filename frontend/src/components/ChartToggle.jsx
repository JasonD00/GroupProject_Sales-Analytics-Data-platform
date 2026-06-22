/*
    Overview:
    Reusable Observable Plot charts with type switching
    Renders the area, line or bar charts with toggle buttons
    Available charts are sorted by tier - Growth gets Area only, Pro gets Line added and Enterprise gets Bar added 
*/

import { useRef, useEffect, useState } from "react";
import { useTheme } from "../context/ThemeContext";
import * as Plot from "@observablehq/plot";

const TIER_CHARTS = {
  Growth:     ["Area"],
  Pro:        ["Area", "Line"],
  Enterprise: ["Area", "Line", "Bar"],
};

function ChartToggle({
  data    = [],
  xKey    = "x",
  yKey    = "y",
  xFormat = null,
  xDomain = null,
  yLabel  = "",
  height  = 280,
  tier    = "Growth",
}) {
  const { isDark }     = useTheme();
  const t              = isDark ? dark : light;
  const chartRef       = useRef(null);
  const available      = TIER_CHARTS[tier] || ["Area"];
  const [type, setType] = useState("Area");

  useEffect(() => {
    if (!available.includes(type)) setType("Area");
  }, [tier]);

  useEffect(() => {
    if (!chartRef.current || data.length === 0) return;
    chartRef.current.innerHTML = "";

    const width      = chartRef.current.offsetWidth || 500;
    const accent     = isDark ? "#7c9fff" : "#1a2a6c";
    const accentFill = isDark ? "#1e3a8a" : "#dde4f7";
    const marks      = [];

    if (type === "Area") {
      marks.push(
        Plot.areaY(data, {
          x: xKey, y: yKey,
          fill:        accentFill,
          stroke:      accent,
          strokeWidth: 2,
          curve:       "monotone-x",
        }),
        Plot.lineY(data, {
          x: xKey, y: yKey,
          stroke:      accent,
          strokeWidth: 2,
          curve:       "monotone-x",
        }),
        Plot.dot(data, {
          x: xKey, y: yKey,
          fill:        accent,
          stroke:      isDark ? "#1e293b" : "#fff",
          strokeWidth: 1.5,
          r:           4,
        }),
        Plot.ruleY([0], { stroke: t.rule }),
      );
    }

    if (type === "Line") {
      marks.push(
        Plot.lineY(data, {
          x: xKey, y: yKey,
          stroke:      accent,
          strokeWidth: 2.5,
          curve:       "monotone-x",
        }),
        Plot.dot(data, {
          x: xKey, y: yKey,
          fill:        accent,
          stroke:      isDark ? "#1e293b" : "#fff",
          strokeWidth: 2,
          r:           5,
        }),
        Plot.ruleY([0], { stroke: t.rule }),
      );
    }

    if (type === "Bar") {
      const xVals = data.map(d => d[xKey]);
      const xMin  = Math.min(...xVals);
      const xMax  = Math.max(...xVals);
      const barW  = data.length > 1 ? ((xMax - xMin) / data.length) * 0.75 : 0.75;

      marks.push(
        Plot.rectY(data, {
          x1:  (d) => d[xKey] - barW / 2,
          x2:  (d) => d[xKey] + barW / 2,
          y1:  0,
          y2:  (d) => d[yKey],
          fill: accent,
          rx:   2,
        }),
        Plot.ruleY([0], { stroke: t.rule }),
      );
    }

    const plot = Plot.plot({
      width,
      height,
      marginLeft:   90,
      marginBottom: 44,
      marginTop:    12,
      marginRight:  16,
      marks,
      x: {
        label:      null,
        tickSize:   4,
        tickPadding: 6,
        ...(xDomain && { domain: xDomain }),
        ...(xFormat && { tickFormat: xFormat }),
      },
      y: {
        label:       yLabel,
        labelOffset: 72,
        labelAnchor: "center",
        grid:        true,
        tickSize:    4,
        tickPadding: 8,
      },
      style: { fontSize: "12px", color: t.text, background: "transparent" },
    });

    chartRef.current.appendChild(plot);
    return () => plot.remove();
  }, [type, data, isDark, height]);

  return (
    <div style={styles.wrapper}>
      <div style={styles.toggleRow}>
        <div style={styles.btns}>
          {available.map((tp) => (
            <button
              key={tp}
              onClick={() => setType(tp)}
              style={{
                ...styles.btn,
                background: type === tp ? t.activeBg   : "transparent",
                color:      type === tp ? t.activeText : t.muted,
                border:     `1px solid ${type === tp ? t.activeBg : "transparent"}`,
              }}
            >
              {tp}
            </button>
          ))}
        </div>
        {tier === "Growth"     && <span style={{ ...styles.hint, color: t.muted }}>Upgrade to Pro for Line + Bar charts</span>}
        {tier === "Pro"        && <span style={{ ...styles.hint, color: t.muted }}>Upgrade to Enterprise for Bar charts</span>}
      </div>
      <div ref={chartRef} style={{ width: "100%" }} />
    </div>
  );
}

//STYLING
const light = {
  text:       "#555",
  rule:       "#e0e4ef",
  activeBg:   "#1a2a6c",
  activeText: "#fff",
  muted:      "#bbb",
};
const dark = {
  text:       "#94a3b8",
  rule:       "#334155",
  activeBg:   "#7c9fff",
  activeText: "#0f172a",
  muted:      "#475569",
};

const styles = {
  wrapper: {
    display:       "flex",
    flexDirection: "column",
    width:         "100%",
  },
  toggleRow: {
    display:      "flex",
    alignItems:   "center",
    gap:          "12px",
    marginBottom: "10px",
    flexWrap:     "wrap",
  },
  btns: {
    display: "flex",
    gap:     "4px",
  },
  btn: {
    padding:      "4px 13px",
    borderRadius: "6px",
    fontSize:     "12px",
    fontWeight:   "600",
    cursor:       "pointer",
    transition:   "all 0.12s",
    lineHeight:   1.5,
  },
  hint: {
    fontSize: "11px",
  },
};

export default ChartToggle;
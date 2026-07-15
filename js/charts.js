// charts.js — SVG donut and bar chart rendering

import { pct, fmtDateShort } from "./utils.js";
import { getAttendanceForDate } from "./data.js";

export function donutChart(p, a, l) {
  var t = p + a + l;
  if (!t) return '<div class="empty-state" style="padding:2rem;"><p>No data to display</p></div>';
  var r = 70, cx = 90, cy = 90, C = 2 * Math.PI * r;
  var pL = C * p / t, aL = C * a / t, lL = C * l / t;
  return '<svg class="chart-svg" viewBox="0 0 180 180" style="max-width:200px;margin:0 auto;">' +
    '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="none" stroke="var(--surface-2)" stroke-width="22"/>' +
    dSeg(cx, cy, r, C, pL, 0, "var(--success)") +
    dSeg(cx, cy, r, C, aL, -pL, "var(--danger)") +
    dSeg(cx, cy, r, C, lL, -(pL + aL), "var(--warning)") +
    '<text class="donut-center-text donut-center-value" x="' + cx + '" y="' + (cy - 2) + '">' + pct(p + l, t) + '%</text>' +
    '<text class="donut-center-text donut-center-label" x="' + cx + '" y="' + (cy + 16) + '">Attendance</text></svg>' +
    '<div class="chart-legend">' +
    '<div class="chart-legend-item"><div class="chart-legend-dot" style="background:var(--success)"></div>Present (' + p + ')</div>' +
    '<div class="chart-legend-item"><div class="chart-legend-dot" style="background:var(--danger)"></div>Absent (' + a + ')</div>' +
    '<div class="chart-legend-item"><div class="chart-legend-dot" style="background:var(--warning)"></div>Late (' + l + ')</div></div>';
}

function dSeg(cx, cy, r, C, len, off, c) {
  if (len <= 0) return "";
  return '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="none" stroke="' + c +
    '" stroke-width="22" stroke-dasharray="' + len + " " + (C - len) +
    '" stroke-dashoffset="' + off + '" transform="rotate(-90 ' + cx + " " + cy + ')"' +
    ' style="transition:stroke-dasharray 0.6s ease,stroke-dashoffset 0.6s ease"/>';
}

export function barChart(labels, values, mx) {
  if (!values.length || !mx)
    return '<div class="empty-state" style="padding:2rem;"><p>No attendance data yet</p></div>';
  var cH = 200, pad = 40, bW = 24, gap = 16, tW = labels.length * (bW + gap) + pad * 2, sH = cH - pad * 2;
  var bars = "", grid = "";
  for (var g = 0; g <= 4; g++) {
    var gy = pad + (sH / 4) * g;
    grid += '<line x1="' + pad + '" y1="' + gy + '" x2="' + (tW - pad) + '" y2="' + gy + '" stroke="var(--border)" stroke-width="1"/>';
  }
  for (var i = 0; i < values.length; i++) {
    var h = (values[i] / mx) * sH, x = pad + i * (bW + gap), y = cH - pad - h;
    bars += '<rect x="' + x + '" y="' + y + '" width="' + bW + '" height="' + h + '" rx="4" fill="var(--accent)" style="transition:height 0.5s ease"/>';
    bars += '<text x="' + (x + bW / 2) + '" y="' + (cH - pad + 14) + '" text-anchor="middle" font-size="9" fill="var(--text-3)">' + labels[i] + '</text>';
    bars += '<text x="' + (x + bW / 2) + '" y="' + (y - 5) + '" text-anchor="middle" font-size="9" fill="var(--text-2)" font-weight="600">' + values[i] + '</text>';
  }
  return '<svg class="chart-svg" viewBox="0 0 ' + tW + " " + cH + '">' + grid + bars + '</svg>';
}

export function trendChart() {
  var days = 14, lb = [], vl = [], mx = 0;
  for (var i = days - 1; i >= 0; i--) {
    var d = new Date();
    d.setDate(d.getDate() - i);
    var iso = d.toISOString().slice(0, 10);
    var recs = getAttendanceForDate(iso);
    var p = recs.filter(function (a) { return a.status === "present" || a.status === "late"; }).length;
    lb.push(fmtDateShort(iso));
    vl.push(p);
    if (p > mx) mx = p;
  }
  return barChart(lb, vl, mx);
}

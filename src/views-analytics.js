// views-analytics.js — analytics, calendar, and at-risk views

import { state } from "./state.js";
import { IMG, SVG, icon } from "./icons.js";
import { esc, cap, fmtDate, fmtDateShort } from "./utils.js";
import { findStudent, attendanceSummary, atRiskStudents, dailyRate } from "./data.js";
import { donutChart, trendChart } from "./charts.js";
import { setTopbar, statCard, studentAvatarHTML, emptyState } from "./views-layout.js";
import { render } from "./nav.js";

export function renderAnalytics() {
  setTopbar("Analytics", "Visualize attendance trends and distributions");
  var d = document.createElement("div");
  var aP = state.attendance.filter(function (a) { return a.status === "present"; }).length;
  var aA = state.attendance.filter(function (a) { return a.status === "absent"; }).length;
  var aL = state.attendance.filter(function (a) { return a.status === "late"; }).length;

  var cM = {};
  state.students.forEach(function (s) { if (!cM[s.course]) cM[s.course] = { present: 0, absent: 0, late: 0, total: 0 }; });
  state.attendance.forEach(function (a) { var s = findStudent(a.studentId); if (s && cM[s.course]) { cM[s.course][a.status]++; cM[s.course].total++; } });

  var cR = Object.keys(cM).map(function (c) {
    var b = cM[c], r = b.total ? Math.round(((b.present + b.late * 0.5) / b.total) * 100) : 0;
    var bd = r >= 75 ? "badge-excellent" : r >= 50 ? "badge-warning" : "badge-critical";
    var bc = r >= 75 ? "good" : r >= 50 ? "warn" : "bad";
    return '<tr><td><strong>' + esc(c) + '</strong></td><td>' + b.present + '</td><td>' + b.absent + '</td><td>' + b.late + '</td><td>' + b.total + '</td><td class="rate-cell"><div class="rate-text"><span class="badge ' + bd + '">' + r + '%</span></div><div class="progress-bar"><div class="progress-fill ' + bc + '" style="width:' + r + '%"></div></div></td></tr>';
  }).join("");
  if (!cR) cR = '<tr><td colspan="6" style="text-align:center;padding:2rem;color:var(--text-3);">No data available.</td></tr>';

  d.innerHTML =
    '<div class="panel"><div class="panel-header"><h2>14-Day Attendance Trend</h2><span class="panel-sub">Students present per day</span></div><div class="panel-body chart-container">' + trendChart() + '</div></div>' +
    '<div class="two-col"><div class="panel"><div class="panel-header"><h2>Overall Distribution</h2></div><div class="panel-body chart-container">' + donutChart(aP, aA, aL) + '</div></div>' +
    '<div class="panel"><div class="panel-header"><h2>Quick Stats</h2></div><div class="panel-body"><div style="display:flex;flex-direction:column;gap:1rem;">' +
    '<div class="flex-between"><span class="text-sm text-muted">Total Sessions Recorded</span><strong>' + state.attendance.length + '</strong></div>' +
    '<div class="flex-between"><span class="text-sm text-muted">Total Students</span><strong>' + state.students.length + '</strong></div>' +
    '<div class="flex-between"><span class="text-sm text-muted">Present Records</span><strong style="color:var(--success)">' + aP + '</strong></div>' +
    '<div class="flex-between"><span class="text-sm text-muted">Absent Records</span><strong style="color:var(--danger)">' + aA + '</strong></div>' +
    '<div class="flex-between"><span class="text-sm text-muted">Late Records</span><strong style="color:var(--warning)">' + aL + '</strong></div>' +
    '<div class="flex-between"><span class="text-sm text-muted">At-Risk Students</span><strong style="color:var(--danger)">' + atRiskStudents().length + '</strong></div>' +
    '<div class="flex-between"><span class="text-sm text-muted">Classes</span><strong>' + state.classes.length + '</strong></div>' +
    '</div></div></div></div>' +
    '<div class="panel"><div class="panel-header"><h2>Course-Level Breakdown</h2></div><div class="panel-body flush"><div class="table-wrap"><table><thead><tr><th>Course</th><th>Present</th><th>Absent</th><th>Late</th><th>Total</th><th>Rate</th></tr></thead><tbody>' + cR + '</tbody></table></div></div></div>';
  return d;
}

export function renderCalendar() {
  setTopbar("Calendar", "Daily attendance rate heatmap");
  var d = document.createElement("div");
  var now = new Date(), yr = now.getFullYear(), mo = now.getMonth();
  var fD = new Date(yr, mo, 1), dIM = new Date(yr, mo + 1, 0).getDate(), sD = fD.getDay();
  var mN = now.toLocaleDateString(undefined, { month: "long", year: "numeric" });
  var cells = "";
  ["S", "M", "T", "W", "T", "F", "S"].forEach(function (dl) { cells += '<div style="text-align:center;font-size:0.72rem;font-weight:700;color:var(--text-3);padding:0.4rem 0;">' + dl + '</div>'; });
  for (var i = 0; i < sD; i++) cells += '<div class="cal-empty"></div>';
  for (var dt = 1; dt <= dIM; dt++) {
    var iso = new Date(yr, mo, dt).toISOString().slice(0, 10);
    var r = dailyRate(iso);
    var cls = "cal-na", lb = iso;
    if (r !== null) { cls = r >= 75 ? "cal-good" : r >= 50 ? "cal-warn" : "cal-bad"; lb = fmtDate(iso) + " · " + r + "% present"; }
    cells += '<div class="calendar-day ' + cls + '" title="' + lb + '">' + dt + '</div>';
  }
  d.innerHTML = '<div class="panel"><div class="calendar-month-label">' + mN + '</div><div class="calendar-grid">' + cells + '</div><div class="calendar-legend"><div class="calendar-legend-item"><div class="calendar-legend-box cal-good"></div>≥75%</div><div class="calendar-legend-item"><div class="calendar-legend-box cal-warn"></div>50-74%</div><div class="calendar-legend-item"><div class="calendar-legend-box cal-bad"></div><50%</div><div class="calendar-legend-item"><div class="calendar-legend-box cal-na"></div>No data</div></div></div>';
  return d;
}

export function renderAtRisk() {
  setTopbar("At-Risk Students", "Students with attendance below 75%");
  var d = document.createElement("div");
  var risk = atRiskStudents().sort(function (a, b) { return attendanceSummary(a.id).rate - attendanceSummary(b.id).rate; });
  if (!risk.length) {
    d.innerHTML = '<div class="panel"><div class="panel-body">' + emptyState(IMG.emptyCheck, "No at-risk students. Everyone is above 75% attendance.") + '</div></div>';
    return d;
  }
  var rows = risk.map(function (s) {
    var sm = attendanceSummary(s.id);
    var bd = sm.rate >= 50 ? "badge-warning" : "badge-critical";
    var bc = sm.rate >= 50 ? "warn" : "bad";
    return '<tr class="clickable-row" data-profile="' + s.id + '"><td><div style="display:flex;align-items:center;gap:0.6rem;">' + studentAvatarHTML(s, 32) + '<strong>' + esc(s.name) + '</strong></div></td><td class="id-badge">' + esc(s.matric) + '</td><td>' + esc(s.course) + '</td><td class="rate-cell"><div class="rate-text"><span class="badge ' + bd + '">' + sm.rate + '%</span><span class="text-muted">' + sm.present + "/" + sm.total + '</span></div><div class="progress-bar"><div class="progress-fill ' + bc + '" style="width:' + sm.rate + '%"></div></div></td></tr>';
  }).join("");
  d.innerHTML = '<div class="alert-banner"><span class="alert-icon">' + SVG.alert + '</span><span>' + risk.length + ' student' + (risk.length > 1 ? "s" : "") + ' below the 75% attendance threshold. Consider follow-up action.</span></div><div class="panel"><div class="panel-body flush"><div class="table-wrap"><table><thead><tr><th>Name</th><th>Index No.</th><th>Course</th><th>Attendance</th></tr></thead><tbody>' + rows + '</tbody></table></div></div></div>';
  d.querySelectorAll("[data-profile]").forEach(function (r) {
    r.addEventListener("click", function () { state.profileId = r.getAttribute("data-profile"); state.view = "students"; render(); });
  });
  return d;
}

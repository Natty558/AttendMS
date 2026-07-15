// pages/analytics.js — analytics page

import { state } from "../state.js";
import { esc } from "../utils.js";
import { findStudent, attendanceSummary, atRiskStudents } from "../data.js";
import { donutChart, trendChart } from "../charts.js";
import { initPage, getContainer, statCard } from "../layout.js";

initPage("analytics", "Analytics", "Visualize attendance trends and distributions");

var c = getContainer();
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

c.innerHTML =
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

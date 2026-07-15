// pages/dashboard.js — dashboard page

import { state } from "../state.js";
import { IMG, SVG, icon } from "../icons.js";
import { esc, todayISO, fmtDate, pct, cap } from "../utils.js";
import { getAttendanceForDate, atRiskStudents } from "../data.js";
import { donutChart } from "../charts.js";
import { initPage, getContainer, statCard, emptyState } from "../layout.js";

initPage("dashboard", "Dashboard", "Overview of attendance statistics");

var c = getContainer();
var total = state.students.length;
var tR = getAttendanceForDate(todayISO());
var pT = tR.filter(function (a) { return a.status === "present" || a.status === "late"; }).length;
var aT = tR.filter(function (a) { return a.status === "absent"; }).length;
var tR2 = state.attendance.length;
var aP = state.attendance.filter(function (a) { return a.status === "present"; }).length;
var aA = state.attendance.filter(function (a) { return a.status === "absent"; }).length;
var aL = state.attendance.filter(function (a) { return a.status === "late"; }).length;
var oR = tR2 ? Math.round((aP / tR2) * 100) : 0;
var risk = atRiskStudents();

var aH = risk.length
  ? '<div class="alert-banner"><span class="alert-icon">' + SVG.alert + '</span><span><strong>' + risk.length + ' student' + (risk.length > 1 ? "s" : "") + '</strong> below 75% attendance. <a href="/atrisk.html" style="color:var(--danger);font-weight:600;">View list</a></span></div>'
  : "";

var snap = tR.length
  ? '<div class="progress-bar"><div class="progress-fill good" style="width:' + pct(pT, tR.length) + '%"></div></div><p class="mt-1 text-sm text-muted">' + pT + " of " + tR.length + " students present today (" + pct(pT, tR.length) + "%)</p>"
  : emptyState(IMG.emptyAttendance, "No attendance recorded yet today.");

var rT = total
  ? '<div class="table-wrap"><table><thead><tr><th>Name</th><th>Index No.</th><th>Course</th><th>Level</th></tr></thead><tbody>' +
    state.students.slice(-5).reverse().map(function (s) {
      return '<tr class="clickable-row" data-href="/students.html?id=' + s.id + '"><td><strong>' + esc(s.name) + '</strong></td><td class="id-badge">' + esc(s.matric) + '</td><td>' + esc(s.course) + '</td><td>' + esc(s.level) + '</td></tr>';
    }).join("") + '</tbody></table></div>'
  : emptyState(IMG.emptyStudents, "No students registered yet.");

c.innerHTML = aH +
  '<div class="stats-grid">' +
  statCard("icon-blue", "users", total, "Registered Students") +
  statCard("icon-green", "check", pT, "Present Today") +
  statCard("icon-red", "x", aT, "Absent Today") +
  statCard("icon-amber", "trendingUp", oR + "%", "Overall Attendance Rate") +
  "</div>" +
  '<div class="two-col">' +
  '<div class="panel"><div class="panel-header"><h2>Today\'s Snapshot</h2><span class="badge badge-slate">' + fmtDate(todayISO()) + '</span></div><div class="panel-body">' + snap + '</div></div>' +
  '<div class="panel"><div class="panel-header"><h2>Overall Distribution</h2></div><div class="panel-body chart-container">' + donutChart(aP, aA, aL) + "</div></div>" +
  "</div>" +
  '<div class="panel"><div class="panel-header"><h2>Recent Students</h2><a href="/students.html" class="btn btn-accent btn-sm">' + icon("plus", "icon-sm") + ' View All</a></div><div class="panel-body flush">' + rT + "</div></div>";

c.querySelectorAll("[data-href]").forEach(function (r) {
  r.addEventListener("click", function () {
    window.location.href = r.getAttribute("data-href");
  });
});

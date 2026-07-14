// views-reports.js — reports view with filters, CSV export, and print

import { state } from "./state.js";
import { IMG, SVG, icon } from "./icons.js";
import { esc, cap, toast, fmtDate, todayISO } from "./utils.js";
import { findStudent, exportCSV } from "./data.js";
import { setTopbar, statCard, emptyState } from "./views-layout.js";
import { render } from "./nav.js";

export function renderReports() {
  setTopbar("Reports", "Generate and export attendance reports");
  var d = document.createElement("div");
  d.innerHTML =
    '<div class="panel"><div class="panel-header"><h2>Filters</h2></div><div class="panel-body"><div class="toolbar"><select id="rep-student"><option value="">All Students</option></select>' +
    '<label style="font-size:0.82rem;color:var(--text-2);">From:</label><input type="date" id="rep-from"/><label style="font-size:0.82rem;color:var(--text-2);">To:</label><input type="date" id="rep-to"/>' +
    '<button class="btn btn-accent btn-sm" id="rep-run">Generate</button><button class="btn btn-outline btn-sm" id="rep-csv">' + icon("download", "icon-sm") + ' Export CSV</button><button class="btn btn-ghost btn-sm btn-icon" id="rep-print" title="Print">' + SVG.print + '</button></div></div></div>' +
    '<div id="rep-results"></div>';

  var sel = d.querySelector("#rep-student");
  state.students.forEach(function (s) { var o = document.createElement("option"); o.value = s.id; o.textContent = s.name + " (" + s.matric + ")"; sel.appendChild(o); });
  var rc = d.querySelector("#rep-results"), lR = [];

  function runReport() {
    var sid = sel.value, from = d.querySelector("#rep-from").value, to = d.querySelector("#rep-to").value;
    var recs = state.attendance.filter(function (a) {
      if (sid && a.studentId !== sid) return false;
      if (from && a.date < from) return false;
      if (to && a.date > to) return false;
      return true;
    });
    lR = recs;
    if (!recs.length) { rc.innerHTML = '<div class="panel"><div class="panel-body">' + emptyState(IMG.emptyReports, "No attendance records found for the selected filters.") + '</div></div>'; return; }
    var p = recs.filter(function (a) { return a.status === "present"; }).length;
    var ab = recs.filter(function (a) { return a.status === "absent"; }).length;
    var l = recs.filter(function (a) { return a.status === "late"; }).length;
    var t = recs.length;
    var sh = '<div class="stats-grid">' + statCard("icon-blue", "clipboard", t, "Total Records") + statCard("icon-green", "check", p, "Present") + statCard("icon-red", "x", ab, "Absent") + statCard("icon-amber", "clock", l, "Late") + '</div>';
    var bS = {};
    recs.forEach(function (a) { if (!bS[a.studentId]) bS[a.studentId] = { present: 0, absent: 0, late: 0, total: 0 }; bS[a.studentId][a.status]++; bS[a.studentId].total++; });
    var br = Object.keys(bS).map(function (sid) {
      var s = findStudent(sid), b = bS[sid], r = Math.round(((b.present + b.late * 0.5) / b.total) * 100);
      var bd = r >= 75 ? "badge-excellent" : r >= 50 ? "badge-warning" : "badge-critical";
      return '<tr class="clickable-row" data-profile="' + sid + '"><td><strong>' + esc(s ? s.name : "Unknown") + '</strong></td><td class="id-badge">' + esc(s ? s.matric : "—") + '</td><td><span class="badge badge-present">' + b.present + '</span></td><td><span class="badge badge-absent">' + b.absent + '</span></td><td><span class="badge badge-late">' + b.late + '</span></td><td><span class="badge ' + bd + '">' + r + '%</span></td></tr>';
    }).join("");
    var bh = '<div class="panel"><div class="panel-header"><h2>Per-Student Breakdown</h2></div><div class="panel-body flush"><div class="table-wrap"><table><thead><tr><th>Student</th><th>Index No.</th><th>Present</th><th>Absent</th><th>Late</th><th>Rate</th></tr></thead><tbody>' + br + '</tbody></table></div></div></div>';
    var sr = recs.slice().sort(function (a, b) { return b.date.localeCompare(a.date); });
    var dr = sr.map(function (a) {
      var s = findStudent(a.studentId), b = a.status === "present" ? "badge-present" : a.status === "absent" ? "badge-absent" : "badge-late";
      return '<tr><td>' + fmtDate(a.date) + '</td><td>' + esc(s ? s.name : "Unknown") + '</td><td class="id-badge">' + esc(s ? s.matric : "—") + '</td><td><span class="badge ' + b + '">' + cap(a.status) + '</span></td><td>' + (a.note ? '<div class="note-text">' + esc(a.note) + '</div>' : '<span class="text-muted">—</span>') + '</td></tr>';
    }).join("");
    var dh = '<div class="panel"><div class="panel-header"><h2>Attendance Log</h2></div><div class="panel-body flush"><div class="table-wrap"><table><thead><tr><th>Date</th><th>Student</th><th>Index No.</th><th>Status</th><th>Note</th></tr></thead><tbody>' + dr + '</tbody></table></div></div></div>';
    rc.innerHTML = sh + bh + dh;
    rc.querySelectorAll("[data-profile]").forEach(function (r) {
      r.addEventListener("click", function () { state.profileId = r.getAttribute("data-profile"); state.view = "students"; render(); });
    });
  }

  function exportRep() {
    if (!lR.length) { toast("Generate a report first."); return; }
    var rows = [["Date", "Student", "Index Number", "Course", "Level", "Status", "Note"]];
    lR.slice().sort(function (a, b) { return b.date.localeCompare(a.date); }).forEach(function (a) {
      var s = findStudent(a.studentId);
      rows.push([a.date, s ? s.name : "Unknown", s ? s.matric : "—", s ? s.course : "—", s ? s.level : "—", a.status, a.note || ""]);
    });
    exportCSV("attendance-report-" + todayISO() + ".csv", rows);
    toast("Report exported to CSV.");
  }

  d.querySelector("#rep-run").addEventListener("click", runReport);
  d.querySelector("#rep-csv").addEventListener("click", exportRep);
  d.querySelector("#rep-print").addEventListener("click", function () { window.print(); });
  if (state.attendance.length) runReport();
  return d;
}

// pages/atrisk.js — at-risk students page

import { SVG } from "../icons.js";
import { esc } from "../utils.js";
import { attendanceSummary, atRiskStudents } from "../data.js";
import { initPage, getContainer, studentAvatarHTML, emptyState } from "../layout.js";
import { IMG } from "../icons.js";

initPage("atrisk", "At-Risk Students", "Students with attendance below 75%");

var c = getContainer();
var risk = atRiskStudents().sort(function (a, b) { return attendanceSummary(a.id).rate - attendanceSummary(b.id).rate; });

if (!risk.length) {
  c.innerHTML = '<div class="panel"><div class="panel-body">' + emptyState(IMG.emptyCheck, "No at-risk students. Everyone is above 75% attendance.") + '</div></div>';
} else {
  var rows = risk.map(function (s) {
    var sm = attendanceSummary(s.id);
    var bd = sm.rate >= 50 ? "badge-warning" : "badge-critical";
    var bc = sm.rate >= 50 ? "warn" : "bad";
    return '<tr class="clickable-row" data-href="/students.html?id=' + s.id + '"><td><div style="display:flex;align-items:center;gap:0.6rem;">' + studentAvatarHTML(s, 32) + '<strong>' + esc(s.name) + '</strong></div></td><td class="id-badge">' + esc(s.matric) + '</td><td>' + esc(s.course) + '</td><td class="rate-cell"><div class="rate-text"><span class="badge ' + bd + '">' + sm.rate + '%</span><span class="text-muted">' + sm.present + '/' + sm.total + '</span></div><div class="progress-bar"><div class="progress-fill ' + bc + '" style="width:' + sm.rate + '%"></div></div></td></tr>';
  }).join("");
  c.innerHTML = '<div class="alert-banner"><span class="alert-icon">' + SVG.alert + '</span><span>' + risk.length + ' student' + (risk.length > 1 ? "s" : "") + ' below the 75% attendance threshold. Consider follow-up action.</span></div><div class="panel"><div class="panel-body flush"><div class="table-wrap"><table><thead><tr><th>Name</th><th>Index No.</th><th>Course</th><th>Attendance</th></tr></thead><tbody>' + rows + '</tbody></table></div></div></div>';
  c.querySelectorAll("[data-href]").forEach(function (r) {
    r.addEventListener("click", function () { window.location.href = r.getAttribute("data-href"); });
  });
}

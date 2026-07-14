// views-attendance.js — take attendance view

import { state } from "./state.js";
import { IMG, SVG, icon } from "./icons.js";
import { esc, cap, toast, todayISO, fmtDate } from "./utils.js";
import { getAttendanceForDate, saveAttendance, studentsInClass } from "./data.js";
import { setTopbar, studentAvatarHTML, emptyState } from "./views-layout.js";

export function renderAttendance() {
  setTopbar("Take Attendance", "Record student attendance for a class session");
  var d = document.createElement("div"), today = todayISO();
  var cO = state.classes.length
    ? '<select id="att-class"><option value="">All Students</option>' + state.classes.map(function (c) { return '<option value="' + c.id + '">' + esc(c.name) + '</option>'; }).join("") + '</select>'
    : "";

  d.innerHTML =
    '<div class="toolbar">' + cO +
    '<label style="font-weight:600;font-size:0.86rem;color:var(--text-2);">Date:</label><input type="date" id="att-date" value="' + today + '"/>' +
    '<button class="btn btn-outline btn-sm" id="load-date">' + icon("save", "icon-sm") + ' Load Saved</button><div class="spacer"></div>' +
    '<div class="seg-control"><button class="seg-btn" id="bulk-present">Mark All Present</button><button class="seg-btn" id="bulk-absent">Mark All Absent</button></div>' +
    '<button class="btn btn-primary" id="save-att" style="width:auto;">' + icon("check", "icon-sm") + ' Save Attendance</button></div>' +
    '<div class="panel"><div class="panel-header"><h2>Student Roster</h2><span class="badge badge-slate" id="att-count">0 students</span></div><div class="panel-body flush" id="att-roster"></div></div>';

  var dI = d.querySelector("#att-date"), rc = d.querySelector("#att-roster"), cS = d.querySelector("#att-class");

  function getRoster() {
    var l = state.students;
    if (cS && cS.value) l = studentsInClass(cS.value);
    return l;
  }

  function loadDraft(dt) {
    var ex = getAttendanceForDate(dt);
    state.attendanceDraft = {};
    state.attendanceNotes = {};
    getRoster().forEach(function (s) {
      var r = ex.find(function (a) { return a.studentId === s.id; });
      state.attendanceDraft[s.id] = r ? r.status : "present";
      state.attendanceNotes[s.id] = r ? (r.note || "") : "";
    });
  }

  function sB(st, cur, sid) {
    var a = cur === st ? " active " + st : "";
    return '<button class="status-btn' + a + '" data-status="' + st + '" data-student="' + sid + '">' + cap(st) + '</button>';
  }

  function renderRoster() {
    var ro = getRoster();
    if (!ro.length) { rc.innerHTML = emptyState(IMG.emptyStudents, "No students registered. Add students first."); return; }
    rc.innerHTML = ro.map(function (s) {
      var st = state.attendanceDraft[s.id] || "present";
      return '<div class="attendance-row"><div class="student-info">' + studentAvatarHTML(s, 40) + '<div class="student-meta"><p>' + esc(s.name) + '</p><span>' + esc(s.matric) + ' · ' + esc(s.level) + ' level</span></div></div>' +
        '<div style="display:flex;flex-direction:column;align-items:flex-end;gap:0.35rem;"><div class="status-toggle">' + sB("present", st, s.id) + sB("absent", st, s.id) + sB("late", st, s.id) + '</div>' +
        '<input type="text" class="note-input" data-note="' + s.id + '" placeholder="Add note..." value="' + esc(state.attendanceNotes[s.id] || "") + '" style="width:200px;"/></div></div>';
    }).join("");
    d.querySelector("#att-count").textContent = ro.length + " students";
    rc.querySelectorAll(".status-btn").forEach(function (b) {
      b.addEventListener("click", function () { state.attendanceDraft[b.getAttribute("data-student")] = b.getAttribute("data-status"); renderRoster(); });
    });
    rc.querySelectorAll("[data-note]").forEach(function (ni) {
      ni.addEventListener("input", function () { state.attendanceNotes[ni.getAttribute("data-note")] = ni.value; });
    });
  }

  loadDraft(dI.value);
  renderRoster();

  dI.addEventListener("change", function () { loadDraft(dI.value); renderRoster(); });
  if (cS) cS.addEventListener("change", function () { loadDraft(dI.value); renderRoster(); });
  d.querySelector("#load-date").addEventListener("click", function () { loadDraft(dI.value); renderRoster(); toast("Loaded saved attendance for " + fmtDate(dI.value)); });
  d.querySelector("#bulk-present").addEventListener("click", function () { getRoster().forEach(function (s) { state.attendanceDraft[s.id] = "present"; }); renderRoster(); });
  d.querySelector("#bulk-absent").addEventListener("click", function () { getRoster().forEach(function (s) { state.attendanceDraft[s.id] = "absent"; }); renderRoster(); });
  d.querySelector("#save-att").addEventListener("click", function () {
    var ro = getRoster();
    if (!ro.length) { toast("No students to record."); return; }
    var recs = ro.map(function (s) { return { studentId: s.id, status: state.attendanceDraft[s.id] || "present" }; });
    saveAttendance(dI.value, recs, state.attendanceNotes);
    toast("Attendance saved for " + fmtDate(dI.value));
  });
  return d;
}

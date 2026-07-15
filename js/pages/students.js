// pages/students.js — students list and profile

import { state } from "../state.js";
import { IMG, SVG, icon } from "../icons.js";
import { esc, cap, toast, handleImageUpload, avatarPlaceholderHTML, fmtDate, todayISO } from "../utils.js";
import {
  findStudent, findClass, addStudent, updateStudent, deleteStudent,
  isIndexNumberUnique, attendanceSummary, attendanceStreak, studentRecords,
  exportCSV,
} from "../data.js";
import { initPage, getContainer, studentAvatarHTML, emptyState } from "../layout.js";

initPage("students", "Students", "Register and manage student records");

var params = new URLSearchParams(window.location.search);
var profileId = params.get("id");

if (profileId) {
  renderStudentProfile(profileId);
} else {
  renderStudentList();
}

function renderStudentList() {
  var c = getContainer();
  c.innerHTML =
    '<div class="toolbar"><div class="search-wrapper"><span class="search-icon">' + SVG.search + '</span><input type="text" class="search-input" id="student-search" placeholder="Search by name, index number, or course..."/></div><div class="spacer"></div>' +
    '<button class="btn btn-outline btn-sm" id="export-csv-btn">' + icon("download", "icon-sm") + ' Export CSV</button>' +
    '<button class="btn btn-accent" id="add-student-btn">' + icon("plus", "icon-sm") + ' Add Student</button></div>' +
    '<div class="panel"><div class="panel-body flush"><div id="student-table"></div></div></div>';

  var si = c.querySelector("#student-search");
  si.addEventListener("input", function () { renderStudentTable(si.value); });
  c.querySelector("#add-student-btn").addEventListener("click", function () { openStudentModal(); });
  c.querySelector("#export-csv-btn").addEventListener("click", exportStudentsCSV);
  renderStudentTable("");
}

function renderStudentTable(q) {
  var c = document.getElementById("student-table");
  if (!c) return;
  q = q.toLowerCase();
  var f = state.students.filter(function (s) {
    return !q || s.name.toLowerCase().indexOf(q) >= 0 || s.matric.toLowerCase().indexOf(q) >= 0 || s.course.toLowerCase().indexOf(q) >= 0;
  });
  if (!f.length) {
    c.innerHTML = emptyState(IMG.emptyStudents, state.students.length ? "No students match your search." : 'No students registered yet. Click "Add Student" to begin.');
    return;
  }
  var rows = f.map(function (s) {
    var sm = attendanceSummary(s.id), st = attendanceStreak(s.id);
    var badge = sm.rate >= 75 ? "badge-excellent" : sm.rate >= 50 ? "badge-warning" : sm.rate > 0 ? "badge-critical" : "badge-slate";
    var bc = sm.rate >= 75 ? "good" : sm.rate >= 50 ? "warn" : "bad";
    var sB = st >= 3 ? '<span class="streak-badge" title="' + st + ' day streak">' + SVG.flame + st + "</span>" : "";
    var cls = s.classId ? findClass(s.classId) : null;
    return '<tr class="clickable-row" data-href="/students.html?id=' + s.id + '">' +
      '<td><div style="display:flex;align-items:center;gap:0.6rem;">' + studentAvatarHTML(s, 32) + '<div><strong>' + esc(s.name) + '</strong>' + (sB ? '<div style="margin-top:2px;">' + sB + '</div>' : "") + '</div></div></td>' +
      '<td class="id-badge">' + esc(s.matric) + '</td>' +
      '<td>' + esc(s.course) + (cls ? '<br><span class="text-muted">' + esc(cls.name) + '</span>' : "") + '</td>' +
      '<td>' + esc(s.level) + '</td>' +
      '<td class="rate-cell"><div class="rate-text"><span class="badge ' + badge + '">' + (sm.total ? sm.rate + "%" : "—") + '</span><span class="text-muted">' + sm.present + "/" + sm.total + '</span></div>' + (sm.total ? '<div class="progress-bar"><div class="progress-fill ' + bc + '" style="width:' + sm.rate + '%"></div></div>' : "") + '</td>' +
      '<td><div style="display:flex;gap:0.35rem;"><a href="/students.html?id=' + s.id + '" class="btn btn-ghost btn-sm btn-icon" title="View profile">' + SVG.eye + '</a><button class="btn btn-outline btn-sm" data-edit="' + s.id + '">' + icon("edit", "icon-sm") + '</button><button class="btn btn-danger btn-sm btn-icon" data-del="' + s.id + '" title="Delete">' + SVG.trash + '</button></div></td>' +
      '</tr>';
  }).join("");

  c.innerHTML = '<div class="table-wrap"><table><thead><tr><th>Name</th><th>Index No.</th><th>Course</th><th>Level</th><th>Attendance</th><th>Actions</th></tr></thead><tbody>' + rows + '</tbody></table></div>';
  c.querySelectorAll("[data-href]").forEach(function (r) { r.addEventListener("click", function () { window.location.href = r.getAttribute("data-href"); }); });
  c.querySelectorAll("[data-edit]").forEach(function (b) { b.addEventListener("click", function (e) { e.stopPropagation(); openStudentModal(b.getAttribute("data-edit")); }); });
  c.querySelectorAll("[data-del]").forEach(function (b) {
    b.addEventListener("click", function (e) {
      e.stopPropagation();
      if (confirm("Delete this student and all their attendance records?")) {
        deleteStudent(b.getAttribute("data-del"));
        toast("Student deleted.");
        renderStudentTable(document.getElementById("student-search").value);
      }
    });
  });
}

function exportStudentsCSV() {
  var rows = [["Name", "Index Number", "Course", "Level", "Email", "Phone", "Class", "Present", "Absent", "Late", "Total", "Rate (%)", "Streak"]];
  state.students.forEach(function (s) {
    var sm = attendanceSummary(s.id);
    var cls = s.classId ? findClass(s.classId) : null;
    rows.push([s.name, s.matric, s.course, s.level, s.email || "", s.phone || "", cls ? cls.name : "", sm.present, sm.absent, sm.late, sm.total, sm.rate, attendanceStreak(s.id)]);
  });
  exportCSV("students-" + todayISO() + ".csv", rows);
  toast("Students exported to CSV.");
}

function openStudentModal(id) {
  var s = id ? findStudent(id) : null;
  var ov = document.createElement("div");
  ov.className = "modal-overlay";
  var lv = ["100", "200", "300", "400", "500"].map(function (l) { return "<option" + (s && s.level === l ? " selected" : "") + ">" + l + "</option>"; }).join("");
  var cv = state.classes.map(function (c) { return '<option value="' + c.id + '"' + (s && s.classId === c.id ? " selected" : "") + ">" + esc(c.name) + "</option>"; }).join("");
  var ph = s && s.photo ? s.photo : "";
  var avH = ph ? '<img src="' + esc(ph) + '"/>' : '<div class="avatar-placeholder">' + SVG.userPlaceholder + '</div>';

  ov.innerHTML =
    '<div class="modal"><div class="modal-header"><h2>' + (s ? "Edit Student" : "Add Student") + '</h2><button class="modal-close" id="mc">' + SVG.close + '</button></div>' +
    '<div class="modal-body"><div id="me"></div>' +
    '<div class="avatar-upload"><div class="avatar-preview" id="avatar-preview">' + avH + '</div><input type="file" id="photo-input" accept="image/*" style="display:none"/><button class="btn btn-outline btn-sm" id="upload-btn">' + icon("camera", "icon-sm") + ' Upload Photo</button><span class="avatar-upload-hint">Max 500KB · JPG/PNG</span></div>' +
    '<form id="sf">' +
    '<div class="form-group"><label>Full Name</label><input type="text" id="f-name" required value="' + (s ? esc(s.name) : "") + '"/></div>' +
    '<div class="form-row"><div class="form-group"><label>Index Number</label><input type="text" id="f-matric" required value="' + (s ? esc(s.matric) : "") + '" placeholder="e.g. 12345678"/></div><div class="form-group"><label>Academic Level</label><select id="f-level">' + lv + '</select></div></div>' +
    '<div class="form-group"><label>Course of Study</label><input type="text" id="f-course" required value="' + (s ? esc(s.course) : "") + '"/></div>' +
    (state.classes.length ? '<div class="form-group"><label>Class</label><select id="f-class"><option value="">— None —</option>' + cv + '</select></div>' : "") +
    '<div class="form-row"><div class="form-group"><label>Email (optional)</label><input type="email" id="f-email" value="' + (s ? esc(s.email) : "") + '"/></div><div class="form-group"><label>Phone (optional)</label><input type="text" id="f-phone" value="' + (s ? esc(s.phone) : "") + '"/></div></div>' +
    '<div class="form-actions"><button type="button" class="btn btn-outline" id="cancel">Cancel</button><button type="submit" class="btn btn-primary" style="width:auto;">' + (s ? "Save Changes" : "Add Student") + '</button></div>' +
    '</form></div></div>';

  document.body.appendChild(ov);
  var photoData = ph;
  function close() { ov.remove(); }
  ov.querySelector("#mc").addEventListener("click", close);
  ov.querySelector("#cancel").addEventListener("click", close);
  ov.addEventListener("click", function (e) { if (e.target === ov) close(); });
  ov.querySelector("#upload-btn").addEventListener("click", function () { ov.querySelector("#photo-input").click(); });
  ov.querySelector("#photo-input").addEventListener("change", function (e) {
    handleImageUpload(e.target.files[0], function (data) { photoData = data; ov.querySelector("#avatar-preview").innerHTML = '<img src="' + esc(data) + '"/>'; });
  });
  ov.querySelector("#sf").addEventListener("submit", function (e) {
    e.preventDefault();
    var d2 = {
      name: ov.querySelector("#f-name").value, matric: ov.querySelector("#f-matric").value,
      course: ov.querySelector("#f-course").value, level: ov.querySelector("#f-level").value,
      email: ov.querySelector("#f-email").value, phone: ov.querySelector("#f-phone").value, photo: photoData,
    };
    var cs = ov.querySelector("#f-class"); if (cs) d2.classId = cs.value || null;
    if (!d2.name.trim() || !d2.matric.trim() || !d2.course.trim()) {
      ov.querySelector("#me").innerHTML = '<div class="alert alert-error">Name, index number, and course are required.</div>';
      return;
    }
    if (!isIndexNumberUnique(d2.matric, id)) {
      ov.querySelector("#me").innerHTML = '<div class="alert alert-error">Index number "' + esc(d2.matric.trim()) + '" already exists. Please use a unique index number.</div>';
      return;
    }
    if (id) { updateStudent(id, d2); toast("Student updated."); }
    else { addStudent(d2); toast("Student added."); }
    close();
    window.location.reload();
  });
}

function renderStudentProfile(id) {
  var s = findStudent(id);
  if (!s) { window.location.href = "/students.html"; return; }
  var c = getContainer();
  var sm = attendanceSummary(s.id), st = attendanceStreak(s.id);
  var recs = studentRecords(id).sort(function (a, b) { return b.date.localeCompare(a.date); });
  var badge = sm.rate >= 75 ? "badge-excellent" : sm.rate >= 50 ? "badge-warning" : "badge-critical";
  var cls = s.classId ? findClass(s.classId) : null;
  var avH = s.photo ? '<img src="' + esc(s.photo) + '"/>' : '<span class="avatar-placeholder">' + SVG.userPlaceholder + '</span>';
  var sB = st >= 3 ? '<div style="text-align:center;margin-top:0.5rem;"><span class="streak-badge">' + SVG.flame + st + ' day streak</span></div>' : "";

  var rr = recs.length ? recs.map(function (a) {
    var b = a.status === "present" ? "badge-present" : a.status === "absent" ? "badge-absent" : "badge-late";
    return '<tr><td>' + fmtDate(a.date) + '</td><td><span class="badge ' + b + '">' + cap(a.status) + '</span></td><td>' + (a.note ? '<div class="note-text">' + esc(a.note) + '</div>' : '<span class="text-muted">—</span>') + '</td></tr>';
  }).join("") : '<tr><td colspan="3" style="text-align:center;padding:2rem;color:var(--text-3);">No attendance records yet.</td></tr>';

  c.innerHTML =
    '<div style="margin-bottom:1rem;"><a href="/students.html" class="btn btn-outline btn-sm">' + icon("back", "icon-sm") + ' Back to Students</a></div>' +
    '<div class="panel"><div class="profile-header"><div class="profile-avatar-lg">' + avH + '</div><div>' +
    '<div class="profile-name">' + esc(s.name) + '</div><div class="profile-meta">' +
    '<div class="profile-meta-item">' + SVG.graduation + ' ' + esc(s.course) + '</div>' +
    '<div class="profile-meta-item">' + SVG.book + ' Level ' + esc(s.level) + '</div>' +
    '<div class="profile-meta-item">' + SVG.id + ' ' + esc(s.matric) + '</div>' +
    (cls ? '<div class="profile-meta-item">' + SVG.building + ' ' + esc(cls.name) + '</div>' : "") +
    (s.email ? '<div class="profile-meta-item">' + SVG.mail + ' ' + esc(s.email) + '</div>' : "") +
    (s.phone ? '<div class="profile-meta-item">' + SVG.phone + ' ' + esc(s.phone) + '</div>' : "") +
    '</div></div><div style="margin-left:auto;"><span class="badge ' + badge + '" style="font-size:1rem;padding:0.4rem 1rem;">' + (sm.total ? sm.rate + "%" : "—") + '</span>' + sB + '</div></div>' +
    '<div class="profile-stats"><div class="profile-stat"><div class="ps-value" style="color:var(--success)">' + sm.present + '</div><div class="ps-label">Present</div></div><div class="profile-stat"><div class="ps-value" style="color:var(--danger)">' + sm.absent + '</div><div class="ps-label">Absent</div></div><div class="profile-stat"><div class="ps-value" style="color:var(--warning)">' + sm.late + '</div><div class="ps-label">Late</div></div><div class="profile-stat"><div class="ps-value">' + sm.total + '</div><div class="ps-label">Total Sessions</div></div></div></div>' +
    '<div class="panel"><div class="panel-header"><h2>Attendance History</h2><button class="btn btn-outline btn-sm" id="edit-profile">' + icon("edit", "icon-sm") + ' Edit Student</button></div><div class="panel-body flush"><div class="table-wrap"><table><thead><tr><th>Date</th><th>Status</th><th>Note</th></tr></thead><tbody>' + rr + '</tbody></table></div></div></div>';

  c.querySelector("#edit-profile").addEventListener("click", function () { openStudentModal(id); });
}

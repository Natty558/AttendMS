// views-classes.js — classes list, class detail with student assignment, class modal

import { state } from "./state.js";
import { IMG, SVG, icon, classIconFor } from "./icons.js";
import { esc, toast } from "./utils.js";
import {
  findClass, addClass, updateClass, deleteClass,
  studentsInClass, assignStudentsToClass, unassignStudentFromClass,
} from "./data.js";
import { render } from "./nav.js";
import { setTopbar, studentAvatarHTML, emptyState } from "./views-layout.js";

export function renderClasses() {
  if (state.selectedClassId) return renderClassDetail(state.selectedClassId);
  setTopbar("Classes", "Manage classes and assign students");
  var d = document.createElement("div");

  if (!state.classes.length) {
    d.innerHTML = '<div class="panel"><div class="panel-body">' + emptyState(IMG.emptyClasses, "No classes created yet.") + '<button class="btn btn-accent mt-2" id="add-class-empty">' + icon("plus", "icon-sm") + ' Create Class</button></div></div>';
    d.querySelector("#add-class-empty").addEventListener("click", function () { openClassModal(); });
    return d;
  }

  var cards = state.classes.map(function (c) {
    var ct = studentsInClass(c.id).length;
    var cIc = classIconFor(c.name);
    return '<div class="class-card" data-class="' + c.id + '"><div class="cc-icon">' + cIc + '</div><h3>' + esc(c.name) + '</h3><p>' + esc(c.code) + ' · ' + ct + ' student' + (ct !== 1 ? "s" : "") + '</p>' +
      (c.description ? '<p class="mt-1">' + esc(c.description) + '</p>' : "") +
      '<div style="display:flex;gap:0.4rem;margin-top:0.75rem;"><button class="btn btn-outline btn-sm" data-edit-class="' + c.id + '">' + icon("edit", "icon-sm") + '</button><button class="btn btn-danger btn-sm btn-icon" data-del-class="' + c.id + '" title="Delete">' + SVG.trash + '</button></div></div>';
  }).join("");

  d.innerHTML = '<div class="toolbar"><div class="spacer"></div><button class="btn btn-accent" id="add-class">' + icon("plus", "icon-sm") + ' Create Class</button></div><div class="class-grid">' + cards + '</div>';

  d.querySelector("#add-class").addEventListener("click", function () { openClassModal(); });
  d.querySelectorAll("[data-class]").forEach(function (card) {
    card.addEventListener("click", function (e) {
      if (e.target.closest("button")) return;
      state.selectedClassId = card.getAttribute("data-class");
      render();
    });
  });
  d.querySelectorAll("[data-edit-class]").forEach(function (b) { b.addEventListener("click", function (e) { e.stopPropagation(); openClassModal(b.getAttribute("data-edit-class")); }); });
  d.querySelectorAll("[data-del-class]").forEach(function (b) {
    b.addEventListener("click", function (e) {
      e.stopPropagation();
      if (confirm("Delete this class? Students will be unassigned.")) {
        deleteClass(b.getAttribute("data-del-class"));
        toast("Class deleted.");
        render();
      }
    });
  });
  return d;
}

function renderClassDetail(classId) {
  var c = findClass(classId);
  if (!c) { state.selectedClassId = null; return renderClasses(); }
  setTopbar(esc(c.name), "Manage class roster and assignments");
  var d = document.createElement("div");
  var cIc = classIconFor(c.name);
  var assigned = studentsInClass(classId);
  var unassigned = state.students.filter(function (s) { return !s.classId || s.classId !== classId; });

  d.innerHTML =
    '<div style="margin-bottom:1rem;"><button class="btn btn-outline btn-sm" id="back-classes">' + icon("back", "icon-sm") + ' Back to Classes</button></div>' +
    '<div class="class-detail-header"><div class="class-detail-icon">' + cIc + '</div><div class="class-detail-title"><h2>' + esc(c.name) + '</h2><p>' + esc(c.code) + (c.description ? ' · ' + esc(c.description) : "") + '</p></div>' +
    '<div style="margin-left:auto;display:flex;gap:0.4rem;"><button class="btn btn-outline btn-sm" data-edit-class="' + c.id + '">' + icon("edit", "icon-sm") + ' Edit</button><button class="btn btn-danger btn-sm btn-icon" data-del-class="' + c.id + '" title="Delete">' + SVG.trash + '</button></div></div>' +
    '<div class="two-col"><div class="panel"><div class="panel-header"><h2>Assigned Students</h2><span class="badge badge-slate">' + assigned.length + '</span></div><div class="panel-body flush"><div id="assigned-list"></div></div></div>' +
    '<div class="panel"><div class="panel-header"><h2>Unassigned Students</h2><span class="badge badge-slate">' + unassigned.length + '</span></div><div class="panel-body flush"><div id="unassigned-list"></div></div></div></div>';

  function renderAssignedList() {
    var el = d.querySelector("#assigned-list");
    if (!assigned.length) { el.innerHTML = '<div style="padding:1.5rem;text-align:center;color:var(--text-3);font-size:0.84rem;">No students assigned to this class yet.</div>'; return; }
    el.innerHTML = assigned.map(function (s) {
      return '<div class="assign-row"><div class="assign-student-info">' + studentAvatarHTML(s, 32) + '<div><p>' + esc(s.name) + '</p><span>' + esc(s.matric) + ' · ' + esc(s.course) + '</span></div></div><button class="btn btn-danger btn-sm" data-unassign="' + s.id + '">Remove</button></div>';
    }).join("");
    el.querySelectorAll("[data-unassign]").forEach(function (b) {
      b.addEventListener("click", function () { unassignStudentFromClass(classId, b.getAttribute("data-unassign")); toast("Student removed from class."); render(); });
    });
  }

  function renderUnassignedList() {
    var el = d.querySelector("#unassigned-list");
    if (!unassigned.length) { el.innerHTML = '<div style="padding:1.5rem;text-align:center;color:var(--text-3);font-size:0.84rem;">All students are assigned.</div>'; return; }
    el.innerHTML = unassigned.map(function (s) {
      return '<div class="assign-row"><div class="assign-student-info">' + studentAvatarHTML(s, 32) + '<div><p>' + esc(s.name) + '</p><span>' + esc(s.matric) + ' · ' + esc(s.course) + '</span></div></div><button class="btn btn-accent btn-sm" data-assign="' + s.id + '">Assign</button></div>';
    }).join("");
    el.querySelectorAll("[data-assign]").forEach(function (b) {
      b.addEventListener("click", function () { assignStudentsToClass(classId, [b.getAttribute("data-assign")]); toast("Student assigned to class."); render(); });
    });
  }

  renderAssignedList();
  renderUnassignedList();

  d.querySelector("#back-classes").addEventListener("click", function () { state.selectedClassId = null; render(); });
  var eb = d.querySelector("[data-edit-class]"); if (eb) eb.addEventListener("click", function (e) { e.stopPropagation(); openClassModal(classId); });
  var db = d.querySelector("[data-del-class]"); if (db) db.addEventListener("click", function (e) { e.stopPropagation(); if (confirm("Delete this class? Students will be unassigned.")) { deleteClass(classId); state.selectedClassId = null; toast("Class deleted."); render(); } });

  return d;
}

export function openClassModal(id) {
  var c = id ? findClass(id) : null;
  var ov = document.createElement("div");
  ov.className = "modal-overlay";
  ov.innerHTML =
    '<div class="modal"><div class="modal-header"><h2>' + (c ? "Edit Class" : "Create Class") + '</h2><button class="modal-close" id="mc">' + SVG.close + '</button></div>' +
    '<div class="modal-body"><div id="me"></div>' +
    '<form id="cf"><div class="form-group"><label>Class Name</label><input type="text" id="c-name" required value="' + (c ? esc(c.name) : "") + '"/></div>' +
    '<div class="form-group"><label>Class Code</label><input type="text" id="c-code" required value="' + (c ? esc(c.code) : "") + '"/></div>' +
    '<div class="form-group"><label>Description (optional)</label><textarea id="c-desc">' + (c ? esc(c.description) : "") + '</textarea></div>' +
    '<div class="form-actions"><button type="button" class="btn btn-outline" id="cancel">Cancel</button><button type="submit" class="btn btn-primary" style="width:auto;">' + (c ? "Save Changes" : "Create Class") + '</button></div></form></div></div>';

  document.body.appendChild(ov);
  function close() { ov.remove(); }
  ov.querySelector("#mc").addEventListener("click", close);
  ov.querySelector("#cancel").addEventListener("click", close);
  ov.addEventListener("click", function (e) { if (e.target === ov) close(); });
  ov.querySelector("#cf").addEventListener("submit", function (e) {
    e.preventDefault();
    var d2 = { name: ov.querySelector("#c-name").value, code: ov.querySelector("#c-code").value, description: ov.querySelector("#c-desc").value };
    if (!d2.name.trim() || !d2.code.trim()) { ov.querySelector("#me").innerHTML = '<div class="alert alert-error">Name and code are required.</div>'; return; }
    if (id) { updateClass(id, d2); toast("Class updated."); }
    else { addClass(d2); toast("Class created."); }
    close();
    render();
  });
}

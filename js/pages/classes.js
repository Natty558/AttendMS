// pages/classes.js — classes list and class detail with student assignment

import { state } from "../state.js";
import { IMG, SVG, icon, classIconFor } from "../icons.js";
import { esc, toast } from "../utils.js";
import {
  findClass, addClass, updateClass, deleteClass,
  studentsInClass, assignStudentsToClass, unassignStudentFromClass,
} from "../data.js";
import { initPage, getContainer, studentAvatarHTML, emptyState } from "../layout.js";

initPage("classes", "Classes", "Manage classes and assign students");

var params = new URLSearchParams(window.location.search);
var classId = params.get("id");

if (classId) {
  renderClassDetail(classId);
} else {
  renderClassList();
}

function renderClassList() {
  var c = getContainer();
  if (!state.classes.length) {
    c.innerHTML = '<div class="panel"><div class="panel-body">' + emptyState(IMG.emptyClasses, "No classes created yet.") + '<button class="btn btn-accent mt-2" id="add-class-empty">' + icon("plus", "icon-sm") + ' Create Class</button></div></div>';
    c.querySelector("#add-class-empty").addEventListener("click", function () { openClassModal(); });
    return;
  }
  var cards = state.classes.map(function (c) {
    var ct = studentsInClass(c.id).length;
    var cIc = classIconFor(c.name);
    return '<div class="class-card" data-href="/classes.html?id=' + c.id + '"><div class="cc-icon">' + cIc + '</div><h3>' + esc(c.name) + '</h3><p>' + esc(c.code) + ' · ' + ct + ' student' + (ct !== 1 ? "s" : "") + '</p>' +
      (c.description ? '<p class="mt-1">' + esc(c.description) + '</p>' : "") +
      '<div style="display:flex;gap:0.4rem;margin-top:0.75rem;"><button class="btn btn-outline btn-sm" data-edit-class="' + c.id + '">' + icon("edit", "icon-sm") + '</button><button class="btn btn-danger btn-sm btn-icon" data-del-class="' + c.id + '" title="Delete">' + SVG.trash + '</button></div></div>';
  }).join("");
  c.innerHTML = '<div class="toolbar"><div class="spacer"></div><button class="btn btn-accent" id="add-class">' + icon("plus", "icon-sm") + ' Create Class</button></div><div class="class-grid">' + cards + '</div>';
  c.querySelector("#add-class").addEventListener("click", function () { openClassModal(); });
  c.querySelectorAll("[data-href]").forEach(function (card) { card.addEventListener("click", function (e) { if (e.target.closest("button")) return; window.location.href = card.getAttribute("data-href"); }); });
  c.querySelectorAll("[data-edit-class]").forEach(function (b) { b.addEventListener("click", function (e) { e.stopPropagation(); openClassModal(b.getAttribute("data-edit-class")); }); });
  c.querySelectorAll("[data-del-class]").forEach(function (b) {
    b.addEventListener("click", function (e) {
      e.stopPropagation();
      if (confirm("Delete this class? Students will be unassigned.")) {
        deleteClass(b.getAttribute("data-del-class"));
        toast("Class deleted.");
        window.location.reload();
      }
    });
  });
}

function renderClassDetail(id) {
  var cl = findClass(id);
  if (!cl) { window.location.href = "/classes.html"; return; }
  var c = getContainer();
  var cIc = classIconFor(cl.name);
  var assigned = studentsInClass(id);
  var unassigned = state.students.filter(function (s) { return !s.classId || s.classId !== id; });

  c.innerHTML =
    '<div style="margin-bottom:1rem;"><a href="/classes.html" class="btn btn-outline btn-sm">' + icon("back", "icon-sm") + ' Back to Classes</a></div>' +
    '<div class="class-detail-header"><div class="class-detail-icon">' + cIc + '</div><div class="class-detail-title"><h2>' + esc(cl.name) + '</h2><p>' + esc(cl.code) + (cl.description ? ' · ' + esc(cl.description) : "") + '</p></div>' +
    '<div style="margin-left:auto;display:flex;gap:0.4rem;"><button class="btn btn-outline btn-sm" data-edit-class="' + cl.id + '">' + icon("edit", "icon-sm") + ' Edit</button><button class="btn btn-danger btn-sm btn-icon" data-del-class="' + cl.id + '" title="Delete">' + SVG.trash + '</button></div></div>' +
    '<div class="two-col"><div class="panel"><div class="panel-header"><h2>Assigned Students</h2><span class="badge badge-slate">' + assigned.length + '</span></div><div class="panel-body flush"><div id="assigned-list"></div></div></div>' +
    '<div class="panel"><div class="panel-header"><h2>Unassigned Students</h2><span class="badge badge-slate">' + unassigned.length + '</span></div><div class="panel-body flush"><div id="unassigned-list"></div></div></div></div>';

  function renderAssignedList() {
    var el = c.querySelector("#assigned-list");
    if (!assigned.length) { el.innerHTML = '<div style="padding:1.5rem;text-align:center;color:var(--text-3);font-size:0.84rem;">No students assigned to this class yet.</div>'; return; }
    el.innerHTML = assigned.map(function (s) {
      return '<div class="assign-row"><div class="assign-student-info">' + studentAvatarHTML(s, 32) + '<div><p>' + esc(s.name) + '</p><span>' + esc(s.matric) + ' · ' + esc(s.course) + '</span></div></div><button class="btn btn-danger btn-sm" data-unassign="' + s.id + '">Remove</button></div>';
    }).join("");
    el.querySelectorAll("[data-unassign]").forEach(function (b) {
      b.addEventListener("click", function () { unassignStudentFromClass(id, b.getAttribute("data-unassign")); toast("Student removed from class."); window.location.reload(); });
    });
  }

  function renderUnassignedList() {
    var el = c.querySelector("#unassigned-list");
    if (!unassigned.length) { el.innerHTML = '<div style="padding:1.5rem;text-align:center;color:var(--text-3);font-size:0.84rem;">All students are assigned.</div>'; return; }
    el.innerHTML = unassigned.map(function (s) {
      return '<div class="assign-row"><div class="assign-student-info">' + studentAvatarHTML(s, 32) + '<div><p>' + esc(s.name) + '</p><span>' + esc(s.matric) + ' · ' + esc(s.course) + '</span></div></div><button class="btn btn-accent btn-sm" data-assign="' + s.id + '">Assign</button></div>';
    }).join("");
    el.querySelectorAll("[data-assign]").forEach(function (b) {
      b.addEventListener("click", function () { assignStudentsToClass(id, [b.getAttribute("data-assign")]); toast("Student assigned to class."); window.location.reload(); });
    });
  }

  renderAssignedList();
  renderUnassignedList();

  var eb = c.querySelector("[data-edit-class]"); if (eb) eb.addEventListener("click", function (e) { e.stopPropagation(); openClassModal(id); });
  var db = c.querySelector("[data-del-class]"); if (db) db.addEventListener("click", function (e) { e.stopPropagation(); if (confirm("Delete this class? Students will be unassigned.")) { deleteClass(id); toast("Class deleted."); window.location.href = "/classes.html"; } });
}

function openClassModal(id) {
  var cl = id ? findClass(id) : null;
  var ov = document.createElement("div");
  ov.className = "modal-overlay";
  ov.innerHTML =
    '<div class="modal"><div class="modal-header"><h2>' + (cl ? "Edit Class" : "Create Class") + '</h2><button class="modal-close" id="mc">' + SVG.close + '</button></div>' +
    '<div class="modal-body"><div id="me"></div>' +
    '<form id="cf"><div class="form-group"><label>Class Name</label><input type="text" id="c-name" required value="' + (cl ? esc(cl.name) : "") + '"/></div>' +
    '<div class="form-group"><label>Class Code</label><input type="text" id="c-code" required value="' + (cl ? esc(cl.code) : "") + '"/></div>' +
    '<div class="form-group"><label>Description (optional)</label><textarea id="c-desc">' + (cl ? esc(cl.description) : "") + '</textarea></div>' +
    '<div class="form-actions"><button type="button" class="btn btn-outline" id="cancel">Cancel</button><button type="submit" class="btn btn-primary" style="width:auto;">' + (cl ? "Save Changes" : "Create Class") + '</button></div></form></div></div>';

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
    window.location.reload();
  });
}

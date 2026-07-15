// data.js — student, class, and attendance CRUD + export/import

import { state, persist } from "./state.js";
import { uid } from "./utils.js";

// ===== Student CRUD =====

export function isIndexNumberUnique(indexNumber, excludeId) {
  var num = indexNumber.trim().toLowerCase();
  return !state.students.some(function (s) {
    return s.matric.trim().toLowerCase() === num && s.id !== excludeId;
  });
}

export function addStudent(d) {
  var s = {
    id: uid("STU-"), name: d.name.trim(), matric: d.matric.trim(),
    course: d.course.trim(), level: d.level.trim(),
    email: (d.email || "").trim(), phone: (d.phone || "").trim(),
    photo: "", classId: d.classId || null, createdAt: new Date().toISOString(),
  };
  state.students.push(s);
  persist();
  return s;
}

export function updateStudent(id, d) {
  var s = findStudent(id);
  if (!s) return;
  s.name = d.name.trim();
  s.matric = d.matric.trim();
  s.course = d.course.trim();
  s.level = d.level.trim();
  s.email = (d.email || "").trim();
  s.phone = (d.phone || "").trim();
  if (d.classId !== undefined) s.classId = d.classId;
  if (d.photo !== undefined) s.photo = d.photo;
  persist();
}

export function deleteStudent(id) {
  state.students = state.students.filter(function (s) { return s.id !== id; });
  state.attendance = state.attendance.filter(function (a) { return a.studentId !== id; });
  persist();
}

export function findStudent(id) {
  return state.students.find(function (s) { return s.id === id; });
}

// ===== Class CRUD =====

export function addClass(d) {
  var c = {
    id: uid("CLS-"), name: d.name.trim(), code: d.code.trim(),
    description: (d.description || "").trim(), createdAt: new Date().toISOString(),
  };
  state.classes.push(c);
  persist();
  return c;
}

export function updateClass(id, d) {
  var c = findClass(id);
  if (!c) return;
  c.name = d.name.trim();
  c.code = d.code.trim();
  c.description = (d.description || "").trim();
  persist();
}

export function deleteClass(id) {
  state.classes = state.classes.filter(function (c) { return c.id !== id; });
  state.students.forEach(function (s) { if (s.classId === id) s.classId = null; });
  persist();
}

export function findClass(id) {
  return state.classes.find(function (c) { return c.id === id; });
}

export function studentsInClass(cid) {
  return state.students.filter(function (s) { return s.classId === cid; });
}

export function assignStudentsToClass(classId, studentIds) {
  studentIds.forEach(function (sid) {
    var s = findStudent(sid);
    if (s) s.classId = classId;
  });
  persist();
}

export function unassignStudentFromClass(classId, studentId) {
  var s = findStudent(studentId);
  if (s && s.classId === classId) s.classId = null;
  persist();
}

// ===== Attendance =====

export function getAttendanceForDate(d) {
  return state.attendance.filter(function (a) { return a.date === d; });
}

export function saveAttendance(date, records, notes) {
  state.attendance = state.attendance.filter(function (a) { return a.date !== date; });
  records.forEach(function (r) {
    state.attendance.push({
      id: uid("ATT-"), studentId: r.studentId, date: date, status: r.status,
      note: notes && notes[r.studentId] ? notes[r.studentId].trim() : "",
      recordedAt: new Date().toISOString(),
    });
  });
  persist();
}

export function studentRecords(sid) {
  return state.attendance.filter(function (a) { return a.studentId === sid; });
}

export function attendanceSummary(sid) {
  var r = studentRecords(sid);
  var p = r.filter(function (a) { return a.status === "present"; }).length;
  var a = r.filter(function (a) { return a.status === "absent"; }).length;
  var l = r.filter(function (a) { return a.status === "late"; }).length;
  var t = r.length;
  return { present: p, absent: a, late: l, total: t, rate: t ? Math.round(((p + l * 0.5) / t) * 100) : 0 };
}

export function atRiskStudents() {
  return state.students.filter(function (s) {
    var sm = attendanceSummary(s.id);
    return sm.rate < 75 && sm.total > 0;
  });
}

export function attendanceStreak(sid) {
  var r = studentRecords(sid).sort(function (a, b) { return b.date.localeCompare(a.date); });
  var st = 0;
  for (var i = 0; i < r.length; i++) {
    if (r[i].status === "present" || r[i].status === "late") st++;
    else break;
  }
  return st;
}

export function dailyRate(date) {
  var r = getAttendanceForDate(date);
  if (!r.length) return null;
  var p = r.filter(function (a) { return a.status === "present" || a.status === "late"; }).length;
  return Math.round((p / r.length) * 100);
}

// ===== Export/Import =====

export function exportCSV(fn, rows) {
  var csv = rows.map(function (r) {
    return r.map(function (c) {
      c = String(c == null ? "" : c);
      if (c.indexOf(",") >= 0 || c.indexOf('"') >= 0 || c.indexOf("\n") >= 0)
        c = '"' + c.replace(/"/g, '""') + '"';
      return c;
    }).join(",");
  }).join("\n");
  var b = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  var u = URL.createObjectURL(b);
  var a = document.createElement("a");
  a.href = u; a.download = fn;
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  URL.revokeObjectURL(u);
}

export function exportData() {
  var d = {
    students: state.students, attendance: state.attendance, classes: state.classes,
    lecturer: state.lecturer, accounts: state.accounts, exportedAt: new Date().toISOString(),
  };
  var b = new Blob([JSON.stringify(d, null, 2)], { type: "application/json" });
  var u = URL.createObjectURL(b);
  var a = document.createElement("a");
  a.href = u; a.download = "attendance-backup-" + new Date().toISOString().slice(0, 10) + ".json";
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  URL.revokeObjectURL(u);
}

export function importData(json) {
  try {
    var d = JSON.parse(json);
    if (d.students) state.students = d.students;
    if (d.attendance) state.attendance = d.attendance;
    if (d.classes) state.classes = d.classes;
    if (d.lecturer) state.lecturer = d.lecturer;
    if (d.accounts) state.accounts = d.accounts;
    persist();
    return null;
  } catch (e) { return "Invalid backup file."; }
}

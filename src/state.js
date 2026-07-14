// state.js — application state and localStorage persistence

var LS = {
  students: "sams_students",
  attendance: "sams_attendance",
  session: "sams_session",
  lecturer: "sams_lecturer",
  theme: "sams_theme",
  classes: "sams_classes",
  accounts: "sams_accounts",
  currentAccount: "sams_current_account",
};

function load(k, f) {
  try { var r = localStorage.getItem(k); return r ? JSON.parse(r) : f; } catch (e) { return f; }
}
function save(k, v) {
  try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {}
}

export var state = {
  students: load(LS.students, []),
  attendance: load(LS.attendance, []),
  session: load(LS.session, null),
  lecturer: load(LS.lecturer, null),
  theme: load(LS.theme, "light"),
  classes: load(LS.classes, []),
  accounts: load(LS.accounts, []),
  currentAccount: load(LS.currentAccount, null),
  view: "dashboard",
  authView: "login",
  editingId: null,
  profileId: null,
  selectedClassId: null,
  attendanceDraft: {},
  attendanceNotes: {},
};

export function persist() {
  save(LS.students, state.students);
  save(LS.attendance, state.attendance);
  save(LS.session, state.session);
  save(LS.lecturer, state.lecturer);
  save(LS.classes, state.classes);
  save(LS.accounts, state.accounts);
  save(LS.currentAccount, state.currentAccount);
}

export function applyTheme() {
  document.documentElement.setAttribute("data-theme", state.theme);
}

export function toggleTheme() {
  state.theme = state.theme === "dark" ? "light" : "dark";
  save(LS.theme, state.theme);
  applyTheme();
  var b = document.getElementById("theme-toggle-btn");
  if (b) b.innerHTML = state.theme === "dark" ? sunSVG() : moonSVG();
}

function sunSVG() {
  return '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>';
}
function moonSVG() {
  return '<svg viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
}

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
}

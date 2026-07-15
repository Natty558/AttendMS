// pages/settings.js — settings page

import { state, toggleTheme, persist } from "../state.js";
import { SVG, icon } from "../icons.js";
import { toast } from "../utils.js";
import { hashPassword as hp } from "../auth.js";
import { exportData, importData } from "../data.js";
import { initPage, getContainer } from "../layout.js";

initPage("settings", "Settings", "Manage your data and preferences");

var c = getContainer();

c.innerHTML =
  '<div class="panel"><div class="panel-header"><h2>Appearance</h2></div><div class="panel-body"><div class="flex-between"><div><p class="text-bold">Dark Mode</p><p class="text-sm text-muted">Toggle between light and dark themes.</p></div><button class="btn btn-outline btn-sm" id="toggle-theme">' + (state.theme === "dark" ? "Switch to Light" : "Switch to Dark") + '</button></div></div></div>' +
  '<div class="panel"><div class="panel-header"><h2>Change Password</h2></div><div class="panel-body"><form id="change-pw-form"><div class="form-group"><label>Current Password</label><div class="password-field"><input type="password" id="cpw-current" placeholder="Enter current password" style="padding-right:2.5rem;"/><button type="button" class="password-toggle" id="cpw-toggle1">' + SVG.eye + '</button></div></div><div class="form-group"><label>New Password</label><div class="password-field"><input type="password" id="cpw-new" placeholder="Min 6 characters" style="padding-right:2.5rem;"/><button type="button" class="password-toggle" id="cpw-toggle2">' + SVG.eye + '</button></div></div><div class="form-group"><label>Confirm New Password</label><div class="password-field"><input type="password" id="cpw-confirm" placeholder="Re-enter new password" style="padding-right:2.5rem;"/><button type="button" class="password-toggle" id="cpw-toggle3">' + SVG.eye + '</button></div></div><div id="cpw-error"></div><button type="submit" class="btn btn-primary" style="width:auto;">Update Password</button></form></div></div>' +
  '<div class="panel"><div class="panel-header"><h2>Data Management</h2></div><div class="panel-body"><div style="display:flex;flex-direction:column;gap:1rem;"><div class="flex-between"><div><p class="text-bold">Export Data</p><p class="text-sm text-muted">Download all data as a JSON backup.</p></div><button class="btn btn-accent btn-sm" id="export-data">' + icon("download", "icon-sm") + ' Export</button></div><div class="flex-between"><div><p class="text-bold">Import Data</p><p class="text-sm text-muted">Restore from a JSON backup. Replaces current data.</p></div><button class="btn btn-outline btn-sm" id="import-data">' + icon("upload", "icon-sm") + ' Import</button></div><input type="file" id="import-file" accept=".json" style="display:none;"/></div></div></div>' +
  '<div class="panel"><div class="panel-header"><h2>Danger Zone</h2></div><div class="panel-body"><div class="flex-between"><div><p class="text-bold" style="color:var(--danger)">Clear All Data</p><p class="text-sm text-muted">Permanently delete all students, attendance, and classes.</p></div><button class="btn btn-danger btn-sm" id="clear-data">' + icon("trash", "icon-sm") + ' Delete Everything</button></div></div></div>' +
  '<div class="panel"><div class="panel-header"><h2>About</h2></div><div class="panel-body"><p class="text-bold">Student Attendance Management System</p><p class="text-sm text-muted mt-1">Version 5.0 · Multi-page HTML/CSS/JS architecture. Data stored locally in your browser.</p></div></div>';

c.querySelector("#toggle-theme").addEventListener("click", function () { toggleTheme(); window.location.reload(); });

function bpw(ii, ti) {
  var inp = c.querySelector("#" + ii), tog = c.querySelector("#" + ti);
  tog.addEventListener("click", function () { var p = inp.type === "password"; inp.type = p ? "text" : "password"; tog.innerHTML = p ? SVG.eyeOff : SVG.eye; });
}
bpw("cpw-current", "cpw-toggle1"); bpw("cpw-new", "cpw-toggle2"); bpw("cpw-confirm", "cpw-toggle3");

c.querySelector("#change-pw-form").addEventListener("submit", function (e) {
  e.preventDefault();
  var cur = c.querySelector("#cpw-current").value, np = c.querySelector("#cpw-new").value, cp = c.querySelector("#cpw-confirm").value, el = c.querySelector("#cpw-error");
  if (!state.currentAccount) { el.innerHTML = '<div class="alert alert-error">No account session found.</div>'; return; }
  if (state.currentAccount.passwordHash !== hp(cur)) { el.innerHTML = '<div class="alert alert-error">Current password is incorrect.</div>'; return; }
  if (np.length < 6) { el.innerHTML = '<div class="alert alert-error">New password must be at least 6 characters.</div>'; return; }
  if (np !== cp) { el.innerHTML = '<div class="alert alert-error">New passwords do not match.</div>'; return; }
  state.currentAccount.passwordHash = hp(np);
  persist();
  el.innerHTML = '<div class="auth-success">Password updated successfully.</div>';
  c.querySelector("#change-pw-form").reset();
  toast("Password updated.");
});

c.querySelector("#export-data").addEventListener("click", function () { exportData(); toast("Data exported."); });
c.querySelector("#import-data").addEventListener("click", function () { c.querySelector("#import-file").click(); });
c.querySelector("#import-file").addEventListener("change", function (e) {
  var f = e.target.files[0]; if (!f) return;
  var r = new FileReader();
  r.onload = function (ev) { var err = importData(ev.target.result); if (err) toast(err); else { toast("Data imported."); window.location.reload(); } };
  r.readAsText(f);
});
c.querySelector("#clear-data").addEventListener("click", function () {
  if (confirm("Delete ALL students, attendance, and classes? This cannot be undone.")) {
    state.students = []; state.attendance = []; state.classes = []; persist(); toast("All data cleared."); window.location.reload();
  }
});

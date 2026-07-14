// views-profile.js — profile and settings views

import { state, toggleTheme, persist } from "./state.js";
import { SVG, icon } from "./icons.js";
import { esc, cap, toast, handleImageUpload } from "./utils.js";
import { exportData, importData } from "./data.js";
import { updateLecturer, hashPassword as hp } from "./auth.js";
import { setTopbar } from "./views-layout.js";
import { render } from "./nav.js";

export function renderProfile() {
  setTopbar("My Profile", "Manage your lecturer profile");
  var d = document.createElement("div"), lec = state.lecturer || {}, ph = lec.photo || "";
  var avH = ph ? '<img src="' + esc(ph) + '"/>' : '<span class="avatar-placeholder">' + SVG.userPlaceholder + '</span>';

  d.innerHTML =
    '<div class="panel"><div class="profile-header"><div class="profile-avatar-lg">' + avH + '</div><div><div class="profile-name">' + esc(cap(lec.name || "Lecturer")) + '</div><div class="profile-meta"><div class="profile-meta-item">' + SVG.mail + ' ' + esc(lec.email || "") + '</div>' + (lec.phone ? '<div class="profile-meta-item">' + SVG.phone + ' ' + esc(lec.phone) + '</div>' : "") + '</div></div></div></div>' +
    '<div class="panel"><div class="panel-header"><h2>Edit Profile</h2></div><div class="modal-body"><div id="pe"></div>' +
    '<div class="avatar-upload"><div class="avatar-preview" id="avatar-preview">' + (ph ? '<img src="' + esc(ph) + '"/>' : '<div class="avatar-placeholder">' + SVG.userPlaceholder + '</div>') + '</div><input type="file" id="photo-input" accept="image/*" style="display:none"/><button class="btn btn-outline btn-sm" id="upload-btn">' + icon("camera", "icon-sm") + ' Upload Photo</button>' + (ph ? '<button class="btn btn-danger btn-sm btn-icon" id="remove-photo" title="Remove photo">' + SVG.trash + '</button>' : "") + '<span class="avatar-upload-hint">Max 500KB · JPG/PNG</span></div>' +
    '<form id="pf"><div class="form-group"><label>Full Name</label><input type="text" id="p-name" required value="' + esc(lec.name || "") + '"/></div><div class="form-group"><label>Email</label><input type="email" id="p-email" required value="' + esc(lec.email || "") + '"/></div><div class="form-group"><label>Phone (optional)</label><input type="text" id="p-phone" value="' + esc(lec.phone || "") + '"/></div>' +
    '<div class="form-group"><label>Current Password (required to save changes)</label><div class="password-field"><input type="password" id="p-password" placeholder="Enter your password to confirm" style="padding-right:2.5rem;"/><button type="button" class="password-toggle" id="p-pw-toggle">' + SVG.eye + '</button></div></div>' +
    '<div class="form-actions"><button type="submit" class="btn btn-primary" style="width:auto;">' + icon("save", "icon-sm") + ' Save Profile</button></div></form></div></div>';

  var photoData = ph;
  d.querySelector("#upload-btn").addEventListener("click", function () { d.querySelector("#photo-input").click(); });
  d.querySelector("#photo-input").addEventListener("change", function (e) {
    handleImageUpload(e.target.files[0], function (data) { photoData = data; d.querySelector("#avatar-preview").innerHTML = '<img src="' + esc(data) + '"/>'; });
  });
  var rp = d.querySelector("#remove-photo");
  if (rp) rp.addEventListener("click", function () { photoData = ""; d.querySelector("#avatar-preview").innerHTML = '<div class="avatar-placeholder">' + SVG.userPlaceholder + '</div>'; });
  var pPwI = d.querySelector("#p-password"), pPwT = d.querySelector("#p-pw-toggle");
  pPwT.addEventListener("click", function () { var p = pPwI.type === "password"; pPwI.type = p ? "text" : "password"; pPwT.innerHTML = p ? SVG.eyeOff : SVG.eye; });

  d.querySelector("#pf").addEventListener("submit", function (e) {
    e.preventDefault();
    var d2 = { name: d.querySelector("#p-name").value, email: d.querySelector("#p-email").value, phone: d.querySelector("#p-phone").value, photo: photoData };
    var pw = d.querySelector("#p-password").value;
    if (!d2.name.trim() || !d2.email.trim()) { d.querySelector("#pe").innerHTML = '<div class="alert alert-error">Name and email are required.</div>'; return; }
    if (state.currentAccount && state.currentAccount.passwordHash !== hp(pw)) {
      d.querySelector("#pe").innerHTML = '<div class="alert alert-error">Incorrect password. Changes not saved.</div>';
      return;
    }
    updateLecturer(d2);
    toast("Profile updated.");
    render();
  });
  return d;
}

export function renderSettings() {
  setTopbar("Settings", "Manage your data and preferences");
  var d = document.createElement("div");
  d.innerHTML =
    '<div class="panel"><div class="panel-header"><h2>Appearance</h2></div><div class="panel-body"><div class="flex-between"><div><p class="text-bold">Dark Mode</p><p class="text-sm text-muted">Toggle between light and dark themes.</p></div><button class="btn btn-outline btn-sm" id="toggle-theme">' + (state.theme === "dark" ? "Switch to Light" : "Switch to Dark") + '</button></div></div></div>' +
    '<div class="panel"><div class="panel-header"><h2>Change Password</h2></div><div class="panel-body"><form id="change-pw-form"><div class="form-group"><label>Current Password</label><div class="password-field"><input type="password" id="cpw-current" placeholder="Enter current password" style="padding-right:2.5rem;"/><button type="button" class="password-toggle" id="cpw-toggle1">' + SVG.eye + '</button></div></div><div class="form-group"><label>New Password</label><div class="password-field"><input type="password" id="cpw-new" placeholder="Min 6 characters" style="padding-right:2.5rem;"/><button type="button" class="password-toggle" id="cpw-toggle2">' + SVG.eye + '</button></div></div><div class="form-group"><label>Confirm New Password</label><div class="password-field"><input type="password" id="cpw-confirm" placeholder="Re-enter new password" style="padding-right:2.5rem;"/><button type="button" class="password-toggle" id="cpw-toggle3">' + SVG.eye + '</button></div></div><div id="cpw-error"></div><button type="submit" class="btn btn-primary" style="width:auto;">Update Password</button></form></div></div>' +
    '<div class="panel"><div class="panel-header"><h2>Data Management</h2></div><div class="panel-body"><div style="display:flex;flex-direction:column;gap:1rem;"><div class="flex-between"><div><p class="text-bold">Export Data</p><p class="text-sm text-muted">Download all data as a JSON backup.</p></div><button class="btn btn-accent btn-sm" id="export-data">' + icon("download", "icon-sm") + ' Export</button></div><div class="flex-between"><div><p class="text-bold">Import Data</p><p class="text-sm text-muted">Restore from a JSON backup. Replaces current data.</p></div><button class="btn btn-outline btn-sm" id="import-data">' + icon("upload", "icon-sm") + ' Import</button></div><input type="file" id="import-file" accept=".json" style="display:none;"/></div></div></div>' +
    '<div class="panel"><div class="panel-header"><h2>Danger Zone</h2></div><div class="panel-body"><div class="flex-between"><div><p class="text-bold" style="color:var(--danger)">Clear All Data</p><p class="text-sm text-muted">Permanently delete all students, attendance, and classes.</p></div><button class="btn btn-danger btn-sm" id="clear-data">' + icon("trash", "icon-sm") + ' Delete Everything</button></div></div></div>' +
    '<div class="panel"><div class="panel-header"><h2>About</h2></div><div class="panel-body"><p class="text-bold">Student Attendance Management System</p><p class="text-sm text-muted mt-1">Version 4.2 · Built with pure HTML, CSS, and JavaScript. Modular architecture. Data stored locally in your browser.</p></div></div>';

  d.querySelector("#toggle-theme").addEventListener("click", function () { toggleTheme(); render(); });

  function bpw(ii, ti) {
    var inp = d.querySelector("#" + ii), tog = d.querySelector("#" + ti);
    tog.addEventListener("click", function () { var p = inp.type === "password"; inp.type = p ? "text" : "password"; tog.innerHTML = p ? SVG.eyeOff : SVG.eye; });
  }
  bpw("cpw-current", "cpw-toggle1"); bpw("cpw-new", "cpw-toggle2"); bpw("cpw-confirm", "cpw-toggle3");

  d.querySelector("#change-pw-form").addEventListener("submit", function (e) {
    e.preventDefault();
    var cur = d.querySelector("#cpw-current").value, np = d.querySelector("#cpw-new").value, cp = d.querySelector("#cpw-confirm").value, el = d.querySelector("#cpw-error");
    if (!state.currentAccount) { el.innerHTML = '<div class="alert alert-error">No account session found.</div>'; return; }
    if (state.currentAccount.passwordHash !== hp(cur)) { el.innerHTML = '<div class="alert alert-error">Current password is incorrect.</div>'; return; }
    if (np.length < 6) { el.innerHTML = '<div class="alert alert-error">New password must be at least 6 characters.</div>'; return; }
    if (np !== cp) { el.innerHTML = '<div class="alert alert-error">New passwords do not match.</div>'; return; }
    state.currentAccount.passwordHash = hp(np);
    persist();
    el.innerHTML = '<div class="auth-success">Password updated successfully.</div>';
    d.querySelector("#change-pw-form").reset();
    toast("Password updated.");
  });

  d.querySelector("#export-data").addEventListener("click", function () { exportData(); toast("Data exported."); });
  d.querySelector("#import-data").addEventListener("click", function () { d.querySelector("#import-file").click(); });
  d.querySelector("#import-file").addEventListener("change", function (e) {
    var f = e.target.files[0]; if (!f) return;
    var r = new FileReader();
    r.onload = function (ev) { var err = importData(ev.target.result); if (err) toast(err); else { toast("Data imported."); render(); } };
    r.readAsText(f);
  });
  d.querySelector("#clear-data").addEventListener("click", function () {
    if (confirm("Delete ALL students, attendance, and classes? This cannot be undone.")) {
      state.students = []; state.attendance = []; state.classes = []; persist(); toast("All data cleared."); render();
    }
  });
  return d;
}

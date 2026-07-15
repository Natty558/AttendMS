// pages/profile.js — profile editor page

import { state, persist } from "../state.js";
import { SVG, icon } from "../icons.js";
import { esc, cap, toast, handleImageUpload } from "../utils.js";
import { updateLecturer, hashPassword as hp } from "../auth.js";
import { initPage, getContainer } from "../layout.js";

initPage("profile", "My Profile", "Manage your lecturer profile");

var c = getContainer();
var lec = state.lecturer || {}, ph = lec.photo || "";
var avH = ph ? '<img src="' + esc(ph) + '"/>' : '<span class="avatar-placeholder">' + SVG.userPlaceholder + '</span>';

c.innerHTML =
  '<div class="panel"><div class="profile-header"><div class="profile-avatar-lg">' + avH + '</div><div><div class="profile-name">' + esc(cap(lec.name || "Lecturer")) + '</div><div class="profile-meta"><div class="profile-meta-item">' + SVG.mail + ' ' + esc(lec.email || "") + '</div>' + (lec.phone ? '<div class="profile-meta-item">' + SVG.phone + ' ' + esc(lec.phone) + '</div>' : "") + '</div></div></div></div>' +
  '<div class="panel"><div class="panel-header"><h2>Edit Profile</h2></div><div class="modal-body"><div id="pe"></div>' +
  '<div class="avatar-upload"><div class="avatar-preview" id="avatar-preview">' + (ph ? '<img src="' + esc(ph) + '"/>' : '<div class="avatar-placeholder">' + SVG.userPlaceholder + '</div>') + '</div><input type="file" id="photo-input" accept="image/*" style="display:none"/><button class="btn btn-outline btn-sm" id="upload-btn">' + icon("camera", "icon-sm") + ' Upload Photo</button>' + (ph ? '<button class="btn btn-danger btn-sm btn-icon" id="remove-photo" title="Remove photo">' + SVG.trash + '</button>' : "") + '<span class="avatar-upload-hint">Max 500KB · JPG/PNG</span></div>' +
  '<form id="pf"><div class="form-group"><label>Full Name</label><input type="text" id="p-name" required value="' + esc(lec.name || "") + '"/></div><div class="form-group"><label>Email</label><input type="email" id="p-email" required value="' + esc(lec.email || "") + '"/></div><div class="form-group"><label>Phone (optional)</label><input type="text" id="p-phone" value="' + esc(lec.phone || "") + '"/></div>' +
  '<div class="form-group"><label>Current Password (required to save changes)</label><div class="password-field"><input type="password" id="p-password" placeholder="Enter your password to confirm" style="padding-right:2.5rem;"/><button type="button" class="password-toggle" id="p-pw-toggle">' + SVG.eye + '</button></div></div>' +
  '<div class="form-actions"><button type="submit" class="btn btn-primary" style="width:auto;">' + icon("save", "icon-sm") + ' Save Profile</button></div></form></div></div>';

var photoData = ph;
c.querySelector("#upload-btn").addEventListener("click", function () { c.querySelector("#photo-input").click(); });
c.querySelector("#photo-input").addEventListener("change", function (e) {
  handleImageUpload(e.target.files[0], function (data) { photoData = data; c.querySelector("#avatar-preview").innerHTML = '<img src="' + esc(data) + '"/>'; });
});
var rp = c.querySelector("#remove-photo");
if (rp) rp.addEventListener("click", function () { photoData = ""; c.querySelector("#avatar-preview").innerHTML = '<div class="avatar-placeholder">' + SVG.userPlaceholder + '</div>'; });
var pPwI = c.querySelector("#p-password"), pPwT = c.querySelector("#p-pw-toggle");
pPwT.addEventListener("click", function () { var p = pPwI.type === "password"; pPwI.type = p ? "text" : "password"; pPwT.innerHTML = p ? SVG.eyeOff : SVG.eye; });

c.querySelector("#pf").addEventListener("submit", function (e) {
  e.preventDefault();
  var d2 = { name: c.querySelector("#p-name").value, email: c.querySelector("#p-email").value, phone: c.querySelector("#p-phone").value, photo: photoData };
  var pw = c.querySelector("#p-password").value;
  if (!d2.name.trim() || !d2.email.trim()) { c.querySelector("#pe").innerHTML = '<div class="alert alert-error">Name and email are required.</div>'; return; }
  if (state.currentAccount && state.currentAccount.passwordHash !== hp(pw)) {
    c.querySelector("#pe").innerHTML = '<div class="alert alert-error">Incorrect password. Changes not saved.</div>';
    return;
  }
  updateLecturer(d2);
  toast("Profile updated.");
  window.location.reload();
});

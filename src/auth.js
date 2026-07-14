// auth.js — authentication logic (localStorage-based)

import { state, persist } from "./state.js";
import { uid } from "./utils.js";

function hashPassword(pw) {
  var h = 0;
  for (var i = 0; i < pw.length; i++) {
    var c = pw.charCodeAt(i);
    h = ((h << 5) - h) + c;
    h = h & h;
  }
  return "h" + Math.abs(h).toString(36);
}

export function validateEmail(e) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
}

export function passwordStrength(pw) {
  var s = 0;
  if (pw.length >= 6) s++;
  if (pw.length >= 10) s++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) s++;
  if (/[0-9]/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  if (s <= 1) return { level: "weak", label: "Weak", bars: 1 };
  if (s <= 3) return { level: "medium", label: "Medium", bars: 2 };
  return { level: "strong", label: "Strong", bars: 3 };
}

export { hashPassword };

export function registerAccount(name, email, password) {
  if (!name || !name.trim()) return "Please enter your full name.";
  if (!validateEmail(email)) return "Please enter a valid email address.";
  if (password.length < 6) return "Password must be at least 6 characters.";
  var ex = state.accounts.find(function (a) { return a.email.toLowerCase() === email.toLowerCase(); });
  if (ex) return "An account with this email already exists. Please sign in instead.";
  var acc = {
    id: uid("ACC-"), name: name.trim(), email: email.toLowerCase(),
    passwordHash: hashPassword(password), phone: "", photo: "",
    createdAt: new Date().toISOString(),
  };
  state.accounts.push(acc);
  state.currentAccount = acc;
  state.lecturer = { name: acc.name, email: acc.email, phone: acc.phone, photo: acc.photo };
  state.session = { email: acc.email, loginAt: Date.now() };
  persist();
  return null;
}

export function loginAccount(email, password) {
  if (!email || !password) return "Please enter both email and password.";
  if (!validateEmail(email)) return "Please enter a valid email address.";
  var acc = state.accounts.find(function (a) { return a.email.toLowerCase() === email.toLowerCase(); });
  if (!acc) return "No account found with this email. Please register first.";
  if (acc.passwordHash !== hashPassword(password)) return "Incorrect password. Please try again.";
  state.currentAccount = acc;
  state.lecturer = { name: acc.name, email: acc.email, phone: acc.phone || "", photo: acc.photo || "" };
  state.session = { email: acc.email, loginAt: Date.now() };
  persist();
  return null;
}

export function resetPassword(email, newPw) {
  if (!validateEmail(email)) return "Please enter a valid email address.";
  if (newPw.length < 6) return "Password must be at least 6 characters.";
  var acc = state.accounts.find(function (a) { return a.email.toLowerCase() === email.toLowerCase(); });
  if (!acc) return "No account found with this email address.";
  acc.passwordHash = hashPassword(newPw);
  persist();
  return null;
}

export function logout() {
  state.session = null;
  state.currentAccount = null;
  persist();
  state.view = "dashboard";
  state.authView = "login";
}

export function isLoggedIn() {
  return !!state.session;
}

export function updateLecturer(d) {
  if (!state.lecturer) state.lecturer = {};
  state.lecturer.name = d.name || state.lecturer.name;
  state.lecturer.email = d.email || state.lecturer.email;
  state.lecturer.phone = d.phone || "";
  if (d.photo !== undefined) state.lecturer.photo = d.photo;
  if (state.currentAccount) {
    state.currentAccount.name = state.lecturer.name;
    state.currentAccount.email = state.lecturer.email;
    state.currentAccount.phone = state.lecturer.phone;
    state.currentAccount.photo = state.lecturer.photo;
  }
  persist();
}

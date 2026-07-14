// views-auth.js — login, register, and forgot password screens

import { state } from "./state.js";
import { render } from "./nav.js";
import { LOGO_SVG, SVG } from "./icons.js";
import { esc, cap, toast } from "./utils.js";
import { loginAccount, registerAccount, resetPassword, passwordStrength } from "./auth.js";

export function renderAuth() {
  var d = document.createElement("div");
  d.className = "auth-screen";
  if (state.authView === "register") d.appendChild(renderRegister());
  else if (state.authView === "forgot") d.appendChild(renderForgot());
  else d.appendChild(renderLogin());
  return d;
}

function renderLogin() {
  var d = document.createElement("div");
  d.className = "auth-card";
  d.innerHTML =
    '<div class="auth-logo">' + LOGO_SVG + '</div>' +
    '<h1>Welcome Back</h1><p class="subtitle">Sign in to your lecturer account</p>' +
    '<div id="auth-error"></div>' +
    '<form id="login-form">' +
    '<div class="form-group"><label for="email">Email Address</label><input type="email" id="email" placeholder="lecturer@school.edu" required autocomplete="email"/></div>' +
    '<div class="form-group"><label for="password">Password</label><div class="password-field"><input type="password" id="password" placeholder="Enter your password" required autocomplete="current-password"/><button type="button" class="password-toggle" id="pw-toggle">' + SVG.eye + '</button></div></div>' +
    '<button type="submit" class="btn btn-primary" id="login-btn">Sign In</button></form>' +
    '<div class="auth-links"><div class="auth-divider">or</div>' +
    '<span class="auth-link">Don\'t have an account? <a id="go-register">Create one</a></span>' +
    '<span class="auth-link"><a id="go-forgot">Forgot your password?</a></span></div>';

  var pwI = d.querySelector("#password"), pwT = d.querySelector("#pw-toggle");
  pwT.addEventListener("click", function () {
    var p = pwI.type === "password"; pwI.type = p ? "text" : "password"; pwT.innerHTML = p ? SVG.eyeOff : SVG.eye;
  });
  d.querySelector("#go-register").addEventListener("click", function () { state.authView = "register"; render(); });
  d.querySelector("#go-forgot").addEventListener("click", function () { state.authView = "forgot"; render(); });
  d.querySelector("#login-form").addEventListener("submit", function (e) {
    e.preventDefault();
    var em = d.querySelector("#email").value.trim(), pw = d.querySelector("#password").value;
    var el = d.querySelector("#auth-error"), btn = d.querySelector("#login-btn");
    btn.disabled = true; btn.textContent = "Signing in...";
    setTimeout(function () {
      var err = loginAccount(em, pw);
      btn.disabled = false; btn.textContent = "Sign In";
      if (err) el.innerHTML = '<div class="alert alert-error auth-error">' + err + '</div>';
      else { toast("Welcome back, " + cap(state.lecturer.name.split(" ")[0]) + "!"); render(); }
    }, 400);
  });
  return d;
}

function renderRegister() {
  var d = document.createElement("div");
  d.className = "auth-card";
  d.innerHTML =
    '<div class="auth-logo">' + LOGO_SVG + '</div>' +
    '<h1>Create Account</h1><p class="subtitle">Register as a new lecturer</p>' +
    '<div id="auth-error"></div>' +
    '<form id="register-form">' +
    '<div class="form-group"><label for="name">Full Name</label><input type="text" id="name" placeholder="Dr. Jane Smith" required autocomplete="name"/></div>' +
    '<div class="form-group"><label for="email">Email Address</label><input type="email" id="email" placeholder="lecturer@school.edu" required autocomplete="email"/></div>' +
    '<div class="form-group"><label for="password">Password</label><div class="password-field"><input type="password" id="password" placeholder="Min 6 characters" required autocomplete="new-password"/><button type="button" class="password-toggle" id="pw-toggle">' + SVG.eye + '</button></div>' +
    '<div class="password-strength" id="pw-strength"><div class="password-strength-bar"></div><div class="password-strength-bar"></div><div class="password-strength-bar"></div></div>' +
    '<div class="password-strength-label" id="pw-strength-label"></div></div>' +
    '<div class="form-group"><label for="confirm">Confirm Password</label><div class="password-field"><input type="password" id="confirm" placeholder="Re-enter password" required autocomplete="new-password"/><button type="button" class="password-toggle" id="pw-toggle2">' + SVG.eye + '</button></div></div>' +
    '<button type="submit" class="btn btn-primary" id="register-btn">Create Account</button></form>' +
    '<div class="auth-links"><div class="auth-divider">or</div>' +
    '<span class="auth-link">Already have an account? <a id="go-login">Sign in</a></span></div>';

  var pwI = d.querySelector("#password"), pwT = d.querySelector("#pw-toggle"), pwT2 = d.querySelector("#pw-toggle2"), cI = d.querySelector("#confirm");
  var sB = d.querySelectorAll("#pw-strength .password-strength-bar"), sL = d.querySelector("#pw-strength-label");
  function tg(inp, btn) { var p = inp.type === "password"; inp.type = p ? "text" : "password"; btn.innerHTML = p ? SVG.eyeOff : SVG.eye; }
  pwT.addEventListener("click", function () { tg(pwI, pwT); });
  pwT2.addEventListener("click", function () { tg(cI, pwT2); });
  pwI.addEventListener("input", function () {
    var pw = pwI.value;
    if (!pw) { sB.forEach(function (b) { b.className = "password-strength-bar"; }); sL.textContent = ""; return; }
    var s = passwordStrength(pw);
    sB.forEach(function (b, i) { b.className = "password-strength-bar" + (i < s.bars ? " active " + s.level : ""); });
    sL.textContent = s.label;
    sL.style.color = s.level === "weak" ? "var(--danger)" : s.level === "medium" ? "var(--warning)" : "var(--success)";
  });
  d.querySelector("#go-login").addEventListener("click", function () { state.authView = "login"; render(); });
  d.querySelector("#register-form").addEventListener("submit", function (e) {
    e.preventDefault();
    var nm = d.querySelector("#name").value.trim(), em = d.querySelector("#email").value.trim();
    var pw = d.querySelector("#password").value, cf = d.querySelector("#confirm").value;
    var el = d.querySelector("#auth-error"), btn = d.querySelector("#register-btn");
    if (pw !== cf) { el.innerHTML = '<div class="alert alert-error auth-error">Passwords do not match.</div>'; return; }
    btn.disabled = true; btn.textContent = "Creating account...";
    setTimeout(function () {
      var err = registerAccount(nm, em, pw);
      btn.disabled = false; btn.textContent = "Create Account";
      if (err) el.innerHTML = '<div class="alert alert-error auth-error">' + err + '</div>';
      else { toast("Account created! Welcome, " + cap(state.lecturer.name.split(" ")[0]) + "."); render(); }
    }, 500);
  });
  return d;
}

function renderForgot() {
  var d = document.createElement("div");
  d.className = "auth-card";
  d.innerHTML =
    '<div class="auth-logo">' + LOGO_SVG + '</div>' +
    '<h1>Reset Password</h1><p class="subtitle">Enter your email and a new password</p>' +
    '<div id="auth-error"></div><div id="auth-success-box"></div>' +
    '<form id="forgot-form">' +
    '<div class="form-group"><label for="email">Email Address</label><input type="email" id="email" placeholder="lecturer@school.edu" required autocomplete="email"/></div>' +
    '<div class="form-group"><label for="password">New Password</label><div class="password-field"><input type="password" id="password" placeholder="Min 6 characters" required autocomplete="new-password"/><button type="button" class="password-toggle" id="pw-toggle">' + SVG.eye + '</button></div>' +
    '<div class="password-strength" id="pw-strength"><div class="password-strength-bar"></div><div class="password-strength-bar"></div><div class="password-strength-bar"></div></div>' +
    '<div class="password-strength-label" id="pw-strength-label"></div></div>' +
    '<div class="form-group"><label for="confirm">Confirm New Password</label><div class="password-field"><input type="password" id="confirm" placeholder="Re-enter password" required autocomplete="new-password"/><button type="button" class="password-toggle" id="pw-toggle2">' + SVG.eye + '</button></div></div>' +
    '<button type="submit" class="btn btn-primary" id="reset-btn">Reset Password</button></form>' +
    '<div class="auth-links"><span class="auth-link">Remembered your password? <a id="go-login">Sign in</a></span></div>';

  var pwI = d.querySelector("#password"), pwT = d.querySelector("#pw-toggle"), pwT2 = d.querySelector("#pw-toggle2"), cI = d.querySelector("#confirm");
  var sB = d.querySelectorAll("#pw-strength .password-strength-bar"), sL = d.querySelector("#pw-strength-label");
  function tg(inp, btn) { var p = inp.type === "password"; inp.type = p ? "text" : "password"; btn.innerHTML = p ? SVG.eyeOff : SVG.eye; }
  pwT.addEventListener("click", function () { tg(pwI, pwT); });
  pwT2.addEventListener("click", function () { tg(cI, pwT2); });
  pwI.addEventListener("input", function () {
    var pw = pwI.value;
    if (!pw) { sB.forEach(function (b) { b.className = "password-strength-bar"; }); sL.textContent = ""; return; }
    var s = passwordStrength(pw);
    sB.forEach(function (b, i) { b.className = "password-strength-bar" + (i < s.bars ? " active " + s.level : ""); });
    sL.textContent = s.label;
    sL.style.color = s.level === "weak" ? "var(--danger)" : s.level === "medium" ? "var(--warning)" : "var(--success)";
  });
  d.querySelector("#go-login").addEventListener("click", function () { state.authView = "login"; render(); });
  d.querySelector("#forgot-form").addEventListener("submit", function (e) {
    e.preventDefault();
    var em = d.querySelector("#email").value.trim(), pw = d.querySelector("#password").value, cf = d.querySelector("#confirm").value;
    var el = d.querySelector("#auth-error"), sl = d.querySelector("#auth-success-box"), btn = d.querySelector("#reset-btn");
    if (pw !== cf) { el.innerHTML = '<div class="alert alert-error auth-error">Passwords do not match.</div>'; return; }
    btn.disabled = true; btn.textContent = "Resetting...";
    setTimeout(function () {
      var err = resetPassword(em, pw);
      btn.disabled = false; btn.textContent = "Reset Password";
      if (err) { el.innerHTML = '<div class="alert alert-error auth-error">' + err + '</div>'; sl.innerHTML = ""; }
      else {
        el.innerHTML = "";
        sl.innerHTML = '<div class="auth-success">Password reset successfully! You can now sign in with your new password.</div>';
        d.querySelector("#forgot-form").reset();
        setTimeout(function () { state.authView = "login"; render(); }, 2000);
      }
    }, 500);
  });
  return d;
}

// pages/register.js — register page logic

import { state, applyTheme } from "../state.js";
import { isLoggedIn, registerAccount, passwordStrength } from "../auth.js";
import { LOGO_SVG, SVG } from "../icons.js";
import { cap, toast } from "../utils.js";

applyTheme();

if (isLoggedIn()) {
  window.location.href = "/dashboard.html";
}

document.getElementById("logo").innerHTML = LOGO_SVG;
document.getElementById("pw-toggle").innerHTML = SVG.eye;
document.getElementById("pw-toggle2").innerHTML = SVG.eye;

var pwI = document.getElementById("password");
var pwT = document.getElementById("pw-toggle");
var pwT2 = document.getElementById("pw-toggle2");
var cI = document.getElementById("confirm");
var sB = document.querySelectorAll("#pw-strength .password-strength-bar");
var sL = document.getElementById("pw-strength-label");

function tg(inp, btn) {
  var p = inp.type === "password";
  inp.type = p ? "text" : "password";
  btn.innerHTML = p ? SVG.eyeOff : SVG.eye;
}

pwT.addEventListener("click", function () { tg(pwI, pwT); });
pwT2.addEventListener("click", function () { tg(cI, pwT2); });

pwI.addEventListener("input", function () {
  var pw = pwI.value;
  if (!pw) {
    sB.forEach(function (b) { b.className = "password-strength-bar"; });
    sL.textContent = "";
    return;
  }
  var s = passwordStrength(pw);
  sB.forEach(function (b, i) {
    b.className = "password-strength-bar" + (i < s.bars ? " active " + s.level : "");
  });
  sL.textContent = s.label;
  sL.style.color = s.level === "weak" ? "var(--danger)" : s.level === "medium" ? "var(--warning)" : "var(--success)";
});

document.getElementById("go-login").addEventListener("click", function () {
  window.location.href = "/login.html";
});

document.getElementById("register-form").addEventListener("submit", function (e) {
  e.preventDefault();
  var nm = document.getElementById("name").value.trim();
  var em = document.getElementById("email").value.trim();
  var pw = document.getElementById("password").value;
  var cf = document.getElementById("confirm").value;
  var el = document.getElementById("auth-error");
  var btn = document.getElementById("register-btn");

  if (pw !== cf) {
    el.innerHTML = '<div class="alert alert-error auth-error">Passwords do not match.</div>';
    return;
  }
  btn.disabled = true;
  btn.textContent = "Creating account...";
  setTimeout(function () {
    var err = registerAccount(nm, em, pw);
    btn.disabled = false;
    btn.textContent = "Create Account";
    if (err) {
      el.innerHTML = '<div class="alert alert-error auth-error">' + err + "</div>";
    } else {
      toast("Account created! Welcome, " + cap(state.lecturer.name.split(" ")[0]) + ".");
      window.location.href = "/dashboard.html";
    }
  }, 500);
});

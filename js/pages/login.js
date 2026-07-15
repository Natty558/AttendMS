// pages/login.js — login page logic

import { state, applyTheme } from "../state.js";
import { isLoggedIn, loginAccount } from "../auth.js";
import { LOGO_SVG, SVG } from "../icons.js";
import { cap, toast } from "../utils.js";

applyTheme();

if (isLoggedIn()) {
  window.location.href = "/dashboard.html";
}

document.getElementById("logo").innerHTML = LOGO_SVG;
document.getElementById("pw-toggle").innerHTML = SVG.eye;

var pwI = document.getElementById("password");
var pwT = document.getElementById("pw-toggle");
pwT.addEventListener("click", function () {
  var p = pwI.type === "password";
  pwI.type = p ? "text" : "password";
  pwT.innerHTML = p ? SVG.eyeOff : SVG.eye;
});

document.getElementById("go-register").addEventListener("click", function () {
  window.location.href = "/register.html";
});
document.getElementById("go-forgot").addEventListener("click", function () {
  window.location.href = "/forgot-password.html";
});

document.getElementById("login-form").addEventListener("submit", function (e) {
  e.preventDefault();
  var em = document.getElementById("email").value.trim();
  var pw = document.getElementById("password").value;
  var el = document.getElementById("auth-error");
  var btn = document.getElementById("login-btn");
  btn.disabled = true;
  btn.textContent = "Signing in...";
  setTimeout(function () {
    var err = loginAccount(em, pw);
    btn.disabled = false;
    btn.textContent = "Sign In";
    if (err) {
      el.innerHTML = '<div class="alert alert-error auth-error">' + err + "</div>";
    } else {
      toast("Welcome back, " + cap(state.lecturer.name.split(" ")[0]) + "!");
      window.location.href = "/dashboard.html";
    }
  }, 400);
});

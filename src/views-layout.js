// views-layout.js — sidebar, topbar, shared UI helpers

import { state, toggleTheme } from "./state.js";
import { logout } from "./auth.js";
import { LOGO_SVG, SVG, icon, navIcon } from "./icons.js";
import { esc, cap, avatarPlaceholderHTML } from "./utils.js";
import { atRiskStudents } from "./data.js";
import { setView, render } from "./nav.js";

export function renderLayout() {
  var d = document.createElement("div");
  d.className = "layout";
  var ln = state.lecturer ? state.lecturer.name : "Lecturer";
  var le = state.lecturer ? state.lecturer.email : "";
  var lp = state.lecturer && state.lecturer.photo ? state.lecturer.photo : "";
  var rN = atRiskStudents().length;
  var ti = state.theme === "dark" ? SVG.sun : SVG.moon;
  var avH = lp ? '<img src="' + esc(lp) + '" alt="avatar"/>' : '<span class="avatar-placeholder-icon">' + SVG.userPlaceholder + '</span>';

  d.innerHTML =
    '<aside class="sidebar" id="sidebar">' +
    '<div class="sidebar-header"><div class="logo"><div class="logo-icon">' + LOGO_SVG + '</div><div><h2>AttendMS</h2><p>Lecturer Portal</p></div></div></div>' +
    '<ul class="nav-menu">' +
    '<li class="nav-section-label">Main</li>' +
    navItem("dashboard", "dashboard", "Dashboard") +
    navItem("students", "students", "Students") +
    navItem("attendance", "attendance", "Take Attendance") +
    navItem("calendar", "calendar", "Calendar") +
    '<li class="nav-section-label">Insights</li>' +
    navItem("analytics", "analytics", "Analytics") +
    navItem("atrisk", "atrisk", "At-Risk Students", rN) +
    '<li class="nav-section-label">Manage</li>' +
    navItem("classes", "classes", "Classes") +
    navItem("reports", "reports", "Reports") +
    navItem("profile", "profile", "My Profile") +
    navItem("settings", "settings", "Settings") +
    '</ul>' +
    '<div class="sidebar-footer">' +
    '<div class="user-info" id="user-info-click"><div class="user-avatar">' + avH + '</div><div class="user-details"><p>' + esc(cap(ln)) + '</p><span>' + esc(le) + '</span></div></div>' +
    '<button class="btn btn-outline btn-sm" id="logout-btn" style="width:100%;color:var(--sidebar-text);border-color:rgba(255,255,255,0.15);">Sign Out</button>' +
    '</div></aside>' +
    '<main class="main-area">' +
    '<div class="topbar"><div class="topbar-left">' +
    '<button class="menu-toggle" id="menu-toggle">' + SVG.menu + '</button>' +
    '<div><h1 id="page-title">Dashboard</h1><p id="page-subtitle">Overview of attendance statistics</p></div>' +
    '</div><div class="topbar-actions"><button class="theme-toggle" id="theme-toggle-btn" title="Toggle theme">' + ti + '</button></div></div>' +
    '<div id="view-container"></div></main>';

  d.querySelector("#logout-btn").addEventListener("click", function () { logout(); render(); });
  d.querySelector("#menu-toggle").addEventListener("click", function () { d.querySelector("#sidebar").classList.toggle("open"); });
  d.querySelector("#theme-toggle-btn").addEventListener("click", toggleTheme);
  d.querySelector("#user-info-click").addEventListener("click", function () { setView("profile"); });
  return d;
}

function navItem(view, ic, label, badge) {
  var a = state.view === view ? " active" : "";
  var b = badge ? '<span class="nav-badge">' + badge + '</span>' : "";
  return '<li class="nav-item' + a + '" data-view="' + view + '">' + navIcon(ic) + label + b + '</li>';
}

export function attachNavHandlers() {
  document.querySelectorAll(".nav-item").forEach(function (i) {
    i.addEventListener("click", function () { setView(i.getAttribute("data-view")); });
  });
}

export function setTopbar(t, s) {
  document.querySelector("#page-title").textContent = t;
  document.querySelector("#page-subtitle").textContent = s;
}

export function statCard(ic, i, v, l) {
  return '<div class="stat-card"><div class="stat-top"><div class="stat-icon ' + ic + '">' + (SVG[i] || "") + '</div></div><div class="stat-value">' + v + '</div><div class="stat-label">' + l + '</div></div>';
}

export function studentAvatarHTML(s, sz) {
  sz = sz || 40;
  var st = 'width:' + sz + 'px;height:' + sz + 'px';
  if (s.photo) return '<div class="student-avatar" style="' + st + '"><img src="' + esc(s.photo) + '"/></div>';
  return '<div class="student-avatar" style="' + st + '">' + avatarPlaceholderHTML() + '</div>';
}

export function emptyState(img, msg) {
  return '<div class="empty-state"><div class="empty-icon"><img src="' + img + '" alt=""/></div><p>' + msg + '</p></div>';
}

// layout.js — injects sidebar + topbar into app pages, handles navigation and auth guard

import { state, toggleTheme, applyTheme } from "./state.js";
import { logout, isLoggedIn, requireAuth } from "./auth.js";
import { LOGO_SVG, SVG, navIcon } from "./icons.js";
import { esc, cap, avatarPlaceholderHTML } from "./utils.js";
import { atRiskStudents } from "./data.js";

export function initPage(currentView, pageTitle, pageSubtitle) {
  if (!requireAuth()) return;
  applyTheme();
  injectLayout(currentView, pageTitle, pageSubtitle);
  attachHandlers();
}

function injectLayout(currentView, pageTitle, pageSubtitle) {
  var ln = state.lecturer ? state.lecturer.name : "Lecturer";
  var le = state.lecturer ? state.lecturer.email : "";
  var lp = state.lecturer && state.lecturer.photo ? state.lecturer.photo : "";
  var rN = atRiskStudents().length;
  var ti = state.theme === "dark" ? SVG.sun : SVG.moon;
  var avH = lp ? '<img src="' + esc(lp) + '" alt="avatar"/>' : '<span class="avatar-placeholder-icon">' + SVG.userPlaceholder + '</span>';

  var navItems = [
    { section: "Main" },
    { view: "dashboard", icon: "dashboard", label: "Dashboard" },
    { view: "students", icon: "students", label: "Students" },
    { view: "attendance", icon: "attendance", label: "Take Attendance" },
    { view: "calendar", icon: "calendar", label: "Calendar" },
    { section: "Insights" },
    { view: "analytics", icon: "analytics", label: "Analytics" },
    { view: "atrisk", icon: "atrisk", label: "At-Risk Students", badge: rN },
    { section: "Manage" },
    { view: "classes", icon: "classes", label: "Classes" },
    { view: "reports", icon: "reports", label: "Reports" },
    { view: "profile", icon: "profile", label: "My Profile" },
    { view: "settings", icon: "settings", label: "Settings" },
  ];

  var navHTML = "";
  navItems.forEach(function (item) {
    if (item.section) {
      navHTML += '<li class="nav-section-label">' + item.section + '</li>';
    } else {
      var a = item.view === currentView ? " active" : "";
      var b = item.badge ? '<span class="nav-badge">' + item.badge + '</span>' : "";
      navHTML += '<li class="nav-item' + a + '" data-view="' + item.view + '">' + navIcon(item.icon) + item.label + b + '</li>';
    }
  });

  var layout =
    '<aside class="sidebar" id="sidebar">' +
    '<div class="sidebar-header"><div class="logo"><div class="logo-icon">' + LOGO_SVG + '</div><div><h2>AttendMS</h2><p>Lecturer Portal</p></div></div></div>' +
    '<ul class="nav-menu">' + navHTML + '</ul>' +
    '<div class="sidebar-footer">' +
    '<div class="user-info" id="user-info-click"><div class="user-avatar">' + avH + '</div><div class="user-details"><p>' + esc(cap(ln)) + '</p><span>' + esc(le) + '</span></div></div>' +
    '<button class="btn btn-outline btn-sm" id="logout-btn" style="width:100%;color:var(--sidebar-text);border-color:rgba(255,255,255,0.15);">Sign Out</button>' +
    '</div></aside>' +
    '<main class="main-area">' +
    '<div class="topbar"><div class="topbar-left">' +
    '<button class="menu-toggle" id="menu-toggle">' + SVG.menu + '</button>' +
    '<div><h1>' + pageTitle + '</h1><p>' + pageSubtitle + '</p></div>' +
    '</div><div class="topbar-actions"><button class="theme-toggle" id="theme-toggle-btn" title="Toggle theme">' + ti + '</button></div></div>' +
    '<div id="view-container"></div></main>';

  document.body.innerHTML = layout;
}

function attachHandlers() {
  document.querySelectorAll(".nav-item").forEach(function (i) {
    i.addEventListener("click", function () {
      var view = i.getAttribute("data-view");
      window.location.href = view + ".html";
    });
  });
  document.getElementById("logout-btn").addEventListener("click", function () {
    logout();
    window.location.href = "/login.html";
  });
  document.getElementById("menu-toggle").addEventListener("click", function () {
    document.getElementById("sidebar").classList.toggle("open");
  });
  document.getElementById("theme-toggle-btn").addEventListener("click", function () {
    toggleTheme();
    var b = document.getElementById("theme-toggle-btn");
    b.innerHTML = state.theme === "dark" ? SVG.sun : SVG.moon;
  });
  document.getElementById("user-info-click").addEventListener("click", function () {
    window.location.href = "/profile.html";
  });
}

export function getContainer() {
  return document.getElementById("view-container");
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

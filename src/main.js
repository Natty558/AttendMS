// main.js — entry point and render loop

import { state, applyTheme } from "./state.js";
import { isLoggedIn } from "./auth.js";
import { setRender } from "./nav.js";
import { renderAuth } from "./views-auth.js";
import { renderLayout, attachNavHandlers, setTopbar } from "./views-layout.js";
import { renderDashboard } from "./views-dashboard.js";
import { renderStudents } from "./views-students.js";
import { renderAttendance } from "./views-attendance.js";
import { renderClasses } from "./views-classes.js";
import { renderAnalytics, renderCalendar, renderAtRisk } from "./views-analytics.js";
import { renderReports } from "./views-reports.js";
import { renderProfile, renderSettings } from "./views-profile.js";

var app = document.getElementById("app");

function render() {
  app.innerHTML = "";
  if (!isLoggedIn()) {
    app.appendChild(renderAuth());
    return;
  }
  app.appendChild(renderLayout());
  attachNavHandlers();
  renderView();
}

function renderView() {
  var c = document.getElementById("view-container");
  c.innerHTML = "";
  var v = state.view;
  if (v === "dashboard") c.appendChild(renderDashboard());
  else if (v === "students") c.appendChild(renderStudents());
  else if (v === "attendance") c.appendChild(renderAttendance());
  else if (v === "calendar") c.appendChild(renderCalendar());
  else if (v === "analytics") c.appendChild(renderAnalytics());
  else if (v === "atrisk") c.appendChild(renderAtRisk());
  else if (v === "classes") c.appendChild(renderClasses());
  else if (v === "reports") c.appendChild(renderReports());
  else if (v === "profile") c.appendChild(renderProfile());
  else if (v === "settings") c.appendChild(renderSettings());
}

// Register the render function so other modules can trigger re-renders
setRender(render);

applyTheme();
render();

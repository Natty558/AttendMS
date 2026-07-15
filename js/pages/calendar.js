// pages/calendar.js — calendar heatmap page

import { fmtDate } from "../utils.js";
import { dailyRate } from "../data.js";
import { initPage, getContainer } from "../layout.js";

initPage("calendar", "Calendar", "Daily attendance rate heatmap");

var c = getContainer();
var now = new Date(), yr = now.getFullYear(), mo = now.getMonth();
var fD = new Date(yr, mo, 1), dIM = new Date(yr, mo + 1, 0).getDate(), sD = fD.getDay();
var mN = now.toLocaleDateString(undefined, { month: "long", year: "numeric" });
var cells = "";
["S", "M", "T", "W", "T", "F", "S"].forEach(function (dl) {
  cells += '<div style="text-align:center;font-size:0.72rem;font-weight:700;color:var(--text-3);padding:0.4rem 0;">' + dl + '</div>';
});
for (var i = 0; i < sD; i++) cells += '<div class="cal-empty"></div>';
for (var dt = 1; dt <= dIM; dt++) {
  var iso = new Date(yr, mo, dt).toISOString().slice(0, 10);
  var r = dailyRate(iso);
  var cls = "cal-na", lb = iso;
  if (r !== null) { cls = r >= 75 ? "cal-good" : r >= 50 ? "cal-warn" : "cal-bad"; lb = fmtDate(iso) + " · " + r + "% present"; }
  cells += '<div class="calendar-day ' + cls + '" title="' + lb + '">' + dt + '</div>';
}

c.innerHTML = '<div class="panel"><div class="calendar-month-label">' + mN + '</div><div class="calendar-grid">' + cells + '</div><div class="calendar-legend"><div class="calendar-legend-item"><div class="calendar-legend-box cal-good"></div>>=75%</div><div class="calendar-legend-item"><div class="calendar-legend-box cal-warn"></div>50-74%</div><div class="calendar-legend-item"><div class="calendar-legend-box cal-bad"></div><50%</div><div class="calendar-legend-item"><div class="calendar-legend-box cal-na"></div>No data</div></div></div>';

// utils.js — helper functions

export function uid(p) {
  return (p || "ID-") + Date.now().toString(36).toUpperCase() + Math.floor(Math.random() * 1000);
}

export function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export function fmtDate(iso) {
  if (!iso) return "—";
  var d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

export function fmtDateShort(iso) {
  if (!iso) return "—";
  var d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export function pct(n, d) {
  return d ? Math.round((n / d) * 100) : 0;
}

export function cap(s) {
  if (!s) return "";
  return s.replace(/\b\w/g, function (c) { return c.toUpperCase(); });
}

export function esc(s) {
  if (s == null) return "";
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

export function toast(msg) {
  var el = document.createElement("div");
  el.className = "toast";
  el.textContent = msg;
  document.body.appendChild(el);
  setTimeout(function () {
    el.style.opacity = "0";
    el.style.transition = "opacity 0.3s";
    setTimeout(function () { el.remove(); }, 300);
  }, 2400);
}

export function handleImageUpload(file, cb) {
  if (!file) return;
  if (file.size > 500000) { toast("Image too large (max 500KB)."); return; }
  var r = new FileReader();
  r.onload = function (e) { cb(e.target.result); };
  r.readAsDataURL(file);
}

export function avatarPlaceholderHTML() {
  return '<span class="avatar-placeholder-icon">' +
    '<svg viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>' +
    '</span>';
}

/*
 * Student Attendance Management System v4.1
 * Pure HTML, CSS, JavaScript. localStorage-based auth.
 * Changes: "Matric" renamed to "Index Number", class student assignment feature,
 * index number uniqueness validation.
 */
(function () {
  "use strict";

  var LOGO_SVG =
    '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">' +
    '<defs><linearGradient id="lgG" x1="0" y1="0" x2="1" y2="1">' +
    '<stop offset="0%" stop-color="#0284c7"/>' +
    '<stop offset="100%" stop-color="#0d9488"/>' +
    '</linearGradient></defs>' +
    '<rect x="2" y="2" width="96" height="96" rx="24" fill="url(#lgG)"/>' +
    '<rect x="2" y="2" width="96" height="96" rx="24" fill="none" stroke="rgba(255,255,255,0.18)" stroke-width="2"/>' +
    '<path d="M50 24 L82 37 L50 50 L18 37 Z" fill="#fff"/>' +
    '<path d="M32 43 L32 56 C32 56 38 64 50 64 C62 64 68 56 68 56 L68 43" fill="none" stroke="#fff" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>' +
    '<line x1="82" y1="37" x2="82" y2="53" stroke="#fff" stroke-width="2.5" stroke-linecap="round"/>' +
    '<circle cx="82" cy="57" r="4" fill="#fff"/>' +
    '<circle cx="70" cy="72" r="16" fill="#16a34a" stroke="#fff" stroke-width="3"/>' +
    '<path d="M62 72 L68 78 L78 66" fill="none" stroke="#fff" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>' +
    '</svg>';

  var IMG = {
    loginBg: "https://images.pexels.com/photos/8197545/pexels-photo-8197545.jpeg?cs=tinysrgb&w=1920&h=1080&fit=crop",
    emptyStudents: "https://images.pexels.com/photos/8617888/pexels-photo-8617888.jpeg?cs=tinysrgb&w=240&h=160&fit=crop",
    emptyAttendance: "https://images.pexels.com/photos/7972742/pexels-photo-7972742.jpeg?cs=tinysrgb&w=240&h=160&fit=crop",
    emptyClasses: "https://images.pexels.com/photos/16666017/pexels-photo-16666017.jpeg?cs=tinysrgb&w=240&h=160&fit=crop",
    emptyReports: "https://images.pexels.com/photos/7972735/pexels-photo-7972735.jpeg?cs=tinysrgb&w=240&h=160&fit=crop",
    emptyCheck: "https://images.pexels.com/photos/7973119/pexels-photo-7973119.jpeg?cs=tinysrgb&w=240&h=160&fit=crop",
  };

  var SVG = {
    dashboard:'<svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>',
    students:'<svg viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
    attendance:'<svg viewBox="0 0 24 24"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>',
    calendar:'<svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>',
    analytics:'<svg viewBox="0 0 24 24"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>',
    atrisk:'<svg viewBox="0 0 24 24"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
    classes:'<svg viewBox="0 0 24 24"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>',
    reports:'<svg viewBox="0 0 24 24"><path d="M3 3v18h18"/><path d="M7 14l4-4 4 4 5-5"/></svg>',
    profile:'<svg viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
    settings:'<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>',
    sun:'<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>',
    moon:'<svg viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>',
    menu:'<svg viewBox="0 0 24 24"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>',
    search:'<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>',
    download:'<svg viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>',
    upload:'<svg viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>',
    plus:'<svg viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>',
    edit:'<svg viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>',
    trash:'<svg viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>',
    eye:'<svg viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>',
    eyeOff:'<svg viewBox="0 0 24 24"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>',
    close:'<svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
    check:'<svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>',
    x:'<svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
    clock:'<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
    alert:'<svg viewBox="0 0 24 24"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
    flame:'<svg viewBox="0 0 24 24"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>',
    print:'<svg viewBox="0 0 24 24"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>',
    camera:'<svg viewBox="0 0 24 24"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>',
    mail:'<svg viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>',
    phone:'<svg viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>',
    book:'<svg viewBox="0 0 24 24"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>',
    id:'<svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="8" cy="10" r="2"/><path d="M14 9h4M14 13h4M6 16h4"/></svg>',
    graduation:'<svg viewBox="0 0 24 24"><path d="M22 10L12 5L2 10L12 15L22 10Z"/><path d="M6 12V16C6 16 8 18 12 18C16 18 18 16 18 16V12"/></svg>',
    users:'<svg viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
    clipboard:'<svg viewBox="0 0 24 24"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/></svg>',
    trendingUp:'<svg viewBox="0 0 24 24"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>',
    building:'<svg viewBox="0 0 24 24"><rect x="4" y="2" width="16" height="20" rx="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01M16 6h.01M8 10h.01M16 10h.01M8 14h.01M16 14h.01"/></svg>',
    back:'<svg viewBox="0 0 24 24"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>',
    save:'<svg viewBox="0 0 24 24"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>',
    userPlaceholder:'<svg viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
    lock:'<svg viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>',
    science:'<svg viewBox="0 0 24 24"><path d="M9 3h6v5l5 9a2 2 0 0 1-1.8 3H5.8a2 2 0 0 1-1.8-3l5-9V3z"/><line x1="7" y1="15" x2="17" y2="15"/></svg>',
    math:'<svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="8" y1="8" x2="8" y2="14"/><line x1="5" y1="11" x2="11" y2="11"/><line x1="14" y1="8" x2="14" y2="14"/><line x1="16" y1="8" x2="16" y2="14"/><line x1="14" y1="11" x2="16" y2="11"/></svg>',
    art:'<svg viewBox="0 0 24 24"><circle cx="13.5" cy="6.5" r="1.5"/><circle cx="17.5" cy="10.5" r="1.5"/><circle cx="8.5" cy="7.5" r="1.5"/><circle cx="6.5" cy="12.5" r="1.5"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c1.7 0 3-1.3 3-3 0-.8-.3-1.5-.8-2-.5-.5-.7-1.2-.7-2 0-1.7 1.3-3 3-3h1.5c2.2 0 4-1.8 4-4 0-4.4-4.5-8-10-8z"/></svg>',
    code:'<svg viewBox="0 0 24 24"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>',
    music:'<svg viewBox="0 0 24 24"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>',
    language:'<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>',
    business:'<svg viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>',
    health:'<svg viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>',
    law:'<svg viewBox="0 0 24 24"><path d="M12 3v18"/><path d="M5 7h14"/><path d="M7 7l-3 6c0 1.7 1.3 3 3 3s3-1.3 3-3L7 7z"/><path d="M17 7l-3 6c0 1.7 1.3 3 3 3s3-1.3 3-3L17 7z"/></svg>',
    default:'<svg viewBox="0 0 24 24"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>',
  };

  function classIconFor(name) {
    if (!name) return SVG.default;
    var n = name.toLowerCase();
    if (n.indexOf("math")>=0||n.indexOf("calc")>=0||n.indexOf("stat")>=0) return SVG.math;
    if (n.indexOf("sci")>=0||n.indexOf("phys")>=0||n.indexOf("chem")>=0||n.indexOf("bio")>=0) return SVG.science;
    if (n.indexOf("art")>=0||n.indexOf("design")>=0||n.indexOf("paint")>=0) return SVG.art;
    if (n.indexOf("code")>=0||n.indexOf("prog")>=0||n.indexOf("comp")>=0||n.indexOf("soft")>=0) return SVG.code;
    if (n.indexOf("music")>=0||n.indexOf("band")>=0) return SVG.music;
    if (n.indexOf("lang")>=0||n.indexOf("eng")>=0||n.indexOf("french")>=0||n.indexOf("span")>=0||n.indexOf("german")>=0) return SVG.language;
    if (n.indexOf("bus")>=0||n.indexOf("econ")>=0||n.indexOf("manage")>=0||n.indexOf("account")>=0) return SVG.business;
    if (n.indexOf("health")>=0||n.indexOf("med")>=0||n.indexOf("nurs")>=0) return SVG.health;
    if (n.indexOf("law")>=0||n.indexOf("legal")>=0) return SVG.law;
    if (n.indexOf("read")>=0||n.indexOf("lit")>=0) return SVG.book;
    return SVG.classes;
  }

  function icon(n,c){return '<span class="icon'+(c?" "+c:"")+'">'+(SVG[n]||"")+"</span>";}
  function navIcon(n){return '<span class="nav-icon">'+(SVG[n]||"")+"</span>";}

  var LS = {
    students:"sams_students",attendance:"sams_attendance",session:"sams_session",
    lecturer:"sams_lecturer",theme:"sams_theme",classes:"sams_classes",
    accounts:"sams_accounts",currentAccount:"sams_current_account"
  };
  function load(k,f){try{var r=localStorage.getItem(k);return r?JSON.parse(r):f;}catch(e){return f;}}
  function save(k,v){try{localStorage.setItem(k,JSON.stringify(v));}catch(e){}}

  var state = {
    students:load(LS.students,[]),attendance:load(LS.attendance,[]),
    session:load(LS.session,null),lecturer:load(LS.lecturer,null),
    theme:load(LS.theme,"light"),classes:load(LS.classes,[]),
    accounts:load(LS.accounts,[]),currentAccount:load(LS.currentAccount,null),
    view:"dashboard",authView:"login",editingId:null,profileId:null,
    selectedClassId:null,attendanceDraft:{},attendanceNotes:{}
  };

  function uid(p){return (p||"ID-")+Date.now().toString(36).toUpperCase()+Math.floor(Math.random()*1000);}
  function todayISO(){return new Date().toISOString().slice(0,10);}
  function fmtDate(iso){if(!iso)return "—";var d=new Date(iso+"T00:00:00");return d.toLocaleDateString(undefined,{year:"numeric",month:"short",day:"numeric"});}
  function fmtDateShort(iso){if(!iso)return "—";var d=new Date(iso+"T00:00:00");return d.toLocaleDateString(undefined,{month:"short",day:"numeric"});}
  function pct(n,d){return d?Math.round((n/d)*100):0;}
  function cap(s){if(!s)return"";return s.replace(/\b\w/g,function(c){return c.toUpperCase();});}
  function esc(s){if(s==null)return"";return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");}
  function toast(msg){var el=document.createElement("div");el.className="toast";el.textContent=msg;document.body.appendChild(el);setTimeout(function(){el.style.opacity="0";el.style.transition="opacity 0.3s";setTimeout(function(){el.remove();},300);},2400);}
  function persist(){save(LS.students,state.students);save(LS.attendance,state.attendance);save(LS.session,state.session);save(LS.lecturer,state.lecturer);save(LS.classes,state.classes);save(LS.accounts,state.accounts);save(LS.currentAccount,state.currentAccount);}
  function applyTheme(){document.documentElement.setAttribute("data-theme",state.theme);}
  function toggleTheme(){state.theme=state.theme==="dark"?"light":"dark";save(LS.theme,state.theme);applyTheme();var b=document.getElementById("theme-toggle-btn");if(b)b.innerHTML=state.theme==="dark"?SVG.sun:SVG.moon;}
  function avatarPlaceholderHTML(){return '<span class="avatar-placeholder-icon">'+SVG.userPlaceholder+'</span>';}

  // ===== Auth =====
  function hashPassword(pw){var h=0;for(var i=0;i<pw.length;i++){var c=pw.charCodeAt(i);h=((h<<5)-h)+c;h=h&h;}return "h"+Math.abs(h).toString(36);}
  function validateEmail(e){return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);}
  function passwordStrength(pw){var s=0;if(pw.length>=6)s++;if(pw.length>=10)s++;if(/[A-Z]/.test(pw)&&/[a-z]/.test(pw))s++;if(/[0-9]/.test(pw))s++;if(/[^A-Za-z0-9]/.test(pw))s++;if(s<=1)return{level:"weak",label:"Weak",bars:1};if(s<=3)return{level:"medium",label:"Medium",bars:2};return{level:"strong",label:"Strong",bars:3};}

  function registerAccount(name,email,password){
    if(!name||!name.trim())return "Please enter your full name.";
    if(!validateEmail(email))return "Please enter a valid email address.";
    if(password.length<6)return "Password must be at least 6 characters.";
    var ex=state.accounts.find(function(a){return a.email.toLowerCase()===email.toLowerCase();});
    if(ex)return "An account with this email already exists. Please sign in instead.";
    var acc={id:uid("ACC-"),name:name.trim(),email:email.toLowerCase(),passwordHash:hashPassword(password),phone:"",photo:"",createdAt:new Date().toISOString()};
    state.accounts.push(acc);state.currentAccount=acc;
    state.lecturer={name:acc.name,email:acc.email,phone:acc.phone,photo:acc.photo};
    state.session={email:acc.email,loginAt:Date.now()};persist();return null;
  }
  function loginAccount(email,password){
    if(!email||!password)return "Please enter both email and password.";
    if(!validateEmail(email))return "Please enter a valid email address.";
    var acc=state.accounts.find(function(a){return a.email.toLowerCase()===email.toLowerCase();});
    if(!acc)return "No account found with this email. Please register first.";
    if(acc.passwordHash!==hashPassword(password))return "Incorrect password. Please try again.";
    state.currentAccount=acc;state.lecturer={name:acc.name,email:acc.email,phone:acc.phone||"",photo:acc.photo||""};
    state.session={email:acc.email,loginAt:Date.now()};persist();return null;
  }
  function resetPassword(email,newPw){
    if(!validateEmail(email))return "Please enter a valid email address.";
    if(newPw.length<6)return "Password must be at least 6 characters.";
    var acc=state.accounts.find(function(a){return a.email.toLowerCase()===email.toLowerCase();});
    if(!acc)return "No account found with this email address.";
    acc.passwordHash=hashPassword(newPw);persist();return null;
  }
  function logout(){state.session=null;state.currentAccount=null;persist();state.view="dashboard";state.authView="login";render();}
  function isLoggedIn(){return !!state.session;}
  function updateLecturer(d){
    if(!state.lecturer)state.lecturer={};
    state.lecturer.name=d.name||state.lecturer.name;
    state.lecturer.email=d.email||state.lecturer.email;
    state.lecturer.phone=d.phone||"";
    if(d.photo!==undefined)state.lecturer.photo=d.photo;
    if(state.currentAccount){state.currentAccount.name=state.lecturer.name;state.currentAccount.email=state.lecturer.email;state.currentAccount.phone=state.lecturer.phone;state.currentAccount.photo=state.lecturer.photo;}
    persist();
  }

  // ===== Student CRUD =====
  // Index number uniqueness check
  function isIndexNumberUnique(indexNumber, excludeId) {
    var num = indexNumber.trim().toLowerCase();
    return !state.students.some(function(s) {
      return s.matric.trim().toLowerCase() === num && s.id !== excludeId;
    });
  }

  function addStudent(d) {
    var s = {id:uid("STU-"),name:d.name.trim(),matric:d.matric.trim(),course:d.course.trim(),level:d.level.trim(),email:(d.email||"").trim(),phone:(d.phone||"").trim(),photo:"",classId:d.classId||null,createdAt:new Date().toISOString()};
    state.students.push(s);persist();return s;
  }
  function updateStudent(id,d) {
    var s=findStudent(id);if(!s)return;
    s.name=d.name.trim();s.matric=d.matric.trim();s.course=d.course.trim();s.level=d.level.trim();
    s.email=(d.email||"").trim();s.phone=(d.phone||"").trim();
    if(d.classId!==undefined)s.classId=d.classId;
    if(d.photo!==undefined)s.photo=d.photo;
    persist();
  }
  function deleteStudent(id){state.students=state.students.filter(function(s){return s.id!==id;});state.attendance=state.attendance.filter(function(a){return a.studentId!==id;});persist();}
  function findStudent(id){return state.students.find(function(s){return s.id===id;});}

  // ===== Class CRUD =====
  function addClass(d){var c={id:uid("CLS-"),name:d.name.trim(),code:d.code.trim(),description:(d.description||"").trim(),createdAt:new Date().toISOString()};state.classes.push(c);persist();return c;}
  function updateClass(id,d){var c=findClass(id);if(!c)return;c.name=d.name.trim();c.code=d.code.trim();c.description=(d.description||"").trim();persist();}
  function deleteClass(id){state.classes=state.classes.filter(function(c){return c.id!==id;});state.students.forEach(function(s){if(s.classId===id)s.classId=null;});persist();}
  function findClass(id){return state.classes.find(function(c){return c.id===id;});}
  function studentsInClass(cid){return state.students.filter(function(s){return s.classId===cid;});}

  // Assign/unassign students to a class
  function assignStudentsToClass(classId, studentIds) {
    studentIds.forEach(function(sid) {
      var s = findStudent(sid);
      if (s) s.classId = classId;
    });
    persist();
  }
  function unassignStudentFromClass(classId, studentId) {
    var s = findStudent(studentId);
    if (s && s.classId === classId) s.classId = null;
    persist();
  }

  // ===== Attendance =====
  function getAttendanceForDate(d){return state.attendance.filter(function(a){return a.date===d;});}
  function saveAttendance(date,records,notes){state.attendance=state.attendance.filter(function(a){return a.date!==date;});records.forEach(function(r){state.attendance.push({id:uid("ATT-"),studentId:r.studentId,date:date,status:r.status,note:notes&&notes[r.studentId]?notes[r.studentId].trim():"",recordedAt:new Date().toISOString()});});persist();}
  function studentRecords(sid){return state.attendance.filter(function(a){return a.studentId===sid;});}
  function attendanceSummary(sid){var r=studentRecords(sid);var p=r.filter(function(a){return a.status==="present";}).length;var a=r.filter(function(a){return a.status==="absent";}).length;var l=r.filter(function(a){return a.status==="late";}).length;var t=r.length;return{present:p,absent:a,late:l,total:t,rate:t?Math.round(((p+l*0.5)/t)*100):0};}
  function atRiskStudents(){return state.students.filter(function(s){var sm=attendanceSummary(s.id);return sm.rate<75&&sm.total>0;});}
  function attendanceStreak(sid){var r=studentRecords(sid).sort(function(a,b){return b.date.localeCompare(a.date);});var st=0;for(var i=0;i<r.length;i++){if(r[i].status==="present"||r[i].status==="late")st++;else break;}return st;}
  function dailyRate(date){var r=getAttendanceForDate(date);if(!r.length)return null;var p=r.filter(function(a){return a.status==="present"||a.status==="late";}).length;return pct(p,r.length);}

  // ===== Export/Import =====
  function exportCSV(fn,rows){var csv=rows.map(function(r){return r.map(function(c){c=String(c==null?"":c);if(c.indexOf(",")>=0||c.indexOf('"')>=0||c.indexOf("\n")>=0)c='"'+c.replace(/"/g,'""')+'"';return c;}).join(",");}).join("\n");var b=new Blob([csv],{type:"text/csv;charset=utf-8;"});var u=URL.createObjectURL(b);var a=document.createElement("a");a.href=u;a.download=fn;document.body.appendChild(a);a.click();document.body.removeChild(a);URL.revokeObjectURL(u);}
  function exportData(){var d={students:state.students,attendance:state.attendance,classes:state.classes,lecturer:state.lecturer,accounts:state.accounts,exportedAt:new Date().toISOString()};var b=new Blob([JSON.stringify(d,null,2)],{type:"application/json"});var u=URL.createObjectURL(b);var a=document.createElement("a");a.href=u;a.download="attendance-backup-"+todayISO()+".json";document.body.appendChild(a);a.click();document.body.removeChild(a);URL.revokeObjectURL(u);}
  function importData(json){try{var d=JSON.parse(json);if(d.students)state.students=d.students;if(d.attendance)state.attendance=d.attendance;if(d.classes)state.classes=d.classes;if(d.lecturer)state.lecturer=d.lecturer;if(d.accounts)state.accounts=d.accounts;persist();return null;}catch(e){return "Invalid backup file.";}}
  function handleImageUpload(file,cb){if(!file)return;if(file.size>500000){toast("Image too large (max 500KB).");return;}var r=new FileReader();r.onload=function(e){cb(e.target.result);};r.readAsDataURL(file);}

  // ===== Charts =====
  function donutChart(p,a,l){var t=p+a+l;if(!t)return '<div class="empty-state" style="padding:2rem;"><p>No data to display</p></div>';var r=70,cx=90,cy=90,C=2*Math.PI*r;var pL=C*p/t,aL=C*a/t,lL=C*l/t;return '<svg class="chart-svg" viewBox="0 0 180 180" style="max-width:200px;margin:0 auto;"><circle cx="'+cx+'" cy="'+cy+'" r="'+r+'" fill="none" stroke="var(--surface-2)" stroke-width="22"/>'+dSeg(cx,cy,r,C,pL,0,"var(--success)")+dSeg(cx,cy,r,C,aL,-pL,"var(--danger)")+dSeg(cx,cy,r,C,lL,-(pL+aL),"var(--warning)")+'<text class="donut-center-text donut-center-value" x="'+cx+'" y="'+(cy-2)+'">'+pct(p+l,t)+'%</text><text class="donut-center-text donut-center-label" x="'+cx+'" y="'+(cy+16)+'">Attendance</text></svg><div class="chart-legend"><div class="chart-legend-item"><div class="chart-legend-dot" style="background:var(--success)"></div>Present ('+p+')</div><div class="chart-legend-item"><div class="chart-legend-dot" style="background:var(--danger)"></div>Absent ('+a+')</div><div class="chart-legend-item"><div class="chart-legend-dot" style="background:var(--warning)"></div>Late ('+l+')</div></div>';}
  function dSeg(cx,cy,r,C,len,off,c){if(len<=0)return"";return '<circle cx="'+cx+'" cy="'+cy+'" r="'+r+'" fill="none" stroke="'+c+'" stroke-width="22" stroke-dasharray="'+len+" "+(C-len)+'" stroke-dashoffset="'+off+'" transform="rotate(-90 '+cx+" "+cy+')" style="transition:stroke-dasharray 0.6s ease,stroke-dashoffset 0.6s ease"/>';}
  function barChart(labels,values,mx){if(!values.length||!mx)return '<div class="empty-state" style="padding:2rem;"><p>No attendance data yet</p></div>';var cH=200,pad=40,bW=24,gap=16,tW=labels.length*(bW+gap)+pad*2,sH=cH-pad*2;var bars="",grid="";for(var g=0;g<=4;g++){var gy=pad+(sH/4)*g;grid+='<line x1="'+pad+'" y1="'+gy+'" x2="'+(tW-pad)+'" y2="'+gy+'" stroke="var(--border)" stroke-width="1"/>';}for(var i=0;i<values.length;i++){var h=(values[i]/mx)*sH,x=pad+i*(bW+gap),y=cH-pad-h;bars+='<rect x="'+x+'" y="'+y+'" width="'+bW+'" height="'+h+'" rx="4" fill="var(--accent)" style="transition:height 0.5s ease"/>';bars+='<text x="'+(x+bW/2)+'" y="'+(cH-pad+14)+'" text-anchor="middle" font-size="9" fill="var(--text-3)">'+labels[i]+'</text>';bars+='<text x="'+(x+bW/2)+'" y="'+(y-5)+'" text-anchor="middle" font-size="9" fill="var(--text-2)" font-weight="600">'+values[i]+'</text>';}return '<svg class="chart-svg" viewBox="0 0 '+tW+" "+cH+'">'+grid+bars+'</svg>';}
  function trendChart(){var days=14,lb=[],vl=[],mx=0;for(var i=days-1;i>=0;i--){var d=new Date();d.setDate(d.getDate()-i);var iso=d.toISOString().slice(0,10);var recs=getAttendanceForDate(iso);var p=recs.filter(function(a){return a.status==="present"||a.status==="late";}).length;lb.push(fmtDateShort(iso));vl.push(p);if(p>mx)mx=p;}return barChart(lb,vl,mx);}

  var app = document.getElementById("app");

  function render(){app.innerHTML="";if(!isLoggedIn()){app.appendChild(renderAuth());return;}app.appendChild(renderLayout());attachNavHandlers();renderView();}

  // ===== Auth Pages =====
  function renderAuth(){var d=document.createElement("div");d.className="auth-screen";if(state.authView==="register")d.appendChild(renderRegister());else if(state.authView==="forgot")d.appendChild(renderForgot());else d.appendChild(renderLogin());return d;}

  function renderLogin(){var d=document.createElement("div");d.className="auth-card";d.innerHTML='<div class="auth-logo">'+LOGO_SVG+'</div><h1>Welcome Back</h1><p class="subtitle">Sign in to your lecturer account</p><div id="auth-error"></div><form id="login-form"><div class="form-group"><label for="email">Email Address</label><input type="email" id="email" placeholder="lecturer@school.edu" required autocomplete="email"/></div><div class="form-group"><label for="password">Password</label><div class="password-field"><input type="password" id="password" placeholder="Enter your password" required autocomplete="current-password"/><button type="button" class="password-toggle" id="pw-toggle">'+SVG.eye+'</button></div></div><button type="submit" class="btn btn-primary" id="login-btn">Sign In</button></form><div class="auth-links"><div class="auth-divider">or</div><span class="auth-link">Don\'t have an account? <a id="go-register">Create one</a></span><span class="auth-link"><a id="go-forgot">Forgot your password?</a></span></div>';
    var pwI=d.querySelector("#password"),pwT=d.querySelector("#pw-toggle");
    pwT.addEventListener("click",function(){var p=pwI.type==="password";pwI.type=p?"text":"password";pwT.innerHTML=p?SVG.eyeOff:SVG.eye;});
    d.querySelector("#go-register").addEventListener("click",function(){state.authView="register";render();});
    d.querySelector("#go-forgot").addEventListener("click",function(){state.authView="forgot";render();});
    d.querySelector("#login-form").addEventListener("submit",function(e){e.preventDefault();var em=d.querySelector("#email").value.trim(),pw=d.querySelector("#password").value,el=d.querySelector("#auth-error"),btn=d.querySelector("#login-btn");btn.disabled=true;btn.textContent="Signing in...";setTimeout(function(){var err=loginAccount(em,pw);btn.disabled=false;btn.textContent="Sign In";if(err)el.innerHTML='<div class="alert alert-error auth-error">'+err+'</div>';else{toast("Welcome back, "+cap(state.lecturer.name.split(" ")[0])+"!");render();}},400);});
    return d;
  }

  function renderRegister(){var d=document.createElement("div");d.className="auth-card";d.innerHTML='<div class="auth-logo">'+LOGO_SVG+'</div><h1>Create Account</h1><p class="subtitle">Register as a new lecturer</p><div id="auth-error"></div><form id="register-form"><div class="form-group"><label for="name">Full Name</label><input type="text" id="name" placeholder="Dr. Jane Smith" required autocomplete="name"/></div><div class="form-group"><label for="email">Email Address</label><input type="email" id="email" placeholder="lecturer@school.edu" required autocomplete="email"/></div><div class="form-group"><label for="password">Password</label><div class="password-field"><input type="password" id="password" placeholder="Min 6 characters" required autocomplete="new-password"/><button type="button" class="password-toggle" id="pw-toggle">'+SVG.eye+'</button></div><div class="password-strength" id="pw-strength"><div class="password-strength-bar"></div><div class="password-strength-bar"></div><div class="password-strength-bar"></div></div><div class="password-strength-label" id="pw-strength-label"></div></div><div class="form-group"><label for="confirm">Confirm Password</label><div class="password-field"><input type="password" id="confirm" placeholder="Re-enter password" required autocomplete="new-password"/><button type="button" class="password-toggle" id="pw-toggle2">'+SVG.eye+'</button></div></div><button type="submit" class="btn btn-primary" id="register-btn">Create Account</button></form><div class="auth-links"><div class="auth-divider">or</div><span class="auth-link">Already have an account? <a id="go-login">Sign in</a></span></div>';
    var pwI=d.querySelector("#password"),pwT=d.querySelector("#pw-toggle"),pwT2=d.querySelector("#pw-toggle2"),cI=d.querySelector("#confirm"),sB=d.querySelectorAll("#pw-strength .password-strength-bar"),sL=d.querySelector("#pw-strength-label");
    function tg(inp,btn){var p=inp.type==="password";inp.type=p?"text":"password";btn.innerHTML=p?SVG.eyeOff:SVG.eye;}
    pwT.addEventListener("click",function(){tg(pwI,pwT);});pwT2.addEventListener("click",function(){tg(cI,pwT2);});
    pwI.addEventListener("input",function(){var pw=pwI.value;if(!pw){sB.forEach(function(b){b.className="password-strength-bar";});sL.textContent="";return;}var s=passwordStrength(pw);sB.forEach(function(b,i){b.className="password-strength-bar"+(i<s.bars?" active "+s.level:"");});sL.textContent=s.label;sL.style.color=s.level==="weak"?"var(--danger)":s.level==="medium"?"var(--warning)":"var(--success)";});
    d.querySelector("#go-login").addEventListener("click",function(){state.authView="login";render();});
    d.querySelector("#register-form").addEventListener("submit",function(e){e.preventDefault();var nm=d.querySelector("#name").value.trim(),em=d.querySelector("#email").value.trim(),pw=d.querySelector("#password").value,cf=d.querySelector("#confirm").value,el=d.querySelector("#auth-error"),btn=d.querySelector("#register-btn");if(pw!==cf){el.innerHTML='<div class="alert alert-error auth-error">Passwords do not match.</div>';return;}btn.disabled=true;btn.textContent="Creating account...";setTimeout(function(){var err=registerAccount(nm,em,pw);btn.disabled=false;btn.textContent="Create Account";if(err)el.innerHTML='<div class="alert alert-error auth-error">'+err+'</div>';else{toast("Account created! Welcome, "+cap(state.lecturer.name.split(" ")[0])+".");render();}},500);});
    return d;
  }

  function renderForgot(){var d=document.createElement("div");d.className="auth-card";d.innerHTML='<div class="auth-logo">'+LOGO_SVG+'</div><h1>Reset Password</h1><p class="subtitle">Enter your email and a new password</p><div id="auth-error"></div><div id="auth-success-box"></div><form id="forgot-form"><div class="form-group"><label for="email">Email Address</label><input type="email" id="email" placeholder="lecturer@school.edu" required autocomplete="email"/></div><div class="form-group"><label for="password">New Password</label><div class="password-field"><input type="password" id="password" placeholder="Min 6 characters" required autocomplete="new-password"/><button type="button" class="password-toggle" id="pw-toggle">'+SVG.eye+'</button></div><div class="password-strength" id="pw-strength"><div class="password-strength-bar"></div><div class="password-strength-bar"></div><div class="password-strength-bar"></div></div><div class="password-strength-label" id="pw-strength-label"></div></div><div class="form-group"><label for="confirm">Confirm New Password</label><div class="password-field"><input type="password" id="confirm" placeholder="Re-enter password" required autocomplete="new-password"/><button type="button" class="password-toggle" id="pw-toggle2">'+SVG.eye+'</button></div></div><button type="submit" class="btn btn-primary" id="reset-btn">Reset Password</button></form><div class="auth-links"><span class="auth-link">Remembered your password? <a id="go-login">Sign in</a></span></div>';
    var pwI=d.querySelector("#password"),pwT=d.querySelector("#pw-toggle"),pwT2=d.querySelector("#pw-toggle2"),cI=d.querySelector("#confirm"),sB=d.querySelectorAll("#pw-strength .password-strength-bar"),sL=d.querySelector("#pw-strength-label");
    function tg(inp,btn){var p=inp.type==="password";inp.type=p?"text":"password";btn.innerHTML=p?SVG.eyeOff:SVG.eye;}
    pwT.addEventListener("click",function(){tg(pwI,pwT);});pwT2.addEventListener("click",function(){tg(cI,pwT2);});
    pwI.addEventListener("input",function(){var pw=pwI.value;if(!pw){sB.forEach(function(b){b.className="password-strength-bar";});sL.textContent="";return;}var s=passwordStrength(pw);sB.forEach(function(b,i){b.className="password-strength-bar"+(i<s.bars?" active "+s.level:"");});sL.textContent=s.label;sL.style.color=s.level==="weak"?"var(--danger)":s.level==="medium"?"var(--warning)":"var(--success)";});
    d.querySelector("#go-login").addEventListener("click",function(){state.authView="login";render();});
    d.querySelector("#forgot-form").addEventListener("submit",function(e){e.preventDefault();var em=d.querySelector("#email").value.trim(),pw=d.querySelector("#password").value,cf=d.querySelector("#confirm").value,el=d.querySelector("#auth-error"),sl=d.querySelector("#auth-success-box"),btn=d.querySelector("#reset-btn");if(pw!==cf){el.innerHTML='<div class="alert alert-error auth-error">Passwords do not match.</div>';return;}btn.disabled=true;btn.textContent="Resetting...";setTimeout(function(){var err=resetPassword(em,pw);btn.disabled=false;btn.textContent="Reset Password";if(err){el.innerHTML='<div class="alert alert-error auth-error">'+err+'</div>';sl.innerHTML="";}else{el.innerHTML="";sl.innerHTML='<div class="auth-success">Password reset successfully! You can now sign in with your new password.</div>';d.querySelector("#forgot-form").reset();setTimeout(function(){state.authView="login";render();},2000);}},500);});
    return d;
  }

  // ===== Layout =====
  function renderLayout(){var d=document.createElement("div");d.className="layout";var ln=state.lecturer?state.lecturer.name:"Lecturer",le=state.lecturer?state.lecturer.email:"",lp=state.lecturer&&state.lecturer.photo?state.lecturer.photo:"",rN=atRiskStudents().length,ti=state.theme==="dark"?SVG.sun:SVG.moon;var avH=lp?'<img src="'+esc(lp)+'" alt="avatar"/>':'<span class="avatar-placeholder-icon">'+SVG.userPlaceholder+'</span>';
    d.innerHTML='<aside class="sidebar" id="sidebar"><div class="sidebar-header"><div class="logo"><div class="logo-icon">'+LOGO_SVG+'</div><div><h2>AttendMS</h2><p>Lecturer Portal</p></div></div></div><ul class="nav-menu"><li class="nav-section-label">Main</li>'+navItem("dashboard","dashboard","Dashboard")+navItem("students","students","Students")+navItem("attendance","attendance","Take Attendance")+navItem("calendar","calendar","Calendar")+'<li class="nav-section-label">Insights</li>'+navItem("analytics","analytics","Analytics")+navItem("atrisk","atrisk","At-Risk Students",rN)+'<li class="nav-section-label">Manage</li>'+navItem("classes","classes","Classes")+navItem("reports","reports","Reports")+navItem("profile","profile","My Profile")+navItem("settings","settings","Settings")+'</ul><div class="sidebar-footer"><div class="user-info" id="user-info-click"><div class="user-avatar">'+avH+'</div><div class="user-details"><p>'+esc(cap(ln))+'</p><span>'+esc(le)+'</span></div></div><button class="btn btn-outline btn-sm" id="logout-btn" style="width:100%;color:var(--sidebar-text);border-color:rgba(255,255,255,0.15);">Sign Out</button></div></aside><main class="main-area"><div class="topbar"><div class="topbar-left"><button class="menu-toggle" id="menu-toggle">'+SVG.menu+'</button><div><h1 id="page-title">Dashboard</h1><p id="page-subtitle">Overview of attendance statistics</p></div></div><div class="topbar-actions"><button class="theme-toggle" id="theme-toggle-btn" title="Toggle theme">'+ti+'</button></div></div><div id="view-container"></div></main>';
    d.querySelector("#logout-btn").addEventListener("click",logout);
    d.querySelector("#menu-toggle").addEventListener("click",function(){d.querySelector("#sidebar").classList.toggle("open");});
    d.querySelector("#theme-toggle-btn").addEventListener("click",toggleTheme);
    d.querySelector("#user-info-click").addEventListener("click",function(){state.view="profile";render();});
    return d;
  }
  function navItem(view,ic,label,badge){var a=state.view===view?" active":"";var b=badge?'<span class="nav-badge">'+badge+'</span>':"";return '<li class="nav-item'+a+'" data-view="'+view+'">'+navIcon(ic)+label+b+'</li>';}
  function attachNavHandlers(){document.querySelectorAll(".nav-item").forEach(function(i){i.addEventListener("click",function(){state.view=i.getAttribute("data-view");state.profileId=null;state.selectedClassId=null;document.querySelector("#sidebar").classList.remove("open");render();});});}
  function setTopbar(t,s){document.querySelector("#page-title").textContent=t;document.querySelector("#page-subtitle").textContent=s;}
  function renderView(){var c=document.getElementById("view-container");c.innerHTML="";var v=state.view;if(v==="dashboard")c.appendChild(renderDashboard());else if(v==="students")c.appendChild(renderStudents());else if(v==="attendance")c.appendChild(renderAttendance());else if(v==="calendar")c.appendChild(renderCalendar());else if(v==="analytics")c.appendChild(renderAnalytics());else if(v==="atrisk")c.appendChild(renderAtRisk());else if(v==="classes")c.appendChild(renderClasses());else if(v==="reports")c.appendChild(renderReports());else if(v==="profile")c.appendChild(renderProfile());else if(v==="settings")c.appendChild(renderSettings());}
  function statCard(ic,i,v,l){return '<div class="stat-card"><div class="stat-top"><div class="stat-icon '+ic+'">'+(SVG[i]||"")+'</div></div><div class="stat-value">'+v+'</div><div class="stat-label">'+l+'</div></div>';}
  function studentAvatarHTML(s,sz){sz=sz||40;var st='width:'+sz+'px;height:'+sz+'px';if(s.photo)return '<div class="student-avatar" style="'+st+'"><img src="'+esc(s.photo)+'"/></div>';return '<div class="student-avatar" style="'+st+'">'+avatarPlaceholderHTML()+'</div>';}
  function emptyState(img,msg){return '<div class="empty-state"><div class="empty-icon"><img src="'+img+'" alt=""/></div><p>'+msg+'</p></div>';}

  // ===== Dashboard =====
  function renderDashboard(){setTopbar("Dashboard","Overview of attendance statistics");var d=document.createElement("div");var total=state.students.length,tR=getAttendanceForDate(todayISO()),pT=tR.filter(function(a){return a.status==="present"||a.status==="late";}).length,aT=tR.filter(function(a){return a.status==="absent";}).length,tR2=state.attendance.length,aP=state.attendance.filter(function(a){return a.status==="present";}).length,aA=state.attendance.filter(function(a){return a.status==="absent";}).length,aL=state.attendance.filter(function(a){return a.status==="late";}).length,oR=tR2?Math.round((aP/tR2)*100):0,risk=atRiskStudents();var aH=risk.length?'<div class="alert-banner"><span class="alert-icon">'+SVG.alert+'</span><span><strong>'+risk.length+' student'+(risk.length>1?"s":"")+'</strong> below 75% attendance. <a href="#" id="view-atrisk" style="color:var(--danger);font-weight:600;">View list</a></span></div>':"";
    var snap=tR.length?'<div class="progress-bar"><div class="progress-fill good" style="width:'+pct(pT,tR.length)+'%"></div></div><p class="mt-1 text-sm text-muted">'+pT+" of "+tR.length+" students present today ("+pct(pT,tR.length)+"%)</p>":emptyState(IMG.emptyAttendance,"No attendance recorded yet today.");
    var rT=total?'<div class="table-wrap"><table><thead><tr><th>Name</th><th>Index No.</th><th>Course</th><th>Level</th></tr></thead><tbody>'+state.students.slice(-5).reverse().map(function(s){return '<tr class="clickable-row" data-profile="'+s.id+'"><td><strong>'+esc(s.name)+'</strong></td><td class="id-badge">'+esc(s.matric)+'</td><td>'+esc(s.course)+'</td><td>'+esc(s.level)+'</td></tr>';}).join("")+'</tbody></table></div>':emptyState(IMG.emptyStudents,"No students registered yet.");
    d.innerHTML=aH+'<div class="stats-grid">'+statCard("icon-blue","users",total,"Registered Students")+statCard("icon-green","check",pT,"Present Today")+statCard("icon-red","x",aT,"Absent Today")+statCard("icon-amber","trendingUp",oR+"%","Overall Attendance Rate")+'</div><div class="two-col"><div class="panel"><div class="panel-header"><h2>Today\'s Snapshot</h2><span class="badge badge-slate">'+fmtDate(todayISO())+'</span></div><div class="panel-body">'+snap+'</div></div><div class="panel"><div class="panel-header"><h2>Overall Distribution</h2></div><div class="panel-body chart-container">'+donutChart(aP,aA,aL)+'</div></div></div><div class="panel"><div class="panel-header"><h2>Recent Students</h2><button class="btn btn-accent btn-sm" id="go-students">'+icon("plus","icon-sm")+' View All</button></div><div class="panel-body flush">'+rT+'</div></div>';
    var gb=d.querySelector("#go-students");if(gb)gb.addEventListener("click",function(){state.view="students";render();});
    var rl=d.querySelector("#view-atrisk");if(rl)rl.addEventListener("click",function(e){e.preventDefault();state.view="atrisk";render();});
    d.querySelectorAll("[data-profile]").forEach(function(r){r.addEventListener("click",function(){state.profileId=r.getAttribute("data-profile");state.view="students";render();});});
    return d;
  }

  // ===== Students =====
  function renderStudents(){if(state.profileId)return renderStudentProfile(state.profileId);setTopbar("Students","Register and manage student records");var d=document.createElement("div");
    d.innerHTML='<div class="toolbar"><div class="search-wrapper"><span class="search-icon">'+SVG.search+'</span><input type="text" class="search-input" id="student-search" placeholder="Search by name, index number, or course..."/></div><div class="spacer"></div><button class="btn btn-outline btn-sm" id="export-csv-btn">'+icon("download","icon-sm")+' Export CSV</button><button class="btn btn-accent" id="add-student-btn">'+icon("plus","icon-sm")+' Add Student</button></div><div class="panel"><div class="panel-body flush"><div id="student-table"></div></div></div>';
    var si=d.querySelector("#student-search");si.addEventListener("input",function(){renderStudentTable(si.value);});
    d.querySelector("#add-student-btn").addEventListener("click",function(){openStudentModal();});
    d.querySelector("#export-csv-btn").addEventListener("click",exportStudentsCSV);
    renderStudentTable("");return d;
  }
  function renderStudentTable(q){var c=document.getElementById("student-table");if(!c)return;q=q.toLowerCase();var f=state.students.filter(function(s){return !q||s.name.toLowerCase().indexOf(q)>=0||s.matric.toLowerCase().indexOf(q)>=0||s.course.toLowerCase().indexOf(q)>=0;});if(!f.length){c.innerHTML=emptyState(IMG.emptyStudents,state.students.length?"No students match your search.":'No students registered yet. Click "Add Student" to begin.');return;}
    var rows=f.map(function(s){var sm=attendanceSummary(s.id),st=attendanceStreak(s.id);var badge=sm.rate>=75?"badge-excellent":sm.rate>=50?"badge-warning":sm.rate>0?"badge-critical":"badge-slate";var bc=sm.rate>=75?"good":sm.rate>=50?"warn":"bad";var sB=st>=3?'<span class="streak-badge" title="'+st+' day streak">'+SVG.flame+st+'</span>':"";var cls=s.classId?findClass(s.classId):null;return '<tr class="clickable-row" data-profile="'+s.id+'"><td><div style="display:flex;align-items:center;gap:0.6rem;">'+studentAvatarHTML(s,32)+'<div><strong>'+esc(s.name)+'</strong>'+(sB?'<div style="margin-top:2px;">'+sB+'</div>':"")+'</div></div></td><td class="id-badge">'+esc(s.matric)+'</td><td>'+esc(s.course)+(cls?'<br><span class="text-muted">'+esc(cls.name)+'</span>':"")+'</td><td>'+esc(s.level)+'</td><td class="rate-cell"><div class="rate-text"><span class="badge '+badge+'">'+(sm.total?sm.rate+"%":"—")+'</span><span class="text-muted">'+sm.present+"/"+sm.total+'</span></div>'+(sm.total?'<div class="progress-bar"><div class="progress-fill '+bc+'" style="width:'+sm.rate+'%"></div></div>':"")+'</td><td><div style="display:flex;gap:0.35rem;"><button class="btn btn-ghost btn-sm btn-icon" data-profile-btn="'+s.id+'" title="View profile">'+SVG.eye+'</button><button class="btn btn-outline btn-sm" data-edit="'+s.id+'">'+icon("edit","icon-sm")+'</button><button class="btn btn-danger btn-sm btn-icon" data-del="'+s.id+'" title="Delete">'+SVG.trash+'</button></div></td></tr>';}).join("");
    c.innerHTML='<div class="table-wrap"><table><thead><tr><th>Name</th><th>Index No.</th><th>Course</th><th>Level</th><th>Attendance</th><th>Actions</th></tr></thead><tbody>'+rows+'</tbody></table></div>';
    c.querySelectorAll("[data-edit]").forEach(function(b){b.addEventListener("click",function(e){e.stopPropagation();openStudentModal(b.getAttribute("data-edit"));});});
    c.querySelectorAll("[data-del]").forEach(function(b){b.addEventListener("click",function(e){e.stopPropagation();if(confirm("Delete this student and all their attendance records?")){deleteStudent(b.getAttribute("data-del"));toast("Student deleted.");renderStudentTable(document.getElementById("student-search").value);}});});
    c.querySelectorAll("[data-profile]").forEach(function(r){r.addEventListener("click",function(){state.profileId=r.getAttribute("data-profile");render();});});
    c.querySelectorAll("[data-profile-btn]").forEach(function(b){b.addEventListener("click",function(e){e.stopPropagation();state.profileId=b.getAttribute("data-profile-btn");render();});});
  }
  function exportStudentsCSV(){var rows=[["Name","Index Number","Course","Level","Email","Phone","Class","Present","Absent","Late","Total","Rate (%)","Streak"]];state.students.forEach(function(s){var sm=attendanceSummary(s.id);var cls=s.classId?findClass(s.classId):null;rows.push([s.name,s.matric,s.course,s.level,s.email||"",s.phone||"",cls?cls.name:"",sm.present,sm.absent,sm.late,sm.total,sm.rate,attendanceStreak(s.id)]);});exportCSV("students-"+todayISO()+".csv",rows);toast("Students exported to CSV.");}

  function openStudentModal(id){var s=id?findStudent(id):null;state.editingId=id||null;var ov=document.createElement("div");ov.className="modal-overlay";var lv=["100","200","300","400","500"].map(function(l){return "<option"+(s&&s.level===l?" selected":"")+">"+l+"</option>";}).join("");var cv=state.classes.map(function(c){return '<option value="'+c.id+'"'+(s&&s.classId===c.id?" selected":"")+">"+esc(c.name)+"</option>";}).join("");var ph=s&&s.photo?s.photo:"";var avH=ph?'<img src="'+esc(ph)+'"/>':'<div class="avatar-placeholder">'+SVG.userPlaceholder+'</div>';
    ov.innerHTML='<div class="modal"><div class="modal-header"><h2>'+(s?"Edit Student":"Add Student")+'</h2><button class="modal-close" id="mc">'+SVG.close+'</button></div><div class="modal-body"><div id="me"></div><div class="avatar-upload"><div class="avatar-preview" id="avatar-preview">'+avH+'</div><input type="file" id="photo-input" accept="image/*" style="display:none"/><button class="btn btn-outline btn-sm" id="upload-btn">'+icon("camera","icon-sm")+' Upload Photo</button><span class="avatar-upload-hint">Max 500KB · JPG/PNG</span></div><form id="sf"><div class="form-group"><label>Full Name</label><input type="text" id="f-name" required value="'+(s?esc(s.name):"")+'"/></div><div class="form-row"><div class="form-group"><label>Index Number</label><input type="text" id="f-matric" required value="'+(s?esc(s.matric):"")+'" placeholder="e.g. 12345678"/></div><div class="form-group"><label>Academic Level</label><select id="f-level">'+lv+'</select></div></div><div class="form-group"><label>Course of Study</label><input type="text" id="f-course" required value="'+(s?esc(s.course):"")+'"/></div>'+(state.classes.length?'<div class="form-group"><label>Class</label><select id="f-class"><option value="">— None —</option>'+cv+'</select></div>':"")+'<div class="form-row"><div class="form-group"><label>Email (optional)</label><input type="email" id="f-email" value="'+(s?esc(s.email):"")+'"/></div><div class="form-group"><label>Phone (optional)</label><input type="text" id="f-phone" value="'+(s?esc(s.phone):"")+'"/></div></div><div class="form-actions"><button type="button" class="btn btn-outline" id="cancel">Cancel</button><button type="submit" class="btn btn-primary" style="width:auto;">'+(s?"Save Changes":"Add Student")+'</button></div></form></div></div>';
    document.body.appendChild(ov);var photoData=ph;
    function close(){ov.remove();state.editingId=null;}
    ov.querySelector("#mc").addEventListener("click",close);ov.querySelector("#cancel").addEventListener("click",close);ov.addEventListener("click",function(e){if(e.target===ov)close();});
    ov.querySelector("#upload-btn").addEventListener("click",function(){ov.querySelector("#photo-input").click();});
    ov.querySelector("#photo-input").addEventListener("change",function(e){handleImageUpload(e.target.files[0],function(data){photoData=data;ov.querySelector("#avatar-preview").innerHTML='<img src="'+esc(data)+'"/>';});});
    ov.querySelector("#sf").addEventListener("submit",function(e){e.preventDefault();var d2={name:ov.querySelector("#f-name").value,matric:ov.querySelector("#f-matric").value,course:ov.querySelector("#f-course").value,level:ov.querySelector("#f-level").value,email:ov.querySelector("#f-email").value,phone:ov.querySelector("#f-phone").value,photo:photoData};var cs=ov.querySelector("#f-class");if(cs)d2.classId=cs.value||null;
      if(!d2.name.trim()||!d2.matric.trim()||!d2.course.trim()){ov.querySelector("#me").innerHTML='<div class="alert alert-error">Name, index number, and course are required.</div>';return;}
      // Index number uniqueness check
      if(!isIndexNumberUnique(d2.matric,state.editingId)){ov.querySelector("#me").innerHTML='<div class="alert alert-error">Index number "'+esc(d2.matric.trim())+'" already exists. Please use a unique index number.</div>';return;}
      if(state.editingId){updateStudent(state.editingId,d2);toast("Student updated.");}else{addStudent(d2);toast("Student added.");}
      close();if(state.view==="students")renderStudentTable(document.getElementById("student-search")?document.getElementById("student-search").value:"");if(state.view==="dashboard")renderView();if(state.view==="classes")renderView();});
  }

  function renderStudentProfile(id){var s=findStudent(id);if(!s){state.profileId=null;return renderStudents();}setTopbar("Student Profile",esc(s.name));var d=document.createElement("div");var sm=attendanceSummary(s.id),st=attendanceStreak(s.id);var recs=studentRecords(id).sort(function(a,b){return b.date.localeCompare(a.date);});var badge=sm.rate>=75?"badge-excellent":sm.rate>=50?"badge-warning":"badge-critical";var cls=s.classId?findClass(s.classId):null;var avH=s.photo?'<img src="'+esc(s.photo)+'"/>':'<span class="avatar-placeholder">'+SVG.userPlaceholder+'</span>';
    var rr=recs.length?recs.map(function(a){var b=a.status==="present"?"badge-present":a.status==="absent"?"badge-absent":"badge-late";return '<tr><td>'+fmtDate(a.date)+'</td><td><span class="badge '+b+'">'+cap(a.status)+'</span></td><td>'+(a.note?'<div class="note-text">'+esc(a.note)+'</div>':'<span class="text-muted">—</span>')+'</td></tr>';}).join(""):'<tr><td colspan="3" style="text-align:center;padding:2rem;color:var(--text-3);">No attendance records yet.</td></tr>';
    var sB=st>=3?'<div style="text-align:center;margin-top:0.5rem;"><span class="streak-badge">'+SVG.flame+st+' day streak</span></div>':"";
    d.innerHTML='<div style="margin-bottom:1rem;"><button class="btn btn-outline btn-sm" id="back">'+icon("back","icon-sm")+' Back to Students</button></div><div class="panel"><div class="profile-header"><div class="profile-avatar-lg">'+avH+'</div><div><div class="profile-name">'+esc(s.name)+'</div><div class="profile-meta"><div class="profile-meta-item">'+SVG.graduation+' '+esc(s.course)+'</div><div class="profile-meta-item">'+SVG.book+' Level '+esc(s.level)+'</div><div class="profile-meta-item">'+SVG.id+' '+esc(s.matric)+'</div>'+(cls?'<div class="profile-meta-item">'+SVG.building+' '+esc(cls.name)+'</div>':"")+(s.email?'<div class="profile-meta-item">'+SVG.mail+' '+esc(s.email)+'</div>':"")+(s.phone?'<div class="profile-meta-item">'+SVG.phone+' '+esc(s.phone)+'</div>':"")+'</div></div><div style="margin-left:auto;"><span class="badge '+badge+'" style="font-size:1rem;padding:0.4rem 1rem;">'+(sm.total?sm.rate+"%":"—")+'</span>'+sB+'</div></div><div class="profile-stats"><div class="profile-stat"><div class="ps-value" style="color:var(--success)">'+sm.present+'</div><div class="ps-label">Present</div></div><div class="profile-stat"><div class="ps-value" style="color:var(--danger)">'+sm.absent+'</div><div class="ps-label">Absent</div></div><div class="profile-stat"><div class="ps-value" style="color:var(--warning)">'+sm.late+'</div><div class="ps-label">Late</div></div><div class="profile-stat"><div class="ps-value">'+sm.total+'</div><div class="ps-label">Total Sessions</div></div></div></div><div class="panel"><div class="panel-header"><h2>Attendance History</h2><button class="btn btn-outline btn-sm" id="edit-profile">'+icon("edit","icon-sm")+' Edit Student</button></div><div class="panel-body flush"><div class="table-wrap"><table><thead><tr><th>Date</th><th>Status</th><th>Note</th></tr></thead><tbody>'+rr+'</tbody></table></div></div></div>';
    d.querySelector("#back").addEventListener("click",function(){state.profileId=null;render();});
    d.querySelector("#edit-profile").addEventListener("click",function(){openStudentModal(id);});
    return d;
  }

  // ===== Attendance =====
  function renderAttendance(){setTopbar("Take Attendance","Record student attendance for a class session");var d=document.createElement("div"),today=todayISO();var cO=state.classes.length?'<select id="att-class"><option value="">All Students</option>'+state.classes.map(function(c){return '<option value="'+c.id+'">'+esc(c.name)+'</option>';}).join("")+'</select>':"";
    d.innerHTML='<div class="toolbar">'+cO+'<label style="font-weight:600;font-size:0.86rem;color:var(--text-2);">Date:</label><input type="date" id="att-date" value="'+today+'"/><button class="btn btn-outline btn-sm" id="load-date">'+icon("save","icon-sm")+' Load Saved</button><div class="spacer"></div><div class="seg-control"><button class="seg-btn" id="bulk-present">Mark All Present</button><button class="seg-btn" id="bulk-absent">Mark All Absent</button></div><button class="btn btn-primary" id="save-att" style="width:auto;">'+icon("check","icon-sm")+' Save Attendance</button></div><div class="panel"><div class="panel-header"><h2>Student Roster</h2><span class="badge badge-slate" id="att-count">0 students</span></div><div class="panel-body flush" id="att-roster"></div></div>';
    var dI=d.querySelector("#att-date"),rc=d.querySelector("#att-roster"),cS=d.querySelector("#att-class");
    function getRoster(){var l=state.students;if(cS&&cS.value)l=studentsInClass(cS.value);return l;}
    function loadDraft(dt){var ex=getAttendanceForDate(dt);state.attendanceDraft={};state.attendanceNotes={};getRoster().forEach(function(s){var r=ex.find(function(a){return a.studentId===s.id;});state.attendanceDraft[s.id]=r?r.status:"present";state.attendanceNotes[s.id]=r?(r.note||""):"";});}
    function sB(st,cur,sid){var a=cur===st?" active "+st:"";return '<button class="status-btn'+a+'" data-status="'+st+'" data-student="'+sid+'">'+cap(st)+'</button>';}
    function renderRoster(){var ro=getRoster();if(!ro.length){rc.innerHTML=emptyState(IMG.emptyStudents,"No students registered. Add students first.");return;}rc.innerHTML=ro.map(function(s){var st=state.attendanceDraft[s.id]||"present";return '<div class="attendance-row"><div class="student-info">'+studentAvatarHTML(s,40)+'<div class="student-meta"><p>'+esc(s.name)+'</p><span>'+esc(s.matric)+' · '+esc(s.level)+' level</span></div></div><div style="display:flex;flex-direction:column;align-items:flex-end;gap:0.35rem;"><div class="status-toggle">'+sB("present",st,s.id)+sB("absent",st,s.id)+sB("late",st,s.id)+'</div><input type="text" class="note-input" data-note="'+s.id+'" placeholder="Add note..." value="'+esc(state.attendanceNotes[s.id]||"")+'" style="width:200px;"/></div></div>';}).join("");d.querySelector("#att-count").textContent=ro.length+" students";rc.querySelectorAll(".status-btn").forEach(function(b){b.addEventListener("click",function(){state.attendanceDraft[b.getAttribute("data-student")]=b.getAttribute("data-status");renderRoster();});});rc.querySelectorAll("[data-note]").forEach(function(ni){ni.addEventListener("input",function(){state.attendanceNotes[ni.getAttribute("data-note")]=ni.value;});});}
    loadDraft(dI.value);renderRoster();
    dI.addEventListener("change",function(){loadDraft(dI.value);renderRoster();});
    if(cS)cS.addEventListener("change",function(){loadDraft(dI.value);renderRoster();});
    d.querySelector("#load-date").addEventListener("click",function(){loadDraft(dI.value);renderRoster();toast("Loaded saved attendance for "+fmtDate(dI.value));});
    d.querySelector("#bulk-present").addEventListener("click",function(){getRoster().forEach(function(s){state.attendanceDraft[s.id]="present";});renderRoster();});
    d.querySelector("#bulk-absent").addEventListener("click",function(){getRoster().forEach(function(s){state.attendanceDraft[s.id]="absent";});renderRoster();});
    d.querySelector("#save-att").addEventListener("click",function(){var ro=getRoster();if(!ro.length){toast("No students to record.");return;}var recs=ro.map(function(s){return{studentId:s.id,status:state.attendanceDraft[s.id]||"present"};});saveAttendance(dI.value,recs,state.attendanceNotes);toast("Attendance saved for "+fmtDate(dI.value));});
    return d;
  }

  // ===== Calendar =====
  function renderCalendar(){setTopbar("Calendar","Daily attendance rate heatmap");var d=document.createElement("div");var now=new Date(),yr=now.getFullYear(),mo=now.getMonth();var fD=new Date(yr,mo,1),dIM=new Date(yr,mo+1,0).getDate(),sD=fD.getDay();var mN=now.toLocaleDateString(undefined,{month:"long",year:"numeric"});var cells="";["S","M","T","W","T","F","S"].forEach(function(dl){cells+='<div style="text-align:center;font-size:0.72rem;font-weight:700;color:var(--text-3);padding:0.4rem 0;">'+dl+'</div>';});for(var i=0;i<sD;i++)cells+='<div class="cal-empty"></div>';for(var dt=1;dt<=dIM;dt++){var iso=new Date(yr,mo,dt).toISOString().slice(0,10);var r=dailyRate(iso);var cls="cal-na",lb=iso;if(r!==null){cls=r>=75?"cal-good":r>=50?"cal-warn":"cal-bad";lb=fmtDate(iso)+" · "+r+"% present";}cells+='<div class="calendar-day '+cls+'" title="'+lb+'">'+dt+'</div>';}d.innerHTML='<div class="panel"><div class="calendar-month-label">'+mN+'</div><div class="calendar-grid">'+cells+'</div><div class="calendar-legend"><div class="calendar-legend-item"><div class="calendar-legend-box cal-good"></div>≥75%</div><div class="calendar-legend-item"><div class="calendar-legend-box cal-warn"></div>50-74%</div><div class="calendar-legend-item"><div class="calendar-legend-box cal-bad"></div><50%</div><div class="calendar-legend-item"><div class="calendar-legend-box cal-na"></div>No data</div></div></div>';return d;}

  // ===== Analytics =====
  function renderAnalytics(){setTopbar("Analytics","Visualize attendance trends and distributions");var d=document.createElement("div");var aP=state.attendance.filter(function(a){return a.status==="present";}).length,aA=state.attendance.filter(function(a){return a.status==="absent";}).length,aL=state.attendance.filter(function(a){return a.status==="late";}).length;var cM={};state.students.forEach(function(s){if(!cM[s.course])cM[s.course]={present:0,absent:0,late:0,total:0};});state.attendance.forEach(function(a){var s=findStudent(a.studentId);if(s&&cM[s.course]){cM[s.course][a.status]++;cM[s.course].total++;}});var cR=Object.keys(cM).map(function(c){var b=cM[c],r=b.total?Math.round(((b.present+b.late*0.5)/b.total)*100):0;var bd=r>=75?"badge-excellent":r>=50?"badge-warning":"badge-critical";var bc=r>=75?"good":r>=50?"warn":"bad";return '<tr><td><strong>'+esc(c)+'</strong></td><td>'+b.present+'</td><td>'+b.absent+'</td><td>'+b.late+'</td><td>'+b.total+'</td><td class="rate-cell"><div class="rate-text"><span class="badge '+bd+'">'+r+'%</span></div><div class="progress-bar"><div class="progress-fill '+bc+'" style="width:'+r+'%"></div></div></td></tr>';}).join("");if(!cR)cR='<tr><td colspan="6" style="text-align:center;padding:2rem;color:var(--text-3);">No data available.</td></tr>';
    d.innerHTML='<div class="panel"><div class="panel-header"><h2>14-Day Attendance Trend</h2><span class="panel-sub">Students present per day</span></div><div class="panel-body chart-container">'+trendChart()+'</div></div><div class="two-col"><div class="panel"><div class="panel-header"><h2>Overall Distribution</h2></div><div class="panel-body chart-container">'+donutChart(aP,aA,aL)+'</div></div><div class="panel"><div class="panel-header"><h2>Quick Stats</h2></div><div class="panel-body"><div style="display:flex;flex-direction:column;gap:1rem;"><div class="flex-between"><span class="text-sm text-muted">Total Sessions Recorded</span><strong>'+state.attendance.length+'</strong></div><div class="flex-between"><span class="text-sm text-muted">Total Students</span><strong>'+state.students.length+'</strong></div><div class="flex-between"><span class="text-sm text-muted">Present Records</span><strong style="color:var(--success)">'+aP+'</strong></div><div class="flex-between"><span class="text-sm text-muted">Absent Records</span><strong style="color:var(--danger)">'+aA+'</strong></div><div class="flex-between"><span class="text-sm text-muted">Late Records</span><strong style="color:var(--warning)">'+aL+'</strong></div><div class="flex-between"><span class="text-sm text-muted">At-Risk Students</span><strong style="color:var(--danger)">'+atRiskStudents().length+'</strong></div><div class="flex-between"><span class="text-sm text-muted">Classes</span><strong>'+state.classes.length+'</strong></div></div></div></div></div><div class="panel"><div class="panel-header"><h2>Course-Level Breakdown</h2></div><div class="panel-body flush"><div class="table-wrap"><table><thead><tr><th>Course</th><th>Present</th><th>Absent</th><th>Late</th><th>Total</th><th>Rate</th></tr></thead><tbody>'+cR+'</tbody></table></div></div></div>';return d;}

  // ===== At-Risk =====
  function renderAtRisk(){setTopbar("At-Risk Students","Students with attendance below 75%");var d=document.createElement("div");var risk=atRiskStudents().sort(function(a,b){return attendanceSummary(a.id).rate-attendanceSummary(b.id).rate;});if(!risk.length){d.innerHTML='<div class="panel"><div class="panel-body">'+emptyState(IMG.emptyCheck,"No at-risk students. Everyone is above 75% attendance.")+'</div></div>';return d;}var rows=risk.map(function(s){var sm=attendanceSummary(s.id);var bd=sm.rate>=50?"badge-warning":"badge-critical";var bc=sm.rate>=50?"warn":"bad";return '<tr class="clickable-row" data-profile="'+s.id+'"><td><div style="display:flex;align-items:center;gap:0.6rem;">'+studentAvatarHTML(s,32)+'<strong>'+esc(s.name)+'</strong></div></td><td class="id-badge">'+esc(s.matric)+'</td><td>'+esc(s.course)+'</td><td class="rate-cell"><div class="rate-text"><span class="badge '+bd+'">'+sm.rate+'%</span><span class="text-muted">'+sm.present+"/"+sm.total+'</span></div><div class="progress-bar"><div class="progress-fill '+bc+'" style="width:'+sm.rate+'%"></div></div></td></tr>';}).join("");d.innerHTML='<div class="alert-banner"><span class="alert-icon">'+SVG.alert+'</span><span>'+risk.length+' student'+(risk.length>1?"s":"")+' below the 75% attendance threshold. Consider follow-up action.</span></div><div class="panel"><div class="panel-body flush"><div class="table-wrap"><table><thead><tr><th>Name</th><th>Index No.</th><th>Course</th><th>Attendance</th></tr></thead><tbody>'+rows+'</tbody></table></div></div></div>';d.querySelectorAll("[data-profile]").forEach(function(r){r.addEventListener("click",function(){state.profileId=r.getAttribute("data-profile");state.view="students";render();});});return d;}

  // ===== Classes =====
  function renderClasses(){
    if(state.selectedClassId)return renderClassDetail(state.selectedClassId);
    setTopbar("Classes","Manage classes and assign students");var d=document.createElement("div");
    if(!state.classes.length){d.innerHTML='<div class="panel"><div class="panel-body">'+emptyState(IMG.emptyClasses,"No classes created yet.")+'<button class="btn btn-accent mt-2" id="add-class-empty">'+icon("plus","icon-sm")+' Create Class</button></div></div>';d.querySelector("#add-class-empty").addEventListener("click",function(){openClassModal();});return d;}
    var cards=state.classes.map(function(c){var ct=studentsInClass(c.id).length;var cIc=classIconFor(c.name);return '<div class="class-card" data-class="'+c.id+'"><div class="cc-icon">'+cIc+'</div><h3>'+esc(c.name)+'</h3><p>'+esc(c.code)+' · '+ct+' student'+(ct!==1?"s":"")+'</p>'+(c.description?'<p class="mt-1">'+esc(c.description)+'</p>':"")+'<div style="display:flex;gap:0.4rem;margin-top:0.75rem;"><button class="btn btn-outline btn-sm" data-edit-class="'+c.id+'">'+icon("edit","icon-sm")+'</button><button class="btn btn-danger btn-sm btn-icon" data-del-class="'+c.id+'" title="Delete">'+SVG.trash+'</button></div></div>';}).join("");
    d.innerHTML='<div class="toolbar"><div class="spacer"></div><button class="btn btn-accent" id="add-class">'+icon("plus","icon-sm")+' Create Class</button></div><div class="class-grid">'+cards+'</div>';
    d.querySelector("#add-class").addEventListener("click",function(){openClassModal();});
    d.querySelectorAll("[data-class]").forEach(function(card){card.addEventListener("click",function(e){if(e.target.closest("button"))return;state.selectedClassId=card.getAttribute("data-class");renderView();});});
    d.querySelectorAll("[data-edit-class]").forEach(function(b){b.addEventListener("click",function(e){e.stopPropagation();openClassModal(b.getAttribute("data-edit-class"));});});
    d.querySelectorAll("[data-del-class]").forEach(function(b){b.addEventListener("click",function(e){e.stopPropagation();if(confirm("Delete this class? Students will be unassigned.")){deleteClass(b.getAttribute("data-del-class"));toast("Class deleted.");renderView();}});});
    return d;
  }

  // ===== Class Detail with Student Assignment =====
  function renderClassDetail(classId){
    var c=findClass(classId);if(!c){state.selectedClassId=null;return renderClasses();}
    setTopbar(esc(c.name),"Manage class roster and assignments");
    var d=document.createElement("div");
    var cIc=classIconFor(c.name);
    var assigned=studentsInClass(classId);
    var unassigned=state.students.filter(function(s){return !s.classId||s.classId!==classId;});

    d.innerHTML='<div style="margin-bottom:1rem;"><button class="btn btn-outline btn-sm" id="back-classes">'+icon("back","icon-sm")+' Back to Classes</button></div>'+
      '<div class="class-detail-header"><div class="class-detail-icon">'+cIc+'</div><div class="class-detail-title"><h2>'+esc(c.name)+'</h2><p>'+esc(c.code)+(c.description?' · '+esc(c.description):"")+'</p></div><div style="margin-left:auto;display:flex;gap:0.4rem;"><button class="btn btn-outline btn-sm" data-edit-class="'+c.id+'">'+icon("edit","icon-sm")+' Edit</button><button class="btn btn-danger btn-sm btn-icon" data-del-class="'+c.id+'" title="Delete">'+SVG.trash+'</button></div></div>'+
      '<div class="two-col"><div class="panel"><div class="panel-header"><h2>Assigned Students</h2><span class="badge badge-slate">'+assigned.length+'</span></div><div class="panel-body flush"><div id="assigned-list"></div></div></div>'+
      '<div class="panel"><div class="panel-header"><h2>Unassigned Students</h2><span class="badge badge-slate">'+unassigned.length+'</span></div><div class="panel-body flush"><div id="unassigned-list"></div></div></div></div>';

    function renderAssignedList(){
      var el=d.querySelector("#assigned-list");
      if(!assigned.length){el.innerHTML='<div style="padding:1.5rem;text-align:center;color:var(--text-3);font-size:0.84rem;">No students assigned to this class yet.</div>';return;}
      el.innerHTML=assigned.map(function(s){return '<div class="assign-row"><div class="assign-student-info">'+studentAvatarHTML(s,32)+'<div><p>'+esc(s.name)+'</p><span>'+esc(s.matric)+' · '+esc(s.course)+'</span></div></div><button class="btn btn-danger btn-sm" data-unassign="'+s.id+'">Remove</button></div>';}).join("");
      el.querySelectorAll("[data-unassign]").forEach(function(b){b.addEventListener("click",function(){unassignStudentFromClass(classId,b.getAttribute("data-unassign"));toast("Student removed from class.");renderClassDetailUpdate(classId);});});
    }
    function renderUnassignedList(){
      var el=d.querySelector("#unassigned-list");
      if(!unassigned.length){el.innerHTML='<div style="padding:1.5rem;text-align:center;color:var(--text-3);font-size:0.84rem;">All students are assigned.</div>';return;}
      el.innerHTML=unassigned.map(function(s){return '<div class="assign-row"><div class="assign-student-info">'+studentAvatarHTML(s,32)+'<div><p>'+esc(s.name)+'</p><span>'+esc(s.matric)+' · '+esc(s.course)+'</span></div></div><button class="btn btn-accent btn-sm" data-assign="'+s.id+'">Assign</button></div>';}).join("");
      el.querySelectorAll("[data-assign]").forEach(function(b){b.addEventListener("click",function(){assignStudentsToClass(classId,[b.getAttribute("data-assign")]);toast("Student assigned to class.");renderClassDetailUpdate(classId);});});
    }
    renderAssignedList();renderUnassignedList();

    d.querySelector("#back-classes").addEventListener("click",function(){state.selectedClassId=null;renderView();});
    var eb=d.querySelector("[data-edit-class]");if(eb)eb.addEventListener("click",function(e){e.stopPropagation();openClassModal(classId);});
    var db=d.querySelector("[data-del-class]");if(db)db.addEventListener("click",function(e){e.stopPropagation();if(confirm("Delete this class? Students will be unassigned.")){deleteClass(classId);state.selectedClassId=null;toast("Class deleted.");renderView();}});

    return d;
  }
  function renderClassDetailUpdate(classId){var c=findClass(classId);if(!c){state.selectedClassId=null;renderView();return;}renderView();}

  function openClassModal(id){var c=id?findClass(id):null;var ov=document.createElement("div");ov.className="modal-overlay";
    ov.innerHTML='<div class="modal"><div class="modal-header"><h2>'+(c?"Edit Class":"Create Class")+'</h2><button class="modal-close" id="mc">'+SVG.close+'</button></div><div class="modal-body"><div id="me"></div><form id="cf"><div class="form-group"><label>Class Name</label><input type="text" id="c-name" required value="'+(c?esc(c.name):"")+'"/></div><div class="form-group"><label>Class Code</label><input type="text" id="c-code" required value="'+(c?esc(c.code):"")+'"/></div><div class="form-group"><label>Description (optional)</label><textarea id="c-desc">'+(c?esc(c.description):"")+'</textarea></div><div class="form-actions"><button type="button" class="btn btn-outline" id="cancel">Cancel</button><button type="submit" class="btn btn-primary" style="width:auto;">'+(c?"Save Changes":"Create Class")+'</button></div></form></div></div>';
    document.body.appendChild(ov);function close(){ov.remove();}
    ov.querySelector("#mc").addEventListener("click",close);ov.querySelector("#cancel").addEventListener("click",close);ov.addEventListener("click",function(e){if(e.target===ov)close();});
    ov.querySelector("#cf").addEventListener("submit",function(e){e.preventDefault();var d2={name:ov.querySelector("#c-name").value,code:ov.querySelector("#c-code").value,description:ov.querySelector("#c-desc").value};if(!d2.name.trim()||!d2.code.trim()){ov.querySelector("#me").innerHTML='<div class="alert alert-error">Name and code are required.</div>';return;}if(id){updateClass(id,d2);toast("Class updated.");}else{addClass(d2);toast("Class created.");}close();renderView();});
  }

  // ===== Reports =====
  function renderReports(){setTopbar("Reports","Generate and export attendance reports");var d=document.createElement("div");
    d.innerHTML='<div class="panel"><div class="panel-header"><h2>Filters</h2></div><div class="panel-body"><div class="toolbar"><select id="rep-student"><option value="">All Students</option></select><label style="font-size:0.82rem;color:var(--text-2);">From:</label><input type="date" id="rep-from"/><label style="font-size:0.82rem;color:var(--text-2);">To:</label><input type="date" id="rep-to"/><button class="btn btn-accent btn-sm" id="rep-run">Generate</button><button class="btn btn-outline btn-sm" id="rep-csv">'+icon("download","icon-sm")+' Export CSV</button><button class="btn btn-ghost btn-sm btn-icon" id="rep-print" title="Print">'+SVG.print+'</button></div></div></div><div id="rep-results"></div>';
    var sel=d.querySelector("#rep-student");state.students.forEach(function(s){var o=document.createElement("option");o.value=s.id;o.textContent=s.name+" ("+s.matric+")";sel.appendChild(o);});var rc=d.querySelector("#rep-results"),lR=[];
    function runReport(){var sid=sel.value,from=d.querySelector("#rep-from").value,to=d.querySelector("#rep-to").value;var recs=state.attendance.filter(function(a){if(sid&&a.studentId!==sid)return false;if(from&&a.date<from)return false;if(to&&a.date>to)return false;return true;});lR=recs;if(!recs.length){rc.innerHTML='<div class="panel"><div class="panel-body">'+emptyState(IMG.emptyReports,"No attendance records found for the selected filters.")+'</div></div>';return;}var p=recs.filter(function(a){return a.status==="present";}).length,ab=recs.filter(function(a){return a.status==="absent";}).length,l=recs.filter(function(a){return a.status==="late";}).length,t=recs.length;var sh='<div class="stats-grid">'+statCard("icon-blue","clipboard",t,"Total Records")+statCard("icon-green","check",p,"Present")+statCard("icon-red","x",ab,"Absent")+statCard("icon-amber","clock",l,"Late")+'</div>';var bS={};recs.forEach(function(a){if(!bS[a.studentId])bS[a.studentId]={present:0,absent:0,late:0,total:0};bS[a.studentId][a.status]++;bS[a.studentId].total++;});var br=Object.keys(bS).map(function(sid){var s=findStudent(sid),b=bS[sid],r=Math.round(((b.present+b.late*0.5)/b.total)*100);var bd=r>=75?"badge-excellent":r>=50?"badge-warning":"badge-critical";return '<tr class="clickable-row" data-profile="'+sid+'"><td><strong>'+esc(s?s.name:"Unknown")+'</strong></td><td class="id-badge">'+esc(s?s.matric:"—")+'</td><td><span class="badge badge-present">'+b.present+'</span></td><td><span class="badge badge-absent">'+b.absent+'</span></td><td><span class="badge badge-late">'+b.late+'</span></td><td><span class="badge '+bd+'">'+r+'%</span></td></tr>';}).join("");var bh='<div class="panel"><div class="panel-header"><h2>Per-Student Breakdown</h2></div><div class="panel-body flush"><div class="table-wrap"><table><thead><tr><th>Student</th><th>Index No.</th><th>Present</th><th>Absent</th><th>Late</th><th>Rate</th></tr></thead><tbody>'+br+'</tbody></table></div></div></div>';var sr=recs.slice().sort(function(a,b){return b.date.localeCompare(a.date);});var dr=sr.map(function(a){var s=findStudent(a.studentId),b=a.status==="present"?"badge-present":a.status==="absent"?"badge-absent":"badge-late";return '<tr><td>'+fmtDate(a.date)+'</td><td>'+esc(s?s.name:"Unknown")+'</td><td class="id-badge">'+esc(s?s.matric:"—")+'</td><td><span class="badge '+b+'">'+cap(a.status)+'</span></td><td>'+(a.note?'<div class="note-text">'+esc(a.note)+'</div>':'<span class="text-muted">—</span>')+'</td></tr>';}).join("");var dh='<div class="panel"><div class="panel-header"><h2>Attendance Log</h2></div><div class="panel-body flush"><div class="table-wrap"><table><thead><tr><th>Date</th><th>Student</th><th>Index No.</th><th>Status</th><th>Note</th></tr></thead><tbody>'+dr+'</tbody></table></div></div></div>';rc.innerHTML=sh+bh+dh;rc.querySelectorAll("[data-profile]").forEach(function(r){r.addEventListener("click",function(){state.profileId=r.getAttribute("data-profile");state.view="students";render();});});}
    function exportRep(){if(!lR.length){toast("Generate a report first.");return;}var rows=[["Date","Student","Index Number","Course","Level","Status","Note"]];lR.slice().sort(function(a,b){return b.date.localeCompare(a.date);}).forEach(function(a){var s=findStudent(a.studentId);rows.push([a.date,s?s.name:"Unknown",s?s.matric:"—",s?s.course:"—",s?s.level:"—",a.status,a.note||""]);});exportCSV("attendance-report-"+todayISO()+".csv",rows);toast("Report exported to CSV.");}
    d.querySelector("#rep-run").addEventListener("click",runReport);d.querySelector("#rep-csv").addEventListener("click",exportRep);d.querySelector("#rep-print").addEventListener("click",function(){window.print();});if(state.attendance.length)runReport();return d;
  }

  // ===== Profile =====
  function renderProfile(){setTopbar("My Profile","Manage your lecturer profile");var d=document.createElement("div"),lec=state.lecturer||{},ph=lec.photo||"";var avH=ph?'<img src="'+esc(ph)+'"/>':'<span class="avatar-placeholder">'+SVG.userPlaceholder+'</span>';
    d.innerHTML='<div class="panel"><div class="profile-header"><div class="profile-avatar-lg">'+avH+'</div><div><div class="profile-name">'+esc(cap(lec.name||"Lecturer"))+'</div><div class="profile-meta"><div class="profile-meta-item">'+SVG.mail+' '+esc(lec.email||"")+'</div>'+(lec.phone?'<div class="profile-meta-item">'+SVG.phone+' '+esc(lec.phone)+'</div>':"")+'</div></div></div></div><div class="panel"><div class="panel-header"><h2>Edit Profile</h2></div><div class="modal-body"><div id="pe"></div><div class="avatar-upload"><div class="avatar-preview" id="avatar-preview">'+(ph?'<img src="'+esc(ph)+'"/>':'<div class="avatar-placeholder">'+SVG.userPlaceholder+'</div>')+'</div><input type="file" id="photo-input" accept="image/*" style="display:none"/><button class="btn btn-outline btn-sm" id="upload-btn">'+icon("camera","icon-sm")+' Upload Photo</button>'+(ph?'<button class="btn btn-danger btn-sm btn-icon" id="remove-photo" title="Remove photo">'+SVG.trash+'</button>':"")+'<span class="avatar-upload-hint">Max 500KB · JPG/PNG</span></div><form id="pf"><div class="form-group"><label>Full Name</label><input type="text" id="p-name" required value="'+esc(lec.name||"")+'"/></div><div class="form-group"><label>Email</label><input type="email" id="p-email" required value="'+esc(lec.email||"")+'"/></div><div class="form-group"><label>Phone (optional)</label><input type="text" id="p-phone" value="'+esc(lec.phone||"")+'"/></div><div class="form-group"><label>Current Password (required to save changes)</label><div class="password-field"><input type="password" id="p-password" placeholder="Enter your password to confirm" style="padding-right:2.5rem;"/><button type="button" class="password-toggle" id="p-pw-toggle">'+SVG.eye+'</button></div></div><div class="form-actions"><button type="submit" class="btn btn-primary" style="width:auto;">'+icon("save","icon-sm")+' Save Profile</button></div></form></div></div>';
    var photoData=ph;
    d.querySelector("#upload-btn").addEventListener("click",function(){d.querySelector("#photo-input").click();});
    d.querySelector("#photo-input").addEventListener("change",function(e){handleImageUpload(e.target.files[0],function(data){photoData=data;d.querySelector("#avatar-preview").innerHTML='<img src="'+esc(data)+'"/>';});});
    var rp=d.querySelector("#remove-photo");if(rp)rp.addEventListener("click",function(){photoData="";d.querySelector("#avatar-preview").innerHTML='<div class="avatar-placeholder">'+SVG.userPlaceholder+'</div>';});
    var pPwI=d.querySelector("#p-password"),pPwT=d.querySelector("#p-pw-toggle");pPwT.addEventListener("click",function(){var p=pPwI.type==="password";pPwI.type=p?"text":"password";pPwT.innerHTML=p?SVG.eyeOff:SVG.eye;});
    d.querySelector("#pf").addEventListener("submit",function(e){e.preventDefault();var d2={name:d.querySelector("#p-name").value,email:d.querySelector("#p-email").value,phone:d.querySelector("#p-phone").value,photo:photoData};var pw=d.querySelector("#p-password").value;if(!d2.name.trim()||!d2.email.trim()){d.querySelector("#pe").innerHTML='<div class="alert alert-error">Name and email are required.</div>';return;}if(state.currentAccount&&state.currentAccount.passwordHash!==hashPassword(pw)){d.querySelector("#pe").innerHTML='<div class="alert alert-error">Incorrect password. Changes not saved.</div>';return;}updateLecturer(d2);toast("Profile updated.");render();});
    return d;
  }

  // ===== Settings =====
  function renderSettings(){setTopbar("Settings","Manage your data and preferences");var d=document.createElement("div");
    d.innerHTML='<div class="panel"><div class="panel-header"><h2>Appearance</h2></div><div class="panel-body"><div class="flex-between"><div><p class="text-bold">Dark Mode</p><p class="text-sm text-muted">Toggle between light and dark themes.</p></div><button class="btn btn-outline btn-sm" id="toggle-theme">'+(state.theme==="dark"?"Switch to Light":"Switch to Dark")+'</button></div></div></div><div class="panel"><div class="panel-header"><h2>Change Password</h2></div><div class="panel-body"><form id="change-pw-form"><div class="form-group"><label>Current Password</label><div class="password-field"><input type="password" id="cpw-current" placeholder="Enter current password" style="padding-right:2.5rem;"/><button type="button" class="password-toggle" id="cpw-toggle1">'+SVG.eye+'</button></div></div><div class="form-group"><label>New Password</label><div class="password-field"><input type="password" id="cpw-new" placeholder="Min 6 characters" style="padding-right:2.5rem;"/><button type="button" class="password-toggle" id="cpw-toggle2">'+SVG.eye+'</button></div></div><div class="form-group"><label>Confirm New Password</label><div class="password-field"><input type="password" id="cpw-confirm" placeholder="Re-enter new password" style="padding-right:2.5rem;"/><button type="button" class="password-toggle" id="cpw-toggle3">'+SVG.eye+'</button></div></div><div id="cpw-error"></div><button type="submit" class="btn btn-primary" style="width:auto;">Update Password</button></form></div></div><div class="panel"><div class="panel-header"><h2>Data Management</h2></div><div class="panel-body"><div style="display:flex;flex-direction:column;gap:1rem;"><div class="flex-between"><div><p class="text-bold">Export Data</p><p class="text-sm text-muted">Download all data as a JSON backup.</p></div><button class="btn btn-accent btn-sm" id="export-data">'+icon("download","icon-sm")+' Export</button></div><div class="flex-between"><div><p class="text-bold">Import Data</p><p class="text-sm text-muted">Restore from a JSON backup. Replaces current data.</p></div><button class="btn btn-outline btn-sm" id="import-data">'+icon("upload","icon-sm")+' Import</button></div><input type="file" id="import-file" accept=".json" style="display:none;"/></div></div></div><div class="panel"><div class="panel-header"><h2>Danger Zone</h2></div><div class="panel-body"><div class="flex-between"><div><p class="text-bold" style="color:var(--danger)">Clear All Data</p><p class="text-sm text-muted">Permanently delete all students, attendance, and classes.</p></div><button class="btn btn-danger btn-sm" id="clear-data">'+icon("trash","icon-sm")+' Delete Everything</button></div></div></div><div class="panel"><div class="panel-header"><h2>About</h2></div><div class="panel-body"><p class="text-bold">Student Attendance Management System</p><p class="text-sm text-muted mt-1">Version 4.1 · Built with pure HTML, CSS, and JavaScript. SVG icons. Data stored locally in your browser.</p></div></div>';
    d.querySelector("#toggle-theme").addEventListener("click",function(){toggleTheme();render();});
    function bpw(ii,ti){var inp=d.querySelector("#"+ii),tog=d.querySelector("#"+ti);tog.addEventListener("click",function(){var p=inp.type==="password";inp.type=p?"text":"password";tog.innerHTML=p?SVG.eyeOff:SVG.eye;});}
    bpw("cpw-current","cpw-toggle1");bpw("cpw-new","cpw-toggle2");bpw("cpw-confirm","cpw-toggle3");
    d.querySelector("#change-pw-form").addEventListener("submit",function(e){e.preventDefault();var cur=d.querySelector("#cpw-current").value,np=d.querySelector("#cpw-new").value,cp=d.querySelector("#cpw-confirm").value,el=d.querySelector("#cpw-error");if(!state.currentAccount){el.innerHTML='<div class="alert alert-error">No account session found.</div>';return;}if(state.currentAccount.passwordHash!==hashPassword(cur)){el.innerHTML='<div class="alert alert-error">Current password is incorrect.</div>';return;}if(np.length<6){el.innerHTML='<div class="alert alert-error">New password must be at least 6 characters.</div>';return;}if(np!==cp){el.innerHTML='<div class="alert alert-error">New passwords do not match.</div>';return;}state.currentAccount.passwordHash=hashPassword(np);persist();el.innerHTML='<div class="auth-success">Password updated successfully.</div>';d.querySelector("#change-pw-form").reset();toast("Password updated.");});
    d.querySelector("#export-data").addEventListener("click",function(){exportData();toast("Data exported.");});
    d.querySelector("#import-data").addEventListener("click",function(){d.querySelector("#import-file").click();});
    d.querySelector("#import-file").addEventListener("change",function(e){var f=e.target.files[0];if(!f)return;var r=new FileReader();r.onload=function(ev){var err=importData(ev.target.result);if(err)toast(err);else{toast("Data imported.");render();}};r.readAsText(f);});
    d.querySelector("#clear-data").addEventListener("click",function(){if(confirm("Delete ALL students, attendance, and classes? This cannot be undone.")){state.students=[];state.attendance=[];state.classes=[];persist();toast("All data cleared.");render();}});
    return d;
  }

  applyTheme();render();
})();

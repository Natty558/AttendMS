# AttendMS — Student Attendance Management System

A web-based attendance management system for lecturers to track student attendance, manage classes, and generate reports. Built with **separate HTML pages**, **split CSS files**, and **modular JavaScript** — not a single-page app. Each page has its own HTML file with real markup; JS only handles the dynamic/interactive parts.

## Features

### Authentication
- **Register** — Create a lecturer account with name, email, and password
- **Login** — Secure sign-in with email and password
- **Forgot Password** — Reset password using registered email
- **Change Password** — Update password from Settings (requires current password)
- Password strength indicator during registration and reset
- Show/hide password toggles on all password fields

### Dashboard
- Overview stats: total students, present/absent today, overall attendance rate
- Today's attendance snapshot with progress bar
- Overall attendance distribution donut chart (present/absent/late)
- At-risk student alert banner (links to At-Risk page)
- Recent students table (last 5 added)

### Students
- **Add/Edit Student** — Name, Index Number, Course, Level, Email, Phone, Photo
- **Index Number Uniqueness** — Prevents duplicate index numbers (case-insensitive check)
- **Student Profile** — Full attendance history, stats (present/absent/late/total), attendance streak badge
- **Search** — Filter by name, index number, or course
- **Export CSV** — Download all students with attendance stats
- **Delete** — Removes student and all their attendance records
- **Photo Upload** — Student avatar photos (max 500KB, JPG/PNG)

### Classes
- **Create/Edit Class** — Name, code, and optional description
- **Class Detail View** — Two-column interface showing assigned and unassigned students
- **Assign Students** — One-click assign/unassign students to a class
- **Smart Icons** — Class icons auto-select based on class name (math, science, art, code, music, language, business, health, law, etc.)
- Attendance page can filter roster by class

### Take Attendance
- Select class (or "All Students") and date
- Mark each student as Present, Absent, or Late
- Add per-student notes
- Bulk actions: "Mark All Present" / "Mark All Absent"
- Load previously saved attendance for a date
- Saves and overwrites attendance for the selected date

### Calendar
- Monthly heatmap view showing daily attendance rates
- Color-coded: green (>=75%), amber (50-74%), red (<50%), gray (no data)
- Hover for exact date and percentage

### Analytics
- 14-day attendance trend bar chart
- Overall distribution donut chart
- Quick stats panel (sessions, students, present/absent/late counts, at-risk count, class count)
- Course-level breakdown table with per-course attendance rates

### At-Risk Students
- Lists all students below 75% attendance (sorted by lowest rate)
- Alert banner with count
- Click any student to view their full profile

### Reports
- Filter by student, date range (from/to)
- Summary stats (total, present, absent, late)
- Per-student breakdown table
- Full attendance log with dates, statuses, and notes
- Export filtered results to CSV
- Print support

### Profile
- View and edit lecturer name, email, phone, and photo
- Requires current password confirmation to save changes

### Settings
- **Dark/Light Theme** — Toggle between themes
- **Change Password** — Requires current password verification
- **Export Data** — Download full JSON backup (students, attendance, classes, accounts, lecturer)
- **Import Data** — Restore from JSON backup (replaces current data)
- **Clear All Data** — Permanently delete everything (with confirmation)

## Project Structure

```
project/
├── index.html                  # Redirects to login.html
├── login.html                  # Login page (HTML + form markup)
├── register.html               # Register page (HTML + form markup)
├── forgot-password.html        # Forgot password page (HTML + form markup)
├── dashboard.html              # Dashboard page (loads layout + content via JS)
├── students.html               # Students list / profile page
├── attendance.html             # Take attendance page
├── classes.html                # Classes list / class detail page
├── analytics.html              # Analytics page
├── calendar.html               # Calendar heatmap page
├── atrisk.html                 # At-risk students page
├── reports.html                # Reports page
├── profile.html                # Profile editor page
├── settings.html               # Settings page
├── package.json                # Project metadata and scripts
├── vite.config.js             # Vite config (multi-page input)
├── README.md                   # This file
│
├── css/
│   ├── base.css                # Design tokens, reset, utilities
│   ├── layout.css              # Sidebar, topbar, auth screen, responsive layout
│   ├── components.css          # Buttons, forms, tables, badges, modals, panels, stats
│   └── views.css               # Attendance, charts, calendar, class cards, profile
│
└── js/
    ├── icons.js                # SVG icon strings, logo, classIconFor()
    ├── utils.js                # Helpers: uid, dates, toast, escaping, image upload
    ├── state.js                # App state, localStorage persistence, theme
    ├── auth.js                 # Auth: register, login, reset, hash, requireAuth
    ├── data.js                 # CRUD: students, classes, attendance + export/import
    ├── charts.js               # SVG donut chart, bar chart, trend chart
    ├── layout.js               # Injects sidebar/topbar, navigation, auth guard
    └── pages/
        ├── login.js            # Login form handler
        ├── register.js         # Register form handler + password strength
        ├── forgot-password.js  # Reset password form handler
        ├── dashboard.js        # Dashboard content rendering
        ├── students.js         # Students list, profile, add/edit modal
        ├── attendance.js       # Attendance taking logic
        ├── classes.js          # Classes list, detail, assignment, modal
        ├── analytics.js        # Analytics charts and stats
        ├── calendar.js         # Calendar heatmap rendering
        ├── atrisk.js           # At-risk students table
        ├── reports.js           # Reports with filters and CSV export
        ├── profile.js          # Profile editor form handler
        └── settings.js         # Settings: theme, password, data management
```

## Architecture

### Multi-Page App (not SPA)
Each screen is a **separate HTML file** with its own URL. Navigation between pages uses standard `window.location.href` redirects — no client-side router. This means:

- **Auth pages** (`login.html`, `register.html`, `forgot-password.html`) have real HTML forms and structure in the markup. JS only handles form submission and validation.
- **App pages** (`dashboard.html`, `students.html`, etc.) load a shared layout (sidebar + topbar) via `js/layout.js`, then fill the `#view-container` with page-specific content.
- **URL parameters** carry state between pages (e.g., `/students.html?id=STU-abc` opens a student profile).

### File Organization

| Layer | Files | Purpose |
|-------|-------|---------|
| **HTML** | `*.html` (14 pages) | Page structure, form markup, CSS/JS imports |
| **CSS** | `css/*.css` (4 files) | Design tokens, layout, components, view-specific styles |
| **Shared JS** | `js/*.js` (7 files) | State, auth, data, charts, icons, utils, layout |
| **Page JS** | `js/pages/*.js` (14 files) | One per HTML page — handles that page's logic |

### CSS Split
CSS is organized by concern, not by page:
- **`base.css`** — Design tokens (CSS variables), reset, utility classes
- **`layout.css`** — Sidebar, topbar, auth screen, responsive breakpoints
- **`components.css`** — Buttons, forms, tables, badges, modals, panels, stats, alerts
- **`views.css`** — Attendance rows, charts, calendar, class cards, profile

### Auth Guard
Every app page calls `initPage()` from `layout.js`, which checks `requireAuth()`. If not logged in, the user is redirected to `login.html`. Auth pages check `isLoggedIn()` and redirect to `dashboard.html` if already authenticated.

### State Management
All state lives in a single `state` object in `js/state.js`. The `persist()` function writes to localStorage. Since each page is a separate HTML file, state is reloaded from localStorage on every page load — no in-memory state carries over.

### Data Model

**Student**
```
{ id, name, matric (index number), course, level, email, phone, photo, classId, createdAt }
```

**Class**
```
{ id, name, code, description, createdAt }
```

**Attendance Record**
```
{ id, studentId, date (ISO), status ("present"|"absent"|"late"), note, recordedAt }
```

**Account**
```
{ id, name, email, passwordHash, phone, photo, createdAt }
```

## Technologies
- **HTML5** — 14 separate page files with real markup
- **CSS3** — 4 stylesheet files, custom design system with CSS variables, dark mode, responsive
- **JavaScript (ES6)** — Vanilla JS with module imports, no frameworks
- **Vite** — Build tool with multi-page input configuration
- **localStorage** — Client-side data persistence
- **SVG** — All icons and charts are hand-crafted inline SVG (no icon libraries)
- **Inter** — Google Font for typography
- **Pexels** — Stock photos for empty states and auth background

## Design System

### Color Palette
| Token | Light | Dark |
|-------|-------|------|
| Primary | `#0284c7` (sky blue) | same |
| Accent | `#6366f1` (indigo) | same |
| Success | `#16a34a` (green) | same |
| Warning | `#f59e0b` (amber) | same |
| Danger | `#dc2626` (red) | same |
| Background | `#f8fafc` | `#0f172a` |
| Surface | `#ffffff` | `#1e293b` |
| Sidebar | `#0f172a` | `#020617` |

### Typography
- Font: Inter (400, 500, 600, 700, 800)
- Body line-height: 1.5
- Headings: 800 weight

### Spacing
- 8px base unit
- Border radius: 8px (small), 12px (default), 16px (large)

### Breakpoints
- Desktop: default
- Tablet: `max-width: 900px` (two-col collapses)
- Mobile: `max-width: 768px` (sidebar drawer, stacked layouts)
- Small mobile: `max-width: 480px` (single column)

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Build all 14 pages for production (outputs to `dist/`) |
| `npm run preview` | Preview production build |

## Browser Support
Works in all modern browsers with ES6 module support (Chrome, Firefox, Safari, Edge). Data is stored per-browser via localStorage — clearing browser data will erase all records. Use the Export/Import feature in Settings to back up or transfer data.

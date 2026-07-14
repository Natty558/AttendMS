# AttendMS — Student Attendance Management System

A web-based attendance management system designed for lecturers to track student attendance, manage classes, and generate reports. Built with pure HTML, CSS, and JavaScript using a modular ES6 architecture. Data persists locally in the browser via localStorage.

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
- At-risk student alert banner (links to At-Risk view)
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
├── index.html              # HTML entry point
├── package.json            # Project metadata and scripts
├── style.css               # All styles (design tokens, components, responsive)
├── README.md               # This file
└── src/
    ├── main.js             # Entry point — render loop, view routing
    ├── icons.js            # SVG icon library, logo, classIconFor()
    ├── utils.js            # Helpers: uid, dates, toast, escaping, image upload
    ├── state.js            # App state, localStorage persistence, theme management
    ├── nav.js              # Shared render()/setView() bridge (avoids circular imports)
    ├── auth.js             # Authentication: register, login, reset, hash, updateLecturer
    ├── data.js             # CRUD: students, classes, attendance + export/import + uniqueness
    ├── charts.js           # SVG donut chart, bar chart, trend chart
    ├── views-auth.js       # Login, Register, Forgot Password screens
    ├── views-layout.js     # Sidebar, topbar, shared UI helpers (statCard, avatar, emptyState)
    ├── views-dashboard.js  # Dashboard view
    ├── views-students.js   # Students list, profile, add/edit modal
    ├── views-attendance.js # Take Attendance view
    ├── views-classes.js    # Classes list, class detail with assignment, class modal
    ├── views-analytics.js  # Analytics, Calendar, At-Risk views
    ├── views-reports.js    # Reports view with filters and CSV export
    └── views-profile.js    # Profile editor and Settings view
```

## Architecture

### Module System
The app uses ES6 modules (`import`/`export`) bundled by Vite. Each file has a single responsibility:

| Layer | Files | Purpose |
|-------|-------|---------|
| **Foundation** | `icons.js`, `utils.js`, `state.js`, `nav.js` | Shared utilities, state, navigation bridge |
| **Logic** | `auth.js`, `data.js`, `charts.js` | Business logic and data operations |
| **Views** | `views-*.js` | DOM rendering for each screen |
| **Entry** | `main.js` | Wires everything together, runs render loop |

### State Management
All state lives in a single `state` object exported from `state.js`. The `persist()` function writes to localStorage. Views read from `state` directly and call `render()` (via `nav.js`) to re-render after changes.

### Render Loop
`main.js` owns the `render()` function and registers it with `nav.js` via `setRender()`. Any module can trigger a re-render by calling `render()` or `setView()` from `nav.js` without importing `main.js` directly — this avoids circular dependency issues.

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

### Index Number Uniqueness
When adding or editing a student, the system checks if the index number already exists (case-insensitive). The `isIndexNumberUnique()` function in `data.js` excludes the student being edited from the check, so you can save other fields without changing the index number.

### Class Student Assignment
Students are assigned to classes via the `classId` field on the student object. The class detail view shows two lists — assigned and unassigned — with one-click assign/remove buttons. The attendance page can filter the roster by class.

## Technologies
- **HTML5** — Single entry point (`index.html`)
- **CSS3** — Custom design system with CSS variables, dark mode, responsive breakpoints
- **JavaScript (ES6)** — Vanilla JS with module imports, no frameworks
- **Vite** — Build tool and dev server
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
| `npm run build` | Build for production (outputs to `dist/`) |
| `npm run preview` | Preview production build |

## Browser Support
Works in all modern browsers with ES6 module support (Chrome, Firefox, Safari, Edge). Data is stored per-browser via localStorage — clearing browser data will erase all records. Use the Export/Import feature in Settings to back up or transfer data.

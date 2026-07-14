# Student Attendance Management System

A web-based Student Attendance Management System built with **pure HTML, CSS, and JavaScript** — no frameworks, no libraries, no backend server. All icons are professional inline SVG. All data is stored in the browser using `localStorage`.

## Table of Contents

1. [Overview](#overview)
2. [Features](#features)
3. [Technology Stack](#technology-stack)
4. [Project Structure](#project-structure)
5. [Getting Started](#getting-started)
6. [Usage Guide](#usage-guide)
7. [Data Model](#data-model)
8. [System Design](#system-design)
9. [Limitations](#limitations)
10. [Future Enhancements](#future-enhancements)

---

## Overview

This project automates the process of recording, storing, and managing student attendance records for educational institutions. It replaces manual paper-based attendance registers with a digital system that improves accuracy, saves time, and enables quick report generation.

---

## Features

### Professional SVG Icon System
- All icons are hand-crafted inline SVG (Feather/Lucide-style stroke icons)
- No emojis used anywhere in the application
- Custom gradient logo (graduation cap with academic pillars)
- Icons scale crisply at any size and inherit color from context

### Authentication
- Lecturer login portal with email and password
- Session persistence across page reloads
- Sign-out functionality

### Lecturer Profile
- **Profile picture upload** — Upload a photo (JPG/PNG, max 500KB) stored as base64
- Edit full name, email, and phone number
- Profile displayed in sidebar with photo
- Click sidebar user info to jump to profile page

### Dashboard
- Real-time statistics with SVG icons: total students, present today, absent today, overall rate
- Today's attendance snapshot with progress bar
- Overall distribution donut chart (SVG)
- At-risk student alert banner with warning icon
- Recently registered students with clickable rows

### Student Management
- Register students with name, matric, course, level, email, phone, and photo
- **Student photo upload** — Profile photo for each student
- Edit, delete, search by name/matric/course
- Per-student attendance rate with color-coded progress bars
- **Attendance streaks** — Flame SVG icon badge for 3+ consecutive present days
- Click any row for full profile view
- Export to CSV (includes streak data)

### Student Profile
- Full profile with photo, contact details (with mail/phone/book/ID SVG icons)
- Attendance summary: present, absent, late, total sessions
- Current attendance streak display
- Complete attendance history with notes
- Quick edit access

### Attendance Recording
- Date selector with class filter
- Present/Absent/Late status toggles
- **Per-student notes** — Add notes for each attendance entry
- Bulk actions: Mark All Present / Mark All Absent
- Load and edit previously saved attendance

### Calendar View
- Monthly heatmap grid with color-coded daily rates
- Green (>=75%), amber (50-74%), red (<50%), gray (no data)
- Hover for date and rate details

### Reports
- Filter by student and/or date range
- Summary cards with SVG icons
- Per-student breakdown (clickable rows)
- Detailed attendance log with notes
- Export to CSV / Print

### Analytics
- 14-day attendance trend bar chart (SVG)
- Overall distribution donut chart
- Quick stats panel with key metrics
- Course-level attendance breakdown

### At-Risk Students
- Auto-identifies students below 75% attendance
- Sorted by lowest rate, with student photos
- Alert banner with warning icon
- Sidebar badge with live count

### Class Management
- Create classes with name, code, description
- Edit/delete classes (students unassigned, not deleted)
- Class cards with building icon and student count
- Assign students to classes

### Settings
- Dark / light theme toggle (sun/moon SVG icons)
- Export/import JSON backup
- Clear all data with confirmation
- System info

### Dark Mode
- Full dark theme with dedicated color palette
- Toggle via top bar icon or settings
- Smooth transitions

---

## Technology Stack

| Component     | Technology         |
|---------------|--------------------|
| Structure     | HTML5              |
| Styling       | CSS3 (custom, no frameworks) |
| Logic         | Vanilla JavaScript (no libraries) |
| Icons         | Inline SVG (hand-coded, Feather-style) |
| Charts        | Inline SVG (hand-coded) |
| Images        | Base64 data URLs (stored in localStorage) |
| Data Storage  | Browser `localStorage` |
| Build Tool    | Vite (dev server only) |

---

## Project Structure

```
project/
├── index.html        # HTML entry point
├── style.css         # All styles (including dark mode + SVG icon styles)
├── main.js           # All logic + SVG icon library
├── package.json      # Vite dev server configuration
└── README.md         # This documentation
```

---

## Getting Started

The dev server starts automatically. If running locally:

```bash
npm install
npm run dev
```

### Building for Production

```bash
npm run build
```

---

## Usage Guide

### 1. Login
Enter any email + password (min 4 chars). Session persists until sign out.

### 2. Set Up Lecturer Profile
Click user info in sidebar or go to **My Profile**. Upload a photo, edit name/email/phone. Save.

### 3. Create Classes
Go to **Classes**. Click **Create Class**. Enter name, code, description.

### 4. Register Students
Go to **Students**. Click **Add Student**. Fill in details, upload photo, assign class. Search and click rows for profiles.

### 5. Take Attendance
Go to **Take Attendance**. Filter by class, select date, set statuses, add notes. Save.

### 6. View Calendar
Go to **Calendar** for monthly heatmap of daily attendance rates.

### 7. Generate Reports
Go to **Reports**. Filter, generate, export CSV or print.

### 8. View Analytics
Go to **Analytics** for trend chart, distribution donut, course breakdown.

### 9. Monitor At-Risk Students
Go to **At-Risk Students** for students below 75%. Click rows for profiles.

### 10. Settings
Toggle dark mode, export/import data, clear all data.

---

## Data Model

### Lecturer
| Field   | Type   | Description              |
|---------|--------|--------------------------|
| name    | String | Full name                |
| email   | String | Email address            |
| phone   | String | Phone (optional)         |
| photo   | String | Base64 photo (optional)  |

### Student Record
| Field     | Type   | Description                     |
|-----------|--------|---------------------------------|
| id        | String | Auto-generated (STU-xxx)        |
| name      | String | Full name                       |
| matric    | String | Matriculation number            |
| course    | String | Course of study                 |
| level     | String | Academic level (100-500)        |
| email     | String | Email (optional)                |
| phone     | String | Phone (optional)                |
| photo     | String | Base64 photo (optional)         |
| classId   | String | Reference to class (optional)    |
| createdAt | String | ISO timestamp                   |

### Attendance Record
| Field       | Type   | Description                    |
|-------------|--------|--------------------------------|
| id          | String | Auto-generated (ATT-xxx)       |
| studentId   | String | Reference to student            |
| date        | String | ISO date (YYYY-MM-DD)           |
| status      | String | "present", "absent", or "late"  |
| note        | String | Per-student note                |
| recordedAt  | String | ISO timestamp                   |

### Class Record
| Field       | Type   | Description              |
|-------------|--------|--------------------------|
| id          | String | Auto-generated (CLS-xxx)  |
| name        | String | Class name               |
| code        | String | Class code               |
| description | String | Description (optional)   |
| createdAt   | String | ISO timestamp            |

### Storage Keys
| Key              | Data                        |
|------------------|-----------------------------|
| sams_students    | Array of student records    |
| sams_attendance  | Array of attendance records |
| sams_session     | Current login session       |
| sams_lecturer    | Lecturer profile + photo    |
| sams_theme       | Theme preference            |
| sams_classes     | Array of class records      |

---

## System Design

### Architecture
SPA pattern: `User Action → Event → State Update → localStorage → Re-render`

### SVG Icon System
All icons are defined as inline SVG strings in a central `SVG` object. They use `stroke: currentColor` to inherit color from their parent element, making them theme-aware automatically. No icon fonts, no emoji, no external image files.

### Charts
Hand-coded inline SVG: donut (stroke-dasharray segments), bar chart (rect elements), calendar heatmap (CSS grid + colors).

### Image Handling
Photos converted to base64 via `FileReader`, stored in localStorage. Limited to 500KB.

### Attendance Rate
```
rate = ((present + late * 0.5) / total) * 100
```
- >=75% green, 50-74% amber, <50% red
- At-risk: below 75% with at least 1 session

### Streak
Consecutive present/late days counting back from most recent record. 3+ days shows flame badge.

---

## Limitations

- **Browser storage only** — Use JSON export for backups
- **Client-side auth** — Demo gate, not real security
- **Single-tenant** — No multi-lecturer support
- **Image size** — 500KB limit per photo due to localStorage capacity
- **No external dependencies** — Everything runs in-browser

---

## Future Enhancements

- Real authentication with backend
- Cloud database for cross-device access
- Biometric/RFID attendance
- Email/SMS notifications
- Multi-lecturer with role-based access
- Excel export
- Attendance predictions
- Parent/guardian portal

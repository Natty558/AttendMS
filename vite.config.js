import { defineConfig } from "vite";

export default defineConfig({
  root: ".",
  build: {
    outDir: "dist",
    rollupOptions: {
      input: {
        main: "index.html",
        login: "login.html",
        register: "register.html",
        forgotPassword: "forgot-password.html",
        dashboard: "dashboard.html",
        students: "students.html",
        attendance: "attendance.html",
        classes: "classes.html",
        analytics: "analytics.html",
        calendar: "calendar.html",
        atrisk: "atrisk.html",
        reports: "reports.html",
        profile: "profile.html",
        settings: "settings.html",
      },
    },
  },
});

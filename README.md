```md
# Learning Hub — Online Courses Platform

Learning Hub is a mini Udemy-style application I built as part of **Project Nexus (Frontend ProDev)**.  
It allows users to browse courses, view lessons, and track their learning progress. The goal was to create a clean, responsive, and interactive platform that demonstrates my skills in **React, TypeScript, and professional frontend development**.

---

## Features

- **Course Catalog**: Browse courses by category and rating.  
- **Course Details**: See detailed info about each course, including video/text lessons and duration.  
- **Progress Tracker**: Mark lessons as complete and see percentage progress.  
- **User Dashboard**: View all enrolled courses and progress in one place.  
- **Responsive Design**: Mobile-first, works well on all devices.  
- **Clean Code**: Modular components, clear folder structure, and context-based state management.

---

## Tech Stack

- **Frontend**: React 18 + TypeScript  
- **Routing**: React Router v6  
- **Styling**: TailwindCSS  
- **State Management**: Context API  
- **Mock Backend**: JSON Server (for development)  
- **Video Playback**: React Player  
- **Deployment**: Vercel  

---

## Project Structure

```

src/
┣ components/    # Reusable components: Navbar, CourseCard, ProgressBar, etc.
┣ pages/         # Pages: Home, Catalog, CourseDetails, Dashboard
┣ context/       # App-wide state: ProgressContext
┣ services/      # API calls: axios helper
┣ data/          # Mock courses data
┣ App.tsx        # Root component with routes
┗ main.tsx       # Entry point

````

---

## How It Works

1. Users land on the **Course Catalog** page, browse courses, and select one.  
2. In **Course Details**, they can see all lessons and watch videos directly in the app.  
3. Each lesson can be marked as **complete**, which updates the **progress tracker**.  
4. The **Dashboard** shows overall progress for all enrolled courses.  
5. Progress is persisted in `localStorage` so users can close and reopen the app without losing their progress.  

---

## Getting Started

Clone the repo and install dependencies:

```bash
git clone https://github.com/YOUR-USERNAME/learning-hub.git
cd learning-hub
npm install
````

Run the development server:

```bash
npm run dev
```

Run mock backend (JSON Server):

```bash
npm run server
```

Build for production:

```bash
npm run build
```

---

## Demo & Hosting

* **Hosted App**: \[Your Vercel Link]
* **Demo Video**: \[Link to 5-min demo]
* **Figma Design**: \[Link to Figma file]

---

## Future Improvements

* Add **authentication** and user accounts (Firebase / Supabase)
* Admin panel for course management
* Certificates for completed courses
* Search and filter enhancements

---

## Reflection

Building Learning Hub was an incredible learning experience. I improved my skills in React, TypeScript, Tailwind, and professional project organization. I also practiced building **reusable components**, managing app state, and tracking user interactions with context and `localStorage`. This project is now a full-fledged portfolio piece demonstrating my readiness for professional frontend development.

```


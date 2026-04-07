# Isma Tuition Center - Technical Documentation

This document provides a technical overview of the Isma Tuition Center application. The project is a full-stack web application designed for an educational institution, consisting of a web frontend for users/students and a backend server handling APIs, authentication, and database operations.

## Architecture Overview

The system is built using a modern full-stack JavaScript architecture, separated into two main parts:

1.  **Frontend (Client)**: A React application built with Next.js, utilizing Tailwind CSS for styling and Redux Toolkit for state management.
2.  **Backend (Server)**: A Node.js application built with Express.js, connecting to a MongoDB database (e.g., MongoDB Atlas) using Mongoose for data modeling.

This is a decoupled client-server architecture where the frontend communicates with the backend via RESTful API endpoints.

---

## 1. Frontend Architecture

The frontend is a modern web application designed for responsiveness and performance, utilizing React functional components and hooks.

### Technology Stack
*   **Framework**: [Next.js](https://nextjs.org/) (Version 14 using the App Router `src/app`).
*   **Library**: [React](https://react.dev/) (Version 18).
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/) for utility-first styling.
*   **State Management**: [Redux Toolkit](https://redux-toolkit.js.org/) (`@reduxjs/toolkit` and `react-redux`).
*   **Icons**: `lucide-react` and `react-icons`.
*   **Language**: JavaScript (`.js` / `.jsx`) / Next.js features.

### Project Structure
```text
frontend/
├── public/                 # Static assets (images, fonts, etc.)
├── src/
│   ├── app/                # Next.js App Router root
│   │   ├── dashboard/      # Admin dashboard pages/layout
│   │   ├── login/          # Authentication pages
│   │   ├── students-hub/   # Student hub interface
│   │   ├── globals.css     # Global stylesheets / Tailwind directives
│   │   ├── layout.jsx      # Root application layout
│   │   └── page.jsx        # Landing page
│   ├── assets/             # Images and design assets used in source
│   ├── components/         # Reusable UI components
│   │   ├── CoursesSection.jsx
│   │   ├── Footer.jsx
│   │   ├── Header.jsx
│   │   ├── Hero.jsx
│   │   ├── LifeAtIsma.jsx
│   │   ├── StatsSection.jsx
│   │   ├── SuccessStories.jsx
│   │   └── Testimonials.jsx
│   └── redux/              # Redux store configuration and slices
├── .eslintrc.json          # ESLint configuration
├── next.config.mjs         # Next.js configuration
├── postcss.config.mjs      # PostCSS configuration for Tailwind
├── tailwind.config.js      # Tailwind CSS configuration
└── package.json            # Frontend dependencies and scripts
```

---

## 2. Backend Architecture

The backend serves as a RESTful API provider, handling business logic, database transactions, and user authentication.

### Technology Stack
*   **Runtime**: [Node.js](https://nodejs.org/).
*   **Framework**: [Express.js](https://expressjs.com/).
*   **Database**: [MongoDB](https://www.mongodb.com/) (using [Mongoose](https://mongoosejs.com/) for schema definition).
*   **Security & Auth**: `bcryptjs` (password hashing) and `jsonwebtoken` (JWT for stateless authentication).
*   **Utilities**: `cors` (Cross-Origin Resource Sharing) and `dotenv` (Environment variables).

### Project Structure
```text
backend/
├── models/                 # Mongoose database models (Schemas)
│   ├── Lead.js             # Schema for prospect/lead capture
│   ├── StudyMaterial.js    # Schema for study notes and papers
│   └── User.js             # Schema for users/admins
├── routes/                 # Express route handlers (API endpoints)
│   ├── api.js              # General/Miscellaneous endpoints
│   ├── auth.js             # Authentication routes (login, register)
│   ├── materials.js        # Study materials CRUD operations
│   └── users.js            # User management routes
├── .env                    # Environment variables (e.g., MONGO_URI, JWT_SECRET, PORT)
├── server.js               # Application entry point and server setup
└── package.json            # Backend dependencies and scripts
```

### Core API Operations
The backend (`server.js`) configures routes under the `/api` prefix:
*   **/api/**: General API functions and health checks.
*   **/api/auth/**: Handled by `routes/auth.js`. Deals with user authentication, issuing JWTs.
*   **/api/materials/**: Handled by `routes/materials.js`. Provides interaction with the `StudyMaterial` model (fetching, creating, uploading materials).
*   **/api/users/**: Handled by `routes/users.js`. Provides interaction with the `User` model.

---

## Environment Configuration

To run the application, both environments require appropriate configuration.

### Backend (`backend/.env`)
Required environment variables:
*   `PORT`: The port for the Express server (defaulting to 5000).
*   `MONGO_URI`: The connection string for the MongoDB instance.
*   `JWT_SECRET`: A secret key used to sign JSON Web Tokens for authentication.

### Frontend
Depending on the deployment strategy, the frontend may need an environment variable (like `NEXT_PUBLIC_API_URL`) to know where the backend is hosted, though proxying or hardcoding is occasionally utilized during development.

---

## 3. Getting Started (Development Setup)

### Prerequisites
*   Node.js (v18 or higher recommended)
*   npm (Node Package Manager)
*   MongoDB instance (Local or Atlas)

### Running the Backend

1.  Navigate to the backend directory:
    ```bash
    cd backend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Ensure `.env` is configured correctly with `MONGO_URI`.
4.  Start the development server:
    ```bash
    npm run dev
    ```
    *(The backend will run on `http://localhost:5000` by default)*

### Running the Frontend

1.  Navigate to the frontend directory:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the Next.js development server:
    ```bash
    npm run dev
    ```
    *(The frontend will be accessible at `http://localhost:3000`)*

## Features Summary
*   **Landing Page**: Showcases Hero section, courses, statistics, life at Isma, success stories, and testimonials.
*   **Student Hub (`/students-hub`)**: A dedicated interface for students to access study materials and resources structured by class/subject.
*   **Admin Dashboard (`/dashboard`)**: A secure interface requiring authentication for administrators to manage study materials (CRUD), view leads, and oversee the platform.
*   **Study Materials Management**: Backend APIs and models handle the uploading, storage metadata, and retrieval of educational materials.

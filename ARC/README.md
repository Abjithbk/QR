# ARC (Auto-Real-time Capture)

Welcome to the ARC project! This application is designed to facilitate real-time photo sharing and capture.

## Overview
ARC (Auto-Real-time Capture) enables users to automatically capture and share moments in real-time, leveraging a modern tech stack to provide a seamless and responsive experience. It is designed as an offline-capable, real-time application where guests can effortlessly share photos at events.

## Tech Stack
- **Frontend Framework:** [React 19](https://react.dev/) via [Vite](https://vitejs.dev/) for an ultra-fast development experience and optimized production builds.
- **Styling:** [Tailwind CSS 4](https://tailwindcss.com/) using PostCSS for rapid, utility-first UI development.
- **Backend & Database:** [Firebase](https://firebase.google.com/) ecosystem:
  - **Firestore:** For real-time database syncing across connected clients.
  - **Firebase Storage:** For secure image hosting.
  - **Firebase Auth:** For user authentication and security rules.
- **Icons:** [Lucide React](https://lucide.dev/) for beautiful, consistent SVG iconography.
- **Utilities:** `qrcode.react` for generating dynamic event access QR codes, and `browser-image-compression` for optimizing images before upload.

## Basic Workflow
1. **Event Creation:** A host logs in and creates a new event from their Dashboard. This generates a unique Event ID in Firestore.
2. **Sharing:** The application automatically generates a QR Code linked to the live Event URL (`/event/:eventId`).
3. **Guest Access:** Guests simply scan the QR Code using their smartphone cameras—no app downloads or accounts are required.
4. **Capture & Upload:** Guests take pictures or select existing files. The images are compressed in the browser and uploaded directly to Firebase Storage.
5. **Real-Time Sync:** Firestore synchronizes the new image data (URLs and metadata) to all devices currently viewing the event, updating the live gallery instantly.

## Environment Variables

This project requires Firebase configuration to function properly. 

1. Create a new Firebase Project in the [Firebase Console](https://console.firebase.google.com/).
2. Register a web application within the project.
3. Enable **Firestore** and **Firebase Storage** in your console.
4. Copy your configuration values and add them to the `.env` file at the root of the project.

A `.env.example` file is included in this repository. Ensure your `.env` file looks like this:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

## Getting Started

Follow these instructions to run the project locally.

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up Environment Variables:**
   If you haven't already, copy the `.env.example` file to create a `.env` file and populate it with your Firebase keys.
   ```bash
   cp .env.example .env
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Build for Production:**
   ```bash
   npm run build
   ```

## Available Scripts
- `npm run dev` - Starts the Vite development server with Hot Module Replacement (HMR).
- `npm run build` - Builds the application for production into the `dist` folder.
- `npm run preview` - Locally preview the production build.
- `npm run lint` - Runs ESLint to check for code quality issues.

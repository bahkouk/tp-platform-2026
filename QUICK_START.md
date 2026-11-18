# TP Platform - Quick Start Guide

## Project Overview

This is a Next.js 14 project with App Router featuring a 2030 futuristic dark UI with glowing neon accents.

### Features
- ✅ Google Authentication (NextAuth.js)
- ✅ 2030 Futuristic Dark UI with Neon Glow Effects
- ✅ Admin Dashboard for uploading TP PDF files
- ✅ Student/User View for browsing, searching, and downloading TP PDF files
- ✅ App Router (no duplicate pages/folders between pages/ and app/)
- ✅ Firebase Backend (Firestore + Storage)

## Setup Instructions

### 1. Install Dependencies
```bash
cd tp-platform
npm install
```

### 2. Configure Environment Variables
```bash
cp .env.example .env.local
```

Edit `.env.local` with your credentials:
- Google OAuth Client ID & Secret
- Firebase API Key, Auth Domain, Project ID, Storage Bucket
- NEXTAUTH_SECRET (generate a random string)

### 3. Firebase Setup

#### Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable Authentication → Google Sign-in
4. Create a Storage bucket
5. Copy configuration to `.env.local`

#### Firebase Security Rules
```javascript
// Firestore Rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /documents/{document} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null;
    }
  }
}

// Storage Rules
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /uploads/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

### 4. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new OAuth 2.0 Client ID
3. Configure OAuth consent screen
4. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
5. Copy Client ID and Secret to `.env.local`

### 5. Run Development Server
```bash
npm run dev
```

Navigate to http://localhost:3000

## Project Structure

```
tp-platform/
├── src/
│   ├── app/                    # App Router (Primary pages)
│   │   ├── api/               # API routes
│   │   │   ├── auth/          # NextAuth routes
│   │   │   ├── documents/     # Document CRUD APIs
│   │   │   └── admin/         # Admin stats API
│   │   ├── admin/             # Admin pages (dashboard, upload, manage)
│   │   ├── docs/              # Document library (student view)
│   │   ├── login/             # Login page
│   │   ├── profile/           # User profile page
│   │   ├── page.tsx           # Home page
│   │   ├── layout.tsx         # Root layout
│   │   └── globals.css        # Global styles
│   ├── components/
│   │   ├── ui/                # Reusable UI components
│   │   ├── auth/              # Authentication components
│   │   ├── documents/         # Document components
│   │   ├── dashboard/         # Dashboard components
│   │   └── navigation/        # Navigation components
│   ├── hooks/                 # React hooks
│   └── lib/                   # Libraries and utilities
├── public/                    # Static assets
├── .env.local                # Environment variables
├── next.config.js            # Next.js config
├── tailwind.config.js        # Tailwind CSS config
└── package.json              # Dependencies
```

## Architecture

### Pages (App Router Only)
- `/` - Landing page with hero section and features
- `/docs` - Document library for students
- `/login` - Authentication page
- `/profile` - User profile
- `/admin/dashboard` - Admin statistics
- `/admin/upload` - Document upload form
- `/admin/manage` - Document management

### APIs
- `/api/auth/[...nextauth]` - Google OAuth authentication
- `/api/documents` - Document CRUD operations
- `/api/documents/[id]` - Single document operations
- `/api/admin/stats` - Admin statistics

### Components
- **UI Components**: NeonButton, GlassCard, AnimatedBackground, Dialog, Modal
- **Document Components**: DocumentGrid, SearchFilterBar, PDFViewerModal
- **Dashboard Components**: UploadForm
- **Navigation**: Header, Footer
- **Auth**: UserMenu

## Styling

The project uses a 2030 futuristic theme with:
- Dark background with subtle gradients
- Neon accent colors (cyan, blue, purple, pink)
- Glassmorphism effects
- Smooth animations and transitions
- Glow effects on interactive elements

## Deployment

Deploy to Vercel:
1. Push to GitHub
2. Import to Vercel
3. Set environment variables in Vercel dashboard
4. Configure Firebase for production
5. Deploy!

## Scripts

```bash
npm run dev        # Development server
npm run build      # Production build
npm start          # Start production server
npm run lint       # ESLint
npm run format     # Prettier formatting
```

## License

MIT
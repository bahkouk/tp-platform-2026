# TP Platform - 2030 Futuristic TP Document Management

A sleek, neon-accented Next.js application for uploading, browsing, and downloading TP (Tugas Pendek) documents.

## Features

- 🌌 **2030 Futuristic Dark UI** with glowing neon accents
- 🔐 **Google Authentication** using NextAuth.js
- 💾 **Document Upload System** for admins
- 📚 **Document Library** for students to browse and download
- 🔍 **Smart Search & Filtering**
- 📊 **Admin Dashboard** for managing documents
- 🎨 **Glass Morphism UI** with smooth animations

## Tech Stack

- **Next.js 14** with App Router
- **TypeScript**
- **Tailwind CSS** with custom 2030 neon theme
- **NextAuth.js** for authentication
- **Firebase** (Firestore + Storage)
- **Framer Motion** for animations

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   ```

4. Configure Firebase:
   - Create a Firebase project
   - Enable Authentication (Google)
   - Create a Cloud Storage bucket
   - Update `.env.local` with your Firebase configuration

5. Run the development server:
   ```bash
   npm run dev
   ```

## Project Structure

```
src/
├── app/                    # App Router pages
│   ├── api/               # API routes
│   ├── admin/             # Admin pages
│   ├── docs/              # Document library
│   ├── login/             # Login page
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── ui/                # UI components
│   ├── auth/              # Authentication components
│   ├── documents/         # Document components
│   ├── dashboard/       # Dashboard components
│   └── navigation/      # Navigation components
├── hooks/                 # React hooks
└── lib/                   # Utilities and libraries

types/                      # TypeScript types
```

## Authentication

The project uses NextAuth.js with Google OAuth. To set up:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new OAuth 2.0 Client ID
3. Add the authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
4. Copy the Client ID and Secret to `.env.local`

## Firebase Setup

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Authentication with Google
3. Enable Cloud Storage
4. Configure security rules for your storage bucket
5. Copy the Firebase configuration to `.env.local`

## Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXTAUTH_URL` | Your app URL |
| `NEXTAUTH_SECRET` | Secret for JWT tokens |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | Google OAuth Client ID |
| `NEXT_PUBLIC_GOOGLE_CLIENT_SECRET` | Google OAuth Client Secret |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase API Key |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Firebase Auth Domain |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Firebase Project ID |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Firebase Storage Bucket |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Firebase Messaging Sender ID |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Firebase App ID |

## Deploying

This project can be deployed to Vercel with Firebase as the backend:

1. Connect your repository to Vercel
2. Set environment variables in Vercel dashboard
3. Configure Firebase for production
4. Deploy!

## License

MIT
<div align="center">
  <h1>Learning Management System (LMS)</h1>
  
  <div>
    <img src="https://img.shields.io/badge/-Next.JS-black?style=for-the-badge&logoColor=white&logo=nextdotjs&color=black" alt="next.js" />
    <img src="https://img.shields.io/badge/-Vapi-black?style=for-the-badge&logoColor=white&logo=vapi.com&color=green" alt="vapi" />
    <img src="https://img.shields.io/badge/-Tailwind-00BCFF?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="tailwind" />
  </div>
  <br />
  
  <div align="center">
    <a href="https://saas-app-jade-gamma.vercel.app/" target="_blank">
      <img src="https://img.shields.io/badge/LIVE%20DEMO-00C7B7?style=for-the-badge&logo=vercel&logoColor=white" alt="Live Demo" />
    </a>
  </div>
</div>

## 🔗 [Live Demo](https://saas-app-jade-gamma.vercel.app/)

Experience the application live at: **[https://saas-app-jade-gamma.vercel.app/](https://saas-app-jade-gamma.vercel.app/)**

## 📋 <a name="table">Table of Contents</a>

1. 🤖 [Introduction](#introduction)
2. ⚙️ [Tech Stack](#tech-stack)
3. 🔋 [Features](#features)
4. 🤸 [Quick Start](#quick-start)
5. 🔗 [Assets](#links)
6. 🚀 [More](#more)

## 🚀 Getting Started

## <a name="introduction">🤖 Introduction</a>

A comprehensive Learning Management System (LMS) featuring user authentication, subscriptions, and payments. This platform enables real-time teaching with AI vocal agents, providing seamless and interactive learning experiences.

## <a name="tech-stack">⚙️ Tech Stack</a>

- **Clerk**: A unified platform for authentication, user management, and billing with embeddable UI components and flexible APIs.

* **Next.js**: A powerful React framework for building fast, scalable web applications with server-side rendering and API routes.

* **Sentry**: Error tracking and performance monitoring tool for real-time alerts and insights.

* **shadcn/ui**: A customizable component library built on Radix UI and Tailwind CSS.

- **Supabase**: Open-source backend-as-a-service platform with real-time database, authentication, and storage.

* **Tailwind CSS**: Utility-first CSS framework for rapid UI development.

* **TypeScript**: JavaScript with static typing for better tooling and error detection.

- **Vapi**: Voice AI platform for creating conversational voice agents with speech-to-text and text-to-speech capabilities.

* **Zod**: TypeScript-first schema validation library for data integrity.

## <a name="features">🔋 Features</a>

👉 **AI Voice Agents**: Take tutoring sessions with voiced AIs specializing in the topics you want to get better at.

👉 **Authentication**: Secure user sign-up and sign-in with Clerk; Google authentication and many more.

👉 **Billing & Subscriptions**: Easily manage plans, upgrades, and payment details.

👉 **Bookmarks and Session History**: Let users organise their learning by bookmarking tutors and accessing previous sessions.

👉 **Code Reusability**: Leverage reusable components and a modular codebase for efficient development.

👉 **Create a Tutor**: Create your own AI tutors, choosing a subject, topic, and style of conversation.

👉 **Cross-Device Compatibility**: Fully responsive design that works seamlessly across all devices.

👉 **Database Integration**: Uses Supabase for real-time data handling and storage needs.

👉 **Modern UI/UX**: Clean, responsive design built with Tailwind CSS and shadcn/ui for a sleek user experience.

👉 **Scalable Tech Stack**: Built with Next.js for a fast, production-ready web application that scales seamlessly.

👉 **Search Functionality**: Find tutors quickly with robust filters and search bar.

and many more, including code architecture and reusability.

## <a name="quick-start">🤸 Quick Start</a>

Follow these steps to set up the project locally on your machine.

**Prerequisites**

Make sure you have the following installed on your machine:

- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/en)
- [npm](https://www.npmjs.com/) (Node Package Manager)

**Cloning the Repository**

```bash
git clone https://github.com/tarak6984/LMS-SaaS-app.git
cd LMS-SaaS-app/saas-app
```

**Installation**

Install the project dependencies using npm:

```bash
npm install
```

**Set Up Environment Variables**

Create a new file named `.env.local` in the root of your project and add the following content:

```env
# Vapi - AI Voice API (optional for voice features)
NEXT_PUBLIC_VAPI_WEB_TOKEN=your_vapi_web_token_here

# Clerk - Authentication (required)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key_here
CLERK_SECRET_KEY=your_clerk_secret_key_here
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/

# Supabase - Database (required)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Development
NODE_ENV=development
```

You can obtain these credentials by signing up on:
- [Supabase](https://supabase.com/dashboard) - For database
- [Clerk](https://clerk.com) - For authentication
- [Vapi](https://vapi.ai) - For AI voice features (optional)

**Set Up Supabase Database**

After creating your Supabase project, run the following SQL in your Supabase SQL Editor to create the required tables:

```sql
-- Create companions table
CREATE TABLE companions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  subject TEXT NOT NULL,
  topic TEXT NOT NULL,
  voice TEXT NOT NULL,
  style TEXT NOT NULL,
  duration INTEGER NOT NULL,
  author TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create session_history table
CREATE TABLE session_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  companion_id UUID REFERENCES companions(id),
  user_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create bookmarks table
CREATE TABLE bookmarks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  companion_id UUID REFERENCES companions(id),
  user_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(companion_id, user_id)
);

-- Enable Row Level Security
ALTER TABLE companions ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Enable read access for all users" ON companions FOR SELECT USING (true);
CREATE POLICY "Enable insert for authenticated users only" ON companions FOR INSERT WITH CHECK (auth.uid()::text = author);
CREATE POLICY "Enable update for users based on author" ON companions FOR UPDATE USING (auth.uid()::text = author);

CREATE POLICY "Enable read access for own records" ON session_history FOR SELECT USING (auth.uid()::text = user_id);
CREATE POLICY "Enable insert for authenticated users only" ON session_history FOR INSERT WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Enable read access for own bookmarks" ON bookmarks FOR SELECT USING (auth.uid()::text = user_id);
CREATE POLICY "Enable insert for authenticated users only" ON bookmarks FOR INSERT WITH CHECK (auth.uid()::text = user_id);
CREATE POLICY "Enable delete for own bookmarks" ON bookmarks FOR DELETE USING (auth.uid()::text = user_id);
```

**Running the Project**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the project.

## <a name="links">🔗 Links & Resources</a>

- **Live Demo**: [https://saas-app-jade-gamma.vercel.app/](https://saas-app-jade-gamma.vercel.app/)
- **GitHub Repository**: [https://github.com/tarak6984/LMS-SaaS-app](https://github.com/tarak6984/LMS-SaaS-app)
- **Assets**: All assets and snippets can be found in the project's public directory

## 📝 Additional Documentation

For detailed setup instructions, see [SETUP.md](SETUP.md)

---

Built with ❤️ using Next.js, Clerk, Supabase, and Vapi

# Learning Management System - Setup Guide

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Setup
Copy `.env.example` to `.env.local` and fill in your credentials:

```bash
cp .env.example .env.local
```

### 3. Required Services

#### Clerk (Authentication)
1. Go to [Clerk Dashboard](https://dashboard.clerk.com)
2. Create a new application
3. Get your publishable key and secret key
4. Update `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY` in `.env.local`

#### Supabase (Database)
1. Go to [Supabase](https://supabase.com)
2. Create a new project
3. Go to Settings > API
4. Get your project URL and anon key
5. Update `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in `.env.local`

#### Database Schema
Run this SQL in your Supabase SQL editor:

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

-- Basic policies (you may want to customize these)
CREATE POLICY "Enable read access for all users" ON companions FOR SELECT USING (true);
CREATE POLICY "Enable insert for authenticated users only" ON companions FOR INSERT WITH CHECK (auth.uid()::text = author);
CREATE POLICY "Enable update for users based on author" ON companions FOR UPDATE USING (auth.uid()::text = author);

CREATE POLICY "Enable read access for own records" ON session_history FOR SELECT USING (auth.uid()::text = user_id);
CREATE POLICY "Enable insert for authenticated users only" ON session_history FOR INSERT WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Enable read access for own bookmarks" ON bookmarks FOR SELECT USING (auth.uid()::text = user_id);
CREATE POLICY "Enable insert for authenticated users only" ON bookmarks FOR INSERT WITH CHECK (auth.uid()::text = user_id);
CREATE POLICY "Enable delete for own bookmarks" ON bookmarks FOR DELETE USING (auth.uid()::text = user_id);
```

#### Vapi (Optional - for AI Voice features)
1. Go to [Vapi](https://vapi.ai)
2. Get your web token
3. Update `NEXT_PUBLIC_VAPI_WEB_TOKEN` in `.env.local`

#### Sentry (Optional - for error tracking)
1. Go to [Sentry](https://sentry.io)
2. Create a new project
3. Get your auth token
4. Update `SENTRY_AUTH_TOKEN` in `.env.local`

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🔧 Development Notes

- The project uses placeholder environment variables for development
- You'll need to set up the actual services for full functionality
- The AI voice features require a valid Vapi token
- Authentication requires valid Clerk credentials

## 📚 Features Implemented

- ✅ Authentication with Clerk
- ✅ Companion creation and management
- ✅ Search and filtering
- ✅ User dashboard with session history
- ✅ Bookmarking system
- ✅ AI voice integration (with Vapi)
- ✅ Subscription framework
- ✅ Responsive design

## 🚀 Next Steps

1. Set up required services (Clerk, Supabase)
2. Configure environment variables
3. Test the application
4. Customize as needed
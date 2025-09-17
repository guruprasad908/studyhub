# Environment Variables for Vercel Deployment

To fix the deployment error, you need to add environment variables in your Vercel dashboard:

## Option 1: Add Environment Variables in Vercel (Recommended)

1. Go to your Vercel dashboard
2. Select your project
3. Go to "Settings" → "Environment Variables"
4. Add these variables:

```
NEXT_PUBLIC_SUPABASE_URL=https://placeholder.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=placeholder_anon_key_for_demo
```

This will enable demo mode for your deployment.

## Option 2: Real Supabase Setup (Full Features)

If you want full database functionality:

1. Go to [supabase.com](https://supabase.com) and create a free account
2. Create a new project
3. Go to Settings → API
4. Copy your URL and anon key
5. Add them to Vercel environment variables:

```
NEXT_PUBLIC_SUPABASE_URL=your_actual_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_actual_supabase_anon_key
```

## Quick Fix for Current Deployment

Add these exact values to your Vercel environment variables:

```
Variable Name: NEXT_PUBLIC_SUPABASE_URL
Value: https://placeholder.supabase.co

Variable Name: NEXT_PUBLIC_SUPABASE_ANON_KEY  
Value: placeholder_anon_key_for_demo
```

After adding these, redeploy your project and it will work in demo mode!
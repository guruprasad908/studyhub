# 🔧 StudyHub Troubleshooting Guide

## Common Issues & Solutions

### ❌ Internal Server Error (500)

**Symptoms:** 
- "Internal Server Error" message in browser
- Console shows ENOENT errors for manifest files

**Solution:**
```bash
# Stop the development server
taskkill /f /im node.exe  # Windows
# or ctrl+c in terminal

# Clear Next.js cache
Remove-Item -Path .next -Recurse -Force  # Windows
# or rm -rf .next  # macOS/Linux

# Restart development server
npm run dev
```

### ❌ Supabase Connection Issues

**Symptoms:**
- Authentication doesn't work
- Data doesn't save/load
- Console warnings about missing env variables

**Solution:**
1. Create a Supabase account at [supabase.com](https://supabase.com)
2. Create a new project
3. Go to Project Settings > API
4. Update `.env.local` with your real credentials:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_actual_anon_key
```
5. Run the database setup SQL from `database/complete_setup.sql`

### ❌ Build Errors

**Symptoms:**
- TypeScript compilation errors
- Module resolution issues

**Solutions:**
```bash
# Clear node modules and reinstall
Remove-Item -Path node_modules -Recurse -Force
Remove-Item -Path package-lock.json -Force
npm install

# Clear all caches
npm run dev  # Will rebuild automatically
```

### ❌ Chart/Visualization Issues

**Symptoms:**
- Charts not displaying
- "No data to show" messages

**Cause:** This is normal if:
- No Supabase connection (demo mode)
- No study data logged yet

**Solution:**
- Set up Supabase database
- Add some study goals in roadmap
- Log some practice sessions

### ❌ Authentication Redirects

**Symptoms:**
- Stuck on auth page
- Redirect loops

**Solution:**
```bash
# Clear browser data for localhost:3000
# Or use incognito/private browsing mode
```

### ❌ Performance Issues

**Symptoms:**
- Slow page loads
- High memory usage

**Solution:**
```bash
# Use standard webpack instead of turbopack
npm run dev  # Default uses webpack

# If you want to try turbopack:
npm run dev:turbo
```

## Environment Setup Checklist

- [ ] Node.js 18+ installed
- [ ] Dependencies installed (`npm install`)
- [ ] `.env.local` file exists with Supabase credentials
- [ ] Supabase project created
- [ ] Database setup SQL executed
- [ ] Development server running (`npm run dev`)

## Working Without Database

The app will run in "demo mode" without a Supabase connection:
- ✅ UI works perfectly
- ✅ Navigation functions
- ✅ Responsive design displays
- ❌ Data doesn't persist
- ❌ Authentication is disabled

This is useful for:
- UI/UX testing
- Development without backend
- Demonstrating the interface

## Getting Help

1. Check browser console for detailed error messages
2. Check terminal output for server-side errors
3. Verify all files from the project structure exist
4. Ensure environment variables are properly set

## Development vs Production

**Development Mode:**
- Hot reload enabled
- Detailed error messages
- Source maps included
- Works without database (demo mode)

**Production Mode:**
- Optimized build
- Requires valid Supabase connection
- Error boundaries handle issues gracefully
- Better performance

---

**Most issues are resolved by clearing cache and restarting the dev server! 🚀**
# StudyHub Deployment Guide

This guide will help you deploy the updated version of StudyHub to a production environment.

## Prerequisites

1. **Node.js** (version 18 or higher)
2. **npm** or **yarn** package manager
3. **Git** for version control
4. A hosting platform account (Vercel, Netlify, or similar)

## Local Build Verification

Before deploying, verify the build works locally:

```bash
# Install dependencies
npm install

# Build the application
npm run build

# Start the production server locally
npm start
```

## Environment Variables

Make sure your `.env.local` file contains all required environment variables:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Deployment Options

### Option 1: Vercel (Recommended)

1. Push your code to a GitHub repository
2. Sign up/in to [Vercel](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. Configure the project:
   - Framework: Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next`
6. Add environment variables in the Vercel dashboard
7. Deploy!

### Option 2: Netlify

1. Push your code to a GitHub repository
2. Sign up/in to [Netlify](https://netlify.com)
3. Click "New site from Git"
4. Connect to your GitHub repository
5. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `.next`
6. Add environment variables in the Netlify dashboard
7. Deploy!

### Option 3: Manual Deployment

For deploying to your own server:

```bash
# Clone the repository
git clone <your-repo-url>
cd prep-hub

# Install dependencies
npm install

# Build the application
npm run build

# Start the production server
npm start
```

## Post-Deployment Checklist

1. [ ] Verify the application loads correctly
2. [ ] Test user authentication (sign up/in)
3. [ ] Test all major features (dashboard, roadmap, today's tasks)
4. [ ] Verify Supabase integration works
5. [ ] Check that AI features function properly
6. [ ] Test on different devices/browsers

## Troubleshooting

### Common Issues

1. **Environment Variables Not Set**
   - Ensure all required environment variables are configured in your deployment platform

2. **Build Failures**
   - Check Node.js version compatibility
   - Verify all dependencies are correctly installed

3. **Runtime Errors**
   - Check browser console for JavaScript errors
   - Check server logs for backend issues

### Support

If you encounter issues during deployment, check:
- The [Next.js deployment documentation](https://nextjs.org/docs/deployment)
- Your deployment platform's documentation
- The application logs for specific error messages

## Performance Optimization

Consider these optimizations for production:

1. **Image Optimization**: Use Next.js Image component for all images
2. **Code Splitting**: Leverage dynamic imports for heavy components
3. **Caching**: Configure proper caching headers
4. **CDN**: Use a CDN for static assets

## Monitoring

Set up monitoring for your production application:
- Error tracking (Sentry, Rollbar)
- Performance monitoring (Lighthouse, Web Vitals)
- Uptime monitoring (UptimeRobot, Pingdom)

---

Happy deploying! Your StudyHub application is ready to help students worldwide achieve their learning goals.
#!/bin/bash

# StudyHub Deployment Script

echo "🚀 Starting StudyHub Deployment Process"

# Check if we're on Windows or Unix-like system
if [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "win32" ]]; then
  # Windows with Git Bash
  echo "💻 Windows detected"
  IS_WINDOWS=1
else
  # Unix-like system
  echo "🐧 Unix-like system detected"
  IS_WINDOWS=0
fi

# Install dependencies
echo "📦 Installing dependencies..."
if [ $IS_WINDOWS -eq 1 ]; then
  npm install
else
  npm install
fi

# Check if build succeeds
echo "🏗️ Building the application..."
if npm run build; then
  echo "✅ Build successful!"
else
  echo "❌ Build failed! Check the error messages above."
  exit 1
fi

echo "✅ Deployment preparation complete!"
echo ""
echo "Next steps:"
echo "1. If deploying to Vercel:"
echo "   - Push to GitHub and connect to Vercel"
echo "   - Set environment variables in Vercel dashboard"
echo ""
echo "2. If deploying manually:"
echo "   - Run 'npm start' to start the production server"
echo "   - Make sure environment variables are set"
echo ""
echo "📄 Check DEPLOYMENT_GUIDE.md for detailed instructions"
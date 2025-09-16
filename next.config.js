// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  // External packages for server components
  serverExternalPackages: ['@supabase/supabase-js'],
  
  // Experimental features
  experimental: {
    // Enable optimizations for server components
  },
  
  // Compiler optimizations
  compiler: {
    removeConsole: false, // keep console.log for debugging
  },
  
  reactStrictMode: true,
  
  // Output file tracing configuration
  outputFileTracingRoot: __dirname,
}

module.exports = nextConfig

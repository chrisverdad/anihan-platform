# AniHan Platform - Vercel Deployment Guide

## 🚀 Deployment to Vercel

This guide will help you deploy the AniHan Platform to Vercel.com.

### Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **Git Repository**: Your code should be in a Git repository (GitHub, GitLab, or Bitbucket)
3. **Node.js**: Version 18.x or higher

### Deployment Steps

#### Method 1: Deploy via Vercel Dashboard (Recommended)

1. **Connect Repository**:
   - Go to [vercel.com/dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your Git repository

2. **Configure Project**:
   - **Framework Preset**: Vite
   - **Root Directory**: `./` (root)
   - **Build Command**: `npm run build` (automatically detected from vercel.json)
   - **Output Directory**: `dist` (automatically detected from vercel.json)
   - **Install Command**: `npm install` (automatically detected from vercel.json)

3. **Environment Variables** (Optional):
   ```
   VITE_API_BASE_URL=https://your-api-domain.com/api/v1
   VITE_APP_TITLE=AniHan Platform
   VITE_APP_DESCRIPTION=A Digital Platform for Repurposing Agricultural Food Waste in Butuan City
   ```

4. **Deploy**:
   - Click "Deploy"
   - Wait for the build to complete
   - Your app will be available at `https://your-project-name.vercel.app`

#### Method 2: Deploy via Vercel CLI

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   vercel --prod
   ```

### Configuration Files

The following files are configured for Vercel deployment:

- **`vercel.json`**: Modern Vercel configuration using `rewrites` and `headers` (compatible with latest Vercel requirements)
- **`vite.config.ts`**: Build configuration optimized for production
- **`package.json`**: Updated with deployment scripts

### Features Included

✅ **SPA Routing**: All routes redirect to `index.html` for client-side routing
✅ **Asset Caching**: Static assets cached for 1 year with immutable headers
✅ **Security Headers**: XSS protection, content type options, frame options
✅ **Performance**: Optimized chunk splitting and compression
✅ **Environment Variables**: Support for production environment variables

### Post-Deployment

1. **Test Your Application**:
   - Verify all routes work correctly
   - Test image uploads and displays
   - Check responsive design on mobile devices
   - Test user authentication flows

2. **Custom Domain** (Optional):
   - Go to Project Settings → Domains
   - Add your custom domain
   - Configure DNS records as instructed

3. **Analytics** (Optional):
   - Enable Vercel Analytics in Project Settings
   - Monitor performance and user behavior

### Troubleshooting

**Configuration Issues**:
- The `vercel.json` uses `rewrites` and `headers` instead of `routes` for compatibility
- SPA routing is handled by the `rewrites` property
- Asset caching is handled by the `/assets/(.*)` pattern
- Security headers are applied to all routes

**Routing Issues**:
- The `vercel.json` handles SPA routing automatically
- All routes should redirect to `index.html`

**Environment Variables**:
- Use `VITE_` prefix for client-side variables
- Set in Vercel dashboard under Project Settings → Environment Variables

**Performance**:
- Assets are automatically optimized and cached
- Use Vercel Analytics to monitor Core Web Vitals

### Demo Accounts

The application includes demo accounts for testing:

- **Admin**: `admin@anihan.com` / `admin123`
- **Vendor**: `vendor@anihan.com` / `vendor123`
- **User**: `user@anihan.com` / `user123`

### Support

For deployment issues:
1. Check Vercel build logs
2. Verify all files are committed to Git
3. Ensure `vercel.json` is in the root directory
4. Contact Vercel support if needed

---

**Happy Deploying! 🎉**

Your AniHan Platform will be live and accessible to users worldwide.

# Vercel Deployment Guide

## Prerequisites

1. Sign up for a [Vercel account](https://vercel.com/signup) (free tier available)
2. Install [Vercel CLI](https://vercel.com/docs/cli) (optional, for CLI deployment)

## Deployment Steps

### Option 1: Deploy via Vercel Dashboard (Recommended)

1. **Import your repository:**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "Add New Project"
   - Import your `soccerstats` repository from GitHub/GitLab/Bitbucket

2. **Configure environment variables:**
   - In project settings, go to "Environment Variables"
   - Add: `NEXT_PUBLIC_API_URL` = `https://your-fly-app.fly.dev/api`
   - Replace `your-fly-app` with your actual Fly.io app name

3. **Deploy:**
   - Vercel will auto-detect Next.js and deploy
   - Your site will be live at `https://your-project.vercel.app`

### Option 2: Deploy via CLI

1. **Login:**
   ```bash
   vercel login
   ```

2. **Deploy:**
   ```bash
   vercel
   ```

3. **Set environment variable:**
   ```bash
   vercel env add NEXT_PUBLIC_API_URL
   # Enter: https://your-fly-app.fly.dev/api
   ```

4. **Redeploy to apply env vars:**
   ```bash
   vercel --prod
   ```

## Environment Variables

- `NEXT_PUBLIC_API_URL`: Your Fly.io backend URL (e.g., `https://soccerstats-api.fly.dev/api`)

## Important Notes

- Vercel's free tier includes:
  - Unlimited deployments
  - 100GB bandwidth per month
  - Automatic HTTPS
  - Global CDN
- The frontend will call your Fly.io backend using the `NEXT_PUBLIC_API_URL` environment variable
- Make sure your Fly.io backend is deployed first and CORS is configured (already done in `main.py`)

## Troubleshooting

- Check build logs in Vercel dashboard
- Verify environment variables are set correctly
- Ensure your Fly.io backend is running and accessible


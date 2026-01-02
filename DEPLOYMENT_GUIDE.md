# UniVerse Deployment Guide

## Prerequisites
- GitHub account
- Vercel account (vercel.com)
- Render account (render.com)
- MongoDB Atlas account (mongodb.com/cloud/atlas)

---

## Step 1: Setup MongoDB Atlas (Database)

1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a **FREE** M0 cluster
3. Click **"Connect"** → **"Connect your application"**
4. Copy the connection string:
   ```
   mongodb+srv://username:<password>@cluster.mongodb.net/universe
   ```
5. Replace `<password>` with your actual password
6. Keep this connection string for later

---

## Step 2: Push Code to GitHub

```bash
cd M:\Project-3200\universe-app
git init
git add .
git commit -m "Initial commit - UniVerse Application"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/universe-app.git
git push -u origin main
```

---

## Step 3: Deploy Backend on Render

### 3.1 Create Web Service
1. Go to [dashboard.render.com](https://dashboard.render.com)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure:
   - **Name**: `universe-backend`
   - **Region**: Choose closest to your users
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: `Free`

### 3.2 Add Environment Variables
Click **"Environment"** tab and add:

| Key | Value |
|-----|-------|
| `MONGODB_URI` | Your MongoDB Atlas connection string |
| `JWT_SECRET` | Generate random string (e.g., `openssl rand -base64 32`) |
| `GEMINI_API_KEY` | Your Google Gemini API key |
| `NODE_ENV` | `production` |
| `FRONTEND_URL` | `https://your-app.vercel.app` (add after Vercel deploy) |

### 3.3 Deploy
1. Click **"Create Web Service"**
2. Wait for deployment (5-10 minutes)
3. Copy your backend URL: `https://universe-backend-xxxx.onrender.com`

**⚠️ Important**: Free tier spins down after inactivity. First request may take 50 seconds.

---

## Step 4: Deploy Frontend on Vercel

### 4.1 Import Project
1. Go to [vercel.com/new](https://vercel.com/new)
2. Click **"Import Git Repository"**
3. Select your `universe-app` repository
4. Configure:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

### 4.2 Add Environment Variable
Click **"Environment Variables"**:

| Key | Value |
|-----|-------|
| `VITE_API_URL` | `https://universe-backend-xxxx.onrender.com/api` |

(Use your Render backend URL from Step 3)

### 4.3 Deploy
1. Click **"Deploy"**
2. Wait for build (2-5 minutes)
3. Your app will be live at: `https://your-app.vercel.app`

---

## Step 5: Update Backend CORS

1. Go back to Render dashboard
2. Find your backend service → **Environment** tab
3. Update `FRONTEND_URL` with your Vercel URL:
   ```
   FRONTEND_URL=https://your-app.vercel.app
   ```
4. Click **"Save Changes"** (will redeploy automatically)

---

## Step 6: Test Your Deployment

Visit your Vercel URL and test:
- ✅ User registration/login
- ✅ AI Chatbot
- ✅ SOP Assistant
- ✅ Scholarship search
- ✅ Destination Finder
- ✅ Profile editing

---

## Automatic Deployments

🎉 **Setup Complete!** Now every time you push to GitHub:
- **Vercel** automatically deploys frontend changes
- **Render** automatically deploys backend changes

---

## Troubleshooting

### Frontend can't connect to backend
- Check `VITE_API_URL` in Vercel environment variables
- Ensure it ends with `/api`
- Verify Render backend is running

### CORS errors
- Verify `FRONTEND_URL` in Render matches your Vercel URL exactly
- Check Render logs for CORS errors

### MongoDB connection fails
- Verify `MONGODB_URI` in Render
- Check MongoDB Atlas network access (allow all IPs: `0.0.0.0/0`)
- Ensure database user has read/write permissions

### Backend crashes on startup
- Check Render logs for errors
- Verify all environment variables are set
- Test `GEMINI_API_KEY` is valid

### SOP generation fails
- Check if `GEMINI_API_KEY` is set correctly in Render
- Verify API key quota on Google AI Studio
- Check Render logs for detailed error

---

## Cost Breakdown

| Service | Plan | Cost |
|---------|------|------|
| Vercel | Free | $0/month |
| Render | Free | $0/month |
| MongoDB Atlas | M0 (Free) | $0/month |
| Google Gemini API | Free tier | $0/month* |

*Subject to rate limits (1500 requests/day)

**Total: $0/month** for up to ~1000 users

---

## Upgrade Paths (When Needed)

### If you need more performance:
- **Render**: Upgrade to Starter ($7/month) for always-on
- **Vercel**: Pro plan ($20/month) for better performance
- **MongoDB**: M10 cluster ($9/month) for dedicated resources

---

## Custom Domain (Optional)

### Vercel (Frontend):
1. Go to Project Settings → Domains
2. Add your domain (e.g., `universe.com`)
3. Update DNS records as shown
4. SSL certificate auto-generated

### Update after adding custom domain:
- Update `FRONTEND_URL` in Render to your custom domain

---

## Monitoring & Logs

### Vercel Logs:
- Dashboard → Your Project → Deployments → Click deployment → Logs

### Render Logs:
- Dashboard → Your Service → Logs (real-time streaming)

### MongoDB Monitoring:
- Atlas Dashboard → Metrics tab

---

## Quick Commands

```bash
# View Vercel deployment logs
vercel logs

# Redeploy Vercel (if needed)
vercel --prod

# Check Render backend health
curl https://universe-backend-xxxx.onrender.com/api/health

# Test MongoDB connection from local
mongosh "YOUR_MONGODB_URI"
```

---

## Support & Resources

- **Vercel Docs**: https://vercel.com/docs
- **Render Docs**: https://render.com/docs
- **MongoDB Atlas Docs**: https://docs.atlas.mongodb.com
- **Vite Deployment**: https://vitejs.dev/guide/static-deploy.html

---

**🚀 Your app is now live and production-ready!**

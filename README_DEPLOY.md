# Deploying MogCheck Backend to Render.com

## Prerequisites
- A Render.com account (free tier available)
- Your Google API key for Gemini
- Your frontend URL (if already deployed)

## Step-by-Step Deployment

### 1. Create a requirements.txt file
✅ Already created in the repository

### 2. Update CORS settings
✅ Already updated to use environment variable `FRONTEND_URL`

### 3. Deploy on Render.com

#### Option A: Using Render Dashboard (Recommended)

1. **Go to Render Dashboard**
   - Visit https://dashboard.render.com
   - Sign up or log in

2. **Create New Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository (MogCheck)
   - Or use "Public Git repository" and paste your repo URL

3. **Configure the Service**
   - **Name**: `mogcheck-api` (or any name you prefer)
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn api:app --host 0.0.0.0 --port $PORT`
   - **Root Directory**: Leave blank (or set to root if needed)

4. **Set Environment Variables**
   Click "Advanced" → "Add Environment Variable":
   - `GOOGLE_API_KEY`: Your Google Gemini API key
   - `FRONTEND_URL`: Your frontend URL (e.g., `https://your-frontend.onrender.com` or your custom domain)
     - For local development, you can leave this or set to `http://localhost:3000`

5. **Deploy**
   - Click "Create Web Service"
   - Render will automatically build and deploy your application
   - Wait for the build to complete (usually 2-5 minutes)

6. **Get Your Backend URL**
   - Once deployed, you'll get a URL like: `https://mogcheck-api.onrender.com`
   - Update your frontend to use this URL instead of `http://localhost:8000`

#### Option B: Using render.yaml (Alternative)

If you prefer infrastructure as code:

1. The `render.yaml` file is already created
2. In Render Dashboard:
   - Go to "Blueprints"
   - Click "New Blueprint"
   - Connect your repository
   - Render will automatically detect and use `render.yaml`

### 4. Update Frontend API URL

After deployment, update your frontend's API URL:

**In `frontend/src/App.js`:**
```javascript
const res = await fetch('https://your-backend-url.onrender.com/api/gemini/', {
  method: 'POST',
  body: formData,
});
```

Or use an environment variable:
```javascript
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';
const res = await fetch(`${API_URL}/api/gemini/`, {
  method: 'POST',
  body: formData,
});
```

### 5. Important Notes

- **Free Tier Limitations**: 
  - Services spin down after 15 minutes of inactivity
  - First request after spin-down may take 30-60 seconds (cold start)
  - Consider upgrading to paid tier for always-on service

- **Environment Variables**:
  - Never commit `.env` files to Git
  - Always set sensitive keys in Render dashboard

- **CORS**:
  - Make sure `FRONTEND_URL` matches your actual frontend URL
  - Include protocol (`https://`) in the URL

- **Port**:
  - Render automatically sets `$PORT` environment variable
  - Your start command must use `--port $PORT`

### 6. Testing the Deployment

Once deployed, test your API:
```bash
curl https://your-backend-url.onrender.com/
```

You should see: `{"message":"Hello World"}`

### 7. Monitoring

- Check logs in Render dashboard for any errors
- Monitor service health and uptime
- Set up alerts if needed

## Troubleshooting

**Build fails:**
- Check that `requirements.txt` includes all dependencies
- Verify Python version compatibility

**CORS errors:**
- Verify `FRONTEND_URL` environment variable is set correctly
- Check that your frontend URL matches exactly (including https://)

**API not responding:**
- Check service logs in Render dashboard
- Verify environment variables are set
- Ensure `GOOGLE_API_KEY` is correct

**Cold start delays:**
- Normal on free tier (15+ seconds)
- Consider upgrading to paid tier for faster response times

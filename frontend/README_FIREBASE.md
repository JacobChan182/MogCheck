# Deploying MogCheck Frontend to Firebase

## Prerequisites
- Node.js and npm installed
- Firebase CLI installed (`npm install -g firebase-tools`)
- A Firebase account (free tier available)
- Your backend API URL (from Render.com or other hosting)

## Step-by-Step Deployment

### 1. Install Firebase CLI (if not already installed)
```bash
npm install -g firebase-tools
```

### 2. Login to Firebase
```bash
firebase login
```
This will open a browser window for authentication.

### 3. Initialize Firebase in the frontend folder
```bash
cd frontend
firebase init
```

**During initialization, select:**
- ✅ **Hosting** (use arrow keys and spacebar to select)
- **Select an existing project** or **Create a new project**
  - If creating new: Enter a project name (e.g., `mogcheck-app`)
- **What do you want to use as your public directory?** → `build`
- **Configure as a single-page app?** → **Yes** (important for React Router)
- **Set up automatic builds and deploys with GitHub?** → **No** (or Yes if you want CI/CD)
- **File build/index.html already exists. Overwrite?** → **No**

### 4. Update Firebase Project ID
Edit `.firebaserc` and replace `your-firebase-project-id` with your actual Firebase project ID (from step 3).

### 5. Create Environment File for Production
Create a `.env.production` file in the `frontend` folder:
```bash
REACT_APP_API_URL=https://your-backend-url.onrender.com
```
Replace `https://your-backend-url.onrender.com` with your actual backend URL from Render.com.

**Note:** For local development, create `.env.development.local`:
```bash
REACT_APP_API_URL=http://localhost:8000
```

### 6. Build the React App
```bash
npm run build
```
This creates an optimized production build in the `build` folder.

### 7. Deploy to Firebase
```bash
firebase deploy --only hosting
```

### 8. Access Your Deployed App
After deployment, Firebase will provide you with a URL like:
- `https://your-project-id.web.app`
- `https://your-project-id.firebaseapp.com`

## Updating Your Deployment

### To update after making changes:
```bash
cd frontend
npm run build
firebase deploy --only hosting
```

### Quick deploy script
Add to `package.json`:
```json
"scripts": {
  "deploy": "npm run build && firebase deploy --only hosting"
}
```

Then run:
```bash
npm run deploy
```

## Environment Variables

React apps need environment variables prefixed with `REACT_APP_`:

**`.env.production`** (for production):
```
REACT_APP_API_URL=https://your-backend-url.onrender.com
```

**`.env.development.local`** (for local development):
```
REACT_APP_API_URL=http://localhost:8000
```

**Important:** 
- Never commit `.env.local` files to Git
- Add `.env*.local` to `.gitignore`
- Environment variables are embedded at build time, not runtime

## Custom Domain (Optional)

1. Go to Firebase Console → Hosting
2. Click "Add custom domain"
3. Follow the instructions to verify domain ownership
4. Update DNS records as instructed

## Firebase Hosting Features

- **Free SSL certificates** (automatic HTTPS)
- **Global CDN** for fast content delivery
- **Custom domains** support
- **Automatic deployments** with GitHub integration (optional)
- **Rollback** to previous deployments

## Troubleshooting

### Build fails
- Check that all dependencies are installed: `npm install`
- Verify Node.js version compatibility
- Check for TypeScript/ESLint errors

### API calls fail after deployment
- Verify `REACT_APP_API_URL` is set correctly in `.env.production`
- Rebuild after changing environment variables: `npm run build`
- Check CORS settings on your backend
- Check browser console for errors

### 404 errors on page refresh
- Ensure `firebase.json` has the rewrite rule for SPA:
  ```json
  "rewrites": [
    {
      "source": "**",
      "destination": "/index.html"
    }
  ]
  ```

### Environment variables not working
- Must be prefixed with `REACT_APP_`
- Must rebuild after changing: `npm run build`
- Check that `.env.production` is in the `frontend` folder

## File Structure
```
frontend/
├── .env.production          # Production environment variables
├── .env.development.local   # Local development variables
├── .firebaserc              # Firebase project configuration
├── firebase.json            # Firebase hosting configuration
├── package.json
├── public/
├── src/
└── build/                   # Generated build folder (gitignored)
```

## Next Steps

1. ✅ Deploy backend to Render.com (see `README_DEPLOY.md`)
2. ✅ Get your backend URL
3. ✅ Set `REACT_APP_API_URL` in `.env.production`
4. ✅ Build and deploy frontend to Firebase
5. ✅ Update backend CORS to include your Firebase URL
6. ✅ Test the full application

## Continuous Deployment (Optional)

To set up automatic deployments from GitHub:

1. In Firebase Console → Hosting → Connect GitHub
2. Select your repository
3. Configure build settings:
   - Build command: `npm run build`
   - Output directory: `build`
4. Enable automatic deployments

Now every push to your main branch will automatically deploy!

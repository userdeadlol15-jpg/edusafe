# 🚀 Complete Deployment Guide

## 📋 **Step-by-Step Instructions**

### **1. Set Up Supabase Database**

1. **Go to [Supabase](https://supabase.com)**
2. **Create a new project**
3. **Go to SQL Editor**
4. **Copy and paste the entire content from `database/schema.sql`**
5. **Run the SQL script**
6. **Go to Settings > API**
7. **Copy your Project URL and API keys**

### **2. Configure Environment Variables**

**Create `.env` file in the root directory:**
```env
# Server Configuration
PORT=5000
NODE_ENV=production

# Supabase Configuration
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# JWT Configuration
JWT_SECRET=your_very_secure_jwt_secret_here
JWT_EXPIRES_IN=7d
```

**Create `client/.env` file:**
```env
REACT_APP_API_URL=https://your-backend-url.herokuapp.com/api
REACT_APP_SUPABASE_URL=your_supabase_project_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
REACT_APP_YOUTUBE_API_KEY=your_youtube_api_key
```

### **3. Deploy Backend to Heroku**

1. **Install Heroku CLI** from [heroku.com](https://devcenter.heroku.com/articles/heroku-cli)
2. **Login to Heroku:**
   ```bash
   heroku login
   ```
3. **Create Heroku app:**
   ```bash
   heroku create your-app-name-backend
   ```
4. **Set environment variables:**
   ```bash
   heroku config:set SUPABASE_URL=your_supabase_url
   heroku config:set SUPABASE_ANON_KEY=your_supabase_anon_key
   heroku config:set SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   heroku config:set JWT_SECRET=your_jwt_secret
   heroku config:set NODE_ENV=production
   ```
5. **Deploy:**
   ```bash
   git add .
   git commit -m "Deploy to Heroku"
   git push heroku main
   ```

### **4. Deploy Frontend to Netlify**

1. **Go to [Netlify](https://netlify.com)**
2. **Sign up/Login**
3. **Click "New site from Git"**
4. **Connect your GitHub account**
5. **Select your repository**
6. **Set build settings:**
   - **Build command:** `cd client && npm run build`
   - **Publish directory:** `client/build`
7. **Add environment variables in Netlify dashboard:**
   - `REACT_APP_API_URL` = `https://your-backend-url.herokuapp.com/api`
   - `REACT_APP_SUPABASE_URL` = `your_supabase_url`
   - `REACT_APP_SUPABASE_ANON_KEY` = `your_supabase_anon_key`
8. **Deploy!**

### **5. Alternative: Deploy Both to Netlify (Easier)**

1. **Build the React app:**
   ```bash
   cd client
   npm run build
   cd ..
   ```

2. **Create a simple server for Netlify:**
   ```bash
   npm install netlify-lambda
   ```

3. **Deploy everything to Netlify as a single site**

## 🔧 **Quick Setup Commands**

```bash
# Install dependencies
npm install
cd client && npm install && cd ..

# Build the project
cd client && npm run build && cd ..

# Test locally
npm run dev
```

## 🌐 **Access Your App**

- **Frontend:** `https://your-app-name.netlify.app`
- **Backend API:** `https://your-app-name-backend.herokuapp.com/api`
- **Supabase Dashboard:** `https://app.supabase.com`

## 🛠️ **Troubleshooting**

### **Common Issues:**

1. **Build fails on Netlify:**
   - Check Node.js version (use 18)
   - Ensure all dependencies are in package.json
   - Check build command

2. **API calls fail:**
   - Verify CORS settings
   - Check environment variables
   - Ensure backend is deployed

3. **Database connection issues:**
   - Verify Supabase credentials
   - Check RLS policies
   - Ensure tables are created

### **Need Help?**
- Check the console for errors
- Verify all environment variables
- Test API endpoints with Postman
- Check Supabase logs

## 🎉 **You're Done!**

Your Disaster Preparedness App is now live and ready to use!

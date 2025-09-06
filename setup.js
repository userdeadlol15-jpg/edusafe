#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Setting up Disaster Preparedness App...\n');

// Check if Node.js version is compatible
const nodeVersion = process.version;
const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);

if (majorVersion < 16) {
  console.error('❌ Node.js version 16 or higher is required. Current version:', nodeVersion);
  process.exit(1);
}

console.log('✅ Node.js version check passed');

// Create .env files if they don't exist
const envFiles = [
  {
    path: '.env',
    content: `# Server Configuration
PORT=5000
NODE_ENV=development

# Supabase Configuration
SUPABASE_URL=your_supabase_url_here
SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

# JWT Configuration
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=7d

# Twilio Configuration (optional)
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number

# Email Configuration (optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# YouTube API (optional)
YOUTUBE_API_KEY=your_youtube_api_key

# Firebase Configuration (optional)
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_PRIVATE_KEY=your_firebase_private_key
FIREBASE_CLIENT_EMAIL=your_firebase_client_email`
  },
  {
    path: 'client/.env',
    content: `REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SUPABASE_URL=your_supabase_url_here
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key_here
REACT_APP_YOUTUBE_API_KEY=your_youtube_api_key`
  }
];

envFiles.forEach(({ path: filePath, content }) => {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, content);
    console.log(`✅ Created ${filePath}`);
  } else {
    console.log(`⚠️  ${filePath} already exists, skipping...`);
  }
});

// Install server dependencies
console.log('\n📦 Installing server dependencies...');
try {
  execSync('npm install', { stdio: 'inherit' });
  console.log('✅ Server dependencies installed');
} catch (error) {
  console.error('❌ Failed to install server dependencies:', error.message);
  process.exit(1);
}

// Install client dependencies
console.log('\n📦 Installing client dependencies...');
try {
  execSync('cd client && npm install', { stdio: 'inherit' });
  console.log('✅ Client dependencies installed');
} catch (error) {
  console.error('❌ Failed to install client dependencies:', error.message);
  process.exit(1);
}

// Create necessary directories
const directories = [
  'client/src/components',
  'client/src/pages',
  'client/src/contexts',
  'client/src/styles',
  'server/routes',
  'server/middleware',
  'server/config',
  'database'
];

directories.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`✅ Created directory: ${dir}`);
  }
});

console.log('\n🎉 Setup completed successfully!');
console.log('\n📋 Next steps:');
console.log('1. Set up your Supabase project and update the .env files');
console.log('2. Run the database schema from database/schema.sql in Supabase');
console.log('3. Start the development server with: npm run dev');
console.log('4. Open http://localhost:3000 in your browser');
console.log('\n🔗 Useful links:');
console.log('- Supabase: https://supabase.com');
console.log('- Twilio: https://twilio.com');
console.log('- YouTube API: https://developers.google.com/youtube/v3');
console.log('\n🛡️ Stay Safe, Stay Prepared!');

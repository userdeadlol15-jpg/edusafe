# Disaster Preparedness & Training App

A comprehensive web application designed to prepare students, teachers, parents, and administrators for disaster situations through gamified learning, interactive training videos, and mock drill scheduling.

## 🌟 Features

### 🎯 Core Features
- **Role-based Dashboards**: Customized interfaces for Students, Teachers, Parents, and Admins
- **Gamified Learning**: Interactive quizzes with badges and progress tracking
- **Video Learning**: YouTube integration with real disaster management content
- **Mock Drill Scheduler**: Plan and manage emergency preparedness drills
- **Emergency Directory**: Quick access to emergency contacts and services
- **Real-time Alerts**: Emergency notifications and system alerts

### 🎨 Design
- **Dark Neon Theme**: Modern, eye-catching dark theme with neon accents
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Smooth Animations**: Framer Motion powered animations for better UX
- **Accessibility**: WCAG compliant design with proper contrast and navigation

### 🔐 Security
- **JWT Authentication**: Secure token-based authentication
- **Role-based Access Control**: Granular permissions for different user types
- **Input Validation**: Comprehensive validation on both client and server
- **Rate Limiting**: Protection against abuse and spam
- **Helmet Security**: Security headers and protection

## 🚀 Tech Stack

### Frontend
- **React 18** with TypeScript
- **Styled Components** for styling
- **Framer Motion** for animations
- **React Router** for navigation
- **Axios** for API calls
- **React Icons** for iconography

### Backend
- **Node.js** with Express.js
- **JWT** for authentication
- **Bcrypt** for password hashing
- **Express Validator** for input validation
- **Helmet** for security
- **Rate Limiting** for API protection

### Database
- **Supabase** (PostgreSQL)
- **Real-time subscriptions**
- **Row Level Security (RLS)**

### External Services
- **Twilio** for SMS and calls
- **YouTube API** for video content
- **Firebase** for push notifications
- **Nodemailer** for email services

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v16 or higher)
- npm or yarn
- Git
- A Supabase account
- Twilio account (optional)
- YouTube API key (optional)

## 🛠️ Installation

### 1. Clone the Repository
```bash
git clone <repository-url>
cd disaster-preparedness-app
```

### 2. Install Dependencies
```bash
# Install server dependencies
npm install

# Install client dependencies
cd client
npm install
cd ..
```

### 3. Environment Setup

Create a `.env` file in the root directory:

```env
# Server Configuration
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
FIREBASE_CLIENT_EMAIL=your_firebase_client_email
```

Create a `.env` file in the client directory:

```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SUPABASE_URL=your_supabase_url_here
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key_here
REACT_APP_YOUTUBE_API_KEY=your_youtube_api_key
```

### 4. Database Setup

1. Create a new Supabase project
2. Run the SQL schema from `database/schema.sql` in your Supabase SQL editor
3. Enable Row Level Security (RLS) on all tables
4. Set up the necessary policies for your use case

### 5. Start the Application

```bash
# Start both server and client
npm run dev

# Or start them separately
npm run server  # Starts the backend server
npm run client  # Starts the React development server
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 📱 User Roles

### 👨‍🎓 Student
- Take quizzes and earn badges
- Watch learning videos
- Register for mock drills
- Track personal progress
- Access emergency directory

### 👨‍🏫 Teacher
- Create and manage quizzes
- Schedule mock drills
- Track student progress
- Mark drill attendance
- Upload learning content

### 👨‍👩‍👧‍👦 Parent
- Monitor child's progress
- Receive emergency alerts
- View upcoming drills
- Access emergency contacts

### 👨‍💼 Admin
- Manage all users
- Upload system-wide content
- Send emergency alerts
- View system analytics
- Configure system settings

## 🎮 Key Features Explained

### Quiz System
- **Gamified Experience**: Points, badges, and progress tracking
- **Multiple Difficulty Levels**: Easy, Medium, Hard
- **Real-time Feedback**: Immediate results and explanations
- **Progress Tracking**: Detailed analytics and performance metrics

### Video Learning
- **YouTube Integration**: Seamless video playback
- **Progress Tracking**: Resume watching from where you left off
- **Categorized Content**: Organized by disaster types
- **Mobile Responsive**: Works on all devices

### Mock Drill Scheduler
- **Flexible Scheduling**: Plan drills for different scenarios
- **Attendance Tracking**: Monitor participation
- **Real-time Updates**: Live status updates
- **Notification System**: Automated reminders

### Emergency Directory
- **Quick Access**: One-click calling and emailing
- **Priority System**: Color-coded by urgency
- **Department Organization**: Easy to find the right contact
- **Always Available**: 24/7 emergency access

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - User logout

### Quizzes
- `GET /api/quizzes` - Get all quizzes
- `GET /api/quizzes/:id` - Get specific quiz
- `POST /api/quizzes/:id/submit` - Submit quiz answers
- `GET /api/quizzes/user/attempts` - Get user attempts
- `GET /api/quizzes/user/badges` - Get user badges

### Videos
- `GET /api/videos` - Get all videos
- `GET /api/videos/:id` - Get specific video
- `POST /api/videos/:id/progress` - Update video progress
- `GET /api/videos/user/progress` - Get user progress

### Drills
- `GET /api/drills` - Get all drills
- `POST /api/drills` - Create new drill
- `POST /api/drills/:id/register` - Register for drill
- `POST /api/drills/:id/attendance` - Mark attendance

### Emergency
- `GET /api/emergency/contacts` - Get emergency contacts
- `POST /api/emergency/alert` - Send emergency alert
- `GET /api/emergency/alerts` - Get emergency alerts

## 🎨 Customization

### Theme Customization
The app uses a centralized theme system. Modify `client/src/styles/theme.ts` to customize:
- Colors
- Fonts
- Spacing
- Border radius
- Shadows
- Animations

### Adding New Features
1. Create new components in `client/src/components/`
2. Add new pages in `client/src/pages/`
3. Create API routes in `server/routes/`
4. Update database schema if needed
5. Add new context providers if required

## 🚀 Deployment

### Frontend Deployment (Vercel/Netlify)
1. Build the React app: `npm run build`
2. Deploy the `client/build` folder
3. Set environment variables in your hosting platform

### Backend Deployment (Railway/Heroku)
1. Set up your database (Supabase)
2. Configure environment variables
3. Deploy the server code
4. Update frontend API URLs

### Database Deployment
1. Use the provided `database/schema.sql`
2. Set up Row Level Security policies
3. Configure backup and monitoring

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -m 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## 🔮 Future Enhancements

- [ ] Mobile app (React Native)
- [ ] Offline mode support
- [ ] Multi-language support
- [ ] Advanced analytics dashboard
- [ ] Integration with IoT devices
- [ ] AI-powered recommendations
- [ ] Virtual reality training modules
- [ ] Social learning features

## 🙏 Acknowledgments

- React team for the amazing framework
- Supabase for the backend-as-a-service
- All contributors and testers
- Disaster preparedness organizations for inspiration

---

**Stay Safe, Stay Prepared! 🛡️**

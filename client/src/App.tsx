import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { GlobalStyles } from './styles/GlobalStyles';
import { theme } from './styles/theme';
import { AuthProvider } from './contexts/AuthContext';
import { QuizProvider } from './contexts/QuizContext';
import { VideoProvider } from './contexts/VideoContext';

// Components
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import StudentDashboard from './pages/StudentDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import ParentDashboard from './pages/ParentDashboard';
import AdminDashboard from './pages/AdminDashboard';
import QuizPage from './pages/QuizPage';
import VideoLearning from './pages/VideoLearning';
import DrillScheduler from './pages/DrillScheduler';
import EmergencyDirectory from './pages/EmergencyDirectory';
import Profile from './pages/Profile';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <AuthProvider>
        <QuizProvider>
          <VideoProvider>
            <Router>
              <div className="App">
                <Navbar />
                <Routes>
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  
                  <Route path="/" element={<Navigate to="/dashboard" replace />} />
                  
                  <Route path="/dashboard" element={
                    <ProtectedRoute>
                      <StudentDashboard />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/teacher" element={
                    <ProtectedRoute allowedRoles={['teacher', 'admin']}>
                      <TeacherDashboard />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/parent" element={
                    <ProtectedRoute allowedRoles={['parent', 'admin']}>
                      <ParentDashboard />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/admin" element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <AdminDashboard />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/quiz/:id" element={
                    <ProtectedRoute>
                      <QuizPage />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/videos" element={
                    <ProtectedRoute>
                      <VideoLearning />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/drills" element={
                    <ProtectedRoute>
                      <DrillScheduler />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/emergency" element={
                    <ProtectedRoute>
                      <EmergencyDirectory />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/profile" element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  } />
                </Routes>
              </div>
            </Router>
          </VideoProvider>
        </QuizProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
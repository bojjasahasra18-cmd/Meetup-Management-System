import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';

// Pages
import Profile from "./pages/Profile";
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import MeetupDetails from './pages/MeetupDetails';
import CreateMeetup from './pages/CreateMeetup';
import Analytics from './pages/Analytics';
import History from './pages/History';
import Leaderboard from "./pages/Leaderboard";
import CommunityInsights from "./pages/CommunityInsights";

import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-container">
          <Navbar />
          <main className="main-content">
            <Routes>
              {/* Home / Dashboard routes */}
              <Route path="/" element={<Dashboard />} />
              <Route path="/dashboard" element={<Navigate to="/" replace />} />

              {/* Authentication routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Meetup Details page */}
              <Route path="/meetups/:id" element={<MeetupDetails />} />

              {/* Create Meetup (Organizer/Admin only) */}
              <Route path="/create-meetup" element={<CreateMeetup />} />

              {/* Analytics page for individual meetups */}
              <Route path="/meetups/:id/analytics" element={<Analytics />} />
              {/* User Profile */}
              <Route path="/profile" element={<Profile />} />
              {/* History page */}
              <Route path="/history" element={<History />} />
              {/* Leaderboard page */}
              <Route path="/leaderboard" element={<Leaderboard />} />
              {/* Community Insights page */}
              <Route
  path="/community-insights"
  element={<CommunityInsights />}
/>

              {/* Fallback route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
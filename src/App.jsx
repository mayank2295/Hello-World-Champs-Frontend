import React, { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AuthPage from "./pages/AuthPage";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import ChatPage from "./pages/ChatPage";
import QuizPage from "./pages/QuizPage";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { auth, db } from "./firebase";
import { doc, getDoc } from "firebase/firestore";
import LoadingScreen from "./components/LoadingScreen";
import "./App.css";
import "./HomePage.css";

// Route guard for dashboard, chat, settings, and profile
function RequireQuizCompleted({ children }) {
  const [loading, setLoading] = useState(true);
  const [allow, setAllow] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        navigate("/login");
        setLoading(false);
        return;
      }
      try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (!userDoc.exists() || !userDoc.data().quizCompleted) {
          navigate("/quiz");
        } else {
          setAllow(true);
        }
      } catch (err) {
        navigate("/quiz");
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [navigate]);

  if (loading) return <LoadingScreen />;
  return allow ? children : null;
}

function HeroSection() {
  return (
    <>
      <Navbar />
      <main className="main-hero">
        <section className="hero-content">
          <div className="hero-overline">MORE THAN AN AI CAREER ADVISOR</div>
          <h1 className="hero-heading">
            Discover your<br />
            perfect career path
          </h1>
          <p className="hero-subtext">
            With our AI-powered platform, you can explore, analyze, and optimize your career journey. 
            Get personalized guidance, skill gap analysis, and curated resources—built just for Indian students.
          </p>
          <a href="/signup" className="hero-btn">Start building</a>
        </section>
      </main>
      <Footer />
    </>
  );
}

export default function App() {
  const location = useLocation();
  const fullscreenRoutes = ["/login", "/signup", "/dashboard", "/quiz"];
  const isFullscreen = fullscreenRoutes.some((r) =>
    location.pathname.startsWith(r)
  );

  return (
    <Routes>
      {/* Homepage: WITH Navbar and Footer, old hero section style */}
      <Route path="/" element={<HeroSection />} />

      {/* Login page: FULLSCREEN, NO Navbar/Footer */}
      <Route path="/login" element={<LoginPage />} />

      {/* Signup page: FULLSCREEN, NO Navbar/Footer */}
      <Route path="/signup" element={<AuthPage type="signup" />} />

      {/* Dashboard page: Requires quiz completion */}
      <Route
        path="/dashboard"
        element={
          <RequireQuizCompleted>
            <Dashboard />
          </RequireQuizCompleted>
        }
      />
      {/* Chat page: Requires quiz completion */}
      <Route
        path="/chat/:chatId"
        element={
          <RequireQuizCompleted>
            <ChatPage />
          </RequireQuizCompleted>
        }
      />
      {/* Settings page: Requires quiz completion */}
      <Route
        path="/settings"
        element={
          <RequireQuizCompleted>
            <Settings />
          </RequireQuizCompleted>
        }
      />
      {/* Profile page: Requires quiz completion */}
      <Route
        path="/profile"
        element={
          <RequireQuizCompleted>
            <Profile />
          </RequireQuizCompleted>
        }
      />
      {/* Quiz page: FULLSCREEN, NO Navbar/Footer */}
      <Route path="/quiz" element={<QuizPage />} />
    </Routes>
  );
}

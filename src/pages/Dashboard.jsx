import React, { useEffect, useState } from "react";
import PeoplePage from "./PeoplePage";
import NotificationsPage from "./NotificationsPage";
import MessagesPage from "./MessagesPage";
import DreamFlowPage from "./DreamFlowPage";
import ResumeAnalyserPage from "./ResumeAnalyserPage"; // <-- Import the new page
import CommunityPage from "./CommunityPage";
import { collection, collectionGroup, query, where, onSnapshot } from "firebase/firestore"; 
import { db } from "../firebase";
import {
  MdPeople,
  MdStyle,
  MdWork,
  MdGroups,
  MdEvent,
  MdDescription,
  MdSettings,
  MdMenu,
  MdClose,
  MdNotifications,
  MdChat,
  MdAutoAwesome
} from "react-icons/md";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

const SIDEBAR_MENU = [
  { name: "People", icon: <MdPeople /> },
  { name: "Style", icon: <MdStyle /> },
  { name: "Jobs", icon: <MdWork /> },
  { name: "Community", icon: <MdGroups /> },
  { name: "DreamFlow AI", icon: <MdAutoAwesome /> },
  { name: "Notifications", icon: <MdNotifications /> },
  { name: "Messages", icon: <MdChat /> },
  { name: "Events", icon: <MdEvent /> },
  { name: "Resume Builder", icon: <MdDescription /> },
  { name: "Resume Analyser", icon: <MdDescription /> }, // <-- Added here
  { name: "Settings", icon: <MdSettings /> },
];

function getInitial(name, email) {
  if (name && name.length > 0) return name[0].toUpperCase();
  if (email && email.length > 0) return email[0].toUpperCase();
  return "?";
}

export default function Dashboard() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userAvatar, setUserAvatar] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [notificationCount, setNotificationCount] = useState(0);
  const [unreadMessageCount, setUnreadMessageCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        setIsLoggedIn(true);
        setUserName(user.displayName || "");
        setUserEmail(user.email || "");
        setUserAvatar(user.photoURL && user.photoURL.trim() !== "" ? user.photoURL : "");
      } else {
        setUser(null);
        setIsLoggedIn(false);
        setUserName("");
        setUserEmail("");
        setUserAvatar("");
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) {
      setNotificationCount(0);
      return;
    }
    const notificationsRef = collection(db, "notifications");
    const q = query(notificationsRef, where("userId", "==", user.uid), where("isRead", "==", false));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      setNotificationCount(querySnapshot.size);
    });
    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    if (!user) {
      setUnreadMessageCount(0);
      return;
    }
    const messagesQuery = collectionGroup(db, "messages");
    const q = query(messagesQuery, where("receiverId", "==", user.uid), where("isRead", "==", false));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      setUnreadMessageCount(querySnapshot.size);
    });
    return () => unsubscribe();
  }, [user]);

  function handleSidebarSelect(idx) {
    setActiveIndex(idx);
    setSidebarOpen(false);
  }

  function handleSidebarToggle() {
    setSidebarOpen((open) => !open);
  }

  function handleLogoClick() {
    navigate("/");
    setSidebarOpen(false);
  }

  function handleLoginRedirect() {
    navigate("/login");
  }

  function renderContent() {
    if (!isLoggedIn) {
      return (
        <div className="dashboard-center">
          <div className="dashboard-card dashboard-community-card fade-in">
            <h2>Welcome to CareerFlow!</h2>
            <p className="dashboard-community-desc">Please log in to access your dashboard and find mentors!</p>
            <button className="dashboard-login-btn" onClick={handleLoginRedirect}>Login</button>
          </div>
        </div>
      );
    }
    switch (activeIndex) {
      case 0: return <PeoplePage userName={userName || userEmail} currentUser={user} />;
      case 3: return <CommunityPage currentUser={user} />;
      case 4: return <DreamFlowPage currentUser={user} />;
      case 5: return <NotificationsPage currentUser={user} />;
      case 6: return <MessagesPage currentUser={user} />;
      case 9: return <ResumeAnalyserPage currentUser={user} />; // Resume Analyser
      default:
        return (
          <div className="dashboard-center">
            <div className="dashboard-card dashboard-community-card fade-in">
              <h2>Page Not Built Yet</h2>
              <p className="dashboard-community-desc">Select another page from the sidebar to continue.</p>
            </div>
          </div>
        );
    }
  }

  return (
    <div className="dashboard-root">
      <div className={`dashboard-sidebar-overlay${sidebarOpen ? " open" : ""}`} onClick={handleSidebarToggle} />
      <aside className={`dashboard-sidebar${sidebarOpen ? " open" : ""}`}>
        <div className="dashboard-logo-row" onClick={handleLogoClick}>
          <img src="/logo.png" alt="CareerFlow Logo" className="dashboard-logo" />
          <span className="dashboard-title">CareerFlow</span>
          <button className="dashboard-sidebar-close" onClick={handleSidebarToggle} aria-label="Close sidebar"><MdClose size={22} /></button>
        </div>
        <nav className="dashboard-menu">
          {SIDEBAR_MENU.map((item, idx) => (
            <button 
              key={item.name} 
              className={`dashboard-menu-btn ${item.name === "DreamFlow AI" ? "dreamflow-menu-btn" : ""} ${activeIndex === idx ? " active" : ""}`} 
              onClick={() => handleSidebarSelect(idx)} 
              tabIndex={0} 
              disabled={!isLoggedIn && item.name !== 'People'}
            >
              <span className={`dashboard-menu-icon${activeIndex === idx ? " active" : ""}`}>
                {item.icon}
                {item.name === "Notifications" && notificationCount > 0 && (<span className="notification-badge">{notificationCount}</span>)}
                {item.name === "Messages" && unreadMessageCount > 0 && (<span className="notification-badge">{unreadMessageCount}</span>)}
              </span>
              <span className={`dashboard-menu-label${activeIndex === idx ? " active" : ""}`}>{item.name}</span>
            </button>
          ))}
        </nav>
      </aside>
      <main className="dashboard-main">
        <header className="dashboard-header">
          <div className="dashboard-header-mobile-left">
            <button className="dashboard-menu-toggle" onClick={handleSidebarToggle} aria-label="Open sidebar"><MdMenu size={28} /></button>
            <div className="dashboard-header-logo-brand" onClick={handleLogoClick}>
              <img src="/logo.png" alt="CareerFlow Logo" className="dashboard-header-logo" />
              <span className="dashboard-header-title">CareerFlow</span>
            </div>
          </div>
          <div className="dashboard-header-right">
            {isLoggedIn && (
              <>
                <span className="dashboard-welcome">Welcome, <strong>{userName || userEmail}</strong></span>
                <span className="dashboard-avatar">
                  {userAvatar ? (
                    <img src={userAvatar} alt="User avatar" className="dashboard-avatar-img" onError={e => { e.target.onerror=null; e.target.src="/avatar-placeholder.png"; }} />
                  ) : (
                    <span className="dashboard-avatar-initial">{getInitial(userName, userEmail)}</span>
                  )}
                </span>
              </>
            )}
          </div>
        </header>
        <section className="dashboard-content-row">{renderContent()}</section>
      </main>
    </div>
  );
}
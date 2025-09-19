// src/pages/CommunityPage.jsx

import React, { useState, useEffect } from 'react';
import { 
  MdGroups, 
  MdCheckCircle, 
  MdError, 
  MdRefresh,
  MdOpenInNew,
  MdPeople,
  MdOnlinePrediction
} from 'react-icons/md';
import { FaDiscord, FaTelegram } from 'react-icons/fa';
import './CommunityPage.css';

function CommunityPage({ currentUser }) {
  const [connectionStatus, setConnectionStatus] = useState({
    discord: { connected: false, loading: false, error: null },
    telegram: { connected: false, loading: false, error: null }
  });
  
  const [memberCount, setMemberCount] = useState({
    discord: 0,
    telegram: 0,
    total: 0,
    loading: true
  });

  // Mock data - in real implementation, this would come from APIs
  useEffect(() => {
    // Simulate loading member counts
    const loadMemberCounts = async () => {
      setMemberCount(prev => ({ ...prev, loading: true }));
      
      // Simulate API delay
      setTimeout(() => {
        setMemberCount({
          discord: 1247,
          telegram: 892,
          total: 2139,
          loading: false
        });
      }, 1500);
    };

    loadMemberCounts();
  }, []);

  const handleDiscordConnect = async () => {
    setConnectionStatus(prev => ({
      ...prev,
      discord: { connected: false, loading: true, error: null }
    }));

    try {
      // Simulate connection attempt
      setTimeout(() => {
        // In real implementation, this would redirect to Discord OAuth
        window.open('https://discord.gg/careerflow', '_blank');
        setConnectionStatus(prev => ({
          ...prev,
          discord: { connected: true, loading: false, error: null }
        }));
      }, 1000);
    } catch (error) {
      setConnectionStatus(prev => ({
        ...prev,
        discord: { connected: false, loading: false, error: 'Failed to connect to Discord' }
      }));
    }
  };

  const handleTelegramConnect = async () => {
    setConnectionStatus(prev => ({
      ...prev,
      telegram: { connected: false, loading: true, error: null }
    }));

    try {
      // Simulate connection attempt
      setTimeout(() => {
        // In real implementation, this would redirect to Telegram
        window.open('https://t.me/careerflow', '_blank');
        setConnectionStatus(prev => ({
          ...prev,
          telegram: { connected: true, loading: false, error: null }
        }));
      }, 1000);
    } catch (error) {
      setConnectionStatus(prev => ({
        ...prev,
        telegram: { connected: false, loading: false, error: 'Failed to connect to Telegram' }
      }));
    }
  };

  const retryConnection = (platform) => {
    if (platform === 'discord') {
      handleDiscordConnect();
    } else if (platform === 'telegram') {
      handleTelegramConnect();
    }
  };

  return (
    <div className="community-page-container">
      <div className="community-header">
        <div className="community-title-section">
          <MdGroups className="community-icon" />
          <div>
            <h1>Community Hub</h1>
            <p>Connect with fellow learners and industry professionals</p>
          </div>
        </div>
        
        <div className="member-stats">
          <div className="stat-card">
            <MdPeople className="stat-icon" />
            <div className="stat-content">
              <div className="stat-number">
                {memberCount.loading ? '...' : memberCount.total.toLocaleString()}
              </div>
              <div className="stat-label">Active Members</div>
            </div>
          </div>
          <div className="stat-card">
            <MdOnlinePrediction className="stat-icon" />
            <div className="stat-content">
              <div className="stat-number">24/7</div>
              <div className="stat-label">Community Support</div>
            </div>
          </div>
        </div>
      </div>

      <div className="community-content">
        {/* Social Platforms Section */}
        <div className="community-section">
          <h2>Join Our Community Platforms</h2>
          <div className="platforms-grid">
            {/* Discord Card */}
            <div className="platform-card discord-card">
              <div className="platform-header">
                <FaDiscord className="platform-icon discord-icon" />
                <div className="platform-info">
                  <h3>Discord Community</h3>
                  <p>Real-time discussions, career advice, and networking</p>
                </div>
              </div>
              
              <div className="platform-stats">
                <div className="platform-stat">
                  <span className="stat-value">
                    {memberCount.loading ? '...' : memberCount.discord.toLocaleString()}
                  </span>
                  <span className="stat-label">Members</span>
                </div>
                <div className="platform-stat">
                  <span className="stat-value">15+</span>
                  <span className="stat-label">Channels</span>
                </div>
              </div>

              <div className="connection-status">
                {connectionStatus.discord.loading ? (
                  <div className="status-indicator loading">
                    <MdRefresh className="loading-icon" />
                    <span>Connecting...</span>
                  </div>
                ) : connectionStatus.discord.connected ? (
                  <div className="status-indicator connected">
                    <MdCheckCircle />
                    <span>Connected</span>
                  </div>
                ) : connectionStatus.discord.error ? (
                  <div className="status-indicator error">
                    <MdError />
                    <span>{connectionStatus.discord.error}</span>
                  </div>
                ) : (
                  <div className="status-indicator disconnected">
                    <span>Not connected</span>
                  </div>
                )}
              </div>

              <div className="platform-actions">
                {connectionStatus.discord.error ? (
                  <button 
                    className="btn-retry" 
                    onClick={() => retryConnection('discord')}
                    disabled={connectionStatus.discord.loading}
                  >
                    <MdRefresh />
                    Retry
                  </button>
                ) : (
                  <button 
                    className="btn-join discord-btn" 
                    onClick={handleDiscordConnect}
                    disabled={connectionStatus.discord.loading || connectionStatus.discord.connected}
                  >
                    <FaDiscord />
                    {connectionStatus.discord.connected ? 'Joined' : 'Join Discord'}
                    <MdOpenInNew className="external-icon" />
                  </button>
                )}
              </div>
            </div>

            {/* Telegram Card */}
            <div className="platform-card telegram-card">
              <div className="platform-header">
                <FaTelegram className="platform-icon telegram-icon" />
                <div className="platform-info">
                  <h3>Telegram Channel</h3>
                  <p>Daily updates, job postings, and quick announcements</p>
                </div>
              </div>
              
              <div className="platform-stats">
                <div className="platform-stat">
                  <span className="stat-value">
                    {memberCount.loading ? '...' : memberCount.telegram.toLocaleString()}
                  </span>
                  <span className="stat-label">Subscribers</span>
                </div>
                <div className="platform-stat">
                  <span className="stat-value">5+</span>
                  <span className="stat-label">Daily Posts</span>
                </div>
              </div>

              <div className="connection-status">
                {connectionStatus.telegram.loading ? (
                  <div className="status-indicator loading">
                    <MdRefresh className="loading-icon" />
                    <span>Connecting...</span>
                  </div>
                ) : connectionStatus.telegram.connected ? (
                  <div className="status-indicator connected">
                    <MdCheckCircle />
                    <span>Connected</span>
                  </div>
                ) : connectionStatus.telegram.error ? (
                  <div className="status-indicator error">
                    <MdError />
                    <span>{connectionStatus.telegram.error}</span>
                  </div>
                ) : (
                  <div className="status-indicator disconnected">
                    <span>Not connected</span>
                  </div>
                )}
              </div>

              <div className="platform-actions">
                {connectionStatus.telegram.error ? (
                  <button 
                    className="btn-retry" 
                    onClick={() => retryConnection('telegram')}
                    disabled={connectionStatus.telegram.loading}
                  >
                    <MdRefresh />
                    Retry
                  </button>
                ) : (
                  <button 
                    className="btn-join telegram-btn" 
                    onClick={handleTelegramConnect}
                    disabled={connectionStatus.telegram.loading || connectionStatus.telegram.connected}
                  >
                    <FaTelegram />
                    {connectionStatus.telegram.connected ? 'Joined' : 'Join Telegram'}
                    <MdOpenInNew className="external-icon" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Community Guidelines Section */}
        <div className="community-section">
          <h2>Community Guidelines</h2>
          <div className="guidelines-card">
            <div className="guidelines-grid">
              <div className="guideline-item">
                <div className="guideline-icon">🤝</div>
                <div className="guideline-content">
                  <h4>Be Respectful</h4>
                  <p>Treat all community members with respect and kindness. No harassment, discrimination, or offensive language.</p>
                </div>
              </div>
              
              <div className="guideline-item">
                <div className="guideline-icon">💡</div>
                <div className="guideline-content">
                  <h4>Share Knowledge</h4>
                  <p>Help others by sharing your experiences, insights, and resources. Ask questions and contribute to discussions.</p>
                </div>
              </div>
              
              <div className="guideline-item">
                <div className="guideline-icon">🎯</div>
                <div className="guideline-content">
                  <h4>Stay On Topic</h4>
                  <p>Keep discussions relevant to career development, job searching, and professional growth.</p>
                </div>
              </div>
              
              <div className="guideline-item">
                <div className="guideline-icon">📢</div>
                <div className="guideline-content">
                  <h4>No Spam</h4>
                  <p>Avoid excessive self-promotion, repetitive posts, or irrelevant content. Quality over quantity.</p>
                </div>
              </div>
              
              <div className="guideline-item">
                <div className="guideline-icon">🔒</div>
                <div className="guideline-content">
                  <h4>Privacy First</h4>
                  <p>Respect others' privacy. Don't share personal information without permission.</p>
                </div>
              </div>
              
              <div className="guideline-item">
                <div className="guideline-icon">⚡</div>
                <div className="guideline-content">
                  <h4>Report Issues</h4>
                  <p>Report any violations or concerns to moderators promptly. Help keep our community safe.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity Preview Section */}
        <div className="community-section">
          <h2>Recent Community Activity</h2>
          <div className="activity-preview">
            <div className="activity-item">
              <div className="activity-avatar">A</div>
              <div className="activity-content">
                <div className="activity-header">
                  <span className="activity-user">Alex Chen</span>
                  <span className="activity-platform discord">Discord</span>
                  <span className="activity-time">2 hours ago</span>
                </div>
                <p className="activity-text">Just got my first tech interview! Thanks to everyone who helped me prepare my resume. 🚀</p>
              </div>
            </div>
            
            <div className="activity-item">
              <div className="activity-avatar">S</div>
              <div className="activity-content">
                <div className="activity-header">
                  <span className="activity-user">Sarah Johnson</span>
                  <span className="activity-platform telegram">Telegram</span>
                  <span className="activity-time">4 hours ago</span>
                </div>
                <p className="activity-text">New job posting: Senior Product Manager at TechCorp. DM me for referral!</p>
              </div>
            </div>
            
            <div className="activity-item">
              <div className="activity-avatar">M</div>
              <div className="activity-content">
                <div className="activity-header">
                  <span className="activity-user">Mike Rodriguez</span>
                  <span className="activity-platform discord">Discord</span>
                  <span className="activity-time">6 hours ago</span>
                </div>
                <p className="activity-text">Hosting a mock interview session tomorrow at 3 PM EST. Who's interested?</p>
              </div>
            </div>
          </div>
          
          <div className="activity-footer">
            <p>Join our platforms to see more activity and participate in discussions!</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CommunityPage;
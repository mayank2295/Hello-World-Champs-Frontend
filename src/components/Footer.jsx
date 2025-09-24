import React from "react";
import {
  FaLinkedin,
  FaTwitter,
  FaInstagram,
  FaGithub,
} from "react-icons/fa";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="careerflow-footer">
      <div className="footer-left">
        <span className="footer-logo">CareerFlow</span>
      </div>
      <div className="footer-center">
        Built with <span className="footer-heart">♥</span> in India for the world
      </div>
      <div className="footer-right">
        <span className="footer-contact-title">Contact</span>
        <a href="mailto:hello@careerflow.in" className="footer-contact-link">hello@careerflow.in</a>
        <div className="footer-social">
          <a href="https://linkedin.com/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
            <FaLinkedin />
          </a>
          <a href="https://twitter.com/" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
            <FaTwitter />
          </a>
          <a href="https://instagram.com/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
            <FaInstagram />
          </a>
          <a href="https://github.com/" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
            <FaGithub />
          </a>
        </div>
      </div>
      <div className="footer-bottom">
        &copy; {new Date().getFullYear()} CareerFlow. All rights reserved.
      </div>
    </footer>
  );
}

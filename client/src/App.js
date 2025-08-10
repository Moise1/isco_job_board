import { useState } from "react";
import "./App.css";
import interviewImg from "./imgs/interview.png";
import jobhuntImg from "./imgs/job_hunt.png";
import talentScreening from "./imgs/talent_screening.png";
import businessWoman from "./imgs/business_woman.jpg";
import maleBsinessOwner from "./imgs/business_owner.jpg";
import femaleFounder from "./imgs/female_founder.jpg";
import { FaBars, FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";



function App() {

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
      setIsMenuOpen(!isMenuOpen);
    };
  
  const navigate = useNavigate();
  
  return (
    <div className="landing-page">
      {/* Navigation */}
      <nav className="navbar">
        <div className="container">
          <h1 className="logo">JobConnect</h1>

          <div className={`nav-links ${isMenuOpen ? "active" : ""}`}>
            <a href="#job-seekers">For Job Seekers</a>
            <a href="#employers">For Employers</a>
            <a href="#features">Features</a>
            <button className="cta-button" onClick={() => navigate("/login")}>
              Get Started
            </button>
          </div>

          <div className="hamburger" onClick={toggleMenu}>
            {isMenuOpen ? <FaTimes /> : <FaBars />}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="hero">
        <div className="container">
          <div className="hero-text">
            <h1>Your Next Career Move Starts Here</h1>
            <p>Connecting top talent with great companies</p>
            <div className="hero-buttons">
              <button className="primary-button">Find Jobs</button>
              <button className="secondary-button">Post Jobs</button>
            </div>
          </div>
          <div className="hero-image">
            <img src={interviewImg} alt="Hiring illustration" />
          </div>
        </div>
      </header>

      {/* Section 1: Hustle-free job application */}
      <section id="job-seekers" className="section">
        <div className="container">
          <div className="section-image">
            <img src={jobhuntImg} alt="Easy job application" />
          </div>
          <div className="section-text">
            <h2>Hustle-free Job Application</h2>
            <p>
              Apply to multiple jobs with just one profile. Our smart
              application system saves your information so you don't have to
              fill out forms repeatedly.
            </p>
            <ul>
              <li>One-click applications</li>
              <li>Profile completeness tracker</li>
              <li>Application status updates</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Section 2: Efficient candidate screening */}
      <section id="employers" className="section alt-bg">
        <div className="container reverse">
          <div className="section-text">
            <h2>Efficient Job Candidate Screening</h2>
            <p>
              Our AI-powered tools help you quickly identify the best candidates
              based on your specific requirements, saving you hours of screening
              time.
            </p>
            <ul>
              <li>Smart candidate matching</li>
              <li>Automated skill assessments</li>
              <li>Customizable screening filters</li>
            </ul>
          </div>
          <div className="section-image">
            <img src={talentScreening} alt="Candidate screening" />
          </div>
        </div>
      </section>

      {/* Section 3: Testimonials */}
      <section id="testimonials" className="testimonials-section">
        <div className="container">
          <h2 className="section-title">Business Owners Love JobConnect</h2>
          <p className="section-subtitle">
            Hear from companies who found exceptional talent through our
            platform
          </p>

          <div className="testimonials-grid">
            <div className="testimonial-card">
              <div className="testimonial-content">
                <img
                  src={femaleFounder}
                  alt="Business owner"
                  className="testimonial-avatar"
                />
                <p className="testimonial-text">
                  "We found our lead developer through JobConnect in just 3
                  days. The quality of candidates was outstanding compared to
                  other job boards."
                </p>
                <div className="testimonial-author">
                  <h4>Sarah Johnson</h4>
                  <p>CEO, TechSolutions Inc.</p>
                </div>
                <div className="rating">★★★★★</div>
              </div>
            </div>

            <div className="testimonial-card">
              <div className="testimonial-content">
                <img
                  src={businessWoman}
                  alt="Business owner"
                  className="testimonial-avatar"
                />
                <p className="testimonial-text">
                  "JobConnect saved us 60% on recruitment costs. We hired 5
                  top-performing employees last quarter all through this
                  platform."
                </p>
                <div className="testimonial-author">
                  <h4>Michael Chen</h4>
                  <p>HR Director, GrowthMarketing</p>
                </div>
                <div className="rating">★★★★★</div>
              </div>
            </div>

            <div className="testimonial-card">
              <div className="testimonial-content">
                <img
                  src={maleBsinessOwner}
                  alt="Business owner"
                  className="testimonial-avatar"
                />
                <p className="testimonial-text">
                  "As a startup founder, I don't have time to sift through
                  hundreds of resumes. JobConnect's matching algorithm delivered
                  exactly who we needed."
                </p>
                <div className="testimonial-author">
                  <h4>David Rodriguez</h4>
                  <p>Founder, NexaStartups</p>
                </div>
                <div className="rating">★★★★☆</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta-section">
        <div className="container">
          <h2>Ready to Transform Your Hiring or Job Search?</h2>
          <p>
            Join thousands of companies and candidates finding their perfect
            match
          </p>
          <div className="cta-buttons">
            <button className="primary-button">I'm Hiring</button>
            <button className="primary-button">I Need a Job</button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-logo">
              <h2>JobConnect</h2>
              <p>Making job connections simple and effective</p>
            </div>

            <div className="footer-links">
              <div className="link-group">
                <h3>For Job Seekers</h3>
                <a href="/">Browse Jobs</a>
                <a href="/">Career Resources</a>
                <a href="/">Profile Tips</a>
              </div>

              <div className="link-group">
                <h3>For Employers</h3>
                <a href="/">Post a Job</a>
                <a href="/">Pricing</a>
                <a href="/">Recruiting Tools</a>
              </div>

              <div className="link-group">
                <h3>Company</h3>
                <a href="/">About Us</a>
                <a href="/">Contact</a>
                <a href="/">Blog</a>
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            <p>© 2023 JobConnect. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;

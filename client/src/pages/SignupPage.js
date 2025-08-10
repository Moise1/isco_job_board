import React, { useState } from "react";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaGoogle,
  FaLinkedin,
} from "react-icons/fa";
import "../css/Signup.css"; 

function SignupPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle signup logic here
    console.log(formData);
  };

  return (
    <div className="login-container">
      <div className="login-wrapper">
        <div className="login-header">
          <h1 className="login-logo">JobConnect</h1>
          <h2>Create Your Account</h2>
          <p>Join thousands of job seekers and employers</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="name-fields">
            <div className="input-group half-width">
              <FaUser className="input-icon" />
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group half-width">
              <FaUser className="input-icon" />
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="input-group">
            <FaEnvelope className="input-icon" />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <FaLock className="input-icon" />
            <input
              type="password"
              name="password"
              placeholder="Password (min 8 characters)"
              value={formData.password}
              onChange={handleChange}
              minLength="8"
              required
            />
          </div>

          <div className="terms-agreement">
            <input type="checkbox" id="terms" required />
            <label htmlFor="terms">
              I agree to the <a href="/terms">Terms of Service</a> and{" "}
              <a href="/privacy">Privacy Policy</a>
            </label>
          </div>

          <button type="submit" className="login-button">
            Create Account
          </button>

          {/* <div className="divider">
            <span>or sign up with</span>
          </div>

          <div className="social-login">
            <button type="button" className="social-btn google">
              <FaGoogle /> Google
            </button>
            <button type="button" className="social-btn linkedin">
              <FaLinkedin /> LinkedIn
            </button>
          </div>

          <p className="signup-link">
            Already have an account? <a href="/login">Log in</a>
          </p> */}
        </form>
      </div>
    </div>
  );
}

export default SignupPage;

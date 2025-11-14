// src/components/Navbar.js
import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import NotificationDropdown from "./NotificationDropdown";
import logo from "../assets/jobconnect-logo.svg";
import "./Navbar.css";

const baseLinks = [{ to: "/jobs", label: "Jobs" }];

const applicantLinks = [
  { to: "/applicant/dashboard", label: "Dashboard" },
  { to: "/applicant/applications", label: "Applications" },
  { to: "/applicant/saved-jobs", label: "Saved Jobs" },
];

const employerLinks = [
  { to: "/employer/dashboard", label: "Dashboard" },
  { to: "/employer/post-job", label: "Post Job" },
  { to: "/employer/manage-jobs", label: "Manage Jobs" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();

  const role = user?.role;
  const roleLinks = role === "APPLICANT" ? applicantLinks : role === "EMPLOYER" ? employerLinks : [];
  const displayName = user?.fullName || user?.companyName || user?.name || "Profile";
  const roleLabel = role ? role.charAt(0) + role.slice(1).toLowerCase() : "";

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate("/login");
  };

  const renderLinks = (links) =>
    links.map(({ to, label }) => (
      <NavLink
        key={to}
        to={to}
        className={({ isActive }) =>
          `nav-link${isActive ? " nav-link-active" : ""}`
        }
        onClick={() => setMenuOpen(false)}
      >
        {label}
      </NavLink>
    ));

  return (
    <header className={`nav ${menuOpen ? "nav-open" : ""}`}>
      <div className="nav-inner">
        <div className="nav-left">
          <Link to="/" className="nav-logo" onClick={() => setMenuOpen(false)}>
            <img src={logo} alt="JobConnect" className="nav-logo-image" />
          </Link>
        </div>

        <button
          type="button"
          className="nav-toggle"
          aria-label="Toggle menu"
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          <span />
          <span />
          <span />
        </button>

        <nav className={`nav-menu${menuOpen ? " nav-menu-open" : ""}`}>
          <div className="nav-links">
            {renderLinks(baseLinks)}
            {isAuthenticated && renderLinks(roleLinks)}
          </div>

          <div className="nav-divider" aria-hidden="true" />

          <div className="nav-actions">
            {isAuthenticated ? (
              <>
                <NotificationDropdown />
                <NavLink
                  to="/profile"
                  className="nav-profile"
                  onClick={() => setMenuOpen(false)}
                >
                  <span className="nav-profile-label">{displayName}</span>
                  <span className="nav-profile-role">{roleLabel}</span>
                </NavLink>
                <button type="button" className="nav-button nav-button-outline" onClick={handleLogout}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login" className="nav-button nav-button-outline">
                  Log in
                </NavLink>
                <NavLink to="/register" className="nav-button nav-button-primary">
                  Sign up
                </NavLink>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}

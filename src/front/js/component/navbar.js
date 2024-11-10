import React from "react";
import { Link } from "react-router-dom";
import { VscGraph } from "react-icons/vsc";
import "/workspaces/PROYECTO-FINAL-REPO-FINAL/src/front/styles/navbar.css";

export const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-custom">
      <div className="container-fluid">
        {/* Brand */}
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <VscGraph className="navbar-icon" />
          <span className="Etitle navbar-title-highlight">E-</span><span className="text-white Vtitle">Vote</span>
        </Link>

        {/* Search form */}
        <form className="d-flex ms-auto navbar-search">
          <input
            className="form-control me-2 search-input"
            type="search"
            placeholder="Search surveys..."
            aria-label="Search"
          />
        </form>

        {/* Right elements */}
        <ul className="navbar-nav ms-auto flex-row align-items-center">
          <li className="nav-item">
            <Link className="nav-link d-flex align-items-center" to="/profile">
              <i className="fas fa-user fa-lg me-1"></i>
            </Link>
          </li>
          <li className="nav-item me-3">
            <Link className="nav-link" to="#">
              <i className="fas fa-bell fa-lg"></i>
            </Link>
          </li>
          <li className="nav-item me-3">
            <Link className="nav-link" to="#">
              <i className="fas fa-cog fa-lg navbar-settings-icon"></i>
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

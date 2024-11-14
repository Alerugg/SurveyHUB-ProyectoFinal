import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";
import { VscGraph } from "react-icons/vsc";
import "../../styles/navbar.css";

export const Navbar = () => {
  const { store, actions } = useContext(Context);
  const navigate = useNavigate();

  const handleLogout = () => {
    actions.logout();
    navigate("/"); // Redirige a la pantalla de inicio sin loguear
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-custom">
      <div className="container-fluid">
        {/* Brand */}
        <Link
          className="navbar-brand d-flex align-items-center"
          to={store.isAuthenticated ? "/user_logued" : "/"}
        >
          <VscGraph className="navbar-icon" />
          <span className="Etitle navbar-title-highlight">E-</span>
          <span className="text-white Vtitle">Vote</span>
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
          {store.isAuthenticated && store.user && (
            <li className="nav-item me-3">
              <span className="navbar-text">
                Welcome, {store.user.full_name}
              </span>
            </li>
          )}
          <li className="nav-item">
            <Link className="nav-link d-flex align-items-center" to="/profile">
              <i className="fas fa-user fa-lg me-1"></i>
            </Link>
          </li>
          {store.isAuthenticated && (
            <>
              <li className="nav-item">
                <button className="btn btn-logout nav-link" onClick={handleLogout}>
                  Logout
                </button>
              </li>
              <li className="nav-item me-3">
                <Link className="nav-link" to="/my_surveys">
                  <i className="fas fa-poll fa-lg"></i> My Surveys
                </Link>
              </li>
            </>
          )}
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

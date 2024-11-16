import React from "react";
import "../../styles/footer.css";

export const Footer = () => (
  <footer className="footer-container">
    {/* Grid container */}
    <div className="container p-4 pb-0 text-center">
      {/* Section: Social media */}
      <section className="mb-4">
        {/* Facebook */}
        <a
          className="btn text-white btn-floating m-1 facebook-btn"
          href="#!"
          role="button"
        >
          <i className="fab fa-facebook-f"></i>
        </a>

        {/* Twitter */}
        <a
          className="btn text-white btn-floating m-1 twitter-btn"
          href="#!"
          role="button"
        >
          <i className="fab fa-twitter"></i>
        </a>

        {/* Google */}
        <a
          className="btn text-white btn-floating m-1 google-btn"
          href="#!"
          role="button"
        >
          <i className="fab fa-google"></i>
        </a>

        {/* Instagram */}
        <a
          className="btn text-white btn-floating m-1 instagram-btn"
          href="#!"
          role="button"
        >
          <i className="fab fa-instagram"></i>
        </a>

        {/* Linkedin */}
        <a
          className="btn text-white btn-floating m-1 linkedin-btn"
          href="#!"
          role="button"
        >
          <i className="fab fa-linkedin-in"></i>
        </a>

        {/* Github */}
        <a
          className="btn text-white btn-floating m-1 github-btn"
          href="#!"
          role="button"
        >
          <i className="fab fa-github"></i>
        </a>
      </section>
      {/* Section: Social media */}
    </div>
    {/* Grid container */}

    {/* Copyright */}
    <div className="text-center p-3 footer-copyright">
      © 2024 Copyright: Alejandro Daniela Jhow Angela
    </div>
    {/* Copyright */}
  </footer>
);

import React from "react";
import { Link } from "react-router-dom";
import FadeInAnimation from "../components/animations/FadeInAnimation.jsx";
import "../css/Home.css"; // Import CSS for styling

export const Home = () => {
  return (
    <>
      <section className="home-first">
        <div className="home-first-intro">
          <h1>Welcome to Roomble!</h1>
          <p>
            Discover your perfect space with Roomble! Whether you're a tenant
            searching for a cozy home, a landlord managing properties, or
            someone looking for the ideal flatmate, Roomble makes it seamless
            and stress-free. Start your journey today!
          </p>
        </div>
      </section>

      <section className="home-second">
        <div className="home-second-features">
          <FadeInAnimation>
            <h2>Features</h2>
          </FadeInAnimation>
          <div className="home-second-features-list">
            <FadeInAnimation>
              <div className="home-second-features-item">
                <i className="fas fa-home"></i>
                <p>Find your dream home</p>
              </div>
            </FadeInAnimation>

            <FadeInAnimation>
              <div className="home-second-features-item">
                <i className="fas fa-user-friends"></i>
                <p>Connect with potential flatmates</p>
              </div>
            </FadeInAnimation>
            <FadeInAnimation>
              <div className="home-second-features-item">
                <i className="fas fa-building"></i>
                <p>Manage your properties</p>
              </div>
            </FadeInAnimation>
            <FadeInAnimation>
              <div className="home-second-features-item">
                <i className="fas fa-star"></i>
                <p>Read and Write Reviews</p>
              </div>
            </FadeInAnimation>
            <FadeInAnimation>
              <div className="home-second-features-item">
                <i className="fas fa-envelope"></i>
                <p>Send and Receive Messages</p>
              </div>
            </FadeInAnimation>
          </div>
        </div>
      </section>
      {localStorage.getItem("authtoken") === null && (
        <section className="home-third">
          <div className="home-third-cta">
            <FadeInAnimation>
              <h2>Ready to get started?</h2>
            </FadeInAnimation>
            <div className="home-third-buttons">
              <FadeInAnimation>
                <Link to="/signup-tenant" className="home-third-button">
                  Sign Up as Tenant
                </Link>
              </FadeInAnimation>
              <FadeInAnimation>
                <Link to="/signup-landlord" className="home-third-button">
                  Sign Up as Landlord
                </Link>
              </FadeInAnimation>
            </div>
          </div>
        </section>
      )}
    </>
  );
};

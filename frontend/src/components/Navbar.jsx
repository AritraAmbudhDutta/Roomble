import React, { useEffect, useContext } from "react";
import "../css/Navbar.css";
import { Basecontext } from "../context/base/Basecontext";
import { Link } from "react-router-dom";
import { socket } from "../socket";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const Navbar = () => {
  // Assume Basecontext provides a 'loading' state and possibly 'setLoading'
  const state = useContext(Basecontext);
  const { user, setUser, fetuser, loading } = state; // loading should be managed in your BaseState

  useEffect(() => {
    // Fetch the user data on component mount
    fetuser();
  }, []);

  useEffect(() => {
    // Handle socket connection when user is updated
    function handleConnection() {
      if (user && user._id) {
        socket.emit("user_connected", user._id);
      }
    }
    if (user && user._id) {
      handleConnection();
    }
    return () => {
      socket.off("connect", handleConnection);
    };
  }, [user]);

  return (
    <div className="navbar">

      <div className={loading ? "loading-flex" : "loading-none"}>
        <p>Loading...</p>
      </div>

      <div className="logo">
        <img src="/logo_nav.png" alt="logo" className="logo-img" />
      </div>
      <div className="menu">
        {user.type === "none" ? (
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/signup-tenant">Sign-Up as Tenant</Link></li>
            <li><Link to="/signup-landlord">Sign-Up as Landlord</Link></li>
            <li><Link to="/login">Login</Link></li>
          </ul>
        ) : user.type === "tenant" ? (
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/tenant-dashboard">Dashboard</Link></li>
            <li><Link to="/messages">Messages</Link></li>
            <li><Link to="/find-property">Find Property</Link></li>
            <li><Link to="/find-flatmate">Find Flatmate</Link></li>
          </ul>
        ) : (
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/landlord-dashboard">Dashboard</Link></li>
            <li><Link to="/add-property">Add Property</Link></li>
            <li><Link to="/messages">Messages</Link></li>
          </ul>
        )}
      </div>
      <div className="account-logo">
        {user.type === "none" ? (
          <>
            {/* Optionally add login/signup buttons here */}
          </>
        ) : (
          <Link to={user.type === "tenant" ? "/tenant-profile-page" : "/landlord-profile-page"}>
            <img src={state.user.Images} alt="account" className="account-img" />
          </Link>
        )}
      </div>
      {/* Include the ToastContainer if it's not already in your root component */}
      <ToastContainer />
    </div>
  );
};

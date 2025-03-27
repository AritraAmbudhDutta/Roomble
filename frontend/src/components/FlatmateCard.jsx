import React, { useState, useEffect, useContext } from "react";
import "../css/FlatMateCard.css";
import { Basecontext } from "../context/base/Basecontext";
import Swal from "sweetalert2";
import config from "../config.json";

const FlatmateCard = ({ 
  id, 
  name, 
  locality, 
  city, 
  gender, 
  smoke, 
  eatNonVeg, 
  pets, 
  compatibilityScore, 
  image, 
  isBookmarked,
  onBookmarkToggle,
  help
}) => {
  const [bookmarked, setBookmarked] = useState(isBookmarked);
  const { user } = useContext(Basecontext);

  useEffect(() => {
    setBookmarked(isBookmarked);
  }, [isBookmarked]);

  const handleBookmarkClick = async () => {
    if (help) {
      // If help is true, use the parent's onBookmarkToggle
      await onBookmarkToggle();
      setBookmarked(!bookmarked);
    } else {
      // If help is false, use the local toggleBookmark
      await toggleBookmark();
    }
  };

  const toggleBookmark = async () => {
    const confirmPopup = await Swal.fire({
      title: "Toggle Bookmark?",
      text: `Are you sure you want to ${bookmarked ? "remove" : "add"} this bookmark?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#8b1e2f",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    });

    if (!confirmPopup.isConfirmed) return;

    const newBookmarkState = !bookmarked;
    const token = localStorage.getItem("authtoken");
    const requestBody = {
      action: newBookmarkState ? "bookmark" : "unmark",
      thing: "flatmate",
      id,
    };

    if (!token) {
      alert("Authentication token is missing!");
      return;
    }

    try {
      const response = await fetch(`${config.backend}/api/Bookmarking_Routes/edit_bookmarks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authtoken: token,
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update bookmark");
      }

      setBookmarked(newBookmarkState);
    } catch (error) {
      console.error("Error updating bookmark:", error);
      alert(`Error: ${error.message}`);
    }
  };

  const handleView = () => {
    window.location.href = `/tenant/${id}`;
  };

  const score = Math.round(parseFloat(compatibilityScore) * 100) || 0;

  return (
    <div className="flatmate-card">
      <div className="card-header">
        <img src={image} alt={name} className="profile-pic" />
        <span className="flatmate-name">{name}</span>
        <span className="compatibility-score">
          <span className="star-icon">⭐</span> {score}%
        </span>
      </div>

      <div className="card-body">
        <p className="location-title">Preferred Location</p>
        <p className="location-text">
          {locality}, {city}
        </p>
      </div>

      <div className="card-footer">
        <button 
          className="bookmark-btn" 
          onClick={handleBookmarkClick} // Fixed: removed the () to prevent immediate invocation
        >
          {bookmarked ? (
            <svg width="40" height="40" viewBox="0 0 30 30" fill="#8b1e2f">
              <path d="M6 3c-1.1 0-2 .9-2 2v16l8-5 8 5V5c0-1.1-.9-2-2-2H6z"></path>
            </svg>
          ) : (
            <svg width="40" height="40" viewBox="0 0 30 30" fill="none" stroke="#8b1e2f" strokeWidth="2">
              <path d="M6 3c-1.1 0-2 .9-2 2v16l8-5 8 5V5c0-1.1-.9-2-2-2H6z"></path>
            </svg>
          )}
        </button>
        <button className="view-btn" onClick={handleView}>View</button>
      </div>
    </div>
  );
};

export default FlatmateCard;
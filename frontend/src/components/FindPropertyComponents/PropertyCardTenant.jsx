import React, { useEffect, useState } from "react";
import "../../css/PropertyCard.css";
import "../../css/PropertyCardTenant.css";
import { Link, useNavigate } from "react-router-dom";
import useDidMountEffect from "../../useDidMountEffect";
import { toast } from "react-toastify";
import config from "../../config.json";

const PropertyCardTenant = ({ image, price, title, location, bhk, onView, onBookMark, id, available }) => {
  const [bookmarked, setBookmarked] = useState(false);
  const [loading, setLoading] = useState(true); // Add a loading state
  const navigate = useNavigate();

  const toggleBookmark = () => {
    if (!loading) { // Prevent toggling while loading
      setBookmarked(!bookmarked);
    }
  };

  useEffect(() => {
    const fetchBookmarkStatus = async () => {
      try {
        const response = await fetch(`${config.backend}/api/BookMarking_Routes/check_bookmark`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'authtoken': localStorage.getItem('authtoken')
          },
          body: JSON.stringify({ id: id, thing: "property" })
        });
        const data = await response.json();
        if (data.success) {
          setBookmarked(data.bookmarked);
        }
      } catch (error) {
        console.error("Failed to fetch bookmark status:", error);
      } finally {
        setLoading(false); // Set loading to false after the request completes
      }
    };
    fetchBookmarkStatus();
  }, [id]);

  useEffect(() => {
    if (!loading) { // Only send requests after loading is complete
      const action = bookmarked ? "bookmark" : "unmark";
      fetch(`${config.backend}/api/BookMarking_Routes/edit_bookmarks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authtoken: localStorage.getItem("authtoken"),
        },
        body: JSON.stringify({ id: id, thing: "property", action }),
      }).catch((error) => {
        console.error("Failed to update bookmark status:", error);
      });
    }
  }, [bookmarked, loading, id]);

  return (
    <div className={`property-card ${available ? "" : "delisted"}`}>
      {/* Image Section */}
      <div className="image-container">
        <img src={image} alt={title} className={`imagprop ${available ? "" : "delisted"}`} />
      </div>

      {/* Details Section */}
      <div className="details">
        <p className="price">{price}</p>
        <p className="description">{location}</p>
        <p className="bhk">BHK: {bhk}</p>
      </div>

      {/* Buttons Section */}
      <div className="buttons">
        <button className={`bookmark-btn`} onClick={toggleBookmark} disabled={loading}>
          {bookmarked ? (
            <svg className="bookmark-svg" width="40" height="40" viewBox="0 0 30 30" fill="#8b1e2f">
              <path d="M6 3c-1.1 0-2 .9-2 2v16l8-5 8 5V5c0-1.1-.9-2-2-2H6z"></path>
            </svg>
          ) : (
            <svg className="bookmark-svg" width="40" height="40" viewBox="0 0 30 30" fill="none" stroke="#8b1e2f" strokeWidth="2">
              <path d="M6 3c-1.1 0-2 .9-2 2v16l8-5 8 5V5c0-1.1-.9-2-2-2H6z"></path>
            </svg>
          )}
        </button>
        <Link className={`view-button ${available ? "" : "delisted"}`} target="_blank" to={`/property/${id}`}>View</Link>
      </div>
    </div>
  );
};

export default PropertyCardTenant;
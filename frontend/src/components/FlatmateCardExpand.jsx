import React, { useState, useEffect } from "react";
import "../css/FlatmateCardExpand.css";
import { BsBookmark, BsBookmarkFill, BsChatDots, BsStar } from "react-icons/bs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaw, faLeaf, faDrumstickBite, faWineGlassAlt, faBan, faMars, faVenus } from "@fortawesome/free-solid-svg-icons"; // Import icons
import { useNavigate, useParams } from "react-router-dom";
import useDidMountEffect from "../useDidMountEffect";
import { Rating } from "@mui/material";
import config from "../config.json";
import Swal from "sweetalert2";

const FlatmateCardExpand = () => {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [reviews, setReviews] = useState([
    {
      name: "Loading...",
      rating: 0,
      comment: "Loading...",
      image: "/sampleUser_Img.png",
    },
  ]);
  const [user, setUser] = useState({
    name: "Loading...",
    city: "Loading...",
    locality: "Loading...",
    description: "Loading...",
    gender: null,
    smoke: null,
    veg: null,
    pets: null,
    Images: `${config.backend}/Pictures/Default.png`,
  });
  const navigate = useNavigate();
  const params = useParams();

  useEffect(() => {
    const fetchbookmarkstatus = async () => {
      const response = await fetch(`${config.backend}/api/BookMarking_Routes/check_bookmark`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authtoken: localStorage.getItem("authtoken"),
        },
        body: JSON.stringify({ id: params.id, thing: "flatmate" }),
      });
      const data = await response.json();
      if (data.success) {
        setIsBookmarked(data.bookmarked);
      }
    };
    fetchbookmarkstatus();
  }, [params.id]);

  useEffect(() => {
    const id = params.id;
    const token = localStorage.getItem("authtoken");

    const fetchUser = async () => {
      try {
        const response = await fetch(`${config.backend}/api/view_profiles/other_users`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authtoken: token,
            accounttype: "tenant",
          },
          body: JSON.stringify({ requested_id: id, accounttype: "tenant" }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error(`Error: ${response.status} - ${response.statusText}`, errorData);
          return;
        }

        const data = await response.json();

        if (data.success) {
          setUser(data);
        } else {
          console.log("Failed to fetch user");
        }
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };
    fetchUser();

    const fetchReviews = async () => {
      try {
        const response = await fetch(`${config.backend}/api/reviews/reviewee`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ reviewee: id }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error(`Error: ${response.status} - ${response.statusText}`, errorData);
          return;
        }

        const data = await response.json();

        if (data.success) {
          setReviews(data.reviews);
        } else {
          console.log("Failed to fetch reviews");
        }
      } catch (err) {
        console.error("Error fetching reviews:", err);
      }
    };
    fetchReviews();
  }, [params.id]);

  useDidMountEffect(() => {
    if (isBookmarked) {
      fetch(`${config.backend}/api/BookMarking_Routes/edit_bookmarks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authtoken: localStorage.getItem("authtoken"),
        },
        body: JSON.stringify({ action: "bookmark", thing: "flatmate", id: params.id }),
      });
    } else {
      fetch(`${config.backend}/api/BookMarking_Routes/edit_bookmarks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authtoken: localStorage.getItem("authtoken"),
        },
        body: JSON.stringify({ action: "unmark", thing: "flatmate", id: params.id }),
      });
    }
  }, [isBookmarked]);

  // Updated: Confirmation popup for bookmark toggling.
  const handleBookmarkClick = async () => {
    const confirmPopup = await Swal.fire({
      title: (isBookmarked?"Remove" :"Add") + " Bookmark?",
      text: "Are you sure you want to " + (isBookmarked?"remove":"add") + " this bookmark?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, "+(isBookmarked?"remove":"add") +" it!",
      cancelButtonText: "Cancel",
    });
    if (confirmPopup.isConfirmed) {
      setIsBookmarked(!isBookmarked);
    }
  };

  const handleMessageClick = async () => {
    const response = await fetch(`${config.backend}/messages/createConversation`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authtoken: localStorage.getItem("authtoken"),
      },
      body: JSON.stringify({ user2: params.id }),
    });
    const data = await response.json();
    if (data.success) {
      navigate("/chat/" + data.conversation_id);
    } else {
      console.log("Failed to create conversation");
    }
  };

  const handleReviewClick = () => {
    navigate(`/review/${params.id}`);
  };

  if (!user || Object.keys(user).length === 0) {
    return <p>No user data found.</p>;
  }

  return (
    <>
      <section className="fce-container">
        {/* Left Side: Profile Information */}
        <div className="fce-profile-info">
          <h2>Profile Information</h2>
          <ul>
            <li><strong>Name:</strong> {user.name}</li>
            <li><strong>City:</strong> {user.city}</li>
            <li><strong>Locality:</strong> {user.locality}</li>
            <li>
              <strong>Gender:</strong> {user.gender ? "Male" : "Female"}{" "}
              <FontAwesomeIcon icon={user.gender ? faMars : faVenus} style={{ color: "#7D141D", marginLeft: "5px" }} />
            </li>
            <li>
              <strong>Do you drink or smoke?</strong> {user.smoke ? "Yes" : "No"}{" "}
              <FontAwesomeIcon icon={user.smoke ? faWineGlassAlt : faBan} style={{ color: "#7D141D", marginLeft: "5px" }} />
            </li>
            <li>
              <strong>Food Preferences:</strong> {user.veg ? "Vegetarian" : "Non-Vegetarian"}{" "}
              <FontAwesomeIcon icon={user.veg ? faLeaf : faDrumstickBite} style={{ color: "#7D141D", marginLeft: "5px" }} />
            </li>
            <li>
              <strong>Do you have a pet?</strong> {user.pets ? "Yes" : "No"}{" "}
              <FontAwesomeIcon icon={user.pets ? faPaw : faBan} style={{ color: "#7D141D", marginLeft: "5px" }} />
            </li>
          </ul>
        </div>

        {/* Right Side: Profile Description */}
        <div className="fce-right-side">
          <div className="fce-profile-description">
            <div className="fce-profile-header">
              <div className="fce-profile-text">
                <h3>{user.name}</h3>
                <p>{user.gender ? "Male" : "Female"}</p>
              </div>
              <img className="fce-profile-img" src={user.Images} alt={`${user.name} Profile`} />
            </div>
            <p>{user.description === "" ? "This user hasn't setup a description yet" : user.description}</p>

            <div className="fce-action-buttons">
              <div className="fce-bookmark-section" onClick={handleBookmarkClick}>
                {isBookmarked ? (
                  <BsBookmarkFill className="fce-bookmark-icon filled" />
                ) : (
                  <BsBookmark className="fce-bookmark-icon" />
                )}
              </div>

              <button className="fce-message-btn" onClick={handleReviewClick}>
                <BsStar className="fce-star-icon" /> Review
              </button>
              <button className="fce-message-btn" onClick={handleMessageClick}>
                <BsChatDots className="fce-message-icon" /> Message
              </button>
            </div>
          </div>
        </div>
      </section>
      <section className="reviews">
        <h2>Reviews</h2>
        <div className="reviews-container">
          {reviews.map((review, index) => (
            <div className="reviews1" key={index}>
              <div className="reviews-user-details">
                <div className="reviews-user-image">
                  <img src={review.reviewerimage} alt="" />
                </div>
                <div className="reviews-user-name">
                  <b>{review.reviewername}</b>
                  <div className="reviews-rating">
                    <Rating name="half-rating" value={review.rating} precision={1} size="small" readOnly />
                  </div>
                </div>
              </div>
              <div className="reviews-comment">{review.comment}</div>
            </div>
          ))}
          {reviews.length === 0 && <p>No reviews posted.</p>}
        </div>
      </section>
    </>
  );
};

export default FlatmateCardExpand;

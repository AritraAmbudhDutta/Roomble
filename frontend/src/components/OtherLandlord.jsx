import React, { useEffect, useState } from "react";
import "../css/LandlordProfileStyles/LandlordProfile.css";
import PropertyCard from "./LandlordDashboard/PropertyCard.jsx";
import { useNavigate, useParams } from "react-router-dom";
import { Rating } from "@mui/material";
import { toast } from "react-toastify";
import config from "../config.json";

const OtherLandlord = () => {
  const [respData, setRespData] = useState({
    name: "",
    email: "",
    message: "",
    Properties: [],
    Images: "",
  });
  const navigate = useNavigate();
  const params = useParams();
  const [reviews, setReviews] = useState([{
    reviewername: '',
    reviewerimage: '',
    rating: 0,
    comment: ''
  }]);

  const [somethingwentwrong, setSomethingwentwrong] = useState(false);

  const handleView = () => {
    navigate("/prop-display ");
  };
  const token = localStorage.getItem("authtoken");
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${config.backend}/api/view_profiles/other_users`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ requested_id: params.id, accounttype: "landlord" }),
          }
        );
        const data = await response.json();
        if (data.success) {
          setRespData(data.data);
        } else {
          setSomethingwentwrong(true);
        }
      } catch (error) {
        setSomethingwentwrong(true);
      }
    };

    fetchData();

    const fetchReviews = async () => {
      try{
        const response = await fetch(`${config.backend}/api/reviews/reviewee`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ reviewee: params.id })
        });
        const data = await response.json();
        if (data.success) {
          setReviews(data.reviews);
        }
        else{
          setSomethingwentwrong(true);
        }
      }
      catch(error){
        setSomethingwentwrong(true);
      }
    }
    fetchReviews();

  }, []);

  const messageclick = async () => {
    try{
      const response = await fetch(`${config.backend}/messages/createConversation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'authtoken': localStorage.getItem('authtoken')
        },
        body: JSON.stringify({ user2: params.id })
      });
      const data = await response.json();
      if (data.success) {
        navigate('/chat/' + data.conversation_id);
      } else {
        setSomethingwentwrong(true);
      }
    }
    catch(error){
      setSomethingwentwrong(true);
    }
  };

  const reviewclick = () => {
    navigate('/review/' + params.id);
  };

  const redirectto = (type, id) => {
    if (type === 'tenant') {
      return () => navigate('/tenant/' + id);
    } else {
      return () => navigate('/landlord/' + id);
    }
  };

  useEffect(()=>{
    if(somethingwentwrong){
      toast.error('Something went wrong. Please try again later.');
      navigate(-1)
    }
  }, [somethingwentwrong]);

  if (!respData) {
    return <div className="landlord-profile-loading">Loading...</div>;
  }

  return (
    <>
      <div className="landlord-profile-container">
        {/* Combined Profile & Properties Section */}
        <div className="landlord-profile-content">
          <div className="landlord-profile-header">
            <img
              src={respData.Images}
              alt="Profile"
              className="landlord-profile-image"
            />
            <div className="landlord-profile-details">
              <div className="landlord-profile-item">
                <div className="landlord-profile-name">
                  <p>
                    <span className="label">Full Name</span>{" "}
                    <span className="separator">:</span>
                    <span className="value">{respData.name}</span>
                  </p>
                </div>
                <div className="landlord-profile-email">
                  <p>
                    <span className="label">Email Address</span>{" "}
                    <span className="separator">:</span>
                    <span className="value">{respData.email}</span>
                  </p>
                </div>
                <div className="landlord-profile-propCount">
                  <p>
                    <span className="label">Properties Count</span>{" "}
                    <span className="separator">:</span>
                    <span className="value">{respData.message}</span>
                  </p>
                </div>

                <div className="landlord-profile-buttons">
                  <button
                    className="landlord-profile-edit-button"
                    onClick={messageclick}
                  >
                    Message
                  </button>
                  <button
                    className="landlord-profile-edit-button"
                    onClick={reviewclick}
                  >
                    Review
                  </button>
                  {/* <button
                  className="landlord-profile-delete-button"
                  onClick={handleDelete}
                >
                  Delete
                </button> */}
                </div>
              </div>
            </div>
          </div>

          {/* Properties Section (Still Inside the Same Container) */}
          <div className="landlord-profile-properties">
            {respData.Properties.map(({ _id, town, bhk, price, Images, available }) => (
              <PropertyCard
                key={_id}
                image={Images[0]}
                price={price}
                title="Prop Card"
                location={town}
                bhk={bhk}
                id={_id}
                available={available}
              />
            ))}
          </div>
        </div>
      </div>

      <section className='reviews'>
        <h2>Reviews</h2>
        <div className='reviews-container'>
          {reviews.map((review, index) => (
            <div className="reviews1" key={index}>
              <div className="reviews-user-details" onClick={redirectto(review.reviewertype, review.reviewer)}>
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
              <div className="reviews-comment">
                {review.comment}
              </div>
            </div>
          ))}
          {reviews.length === 0 && <p>No reviews posted.</p>}
        </div>
      </section>
    </>
  );
};

export default OtherLandlord;

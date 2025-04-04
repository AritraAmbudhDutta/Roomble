import React, { useEffect, useState, useContext } from "react";
import "../../css/LandlordProfileStyles/LandlordEditProfile.css";
import logo from "../../../public/sampleUser_img.png";
import { Basecontext } from "../../context/base/Basecontext";
import { useNavigate } from "react-router-dom";
import config from "../../config.json";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

const LandlordEditProfile = () => {
  const navigate = useNavigate();
  const state = useContext(Basecontext);
  const { user, setUser, fetuser } = state;
  fetuser();
  const [file, setFile] = useState(null);
  const token = localStorage.getItem("authtoken");
  const [somethingwentwrong, setSomethingwentwrong] = useState(false);

  const [formData, setFormData] = useState({
    name: state.user.name,
    email: state.user.email,
    accounttype: state.user.type,
    remove: "",
  });

  useEffect(() => {
    setFormData({
      name: state.user.name,
      email: state.user.email,
      accounttype: state.user.type,
      remove: "",
    });
  }, [user]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Popup to inform user that email is not editable
  const handleEmailClick = (e) => {
    e.preventDefault();
    Swal.fire({
      title: "Not Editable",
      text: "You cannot edit your email address.",
      icon: "info",
      confirmButtonText: "Ok",
    });
  };

  useEffect(() => {
    if (somethingwentwrong) {
      toast.error("Something went wrong. Please try again later.");
      navigate(-1);
    }
  }, [somethingwentwrong]);

  // NEED TO SEND DATA TO BACKEND FROM HERE
  const handleSubmit = async () => {
    const formDataCopy = new FormData(); // Create a FormData object

    // Append text fields to FormData
    Object.keys(formData).forEach((key) => {
      formDataCopy.append(key, formData[key]);
    });

    // Append the file (if any)
    if (file) {
      formDataCopy.append("image", file);
    }
    try {
      const response = await fetch(
        `${config.backend}/api/updates/updateProfile`,
        {
          method: "POST",
          body: formDataCopy,
          headers: {
            authtoken: token,
            accounttype: "landlord",
          },
        }
      );
      const data = await response.json();
      if (data.success) {
        console.log("Form submitted successfully");
        navigate("/landlord-profile-page");
        window.location.reload();
      } else {
        console.error("Failed to submit form");
        setSomethingwentwrong(true);
      }
    } catch (error) {
      console.error("Error:", error);
      setSomethingwentwrong(true);
    }
  };

  return (
    <div className="landlord-edit-container">
      {/* Header Section */}
      <div className="landlord-edit-header">
        <div className="landlord-edit-profile">
          <label htmlFor="landlord-edit-image-upload">
            <img
              src={state.user.Images || "https://via.placeholder.com/80"}
              alt="Profile"
              className="landlord-edit-profile-img"
            />
          </label>
          <input
            type="file"
            id="image_input"
            accept="image/png, image/gif, image/jpeg, image/jpg"
            onChange={(e) => {
              setFile(e.target.files[0]);
            }}
          />

          <div className="landlord-edit-info">
            <h2>{state.user.name}</h2>
            <p>{state.user.email}</p>
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div className="landlord-edit-form">
        {/* Left Side */}
        <div className="name">
          <span>
            Full Name <br />
            <br />
            Enter new name
            <br />
            <br />
          </span>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
          />
        </div>
        <div className="email-addr">
          <span>
            Email Address <br />
            <br />
          </span>
          <input
            type="email"
            value={formData.email}
            name="email"
            onClick={handleEmailClick}
            readOnly
          />
        </div>
      </div>
      <div className="edtbttn">
        <button className="landlord-edit-btn" onClick={handleSubmit}>
          Save
        </button>
      </div>
    </div>
  );
};

export default LandlordEditProfile;

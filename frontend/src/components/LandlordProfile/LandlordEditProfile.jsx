import React, { useEffect, useState, useContext } from "react";
import "../../css/LandlordProfileStyles/LandlordEditProfile.css";
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

  const handleSubmit = async () => {
    const formDataCopy = new FormData();
    Object.keys(formData).forEach((key) => {
      formDataCopy.append(key, formData[key]);
    });
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
        navigate("/landlord-profile-page");
        window.location.reload();
      } else {
        setSomethingwentwrong(true);
      }
    } catch (error) {
      setSomethingwentwrong(true);
    }
  };

  return (
    <div className="landlord-edit-container">
      <div className="landlord-edit-header">
        <label htmlFor="image_input" className="image-wrapper">
          <img
            src={state.user.Images || "https://via.placeholder.com/200"}
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

      <div className="landlord-edit-form">
        <div className="form-group">
          <label>Full Name</label>
          <input
            type="text"
            name="name"
            placeholder="Enter new name"
            value={formData.name}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-group">
          <label>Email Address</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onClick={handleEmailClick}
            readOnly
          />
        </div>

        <button className="landlord-edit-btn" onClick={handleSubmit}>
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default LandlordEditProfile;

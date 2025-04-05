import React, { useEffect, useState } from "react";
import PropertyCard from "./PropertyCard";
import "../../css/LandlordDashboard.css";
import config from "../../config.json";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const [Properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [somethingwentwrong, setSomethingwentwrong] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProperties = async () => {
      const token = localStorage.getItem("authtoken");
      try {
        const response = await fetch(
          `${config.backend}/api/view_profiles/Self_profile`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              authtoken: token,
              accounttype: "landlord",
            },
          }
        );
        const data = await response.json();
        if (!data.success) setSomethingwentwrong(true);
        setProperties(data.Properties);
      } catch (error) {
        setError(error);
        setSomethingwentwrong(true);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  useEffect(() => {
    if (somethingwentwrong) {
      toast.error("Something went wrong. Please try again later.");
      navigate(-1);
    }
  }, [somethingwentwrong]);

  const propertyList = Properties.map((item) => ({
    title: "Flat",
    image: item.Images[0],
    price: item.price,
    bhk: item.bhk,
    location: item.town,
    id: item._id,
    available: item.available,
  }));

  return (
    <div className="landlord-dashboard-container">
      <div className="landlord-dashboard-header">
        <h1>Your Properties</h1>
        <div className="landlord-dashboard-underline" />
      </div>

      {loading ? (
  <div className="landlord-dashboard-loading-text">Loading properties...</div>
) : propertyList.length === 0 ? (
  <div className="landlord-dashboard-no-properties-wrapper">
  <div className="landlord-dashboard-no-properties">
    <img
      src="./house_when_page_empty.png"
      alt="No properties"
      className="landlord-dashboard-empty-image"
    />
    <h2 className="landlord-dashboard-empty-title">No Properties Yet</h2>
    <p className="landlord-dashboard-empty-subtitle">
      Looks like you haven’t added any properties. <br />
      Start listing to see them here!
    </p>
  </div>
  </div>
) : (
  <div className="landlord-dashboard-property-grid">
    {propertyList.map((property, index) => (
      <PropertyCard
        key={index}
        {...property}
        onView={() => console.log(`Viewing ${property.title}`)}
        onDelete={() => console.log(`Deleting ${property.title}`)}
      />
    ))}
  </div>
)}
    </div>
  );
};

export default HomePage;

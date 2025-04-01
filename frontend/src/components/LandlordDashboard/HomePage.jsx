import React, { useEffect, useState, useContext } from "react";
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
  // const state = useContext(Basecontext);
  // const { user, setUser, fetuser } = state;
  // fetuser();

  useEffect(() => {
    const fetchProperties = async () => {
      const token = localStorage.getItem("authtoken");
      try {
        // toast.success("Fetching Data");
        const response = await fetch(
          `${config.backend}/api/view_profiles/Self_profile`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              authtoken: token,
              accounttype: `landlord`,
            },
          }
        );
        const data = await response.json();
        if (!data.success) {
          setSomethingwentwrong(true);
        }

        setProperties(data.Properties);
      } catch (error) {
        setError(error);
        console.log(`Error from Landlord Dashboard in frontend`);
        setSomethingwentwrong(true);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  const properties = [];

  for (let item of Properties) {
    let newth = {};
    newth.title = "Flat";
    newth.image = item.Images[0];
    newth.price = item.price;
    newth.bhk = item.bhk;
    newth.location = item.town;
    newth.id = item._id;
    newth.available = item.available;
    properties.push(newth);
  }
  useEffect(() => {
    if (somethingwentwrong) {
      toast.error("Something went wrong. Please try again later.");
      navigate(-1);
    }
  }, [somethingwentwrong]);
  return (
    <div className="page">
      <div className="properties-section">
        <h2 className="properties-heading">Your Properties</h2>

        <div className="heading-underline"></div>
        <p className="err-msg">
          {properties.length === 0 ? "No properties to show" : ""}
        </p>
        <div className="property-cards-container">
          {properties.map((property, index) => (
            <PropertyCard
              key={index}
              {...property}
              onView={() => console.log(`Viewing ${property.title}`)}
              onDelete={() => console.log(`Deleting ${property.title}`)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;

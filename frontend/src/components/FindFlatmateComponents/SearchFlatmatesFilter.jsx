import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../css/FindPropertyStyles/SearchArea.css";
import config from "../../config.json";
import { toast } from "react-toastify";

function SearchFlatmatesFilter({ setFlatmates }) {
  const [city, setCity] = useState("");
  const [locality, setLocality] = useState("");
  const [somethingWentWrong, setSomethingWentWrong] = useState(false);
  const [filters, setFilters] = useState({
    smokeDrink: null,
    pets: null,
    eatNonVeg: null,
    gender: null,
  });

  const navigate = useNavigate();

  const handleFilterChange = (filter, value) => {
    setFilters((prevFilters) => ({ ...prevFilters, [filter]: value }));
  };

  const handleApplyChanges = async () => {
    const token = localStorage.getItem("authtoken");

    const queryParams = new URLSearchParams();
    if (locality) queryParams.append("locality", locality);
    if (city) queryParams.append("city", city);

    // Ensure all filters are appended
    if (filters.gender !== null)
      queryParams.append("gender", filters.gender ? "true" : "false");
    if (filters.smokeDrink !== null)
      queryParams.append("smoke", filters.smokeDrink ? "true" : "false");
    if (filters.eatNonVeg !== null)
      queryParams.append("veg", filters.eatNonVeg ? "false" : "true");
    if (filters.pets !== null)
      queryParams.append("pets", filters.pets ? "true" : "false");

    try {
      const response = await fetch(
        `${config.backend}/api/Search_Routes/SearchFlatmates?${queryParams.toString()}`,
        {
          method: "GET",
          headers: {
            authtoken: token,
            accounttype: "tenant",
          },
        }
      );

      const data = await response.json();

      if (data.success) {
        setFlatmates(data.data);
        if (data.data.length > 0) {
          // toast.success("Flatmates found!");
        } else {
          toast.info("No results found.");
        }
      } else {
        console.error("Error:", data.message);
        setSomethingWentWrong(true);
      }
    } catch (error) {
      console.error("Request failed:", error);
      setSomethingWentWrong(true);
    }
  };

  const handleClearChanges = () => {
    setCity("");
    setLocality("");
    setFilters({
      smokeDrink: null,
      pets: null,
      eatNonVeg: null,
      gender: null,
    });
    setFlatmates([]);
    handleApplyChanges();
  };

  useEffect(() => {
    handleApplyChanges();
  }, []);

  useEffect(() => {
    if (somethingWentWrong) {
      toast.error("Something went wrong. Please try again.");
      navigate(-1);
    }
  }, [somethingWentWrong, navigate]);

  return (
    <div className="search-prop-container">
      <h1 style={{ paddingLeft: "20px", paddingTop: "20px" }}>Filters</h1>

      {/* City Filter */}
      <div className="city-search-container">
        <label>City</label>
        <select value={city} onChange={(e) => setCity(e.target.value)}>
          <option value="">Select City</option>
          <option value="Mumbai">Mumbai</option>
        </select>
      </div>

      {/* Locality Filter */}
      <div className="locality-search-container">
        <label>Locality</label>
        <select value={locality} onChange={(e) => setLocality(e.target.value)}>
          <option value="">Select Locality</option>
          <option value="Andheri">Andheri</option>
          <option value="Bandra">Bandra</option>
          <option value="Juhu">Juhu</option>
          <option value="Malad">Malad</option>
          <option value="Kandivali">Kandivali</option>
          <option value="Borivali">Borivali</option>
          <option value="Dahisar">Dahisar</option>
          <option value="Mira Road">Mira Road</option>
          <option value="Thane">Thane</option>
          <option value="Goregaon">Goregaon</option>
        </select>
      </div>

      {/* Filters */}
      <div className="filter-options">
          {/* Gender Filter */}
          <div className="filter-row">
            <span className="filter-label">Gender</span>
            <div className="filter-choices">
              <label className="custom-radio">
                <input
                  type="radio"
                  name="gender"
                  value="true"
                  checked={filters.gender === true}
                  onChange={() => handleFilterChange("gender", true)}
                />
                <span className="radio-btn">Male</span> 
              </label>
              <label className="custom-radio">
                <input
                  type="radio"
                  name="gender"
                  value="false"
                  checked={filters.gender === false}
                  onChange={() => handleFilterChange("gender", false)}
                />
                <span className="radio-btn">Female</span>
              </label>
            </div>
          </div>

        {[
          { label: "Smokes/Drinks", key: "smokeDrink" },
          { label: "Has Pets", key: "pets" },
        ].map(({ label, key }) => (
          <div key={key} className="filter-row">
            <span className="filter-label">{label}</span>
            <div className="filter-choices">
              <label className="custom-radio">
                <input
                  type="radio"
                  name={key}
                  value="true"
                  checked={filters[key] === true}
                  onChange={() => handleFilterChange(key, true)}
                />
                <span className="radio-btn">Yes</span>
              </label>
              <label className="custom-radio">
                <input
                  type="radio"
                  name={key}
                  value="false"
                  checked={filters[key] === false}
                  onChange={() => handleFilterChange(key, false)}
                />
                <span className="radio-btn">No</span>
              </label>
            </div>
          </div>
        ))}

        {/* Veg/Non-Veg Filter */}
        <div className="filter-row">
            <span className="filter-label">Food Preferences</span>
            <div className="filter-choices">
              <label className="custom-radio">
                <input
                  type="radio"
                  name="eatNonVeg"
                  value="false"
                  checked={filters.eatNonVeg === false}
                  onChange={() => handleFilterChange("eatNonVeg", false)}
                />
                <span className="radio-btn">Veg</span>
              </label>
              <label className="custom-radio">
                <input
                  type="radio"
                  name="eatNonVeg"
                  value="true"
                  checked={filters.eatNonVeg === true}
                  onChange={() => handleFilterChange("eatNonVeg", true)}
                />
                <span className="radio-btn">Non-Veg</span>
              </label>
            </div>
          </div>
        </div>

      <div className="search-prop-buttons">
        <button onClick={handleApplyChanges}>Apply</button>
        <button onClick={handleClearChanges}>Clear filters</button>
      </div>
    </div>
  );
}

export default SearchFlatmatesFilter;

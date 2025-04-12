

/**
 * SearchArea Component
 * 
 * This component provides a user interface for filtering properties based on various criteria such as city,
 * locality, price range, area range, and the number of BHKs (bedrooms, hall, kitchen).
 * It allows users to apply or clear filters and dynamically updates the filtered properties based on the selected options.
 * 
 */

import React,{useState} from "react";
import "../../css/FindPropertyStyles/SearchArea.css";
import RangeSlider from "react-range-slider-input";
import "react-range-slider-input/dist/style.css";

function SearchArea({
  city,
  setCity,
  locality,
  setLocality,
  BHK,
  setBHK,
  values,
  setValues,
  area,
  setArea,
  handleSliderChange,
  handleAreaChange,
  handleApplyChanges,
  handleClearChanges,
  properties = [], // Default to an empty array if not provided
}) {
  // Define BHK options with a custom value for "More"
  const bhkOptions = [
    { label: "1 BHK", value: 1 },
    { label: "2 BHK", value: 2 },
    { label: "3 BHK", value: 3 },
    { label: "More", value: "more" },
  ];

  const [error,setError]= useState("");

  // Handler to add/remove filter options
  const handleBHKChange = (value) => {
    if (BHK.includes(value)) {
      setBHK(BHK.filter((bhk) => bhk !== value));
    } else {
      setBHK([...BHK, value]);
    }
  };

  // Filtering logic for properties
  const filteredProperties = properties.filter((property) => {
    // If no BHK filters are applied, show all properties
    if (BHK.length === 0) return true;

    // Check if property matches any selected BHK filter
    return BHK.some((filterValue) => {
      if (filterValue === "more") {
        return property.bhk >= 5;
      } else {
        return property.bhk === filterValue;
      }
    });
  });

  return (
    <div className="search-prop-container">
      <h1>Filters</h1>

      {/* City Filter */}
      <div className="city-search-container">
        <label>City</label>
        <select value={city} onChange={(e) => {
          const selectedCity = e.target.value;
          setCity(e.target.value);
          if (selectedCity === "") {
            setLocality(""); // Reset locality if city is cleared
            setError("Please select a city first");
          } else {
            setLocality(""); // Reset locality if city is selected
            setError("");
          }
          }}>
          <option value="">Select City</option>
          <option value="Mumbai">Mumbai</option>
        </select>
      </div>

      {/* Locality Filter */}
      <div className="locality-search-container">
        <label>Locality</label>
        <select value={locality} 
          onMouseDown={(e) => {
            if (!city) {
              e.preventDefault(); //  prevents the dropdown from opening
              setError("Please select a city first");
            }
          }}
          onChange={(e) => setLocality(e.target.value)}>
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
      {/* Error message for locality selection */}
      {error && <p className="locality-error-message">{error}</p>}

      {/* Price Range Filter */}
      <div className="price-range-container">
        <label>Price Range</label>
        <div className="price-range-values">
          <p>
            ₹{values[0]} - ₹{values[1]}
          </p>
        </div>
        <RangeSlider
          min={0}
          max={100000}
          step={250}
          value={values}
          onInput={handleSliderChange}
        />
      </div>

      {/* Area Range Filter */}
      <div className="area-range-container">
        <label>Area Range</label>
        <div className="area-range-values">
          <p>
            {area[0]} sqft - {area[1]} sqft
          </p>
        </div>
        <RangeSlider
          min={0}
          max={10000}
          step={50}
          value={area}
          onInput={handleAreaChange}
        />
      </div>

      {/* BHK Filter */}
      <div className="BHK-container">
        <label>Number of BHK</label>
        {bhkOptions.map(({ label, value }) => (
          <div key={value} className="BHK-checkbox">
            <input
              type="checkbox"
              checked={BHK.includes(value)}
              onChange={() => handleBHKChange(value)}
            />
            <label>{label}</label>
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="search-prop-buttons">
        <button onClick={handleApplyChanges}>Apply</button>
        <button onClick={handleClearChanges}>Clear filters</button>
      </div>

      {/* Example display of filtered properties */}
      {/* Uncomment to display filtered properties */}
      {/* 
      <div className="filtered-properties">
        <h2>Filtered Properties</h2>
        {filteredProperties.map((property) => (
          <div key={property.id} className="property-item">
            <p>
              {property.name} - {property.bhk} BHK
            </p>
          </div>
        ))}
      </div> 
      */}
    </div>
  );
}

export default SearchArea;

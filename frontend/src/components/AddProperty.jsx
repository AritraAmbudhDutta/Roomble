
/**
 * This component provides a form for landlords to add a new property listing. 
 * It includes fields for uploading photos, entering property details (e.g., BHK, area, rent, address, etc.), 
 * selecting a city and location, and picking a location on a map. 
 * The form validates user input and submits the data to the backend API.
 */

import React, { useState, useEffect } from 'react';
import DragAndDrop from './AddPropertyComponents/DragAndDrop';
import "../css/AddPropertyStyles/AddProperty.css";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import FadeInAnimation from '../components/animations/FadeInAnimation';
import config from "../config.json";
import { APIProvider, Map, AdvancedMarker, useMap } from "@vis.gl/react-google-maps";

function AddProperty() {
    // Initial state for the form
    const initialFormState = {
        photos: [],
        description: "",
        bhk: "",
        area: "",
        rent: "",
        city: "",
        location: "",
        address: "",
        amenities: "",
    };

    // State variables
    const [formData, setFormData] = useState(initialFormState); // Form data
    const [images, setImages] = useState([]); // Uploaded images
    const [errors, setErrors] = useState({}); // Form validation errors
    const [somethingwentwrong, setSomethingwentwrong] = useState(false); // Error flag
    const navigate = useNavigate(); // Navigation hook
    const notify = (message) => toast(message); // Toast notification function

    // Function to update form data
    const updateFormData = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    // State for selected location on the map
    const [selectedLocation, setSelectedLocation] = useState({ lat: 19.0760, lng: 72.8777 }); // Default: New Delhi

    // Function to update location on map click
    const handleMapClick = (event) => {
        setSelectedLocation({
            lat: event.detail.latLng.lat,
            lng: event.detail.latLng.lng,
        });
    };

    // Form validation function
    const validateForm = () => {
        let newErrors = {};

        // Validate required fields
        if (images.length === 0) newErrors.photos = "At least one photo is required.";
        if (!formData.bhk || isNaN(formData.bhk)) newErrors.bhk = "BHK is required and must be a number.";
        if (!formData.area || isNaN(formData.area)) newErrors.area = "Area is required and must be a number.";
        if (!formData.rent || isNaN(formData.rent)) newErrors.rent = "Rent is required and must be a number.";
        if (!formData.address.trim()) newErrors.address = "Address is required.";
        if (!formData.city) newErrors.city = "Please select a city.";
        if (!formData.location) newErrors.location = "Please select a location.";

        setErrors(newErrors); // Update errors state
        return Object.keys(newErrors).length === 0; // Return true if no errors
    };

    // Effect to handle error state
    useEffect(() => {
        if (somethingwentwrong) {
            toast.error('Something went wrong. Please try again later.');
            navigate(-1); // Navigate back
        }
    }, [somethingwentwrong]);

    // Function to handle form submission
    const handleSubmit = async () => {
        // Validate form before submission
        if (!validateForm()) return;

        console.log("Final Form Data:", formData);

        const formDataToSend = new FormData();

        // Append text fields to FormData
        formDataToSend.append("description", formData.description);
        formDataToSend.append("bhk", formData.bhk);
        formDataToSend.append("area", formData.area);
        formDataToSend.append("price", formData.rent); // Backend expects "price"
        formDataToSend.append("city", formData.city);
        formDataToSend.append("town", formData.location); // Match backend field names
        formDataToSend.append("address", formData.address);
        formDataToSend.append("amenities", formData.amenities);
        formDataToSend.append("lat", selectedLocation.lat);
        formDataToSend.append("lng", selectedLocation.lng);

        // Append images to FormData
        images.forEach((image) => {
            formDataToSend.append("image", image.file); // Ensures backend receives images correctly
        });

        try {
            const token = localStorage.getItem("authtoken"); // Get auth token from localStorage
            if (!token) {
                return navigate("/login"); // Redirect to login if token is missing
            }

            // Send POST request to backend
            const response = await fetch(`${config.backend}/api/listproperty/listProperty`, {
                method: "POST",
                headers: {
                    authtoken: token,
                    accounttype: "landlord", // Include auth token
                },
                body: formDataToSend, // Send FormData directly
            });

            const data = await response.json();

            if (response.ok) {
                // Success: Notify user and reset form
                notify("Property added successfully!");
                setImages([]);
                setFormData(initialFormState);
                setErrors({});
            } else {
                // Error: Notify user and set error flag
                notify(`Error: ${data.message}`);
                setSomethingwentwrong(true);
            }
        } catch (error) {
            // Handle network or other errors
            console.error("Error submitting property:", error);
            notify("An error occurred. Please try again.");
            setSomethingwentwrong(true);
        }
    };

    return (
        <div className="add-prop-container">
            {/* Top section */}
            <div className="add-prop-top">
                <h4 style={{ color: "#7D141D", fontSize: "20px", fontWeight: "bold" }}>Add Property</h4>
                <div className="input-top">
                    {/* Photo upload section */}
                    <div className={"form-item upload-container"}>
                        <FadeInAnimation>
                            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                <h4 style={{ color: "#7D141D" }}>Upload Photos *</h4>
                                {errors.photos && <p className="addProp-form-error">{errors.photos}</p>}
                            </div>
                            <DragAndDrop images={images} setImages={setImages} updateFormData={updateFormData} />
                        </FadeInAnimation>
                    </div>

                    {/* Description section */}
                    <div className={"form-item description-container"}>
                        <FadeInAnimation>
                            <h4 style={{ color: "#7D141D" }}>Description</h4>
                            <textarea
                                value={formData.description}
                                onChange={(e) => updateFormData("description", e.target.value)}
                                placeholder="Enter Description"
                            />
                        </FadeInAnimation>
                    </div>
                </div>
            </div>

            {/* Middle section */}
            <div className="add-prop-middle">
                {/* BHK input */}
                <div className={"form-item bhk-container"}>
                    <FadeInAnimation>
                        <h4 style={{ color: "#7D141D" }}>BHK *</h4>
                        <input
                            value={formData.bhk}
                            onChange={(e) => updateFormData("bhk", e.target.value)}
                            placeholder="Enter BHK"
                        />
                        {errors.bhk && <p className="addProp-form-error">{errors.bhk}</p>}
                    </FadeInAnimation>
                </div>

                {/* Area input */}
                <div className={"form-item Area-container"}>
                    <FadeInAnimation>
                        <h4 style={{ color: "#7D141D" }}>Area(sqft) *</h4>
                        <input
                            value={formData.area}
                            onChange={(e) => updateFormData("area", e.target.value)}
                            placeholder="Enter Area"
                        />
                        {errors.area && <p className="addProp-form-error">{errors.area}</p>}
                    </FadeInAnimation>
                </div>

                {/* Rent input */}
                <div className={"form-item Rent-container"}>
                    <FadeInAnimation>
                        <h4 style={{ color: "#7D141D" }}>Rent(Per Month) *</h4>
                        <input
                            value={formData.rent}
                            onChange={(e) => updateFormData("rent", e.target.value)}
                            placeholder="Enter Rent"
                        />
                        {errors.rent && <p className="addProp-form-error">{errors.rent}</p>}
                    </FadeInAnimation>
                </div>

                {/* City dropdown */}
                <div className={"form-item City-container"}>
                    <FadeInAnimation>
                        <h4 style={{ color: "#7D141D" }}>City *</h4>
                        <select
                            value={formData.city}
                            onChange={(e) => updateFormData("city", e.target.value)}
                        >
                            <option value="">Select City</option>
                            <option value="Mumbai">Mumbai</option>
                        </select>
                        {errors.city && <p className="addProp-form-error">{errors.city}</p>}
                    </FadeInAnimation>
                </div>

                {/* Location dropdown */}
                <div className={"form-item Location-container"}>
                    <FadeInAnimation>
                        <h4 style={{ color: "#7D141D" }}>Location *</h4>
                        <select
                            value={formData.location}
                            onChange={(e) => updateFormData("location", e.target.value)}
                        >
                            <option value="">Select Location</option>
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
                        {errors.location && <p className="addProp-form-error">{errors.location}</p>}
                    </FadeInAnimation>
                </div>
            </div>

            {/* Bottom section */}
            <div className="add-prop-bottom">
                {/* Address input */}
                <div className={"form-item Address-container"}>
                    <FadeInAnimation>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <h4 style={{ color: "#7D141D" }}>Address *</h4>
                            {errors.address && <p className="addProp-form-error">{errors.address}</p>}
                        </div>
                        <textarea
                            value={formData.address}
                            onChange={(e) => updateFormData("address", e.target.value)}
                            placeholder="Enter Address"
                        />
                    </FadeInAnimation>
                </div>

                {/* Amenities input */}
                <div className={"form-item Amenities-container"}>
                    <FadeInAnimation>
                        <h4 style={{ color: "#7D141D" }}>Amenities</h4>
                        <textarea
                            value={formData.amenities}
                            onChange={(e) => updateFormData("amenities", e.target.value)}
                            placeholder="Enter Amenities"
                        />
                    </FadeInAnimation>
                </div>

                {/* Map for location selection */}
                <div className={"form-item Amenities-container"}>
                    <FadeInAnimation>
                        <h4 style={{ color: "#7D141D" }}>Pick the location on Maps</h4>
                        <APIProvider apiKey={import.meta.env.VITE_MAPS_API}>
                            <div className="maps_box">
                                <Map
                                    defaultCenter={selectedLocation}
                                    defaultZoom={10}
                                    mapId={"a2e98f7c917411dc"}
                                    onClick={handleMapClick}
                                >
                                    <AdvancedMarker position={selectedLocation} />
                                </Map>
                            </div>
                        </APIProvider>
                    </FadeInAnimation>
                </div>

                {/* Submit button */}
                <button className="Form-Submit-btn" onClick={handleSubmit}>Submit</button>
            </div>
        </div>
    );
}

export default AddProperty;

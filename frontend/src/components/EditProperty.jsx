import React, { useEffect, useState } from 'react';
import DragAndDrop from './AddPropertyComponents/DragAndDrop';
import "../css/AddPropertyStyles/AddProperty.css";
import { useParams } from 'react-router-dom';
import { useContext } from 'react';
import { Basecontext } from '../context/base/Basecontext';
import { useNavigate } from 'react-router-dom';
import config from '../config.json';
import FadeInAnimation from './animations/FadeInAnimation';
import { ToastContainer, toast } from 'react-toastify';
import { APIProvider, Map, AdvancedMarker, useMap } from "@vis.gl/react-google-maps";


function EditProperty(property) {

    const state = useContext(Basecontext);
    const { user, setUser, fetuser } = state;
    const navigate = useNavigate();
    const [selectedLocation, setSelectedLocation] = useState({ lat: 19.0760, lng: 72.8777 });
    const handleMapClick = (event) => {
        setSelectedLocation({
            lat: event.detail.latLng.lat,
            lng: event.detail.latLng.lng,
        });
    };
    const initialFormState = {
        photos: [],
        description: "",
        bhk: "",
        area: "",
        rent: "",
        city: "",
        town: "",
        address: "",
        amenities: "",
        price: "",
        lat: 19.0760,
        lng: 72.8777,

    };
    const [formData, setFormData] = useState(initialFormState);
    const [images, setImages] = useState([]);
    const [errors, setErrors] = useState({});
    const params = useParams();
    const id = params.id;

    const updateFormData = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const validateForm = () => {
        let newErrors = {};

        if (images.length === 0) newErrors.photos = "At least one photo is required.";
        if (!formData.bhk || isNaN(formData.bhk)) newErrors.bhk = "BHK is required and must be a number.";
        if (!formData.area || isNaN(formData.area)) newErrors.area = "Area is required and must be a number.";
        if (!formData.price || isNaN(formData.price)) newErrors.rent = "Rent is required and must be a number.";
        if (!formData.address.trim()) newErrors.address = "Address is required.";
        if (!formData.city) newErrors.city = "Please select a city.";
        if (!formData.town) newErrors.location = "Please select a location.";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleUpdate = async () => {

        if (!validateForm()) return;
        
        const formData_final = new FormData();
        formData_final.append("description", formData.description);
        formData_final.append("bhk", formData.bhk);
        formData_final.append("area", formData.area);
        formData_final.append("price", formData.price);
        formData_final.append("city", formData.city);
        formData_final.append("town", formData.town);
        formData_final.append("address", formData.address);
        formData_final.append("amenities", formData.amenities);
        formData_final.append("id", id);
        formData_final.append("lat", selectedLocation.lat);
        formData_final.append("lng", selectedLocation.lng);

        images.forEach((image) => {
            if (image.file) {
                formData_final.append("image", image.file);
            }
        });
        console.log(images);

        try {
            const response = await fetch(`${config.backend}/api/updates/updateProperty`, {
                method: "POST",
                headers: {
                    "authtoken": localStorage.getItem("authtoken"),
                },
                body: formData_final,
            });
            const data = await response.json();
            console.log(data);
            if (data.success) {
                navigate("/landlord-profile-page");
            }
        }
        catch (error) {
            console.error("Error updating property:", error);
        }
        
    };

    useEffect(() => {
        const fetchProperty = async () => {
            try {
                const response = await fetch(`${config.backend}/api/property/get_property`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ id: id }),
                });
                const data = await response.json();
                if (data.success) {
                    setFormData(data.property);
    
                    setImages([]);
                    setSelectedLocation({ lat: data.property.lat, lng: data.property.lng });
                }
            } catch (error) {
                console.log(error);
            }
        };
        fetchProperty();
    }, []);

    return (
        <div className="add-prop-container">
            <div className="add-prop-top">
                <h4 style={{ color: "#7D141D", fontSize: "20px", fontWeight: "bold" }}>Add Property</h4>
                <div className="input-top">
                    <div className={"form-item upload-container"}>
                        <FadeInAnimation>
                            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                <h4 style={{ color: "#7D141D" }}>Upload Photos *</h4>
                                {errors.photos && <p className="addProp-form-error">{errors.photos}</p>}
                            </div>

                            <DragAndDrop images={images} setImages={setImages} updateFormData={updateFormData} />
                        </FadeInAnimation>
                    </div>
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
            <div className="add-prop-middle">
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
                <div className={"form-item Rent-container"}>
                    <FadeInAnimation>
                        <h4 style={{ color: "#7D141D" }}>Rent(Per Month) *</h4>
                        <input
                            value={formData.price}
                            onChange={(e) => updateFormData("rent", e.target.value)}
                            placeholder="Enter Rent"
                        />
                        {errors.rent && <p className="addProp-form-error">{errors.rent}</p>}
                    </FadeInAnimation>
                </div>
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
                <div className={"form-item Location-container"}>
                    <FadeInAnimation>
                        <h4 style={{ color: "#7D141D" }}>Location *</h4>
                        <select
                            value={formData.town}
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
            <div className="add-prop-bottom">
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
                                        <AdvancedMarker position={selectedLocation} >
                                        </AdvancedMarker>
                                    </Map>
                                </div>
                                {/* <div className="p-4 bg-white shadow-md rounded-md mt-4">
                                    <p><strong>Selected Coordinates:</strong></p>
                                    <p>Latitude: {selectedLocation.lat}</p>
                                    <p>Longitude: {selectedLocation.lng}</p>
                                </div> */}
                            </APIProvider>
                    </FadeInAnimation>
                </div>
                <button className="Form-Submit-btn" onClick={handleUpdate}>Submit</button>
            </div>
        </div>
    )
}

export default EditProperty
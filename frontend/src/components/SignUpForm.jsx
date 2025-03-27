import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/SignUpTenant.css";
import config from "../config.json";
import {toast} from 'react-toastify';
import {useEffect} from 'react';

function SignUpForm({ setID }) {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [somethingwentwrong, setSomethingwentwrong] = useState(false);
  useEffect(()=>{
      if(somethingwentwrong){
        toast.error('Something went wrong. Please try again later.');
        navigate(-1)
      }
    }, [somethingwentwrong]);
  const [formInput, setFormInput] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    locality: "",
    city: "",
    smoke: "",
    pets: "",
    veg: "",
    flatmate: "",
    gender: "",
    successMsg: "",
  });

  // Separate error states for both pages
  const [formError, setFormError] = useState({});

  const handleUserInput = (name, value) => {
    setFormInput((prev) => ({ ...prev, [name]: value }));
  };

  const nextStep = () => {
    setStep((prevStep) => prevStep + 1);
  };

  const prevStep = () => {
    setStep((prevStep) => prevStep - 1);
  };

  const validateEmail = (email) => {
    // simple regex to validate email format
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const validateStepOne = () => {
    let errors = {};
    if (!formInput.name.trim()) {
      errors.name = "Name is required.";
    }
    if (!formInput.email.trim()) {
      errors.email = "Email is required.";
    } else if (!validateEmail(formInput.email)) {
      errors.email = "Please enter a valid email (e.g., abc@bcd.com).";
    }
    if (!formInput.password) {
      errors.password = "Password is required.";
    } else if (formInput.password.length < 6) {
      errors.password = "Password should be at least 6 characters.";
    } else if (formInput.password.length > 10) {
      errors.password = "Password should be at most 10 characters.";
    }
    if (!formInput.confirmPassword) {
      errors.confirmPassword = "Confirm password is required.";
    } else if (formInput.password !== formInput.confirmPassword) {
      errors.confirmPassword = "Password and Confirm password do not match.";
    }
    setFormError(errors);
    // If errors object is empty, validation passed
    return Object.keys(errors).length === 0;
  };

  const validateStepTwo = () => {
    let errors = {};
    if (!formInput.city) {
      errors.city = "City selection is required.";
    }
    if (!formInput.locality) {
      errors.locality = "Locality selection is required.";
    }
    if (!formInput.smoke) {
      errors.smoke = "Please specify if you smoke/drink.";
    }
    if (!formInput.pets) {
      errors.pets = "Please specify if you plan on keeping pets.";
    }
    if (!formInput.veg) {
      errors.veg = "Please specify if you are vegetarian.";
    }
    if (!formInput.flatmate) {
      errors.flatmate = "Please specify if you need a flatmate.";
    }
    if (!formInput.gender) {
      errors.gender = "Please select your gender.";
    }
    setFormError(errors);
    return Object.keys(errors).length === 0;
  };

  const validateFormInput = async (event) => {
    event.preventDefault();
    if (step === 1) {
      if (validateStepOne()) {
        nextStep();
      }
    } else {
      if (validateStepTwo()) {
        await sendDataToAPI();
      }
    }
  };

  const sendDataToAPI = async () => {
    const apiURL = `${config.backend}/api/Tenant/auth/Tenant_register`;

    const requestData = {
      name: formInput.name,
      email: formInput.email,
      password: formInput.password,
      locality: formInput.locality,
      city: formInput.city,
      smoke: formInput.smoke === "yes",
      pets: formInput.pets === "yes",
      veg: formInput.veg === "yes",
      flatmate: formInput.flatmate === "yes",
      gender: formInput.gender === "male",
    };

    try {
      const response = await fetch(apiURL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });

      const responseData = await response.json();

      if (responseData.success) {
        setFormInput((prev) => ({ ...prev, successMsg: responseData.message }));
        setID(responseData.message);
        navigate("/otp-page-tenant");
      } else {
        setFormInput((prev) => ({ ...prev, successMsg: responseData.message }));
      }
    } catch (error) {
      console.error("Error sending data:", error);
      setSomethingwentwrong(true);
      setFormInput((prev) => ({
        ...prev,
        successMsg: "Couldn't fetch data.",
      }));
    }
  };

  return (
    <div className="signup-tenant-box">
      <form
        className={`signup-tenant-form step-${step}`}
        onSubmit={validateFormInput}
      >
        {/* Step 1: Basic Details */}
        {step === 1 && (
          <div className="signup-tenant-step">
            <h2 className="signup-tenant-title">Signup as a Tenant</h2>

            <label>Full Name</label>
            <input
              type="text"
              className="signup-tenant-input-box"
              placeholder="Enter your full name"
              name="name"
              value={formInput.name}
              onChange={({ target }) => handleUserInput(target.name, target.value)}
              required
            />
            {formError.name && (
              <p className="signup-tenant-error">{formError.name}</p>
            )}

            <label>Email Address</label>
            <input
              type="email"
              className="signup-tenant-input-box"
              placeholder="abc@bcd.com"
              name="email"
              value={formInput.email}
              onChange={({ target }) => handleUserInput(target.name, target.value)}
              required
            />
            {formError.email && (
              <p className="signup-tenant-error">{formError.email}</p>
            )}

            <label>Password</label>
            <input
              type="password"
              className="signup-tenant-input-box"
              placeholder="Enter password between 6 and 10 characters"
              name="password"
              value={formInput.password}
              onChange={({ target }) => handleUserInput(target.name, target.value)}
              required
              minLength="6"
              maxLength="10"
            />
            {formError.password && (
              <p className="signup-tenant-error">{formError.password}</p>
            )}

            <label>Confirm Password</label>
            <input
              type="password"
              className="signup-tenant-input-box"
              placeholder="Re-enter the same password"
              name="confirmPassword"
              value={formInput.confirmPassword}
              onChange={({ target }) =>
                handleUserInput(target.name, target.value)
              }
              required
              minLength="6"
              maxLength="10"
            />
            {formError.confirmPassword && (
              <p className="signup-tenant-error">{formError.confirmPassword}</p>
            )}

            <p className="signup-tenant-success-message">
              {formInput.successMsg}
            </p>
            <button type="submit" className="signup-tenant-button">
              Next
            </button>
          </div>
        )}

        {/* Step 2: Additional Questions */}
        {step === 2 && (
          <div className="signup-tenant-step">
            <h2 className="signup-tenant-title">A Few Questions About You</h2>

            <label>
              Where would you like to look for a property?
              <br />
              (For better recommendations)
            </label>
            <select
              className="signup-tenant-input-box"
              name="city"
              value={formInput.city}
              onChange={({ target }) => handleUserInput(target.name, target.value)}
              required
            >
              <option value="">Select City</option>
              <option value="Mumbai">Mumbai</option>
            </select>
            {formError.city && (
              <p className="signup-tenant-error">{formError.city}</p>
            )}

            <select
              className="signup-tenant-input-box"
              name="locality"
              value={formInput.locality}
              onChange={({ target }) => handleUserInput(target.name, target.value)}
              required
            >
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
            {formError.locality && (
              <p className="signup-tenant-error">{formError.locality}</p>
            )}

            <label>
              Do you smoke/drink?
              <label htmlFor="smoke-yes">
                <input
                  type="radio"
                  id="smoke-yes"
                  name="smoke"
                  className="signup-tenant-radio"
                  value="yes"
                  checked={formInput.smoke === "yes"}
                  onChange={({ target }) =>
                    handleUserInput(target.name, target.value)
                  }
                  required
                />{" "}
                Yes
              </label>
              <label htmlFor="smoke-no">
                <input
                  type="radio"
                  id="smoke-no"
                  name="smoke"
                  className="signup-tenant-radio"
                  value="no"
                  checked={formInput.smoke === "no"}
                  onChange={({ target }) =>
                    handleUserInput(target.name, target.value)
                  }
                />{" "}
                No
              </label>
            </label>
            {formError.smoke && (
              <p className="signup-tenant-error">{formError.smoke}</p>
            )}

            <label>
              Do you plan on keeping pets?
              <label htmlFor="pets-yes">
                <input
                  type="radio"
                  id="pets-yes"
                  name="pets"
                  className="signup-tenant-radio"
                  value="yes"
                  checked={formInput.pets === "yes"}
                  onChange={({ target }) =>
                    handleUserInput(target.name, target.value)
                  }
                  required
                />{" "}
                Yes
              </label>
              <label htmlFor="pets-no">
                <input
                  type="radio"
                  id="pets-no"
                  name="pets"
                  className="signup-tenant-radio"
                  value="no"
                  checked={formInput.pets === "no"}
                  onChange={({ target }) =>
                    handleUserInput(target.name, target.value)
                  }
                />{" "}
                No
              </label>
            </label>
            {formError.pets && (
              <p className="signup-tenant-error">{formError.pets}</p>
            )}

            <label>
              Are you a Vegetarian?
              <label htmlFor="veg-yes">
                <input
                  type="radio"
                  id="veg-yes"
                  name="veg"
                  className="signup-tenant-radio"
                  value="yes"
                  checked={formInput.veg === "yes"}
                  onChange={({ target }) =>
                    handleUserInput(target.name, target.value)
                  }
                  required
                />{" "}
                Yes
              </label>
              <label htmlFor="veg-no">
                <input
                  type="radio"
                  id="veg-no"
                  name="veg"
                  className="signup-tenant-radio"
                  value="no"
                  checked={formInput.veg === "no"}
                  onChange={({ target }) =>
                    handleUserInput(target.name, target.value)
                  }
                />{" "}
                No
              </label>
            </label>
            {formError.veg && (
              <p className="signup-tenant-error">{formError.veg}</p>
            )}

            <label>
              Do you need a flatmate?
              <label htmlFor="flatmate-yes">
                <input
                  type="radio"
                  id="flatmate-yes"
                  name="flatmate"
                  className="signup-tenant-radio"
                  value="yes"
                  checked={formInput.flatmate === "yes"}
                  onChange={({ target }) =>
                    handleUserInput(target.name, target.value)
                  }
                  required
                />{" "}
                Yes
              </label>
              <label htmlFor="flatmate-no">
                <input
                  type="radio"
                  id="flatmate-no"
                  name="flatmate"
                  className="signup-tenant-radio"
                  value="no"
                  checked={formInput.flatmate === "no"}
                  onChange={({ target }) =>
                    handleUserInput(target.name, target.value)
                  }
                />{" "}
                No
              </label>
            </label>
            {formError.flatmate && (
              <p className="signup-tenant-error">{formError.flatmate}</p>
            )}

            <label>
              What's your gender?
              <label htmlFor="gender-male">
                <input
                  type="radio"
                  id="gender-male"
                  name="gender"
                  className="signup-tenant-radio"
                  value="male"
                  checked={formInput.gender === "male"}
                  onChange={({ target }) =>
                    handleUserInput(target.name, target.value)
                  }
                  required
                />{" "}
                Male
              </label>
              <label htmlFor="gender-female">
                <input
                  type="radio"
                  id="gender-female"
                  name="gender"
                  className="signup-tenant-radio"
                  value="female"
                  checked={formInput.gender === "female"}
                  onChange={({ target }) =>
                    handleUserInput(target.name, target.value)
                  }
                />{" "}
                Female
              </label>
            </label>
            {formError.gender && (
              <p className="signup-tenant-error">{formError.gender}</p>
            )}

            <div className="signup-navigation-buttons">
              <button
                type="button"
                onClick={prevStep}
                className="signup-tenant-button"
              >
                ← Back
              </button>
              <button type="submit" className="signup-tenant-button">
                Sign up
              </button>
            </div>
          </div>
        )}
      </form>

      <p className="signup-tenant-footer-text-signup">
        With Roomble, you'll stumble on the perfect place to rumble!
      </p>
    </div>
  );
}

export default SignUpForm;

import { responsiveFontSizes } from "@mui/material";
import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import config from "../config";
import { toast } from "react-toastify";
import { useEffect } from "react";

function SignupformLandlord({ setID }) {
  const navigate = useNavigate();
  const [somethingwentwrong, setSomethingwentwrong] = useState(false);
  useEffect(() => {
    if (somethingwentwrong) {
      toast.error("Something went wrong. Please try again later.");
      navigate(-1);
    }
  }, [somethingwentwrong]);
  const [formInput, setFormInput] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [formError, setFormError] = useState({
    password: "",
    confirmPassword: "",
  });

  const handleUserInput = (name, value) => {
    setFormInput((prev) => ({ ...prev, [name]: value }));
  };
  const validateFormInput = async (event) => {
    event.preventDefault();
    let inputError = {
      confirmPassword: "",
    };
    if (formInput.password.length < 6) {
      setFormError({
        ...inputError,
        password: "Password should be atleast 6 characters",
      });
      // setFormInput({...formInput, successMsg: "",})
      return;
    }
    if (formInput.password.length > 10) {
      setFormError({
        ...inputError,
        password: "Password should not be more than 10 characters",
      });
      // setFormInput({...formInput, successMsg: "",})
      return;
    }
    if (formInput.password !== formInput.confirmPassword) {
      setFormError({
        ...inputError,
        confirmPassword: "Password and Confirm password do not match!",
      });
      // setFormInput({...formInput, successMsg: "",})
      return;
    }
    // setFormError(inputError);
    // setFormInput((prevState) => ({
    //   ...prevState, successMsg:"Validation Successful",
    // }));
    await sendDataToAPI();
  };
  const sendDataToAPI = async () => {
    const apiURL = `${config.backend}/api/Landlord/auth/Landlord_register`;

    const requestData = {
      name: formInput.name,
      email: formInput.email,
      password: formInput.password,
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
        navigate("/otp-page-landlord");
        // navigate("/otp-page", { id: successMsg })
      } else {
        setFormInput((prev) => ({ ...prev, successMsg: responseData.message }));
        // setID(responseData.message);
        // navigate("/otp-page", { id: successMsg })
      }
    } catch (error) {
      console.error("Error sending data:", error);
      setSomethingwentwrong(true);
      setFormInput((prev) => ({
        ...prev,
        successMsg: "Couldn't fetch data.",
      }));
      // setID(null);
    }
  };

  return (
    <div className="LSignup-box">
      <h2 className="LTitle">Signup as a Landlord</h2>

      <form className="LSignup-form" onSubmit={validateFormInput}>
        <div>
          <label>Full Name</label>
          <input
            type="text"
            className="LInput-box"
            placeholder="Enter your full name"
            required
            name="name"
            onChange={({ target }) =>
              handleUserInput(target.name, target.value)
            }
          />
        </div>

        <div>
          <label>Email Address</label>
          <input
            type="email"
            className="LInput-box"
            placeholder="mail@abc.com"
            name="email"
            onChange={({ target }) =>
              handleUserInput(target.name, target.value)
            }
            required
          />
        </div>

        <div>
          <label>Password</label>
          <input
            type="password"
            className="LInput-box"
            placeholder="Enter password between 6 and 10 characters"
            name="password"
            value={formInput.password}
            onChange={({ target }) => {
              handleUserInput(target.name, target.value);
              if (target.value.length < 6) {
                setFormError((prev) => ({
                  ...prev,
                  password: "Password must be at least 6 characters.",
                }));
              } else if (target.value.length > 10) {
                setFormError((prev) => ({
                  ...prev,
                  password: "Password must not exceed 10 characters.",
                }));
              } else {
                setFormError((prev) => {
                  const { password, ...rest } = prev;
                  return rest;
                });
              }
            }}
            required
            // minLength="6"
            // maxLength="10"
          />
          {formError.password && (
            <p className="signup-landlord-error">{formError.password}</p>
          )}
        </div>

        <div>
          <label>Confirm Password</label>
          <input
            type="password"
            className="LInput-box"
            placeholder="Re-enter the same password"
            name="confirmPassword"
            value={formInput.confirmPassword}
            onChange={({ target }) => {
              handleUserInput(target.name, target.value);
              if (target.value.length < 6) {
                setFormError((prev) => ({
                  ...prev,
                  confirmPassword:
                    "Confirm password must be at least 6 characters.",
                }));
              } else if (target.value.length > 10) {
                setFormError((prev) => ({
                  ...prev,
                  confirmPassword:
                    "Confirm password must not exceed 10 characters.",
                }));
              } else if (target.value !== formInput.password) {
                setFormError((prev) => ({
                  ...prev,
                  confirmPassword:
                    "Password and Confirm password do not match.",
                }));
              } else {
                setFormError((prev) => {
                  const { confirmPassword, ...rest } = prev;
                  return rest;
                });
              }
            }}
            required
            // minLength="6"
            // maxLength="10"
          />
          {formError.confirmPassword && (
            <p className="signup-landlord-error">{formError.confirmPassword}</p>
          )}

          <p className="signup-landlord-error">{formInput.successMsg}</p>
        </div>
        <button className="LSignup-button">Sign up</button>
      </form>

      <p className="LFooter-text-signup">
        With Roomble, you'll stumble on the perfect place to rumble!
      </p>
    </div>
  );
}
export default SignupformLandlord;

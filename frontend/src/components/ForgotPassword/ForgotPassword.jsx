import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../../css/ForgotPassword/ForgotPassword.css"; // Import the CSS specific to this component
import logo from "../../../public/logo.png";
import { Basecontext } from '../../context/base/Basecontext';
import config from "../../config.json";
import {toast} from 'react-toastify';
import { useEffect } from "react";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [isLandlord, setIsLandlord] = useState(false);
    const [somethingwentwrong, setSomethingwentwrong] = useState(false);
    const navigate = useNavigate();

    const state = useContext(Basecontext)
    const {user, setUser, fetuser} = state
    fetuser()
    
    const handleToggle = () => {
        setIsLandlord(!isLandlord);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        const accounttype = isLandlord ? "landlord" : "tenant";

        try {
            const response = await fetch(`${config.backend}/api/forgotPassword/enteremail`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ accounttype: accounttype, email: email }),
            });

            const data = await response.json();
            setLoading(false);

            if (data.success) {
                localStorage.setItem("authtoken", data.authtoken);
                navigate(`/otp-forgot?accounttype=${accounttype}`);

                setTimeout(() => {
                    console.log("Saved Token:", localStorage.getItem("authtoken"));
                }, 1500);

                navigate("/otp-forgot");
            } else {
                setError(data.message || "Email not found. Please try again.");
                setSomethingwentwrong(true);
            }
        } catch (err) {
            setLoading(false);
            setError("Network error. Please try again.");
            setSomethingwentwrong(true);
        }
    };

      useEffect(()=>{
        if(somethingwentwrong){
          toast.error('Something went wrong. Please try again later.');
          navigate(-1)
        }
      }, [somethingwentwrong]);
    

    return (
        <div className="main-container">
            {/* Left Section: Logo */}
            <div className="logo-container">
                <img src={logo} alt="Roomble Logo" />
            </div>

            {/* Right Section: Forget Password Form */}
            <div className="login-box">
                <h2 className="login-title">Forgot Password?</h2>

                <form className="login-form" onSubmit={handleSubmit}>
                    <label htmlFor="email">Enter your registered email</label>
                    <input
                        type="email"
                        id="email"
                        placeholder="mail@abc.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    {error && <p className="error-text">{error}</p>}

                    <button type="submit" className="login-button" disabled={loading}>
                        {loading ? "Redirecting..." : "Submit"}
                    </button>
                </form>

                {/* Toggle Switch */}
                <div className="toggle-container">
                    <div className={`toggle-switch ${isLandlord ? "landlord-selected" : ""}`} onClick={handleToggle}>
                        <span className="toggle-text tenant">Tenant</span>
                        <span className="toggle-slider"></span>
                        <span className="toggle-text landlord">Landlord</span>
                    </div>
                </div>

                {/* Navigation Links */}
                <p className="register-text">
                    Remember your password? <Link to="/login">Login</Link>
                </p>
                <p className="register-text">
                    Not Registered Yet? <Link to="/signup-tenant">Sign up</Link>
                </p>

                <p className="footer-text">
                    With Roomble, you'll stumble on the perfect place to rumble!
                </p>
            </div>
        </div>
    );
};

export default ForgotPassword;

import React, { useEffect, useState } from "react";
import { Basecontext } from "./Basecontext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; 
import { useNavigate } from "react-router-dom";

const BaseState = (props) => {
  const [user, setUser] = useState({ type: "none" });
  const [somethingwentwrong, setSomethingWentWrong] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetuser = async () => {
    try {
      if (localStorage.getItem("authtoken") && user.type === "none") {
        setLoading(true);
        const res = await fetch("http://localhost:3000/api/auth/user", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authtoken: localStorage.getItem("authtoken")
          },
        });
        const data = await res.json();
        if (data.success) {
          setUser(data.user);
        } else {
          setSomethingWentWrong(true);
        }
      }
    } catch (err) {
      console.log(err);
      setSomethingWentWrong(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (somethingwentwrong) {
      toast.error("Please Login again");
      localStorage.removeItem("authtoken");
      setUser({ type: "none" });
      navigate("/login");
    }
  }, [somethingwentwrong, navigate]);

  return (
    <Basecontext.Provider value={{ user, setUser, fetuser, loading, setLoading }}>
      {/* Loading overlay with spinner */}
      <div className={loading ? "loading-flex" : "loading-none"}>
        <div className="spinner"></div>
      </div>
      {props.children}
      <ToastContainer />
    </Basecontext.Provider>
  );
};

export default BaseState;

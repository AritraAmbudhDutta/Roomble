import React from "react";

import logo from "../../public/logo.png";
import SignupformLandlord from "./SignupformLandlord.jsx";
import "../css/SignupLandlord.css";
function SignupLandlord({ setID }) {
  return (
    <div className="Container">
      <div className="signup-tenant-contaier">
        <img src={logo} alt="Roomble Logo" />
      </div>
      <div>
        <SignupformLandlord setID={setID} />
      </div>
    </div>
  );
}
export default SignupLandlord;

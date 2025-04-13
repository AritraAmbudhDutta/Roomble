
/**
 * This component renders a "Contact Us" page that displays a grid of team members.
 * Each team member's card includes their name, role, contact email, and profile image.
 * 
 * The team member data is dynamically generated from the `teamMembers` array.
 */

import React from "react";
import "../css/ContactUs.css";

// Array containing team member details
const teamMembers = [
  {
    name: "Aarsh Jain",
    role: "Frontend Developer",
    contact: "aarshjain23@iitk.ac.in",
    image: "./aarsh.jpg",
  },
  {
    name: "Aritra Ambudh Dutta",
    role: "Backend Developer",
    contact: "aritraad23@iitk.ac.in",
    image: "./dutta.jpg",
  },
  {
    name: "Aritra Ray",
    role: "Backend Developer",
    contact: "aritrar23@iitk.ac.in",
    image: "./aritraray.jpg",
  },
  {
    name: "Bhukya Vaishnavi",
    role: "Backend Developer",
    contact: "bhukyav23@iitk.ac.in",
    image: "./vaishnavi.jpg",
  },
  {
    name: "Bikramjeet Singh",
    role: "Backend Developer",
    contact: "bsingh23@iitk.ac.in",
    image: "./bikramjeet.jpg",
  },
  {
    name: "Hitarth Makawana",
    role: "Frontend Developer",
    contact: "hitarthkm23@iitk.ac.in",
    image: "./hitarth.jpg",
  },
  {
    name: "Shlok Jain",
    role: "Backend Developer",
    contact: "jainshlok23@iitk.ac.in",
    image: "./shlok.jpg",
  },
  {
    name: "Ronav Puri",
    role: "Frontend Developer",
    contact: "ronavgp23@iitk.ac.in",
    image: "./ronav.jpg",
  },
  {
    name: "Rathod Ayushi",
    role: "Frontend Developer",
    contact: "rathoday23@iitk.ac.in",
    image: "./ayushi.jpg",
  },
  {
    name: "Saksham Verma",
    role: "Backend Developer",
    contact: "sakshamv23@iitk.ac.in",
    image: "./saksham.jpg",
  },
  {
    name: "Surepally Pranaysriharsha",
    role: "Frontend Developer",
    contact: "surepally23@iitk.ac.in",
    image: "./pranay.jpg",
  },
];

// Component to display the team page
const TeamPage = () => {
  return (
    <div className="team-container">
      {/* Page heading */}
      <h1 className="team-heading">Contact Us</h1>

      {/* Grid layout for team members */}
      <div className="team-grid">
        {teamMembers.map((member, index) => (
          <div className="team-card" key={index}>
            {/* Team member image */}
            <div className="team-image-wrapper">
              <img src={member.image} alt={member.name} className="team-image" />
            </div>

            {/* Team member name */}
            <h3 className="team-name">{member.name}</h3>

            {/* Team member role */}
            <p className="team-role">{member.role}</p>

            {/* Team member contact email */}
            <a className="team-contact" href={`mailto:${member.contact}`}>
              <i className="fas fa-envelope"></i> {member.contact}
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamPage;

"use client"
import DashboardCalendar from "@components/DashboardCalendar";
import profileImage from "../../profile.png";
import Image from "next/image";
import "./profile.css";

const dashboard = () => {

  return (
    <div>
      <div className="profile-container">
        <div className="profile-image-container">
          <Image src={profileImage} alt="Profile" width={60} height={60} className="profile-image" />
        </div>
        <button className="edit-profile-button">Edit Profile</button>
        <DashboardCalendar />
      </div>
      
    </div>
  );
};

export default dashboard;


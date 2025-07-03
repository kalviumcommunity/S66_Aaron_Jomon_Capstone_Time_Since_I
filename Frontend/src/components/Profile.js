import React from "react";

const Profile = ({ user, onSignOut }) => {
  return (
    <div className="profile-page">
      <h2>User Profile</h2>
      <p><strong>Email:</strong> {user?.email}</p>
      {/* Optional future: Update password UI */}
      <button onClick={onSignOut}>Sign Out</button>
    </div>
  );
};

export default Profile;

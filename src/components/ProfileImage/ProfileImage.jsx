import React from "react";

const ProfileImage = ({ name }) => {
  const firstNameInitial = name[0] ? name[0][0] : "";

  return (
    <span className="profileImage">
      {firstNameInitial}
    </span>
  );
};
export default ProfileImage;
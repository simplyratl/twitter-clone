import React from "react";
import { useRouter } from "next/router";

const ProfilePage = () => {
  const router = useRouter();

  return (
    <div>
      <h1>Profile Page</h1>
      <p>Id: {router.query.id}</p>
    </div>
  );
};

export default ProfilePage;

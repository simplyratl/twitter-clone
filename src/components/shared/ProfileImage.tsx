import React from "react";
import Image from "next/image";

type Props = {
  src: string;
};

const ProfileImage = ({ src }: Props) => {
  return (
    <Image
      className="h-12 w-12 rounded-full object-cover"
      src={src}
      width={48}
      height={48}
      alt="Profile Image"
    />
  );
};

export default ProfileImage;

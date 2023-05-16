import React from "react";
import Image from "next/image";

type Props = {
  src: string;
  size?: number;
};

const ProfileImage = ({ src, size = 12 }: Props) => {
  const calculateSize = () => {
    return size * 4;
  };

  return (
    <Image
      className={`rounded-full object-cover`}
      style={{ width: calculateSize(), height: calculateSize() }}
      src={src}
      width={calculateSize()}
      height={calculateSize()}
      alt="Profile Image"
    />
  );
};

export default ProfileImage;

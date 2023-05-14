import { HiOutlineHashtag, HiOutlineUser } from "react-icons/hi2";
import { ReactNode } from "react";

export type NavLink = {
  name: string;
  path: string | null;
  icon: ReactNode;
};

export const navLinks: NavLink[] = [
  {
    name: "Explore",
    path: "/",
    icon: <HiOutlineHashtag />,
  },
  {
    name: "Profile",
    path: "/profile",
    icon: <HiOutlineUser />,
  },
];

import {
  HiHashtag,
  HiOutlineHashtag,
  HiOutlineUser,
  HiUser,
} from "react-icons/hi2";
import { type ReactNode } from "react";

export type NavLink = {
  name: string;
  path: string | null;
  icon: ReactNode;
  iconActive?: ReactNode;
};

export const navLinks: NavLink[] = [
  {
    name: "Explore",
    path: "/",
    icon: <HiOutlineHashtag />,
    iconActive: <HiHashtag />,
  },
  {
    name: "Profile",
    path: "/profile",
    icon: <HiOutlineUser />,
    iconActive: <HiUser />,
  },
];

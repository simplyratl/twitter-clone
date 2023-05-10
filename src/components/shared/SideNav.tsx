import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";
import IconHoverEffect from "./IconHoverEffect";
import {
  HiOutlineUser,
  HiOutlineHome,
  HiOutlineArrowLeftOnRectangle,
} from "react-icons/hi2";

const SideNav = () => {
  const session = useSession();
  const user = session.data?.user;

  return (
    <nav className="sticky top-0 px-2 py-4">
      <ul className="flex flex-col items-start gap-2 whitespace-nowrap">
        <li>
          <Link href="/">
            <IconHoverEffect>
              <span className="flex items-center gap-2">
                <HiOutlineHome className="h-6 w-6" />
                <span className="hidden text-lg md:inline">Home</span>
              </span>
            </IconHoverEffect>
          </Link>
        </li>
        <li>
          {user && (
            <Link href={`/profiles/${user.id}`}>
              <IconHoverEffect>
                <span className="flex items-center gap-2">
                  <HiOutlineUser className="h-6 w-6" />
                  <span className="hidden text-lg md:inline">Profile</span>
                </span>
              </IconHoverEffect>
            </Link>
          )}
        </li>

        {user && (
          <li>
            <button onClick={() => void signOut()} className="">
              <IconHoverEffect>
                <span className="flex items-center gap-2 fill-green-700">
                  <HiOutlineArrowLeftOnRectangle className="h-6 w-6" />
                  <span className="text-gren-700 hidden text-lg md:inline">
                    Log out
                  </span>
                </span>
              </IconHoverEffect>
            </button>
          </li>
        )}

        {!user && (
          <li>
            <button onClick={() => void signIn()} className="">
              <IconHoverEffect>
                <span className="flex items-center gap-2 fill-green-700">
                  <HiOutlineUser className="h-6 w-6" />
                  <span className="text-gren-700 hidden text-lg md:inline">
                    Log in
                  </span>
                </span>
              </IconHoverEffect>
            </button>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default SideNav;

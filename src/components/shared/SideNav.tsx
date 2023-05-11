import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";
import IconHoverEffect from "./IconHoverEffect";
import {
  HiHashtag,
  HiOutlineArrowLeftOnRectangle,
  HiOutlineUser,
  HiSun,
} from "react-icons/hi2";
import useColorMode from "~/utils/hooks/useColorMode";
import { useRouter } from "next/router";

const SideNav = () => {
  const session = useSession();
  const user = session.data?.user;
  const [colorMode, setColorMode] = useColorMode();
  const router = useRouter();

  return (
    <nav className="sticky top-0 px-2 py-4 dark:text-white sm:w-[300px]">
      <ul className="flex flex-col items-start gap-2 whitespace-nowrap">
        <li>
          <Link href="/">
            <IconHoverEffect active={router.pathname === "/" ? true : false}>
              <span
                className={`flex items-center gap-2 px-3 px-3 ${
                  router.pathname === "/" ? "font-bold" : ""
                }`}
              >
                <HiHashtag className="h-8 w-8" />
                <span className="hidden text-xl md:inline">Explore</span>
              </span>
            </IconHoverEffect>
          </Link>
        </li>
        <li>
          {user && (
            <Link href={`/profiles/${user.id}`}>
              <IconHoverEffect
                active={router.pathname.includes("/profiles") ? true : false}
              >
                <span
                  className={`flex items-center gap-2 px-3 px-3 ${
                    router.pathname.includes("/profiles") ? "font-bold" : ""
                  }`}
                >
                  <HiOutlineUser className="h-8 w-8" />
                  <span className="hidden text-xl md:inline">Profile</span>
                </span>
              </IconHoverEffect>
            </Link>
          )}
        </li>
        <li
          onClick={() => setColorMode(colorMode === "dark" ? "light" : "dark")}
        >
          <div className="cursor-pointer">
            <IconHoverEffect gray active={colorMode === "dark"}>
              <span className="flex items-center gap-2 px-3">
                <HiSun className="h-8 w-8" />
                <span className="hidden text-xl md:inline">
                  Toggle Dark Mode
                </span>
              </span>
            </IconHoverEffect>
          </div>
        </li>

        {user && (
          <li>
            <button onClick={() => void signOut()} className="">
              <IconHoverEffect>
                <span className="flex items-center gap-2 px-3">
                  <HiOutlineArrowLeftOnRectangle className="h-8 w-8" />
                  <span className="hidden text-xl md:inline">Log out</span>
                </span>
              </IconHoverEffect>
            </button>
          </li>
        )}

        {!user && (
          <li>
            <button onClick={() => void signIn()} className="">
              <IconHoverEffect>
                <span className="flex items-center gap-2 px-3">
                  <HiOutlineUser className="h-8 w-8" />
                  <span className="hidden text-xl md:inline">Log in</span>
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

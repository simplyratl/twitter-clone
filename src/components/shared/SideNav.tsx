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
import { HiOutlineBell } from "react-icons/hi2";

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
            <IconHoverEffect gray>
              <span className={`flex items-center gap-3 px-3`}>
                <HiHashtag className="h-9 w-9" />
                <span
                  className={`hidden text-[1.2rem] font-medium md:inline ${
                    router.pathname === "/" ? "font-bold" : ""
                  }`}
                >
                  Explore
                </span>
              </span>
            </IconHoverEffect>
          </Link>
        </li>
        <li>
          <Link href="/">
            <IconHoverEffect gray>
              <span
                className={`flex items-center gap-3 px-3 ${
                  router.pathname === "/notifications" ? "font-extrabold" : ""
                }`}
              >
                <div className="relative">
                  <span className="absolute right-0 top-0 inline-flex h-5 w-5 animate-ping rounded-full bg-sky-400 opacity-75"></span>
                  <span className="absolute right-0 top-0 flex h-5 w-5 items-center justify-center rounded-full bg-sky-500 text-sm text-white">
                    1
                  </span>
                  <HiOutlineBell className="h-9 w-9" />
                </div>
                <span className="hidden text-[1.2rem] font-medium md:inline">
                  Notifications
                </span>
              </span>
            </IconHoverEffect>
          </Link>
        </li>
        <li>
          {user && (
            <Link href={`/profiles/${user.id}`}>
              <IconHoverEffect gray>
                <span
                  className={`flex items-center gap-3 px-3 ${
                    router.pathname.includes("/profiles") ? "font-black" : ""
                  }`}
                >
                  <HiOutlineUser className="h-9 w-9" />
                  <span className="hidden text-[1.2rem] font-medium md:inline">
                    Profile
                  </span>
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
              <span className="flex items-center gap-3 px-3">
                <HiSun className="h-9 w-9" />
                <span className="hidden text-[1.2rem] font-medium md:inline">
                  Toggle Dark Mode
                </span>
              </span>
            </IconHoverEffect>
          </div>
        </li>

        {user && (
          <li>
            <button onClick={() => void signOut()} className="">
              <IconHoverEffect gray>
                <span className="flex items-center gap-3 px-3">
                  <HiOutlineArrowLeftOnRectangle className="h-9 w-9" />
                  <span className="hidden text-[1.2rem] font-medium md:inline">
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
                <span className="flex items-center gap-2 px-3">
                  <HiOutlineUser className="h-9 w-9" />
                  <span className="hidden text-[1.2rem] font-medium md:inline">
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

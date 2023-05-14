import React, { type ReactNode, useEffect, useState } from "react";
import { navLinks } from "~/constants/nav";
import Link from "next/link";
import HoverEffect from "~/utils/style/HoverEffect";
import {
  HiMoon,
  HiOutlineArrowLeftOnRectangle,
  HiOutlineHashtag,
  HiOutlineUser,
  HiSun,
  HiUser,
} from "react-icons/hi2";
import useColorMode from "~/utils/hooks/useColorMode";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";

const SideNavigation = () => {
  const session = useSession();
  const router = useRouter();

  const initialColorMode = {
    label: "Light Mode",
    icon: <HiSun />,
  };

  const [colorMode, setColorMode] = useColorMode();
  const [darkMode, setDarkMode] = useState<{ label: string; icon: ReactNode }>(
    initialColorMode
  );

  useEffect(() => {
    setDarkMode({
      label: colorMode === "dark" ? "Light Mode" : "Dark Mode",
      icon: colorMode === "dark" ? <HiSun /> : <HiMoon />,
    });
  }, [colorMode]);

  const toggleDarkMode = () => {
    if (colorMode === "dark") setColorMode("light");
    else setColorMode("dark");
  };

  return (
    <div className="fixed bottom-0 left-0 z-50 flex h-24 w-full flex-shrink-0 items-center justify-center border-t bg-white dark:bg-black sm:sticky sm:top-0 sm:z-auto sm:block sm:h-screen sm:w-[70px] sm:border-none sm:bg-transparent sm:pt-12 lg:w-56">
      <ul className="flex w-full grid-cols-1 justify-between gap-4 sm:grid sm:w-auto">
        <HoverEffect>
          <li className={`px-4 py-2 text-2xl text-black dark:text-white`}>
            <Link href={`/`} className={`nav-link flex items-center gap-3`}>
              <span className="text-4xl lg:text-3xl">
                <HiOutlineHashtag />
              </span>
              <span className={`hidden font-medium lg:block`}>Explore</span>
            </Link>
          </li>
        </HoverEffect>

        <HoverEffect>
          <li className={`px-4 py-2 text-2xl text-black dark:text-white`}>
            <Link
              href={`/profile/${session.data?.user.id ?? ""}`}
              className={`nav-link flex items-center gap-3`}
            >
              <span className="text-4xl lg:text-3xl">
                <HiOutlineUser />
              </span>
              <span className={`hidden font-medium lg:block`}>Profile</span>
            </Link>
          </li>
        </HoverEffect>

        <HoverEffect>
          <li
            className="px-4 py-2 text-2xl text-black dark:text-white"
            onClick={toggleDarkMode}
          >
            <button className="flex items-center gap-3">
              <span className="text-4xl lg:text-3xl">{darkMode.icon}</span>
              <span className="hidden font-medium lg:block">
                {darkMode.label}
              </span>
            </button>
          </li>
        </HoverEffect>
        {!session.data?.user ? (
          <HoverEffect>
            <li
              className="px-4 py-2 text-2xl text-black dark:text-white"
              onClick={() => void signIn()}
            >
              <button className="flex items-center gap-3">
                <span className="text-4xl lg:text-3xl">
                  <HiUser />
                </span>
                <span className="hidden font-medium lg:block">Login</span>
              </button>
            </li>
          </HoverEffect>
        ) : (
          <HoverEffect>
            <li
              className="px-4 py-2 text-2xl text-black dark:text-white"
              onClick={() => void signOut()}
            >
              <button className="flex items-center gap-3">
                <span className="text-4xl lg:text-3xl">
                  <HiOutlineArrowLeftOnRectangle />
                </span>
                <span className="hidden font-medium lg:block">Logout</span>
              </button>
            </li>
          </HoverEffect>
        )}
      </ul>
    </div>
  );
};

export default SideNavigation;

import React, { type ReactNode, useEffect, useState } from "react";
import { navLinks } from "~/constants/nav";
import Link from "next/link";
import HoverEffect from "~/utils/style/HoverEffect";
import {
  HiMoon,
  HiOutlineArrowLeftOnRectangle,
  HiSun,
  HiUser,
} from "react-icons/hi2";
import useColorMode from "~/utils/hooks/useColorMode";
import { signIn, signOut, useSession } from "next-auth/react";

const SideNavigation = () => {
  const session = useSession();

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
    <div className="h-screen w-20 flex-shrink-0 pt-12 md:w-56">
      <ul className="grid grid-cols-1 gap-4">
        {navLinks.map((link) => (
          <HoverEffect key={link.name}>
            <li className="px-4 py-2  text-2xl text-black dark:text-white">
              <Link href={link.path ?? ""} className="flex items-center gap-3">
                <span className="text-4xl md:text-3xl">{link.icon}</span>
                <span className="hidden font-medium md:block">{link.name}</span>
              </Link>
            </li>
          </HoverEffect>
        ))}

        <HoverEffect>
          <li
            className="px-4 py-2 text-2xl text-black dark:text-white"
            onClick={toggleDarkMode}
          >
            <button className="flex items-center gap-3">
              <span className="text-4xl md:text-3xl">{darkMode.icon}</span>
              <span className="hidden font-medium md:block">
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
                <span className="text-4xl md:text-3xl">
                  <HiUser />
                </span>
                <span className="hidden font-medium md:block">Login</span>
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
                <span className="text-4xl md:text-3xl">
                  <HiOutlineArrowLeftOnRectangle />
                </span>
                <span className="hidden font-medium md:block">Logout</span>
              </button>
            </li>
          </HoverEffect>
        )}
      </ul>
    </div>
  );
};

export default SideNavigation;

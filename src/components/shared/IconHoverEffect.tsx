import React, { ReactNode, useEffect, useState } from "react";

type IconHoverEffectProps = {
  children: ReactNode;
  red?: boolean;
  active?: boolean;
  gray?: boolean;
  blue?: boolean;
};

const IconHoverEffect = ({
  children,
  red = false,
  active = false,
  gray = false,
  blue = false,
}: IconHoverEffectProps) => {
  const [className, setClassName] = useState("");

  useEffect(() => {
    let colorClasses = "";

    if (red) {
      colorClasses =
        "outline-red-400 hover:bg-red-200 group-hover:bg-red-200 group-focus-visible:bg-red-200 dark:group-hover:bg-red-300 dark:group-focus-visible:bg-red-400 focus-visible:bg-red-200";
    } else if (blue) {
      colorClasses =
        "outline-blue-500 hover:bg-blue-100 group-hover:bg-blue-900 dark:hover:bg-blue-900 group-focus-visible:bg-blue-200 dark:group-hover:bg-blue-300 dark:group-focus-visible:bg-blue-400 focus-visible:bg-blue-200";
    } else if (gray) {
      colorClasses =
        "outline-gray-400 hover:bg-gray-200 group-hover:bg-gray-200 group-focus-visible:bg-gray-200 dark:group-hover:bg-gray-300 dark:group-focus-visible:bg-gray-400 focus-visible:bg-gray-200";
    }

    setClassName(
      `-ml-2 select-none cursor-pointer rounded-full bg-opacity-50 p-2 transition-colors duration-200 ${colorClasses}`
    );
  }, [red, active, gray]);

  return <div className={className}>{children}</div>;
};

export default IconHoverEffect;

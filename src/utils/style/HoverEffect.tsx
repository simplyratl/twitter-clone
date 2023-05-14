import React, { ReactNode } from "react";

type HoverEffectProps = {
  children: ReactNode;
  blue?: boolean;
  red?: boolean;
};

const HoverEffect = ({ children, blue, red }: HoverEffectProps) => {
  let hoverColor = "";
  let color = "";

  if (blue) color = "before:bg-blue-500";
  else if (red) color = "before:bg-red-500";
  else color = "before:bg-neutral-500";

  const before = `before:absolute before:inset-0 opacity-80 rounded-full overflow-hidden before:opacity-0 before:transition-colors ${color}`;

  if (red)
    hoverColor = `${before} hover:before:opacity-50 group-hover:before:opacity-50 group-hover:text-pink-600`;
  else if (blue)
    hoverColor = `${before} hover:before:opacity-50 group-hover:before:opacity-50 dark:group-hover:text-blue-300 group-hover:text-blue-600`;
  else hoverColor = "hover:bg-gray-300 dark:hover:bg-neutral-900";

  return (
    <div
      className={`${hoverColor} relative inset-0 w-fit cursor-pointer rounded-full transition-colors duration-200`}
    >
      {children}
    </div>
  );
};

export default HoverEffect;

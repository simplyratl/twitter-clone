import { AiFillGithub } from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import { HiUser } from "react-icons/hi2";
import { signIn } from "next-auth/react";

export const authProviders = [
  {
    name: "GitHub",
    icon: <AiFillGithub />,
    color: "white",
    textColor: "black",
    action: () => signIn("github"),
  },
  {
    name: "Google",
    icon: <FcGoogle />,
    color: "white",
    textColor: "black",
    action: () => signIn("google"),
  },
  {
    name: "Sign up",
    icon: <HiUser />,
    color: "white",
    textColor: "black",
    action: () => signIn("credentials"),
  },
];

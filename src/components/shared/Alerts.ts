import { toast, type TypeOptions } from "react-toastify";

export const notification = (message: string, type: string): unknown => {
  return toast(message, {
    position: "bottom-center",
    autoClose: 5000,
    type: type as TypeOptions,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "dark",
  });
};

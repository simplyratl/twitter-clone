import React from "react";
import { HiOutlineXMark } from "react-icons/hi2";
import HoverEffect from "~/utils/style/HoverEffect";
import Button from "~/components/shared/Button";

type ModalTopBarProps = {
  setModal: (value: boolean) => void;
  title: string;
  save?: boolean;
};

const ModalTopBar = ({ setModal, title, save }: ModalTopBarProps) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-6">
        <HoverEffect>
          <div
            className="rounded-md p-1 text-black dark:text-white"
            onClick={() => setModal(false)}
          >
            <HiOutlineXMark className="text-2xl" />
          </div>
        </HoverEffect>
        <h3 className="text-2xl font-medium text-black dark:text-white">
          {title}
        </h3>
      </div>

      <div>{save && <Button default>Save</Button>}</div>
    </div>
  );
};

export default ModalTopBar;

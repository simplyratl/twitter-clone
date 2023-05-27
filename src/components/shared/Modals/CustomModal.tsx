import React from "react";
import Modal from "react-modal";

type CustomModalProps = {
  modal: boolean;
  setModal: (value: boolean) => void;
  children?: React.ReactNode;
  width?: number;
  height?: number;
};

Modal.setAppElement("#__next");

const CustomModal = ({
  modal,
  setModal,
  children,
  width = 800,
  height = 600,
}: CustomModalProps) => {
  return (
    <Modal
      isOpen={modal}
      onRequestClose={() => setModal(false)}
      bodyOpenClassName="overflow-hidden"
      htmlOpenClassName={"overflow-hidden"}
      overlayClassName="fixed inset-0 bg-gray-900 dark:bg-opacity-80 bg-opacity-50 flex justify-center items-center z-50"
      className={`overflow-auto rounded-2xl bg-white p-4 shadow dark:bg-black dark:text-white dark:shadow-white`}
      style={{
        content: {
          width: width,
          height: height,
        },
      }}
    >
      {children}
    </Modal>
  );
};

export default CustomModal;

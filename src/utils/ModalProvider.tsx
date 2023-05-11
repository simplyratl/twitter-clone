import React from "react";
import ConfirmationModal from "~/components/shared/ConfirmationModal";
import Modal from "react-modal";
import { useRouter } from "next/router";

const ModalProvider = () => {
  const router = useRouter();

  return (
    <>
      <Modal isOpen={router.asPath.includes("/confirmation")}>
        <ConfirmationModal />
      </Modal>
    </>
  );
};

export default ModalProvider;

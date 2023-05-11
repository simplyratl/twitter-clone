import React from "react";
import { useRouter } from "next/router";
import ConfirmationModal from "~/components/shared/ConfirmationModal";
import Modal from "react-modal";

const ConfirmationModalPage = () => {
  const router = useRouter();
  const { id } = router.query;

  return (
    <Modal isOpen={!!id}>
      <ConfirmationModal />
    </Modal>
  );
};

export default ConfirmationModalPage;

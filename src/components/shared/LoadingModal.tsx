import React from "react";
import Loading from "~/components/shared/Loading";

const LoadingModal = () => {
  return (
    <div className="fixed inset-0 z-50 flex h-full w-full items-center justify-center bg-black bg-opacity-60">
      <div className="flex items-center justify-center">
        <Loading />
      </div>
    </div>
  );
};

export default LoadingModal;

import React from "react";

const LoadingModal = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
      <div className="text-2xl text-blue-400">Loading...</div>
    </div>
  );
};

export default LoadingModal;

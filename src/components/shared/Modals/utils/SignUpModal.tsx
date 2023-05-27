import React, { FormEvent } from "react";
import ModalTopBar from "~/components/shared/Modals/utils/ModalTopBar";
import { type ModalsProps } from "~/components/shared/Modals/index";
import { Input } from "~/components/shared/Modals/utils/Inputs";
import Button from "~/components/shared/Button";

const SignUpModal = ({ setModal }: ModalsProps) => {
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log("radi");
  };

  return (
    <div>
      <ModalTopBar setModal={setModal} title="Sign in" />

      <div className="mx-auto mt-12 max-w-[80%]">
        <h3 className="mb-6 text-3xl font-bold">Create an account</h3>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 justify-between gap-4"
        >
          <Input label="Name" />
          <Input label="Username" />
          <Input label="Email" />
          <Input label="Password" />

          <Button defaultColor className="py-3 text-lg">
            Save
          </Button>
        </form>
      </div>
    </div>
  );
};

export default SignUpModal;

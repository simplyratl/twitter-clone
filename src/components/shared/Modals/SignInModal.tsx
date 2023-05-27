import React, { FormEvent } from "react";
import ModalTopBar from "~/components/shared/Modals/utils/ModalTopBar";
import { type ModalsProps } from "~/components/shared/Modals/index";
import { Input } from "~/components/shared/Modals/utils/Inputs";
import Button from "~/components/shared/Button";
import ButtonSign from "~/components/shared/ButtonSign";
import { authProviders } from "~/constants/authProviders";

const SignInModal = ({ setModal }: ModalsProps) => {
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
  };

  return (
    <div>
      <ModalTopBar setModal={setModal} title="Sign in" />

      <div className="mx-auto mt-12 max-w-[80%]">
        <h3 className="mb-6 text-3xl font-bold">Create an account</h3>

        <form
          onSubmit={handleSubmit}
          className="items-between grid h-full grid-cols-1 justify-between gap-4"
        >
          <div className="grid gap-3">
            <Input label="Username" />
            <Input label="Password" />
          </div>

          <Button defaultColor className="py-3 text-lg">
            Login
          </Button>

          <div>
            {/* eslint-disable-next-line react/no-unescaped-entities */}
            <p className="text-center">Don't have an account?</p>

            <div className="mt-4 grid gap-3">
              {authProviders.map((provider) => (
                <div key={provider.name}>
                  <ButtonSign
                    onClick={provider.action}
                    className="flex h-full w-full items-center justify-center shadow shadow-white"
                    style={{
                      backgroundColor: provider.color,
                      color: provider.textColor,
                    }}
                  >
                    <span className="mr-2">{provider.icon}</span>
                    <span>{provider.name}</span>
                  </ButtonSign>
                </div>
              ))}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignInModal;

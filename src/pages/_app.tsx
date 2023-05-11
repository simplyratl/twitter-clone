import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import Head from "next/head";
import "react-toastify/dist/ReactToastify.css";

import { api } from "~/utils/api";

import SideNav from "~/components/shared/SideNav";
import "~/styles/globals.css";
import React from "react";
import Modal from "react-modal";
import { ToastContainer } from "react-toastify";
import ModalProvider from "~/utils/ModalProvider";

// eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
if (process.browser) {
  Modal.setAppElement("#__next");
}

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <div className="bg-white dark:bg-black">
        <Head>
          <title>Twitter Clone</title>
          <meta name="description" content="Twitter clone!" />
        </Head>

        <div className="mx-auto flex max-w-[1000px] items-start sm:pr-4">
          <SideNav />
          <div className="min-h-screen flex-grow border-x dark:border-gray-500">
            <Component {...pageProps} />
            <ToastContainer />
          </div>
        </div>
      </div>

      <ModalProvider />
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);

import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

import { api } from "~/utils/api";

import "~/styles/globals.css";
import SideNavigation from "~/components/shared/SideNavigation";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <div className="bg-white dark:bg-black">
        <div className="mx-auto flex max-w-4xl px-4">
          <SideNavigation />

          <main className="flex-[6] border-l border-r dark:border-neutral-700 md:flex-[3]">
            <Component {...pageProps} />
          </main>
        </div>
      </div>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);

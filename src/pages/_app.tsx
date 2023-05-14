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
      <div className="bg-white pb-32 dark:bg-black sm:p-0">
        <div className="mx-auto flex max-w-4xl sm:justify-between md:px-4 lg:justify-start">
          <SideNavigation />

          <main className="flex-[6] dark:border-neutral-700 sm:border-l sm:border-r md:flex-[3]">
            <Component {...pageProps} />
          </main>
        </div>
      </div>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);

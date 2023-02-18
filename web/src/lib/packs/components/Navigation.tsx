import { classed } from "@tw-classed/react";
import Image from "next/image";
import { Link } from "~/components";
import { useAuth } from "~/lib/auth/useAuth";

export const Navigation = () => {
  const auth = useAuth();
  return (
    <NavigationContainer>
      {/* Left */}
      <div className="flex items-center pl-3 desktop:w-[215px]">
        <Link href="/packs">
          <Image
            className="logo"
            src="/logo/logomark.svg"
            alt="Truffles"
            height="35"
            width="35"
          />
        </Link>
      </div>
      {/* right end */}
      {!auth.loading && (
        <div className="flex justify-end items-center flex-auto px-3">
          {auth.user ? (
            <>
              <Link className="hover:underline p-3" href="/">Play</Link>
              <Link className="hover:underline p-3" href={`/u/${auth.user.user_metadata.username}`}>
                Profile
              </Link>
              <button type="button" onClick={auth.signOut} className="p-3 hover:underline">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link className="hover:underline p-3" href="/">Play</Link>
              <Link className="hover:underline p-3" href="/auth/request">Sign Up</Link>
              <Link className="hover:underline p-3" href="/auth/login">Login</Link>
            </>
          )}
        </div>
      )}
    </NavigationContainer>
  );
};

export const NavigationContainer = classed.nav(
  "flex bg-white dark:bg-black border-b border-grey-dark dark:border-grey-light h-[50px] [grid-area:header]",
  "[&_.pack-title]:m-0"
);

import Link from "next/link";
import { HomeIcon } from "lucide-react";

import { getAuthSession } from "@/lib/auth";
import CustomFeed from "./_components/custom-feed";
import GeneralFeed from "./_components/general-feed";
import { buttonVariants } from "@/components/ui/button";

const HomePage = async () => {
  const session = await getAuthSession();

  return (
    <>
      <h1 className="font-bold text-3xl md:text-4xl">Your feed</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 md:gap-x-4 py-6">
        {session ? <CustomFeed /> : <GeneralFeed />}

        <div className="overflow-hidden h-fit rounded-lg border order-first md:order-last">
          <div className="bg-emerald-500 px-6 py-4">
            <p className="font-semibold text-secondary py-3 flex items-center gap-1.5">
              <HomeIcon className="h-4 w-4" />
              Home
            </p>
          </div>
          <dl className="-my-3 divide-y divide-border px-6 py-4 text-sm leading-6">
            <div className="flex justify-between gap-x-4 py-3">
              <p className="text-muted-foreground">
                Your SpreadIt playground. Hop on in and connect with your
                favorite communities!
              </p>
            </div>

            <Link
              className={buttonVariants({
                className: "w-full mt-4 mb-6",
              })}
              href={`/r/create`}
            >
              Spread It
            </Link>
          </dl>
        </div>
      </div>
    </>
  );
};

export default HomePage;

// import { authOptions } from "@/lib/auth";
// import { getServerSession } from "next-auth";
import Link from "next/link";
import { Icons } from "../icons";
import { buttonVariants } from "../ui/button";
import { cn } from "@/lib/utils";
// import { UserAccountNav } from "./UserAccountNav";
// import SearchBar from "./SearchBar";

const Navbar = async () => {
  //   const session = await getServerSession(authOptions);
  return (
    <nav className="fixed top-0 inset-x-0 h-fit border-b z-[10] py-2">
      <div className="container max-w-7xl h-full mx-auto flex items-center justify-between gap-2">
        <Link
          href="/"
          className="flex gap-2 items-center hover:opacity-80"
        >
          <Icons.logo className="h-9 w-9" />
          <p className="hidden text-primary text-sm font-medium md:block">
            SpreadIt
          </p>
        </Link>

        {/* <SearchBar /> */}

        {/* {session?.user ? (
          <UserAccountNav user={session.user} />
        ) : ( */}
        <Link
          href="/sign-in"
          className={cn(
            buttonVariants({ size: "sm", variant: "default" }),
            "bg-emerald-500 transition hover:bg-emerald-600"
          )}
        >
          Sign In
        </Link>
        {/* )} */}
      </div>
    </nav>
  );
};

export default Navbar;

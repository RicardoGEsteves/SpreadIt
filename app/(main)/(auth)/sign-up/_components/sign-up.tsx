import Link from "next/link";

import { Icons } from "@/components/icons";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import UserAuthForm from "../../_components/user-auth-form";

const SignUp = () => {
  return (
    <div className="container mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
      <div className="flex flex-col space-y-2 text-center">
        <Icons.logo className="mx-auto h-12 w-12" />
        <h1 className="text-2xl font-semibold tracking-tight">
          Join SpreadIt community.
        </h1>
        <p className="text-sm max-w-xs mx-auto">
          By continuing, you are creating a SpreadIt account and consenting to
          our User Agreement and Privacy Policy.
        </p>
      </div>
      <UserAuthForm />
      <p className="px-8 text-center text-sm text-muted-foreground">
        Already part of the SpreadIt community?{" "}
        <Link
          href="/sign-in"
          className={cn(
            buttonVariants({ variant: "link", size: "sm" }),
            "text-sm text-muted-foreground hover:text-emerald-500"
          )}
        >
          Sign In
        </Link>
      </p>
    </div>
  );
};

export default SignUp;

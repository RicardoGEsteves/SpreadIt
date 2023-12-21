import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

export const useCustomToasts = () => {
  const signInToast = () => {
    const { dismiss } = toast({
      title: "Sign In required.",
      description: "You need to be logged in make that action.",
      variant: "default",
      action: (
        <Link
          onClick={() => dismiss()}
          href="/sign-in"
          className={buttonVariants({ variant: "outline" })}
        >
          Sign In
        </Link>
      ),
    });
  };

  return { signInToast };
};

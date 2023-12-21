"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

type UserAuthFormProps = React.HTMLAttributes<HTMLDivElement>;

const UserAuthForm = ({ className, ...props }: UserAuthFormProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();

  const signInWithGoogle = async () => {
    setIsLoading(true);

    try {
      await signIn("google");
    } catch (error: any) {
      toast({
        title: "Error",
        description: `There was an error logging in with Google, [${error.message}]. Please try again.`,
        variant: "default",
      });
    } finally {
      setIsLoading(false);
    }

    setIsLoading(false);
  };

  return (
    <div
      className={cn("flex justify-center", className)}
      {...props}
    >
      <Button
        isLoading={isLoading}
        type="button"
        size="sm"
        className="w-full"
        onClick={signInWithGoogle}
        disabled={isLoading}
      >
        {isLoading ? null : <Icons.google className="h-4 w-4 mr-2" />}
        Google
      </Button>
    </div>
  );
};

export default UserAuthForm;

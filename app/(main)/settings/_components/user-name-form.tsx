"use client";

import { useEffect, useState } from "react";
import { User } from "@prisma/client";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";

import { UsernameValidator } from "@/lib/validators/username";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type UserNameFormProps = {
  user: Pick<User, "id" | "username">;
} & React.HTMLAttributes<HTMLFormElement>;

type FormData = z.infer<typeof UsernameValidator>;

const UserNameForm = ({ user, className, ...props }: UserNameFormProps) => {
  const router = useRouter();
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(UsernameValidator),
    defaultValues: {
      name: user?.username || "",
    },
  });

  // @ts-expect-error
  const { mutate: updateUsername, isLoading } = useMutation({
    mutationFn: async ({ name }: FormData) => {
      const payload: FormData = { name };

      const { data } = await axios.patch(`/api/username/`, payload);
      return data;
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 409) {
          return toast({
            title: "Username already taken.",
            description: "Please choose another username.",
            variant: "default",
          });
        }
      }

      return toast({
        title: "Something went wrong.",
        description: "Your username was not updated. Please try again.",
        variant: "default",
      });
    },
    onSuccess: () => {
      toast({
        description: "Your username has been updated.",
      });
      router.refresh();
    },
  });

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  return (
    <form
      className={cn(className)}
      onSubmit={handleSubmit((e) => updateUsername(e))}
      {...props}
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Your username</CardTitle>
          <CardDescription className=" text-sm text-muted-foreground">
            <p className="py-4">
              Your username is how other users will identify you on the site,
              you can change it at any time. Changing your username will not
              affect your existing posts and comments.
            </p>
            <p className="text-xs">
              Username can only contain letters, numbers and underscore.
            </p>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative grid gap-1">
            <div className="absolute top-0 left-0 w-8 h-10 grid place-items-center">
              <span className="text-sm text-emerald-500">u/</span>
            </div>
            <Label
              className="sr-only"
              htmlFor="name"
            >
              Name
            </Label>
            <Input
              id="name"
              className="w-[400px] pl-6 text-muted-foreground"
              size={32}
              {...register("name")}
            />
            {errors?.name && (
              <p className="px-1 text-xs text-red-500">{errors.name.message}</p>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button
            isLoading={isLoading}
            variant="primary"
          >
            Change name
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
};

export default UserNameForm;

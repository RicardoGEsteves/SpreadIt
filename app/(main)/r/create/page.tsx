"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";

import { useCustomToasts } from "@/hooks/use-custom-toasts";
import { toast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CreateSubSpreadItPayload } from "@/lib/validators/sub-spreadIt";

const CreatePage = () => {
  const router = useRouter();
  const [input, setInput] = useState("");
  const { signInToast } = useCustomToasts();

  // @ts-expect-error
  const { mutate: createCommunity, isLoading } = useMutation({
    mutationFn: async () => {
      const payload: CreateSubSpreadItPayload = {
        name: input,
      };

      const { data } = await axios.post("/api/subspreadit", payload);
      return data as string;
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 409) {
          return toast({
            title: "SubSpreadIt already exists.",
            description: "Please choose a different name.",
            variant: "default",
          });
        }

        if (err.response?.status === 422) {
          return toast({
            title: "Invalid subSpreadIt name.",
            description:
              "Please choose a name between 3 and 21 letters. You can only use letters, numbers, dashes and underscores. You can't have withe spaces.",
            variant: "default",
          });
        }

        if (err.response?.status === 401) {
          return signInToast();
        }
      }

      toast({
        title: "There was an error.",
        description: "Could not create subSpreadIt.",
        variant: "default",
      });
    },
    onSuccess: (data) => {
      router.push(`/r/${data}`);
    },
  });

  return (
    <div className="container flex items-center h-full max-w-3xl mx-auto">
      <div className="relative bg-background w-full h-fit p-4 rounded-lg space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-semibold">
            Create a Community & SpreadIt
          </h1>
        </div>

        <hr className="bg-border h-px" />

        <div>
          <p className="text-lg font-medium">Name</p>
          <p className="text-xs pb-2">
            A community name is a unique identifier for your community, you can
            use it to refer to your community in the future. You can&apos;t
            change your community name after creating it.
          </p>
          <div className="relative">
            <p className="absolute text-sm left-0 w-8 inset-y-0 grid place-items-center text-muted-foreground">
              r/
            </p>
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="pl-6 mt-3"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  createCommunity();
                } else if (e.key === "Escape") {
                  setInput("");
                }
              }}
            />
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Button
            disabled={isLoading}
            variant="default"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
          <Button
            isLoading={isLoading}
            disabled={input.length === 0}
            onClick={() => createCommunity()}
            variant={"primary"}
          >
            Create Community
          </Button>
        </div>
      </div>
    </div>
  );
};
export default CreatePage;

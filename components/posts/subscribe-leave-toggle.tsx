"use client";

import { startTransition } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";

import { SubscribeToSubSpreadItPayload } from "@/lib/validators/sub-spreadIt";
import { useCustomToasts } from "@/hooks/use-custom-toasts";
import { useToast } from "@/hooks/use-toast";
import { Button } from "../ui/button";

type SubscribeLeaveToggleProps = {
  isSubscribed: boolean;
  subSpreadItId: string;
  subSpreadItName: string;
};

const SubscribeLeaveToggle = ({
  isSubscribed,
  subSpreadItId,
  subSpreadItName,
}: SubscribeLeaveToggleProps) => {
  const { toast } = useToast();
  const { signInToast } = useCustomToasts();
  const router = useRouter();

  // @ts-expect-error
  const { mutate: subscribe, isLoading: isSubLoading } = useMutation({
    mutationFn: async () => {
      const payload: SubscribeToSubSpreadItPayload = {
        subSpreadItId,
      };

      const { data } = await axios.post("/api/subspreadit/subscribe", payload);
      return data as string;
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 401) {
          return signInToast();
        }
      }

      return toast({
        title: "There was a problem.",
        description: "Something went wrong. Please try again.",
        variant: "default",
      });
    },
    onSuccess: () => {
      startTransition(() => {
        // Refresh the current route and fetch new data from the server without
        // losing client-side browser or React state.
        router.refresh();
      });
      toast({
        title: "Subscribed!",
        description: `You are now subscribed to r/${subSpreadItName}`,
      });
    },
  });

  // @ts-expect-error
  const { mutate: unsubscribe, isLoading: isUnsubLoading } = useMutation({
    mutationFn: async () => {
      const payload: SubscribeToSubSpreadItPayload = {
        subSpreadItId,
      };

      const { data } = await axios.post(
        "/api/subspreadit/unsubscribe",
        payload
      );
      return data as string;
    },
    onError: (err: AxiosError) => {
      toast({
        title: "Error",
        description: err.response?.data as string,
        variant: "default",
      });
    },
    onSuccess: () => {
      startTransition(() => {
        // Refresh the current route and fetch new data from the server without
        // losing client-side browser or React state.
        router.refresh();
      });
      toast({
        title: "Unsubscribed!",
        description: `You are now unsubscribed from/${subSpreadItName}`,
      });
    },
  });

  return isSubscribed ? (
    <Button
      className="w-full mt-1 mb-4"
      isLoading={isUnsubLoading}
      onClick={() => unsubscribe()}
    >
      Leave community
    </Button>
  ) : (
    <Button
      className="w-full mt-1 mb-4"
      isLoading={isSubLoading}
      onClick={() => subscribe()}
    >
      Join to post
    </Button>
  );
};

export default SubscribeLeaveToggle;

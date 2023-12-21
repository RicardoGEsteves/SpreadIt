"use client";

import type { Session } from "next-auth";
import { usePathname, useRouter } from "next/navigation";
import { ImageIcon, Link2 } from "lucide-react";

import UserAvatar from "../user-avatar";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

type SubSpreadItPostProps = {
  session: Session | null;
};

const SubSpreadItPost = ({ session }: SubSpreadItPostProps) => {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <article className="overflow-hidden rounded-md bg-background border">
      <div className="h-full px-6 py-4 flex justify-between gap-6">
        <div className="relative">
          <UserAvatar
            user={{
              name: session?.user.name || null,
              image: session?.user.image || null,
            }}
          />

          <span className="absolute bottom-0 right-0 rounded-full w-3 h-3 bg-emerald-500 outline outline-2 outline-white" />
        </div>
        <Input
          onClick={() => router.push(pathname + "/submit")}
          readOnly
          placeholder="Create post"
        />
        <Button
          onClick={() => router.push(pathname + "/submit")}
          variant="ghost"
          className="text-emerald-500 hover:text-emerald-600"
        >
          <ImageIcon />
        </Button>
        <Button
          onClick={() => router.push(pathname + "/submit")}
          variant="ghost"
          className="text-emerald-500 hover:text-emerald-600"
        >
          <Link2 />
        </Button>
      </div>
    </article>
  );
};

export default SubSpreadItPost;

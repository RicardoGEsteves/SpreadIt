import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { format } from "date-fns";

import { buttonVariants } from "@/components/ui/button";
import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import SubscribeLeaveToggle from "@/components/posts/subscribe-leave-toggle";
import ToFeedButton from "@/components/to-feed-button";

export const metadata: Metadata = {
  title: "SpreadIt",
  description:
    "SpreadIt is a dynamic social news aggregation platform powered by robust backend technologies and a user-friendly interface. It employs modern web development frameworks and scalable architecture to enable seamless content submission, sharing, and voting across various formats (articles, images, videos).",
};

type SlugLayoutProps = {
  children: React.ReactNode;
  params: {
    slug: string;
  };
};

const SlugLayout = async ({ children, params: { slug } }: SlugLayoutProps) => {
  const session = await getAuthSession();

  const subSpreadIt = await db.subSpreadIt.findFirst({
    where: { name: slug },
    include: {
      posts: {
        include: {
          author: true,
          votes: true,
        },
      },
    },
  });

  const subscription = !session?.user
    ? undefined
    : await db.subscription.findFirst({
        where: {
          subSpreadIt: {
            name: slug,
          },
          user: {
            id: session.user.id,
          },
        },
      });

  const isSubscribed = !!subscription;

  if (!subSpreadIt) return notFound();

  const memberCount = await db.subscription.count({
    where: {
      subSpreadIt: {
        name: slug,
      },
    },
  });

  return (
    <div className="sm:container max-w-7xl mx-auto h-full pt-12">
      <div>
        <ToFeedButton />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 md:gap-x-4 py-6">
          <ul className="flex flex-col col-span-2 space-y-6">{children}</ul>

          <div className="overflow-hidden h-fit rounded-lg border order-first md:order-last">
            <div className="px-6 py-4">
              <p className="font-semibold py-3">About r/{subSpreadIt.name}</p>
            </div>
            <dl className="divide-y divide-border px-6 py-4 text-sm leading-6 bg-background">
              <div className="flex justify-between gap-x-4 py-3">
                <dt className="text-muted-foreground">Created</dt>
                <dd className="text-muted">
                  <time dateTime={subSpreadIt.createdAt.toDateString()}>
                    {format(subSpreadIt.createdAt, "d MMM, yyyy")}
                  </time>
                </dd>
              </div>
              <div className="flex justify-between gap-x-4 py-3">
                <dt className="text-muted-foreground">Members</dt>
                <dd className="flex items-start gap-x-2">
                  <div className="text-muted">{memberCount}</div>
                </dd>
              </div>
              {subSpreadIt.creatorId === session?.user?.id ? (
                <div className="flex justify-between gap-x-4 py-3">
                  <dt className="text-muted-foreground">
                    You are the community creator
                  </dt>
                </div>
              ) : null}

              {subSpreadIt.creatorId !== session?.user?.id ? (
                <SubscribeLeaveToggle
                  isSubscribed={isSubscribed}
                  subSpreadItId={subSpreadIt.id}
                  subSpreadItName={subSpreadIt.name}
                />
              ) : null}
              <Link
                className={buttonVariants({
                  variant: "primary",
                  className: "w-full mb-6",
                })}
                href={`/r/${slug}/submit`}
              >
                Create Post
              </Link>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SlugLayout;

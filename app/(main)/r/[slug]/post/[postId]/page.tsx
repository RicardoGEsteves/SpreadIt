import { notFound } from "next/navigation";
import { Post, User, Vote } from "@prisma/client";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

import { db } from "@/lib/db";
import { redis } from "@/lib/redis";
import { CachedPost } from "@/types/redis";

import PostVoteSkeleton from "./_components/post-vote-skeleton";
import PostVoteServer from "@/components/posts/post-vote/server";
import { formatTimeToNow } from "@/lib/utils";
import TextEditorOutput from "@/components/rich-text-editor/text-editor-output";
import CommentsSection from "@/components/comments/comments-section";

type SubSpreadItPostPageProps = {
  params: {
    postId: string;
  };
};

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

const SubSpreadItPostPage = async ({ params }: SubSpreadItPostPageProps) => {
  const cachedPost = (await redis.hgetall(
    `post:${params.postId}`
  )) as CachedPost;

  let post: (Post & { votes: Vote[]; author: User }) | null = null;

  if (!cachedPost) {
    post = await db.post.findFirst({
      where: {
        id: params.postId,
      },
      include: {
        votes: true,
        author: true,
      },
    });
  }

  if (!post && !cachedPost) return notFound();

  return (
    <div>
      <div className="h-full flex flex-col sm:flex-row items-center sm:items-start justify-between">
        <Suspense fallback={<PostVoteSkeleton />}>
          <PostVoteServer
            postId={post?.id ?? cachedPost.id}
            getData={async () => {
              return await db.post.findUnique({
                where: {
                  id: params.postId,
                },
                include: {
                  votes: true,
                },
              });
            }}
          />
        </Suspense>

        <div className="sm:w-0 w-full flex-1 bg-background p-4 rounded-sm">
          <p className="max-h-40 mt-1 truncate text-xs text-emerald-500">
            Posted by u/{post?.author.username ?? cachedPost.authorUsername}{" "}
            {formatTimeToNow(new Date(post?.createdAt ?? cachedPost.createdAt))}
          </p>
          <h1 className="text-xl font-semibold py-2 leading-6 text-muted-foreground">
            {post?.title ?? cachedPost.title}
          </h1>

          <TextEditorOutput content={post?.content ?? cachedPost.content} />
          <Suspense
            fallback={
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            }
          >
            {/* @ts-ignore */}
            <CommentsSection postId={post?.id ?? cachedPost.id} />
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default SubSpreadItPostPage;

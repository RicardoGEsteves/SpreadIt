"use client";

import { Vote, Post, User } from "@prisma/client";
import { useRef } from "react";
import Link from "next/link";
import { MessageSquare } from "lucide-react";

import { formatTimeToNow } from "@/lib/utils";
import TextEditorOutput from "../rich-text-editor/text-editor-output";

type PartialVote = Pick<Vote, "type">;

type PostProps = {
  post: Post & {
    author: User;
    votes: Vote[];
  };
  votesAmt: number;
  subSpreadItName: string;
  currentVote?: PartialVote;
  commentAmt: number;
};

const Post = ({
  post,
  votesAmt: _votesAmt,
  currentVote: _currentVote,
  subSpreadItName,
  commentAmt,
}: PostProps) => {
  const pRef = useRef<HTMLParagraphElement>(null);
  return (
    <div className="rounded-md bg-background border">
      <div className="px-6 py-4 flex justify-between">
        {/* <PostVoteClient
          postId={post.id}
          initialVotesAmt={_votesAmt}
          initialVote={_currentVote?.type}
        /> */}

        <div className="w-0 flex-1">
          <div className="max-h-40 mt-1 text-xs text-muted-foreground">
            {subSpreadItName ? (
              <>
                <a
                  className="underline text-emerald-500 text-sm underline-offset-2"
                  href={`/r/${subSpreadItName}`}
                >
                  r/{subSpreadItName}
                </a>
                <span className="px-1">•</span>
              </>
            ) : null}
            <span>Posted by u/{post.author.username}</span>{" "}
            {formatTimeToNow(new Date(post.createdAt))}
          </div>
          <a href={`/r/${subSpreadItName}/post/${post.id}`}>
            <h1 className="text-lg font-semibold py-2 leading-6 text-muted-foreground">
              {post.title}
            </h1>
          </a>

          <div
            className="relative text-sm max-h-40 w-full overflow-clip"
            ref={pRef}
          >
            <TextEditorOutput content={post.content} />
            {pRef.current?.clientHeight === 160 ? (
              // blur bottom if content is too long
              <div className="absolute bottom-0 left-0 h-24 w-full bg-gradient-to-t from-background to-transparent"></div>
            ) : null}
          </div>
        </div>
      </div>

      <div className="bg-background z-20 text-sm px-4 py-4 sm:px-6">
        <Link
          href={`/r/${subSpreadItName}/post/${post.id}`}
          className="w-fit flex items-center gap-2 text-muted-foreground"
        >
          <MessageSquare className="h-4 w-4" /> {commentAmt} comments
        </Link>
      </div>
    </div>
  );
};

export default Post;

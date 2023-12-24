"use client";

import { useIntersection } from "@mantine/hooks";
import { useSession } from "next-auth/react";
import { useEffect, useRef } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import { Loader2 } from "lucide-react";

import { ExtendedPost } from "@/types/db";
import { INFINITE_SCROLL_PAGINATION_RESULTS } from "@/config/config";
import Post from "./post";

type PostFeedProps = {
  initialPosts: ExtendedPost[];
  subSpreadItName: string;
};

const PostFeed = ({ initialPosts, subSpreadItName }: PostFeedProps) => {
  const lastPostRef = useRef<HTMLElement>(null);
  const { ref, entry } = useIntersection({
    root: lastPostRef.current,
    threshold: 1,
  });
  const { data: session } = useSession();

  const fetchPosts = async ({ pageParam = 1 }: { pageParam: number }) => {
    const query =
      `/api/posts?limit=${INFINITE_SCROLL_PAGINATION_RESULTS}&page=${pageParam}` +
      (subSpreadItName ? `&subSpreadItName=${subSpreadItName}` : "");

    const { data } = await axios.get(query);
    return data as ExtendedPost[];
  };

  const { data, fetchNextPage, isFetchingNextPage } = useInfiniteQuery<
    ExtendedPost[],
    Error
  >({
    queryKey: ["infinite-query"],
    queryFn: () => fetchPosts({ pageParam: 1 }), // Provide an initial value for pageParam
    getNextPageParam: (_, pages) => {
      return pages.length + 1;
    },
    initialData: {
      pages: [initialPosts],
      pageParams: [1],
    },
    initialPageParam: 1, // Provide the initialPageParam property
    staleTime: Infinity,
  });

  useEffect(() => {
    if (entry?.isIntersecting) {
      fetchNextPage(); // Load more posts when the last post comes into view
    }
  }, [entry, fetchNextPage]);

  const posts = data?.pages.flatMap((page) => page) ?? initialPosts;

  const postsComponents = posts.map((post, index) => {
    const votesAmt = post.votes.reduce((acc, vote) => {
      if (vote.type === "UP") return acc + 1;
      if (vote.type === "DOWN") return acc - 1;
      return acc ?? 0;
    }, 0);

    const currentVote = post.votes.find(
      (vote) => vote.userId === session?.user?.id
    );

    const isLastPost = index === posts.length - 1;

    return (
      <li
        key={post.id}
        ref={isLastPost ? ref : null}
      >
        <Post
          post={post}
          commentAmt={post.comments.length}
          subSpreadItName={post.subSpreadIt?.name}
          votesAmt={votesAmt}
          currentVote={currentVote}
        />
      </li>
    );
  });

  return (
    <ul className="flex flex-col col-span-2 space-y-6">
      {postsComponents}
      {isFetchingNextPage && (
        <li className="flex justify-center">
          <Loader2 className="w-6 h-6 text-muted-foreground animate-spin" />
        </li>
      )}
      <li ref={ref}></li>
    </ul>
  );
};

export default PostFeed;

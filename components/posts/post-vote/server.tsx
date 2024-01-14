import type { Post, Vote } from "@prisma/client";
import { notFound } from "next/navigation";
import PostVoteClient from "./client";
import { getAuthSession } from "@/lib/auth";

type PostVoteServerProps = {
  postId: string;
  initialVotesAmt?: number;
  initialVote?: Vote["type"] | null;
  getData?: () => Promise<(Post & { votes: Vote[] }) | null>;
};

//  - split the PostVotes into a client and a server component to allow for dynamic data
//    fetching inside of this component, allowing for faster page loads via suspense streaming.
//  - also have an option to fetch this info on a page-level and pass it in.

const PostVoteServer = async ({
  postId,
  initialVotesAmt,
  initialVote,
  getData,
}: PostVoteServerProps) => {
  const session = await getAuthSession();

  let votesAmt: number = 0;
  let currentVote: Vote["type"] | null | undefined = undefined;

  if (getData) {
    // fetch data in component
    const post = await getData();
    if (!post) return notFound();

    votesAmt = post.votes.reduce((acc, vote) => {
      if (vote.type === "UP") return acc + 1;
      if (vote.type === "DOWN") return acc - 1;
      return acc;
    }, 0);

    currentVote = post.votes.find(
      (vote) => vote.userId === session?.user?.id
    )?.type;
  } else {
    // passed as props
    votesAmt = initialVotesAmt!;
    currentVote = initialVote;
  }

  return (
    <PostVoteClient
      postId={postId}
      initialVotesAmt={votesAmt}
      initialVote={currentVote}
    />
  );
};

export default PostVoteServer;

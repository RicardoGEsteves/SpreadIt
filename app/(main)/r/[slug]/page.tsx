import { notFound } from "next/navigation";

import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { INFINITE_SCROLL_PAGINATION_RESULTS } from "@/config/config";
import SubSpreadItPost from "@/components/posts/sub-spreadIt-post";
import PostFeed from "@/components/posts/post-feed";

type SlugPageProps = {
  params: {
    slug: string;
  };
};

const SlugPage = async ({ params }: SlugPageProps) => {
  const { slug } = params;
  const session = await getAuthSession();

  const subSpreadIt = await db.subSpreadIt.findFirst({
    where: { name: slug },
    include: {
      posts: {
        include: {
          author: true,
          votes: true,
          comments: true,
          subSpreadIt: true,
        },
        orderBy: {
          createdAt: "desc",
        },
        take: INFINITE_SCROLL_PAGINATION_RESULTS,
      },
    },
  });

  if (!subSpreadIt) return notFound();

  return (
    <>
      <h1 className="font-bold text-primary text-3xl md:text-4xl h-14">
        r/{subSpreadIt.name}
      </h1>
      <SubSpreadItPost session={session} />
      <PostFeed
        initialPosts={subSpreadIt.posts}
        subSpreadItName={subSpreadIt.name}
      />
    </>
  );
};

export default SlugPage;

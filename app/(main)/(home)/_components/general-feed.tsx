import { db } from "@/lib/db";
import { INFINITE_SCROLL_PAGINATION_RESULTS } from "@/config/config";
import PostFeed from "@/components/posts/post-feed";

const GeneralFeed = async () => {
  const posts = await db.post.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      votes: true,
      author: true,
      comments: true,
      subSpreadIt: true,
    },
    take: INFINITE_SCROLL_PAGINATION_RESULTS,
  });

  return <PostFeed initialPosts={posts} />;
};

export default GeneralFeed;

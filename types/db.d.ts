import type { Post, SubSpreadIt, User, Vote, Comment } from "@prisma/client";

export type ExtendedPost = Post & {
  subSpreadIt: SubSpreadIt;
  votes: Vote[];
  author: User;
  comments: Comment[];
};

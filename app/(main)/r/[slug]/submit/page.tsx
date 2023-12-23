import { notFound } from "next/navigation";

import { Button } from "@/components/ui/button";
import { db } from "@/lib/db";
import TextEditor from "@/components/rich-text-editor/text-editor";

type SubmitPostProps = {
  params: {
    slug: string;
  };
};

const SubmitPost = async ({ params: { slug } }: SubmitPostProps) => {
  const subSpreadIt = await db.subSpreadIt.findFirst({
    where: {
      name: slug,
    },
  });

  if (!subSpreadIt) return notFound();

  return (
    <div className="flex flex-col items-start gap-6">
      <div className="border-b pb-5">
        <div className="-ml-2 -mt-2 flex flex-wrap items-baseline">
          <h3 className="ml-2 mt-2 text-base font-semibold leading-6 text-primary">
            Create Post
          </h3>
          <p className="ml-2 mt-1 truncate text-sm text-muted-foreground">
            in r/{slug}
          </p>
        </div>
      </div>

      <TextEditor subSpreadItId={subSpreadIt.id} />

      <div className="w-full flex justify-end">
        <Button
          type="submit"
          className="w-full"
          form="subspreadit-post-form"
          variant="primary"
        >
          Post
        </Button>
      </div>
    </div>
  );
};

export default SubmitPost;

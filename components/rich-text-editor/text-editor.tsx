"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { usePathname, useRouter } from "next/navigation";
import TextareaAutosize from "react-textarea-autosize";
import { z } from "zod";

import { toast } from "@/hooks/use-toast";
import { PostCreationRequest, PostValidator } from "@/lib/validators/post";

type FormData = z.infer<typeof PostValidator>;

type TextEditorProps = {
  subSpreadItId: string;
};

const TextEditor = ({ subSpreadItId }: TextEditorProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(PostValidator),
    defaultValues: {
      subSpreadItId,
      title: "",
      content: null,
    },
  });
  // const [headerTitle, setHeaderTitle] = useState("");
  const [editorContent, setEditorContent] = useState();
  const router = useRouter();
  const pathname = usePathname();

  const EditorSetup = useMemo(
    () =>
      dynamic(() => import("@/components/rich-text-editor/editor-setup"), {
        ssr: false,
      }),
    []
  );

  const { mutate: createPost } = useMutation({
    mutationFn: async ({
      title,
      content,
      subSpreadItId,
    }: PostCreationRequest) => {
      const payload: PostCreationRequest = { title, content, subSpreadItId };
      const { data } = await axios.post(
        "/api/subspreadit/post/create",
        payload
      );
      return data;
    },
    onError: () => {
      return toast({
        title: "Something went wrong.",
        description: "Your post was not published. Please try again.",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      // turn pathname /r/mycommunity/submit into /r/mycommunity
      const newPathname = pathname.split("/").slice(0, -1).join("/");
      router.push(newPathname);

      router.refresh();

      return toast({
        description: "Your post has been published.",
      });
    },
  });

  useEffect(() => {
    if (Object.keys(errors).length) {
      for (const [_key, value] of Object.entries(errors)) {
        value;
        toast({
          title: "Something went wrong.",
          description: (value as { message: string }).message,
          variant: "destructive",
        });
      }
    }
  }, [errors]);

  //TODO: Finish implementation
  async function handleEditorChange(editor: any) {
    const editorBlocks = JSON.parse(editor);
    setEditorContent(editorBlocks);
    // console.log(editorBlocks.map((block: any) => block.content));
    console.log(editorBlocks);
  }

  async function onSubmit(data: FormData) {
    if (!editorContent) {
      return toast({
        title: "Something went wrong.",
        description: "Your post was not published. Please try again.",
        variant: "default",
      });
    }

    const payload: PostCreationRequest = {
      //TODO: Check values
      title: data.title,
      content: editorContent,
      subSpreadItId,
    };

    createPost(payload);
  }

  return (
    <div className="w-full p-4 bg-background rounded-lg border">
      <form
        id="subspreadit-post-form"
        className="w-fit"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="prose prose-stone dark:prose-invert">
          <TextareaAutosize
            // value={headerTitle}
            // onChange={(e) => setHeaderTitle(e.target.value)}
            {...register("title")}
            placeholder="Title"
            className="w-full resize-none appearance-none overflow-hidden bg-transparent text-5xl font-bold focus:outline-none placeholder:text-muted-foreground"
          />
          <div
            id="editor"
            className="min-h-[500px]"
          >
            <EditorSetup
              onChange={handleEditorChange}
              editable
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default TextEditor;

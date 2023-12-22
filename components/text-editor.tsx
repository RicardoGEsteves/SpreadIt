"use client";

import { useRouter, usePathname } from "next/navigation";
import dynamic from "next/dynamic";
import { useEffect, useMemo, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useForm } from "react-hook-form";
import TextareaAutosize from "react-textarea-autosize";
import { zodResolver } from "@hookform/resolvers/zod";
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

  const Editor = useMemo(
    () => dynamic(() => import("@/components/editor"), { ssr: false }),
    []
  );

  const titleRef = useRef(null);
  const editorContentRef = useRef("");
  const router = useRouter();
  const pathname = usePathname();

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
        variant: "default",
      });
    },
    onSuccess: () => {
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
          variant: "default",
        });
      }
    }
  }, [errors]);

  const onChange = (content: string) => {
    editorContentRef.current = content;
  };

  function onSubmit(data: FormData) {
    const payload: PostCreationRequest = {
      title: data.title,
      subSpreadItId,
      content: editorContentRef.current,
    };

    createPost(payload);
  }

  const { ref: titleRefRegister, ...titleRefRest } = register("title");

  return (
    <div className="w-full p-4 bg-background rounded-lg border">
      <form
        id="subspreadit-post-form"
        className="w-fit"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="prose prose-stone dark:prose-invert">
          <TextareaAutosize
            ref={(e) => {
              // @ts-expect-error
              titleRef.current = e;
              titleRefRegister(e);
            }}
            {...titleRefRest}
            placeholder="Title"
            className="w-full resize-none appearance-none overflow-hidden bg-transparent text-5xl font-bold focus:outline-none placeholder:text-muted-foreground"
          />
          <div className="min-h-[500px]">
            <Editor
              editable
              onChange={onChange}
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default TextEditor;

import React, { SyntheticEvent, useRef, useState } from "react";
import Link from "next/link";
import ProfileImage from "~/components/shared/ProfileImage";
import { useSession } from "next-auth/react";
import TextareaAutosize from "react-textarea-autosize";
import {
  HiOutlineGif,
  HiOutlineGlobeAmericas,
  HiOutlinePhoto,
  HiOutlineXMark,
} from "react-icons/hi2";
import HoverEffect from "~/utils/style/HoverEffect";
import { api } from "~/utils/api";
import Button from "~/components/shared/Button";
import { CDNURL, supabase } from "../../../supabase";

const AddTweet = () => {
  const session = useSession();
  const fileRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | undefined>(undefined);
  const [content, setContent] = useState("");

  if (!session.data?.user) return null;

  const trpcUtils = api.useContext();
  const { user } = session.data;
  const addTweet = api.tweet.create.useMutation({
    onSuccess: (newTweet) => {
      setContent("");

      if (session.status !== "authenticated") return;

      // @ts-ignore
      trpcUtils.tweet.infiniteFeed.setInfiniteData({}, (oldData) => {
        if (oldData == null || oldData.pages[0] == null) return;

        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const newCacheTweet = {
          ...newTweet,
          likeCount: 0,
          likedByMe: false,
          user: {
            id: session.data.user.id,
            name: session.data.user.name || null,
            image: session.data.user.image || null,
          },
        };

        return {
          ...oldData,
          pages: [
            {
              ...oldData.pages[0],
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              tweets: [newCacheTweet, ...oldData.pages[0].tweets],
            },
            ...oldData.pages.slice(1),
          ],
        };
      });
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const file = e.target.files[0];
    setFile(file);
  };

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    let multimediaURL = null;

    if (content.trim() === "") return null;

    if (file) {
      const { error, data } = await supabase.storage
        .from("multimedia")
        .upload(`${session.data.user.id}/${file.name}`, file);

      if (error) {
        console.log(error);
      } else {
        multimediaURL = `${CDNURL}/${data?.path}`;
      }
    }

    const multimediaType = file?.type.includes("image")
      ? "image"
      : "video" || null;

    setFile(undefined);

    addTweet.mutate({ content, multimedia: multimediaURL, multimediaType });
    setContent("");
  };

  return (
    <section className="relative px-4 py-6 transition-colors duration-200 first:border-none last:border-none dark:border-neutral-600">
      <form onSubmit={(e) => void handleSubmit(e)} className="flex gap-3">
        <div className="h-fit flex-shrink-0">
          <Link href={`/profiles/7a7sd7a`}>
            <ProfileImage src={user.image ?? ""} />
          </Link>
        </div>
        <div className="w-full">
          <div className="flex gap-2">
            <Link href={`/profiles/7a7sd7a`}>
              <p className="text-lg text-black dark:text-white">{user.name}</p>
            </Link>
          </div>

          <div className="mt-2 flex flex-col gap-2 border-b pb-4 dark:border-neutral-600">
            <TextareaAutosize
              className="h-full w-full resize-none bg-transparent text-xl placeholder-neutral-500 outline-none"
              maxLength={280}
              placeholder="What is happening?!"
              name="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />

            <p className="poiter-events-none mt-2 flex cursor-default items-center gap-1 text-blue-500">
              <HiOutlineGlobeAmericas className="h-5 w-5" /> Everyone can reply
            </p>

            <div className="relative right-2 mt-4">
              <div className="flex items-center justify-between gap-2">
                <div className="flex gap-1 text-2xl text-blue-500">
                  <div onClick={() => fileRef.current?.click()}>
                    <HoverEffect blue>
                      <div className="h-9 w-9">
                        <span className="flex h-full items-center justify-center text-xl">
                          <HiOutlinePhoto />
                          <input
                            type="file"
                            accept="image/*, video/*"
                            ref={fileRef}
                            className="hidden"
                            onChange={handleFileChange}
                          />
                        </span>
                      </div>
                    </HoverEffect>
                  </div>
                  <HoverEffect blue>
                    <div className="h-9 w-9">
                      <span className="flex h-full items-center justify-center text-xl">
                        <HiOutlineGif />
                      </span>
                    </div>
                  </HoverEffect>
                </div>
                <div className="flex justify-end">
                  <Button>Tweet</Button>
                </div>
              </div>
            </div>

            {file && (
              <div className="relative">
                <button
                  type="button"
                  className="absolute left-2 top-2 z-50 cursor-pointer rounded-full bg-neutral-800 bg-opacity-80 p-2 text-2xl"
                  onClick={() => setFile(undefined)}
                >
                  <HiOutlineXMark />
                </button>
                <div className="w-fit overflow-hidden rounded-2xl">
                  {file.type.includes("image") ? (
                    <img
                      src={URL.createObjectURL(file)}
                      alt="Image"
                      className="max-h-[500px]"
                    />
                  ) : (
                    <video
                      src={URL.createObjectURL(file)}
                      controls
                      className="max-h-[500px]"
                    ></video>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </form>
    </section>
  );
};

export default AddTweet;

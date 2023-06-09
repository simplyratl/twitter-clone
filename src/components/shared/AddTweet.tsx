import React, { type SyntheticEvent, useEffect, useRef, useState } from "react";
import ProfileImage from "~/components/shared/ProfileImage";
import { useSession } from "next-auth/react";
import TextareaAutosize from "react-textarea-autosize";
import {
  HiOutlineFire,
  HiOutlineGlobeAmericas,
  HiOutlinePhoto,
  HiOutlineXMark,
} from "react-icons/hi2";
import HoverEffect from "~/utils/style/HoverEffect";
import { api } from "~/utils/api";
import Button from "~/components/shared/Button";
import { CDNURL, supabase } from "../../../supabase";
import Image from "next/image";
import LoadingModal from "~/components/shared/LoadingModal";
import { v4 as uuid } from "uuid";
import EmojiPicker, { type Theme } from "emoji-picker-react";
import useColorMode from "~/utils/hooks/useColorMode";

const AddTweet = () => {
  const session = useSession();
  const fileRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | undefined>(undefined);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [emojiPicker, setEmojiPicker] = useState(false);

  useEffect(() => {
    if (loading) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [loading]);

  const [colorMode, setColorMode] = useColorMode();

  if (!session.data?.user) return null;

  const trpcUtils = api.useContext();
  const { user } = session.data;
  const addTweet = api.tweet.create.useMutation({
    onSuccess: (newTweet) => {
      setContent("");

      if (session.status !== "authenticated") return;

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
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
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            verified: session.data.user.verified || false,
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
    setLoading(true);

    if (content.trim() === "") {
      setLoading(false);
      return null;
    }

    if (file) {
      const { error, data } = await supabase.storage
        .from("multimedia")
        .upload(`${session.data.user.id}_${uuid()}`, file);

      if (error) {
        return;
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
    setLoading(false);
  };

  return (
    <>
      <section className="relative px-4 py-6 transition-colors duration-200 first:border-none last:border-none dark:border-neutral-600">
        <form onSubmit={(e) => void handleSubmit(e)} className="flex gap-3">
          <div className="h-fit flex-shrink-0">
            <div>
              <ProfileImage src={user.image ?? ""} />
            </div>
          </div>
          <div className="w-full">
            <div className="flex gap-2">
              <div>
                <p className="text-lg text-black dark:text-white">
                  {user.name}
                </p>
              </div>
            </div>

            <div className="mt-2 flex flex-col gap-2 border-b pb-4 dark:border-neutral-600">
              <TextareaAutosize
                className="h-full w-full resize-none bg-transparent text-xl text-black placeholder-neutral-500 outline-none dark:text-white"
                maxLength={280}
                placeholder="What is happening?!"
                name="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />

              {/*<TweetEditor />*/}

              <p className="poiter-events-none mt-2 flex cursor-default items-center gap-1 text-blue-500">
                <HiOutlineGlobeAmericas className="h-5 w-5" /> Everyone can
                reply
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
                    <div className="relative">
                      <HoverEffect blue>
                        <div
                          className="relative h-9 w-9"
                          onClick={() => setEmojiPicker(!emojiPicker)}
                        >
                          <span className="flex h-full items-center justify-center text-xl">
                            <HiOutlineFire />
                          </span>
                        </div>
                      </HoverEffect>

                      {emojiPicker && (
                        <div className="absolute z-40 h-full">
                          <EmojiPicker
                            theme={(colorMode as Theme) ?? "light"}
                            width={300}
                            height={400}
                            onEmojiClick={(emoji) =>
                              setContent(content + emoji.emoji)
                            }
                          />
                        </div>
                      )}
                    </div>
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
                    suppressContentEditableWarning
                    onClick={() => setFile(undefined)}
                  >
                    <HiOutlineXMark />
                  </button>
                  <div className="w-fit overflow-hidden rounded-2xl">
                    {file.type.includes("image") ? (
                      <Image
                        src={URL.createObjectURL(file)}
                        alt="Image"
                        fill
                        className="!relative max-h-[500px]"
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
      {loading && <LoadingModal />}
    </>
  );
};

export default AddTweet;

import React, {
  FormEvent,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import Button from "../shared/Button";
import ProfileImage from "../shared/ProfileImage";
import { useSession } from "next-auth/react";
import { api } from "~/utils/api";
import { HiOutlinePhoto, HiOutlineXMark } from "react-icons/hi2";
import IconHoverEffect from "~/components/shared/IconHoverEffect";

function updateTextAreaSize(textArea?: HTMLTextAreaElement | null) {
  if (!textArea) return;

  textArea.style.height = "0";
  textArea.style.height = `${textArea.scrollHeight}px`;
}

function Form() {
  const session = useSession();
  const [inputValue, setInputValue] = useState("");
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const trpcUtils = api.useContext();
  const [error, setError] = useState({ error: false, message: "" });
  const uploadRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState(null);
  const [filename, setFilename] = useState("");

  const inputRef = useCallback((textArea: HTMLTextAreaElement) => {
    updateTextAreaSize(textArea);
    // @ts-ignore
    textAreaRef.current = textArea;
  }, []);

  useLayoutEffect(() => {
    updateTextAreaSize(textAreaRef.current);
  }, [inputValue]);

  const createTweet = api.tweet.create.useMutation({
    onSuccess: (newTweet) => {
      setInputValue("");

      if (session.status !== "authenticated")
        return setError({
          error: true,
          message: "You must be logged in to tweet",
        });

      if (inputValue.length === 0)
        return setError({ error: true, message: "Tweet cannot be empty" });

      if (error.error) setError({ error: false, message: "" });

      trpcUtils.tweet.infiniteFeed.setInfiniteData({}, (oldData) => {
        if (!oldData || !oldData.pages[0]) return;

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
              tweets: [newCacheTweet, ...oldData.pages[0].tweets],
            },
            ...oldData.pages.slice(1),
          ],
        };
      });
    },
  });

  if (session.status !== "authenticated") return null;

  const handleFileChange = (event: React.FormEvent<HTMLInputElement>) => {
    setFile(event.target.files[0]);
    setFilename(event.target.files[0].name);
  };

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    // createTweet.mutate({ content: inputValue, multimedia });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-2 border-b px-4 py-2 dark:border-gray-500"
    >
      <div className="flex flex-col gap-4">
        <div className="flex gap-4 text-lg">
          <ProfileImage src={session.data.user.image} />
          <div className="flex w-full flex-col gap-2">
            <textarea
              style={{ height: 0 }}
              value={inputValue}
              ref={inputRef}
              onChange={(e) => setInputValue(e.target.value)}
              className={`w-full resize-none overflow-hidden border-b p-4 dark:border-gray-500 dark:bg-black dark:text-white ${
                error.error ? "outline outline-red-500" : "outline-none"
              }`}
              placeholder="What's happening?"
              maxLength={280}
            />
            {file && (
              <div className="relative">
                <button
                  className="absolute left-2 top-2 z-50  flex h-10 w-10 items-center justify-center rounded-full bg-neutral-900 text-2xl text-white"
                  type={"button"}
                  onClick={() => {
                    setFile(null);
                    setFilename("");
                  }}
                >
                  <HiOutlineXMark />
                </button>
                <img
                  src={URL.createObjectURL(file)}
                  alt={"upload image"}
                  className="h-[400px] w-full rounded-2xl object-cover"
                />
              </div>
            )}
          </div>
        </div>
        <div
          className="ml-16 flex items-start gap-2 text-2xl text-blue-400
        "
        >
          <div onClick={() => uploadRef.current?.click()}>
            <IconHoverEffect blue>
              <HiOutlinePhoto />
              <input
                className="hidden"
                type="file"
                name="multimedia"
                onChange={handleFileChange}
                id="multimedia"
                ref={uploadRef}
              />
            </IconHoverEffect>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <span className="dark:text-gray-300">
          Characters {inputValue.length} / 280
        </span>
        <Button className="self-end">Tweet</Button>
      </div>
    </form>
  );
}

const NewTweetForms = () => {
  const session = useSession();

  if (session.status !== "authenticated") return null;

  return <Form />;
};

export default NewTweetForms;

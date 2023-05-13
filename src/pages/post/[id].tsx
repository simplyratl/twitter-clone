import Link from "next/link";
import { useRouter } from "next/router";
import { HiArrowSmallLeft } from "react-icons/hi2";
import IconHoverEffect from "~/components/shared/IconHoverEffect";
import ProfileImage from "~/components/shared/ProfileImage";
import { Comments, type CommentsType } from "~/components/tweets/Comments";
import { api } from "~/utils/api";
import { useSession } from "next-auth/react";
import { useCallback, useLayoutEffect, useRef, useState } from "react";
import { updateTextAreaSize } from "~/components/tweets/NewTweetForms";
import TweetInput from "~/components/shared/TweetInput";
import Button from "~/components/shared/Button";
import { TweetCard, type TweetType } from "~/components/shared/TweetCard";

const PostPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const session = useSession();
  const [inputValue, setInputValue] = useState("");
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const trpcUtils = api.useContext();

  const inputRef = useCallback((textArea: HTMLTextAreaElement) => {
    updateTextAreaSize(textAreaRef.current);
    textAreaRef.current = textArea;
  }, []);

  const createComment = api.tweet.addComment.useMutation({
    onSuccess: (comment) => {
      const updateData = (oldData: CommentsType[]) => {
        return [...oldData, comment];
      };

      trpcUtils.tweet.getComments.setData(
        { postId: (id as string) ?? null },
        updateData
      );
    },
  });

  useLayoutEffect(() => {
    updateTextAreaSize(textAreaRef.current);
  }, [inputValue]);

  const handleAddComment = () => {
    if (inputValue.length === 0) return;

    createComment.mutate({
      userId: session.data?.user.id ?? "",
      postId: (id as string) ?? null,
      content: inputValue,
    });

    setInputValue("");
  };

  const { data: tweet } = api.tweet.getById.useQuery({
    id: id?.toString() ?? "",
  }) as { data: TweetType };

  const { data: comments } = api.tweet.getComments.useQuery({
    postId: (id as string) ?? null,
  }) as {
    data: CommentsType[];
  };

  if (!tweet) return <h1>Loading...</h1>;

  return (
    <div>
      <header className="sticky top-0 z-10 flex items-center border-b bg-white px-4 py-2 dark:bg-black dark:text-white">
        <Link href=".." className="mr-2">
          <IconHoverEffect gray>
            <HiArrowSmallLeft className="h-6 w-6" />
          </IconHoverEffect>
        </Link>

        <div className="ml-2 flex-grow">
          <h1 className="text-lg font-bold">Tweet</h1>
        </div>
      </header>

      <TweetCard {...tweet} showcase />

      <div>
        {session.data?.user && (
          <div>
            <p className="mb-2 ml-4 pb-2 pt-4 text-lg text-white">Comments</p>
            <div className="flex flex-col p-4">
              {session.data?.user && (
                <div className="flex gap-4 text-lg">
                  {session.data && (
                    <ProfileImage src={session.data.user.image} />
                  )}
                  <div className="flex w-full flex-col gap-2">
                    <TweetInput
                      inputRef={inputRef}
                      inputValue={inputValue}
                      setInputValue={setInputValue}
                    />
                  </div>
                </div>
              )}
              <Button className="mr-3 mt-3 self-end" onClick={handleAddComment}>
                Tweet
              </Button>
            </div>
          </div>
        )}

        {comments.map((comment) => (
          <Comments
            id={comment.id}
            content={comment.content}
            createdAt={tweet.createdAt}
            user={comment.user}
            key={comment.id}
          />
        ))}
      </div>
    </div>
  );
};

export default PostPage;

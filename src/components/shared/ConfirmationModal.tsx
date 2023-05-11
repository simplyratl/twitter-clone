import React, { useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { api } from "~/utils/api";
import { useRouter } from "next/router";
import { type Theme, toast } from "react-toastify";

const ConfirmationModal = () => {
  const session = useSession();
  const router = useRouter();
  const trpcUtils = api.useContext();

  const deletePost = api.tweet.delete.useMutation({
    onSuccess: ({ deleted }) => {
      if (!deleted) return;

      trpcUtils.tweet.infiniteFeed.setInfiniteData({}, (oldData) => {
        if (!oldData || !oldData.pages) return;

        const pageIndex = oldData.pages.findIndex((page) =>
          page.tweets.some((tweet) => tweet.id === router.query.id)
        );

        if (
          !oldData ||
          !oldData.pages ||
          pageIndex === -1 ||
          !oldData.pages[pageIndex]
        )
          return;

        // @ts-ignore
        const updatedTweets = oldData.pages[pageIndex].tweets.filter(
          (tweet) => tweet.id !== router.query.id
        );

        // @ts-ignore
        oldData.pages[pageIndex].tweets = updatedTweets;

        toast.success("Successfully deleted tweet.", {
          position: "top-center",
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: localStorage.getItem("color-theme") as Theme,
        });
        return oldData;
      });
    },
  });

  const handleSubmit = () => {
    if (session.status !== "authenticated") return;
    if (!router.query.id) return;

    deletePost.mutate({
      postId: router.query.id as string,
      userId: session.data?.user?.id,
    });
  };

  useEffect(() => {
    if (deletePost.isSuccess) router.back();
  }, [deletePost.isSuccess]);

  return (
    <div
      id="popup-modal"
      tabIndex={-1}
      className="flex h-[calc(100%-1rem)] max-h-full items-center justify-center overflow-y-auto overflow-x-hidden p-4 md:inset-0"
    >
      <div className="relative max-h-full w-full max-w-md">
        <div className="relative rounded-lg bg-white shadow dark:bg-gray-700">
          <button
            type="button"
            disabled={deletePost.isLoading}
            className="absolute right-2.5 top-3 ml-auto inline-flex items-center rounded-lg bg-transparent p-1.5 text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-white"
            data-modal-hide="popup-modal"
            onClick={() => router.back()}
          >
            <svg
              aria-hidden="true"
              className="h-5 w-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              ></path>
            </svg>
            <span className="sr-only">Close modal</span>
          </button>
          <div className="p-6 text-center">
            <svg
              aria-hidden="true"
              className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              Are you sure you want to delete this product?
            </h3>
            <Link href={".."}>
              <button
                data-modal-hide="popup-modal"
                type="button"
                disabled={deletePost.isLoading}
                className="rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-900 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:border-gray-500 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white dark:focus:ring-gray-600"
              >
                No, cancel
              </button>
            </Link>
            <button
              data-modal-hide="popup-modal"
              type="button"
              disabled={deletePost.isLoading}
              className="ml-2 inline-flex items-center rounded-lg bg-red-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 dark:focus:ring-red-800"
              onClick={handleSubmit}
            >
              {/* eslint-disable-next-line react/no-unescaped-entities */}
              Yes, I'm sure
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;

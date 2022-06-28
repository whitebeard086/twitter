/* eslint-disable @next/next/no-img-element */
import {
  ChartBarIcon,
  ChatIcon,
  DotsHorizontalIcon,
  HeartIcon,
  ShareIcon,
  TrashIcon,
} from "@heroicons/react/outline";
import { HeartIcon as HeartIconFilled } from "@heroicons/react/solid";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  setDoc,
} from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import { useRecoilState } from "recoil";
import { signIn, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Moment from "react-moment";
import { useRouter } from "next/router";

import { modalState, postIdState } from "../atom/modalAtom";
import { db, storage } from "../firebase";

const Post = ({ post, id }) => {
  const [liked, setLiked] = useState([]);
  const [hasLiked, setHasLiked] = useState(false);
  const [comments, setComments] = useState([]);
  const [open, setOpen] = useRecoilState(modalState);
  const [postId, setPostId] = useRecoilState(postIdState);

  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "posts", id, "likes"),
      (snapshot) => {
        setLiked(snapshot.docs);
      }
    );
  }, [id]);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "posts", id, "comments"),
      (snapshot) => {
        setComments(snapshot.docs);
      }
    );
  }, [id]);

  useEffect(() => {
    setHasLiked(
      liked.findIndex((like) => like.id === session?.user.uid) !== -1
    );
  }, [liked, session?.user.uid]);

  const likePost = async () => {
    if (session) {
      if (hasLiked) {
        await deleteDoc(doc(db, "posts", post.id, "likes", session?.user.uid));
      } else {
        await setDoc(doc(db, "posts", post.id, "likes", session?.user.uid), {
          username: session.user.username,
        });
      }
    } else {
      alert("You must be logged in to like a post");
      signIn();
    }
  };

  const deletePost = async () => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      await deleteDoc(doc(db, "posts", post.id));

      if (post.data().image) {
        await deleteObject(ref(storage, `posts/${post.id}/image`));
      }

      router.push("/");
    }
  };

  return (
    <div className="flex p-3 cursor-pointer border-b border-gray-200">
      {/* user image */}
      <img
        className="h-11 w-11 rounded-full mr-4"
        src={post?.data()?.userImage}
        alt="user-image"
      />

      {/* Right side */}
      <div className="flex-1">

        {/* Header */}
        <div className="flex items-center justify-between ">

          {/* Post user info */}
          <div className="flex items-center space-x-1 whitespace-nowrap">
            <h4 className="font-bold text-[15px] sm:text-[16px] hover:underline ">
              {post?.data()?.name}
            </h4>
            <span className="text-sm sm:text-[15px]">
              @{post?.data()?.username} -{" "}
            </span>
            <span className="text-sm sm:text-[15px] hover:underline">
              <Moment fromNow>{post?.data()?.timestamp?.toDate()}</Moment>
            </span>
          </div>

          {/* icon */}
          <DotsHorizontalIcon className="h-10 hover-effect w-10 hover:bg-sky-100 hover:text-sky-500 p-2" />
        </div>

        {/* post text */}
        <p className="text-gray-800 text-[15px] sm:text-[16px] mb-2">
          {post?.data()?.text}
        </p>

        {/* post image */}
        {post?.data()?.image && (
          <>
            <img
              className="rounded-2xl mr-2"
              src={post?.data()?.image}
              alt="post-image"
            />
          </>
        )}

        {/* icons */}

        <div className="flex justify-between text-gray-500 p-2">
          <div className="flex items-center select-none">
            <ChatIcon
              onClick={() => {
                if (session) {
                  setPostId(post.id);
                  setOpen(!open);
                } else {
                  alert("You must be logged in to comment on a post");
                  signIn();
                }
              }}
              className="h-9 w-9 hover-effect p-2 hover:text-sky-500 hover:bg-sky-100"
            />
            {comments.length > 0 && (
              <span className="text-sm ml-1">{comments.length}</span>
            )}
          </div>
          {session?.user.uid === post?.data()?.id && (
            <TrashIcon
              onClick={deletePost}
              className="h-9 w-9 p-2 hover-effect hover:text-red-600 hover:bg-red-100"
            />
          )}
          <div className="flex items-center">
            {hasLiked ? (
              <HeartIconFilled
                onClick={likePost}
                className="h-9 w-9 p-2 hover-effect text-red-600 hover:bg-red-100"
              />
            ) : (
              <HeartIcon
                onClick={likePost}
                className="h-9 w-9 p-2 hover-effect hover:text-red-600 hover:bg-red-100"
              />
            )}
            {liked.length > 0 && (
              <span className={`${hasLiked && "text-red-600"} text-sm ml-1`}>
                {liked.length}
              </span>
            )}
          </div>
          <ShareIcon className="h-9 w-9 p-2 hover-effect hover:text-sky-500 hover:bg-sky-100" />
          <ChartBarIcon className="h-9 w-9 p-2 hover-effect hover:text-sky-500 hover:bg-sky-100" />
        </div>
      </div>
    </div>
  );
};
export default Post;

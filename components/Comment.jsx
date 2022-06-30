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

const Comment = ({ comment, commentId, commentPostId }) => {
  const [liked, setLiked] = useState([]);
  const [hasLiked, setHasLiked] = useState(false);
  const [open, setOpen] = useRecoilState(modalState);
  const [postId, setPostId] = useRecoilState(postIdState);

  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "posts", commentPostId, "comments", commentId, "likes"),
      (snapshot) => {
        setLiked(snapshot.docs);
      }
    );
  }, [commentId, commentPostId]);

  useEffect(() => {
    setHasLiked(
      liked.findIndex((like) => like.id === session?.user.uid) !== -1
    );
  }, [liked, session?.user.uid]);

  const likeComment = async () => {
    if (session) {
      if (hasLiked) {
        await deleteDoc(
          doc(
            db,
            "posts",
            commentPostId,
            "comments",
            commentId,
            "likes",
            session?.user.uid
          )
        );
      } else {
        await setDoc(
          doc(
            db,
            "posts",
            commentPostId,
            "comments",
            commentId,
            "likes",
            session?.user.uid
          ),
          {
            username: session.user.username,
          }
        );
      }
    } else {
      alert("You must be logged in to like a comment");
      signIn();
    }
  };

  const deleteComment = async () => {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      await deleteDoc(doc(db, "posts", commentPostId, "comments", commentId));
    }
  };

  return (
    <div className="flex p-3 pl-20 cursor-pointer border-b border-gray-200">
      {/* user image */}
      <img
        className="h-11 w-11 rounded-full mr-4"
        src={comment.userImage}
        alt="user-image"
      />

      {/* Right side */}
      <div className="flex-1">
        {/* Header */}
        <div className="flex items-center justify-between ">
          {/* Post user info */}
          <div className="flex items-center space-x-1 whitespace-nowrap">
            <h4 className="font-bold text-[15px] sm:text-[16px] hover:underline ">
              {comment.name}
            </h4>
            <span className="text-sm sm:text-[15px]">
              @{comment.username} -{" "}
            </span>
            <span className="text-sm sm:text-[15px] hover:underline">
              <Moment fromNow>{comment.timestamp?.toDate()}</Moment>
            </span>
          </div>

          {/* icon */}
          <DotsHorizontalIcon className="h-10 hover-effect w-10 hover:bg-sky-100 hover:text-sky-500 p-2" />
        </div>

        {/* post text */}
        <p className="text-gray-800 text-[15px] sm:text-[16px] mb-2">
          {comment.comment}
        </p>

        {/* icons */}

        <div className="flex justify-between text-gray-500 p-2">
          <div className="flex items-center select-none">
            <ChatIcon
              onClick={() => {
                if (session) {
                  setPostId(commentPostId);
                  setOpen(!open);
                } else {
                  alert("You must be logged in to comment on a post");
                  signIn();
                }
              }}
              className="h-9 w-9 hover-effect p-2 hover:text-sky-500 hover:bg-sky-100"
            />
          </div>
          {session?.user.uid === comment.userId && (
            <TrashIcon
              onClick={deleteComment}
              className="h-9 w-9 p-2 hover-effect hover:text-red-600 hover:bg-red-100"
            />
          )}
          <div className="flex items-center">
            {hasLiked ? (
              <HeartIconFilled
                onClick={likeComment}
                className="h-9 w-9 p-2 hover-effect text-red-600 hover:bg-red-100"
              />
            ) : (
              <HeartIcon
                onClick={likeComment}
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
export default Comment;

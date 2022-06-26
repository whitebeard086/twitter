/* eslint-disable @next/next/no-img-element */
import { useRef, useState } from "react";
import {
  PhotographIcon,
  EmojiHappyIcon,
  XIcon,
} from "@heroicons/react/outline";
import { useSession, signOut } from "next-auth/react";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db, storage } from "../firebase";
import { getDownloadURL, ref, uploadString } from "firebase/storage";

const Input = () => {
  const { data: session } = useSession();
  const [input, setInput] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const fileRef = useRef(null);

  const sendPost = async () => {
    if (loading) return;
    setLoading(true);

    const docRef = await addDoc(collection(db, "posts"), {
      id: session.user.uid,
      name: session.user.name,
      username: session.user.username,
      userImage: session.user.image,
      text: input,
      timestamp: serverTimestamp(),
    });

    const imageRef = ref(storage, `posts/${docRef.id}/image`);

    if (selectedFile) {
      await uploadString(imageRef, selectedFile, "data_url").then(async () => {
        const downloadURL = await getDownloadURL(imageRef);

        await updateDoc(doc(db, "posts", docRef.id), {
          image: downloadURL,
        });
      });
    }

    setInput("");
    setSelectedFile(null);
    setLoading(false);
  };

  const uploadImage = (e) => {
    const reader = new FileReader();
    if (e.target.files[0]) {
      reader.readAsDataURL(e.target.files[0]);
    }

    reader.onload = (e) => {
      setSelectedFile(e.target.result);
    };
  };

  return (
    <>
      {session && (
        <div className="flex  border-b border-gray-200 p-3 space-x-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            onClick={signOut}
            className="h-11 w-11 rounded-full cursor-pointer hover:brightness-95"
            src={session.user.image}
            alt="mini-profile-image"
          />
          <div className="w-full divide-y divide-gray-200">
            <div className="">
              <textarea
                className="w-full border-none focus:ring-0 text-lg placeholder-gray-500 tracking-wider min-h-[50px] text-gray-700"
                rows="2"
                placeholder="What's happening?"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              ></textarea>
            </div>
            {selectedFile && (
              <div className="relative">
                <XIcon
                  className="h-6 cursor-pointer text-red-800 absolute bg-white rounded-full m-3 p-1 shadow-md"
                  onClick={() => setSelectedFile(null)}
                />
                <img
                  src={selectedFile}
                  alt="tweet-image"
                  className={`${loading && "animate-pulse"}`}
                />
              </div>
            )}
            {!loading && (
              <>
                <div className="flex items-center justify-between pt-2.5">
                  <div className="flex">
                    <div className="" onClick={() => fileRef.current.click()}>
                      <PhotographIcon className="h-10 w-10 hover-effect p-2 text-sky-500 hover:bg-sky-100" />
                      <input
                        type="file"
                        hidden
                        ref={fileRef}
                        onChange={uploadImage}
                      />
                    </div>
                    <EmojiHappyIcon className="h-10 w-10 hover-effect p-2 text-sky-500 hover:bg-sky-100" />
                  </div>
                  <button
                    onClick={sendPost}
                    disabled={!input.trim()}
                    className="bg-blue-400 text-white px-4 py-1.5 rounded-full font-bold shadow-md hover:brightness-95 disabled:opacity-50"
                  >
                    Tweet
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};
export default Input;

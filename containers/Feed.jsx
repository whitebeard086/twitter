import { SparklesIcon } from "@heroicons/react/outline";
import { Input, Post } from "../components";

const Feed = () => {
  const posts = [
    {
      id: 1,
      name: "Alex Ejimkaraonye",
      username: "Exorcist02",
      userImage: "https://avatars.githubusercontent.com/u/40230065?v=4",
      postImage:
        "https://images.unsplash.com/photo-1512552288940-3a300922a275?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8dmFjYXRpb258ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60",
      text: "Taking a much needed break!",
      timestamp: "2 hours ago",
    },
    {
      id: 2,
      name: "Alex Ejimkaraonye",
      username: "Exorcist02",
      userImage: "https://avatars.githubusercontent.com/u/40230065?v=4",
      postImage:
        "https://images.unsplash.com/photo-1548957175-84f0f9af659e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTV8fHZhY2F0aW9ufGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60",
      text: "We just out here chilling!",
      timestamp: "13 hours ago",
    },
  ];
  return (
    <div className="xl:ml-[370px] border-l border-r border-gray-200 xl:min-w-[576px] sm:ml-[73px] flex-grow max-w-xl ">
      {/* Header */}
      <div className="flex py-2 px-3 sticky top-0 z-50 bg-white border-b border-gray-200">
        <h2 className="text-lg sm:text-xl font-bold cursor-pointer">Home</h2>
        <div className="hover-effect flex items-center justify-center px-0 ml-auto w-9 h-9">
          <SparklesIcon className="h-5" />
        </div>
      </div>
      {/* Input field */}
      <Input />
      {/* Posts feed */}
      {posts.map((post) => (
        <Post key={post.id} post={post} />
      ))}
    </div>
  );
};
export default Feed;

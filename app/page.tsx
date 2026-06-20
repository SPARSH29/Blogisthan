'use client'
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Home() {
  const { data: session } = useSession();
  const router = useRouter();

  const handleCreateBlog = () => {
    if (session) {
      router.push("/create-blog"); // user already logged in
    } else {
      router.push("/login"); // user not logged in
    }
  };

  return (
    <>
      <div className="relative flex flex-col items-center justify-center min-h-screen w-full py-2 bg-gray-200 overflow-hidden">
        {/* Purple dot pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#a855f766_1px,transparent_1px)] [background-size:16px_16px]" />

        {/* Purple glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#7c3aed22,transparent_70%)]" />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center px-6">
          <h1 className="text-5xl md:text-7xl text-center font-bold mb-4 text-gray-900">
            Welcome to Blogisthan
          </h1>

          <p className="text-center text-lg md:text-xl text-gray-700 mb-8 max-w-2xl">
            A blog app built for deploying your blogs and sharing them with the
            world.
          </p>

          <Image
            src="/next.svg"
            alt="Next.js Logo"
            width={200}
            height={200}
            className="mb-8"
          />

          <button onClick={handleCreateBlog} className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-500 hover:scale-105 transition duration-300 cursor-pointer">
            Create Your Blog
          </button>
        </div>
      </div>
      <div className="h-0.5 w-full bg-black"></div>
      <div
        className="flex flex-col items-center justify-center bg-cover h-96 "
        style={{ backgroundImage: "url('/money.jpg')" }}
      >
        <div className="bg-black/50 h-full inset-0 w-full text-center text-white">
          <div className="flex flex-col items-start justify-center w-full md:w-[50vw] h-full px-6 md:px-0">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 md:ml-20">
              Earn money
            </h2>
            <p className="text-base md:text-xl text-start md:ml-20">
              Get paid for your hard work. Google AdSense can automatically
              display relevant targeted ads on your blog so that you can earn
              income by posting about your passion.
            </p>
          </div>
        </div>
      </div>
      <div className="h-0.5 w-full bg-black"></div>
      <div
        className="flex flex-col items-center justify-center bg-cover h-96 "
        style={{ backgroundImage: "url('/audience.jpg')" }}
      >
        <div className="bg-black/50 h-full w-full text-white">
          <div className="flex flex-col items-end justify-center h-full px-6 md:px-20">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-right">
              Know your audience
            </h2>
            <p className="text-base md:text-xl text-right md:max-w-xl">
              Find out which posts are a hit with Blogger’s built-in analytics.
              You’ll see where your audience is coming from and what they’re
              interested in. You can even connect your blog directly to Google
              Analytics for a more detailed look.
            </p>
          </div>
        </div>
      </div>
      <div className="h-0.5 w-full bg-black"></div>
      <div
        className="flex flex-col items-center justify-center bg-cover h-96 "
        style={{ backgroundImage: "url('/design.jpg')" }}
      >
        <div className="bg-black/50 h-full inset-0 w-full text-center text-white">
          <div className="flex flex-col items-start justify-center w-full md:w-[50vw] h-full px-6 md:px-0">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 md:ml-20">
              Choose perfect design
            </h2>
            <p className="text-base md:text-xl text-start md:ml-20">
              Create a beautiful blog that fits your style. Choose from a
              selection of easy-to-use templates – all with flexible layouts and
              hundreds of background images – or design something new.
            </p>
          </div>
        </div>
      </div>
      <div className="h-0.5 w-full bg-black"></div>
      <div
        className="flex flex-col items-center justify-center bg-cover h-96 "
        style={{ backgroundImage: "url('/memories.jpg')" }}
      >
        <div className="bg-black/50 h-full w-full text-white">
          <div className="flex flex-col items-end justify-center h-full px-6 md:px-20">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-right">
              Hang onto your memories
            </h2>
            <p className="text-base md:text-xl text-right md:max-w-xl">
              Save the moments that matter. Blogger lets you safely store
              thousands of posts, photos, and more with Google.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

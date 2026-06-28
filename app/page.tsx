"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Home() {
  const { data: session } = useSession();
  const router = useRouter();

  const handleCreateBlog = () => {
    if (session) {
      router.push("/create-blog");
    } else {
      router.push("/login");
    }
  };

  const sections = [
    {
      image: "/money.jpg",
      title: "Earn money",
      text: "Get paid for your hard work. Google AdSense can automatically display relevant targeted ads on your blog so that you can earn income by posting about your passion.",
      align: "left",
      priority: true,
    },
    {
      image: "/audience.jpg",
      title: "Know your audience",
      text: "Find out which posts are a hit with Blogger’s built-in analytics. You’ll see where your audience is coming from and what they’re interested in. You can even connect your blog directly to Google Analytics for a more detailed look.",
      align: "right",
      priority: true,
    },
    {
      image: "/design.jpg",
      title: "Choose perfect design",
      text: "Create a beautiful blog that fits your style. Choose from a selection of easy-to-use templates – all with flexible layouts and hundreds of background images – or design something new.",
      align: "left",
      priority: false,
    },
    {
      image: "/memories.jpg",
      title: "Hang onto your memories",
      text: "Save the moments that matter. Blogger lets you safely store thousands of posts, photos, and more with Google.",
      align: "right",
      priority: false,
    },
  ];

  return (
    <div>

      {/* Hero */}
      <section className="relative flex z-10 h-screen items-center justify-center bg-gray-200 overflow-hidden">

        <div className="fixed inset-0 -z-20 bg-[radial-gradient(#a855f766_1px,transparent_1px)] [background-size:16px_16px]" />
        <div className="fixed inset-0 -z-20 bg-[radial-gradient(circle_at_center,#7c3aed22,transparent_70%)]" />

        <div className="relative z-10 flex flex-col items-center px-6 text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-4">
            Welcome to Blogisthan
          </h1>

          <p className="text-lg md:text-xl text-gray-700 max-w-2xl mb-8">
            A blog app built for deploying your blogs and sharing them with the
            world.
          </p>

          <Image
            src="/next.svg"
            alt="Next Logo"
            width={200}
            height={200}
            priority
            draggable={false}
          />

          <button
            onClick={handleCreateBlog}
            className="mt-8 rounded-lg bg-purple-600 px-6 py-3 text-white transition hover:scale-105 hover:bg-purple-500"
          >
            Create Your Blog
          </button>
        </div>
      </section>

      {sections.map((section) => (
        <section
          key={section.title}
          className="relative h-screen w-full z-10 overflow-hidden"
        >
          <Image
            src={section.image}
            alt={section.title}
            fill
            priority={section.priority}
            sizes="100vw"
            className="object-cover -z-10 select-none"
            draggable={false}
          />

          <div className="absolute inset-0 bg-black/50" />

          <div
            className={`relative z-10 flex h-full items-center ${
              section.align === "left" ? "justify-start" : "justify-end"
            }`}
          >
            <div
              className={`px-6 md:px-20 text-white max-w-xl ${
                section.align === "left" ? "text-left" : "text-right"
              }`}
            >
              <h2 className="mb-6 text-4xl md:text-6xl font-bold">
                {section.title}
              </h2>

              <p className="text-lg md:text-xl leading-relaxed">
                {section.text}
              </p>
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}

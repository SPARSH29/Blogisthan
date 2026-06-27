"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";

interface BlogObject {
  _id: string;
  title: string;
  content: string;
  category?: string;
  authorName?: string;
  image?: string;
  createdAt: string;
}

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<BlogObject[]>([]);
  const [loading, setLoading] = useState(true);

  // Search State
  const [search, setSearch] = useState("");

  const FALLBACK_IMAGE =
    "https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=800";

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const baseUrl =
          typeof window !== "undefined" ? window.location.origin : "";

        const res = await fetch(`${baseUrl}/api/blogs`);
        const data = await res.json();

        if (data.success) {
          setBlogs(data.blogs);
        }
      } catch (e) {
        console.error("Error fetching blogs:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  // Extract excerpt
  const getBlogExcerpt = (jsonString: string) => {
    try {
      const parsed = JSON.parse(jsonString);

      if (parsed && Array.isArray(parsed.blocks)) {
        const firstParagraph = parsed.blocks.find(
          (b: any) => b.type === "paragraph"
        );

        if (firstParagraph?.data?.text) {
          const text = firstParagraph.data.text.replace(/<[^>]*>/g, "");
          return text.length > 100 ? text.substring(0, 100) + "..." : text;
        }
      }
    } catch {
      if (typeof jsonString === "string") {
        return jsonString.length > 100
          ? jsonString.substring(0, 100) + "..."
          : jsonString;
      }
    }

    return "Click read more to view the full insights of this post...";
  };

  // Extract image
  const getBlogCoverImage = (jsonString: string) => {
    try {
      if (typeof jsonString === "string" && jsonString.startsWith("http")) {
        return jsonString;
      }

      const parsed = JSON.parse(jsonString);

      if (parsed) {
        if (Array.isArray(parsed.blocks)) {
          const imageBlock = parsed.blocks.find(
            (b: any) => b.type === "image"
          );

          if (imageBlock?.data?.file?.url) return imageBlock.data.file.url;

          if (imageBlock?.data?.url) return imageBlock.data.url;

          const customBlock = parsed.blocks.find(
            (b: any) => b.url || b.data?.url
          );

          if (customBlock) return customBlock.url || customBlock.data.url;
        }

        if (parsed.url) return parsed.url;
      }
    } catch {}

    return null;
  };

  // Filter blogs
  const filteredBlogs = useMemo(() => {
    if (!search.trim()) return blogs;

    return blogs.filter((blog) => {
      const query = search.toLowerCase();

      return (
        blog.title.toLowerCase().includes(query) ||
        (blog.category || "").toLowerCase().includes(query) ||
        (blog.authorName || "").toLowerCase().includes(query) ||
        getBlogExcerpt(blog.content).toLowerCase().includes(query)
      );
    });
  }, [blogs, search]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-gray-600 font-medium">
          Loading blog database library...
        </p>
      </div>
    );
  }

  return (<>

    <div className="relative min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
     <div className="absolute inset-0 bg-[radial-gradient(#a855f766_1px,transparent_1px)] [background-size:16px_16px]" />

      {/* Purple Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#7c3aed22,transparent_70%)]" />
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">
            Our Blog Library
          </h1>

          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Explore our latest articles, insights, and structural update
            guides.
          </p>
        </div>

        {/* Search */}
        <div className="flex justify-center items-center mb-12">
  <div className="relative w-full max-w-4xl">
    <input
      type="text"
      placeholder="Search by title, author, category..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          // Optional: perform search action here
        }
      }}
      className="w-full rounded-2xl border border-purple-200 bg-white px-6 py-4 pr-16 text-gray-700 shadow-lg shadow-purple-100/40 outline-none transition-all duration-300 placeholder:text-gray-400 focus:border-purple-500 focus:ring-4 focus:ring-purple-200"
    />

    <button
      type="button"
      onClick={() => {
        // Optional: perform search action here
      }}
      className="absolute right-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-xl text-gray-500 transition-all duration-300 hover:bg-purple-100 hover:text-purple-700 cursor-pointer"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 21l-4.35-4.35m1.85-5.15a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
    </button>
  </div>
</div>

        {/* Create Button */}
        <div className="flex justify-center sm:justify-end mb-12">
          <Link href="/create-blog">
            <button className="group relative overflow-hidden rounded-2xl bg-linear-to-r from-purple-600 via-purple-700 to-indigo-700 px-7 py-3.5 text-white font-semibold shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer flex items-center gap-2">
              <svg
                className="w-5 h-5 transition-transform group-hover:rotate-90"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                  d="M12 4v16m8-8H4"
                />
              </svg>

              Create New Blog
            </button>
          </Link>
        </div>

        {/* Empty */}
        {filteredBlogs.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl shadow-sm">
            <p className="text-gray-500 text-lg">
              No matching blogs found.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredBlogs.map((blog) => {
              const coverImage = getBlogCoverImage(blog.content);

              return (
                <article
                  key={blog._id}
                  className="flex flex-col bg-white rounded-3xl shadow-md overflow-hidden border border-purple-50 transition hover:shadow-xl"
                >
                  <Link href={`/blogs/${blog._id}`}>
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={blog.image || coverImage || FALLBACK_IMAGE}
                        alt={blog.title}
                        className="h-full w-full object-cover hover:scale-105 transition"
                        onError={(e) => {
                          e.currentTarget.src = FALLBACK_IMAGE;
                        }}
                      />

                      <span className="absolute top-3 left-3 bg-white/90 text-purple-700 text-xs font-semibold px-2 py-1 rounded-md">
                        {blog.category || "General"}
                      </span>
                    </div>

                    <div className="p-6 flex flex-col flex-1">
                      <div className="flex justify-end mb-4">
                        <span className="text-xs text-gray-400">
                          {new Date(blog.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                            }
                          )}
                        </span>
                      </div>

                      <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 hover:text-purple-600">
                        {blog.title}
                      </h2>

                      <p className="text-gray-600 text-sm mb-6 flex-1 line-clamp-3">
                        {getBlogExcerpt(blog.content)}
                      </p>

                      <div className="pt-4 border-t flex justify-between">
                        <span className="text-xs text-gray-500 truncate">
                          By {blog.authorName || "Anonymous"}
                        </span>

                        <span className="text-sm font-semibold text-purple-600">
                          Read More →
                        </span>
                      </div>
                    </div>
                  </Link>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
    </>
  );
}
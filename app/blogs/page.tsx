// Refactored version based on your reference.
// Replace the contents of this file with the final merged component as needed.

"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import BlogCardSkeleton from "@/app/components/BlogCardSkeleton";

import { useRouter } from "next/navigation";

interface BlogObject {
  _id: string;
  title: string;
  content: string;
  category?: string;
  authorName?: string;
  image?: string;
  createdAt: string;
  views: number;
}

export default function YourBlogs() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [blogs, setBlogs] = useState<BlogObject[]>([]);
  const [loading, setLoading] = useState(true);

  // Fallback stock image matching your dashboard styling
  const FALLBACK_IMAGE =
    "https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=1200";

  // 📦 fetch blogs
  const fetchBlogs = async () => {
    try {
      setLoading(true);

      const res = await fetch("/api/blogs");
      const data = await res.json();

      if (data.success) {
        setBlogs(data.blogs);
      } else {
        setBlogs([]);
      }
    } catch (error) {
      console.error("Error fetching blogs:", error);
    } finally {
      setLoading(false);
    }
  };

  // 🚀 load blogs on mount
  useEffect(() => {
    fetchBlogs();
  }, []);

  // 📖 open blog using database ID
  const openBlog = (id: string) => {
    router.push(`/blogs/${id}`);
  };

  // ✨ EDITOR.JS JSON EXCERPT EXTRACTOR (Parses Editor.js structure to display readable text)
  const getBlogExcerpt = (jsonString: string) => {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed && Array.isArray(parsed.blocks)) {
        const firstParagraph = parsed.blocks.find(
          (b: any) => b.type === "paragraph",
        );
        if (firstParagraph && firstParagraph.data && firstParagraph.data.text) {
          const text = firstParagraph.data.text.replace(/<[^>]*>/g, "");
          return text.length > 100 ? text.substring(0, 100) + "..." : text;
        }
      }
    } catch (e) {
      if (typeof jsonString === "string") {
        return jsonString.length > 100
          ? jsonString.substring(0, 100) + "..."
          : jsonString;
      }
    }
    return "Click read more to view the full insights of this post...";
  };
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

  return (
    // 🔒 pt-28 and sm:pt-32 adds padding to clear the 64px (h-16) navbar + nprogress bar height
    <div className=" min-h-screen overflow-hidden bg-gray-200 px-6 py-10 pt-28 sm:pt-32">
      {/* Purple Dot Background */}
      <div className="absolute inset-0 bg-[radial-gradient(#a855f766_1px,transparent_1px)] [background-size:16px_16px]" />

      {/* Purple Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#7c3aed22,transparent_70%)]" />

      <div className="relative z-10 max-w-5xl -mt-20 mx-auto">
        {/* Header Section */}
        <div className="rounded-3xl bg-white border border-purple-100 shadow-xl p-8 mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Blogs</h1>
            <p className="mt-2 text-gray-600">
              View all blogs published by users around the world!
            </p>
          </div>

          {/* ✨ STYLISH CREATE BUTTON CONTAINER */}
          <Link href="/create-blog">
            <button className="inline-flex items-center gap-2 bg-purple-600 text-white px-6 py-3.5 rounded-2xl font-semibold shadow-md shadow-purple-500/20 hover:bg-purple-700 hover:shadow-lg hover:shadow-purple-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 cursor-pointer text-sm tracking-wide">
              <svg
                className="w-5 h-5"
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
        <div className="flex justify-center items-center mb-7">
          <div className="relative w-full max-w-5xl">
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

        {/* Loading / Content Grid */}
        {loading ? (
          <div className="grid gap-6 md:grid-cols-2">
            {Array.from({ length: 6 }).map((_, index) => (
              <BlogCardSkeleton key={index} />
            ))}
          </div>
        ) : filteredBlogs.length === 0 ? (
          <div className="text-center py-20 bg-white/20 rounded-3xl shadow-sm">
            <p className="text-gray-500 text-lg">
              {search.trim()
                ? "No matching blogs found."
                : "No blogs found. Start sharing your ideas!"}
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {filteredBlogs.map((blog: any) => {
              const imageUrl =
                blog.image && !blog.image.includes("imgbb.com")
                  ? blog.image
                  : FALLBACK_IMAGE;

              return (
                <div
                  key={blog._id}
                  onClick={() => openBlog(blog._id)}
                  className="group flex flex-col justify-between overflow-hidden rounded-2xl cursor-pointer bg-white border border-purple-100 shadow-md hover:shadow-xl transition-all duration-300"
                >
                  {/* 🖼️ Blog Cover Image Container */}
                  <div className="relative h-48 w-full overflow-hidden bg-gray-100">
                    <img
                      src={imageUrl}
                      alt={blog.title}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        e.currentTarget.src = FALLBACK_IMAGE;
                      }}
                    />

                    {blog.category && (
                      <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-purple-700 text-xs font-semibold px-2.5 py-1 rounded-md shadow-sm uppercase tracking-wider">
                        {blog.category}
                      </span>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 group-hover:text-purple-600 transition-colors line-clamp-2">
                        {blog.title}
                      </h2>

                      <p className="mt-2 text-gray-600 text-sm line-clamp-3 leading-relaxed">
                        {getBlogExcerpt(blog.content)}
                      </p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                          <svg
                            className="w-4 h-4 text-purple-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            />
                          </svg>
                        </div>

                        <div className="flex flex-col min-w-0">
                          <span className="text-sm font-semibold text-gray-800 truncate">
                            By {blog.authorName || "Anonymous"}
                          </span>

                          <span className="text-xs text-gray-500">
                            Published Article
                          </span>
                        </div>

                        <div className="ml-3 inline-flex items-center gap-1.5 rounded-full bg-purple-50 border border-purple-100 px-3 py-1 text-xs font-medium text-purple-700">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-3.5 w-3.5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M1.5 12S5.5 5 12 5s10.5 7 10.5 7-4 7-10.5 7S1.5 12 1.5 12z"
                            />
                            <circle cx="12" cy="12" r="3" />
                          </svg>

                          {blog.views}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button className="text-purple-600 font-semibold text-sm group-hover:text-purple-700 inline-flex items-center gap-1">
                          Read More
                          <span className="group-hover:translate-x-1 transition-transform">
                            →
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

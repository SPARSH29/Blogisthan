"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

interface BlogObject {
  _id: string;
  title: string;
  content: string; // JSON block string payload from Editor.js or direct URL string
  category?: string;
  authorName?: string;
  image?: string;
  createdAt: string;
}

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<BlogObject[]>([]);
  const [loading, setLoading] = useState(true);

  // Fallback beautiful geometric banner if no image is uploaded
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
        console.error("Error fetching blogs data matrix:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  // ✨ EDITOR.JS JSON EXCERPT EXTRACTOR
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

  // ✨ ROBUST THUMBNAIL/IMAGE URL EXTRACTOR
  // Handles EditorJS block layouts, direct HTTP URL strings, and custom JSON upload keys
  const getBlogCoverImage = (jsonString: string) => {
    try {
      // Attempt 1: If content is saved directly as an HTTP/HTTPS URL string
      if (typeof jsonString === "string" && jsonString.startsWith("http")) {
        return jsonString;
      }

      // Attempt 2: Parse structured JSON payload
      const parsed = JSON.parse(jsonString);
      if (parsed) {
        // Standard Editor.js image block layout (e.g., image tool)
        if (Array.isArray(parsed.blocks)) {
          const imageBlock = parsed.blocks.find((b: any) => b.type === "image");
          if (imageBlock?.data?.file?.url) return imageBlock.data.file.url;
          if (imageBlock?.data?.url) return imageBlock.data.url;

          // Check for custom url parameters residing in content blocks
          const customBlock = parsed.blocks.find(
            (b: any) => b.url || b.data?.url,
          );
          if (customBlock) return customBlock.url || customBlock.data.url;
        }

        // Attempt 3: Direct check if uploaded payload/URL sits at root level
        if (parsed.url) return parsed.url;
      }
    } catch (e) {
      // Gracefully bypass if string isn't JSON
    }
    return null;
  };

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

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">
            Our Blog Library
          </h1>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Explore our latest articles, insights, and structural update guides.
          </p>
        </div>

        {blogs.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-purple-50 max-w-lg mx-auto">
            <p className="text-gray-500 text-lg font-medium">
              No blog posts found.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog) => {
              const coverImage = getBlogCoverImage(blog.content);

              return (
                <article
                  key={blog._id}
                  className="flex flex-col bg-white rounded-3xl shadow-md overflow-hidden border border-purple-50/80 transition hover:shadow-xl hover:border-purple-100"
                >
                  {/* 🖼️ COVER IMAGE CONTAINER WITH FALLBACK INTEGRATION */}
                  <Link href={`/blogs/${blog._id}`}>
                    <div className="relative h-48 w-full overflow-hidden bg-gray-100">
                      <img
                        src={blog.image || FALLBACK_IMAGE}
                        alt={blog.title}
                        className="h-full w-full object-cover transition duration-300 hover:scale-105"
                        onError={(e) => {
                          e.currentTarget.src = FALLBACK_IMAGE;
                        }}
                      />

                      {/* Category Tag overlay */}
                      <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-purple-700 text-xs font-semibold px-2.5 py-1 rounded-md shadow-sm uppercase tracking-wider">
                        {blog.category || "General"}
                      </span>
                    </div>

                    <div className="p-6 flex flex-col flex-1">
                      {/* Date */}
                      <div className="flex items-center justify-end mb-4">
                        <span className="text-xs text-gray-400">
                          {new Date(blog.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                            },
                          )}
                        </span>
                      </div>

                      {/* Title */}
                      <h2 className="text-xl font-bold text-gray-900 mb-3 leading-snug tracking-tight line-clamp-2">
                        <Link
                          href={`/blogs/${blog._id}`}
                          className="hover:text-purple-600 transition"
                        >
                          {blog.title}
                        </Link>
                      </h2>

                      {/* Clean Excerpt */}
                      <p className="text-gray-600 text-sm mb-6 flex-1 line-clamp-3">
                        {getBlogExcerpt(blog.content)}
                      </p>

                      {/* Footer / Read More */}
                      <div className="pt-4 border-t border-gray-50 flex items-center justify-between mt-auto">
                        <span className="text-xs font-medium text-gray-500 truncate max-w-[150px]">
                          By {blog.authorName || "Anonymous"}
                        </span>
                        <Link
                          href={`/blogs/${blog._id}`}
                          className="text-sm font-semibold text-purple-600 hover:text-purple-800 flex items-center transition"
                        >
                          Read More →
                        </Link>
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
  );
}

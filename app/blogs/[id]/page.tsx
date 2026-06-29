"use client";

import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";

interface BlogObject {
  _id: string;
  title: string;
  content: string; // JSON block string payload from Editor.js
  category?: string;
  authorName?: string;
  image?: string;
  createdAt: string;
  views: number;
}

export default function SingleBlogPage() {
  const { id } = useParams();
  const [loadingExplore, setLoadingExplore] = useState(false);
  const [blog, setBlog] = useState<BlogObject | null>(null);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const exploreRef = useRef<HTMLDivElement>(null);
  const [blogs, setBlogs] = useState<BlogObject[]>([]);

  // Fallback beautiful geometric banner if no image is uploaded
  const FALLBACK_IMAGE =
    "https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=1200";

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const baseUrl =
          typeof window !== "undefined" ? window.location.origin : "";
        const res = await fetch(`${baseUrl}/api/blogs?id=${id}`);
        const data = await res.json();

        if (data.success) {
          setBlog(data.blog);
        }
      } catch (e) {
        console.error("Error fetching structured block data payload:", e);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchBlog(); // Current blog
    }

    const key = `viewed-${id}`;
    if (!localStorage.getItem(key)) {
      const timer = setTimeout(async () => {
        try {
          await fetch("/api/blogs/views", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ id }),
          });

          localStorage.setItem(key, "true");

          // Update UI immediately
          setBlog((prev) =>
            prev
              ? {
                  ...prev,
                  views: (prev.views ?? 0) + 1,
                }
              : prev,
          );
        } catch (err) {
          console.error(err);
        }
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [id]);

const fetchBlogs = async () => {
  if (blogs.length > 0) return; // already fetched

  setLoadingExplore(true);

  try {
    const res = await fetch("/api/blogs");
    const data = await res.json();

    if (data.success) {
      setBlogs(data.blogs);
    }
  } catch (err) {
    console.error(err);
  } finally {
    setLoadingExplore(false);
  }
};

useEffect(() => {
  if (!exploreRef.current) return;

  const observer = new IntersectionObserver(async ([entry]) => {
    if (!entry.isIntersecting) return;

    observer.disconnect();

    setLoadingExplore(true);

    try { 
      const res = await fetch("/api/blogs?page=1&limit=10");
      const data = await res.json();

      if (data.success) {
        setBlogs(data.blogs);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingExplore(false);
    }
  }, {
    rootMargin: "300px",
    threshold: 0,
  });

  observer.observe(exploreRef.current);

  return () => observer.disconnect();
}, [blog]);


  // ✨ STRUCTURED BLOCKS ENGINE PARSER (Strict JSON parsing designed for Editor.js)
  const renderContent = (contentString: string) => {
    if (!contentString) return null;

    try {
      const parsed = JSON.parse(contentString);

      if (parsed && Array.isArray(parsed.blocks)) {
        return parsed.blocks.map((block: any) => {
          switch (block.type) {
            case "header":
              const tagLevel = block.data.level || 2;
              const HeaderTag = `h${tagLevel}` as
                | "h1"
                | "h2"
                | "h3"
                | "h4"
                | "h5"
                | "h6";

              const headerClasses =
                block.data.level === 1
                  ? "text-4xl font-extrabold mt-8 mb-4 text-gray-900 tracking-tight"
                  : block.data.level === 3
                    ? "text-xl font-bold mt-5 mb-2 text-gray-800"
                    : "text-2xl font-bold mt-6 mb-3 text-gray-800";

              return React.createElement(HeaderTag, {
                key: block.id,
                className: headerClasses,
                dangerouslySetInnerHTML: { __html: block.data.text },
              });

            case "paragraph":
              return (
                <p
                  key={block.id}
                  className="text-gray-700 text-base md:text-lg leading-relaxed mb-6"
                  dangerouslySetInnerHTML={{ __html: block.data.text }}
                />
              );

            case "list":
              const ListTag = block.data.style === "ordered" ? "ol" : "ul";
              const listClasses =
                block.data.style === "ordered"
                  ? "list-decimal pl-6 mb-6 space-y-1 text-gray-700"
                  : "list-disc pl-6 mb-6 space-y-1 text-gray-700";

              return React.createElement(
                ListTag,
                {
                  key: block.id,
                  className: listClasses,
                },
                block.data.items.map((item: any, i: number) => {
                  let cleanText = "";
                  if (typeof item === "string") {
                    cleanText = item.trim();
                  } else if (item && typeof item === "object") {
                    cleanText = (item.content || item.text || "").trim();
                  }

                  return React.createElement("li", {
                    key: i,
                    className:
                      "text-gray-700 text-base md:text-lg pl-1 mb-2 [&>p]:inline [&>p]:m-0",
                    dangerouslySetInnerHTML: { __html: cleanText },
                  });
                }),
              );

            case "image":
              const imageUrl = block.data?.file?.url;
              const imageCaption = block.data?.caption || "";
              if (!imageUrl) return null;
              return (
                <figure
                  key={block.id}
                  className="my-8 flex flex-col items-center"
                >
                  <img
                    src={imageUrl}
                    alt={imageCaption || "Blog content image"}
                    className="rounded-2xl shadow-md w-full max-h-[450px] object-cover"
                  />
                  {imageCaption && (
                    <figcaption className="mt-3 text-sm text-gray-500 italic">
                      {imageCaption}
                    </figcaption>
                  )}
                </figure>
              );

            case "quote":
              return (
                <blockquote
                  key={block.id}
                  className="border-l-4 border-purple-500 italic bg-purple-50/50 pl-4 pr-2 py-3 rounded-r-xl my-6 text-gray-700 text-base md:text-lg"
                >
                  <p dangerouslySetInnerHTML={{ __html: block.data.text }} />
                  {block.data.caption && (
                    <cite className="block text-xs text-gray-500 mt-1 not-italic">
                      — {block.data.caption}
                    </cite>
                  )}
                </blockquote>
              );

            case "code":
              return (
                <pre
                  key={block.id}
                  className="bg-gray-900 text-purple-300 p-4 rounded-xl overflow-x-auto text-sm my-6 font-mono shadow-md"
                >
                  <code>{block.data.code}</code>
                </pre>
              );

            default:
              return null;
          }
        });
      }
    } catch (e) {
      // Fallback display if payload is not in structured JSON block format
      return (
        <div className="whitespace-pre-wrap text-gray-800 leading-relaxed text-base md:text-lg">
          {contentString}
        </div>
      );
    }
  };

  if (loading) {
    return (
      <div className="z-10 bg-gray-200 flex flex-col items-center justify-center min-h-screen">
        <div className="fixed inset-0 -z-20 bg-[radial-gradient(#a855f766_1px,transparent_1px)] [background-size:16px_16px]" />
        <div className="fixed inset-0 -z-20 bg-[radial-gradient(circle_at_center,#7c3aed22,transparent_70%)]" />

        <div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-gray-600 font-medium">Assembling article views...</p>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="z-10 bg-gray-200 min-h-screen flex items-center justify-center p-4">
        <div className="fixed inset-0 -z-20 bg-[radial-gradient(#a855f766_1px,transparent_1px)] [background-size:16px_16px]" />
        <div className="fixed inset-0 -z-20 bg-[radial-gradient(circle_at_center,#7c3aed22,transparent_70%)]" />

        <div className="rounded-2xl p-8 shadow-sm text-center border border-purple-100 max-w-sm">
          <p className="text-gray-700 text-lg px-2 py-4 font-medium">
            Blog post not found.
          </p>
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
      </div>
    );
  }

  const openBlog = (blogId: string) => {
    router.push(`/blogs/${blogId}`); // change if your route is different
  };

  const getBlogExcerpt = (content: string) => {
    try {
      const parsed = JSON.parse(content);

      if (parsed.blocks) {
        const text = parsed.blocks
          .filter((b: any) => b.type === "paragraph")
          .map((b: any) => b.data.text.replace(/<[^>]+>/g, ""))
          .join(" ");

        return text.slice(0, 120) + "...";
      }
    } catch {}

    return content.slice(0, 120) + "...";
  };

  const exploreBlogs = blogs
    .filter((item) => item._id !== blog?._id)
    .sort((a, b) => (b.views ?? 0) - (a.views ?? 0))
    .slice(0, 6);

  const CARD_WIDTH = 364; // card width + gap

  const smoothScroll = (distance: number) => {
    if (!scrollRef.current) return;

    const container = scrollRef.current;
    const start = container.scrollLeft;
    const target = start + distance;
    const duration = 450;
    let startTime: number | null = null;

    const easeInOutCubic = (t: number) =>
      t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;

      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);

      container.scrollLeft =
        start + (target - start) * easeInOutCubic(progress);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  };

  const scrollLeft = () => smoothScroll(-CARD_WIDTH);
  const scrollRight = () => smoothScroll(CARD_WIDTH);
  return (
    <div className="z-10 min-h-screen py-12 bg-gray-200 px-4 sm:px-6 lg:px-8">
      <div className="fixed inset-0 -z-20 bg-[radial-gradient(#a855f766_1px,transparent_1px)] [background-size:16px_16px]" />
      <div className="fixed inset-0 -z-20 bg-[radial-gradient(circle_at_center,#7c3aed22,transparent_70%)]" />

      <article className="max-w-3xl mx-auto rounded-3xl shadow-xl overflow-hidden border border-purple-50">
        {/* ✨ STYLISH BANNER COVER IMAGE SECTION */}
        <div className="relative w-full h-64 sm:h-80 md:h-96 bg-gray-100">
          <img
            src={blog.image || FALLBACK_IMAGE}
            alt={blog.title}
            className="w-full h-full object-cover transition duration-500 hover:scale-105"
            onError={(e) => {
              e.currentTarget.src = FALLBACK_IMAGE;
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-60" />
        </div>

        <div className="p-6 sm:p-10 md:p-12">
          {/* Meta Category Tag */}
          <span className="text-xs font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-3 py-1 rounded-full">
            {blog.category || "General"}
          </span>

          {/* Blog Main Title */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 mt-6 mb-4 leading-tight tracking-tight">
            {blog.title}
          </h1>

          {/* Author Metadata Attribution */}
          <div className="mb-8 pb-6 border-b border-black flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="text-sm text-gray-500">
              By{" "}
              <span className="font-semibold text-gray-700">
                {blog.authorName || "Anonymous"}
              </span>{" "}
              •{" "}
              {new Date(blog.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>

            <div className="inline-flex w-fit items-center gap-2 rounded-full bg-purple-50 border border-purple-100 px-3 py-1.5 text-sm font-medium text-purple-700">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
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

              <span>{Number(blog.views ?? 0).toLocaleString()} Views</span>
            </div>
          </div>

          {/* Structured Block Output Matrix */}
          <div className="max-w-none text-gray-800 break-words">
            {renderContent(blog.content)}
          </div>
        </div>
      </article>

      <div>
        <section ref={exploreRef} className="max-w-7xl mx-auto mt-20">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-4xl font-bold text-gray-900">
                Explore More Articles
              </h2>

              <p className="mt-2 text-gray-500">
                Discover more stories selected just for you.
              </p>
            </div>

            <div className="hidden md:flex gap-3">
              <button
                onClick={scrollLeft}
                className="h-11 w-11 rounded-full bg-white shadow-md border border-purple-100 hover:bg-purple-600 hover:text-white transition"
              >
                ←
              </button>

              <button
                onClick={scrollRight}
                className="h-11 w-11 rounded-full bg-white shadow-md border border-purple-100 hover:bg-purple-600 hover:text-white transition"
              >
                →
              </button>
            </div>
          </div>

          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto overflow-y-hidden snap-x snap-mandatory scroll-smooth pb-4 no-scrollbar"
          >
            {loadingExplore
              ? Array.from({ length: 6 }).map((_, index) => (
                  <div
                    key={index}
                    className="flex-shrink-0 w-[340px] overflow-hidden rounded-3xl bg-white shadow-lg animate-pulse"
                  >
                    {/* Image */}
                    <div className="h-52 bg-gray-300" />

                    <div className="p-6">
                      {/* Category */}
                      <div className="h-5 w-20 rounded-full bg-gray-200 mb-5" />

                      {/* Title */}
                      <div className="h-6 w-full rounded bg-gray-300 mb-3" />
                      <div className="h-6 w-3/4 rounded bg-gray-300 mb-6" />

                      {/* Paragraph */}
                      <div className="space-y-2">
                        <div className="h-4 rounded bg-gray-200" />
                        <div className="h-4 rounded bg-gray-200" />
                        <div className="h-4 w-5/6 rounded bg-gray-200" />
                      </div>

                      {/* Footer */}
                      <div className="flex justify-between items-center mt-8">
                        <div>
                          <div className="h-4 w-28 rounded bg-gray-300 mb-2" />
                          <div className="h-3 w-20 rounded bg-gray-200" />
                        </div>

                        <div className="h-5 w-14 rounded bg-gray-300" />
                      </div>

                      {/* Button */}
                      <div className="mt-6 h-11 rounded-xl bg-gray-300" />
                    </div>
                  </div>
                ))
              : exploreBlogs.map((item) => {
                  const imageUrl =
                    item.image && !item.image.includes("imgbb.com")
                      ? item.image
                      : FALLBACK_IMAGE;

                  return (
                    <div
                      key={item._id}
                      onClick={() => openBlog(item._id)}
                      className="group flex-shrink-0 snap-start w-[340px] rounded-3xl overflow-hidden bg-white shadow-lg cursor-pointer hover:-translate-y-2 hover:shadow-2xl transition duration-300"
                    >
                      <div className="relative h-52 overflow-hidden">
                        <img
                          src={imageUrl}
                          alt={item.title}
                          className="h-full w-full object-cover group-hover:scale-110 transition duration-500"
                        />

                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                        <span className="absolute top-4 left-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-purple-700">
                          {item.category || "General"}
                        </span>
                      </div>

                      <div className="p-6">
                        <h3 className="line-clamp-2 text-xl font-bold group-hover:text-purple-600">
                          {item.title}
                        </h3>

                        <p className="mt-3 line-clamp-3 text-sm text-gray-600">
                          {getBlogExcerpt(item.content)}
                        </p>

                        <div className="mt-6 flex items-center justify-between">
                          <div>
                            <p className="font-semibold text-gray-800">
                              {item.authorName || "Anonymous"}
                            </p>

                            <p className="text-xs text-gray-500">
                              {new Date(item.createdAt).toLocaleDateString()}
                            </p>
                          </div>

                          <div className="font-semibold text-purple-600">
                            👁 {item.views}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
          </div>
        </section>
      </div>
    </div>
  );
}

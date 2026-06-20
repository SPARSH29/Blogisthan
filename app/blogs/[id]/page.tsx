"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";

interface BlogObject {
  _id: string;
  title: string;
  content: string; // JSON block string payload from Editor.js
  category?: string;
  authorName?: string;
  image?: string;
  createdAt: string;
}

export default function SingleBlogPage() {
  const { id } = useParams();
  const [blog, setBlog] = useState<BlogObject | null>(null);
  const [loading, setLoading] = useState(true);

  // Fallback beautiful geometric banner if no image is uploaded
  const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=1200";

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
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
    if (id) fetchBlog();
  }, [id]);

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
              const HeaderTag = `h${tagLevel}` as "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
              
              const headerClasses = 
                block.data.level === 1 ? "text-4xl font-extrabold mt-8 mb-4 text-gray-900 tracking-tight" :
                block.data.level === 3 ? "text-xl font-bold mt-5 mb-2 text-gray-800" :
                "text-2xl font-bold mt-6 mb-3 text-gray-800";
              
              return React.createElement(HeaderTag, {
                key: block.id,
                className: headerClasses,
                dangerouslySetInnerHTML: { __html: block.data.text }
              });
            
            case "paragraph":
              return (
                <p key={block.id} className="text-gray-700 text-base md:text-lg leading-relaxed mb-6" dangerouslySetInnerHTML={{ __html: block.data.text }} />
              );
            
            case "list":
              const ListTag = block.data.style === "ordered" ? "ol" : "ul";
              const listClasses = block.data.style === "ordered" ? "list-decimal pl-6 mb-6 space-y-1 text-gray-700" : "list-disc pl-6 mb-6 space-y-1 text-gray-700";
              
              return React.createElement(ListTag, {
                key: block.id,
                className: listClasses
              }, block.data.items.map((item: any, i: number) => {
                let cleanText = "";
                if (typeof item === "string") {
                  cleanText = item.trim();
                } else if (item && typeof item === "object") {
                  cleanText = (item.content || item.text || "").trim();
                }

                return React.createElement("li", {
                  key: i,
                  className: "text-gray-700 text-base md:text-lg pl-1 mb-2 [&>p]:inline [&>p]:m-0",
                  dangerouslySetInnerHTML: { __html: cleanText }
                });
              }));

            case "image":
              const imageUrl = block.data?.file?.url;
              const imageCaption = block.data?.caption || "";
              if (!imageUrl) return null;
              return (
                <figure key={block.id} className="my-8 flex flex-col items-center">
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
                <blockquote key={block.id} className="border-l-4 border-purple-500 italic bg-purple-50/50 pl-4 pr-2 py-3 rounded-r-xl my-6 text-gray-700 text-base md:text-lg">
                  <p dangerouslySetInnerHTML={{ __html: block.data.text }} />
                  {block.data.caption && <cite className="block text-xs text-gray-500 mt-1 not-italic">— {block.data.caption}</cite>}
                </blockquote>
              );

            case "code":
              return (
                <pre key={block.id} className="bg-gray-900 text-purple-300 p-4 rounded-xl overflow-x-auto text-sm my-6 font-mono shadow-md">
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
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-gray-600 font-medium">Assembling article views...</p>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="rounded-2xl bg-white p-8 shadow-sm text-center border border-purple-100 max-w-sm">
          <p className="text-gray-700 text-lg font-medium">Blog post content data missing.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <article className="max-w-3xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border border-purple-50">
        
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
          <p className="text-sm text-gray-500 mb-8 pb-6 border-b border-gray-100">
            By <span className="font-semibold text-gray-700">{blog.authorName || "Anonymous"}</span> • {
              new Date(blog.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric"
              })
            }
          </p>

          {/* Structured Block Output Matrix */}
          <div className="max-w-none text-gray-800 break-words">
            {renderContent(blog.content)}
          </div>
        </div>

      </article>
    </div>
  );
}
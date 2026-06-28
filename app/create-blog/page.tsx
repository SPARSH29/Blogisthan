"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import { useEffect } from "react";

// Dynamically load our block designer module safely without SSR compilation errors
const WordPressEditor = dynamic(() => import("@/app/components/WordPressEditor"), { ssr: false });

export default function CreateBlog() {

const { data: session, status } = useSession();
const router = useRouter();

 const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState(""); // 📸 NEW: Holds the thumbnail cover image URL string
  const [blocksData, setBlocksData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

useEffect(() => {
  if (status === "unauthenticated") {
    router.replace("/login");
  }
}, [status, router]);

if (status === "loading") {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white my-10 rounded-3xl shadow-xl border border-gray-100 animate-pulse">
      {/* Heading */}
      <div className="h-10 w-72 bg-gray-200 rounded mb-8" />

      {/* Title */}
      <div className="h-12 w-full bg-gray-200 rounded mb-8" />

      {/* Category & Image */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div>
          <div className="h-4 w-24 bg-gray-200 rounded mb-3" />
          <div className="h-11 w-full bg-gray-200 rounded-xl" />
        </div>

        <div>
          <div className="h-4 w-40 bg-gray-200 rounded mb-3" />
          <div className="h-11 w-full bg-gray-200 rounded-xl" />
        </div>
      </div>

      {/* Editor */}
      <div className="mb-8">
        <div className="h-4 w-40 bg-gray-200 rounded mb-3" />

        <div className="rounded-2xl border border-gray-200 p-6 space-y-4">
          <div className="h-5 w-full bg-gray-200 rounded" />
          <div className="h-5 w-5/6 bg-gray-200 rounded" />
          <div className="h-5 w-full bg-gray-200 rounded" />
          <div className="h-5 w-4/6 bg-gray-200 rounded" />
          <div className="h-5 w-full bg-gray-200 rounded" />
          <div className="h-5 w-3/4 bg-gray-200 rounded" />
        </div>
      </div>

      {/* Button */}
      <div className="flex justify-end">
        <div className="h-12 w-48 bg-gray-200 rounded-xl" />
      </div>
    </div>
  );
}

if (!session) {
  return null;
}

 

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !blocksData) {
      alert("Please provide at least a title and some body content!");
      return;
    }
    setLoading(true);

    try {
      const res = await fetch("/api/blogs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          title, 
          category: category || "Technology", 
          image: image || "https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=800", // Fallback thumbnail placeholder
          content: JSON.stringify(blocksData) // Encodes the editor blocks array as a clean string for MongoDB
        }),
      });

      const data = await res.json();
      if (data.success) {
        router.push("/blogs");
      }
    } catch (error) {
      console.error("Error writing block dataset to database:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white my-10 rounded-3xl shadow-xl border border-gray-100">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-6 tracking-tight">Gutenberg Block Editor</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Large Title Input */}
        <input 
          type="text" 
          placeholder="New Post Title..." 
          value={title} 
          onChange={(e) => setTitle(e.target.value)}
          className="w-full text-4xl font-bold bg-transparent border-b border-gray-100 py-2 focus:outline-none focus:border-purple-500 text-gray-900 placeholder-gray-300"
          required
        />

        {/* Meta Configuration Layout Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Category</label>
            <input 
              type="text" 
              placeholder="e.g. Design, Development" 
              value={category} 
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900"
            />
          </div>

          {/* 📸 THE NEW THUMBNAIL INPUT CONTAINER */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Thumbnail Cover Image URL</label>
            <input 
              type="url" 
              placeholder="https://images.unsplash.com/... or paste image path" 
              value={image} 
              onChange={(e) => setImage(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900"
            />
          </div>
        </div>

        <div className="pt-4">
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Article Body Content</label>
          {/* WordPress Blocks Component Canvas Hook */}
          <WordPressEditor data={blocksData} onChange={(data) => setBlocksData(data)} />
        </div>

        <div className="flex justify-end pt-4">
          <button 
            type="submit" 
            disabled={loading} 
            className="bg-purple-600 hover:bg-purple-700 px-6 py-3 text-white font-semibold rounded-xl shadow-md hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50 cursor-pointer"
          >
            {loading ? "Saving Block Schemas..." : "Publish Content Block"}
          </button>
        </div>
      </form>
    </div>
  );
}
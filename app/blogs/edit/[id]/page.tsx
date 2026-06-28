"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function EditBlogPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: session, status } = useSession();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState(""); // Holds human-readable text for the textarea
  const [rawJson, setRawJson] = useState(""); // Holds the original JSON payload in the background
  const [category, setCategory] = useState("");
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" | "" }>({
    text: "",
    type: "",
  });

  // Helper: Convert Editor.js JSON blocks into normal, human-readable text
  const parseJsonToPlainText = (jsonString: string) => {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed && Array.isArray(parsed.blocks)) {
        return parsed.blocks
          .map((block: any) => {
            if (block.type === "paragraph" || block.type === "header") {
              return block.data?.text || "";
            } else if (block.type === "list") {
              if (Array.isArray(block.data?.items)) {
                return block.data.items.map((item: any) => item.content || item).join("\n");
              }
            }
            return "";
          })
          .filter(Boolean)
          .join("\n\n");
      }
    } catch (e) {
      console.warn("Could not parse payload as JSON, keeping as plain text", e);
    }
    return jsonString;
  };

  // Helper: Convert edited plain text back into Editor.js JSON format
  const convertPlainTextToJson = (text: string) => {
    try {
      // Check if the original content was valid JSON
      JSON.parse(rawJson);
    } catch (e) {
      // If it wasn't JSON originally, just return the plain text
      return text;
    }

    // Split paragraphs/linebreaks and structure back into Editor.js array blocks
    const blocks = text.split("\n\n").map((para) => {
      // Determine if it looks like a header (or keep as paragraph)
      const isHeader = para.length < 100 && !para.includes(" ");
      return {
        id: Math.random().toString(36).substring(2, 10),
        type: isHeader ? "header" : "paragraph",
        data: isHeader ? { text: para, level: 2 } : { text: para.replace(/\n/g, "<br>") },
      };
    });

    return JSON.stringify({
      time: Date.now(),
      blocks: blocks,
      version: "2.31.6",
    });
  };

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/login");
      return;
    }

    const fetchBlogDetails = async () => {
  try {
    setLoading(true);

    const res = await fetch(`/api/blogs?id=${id}`);
    const data = await res.json();

    if (!data.success || !data.blog) {
      setMessage({
        text: "Blog not found.",
        type: "error",
      });

      setTimeout(() => {
        router.replace("/yourblogs");
      }, 1500);

      return;
    }

    // Get the blog author's email
    const authorEmail = data.blog.authorEmail || data.blog.email;

    // Get logged-in user's email
    const userEmail = session?.user?.email;

    // Only allow the author to edit
    if (!userEmail || authorEmail !== userEmail) {
      setMessage({
        text: "Unauthorized! You can only edit your own blogs.",
        type: "error",
      });

      setTimeout(() => {
        router.replace("/yourblogs");
      }, 1500);

      return;
    }

    // Populate form
    setTitle(data.blog.title || "");
    setRawJson(data.blog.content || "");
    setContent(parseJsonToPlainText(data.blog.content || ""));
    setCategory(data.blog.category || "");
    setImage(data.blog.image || "");

  } catch (error) {
    console.error("Failed to fetch blog:", error);

    setMessage({
      text: "Something went wrong.",
      type: "error",
    });

    setTimeout(() => {
      router.replace("/yourblogs");
    }, 1500);
  } finally {
    setLoading(false);
  }
};
    if (id) fetchBlogDetails();
  }, [id, session, status, router]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ text: "", type: "" });

    // Re-encode normal text back to Editor.js JSON payload before hitting API
    const updatedContentPayload = convertPlainTextToJson(content);

    try {
      const res = await fetch(`/api/blogs?id=${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          content: updatedContentPayload,
          category,
          image,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setMessage({ text: "Blog updated successfully! Redirecting...", type: "success" });
        
        // ✨ Guaranteed redirection using established parameter ID
        setTimeout(() => {
          if (id) {
            router.push(`/blogs/${id}`);
          } else {
            router.push("/yourblogs");
          }
        }, 1500);
      } else {
        setMessage({ text: data.error || "Failed to update blog.", type: "error" });
      }
    } catch (error) {
      console.error("Error updating blog:", error);
      setMessage({ text: "Something went wrong on the network.", type: "error" });
    } finally {
      setSaving(false);
    }
  };

  if (loading || status === "loading") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-gray-600 font-medium">Loading edit interface...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen z-10 bg-gray-200 py-12 px-4 sm:px-6 lg:px-8 pt-28 sm:pt-32">
      <div className="fixed inset-0 -z-20 bg-[radial-gradient(#a855f766_1px,transparent_1px)] [background-size:16px_16px]" />
        <div className="fixed inset-0 -z-20 bg-[radial-gradient(circle_at_center,#7c3aed22,transparent_70%)]" />

      <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-xl p-6 sm:p-10 border border-purple-50">
        <h1 className="text-4xl font-bold text-gray-900 mb-6 tracking-tight">
          Edit Blog Post
        </h1>

        {/* Inline message banner */}
        {message.text && (
          <div
            className={`mb-6 p-4 rounded-2xl text-sm font-medium ${
              message.type === "success"
                ? "bg-green-50 text-green-800 border border-green-100"
                : "bg-red-50 text-red-800 border border-red-100"
            }`}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleUpdate} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-600 shadow-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Category
            </label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-600 shadow-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Cover Image URL
            </label>
            <input
              type="url"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-600 shadow-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Content
            </label>
            <textarea
              rows={14}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              placeholder="The content will appear here as readable text..."
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-600 shadow-sm text-sm leading-relaxed"
            />
          </div>

          <div className="flex justify-end gap-4 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-3 rounded-xl border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 rounded-xl bg-purple-600 text-white font-semibold hover:bg-purple-700 transition shadow-md shadow-purple-500/10 flex items-center justify-center min-w-[120px] cursor-pointer"
            >
              {saving ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
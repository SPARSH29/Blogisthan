"use client";

import React, { useEffect, useRef } from "react";
import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import List from "@editorjs/list";
import Code from "@editorjs/code";
import InlineCode from "@editorjs/inline-code";
import Quote from "@editorjs/quote";

interface EditorProps {
  data: any;
  onChange: (data: any) => void;
}

export default function WordPressEditor({ data, onChange }: EditorProps) {
  const editorRef = useRef<EditorJS | null>(null);

  useEffect(() => {
    // Prevent double initialization issues in React Strict Mode
    if (!editorRef.current) {
      const editor = new EditorJS({
        holder: "editorjs-container",
        placeholder: "Type '/' for commands or start writing your block...",
        data: data || {},
        tools: {
          header: {
            class: Header as any,
            config: {
              placeholder: "Enter a heading",
              levels: [1, 2, 3],
              defaultLevel: 2,
            },
          },
          list: List as any,
          code: Code as any,
          inlineCode: InlineCode as any,
          quote: Quote as any,
        },
        async onChange(api) {
          const savedData = await api.saver.save();
          onChange(savedData); // Passes a beautiful structured JSON object up to your form state
        },
      });

      editorRef.current = editor;
    }

    return () => {
      if (editorRef.current && typeof editorRef.current.destroy === "function") {
        editorRef.current.destroy();
        editorRef.current = null;
      }
    };
  }, []);

  return (
    <div className="border border-gray-200 rounded-2xl bg-white p-6 shadow-inner min-h-[350px] w-3xl">
      <div id="editorjs-container" className="prose max-w-none text-gray-900" />
    </div>
  );
}
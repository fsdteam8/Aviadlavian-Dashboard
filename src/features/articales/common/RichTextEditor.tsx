"use client";

import React, { useRef } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import { Table } from "@tiptap/extension-table";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import TableRow from "@tiptap/extension-table-row";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Undo,
  Redo,
  Image as ImageIcon,
} from "lucide-react";

interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
  allowImages?: boolean;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  content,
  onChange,
  placeholder = "Write your content here...",
  allowImages = false,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Link.configure({
        openOnClick: false,
      }),
      Placeholder.configure({
        placeholder,
      }),
      Image,
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) {
    return null;
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        if (result) {
          editor.chain().focus().setImage({ src: result }).run();
        }
      };
      reader.readAsDataURL(file);
      // Reset input value to allow selecting same file again
      event.target.value = "";
    }
  };

  return (
    <div className="group rounded-xl overflow-hidden transition-all duration-300">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-1 p-1.5 bg-slate-50/80 backdrop-blur-md dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-30">
        <div className="flex items-center gap-0.5 px-1 py-0.5">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`p-2 rounded-lg transition-all duration-200 hover:bg-slate-200 dark:hover:bg-slate-800/80 ${
              editor.isActive("bold")
                ? "bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-400 font-bold shadow-sm"
                : "text-slate-600 dark:text-slate-400"
            }`}
            title="Bold"
          >
            <Bold className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`p-2 rounded-lg transition-all duration-200 hover:bg-slate-200 dark:hover:bg-slate-800/80 ${
              editor.isActive("italic")
                ? "bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-400 shadow-sm"
                : "text-slate-600 dark:text-slate-400"
            }`}
            title="Italic"
          >
            <Italic className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={`p-2 rounded-lg transition-all duration-200 hover:bg-slate-200 dark:hover:bg-slate-800/80 ${
              editor.isActive("underline")
                ? "bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-400 shadow-sm"
                : "text-slate-600 dark:text-slate-400"
            }`}
            title="Underline"
          >
            <UnderlineIcon className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={`p-2 rounded-lg transition-all duration-200 hover:bg-slate-200 dark:hover:bg-slate-800/80 ${
              editor.isActive("strike")
                ? "bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-400 shadow-sm"
                : "text-slate-600 dark:text-slate-400"
            }`}
            title="Strikethrough"
          >
            <Strikethrough className="h-4 w-4" />
          </button>
        </div>

        <div className="w-px h-6 bg-slate-300 dark:bg-slate-700 mx-1 self-center" />

        <div className="flex items-center gap-0.5 px-1 py-0.5">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`p-2 rounded-lg transition-all duration-200 hover:bg-slate-200 dark:hover:bg-slate-800/80 ${
              editor.isActive("bulletList")
                ? "bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-400 shadow-sm"
                : "text-slate-600 dark:text-slate-400"
            }`}
            title="Bullet List"
          >
            <List className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`p-2 rounded-lg transition-all duration-200 hover:bg-slate-200 dark:hover:bg-slate-800/80 ${
              editor.isActive("orderedList")
                ? "bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-400 shadow-sm"
                : "text-slate-600 dark:text-slate-400"
            }`}
            title="Numbered List"
          >
            <ListOrdered className="h-4 w-4" />
          </button>
        </div>

        <div className="w-px h-6 bg-slate-300 dark:bg-slate-700 mx-1 self-center" />

        <div className="flex items-center gap-0.5 px-1 py-0.5">
          <button
            type="button"
            onClick={() => editor.chain().focus().setTextAlign("left").run()}
            className={`p-2 rounded-lg transition-all duration-200 hover:bg-slate-200 dark:hover:bg-slate-800/80 ${
              editor.isActive({ textAlign: "left" })
                ? "bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-400 shadow-sm"
                : "text-slate-600 dark:text-slate-400"
            }`}
            title="Align Left"
          >
            <AlignLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().setTextAlign("center").run()}
            className={`p-2 rounded-lg transition-all duration-200 hover:bg-slate-200 dark:hover:bg-slate-800/80 ${
              editor.isActive({ textAlign: "center" })
                ? "bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-400 shadow-sm"
                : "text-slate-600 dark:text-slate-400"
            }`}
            title="Align Center"
          >
            <AlignCenter className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().setTextAlign("right").run()}
            className={`p-2 rounded-lg transition-all duration-200 hover:bg-slate-200 dark:hover:bg-slate-800/80 ${
              editor.isActive({ textAlign: "right" })
                ? "bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-400 shadow-sm"
                : "text-slate-600 dark:text-slate-400"
            }`}
            title="Align Right"
          >
            <AlignRight className="h-4 w-4" />
          </button>
        </div>

        {allowImages && (
          <>
            <div className="w-px h-6 bg-slate-300 dark:bg-slate-700 mx-1 self-center" />
            <div className="flex items-center gap-0.5 px-1 py-0.5">
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-2 rounded-lg transition-all duration-200 hover:bg-slate-200 dark:hover:bg-slate-800/80 text-slate-600 dark:text-slate-400"
                title="Add Image from Device"
              >
                <ImageIcon className="h-4 w-4" />
              </button>
            </div>
          </>
        )}

        <div className="hidden sm:flex w-px h-6 bg-slate-300 dark:bg-slate-700 mx-1 self-center" />

        <div className="hidden sm:flex items-center gap-0.5 px-1 py-0.5 ml-auto">
          <button
            type="button"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            className="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800/80 disabled:opacity-30 disabled:cursor-not-allowed transition-all text-slate-600 dark:text-slate-400"
            title="Undo"
          >
            <Undo className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            className="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800/80 disabled:opacity-30 disabled:cursor-not-allowed transition-all text-slate-600 dark:text-slate-400"
            title="Redo"
          >
            <Redo className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Editor Content */}
      <div className="relative min-h-[160px] bg-white dark:bg-slate-950">
        <EditorContent
          editor={editor}
          className="prose dark:prose-invert max-w-none p-6 min-h-[160px] focus:outline-none focus:ring-0 focus-visible:ring-0 outline-none aria-placeholder:text-slate-400 [&_*]:outline-none"
        />
        {!editor.isFocused && !editor.getText() && (
          <div className="absolute top-6 left-6 text-slate-400 pointer-events-none italic text-sm">
            {placeholder}
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="px-4 py-1.5 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center">
        <span className="text-[10px] text-slate-400 font-medium tracking-wider uppercase">
          Neural Rich Text Editor
        </span>
        <div className="flex items-center gap-1.5">
          <div className="h-1.5 w-1.5 rounded-full bg-teal-500 animate-pulse" />
          <span className="text-[10px] text-teal-600 dark:text-teal-400 font-bold uppercase tracking-widest">
            System Online
          </span>
        </div>
      </div>
    </div>
  );
};

export default RichTextEditor;

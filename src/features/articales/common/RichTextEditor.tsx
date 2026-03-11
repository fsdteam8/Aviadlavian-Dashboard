"use client";

import React from "react";
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
} from "lucide-react";

interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  content,
  onChange,
  placeholder = "Write your content here...",
}) => {
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

  return (
    <div className="border rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-1 p-2 bg-slate-50 dark:bg-slate-800 border-b">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 rounded hover:bg-slate-200 dark:hover:bg-slate-700 ${
            editor.isActive("bold") ? "bg-slate-200 dark:bg-slate-700" : ""
          }`}
          title="Bold"
        >
          <Bold className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 rounded hover:bg-slate-200 dark:hover:bg-slate-700 ${
            editor.isActive("italic") ? "bg-slate-200 dark:bg-slate-700" : ""
          }`}
          title="Italic"
        >
          <Italic className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`p-2 rounded hover:bg-slate-200 dark:hover:bg-slate-700 ${
            editor.isActive("underline") ? "bg-slate-200 dark:bg-slate-700" : ""
          }`}
          title="Underline"
        >
          <UnderlineIcon className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`p-2 rounded hover:bg-slate-200 dark:hover:bg-slate-700 ${
            editor.isActive("strike") ? "bg-slate-200 dark:bg-slate-700" : ""
          }`}
          title="Strikethrough"
        >
          <Strikethrough className="h-4 w-4" />
        </button>

        <div className="w-px h-8 bg-slate-300 dark:bg-slate-600 mx-1" />

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded hover:bg-slate-200 dark:hover:bg-slate-700 ${
            editor.isActive("bulletList")
              ? "bg-slate-200 dark:bg-slate-700"
              : ""
          }`}
          title="Bullet List"
        >
          <List className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-2 rounded hover:bg-slate-200 dark:hover:bg-slate-700 ${
            editor.isActive("orderedList")
              ? "bg-slate-200 dark:bg-slate-700"
              : ""
          }`}
          title="Numbered List"
        >
          <ListOrdered className="h-4 w-4" />
        </button>

        <div className="w-px h-8 bg-slate-300 dark:bg-slate-600 mx-1" />

        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          className={`p-2 rounded hover:bg-slate-200 dark:hover:bg-slate-700 ${
            editor.isActive({ textAlign: "left" })
              ? "bg-slate-200 dark:bg-slate-700"
              : ""
          }`}
          title="Align Left"
        >
          <AlignLeft className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          className={`p-2 rounded hover:bg-slate-200 dark:hover:bg-slate-700 ${
            editor.isActive({ textAlign: "center" })
              ? "bg-slate-200 dark:bg-slate-700"
              : ""
          }`}
          title="Align Center"
        >
          <AlignCenter className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          className={`p-2 rounded hover:bg-slate-200 dark:hover:bg-slate-700 ${
            editor.isActive({ textAlign: "right" })
              ? "bg-slate-200 dark:bg-slate-700"
              : ""
          }`}
          title="Align Right"
        >
          <AlignRight className="h-4 w-4" />
        </button>

        <div className="w-px h-8 bg-slate-300 dark:bg-slate-600 mx-1" />

        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className="p-2 rounded hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-50"
          title="Undo"
        >
          <Undo className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className="p-2 rounded hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-50"
          title="Redo"
        >
          <Redo className="h-4 w-4" />
        </button>
      </div>

      {/* Editor Content */}
      <EditorContent
        editor={editor}
        className="prose dark:prose-invert max-w-none p-4 min-h-[200px] focus:outline-none"
      />
    </div>
  );
};

export default RichTextEditor;

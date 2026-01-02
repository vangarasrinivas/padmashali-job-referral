"use client";

import { useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import {
  FaBold,
  FaItalic,
  FaStrikethrough,
  FaListUl,
  FaListOl,
  FaLink,
  FaUnlink,
} from "react-icons/fa";

const JobDescriptionEditor = ({ content, onChange }) => {
  const editor = useEditor({
    extensions: [
      StarterKit, // includes paragraph, heading, bulletList, orderedList, listItem, etc.
      Link.configure({
        openOnClick: true,
        autolink: true,
        linkOnPaste: true,
      }),
    ],
    content: content || "",
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "min-h-[150px] p-4 focus:outline-none text-gray-800 break-words whitespace-pre-wrap",
      },
    },
    immediatelyRender: false,
  });

  // Update editor content if `content` prop changes
  useEffect(() => {
    if (editor && content !== undefined && content !== editor.getHTML()) {
      editor.commands.setContent(content, false); // false prevents triggering onUpdate
    }
  }, [content, editor]);

  if (!editor) return null;

  return (
    <div className="flex flex-col">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-1 mb-2 bg-gray-100 p-1 rounded-md shadow-sm">
        <ToolbarButton editor={editor} action="toggleBold" icon={<FaBold size={14} />} />
        <ToolbarButton editor={editor} action="toggleItalic" icon={<FaItalic size={14} />} />
        <ToolbarButton
          editor={editor}
          action="toggleStrike"
          icon={<FaStrikethrough size={14} />}
        />
        <ToolbarButton
          editor={editor}
          action="toggleBulletList"
          icon={<FaListUl size={14} />}
        />
        <ToolbarButton
          editor={editor}
          action="toggleOrderedList"
          icon={<FaListOl size={14} />}
        />
        <ToolbarButton
          editor={editor}
          action="setLink"
          icon={<FaLink size={14} />}
          promptText="Enter URL"
        />
        <ToolbarButton editor={editor} action="unsetLink" icon={<FaUnlink size={14} />} />
      </div>

      {/* Editor */}
      <div className="border border-gray-300 rounded-md shadow-sm bg-white">
        <EditorContent
          editor={editor}
          className="min-h-[150px] p-4 text-gray-800 break-words whitespace-pre-wrap"
        />
      </div>
    </div>
  );
};

const ToolbarButton = ({ editor, action, icon, promptText }) => {
  const handleClick = () => {
    editor.chain().focus();
    if (action === "setLink") {
      let url = "";
      const previousLink = editor.getAttributes("link").href;
      if (previousLink) {
        url = window.prompt(promptText, previousLink) || "";
      } else {
        url = window.prompt(promptText, "") || "";
      }

      if (url) {
        editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
      }
    } else if (action === "unsetLink") {
      if (editor.isActive("link")) editor.chain().focus().unsetLink().run();
    } else {
      editor.chain()[action]().run();
    }
  };

  const isActive =
    (action === "toggleBold" && editor.isActive("bold")) ||
    (action === "toggleItalic" && editor.isActive("italic")) ||
    (action === "toggleStrike" && editor.isActive("strike")) ||
    (action === "toggleBulletList" && editor.isActive("bulletList")) ||
    (action === "toggleOrderedList" && editor.isActive("orderedList"));

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`flex items-center justify-center w-8 h-8 rounded-md transition ${
        isActive
          ? "bg-purple-600 text-white"
          : "bg-white hover:bg-purple-50 text-gray-700"
      }`}
    >
      {icon}
    </button>
  );
};

export default JobDescriptionEditor;

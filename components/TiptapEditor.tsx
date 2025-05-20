
import "../tiptap.css";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import { useEffect } from "react";
// import { Heading } from '@tiptap/extension-heading'; // Ya está en StarterKit

export default function TiptapEditor({
  value,
  onChange,
  className,
  ...props
}: {
  value: string;
  onChange: (html: string) => void;
  className?: string;
}) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({ openOnClick: false }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      // Heading.configure({ levels: [1, 2, 3] }), // Elimina duplicado
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
  attributes: {
    class: "min-h-[200px] border-2 border-red-500 p-2 rounded bg-white text-black focus:outline-none tiptap",
    },
    },
    immediatelyRender: false, // Soluciona el error SSR/hidratación
    ...props,
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || "<p></p>");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  if (!editor) return <div>Cargando editor...</div>;

  return (
    <div>
      <div className="mb-2 flex flex-wrap gap-2">
        <button onClick={() => editor.chain().focus().toggleBold().run()} className={editor.isActive('bold') ? 'font-bold' : ''}>B</button>
        <button onClick={() => editor.chain().focus().toggleItalic().run()} className={editor.isActive('italic') ? 'italic' : ''}>I</button>
        <button onClick={() => editor.chain().focus().toggleUnderline().run()} className={editor.isActive('underline') ? 'underline' : ''}>U</button>
        <button onClick={() => editor.chain().focus().toggleStrike().run()} className={editor.isActive('strike') ? 'line-through' : ''}>S</button>
        <button onClick={() => editor.chain().focus().setTextAlign('left').run()}>Izq</button>
        <button onClick={() => editor.chain().focus().setTextAlign('center').run()}>Centro</button>
        <button onClick={() => editor.chain().focus().setTextAlign('right').run()}>Der</button>
        <button onClick={() => editor.chain().focus().setTextAlign('justify').run()}>Justificar</button>
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive('bulletList') ? 'bg-gray-700 text-white rounded px-2' : ''}
        >• Lista</button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editor.isActive('orderedList') ? 'bg-gray-700 text-white rounded px-2' : ''}
        >1. Lista</button>
        <button
          onClick={() => {
            const url = prompt("URL del enlace:");
            if (url) editor.chain().focus().setLink({ href: url }).run();
          }}
          className={editor.isActive('link') ? 'text-blue-400 underline' : ''}
        >Enlace</button>
        <button onClick={() => editor.chain().focus().unsetLink().run()}>Quitar enlace</button>
        <button onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}>H1</button>
        <button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>H2</button>
        <button onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>H3</button>
        <button onClick={() => editor.chain().focus().setParagraph().run()}>Párrafo</button>
      </div>
      <EditorContent editor={editor} className={className} />
    </div>
  );
}

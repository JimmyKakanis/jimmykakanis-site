import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Youtube, { isValidYoutubeUrl } from '@tiptap/extension-youtube';
import { VimeoEmbed } from '../lib/tiptapVimeoEmbed';
import { 
  Bold, Italic, List, ListOrdered, Link as LinkIcon,
  Image as ImageIcon, Heading1, Heading2, Quote, Undo, Redo, Video 
} from 'lucide-react';

interface EditorProps {
  content: string;
  onChange: (content: string) => void;
}

const Editor = ({ content, onChange }: EditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Link.configure({
        openOnClick: false,
      }),
      Youtube.configure({
        nocookie: true,
        modestBranding: true,
      }),
      VimeoEmbed,
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) {
    return null;
  }

  const addImage = () => {
    const url = window.prompt('URL');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const addVideo = () => {
    const raw = window.prompt('Paste a YouTube or Vimeo link');
    if (!raw?.trim()) return;
    const url = raw.trim();
    if (isValidYoutubeUrl(url)) {
      editor.chain().focus().setYoutubeVideo({ src: url }).run();
      return;
    }
    const vimeo = url.match(/^https:\/\/(www\.)?vimeo\.com\/(\d+)/);
    if (vimeo?.[2]) {
      editor
        .chain()
        .focus()
        .insertContent({
          type: 'vimeoEmbed',
          attrs: { src: `https://vimeo.com/${vimeo[2]}` },
        })
        .run();
      return;
    }
    window.alert('Use a YouTube or Vimeo watch URL (e.g. youtube.com/watch?v=… or vimeo.com/123456789).');
  };

  const setLink = () => {
    const url = window.prompt('URL');
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <div className="bg-gray-50 border-b border-gray-200 p-2 flex flex-wrap gap-1">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('bold') ? 'bg-gray-200' : ''}`}
          title="Bold"
        >
          <Bold size={18} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('italic') ? 'bg-gray-200' : ''}`}
          title="Italic"
        >
          <Italic size={18} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('heading', { level: 1 }) ? 'bg-gray-200' : ''}`}
          title="Heading 1"
        >
          <Heading1 size={18} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('heading', { level: 2 }) ? 'bg-gray-200' : ''}`}
          title="Heading 2"
        >
          <Heading2 size={18} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('bulletList') ? 'bg-gray-200' : ''}`}
          title="Bullet List"
        >
          <List size={18} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('orderedList') ? 'bg-gray-200' : ''}`}
          title="Ordered List"
        >
          <ListOrdered size={18} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('blockquote') ? 'bg-gray-200' : ''}`}
          title="Quote"
        >
          <Quote size={18} />
        </button>
        <button
          onClick={setLink}
          className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('link') ? 'bg-gray-200' : ''}`}
          title="Add Link"
        >
          <LinkIcon size={18} />
        </button>
        <button
          onClick={addImage}
          className="p-2 rounded hover:bg-gray-200"
          title="Add Image URL"
        >
          <ImageIcon size={18} />
        </button>
        <button
          onClick={addVideo}
          className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('youtube') || editor.isActive('vimeoEmbed') ? 'bg-gray-200' : ''}`}
          title="Embed YouTube or Vimeo"
        >
          <Video size={18} />
        </button>
        <div className="w-px h-6 bg-gray-300 mx-1 self-center" />
        <button
          onClick={() => editor.chain().focus().undo().run()}
          className="p-2 rounded hover:bg-gray-200"
          title="Undo"
        >
          <Undo size={18} />
        </button>
        <button
          onClick={() => editor.chain().focus().redo().run()}
          className="p-2 rounded hover:bg-gray-200"
          title="Redo"
        >
          <Redo size={18} />
        </button>
      </div>
      <EditorContent 
        editor={editor} 
        className="blog-prose-content prose prose-sm max-w-none p-4 min-h-[300px] focus:outline-none prose-a:text-blog-link prose-a:underline hover:prose-a:text-blog-link-hover" 
      />
    </div>
  );
};

export default Editor;


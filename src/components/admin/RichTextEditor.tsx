'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { TextStyle } from '@tiptap/extension-text-style';
import FontFamily from '@tiptap/extension-font-family';
import Color from '@tiptap/extension-color';
import Underline from '@tiptap/extension-underline';
import TiptapLink from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import Highlight from '@tiptap/extension-highlight';
import { Extension } from '@tiptap/core';
import { useEffect, useCallback } from 'react';
import {
  Bold, Italic, Underline as UnderlineIcon, Strikethrough,
  Heading1, Heading2, Heading3,
  AlignLeft, AlignCenter, AlignRight,
  List, ListOrdered, Link as LinkIcon, Highlighter,
  Undo, Redo, Minus,
} from 'lucide-react';

// Inline font-size extension
const FontSize = Extension.create({
  name: 'fontSize',
  addOptions() { return { types: ['textStyle'] }; },
  addGlobalAttributes() {
    return [{
      types: this.options.types,
      attributes: {
        fontSize: {
          default: null,
          parseHTML: (el: HTMLElement) => el.style.fontSize || null,
          renderHTML: (attrs: Record<string, string>) => {
            if (!attrs.fontSize) return {};
            return { style: `font-size: ${attrs.fontSize}` };
          },
        },
      },
    }];
  },
  addCommands() {
    return {
      setFontSize: (size: string) => ({ chain }: any) =>
        chain().setMark('textStyle', { fontSize: size }).run(),
      unsetFontSize: () => ({ chain }: any) =>
        chain().setMark('textStyle', { fontSize: null }).removeEmptyTextStyle().run(),
    } as any;
  },
});

const FONTS = [
  { label: 'Default',            value: '' },
  { label: 'Cormorant Garamond', value: '"Cormorant Garamond", serif' },
  { label: 'Playfair Display',   value: '"Playfair Display", serif' },
  { label: 'Lora',               value: '"Lora", serif' },
  { label: 'Merriweather',       value: '"Merriweather", serif' },
  { label: 'Inter',              value: 'Inter, sans-serif' },
  { label: 'Poppins',            value: '"Poppins", sans-serif' },
  { label: 'Raleway',            value: '"Raleway", sans-serif' },
  { label: 'Lato',               value: '"Lato", sans-serif' },
  { label: 'Amiri',              value: '"Amiri", serif' },
  { label: 'Monospace',          value: '"Courier New", monospace' },
];

const SIZES = ['12px','14px','16px','18px','20px','24px','28px','32px','36px','48px'];

interface Props {
  value: string;
  onChange: (html: string) => void;
}

const btnBase = 'p-1.5 rounded transition-colors hover:bg-[#FAF3E7] text-[#5C3D20] hover:text-[#3D2817]';
const btnActive = 'bg-[#C4452D]/10 text-[#C4452D]';

export function RichTextEditor({ value, onChange }: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextStyle,
      FontFamily,
      FontSize,
      Color,
      Highlight.configure({ multicolor: true }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      TiptapLink.configure({ openOnClick: false }),
    ],
    content: value,
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none min-h-[320px] px-4 py-3 focus:outline-none text-[#3D2817] leading-relaxed',
      },
    },
  });

  // Sync external value changes (e.g., edit mode load)
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value === '' ? value : null]);

  const setLink = useCallback(() => {
    if (!editor) return;
    const prev = editor.getAttributes('link').href as string | undefined;
    const url = window.prompt('URL:', prev ?? 'https://');
    if (url === null) return;
    if (url === '') { editor.chain().focus().extendMarkRange('link').unsetLink().run(); return; }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }, [editor]);

  if (!editor) return null;

  const currentFont = editor.getAttributes('textStyle').fontFamily as string ?? '';
  const currentSize = editor.getAttributes('textStyle').fontSize as string ?? '';

  return (
    <div className="border border-[#D4BC96] rounded-xl overflow-hidden bg-white">

      {/* ── Toolbar ── */}
      <div className="flex flex-wrap items-center gap-0.5 px-2 py-2 border-b border-[#E8D5B7] bg-[#FDFAF5]">

        {/* Font family */}
        <select
          value={currentFont}
          onChange={e => {
            if (e.target.value) editor.chain().focus().setFontFamily(e.target.value).run();
            else editor.chain().focus().unsetFontFamily().run();
          }}
          className="text-xs border border-[#D4BC96] rounded px-1.5 py-1 text-[#3D2817] bg-white focus:outline-none mr-1"
        >
          {FONTS.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
        </select>

        {/* Font size */}
        <select
          value={currentSize}
          onChange={e => {
            if (e.target.value) (editor.chain().focus() as any).setFontSize(e.target.value).run();
            else (editor.chain().focus() as any).unsetFontSize().run();
          }}
          className="text-xs border border-[#D4BC96] rounded px-1.5 py-1 text-[#3D2817] bg-white focus:outline-none mr-2"
        >
          <option value="">Size</option>
          {SIZES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>

        <div className="w-px h-5 bg-[#E8D5B7] mx-1" />

        {/* Headings */}
        <button type="button" title="Heading 1"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`${btnBase} ${editor.isActive('heading', { level: 1 }) ? btnActive : ''}`}>
          <Heading1 size={15} />
        </button>
        <button type="button" title="Heading 2"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`${btnBase} ${editor.isActive('heading', { level: 2 }) ? btnActive : ''}`}>
          <Heading2 size={15} />
        </button>
        <button type="button" title="Heading 3"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`${btnBase} ${editor.isActive('heading', { level: 3 }) ? btnActive : ''}`}>
          <Heading3 size={15} />
        </button>

        <div className="w-px h-5 bg-[#E8D5B7] mx-1" />

        {/* Formatting */}
        <button type="button" title="Bold"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`${btnBase} ${editor.isActive('bold') ? btnActive : ''}`}>
          <Bold size={15} />
        </button>
        <button type="button" title="Italic"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`${btnBase} ${editor.isActive('italic') ? btnActive : ''}`}>
          <Italic size={15} />
        </button>
        <button type="button" title="Underline"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`${btnBase} ${editor.isActive('underline') ? btnActive : ''}`}>
          <UnderlineIcon size={15} />
        </button>
        <button type="button" title="Strikethrough"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`${btnBase} ${editor.isActive('strike') ? btnActive : ''}`}>
          <Strikethrough size={15} />
        </button>

        <div className="w-px h-5 bg-[#E8D5B7] mx-1" />

        {/* Color */}
        <label title="Text color" className={`${btnBase} cursor-pointer flex items-center gap-0.5`}>
          <span className="text-[11px] font-bold" style={{ color: editor.getAttributes('textStyle').color ?? '#3D2817' }}>A</span>
          <input
            type="color"
            className="sr-only"
            defaultValue="#3D2817"
            onChange={e => editor.chain().focus().setColor(e.target.value).run()}
          />
        </label>
        <button type="button" title="Highlight"
          onClick={() => editor.chain().focus().toggleHighlight({ color: '#FEF08A' }).run()}
          className={`${btnBase} ${editor.isActive('highlight') ? btnActive : ''}`}>
          <Highlighter size={15} />
        </button>

        <div className="w-px h-5 bg-[#E8D5B7] mx-1" />

        {/* Alignment */}
        <button type="button" title="Align left"
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          className={`${btnBase} ${editor.isActive({ textAlign: 'left' }) ? btnActive : ''}`}>
          <AlignLeft size={15} />
        </button>
        <button type="button" title="Align center"
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          className={`${btnBase} ${editor.isActive({ textAlign: 'center' }) ? btnActive : ''}`}>
          <AlignCenter size={15} />
        </button>
        <button type="button" title="Align right"
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          className={`${btnBase} ${editor.isActive({ textAlign: 'right' }) ? btnActive : ''}`}>
          <AlignRight size={15} />
        </button>

        <div className="w-px h-5 bg-[#E8D5B7] mx-1" />

        {/* Lists */}
        <button type="button" title="Bullet list"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`${btnBase} ${editor.isActive('bulletList') ? btnActive : ''}`}>
          <List size={15} />
        </button>
        <button type="button" title="Numbered list"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`${btnBase} ${editor.isActive('orderedList') ? btnActive : ''}`}>
          <ListOrdered size={15} />
        </button>

        <div className="w-px h-5 bg-[#E8D5B7] mx-1" />

        {/* Link */}
        <button type="button" title="Insert link"
          onClick={setLink}
          className={`${btnBase} ${editor.isActive('link') ? btnActive : ''}`}>
          <LinkIcon size={15} />
        </button>

        {/* Divider */}
        <button type="button" title="Horizontal rule"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          className={btnBase}>
          <Minus size={15} />
        </button>

        <div className="w-px h-5 bg-[#E8D5B7] mx-1" />

        {/* History */}
        <button type="button" title="Undo"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className={`${btnBase} disabled:opacity-30`}>
          <Undo size={15} />
        </button>
        <button type="button" title="Redo"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className={`${btnBase} disabled:opacity-30`}>
          <Redo size={15} />
        </button>
      </div>

      {/* ── Editor area ── */}
      <EditorContent editor={editor} />

      {/* ── Word count ── */}
      <div className="px-4 py-1.5 border-t border-[#E8D5B7] bg-[#FDFAF5] text-right">
        <span className="text-[11px] text-[#8B6344]">
          {editor.storage.characterCount?.words?.() ?? editor.getText().split(/\s+/).filter(Boolean).length} words
        </span>
      </div>
    </div>
  );
}

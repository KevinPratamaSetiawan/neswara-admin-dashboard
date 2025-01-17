"use client";
import Underline from '@tiptap/extension-underline';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { fa1, fa2, fa3, faBold, faHeading, faItalic, faListDots, faListNumeric, faMinus, faParagraph, faQuoteLeft, faRedo, faStrikethrough, faUnderline, faUndo } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link'
import SearchSelect from '@/components/combobox';
import Footer from '@/components/footer';
import { fetchCategoriesPicker } from '@/utils/categoryUtilities';
import { AddNews } from '@/utils/newsUtilities';

const MenuBar = ({ editor }: { editor: any }) => {
    if (!editor) {
        return null;
    }

    const buttonClasses =
        "px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded shadow-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200";

    return (
        <div className="flex flex-wrap gap-2 p-4 bg-gray-50 border-b border-gray-200 rounded-t-md">
            <button
                className={buttonClasses}
                onClick={() => editor.chain().focus().toggleBold().run()}
            >
                <FontAwesomeIcon icon={faBold} />
            </button>
            <button
                className={buttonClasses}
                onClick={() => editor.chain().focus().toggleItalic().run()}
            >
                <FontAwesomeIcon icon={faItalic} />
            </button>
            <button
                className={buttonClasses}
                onClick={() => editor.chain().focus().toggleStrike().run()}
            >
                <FontAwesomeIcon icon={faStrikethrough} />
            </button>
            <button
                className={buttonClasses}
                onClick={() => editor.chain().focus().toggleUnderline().run()}
            >
                <FontAwesomeIcon icon={faUnderline} />
            </button>
            <button
                className={buttonClasses}
                onClick={() => editor.chain().focus().setParagraph().run()}
            >
                <FontAwesomeIcon icon={faParagraph} />
            </button>
            <button
                className={buttonClasses}
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            >
                <FontAwesomeIcon icon={faHeading} />
                <FontAwesomeIcon icon={fa1} />
            </button>
            <button
                className={buttonClasses}
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            >
                <FontAwesomeIcon icon={faHeading} />
                <FontAwesomeIcon icon={fa2} />
            </button>
            <button
                className={buttonClasses}
                onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            >
                <FontAwesomeIcon icon={faHeading} />
                <FontAwesomeIcon icon={fa3} />
            </button>
            <button
                className={buttonClasses}
                onClick={() => editor.chain().focus().toggleBulletList().run()}
            >
                <FontAwesomeIcon icon={faListDots} />
            </button>
            <button
                className={buttonClasses}
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
            >
                <FontAwesomeIcon icon={faListNumeric} />
            </button>
            <button
                className={buttonClasses}
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
            >
                <FontAwesomeIcon icon={faQuoteLeft} />
            </button>
            <button
                className={buttonClasses}
                onClick={() => editor.chain().focus().setHorizontalRule().run()}
            >
                <FontAwesomeIcon icon={faMinus} />
            </button>
            <button
                className={buttonClasses}
                onClick={() => editor.chain().focus().undo().run()}
            >
                <FontAwesomeIcon icon={faUndo} />
            </button>
            <button
                className={buttonClasses}
                onClick={() => editor.chain().focus().redo().run()}
            >
                <FontAwesomeIcon icon={faRedo} />
            </button>
        </div>
    );
};

export default function NewNews() {
    const [title, setTitle] = useState('');
    const [subTitle, setSubTitle] = useState('');
    const [category, setCategory] = useState<number>(0);
    const [categoryList, setCategoryList] = useState<{ id: number; name: string }[]>([]);
    const router = useRouter();

    const editor = useEditor({
        extensions: [StarterKit, Underline],
        content: 'Write your news here...',
        immediatelyRender: false,
    });
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        if (!editor) return;
        const content = editor.getHTML();

        setIsSaving(true);
        await AddNews(title, subTitle, category, content, router);
        setIsSaving(false);
    };

    useEffect(() => {
        fetchCategoriesPicker(setCategoryList);
    }, []);

    return (
        <>
            <div className="w-screen min-h-screen h-full flex flex-col items-center justify-center md:px-16 md:py-8">
                <div className="bg-white w-full min-h-[90vh] h-full px-10 py-8 rounded-3xl shadow-lg flex flex-col items-start gap-2">
                    <textarea
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        rows={1}
                        placeholder="News Title..."
                        className="w-full px-1 py-2 text-2xl font-bold border-b-2 border-gray-400 focus:border-b-2 focus:border-black"
                    />

                    <div className="w-full flex flex-col sm:flex-row items-center gap-4">
                        <textarea
                            value={subTitle}
                            onChange={(e) => setSubTitle(e.target.value)}
                            rows={1}
                            placeholder="SubTitle..."
                            className="w-full p-1 text-base font-light border-b-2 border-gray-400 focus:border-b-2 focus:border-black"
                        />
                        <SearchSelect
                            data={categoryList}
                            value={category}
                            onChange={setCategory}
                        />
                    </div>

                    <div className="w-full mx-auto my-2">
                        <div className="border rounded-lg shadow-sm">
                            <MenuBar editor={editor} />
                            <EditorContent
                                editor={editor}
                                className="p-4 border-t bg-white rounded-b-md"
                            />
                        </div>
                    </div>

                    <div className="w-full flex items-center justify-end gap-2 mt-auto">
                        <Link
                            href={`/news`}
                            className="inline-flex items-center rounded-md bg-gray-100 px-3 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-300"
                        >
                            Cancel
                        </Link>
                        <button
                            type="button"
                            onClick={handleSave}
                            disabled={isSaving}
                            className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                            {isSaving ? 'Saving...' : 'Save Content'}
                        </button>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}

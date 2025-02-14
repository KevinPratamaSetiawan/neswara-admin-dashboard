"use client";
import Underline from '@tiptap/extension-underline';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import clsx from 'clsx';

import { fa1, fa2, fa3, faArrowLeft, faBold, faCaretRight, faChevronDown, faHeading, faItalic, faListDots, faListNumeric, faMinus, faParagraph, faQuoteLeft, faRedo, faStrikethrough, faUnderline, faUndo } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link'
import SearchSelect from '@/components/combobox';
import { Toast } from '@/components/toastList';
import Footer from '@/components/footer';
import { Category, handleFetchCategoryList } from '@/utils/categoryUtilities';
import { Tag, handleFetchTagList } from '@/utils/tagsUtilities';
import { handleAddNews, handleFetchNewsBySlug, handleUpdateNews } from '@/utils/newsUtilities';
import Image from 'next/image';
import { Checkbox, Combobox, ComboboxButton, ComboboxInput, ComboboxOption, ComboboxOptions } from '@headlessui/react';
import { PageAccessCheck } from '@/utils/accessCheck';

const NewsImage = [
    'news-1.jpg',
    'news-2.jpg',
    'news-3.jpg',
    'news-4.jpg',
    'news-5.jpg'
]

const MenuBar = ({ editor }: { editor: any }) => {
    if (!editor) {
        return null;
    }

    const buttonClasses =
        "px-3 py-1.5 text-sm font-medium text-secondaryText dark:text-darkSecondaryText bg-card dark:bg-darkCard border border-border dark:border-darkBorder rounded shadow-sm hover:bg-backgroundHover dark:hover:bg-darkBackgroundHover button-ring button-hover";

    return (
        <div className="flex flex-wrap gap-2 p-4 bg-card dark:bg-darkCard border-b-2 border-border dark:border-darkBorder rounded-t-md">
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

export default function EditNews({ params: paramsPromise }: { params: Promise<{ slug: string }> }) {
    const [id, setId] = useState(0);
    const [title, setTitle] = useState('');
    const [subTitle, setSubTitle] = useState('');
    const [content, setContent] = useState('');
    const [image, setImage] = useState('news/news-1.jpg');
    const [category, setCategory] = useState<number>(0);
    const [categoryDatas, setCategoryDatas] = useState<Category[]>([]);
    const [tags, setTags] = useState<Tag[]>([]);
    const [tagDatas, setTagDatas] = useState<Tag[]>([]);
    const [imageQuery, setImageQuery] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const params = React.use(paramsPromise);
    const { slug } = params;
    const router = useRouter();

    const editor = useEditor({
        extensions: [StarterKit, Underline],
        content: content,
        immediatelyRender: false,
    });

    const handleTagSelection = (tag: Tag, isChecked: boolean) => {
        if (isChecked) {
            setTags((prevTags) => [...prevTags, tag]);
            setTagDatas((prevTags) => prevTags.filter((t) => t.id !== tag.id));
        } else {
            setTagDatas((prevTags) => [...prevTags, tag]);
            setTags((prevTags) => prevTags.filter((t) => t.id !== tag.id));
        }
    };

    const handleUpdate = async () => {
        if (!editor) return;
        const editorContent = editor.getHTML();

        const response = await handleUpdateNews(id, title, subTitle, editorContent, image, category, tags);

        if (response.status === 200 && response.message && response.slug) {
            Toast('success', response.message);
            router.push(`/news/view/${response.slug}`);
        } else if (response.message) {
            Toast('error', response.message);
        }
    };

    useEffect(() => {
        const loadData = async () => {
            const response = await handleFetchNewsBySlug(slug);

            if (response.status === 200 && response.data) {
                setId(response.data.id);
                setTitle(response.data.title);
                setSubTitle(response.data.sub_title);
                setImage(response.data.news_images[0].file_path);
                setCategory(response.data.category_id);
                setTags(response.data.tags);
                setContent(response.data.content);
            } else if (response.message) {
                Toast('error', response.message);
            }
        }

        const fetchCategoryList = async () => {
            const response = await handleFetchCategoryList(1, 1000, 'ASC');

            if (response.status === 200 && response.categories) {
                setCategoryDatas(response.categories);
            } else if (response.message) {
                Toast('error', response.message);
            }
        };

        const fetchTagList = async () => {
            const response = await handleFetchTagList(1, 1000, 'ASC');

            if (response.status === 200 && response.tags) {
                setTagDatas(response.tags);
            } else if (response.message) {
                Toast('error', response.message);
            }
        };

        fetchCategoryList();
        loadData();
        fetchTagList();
    }, []);

    useEffect(() => {
        if (editor && content) {
            editor.commands.setContent(content);
        }
    }, [content]);

    return (
        <>
            <PageAccessCheck permission={['news-edit', 'news-edit-all']} />
            <div className="w-full px-2 md:px-24 py-5 flex flex-col items-center gap-5 text-text dark:text-darkText">
                <div className='w-full flex flex-col items-center gap-4 bg-card dark:bg-darkCard border border-border dark:border-darkBorder rounded-xl px-2 md:px-5 py-4 shadow-lg'>
                    <div className='w-full flex items-start'>
                        <button onClick={() => setIsOpen((prev) => !prev)} type='button' className='button-hover rounded-full px-3 py-2'>
                            <FontAwesomeIcon icon={faArrowLeft} />
                        </button>
                    </div>

                    <textarea
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        rows={1}
                        placeholder="News Title..."
                        className="w-full px-1 py-2 text-2xl font-bold border-b-2 border-border dark:border-darkBorder bg-card dark:bg-darkCard"
                    />

                    <div className="w-full flex flex-col sm:flex-row items-center gap-4">
                        <textarea
                            value={subTitle}
                            onChange={(e) => setSubTitle(e.target.value)}
                            rows={1}
                            placeholder="SubTitle..."
                            className="w-full p-1 text-base font-light border-b-2 border-border dark:border-darkBorder bg-card dark:bg-darkCard"
                        />
                        <SearchSelect data={categoryDatas} value={category} onChange={setCategory} className='w-full md:max-w-[200px]' />
                    </div>

                    <div className='flex flex-col items-center gap-5'>
                        <Image src={`/news/${image}`} alt='News Thumbnail' width={800} height={400} className='rounded-lg border-2 border-border dark:border-darkBorder' />
                        <Combobox value={image} onChange={setImage} onClose={() => setImageQuery('')}>
                            <div className={`relative border border-border dark:border-darkBorder rounded-lg flex items-center w-full`}>
                                <ComboboxInput
                                    aria-label="Search"
                                    placeholder="All Category"
                                    className={clsx('w-full rounded-lg bg-card dark:bg-darkCard py-3 pr-8 pl-8 text-center text-sm text-text dark:text-darkText', 'button-ring')}
                                    value={image}
                                    onChange={(e) => setImageQuery(e.target.value)}
                                />
                                <ComboboxButton className="group absolute inset-y-0 right-0 px-2.5">
                                    <FontAwesomeIcon icon={faChevronDown} className="text-gray-500 group-hover:text-gray-700" />
                                </ComboboxButton>
                            </div>

                            <ComboboxOptions anchor="bottom" className={clsx('rounded-md border border-gray-200 bg-card dark:bg-darkCard shadow-lg p-1 empty:invisible', 'transition duration-100 ease-in')}>
                                {
                                    NewsImage.map((image, index) => (
                                        <ComboboxOption value={image} className="group flex cursor-default items-center gap-2 rounded-md py-1.5 px-3 select-none hover:bg-backgroundHover dark:hover:bg-darkBackgroundHover" key={index}>
                                            <div className="text-sm">Image {index + 1}</div>
                                        </ComboboxOption>
                                    ))
                                }
                            </ComboboxOptions>
                        </Combobox>
                    </div>

                    <div className="w-full mx-auto my-2">
                        <div className="border-2 rounded-lg shadow-sm">
                            <MenuBar editor={editor} />
                            <EditorContent
                                editor={editor}
                                className="p-4 border-t bg-card dark:bg-darkCard rounded-b-md"
                            />
                        </div>
                    </div>

                    <div className='w-full flex items-center justify-center'>
                        <details className='w-full flex flex-col items-center gap-5'>
                            <summary className='w-full list-none flex flex-col items-start gap-3'>
                                <div className='w-full flex items-center justify-between'>
                                    <div className='cursor-pointer flex items-center gap-1'>
                                        <FontAwesomeIcon icon={faCaretRight} />
                                        <p>Tags :</p>
                                    </div>
                                    <span className='px-2 py-1 rounded-md bg-primary text-darkText text-xs font-bold'>{tags.length}</span>
                                </div>
                                <ul className='w-full flex items-center gap-3 flex-wrap'>
                                    {tags.map((tag) => (
                                        <li className="px-2 py-1 rounded-md tetx-text dark:text-darkText flex items-center gap-2 bg-card dark:bg-darkCard hover:bg-backgroundHover dark:hover:bg-darkBackgroundHover border border-border dark:border-darkBorder cursor-pointer" key={tag.id}>
                                            <button type='button' onClick={() => handleTagSelection(tag, false)} className='flex items-center gap-2'>
                                                <div className='rounded-full' style={{ backgroundColor: tag.color, width: '12px', height: '12px' }}></div>
                                                {tag.name}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </summary>

                            <ul className='w-full flex items-start gap-3 flex-wrap border-t-2 border-border dark:border-darkBorder py-5'>
                                {tagDatas.map((tag) => (
                                    !tags.find(t => t.id === tag.id) ?
                                        <li className="px-2 py-1 rounded-md tetx-text dark:text-darkText flex items-center gap-2 bg-card dark:bg-darkCard hover:bg-backgroundHover dark:hover:bg-darkBackgroundHover border border-border dark:border-darkBorder cursor-pointer" key={tag.id}>
                                            <button type='button' onClick={() => handleTagSelection(tag, true)} className='flex items-center gap-2'>
                                                <div className='rounded-full' style={{ backgroundColor: tag.color, width: '12px', height: '12px' }}></div>
                                                {tag.name}
                                            </button>
                                        </li> : null
                                ))}
                            </ul>
                        </details>
                    </div>

                    <div className="w-full flex items-center justify-end gap-2 mt-auto">
                        <button
                            type='button'
                            onClick={() => setIsOpen((prev) => !prev)}
                            className="inline-flex items-center rounded-md bg-gray-100 px-3 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-300 cursor-pointer"
                        >Cancel</button>
                        <button
                            type="button"
                            onClick={handleUpdate}
                            className="inline-flex items-center rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 cursor-pointer"
                        >Save Update</button>
                    </div>
                </div>
            </div>

            {isOpen && (
                <div className="overflow-y-auto overflow-x-hidden fixed top-0 left-0 right-0 bottom-0 z-50 flex justify-center items-center w-full h-full bg-darkBackground/40 text-text dark:text-darkText">
                    <div className="relative p-4 w-full max-w-2xl max-h-full">
                        <div className="relative bg-card dark:bg-darkCard rounded-lg shadow">
                            <div className="flex items-center justify-between p-4 md:p-5 rounded-t">
                                <h3 className="text-xl font-semibold text-text dark:text-darkText">Are you sure? Your update won't be saved.</h3>
                                <button
                                    type="button"
                                    onClick={() => setIsOpen((prev) => !prev)}
                                    className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
                                >
                                    <svg
                                        className="w-3 h-3"
                                        aria-hidden="true"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 14 14"
                                    >
                                        <path
                                            stroke="currentColor"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                                        />
                                    </svg>
                                    <span className="sr-only">Close exit modal</span>
                                </button>
                            </div>
                            <div className="flex items-center justify-end p-4 md:p-5 rounded-b gap-2.5">
                                <button
                                    onClick={() => setIsOpen((prev) => !prev)}
                                    className="py-2.5 px-5 text-sm font-medium bg-card dark:bg-darkCard text-text dark:text-darkText focus:outline-none rounded-lg border border-gray-200 hover:bg-backgroundHover dark:hover:bg-darkBackgroundHover hover:text-blue-700 focus:z-10 button-hover button-ring"
                                >
                                    Cancel
                                </button>
                                <a
                                    href={`/news/view/${slug}`}
                                    className="text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                                >
                                    Yes
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <Footer />
        </>
    );
}

"use client";
import { RoleContext } from '@/provider/Provider';
import { Comment, handleAddComment, handleDeleteComment, handleEditComment, handleFetchComments } from '@/utils/newsUtilities';
import { MyAccount } from '@/utils/userUtilities';
import { faArrowDown, faChevronDown, faChevronUp, faEllipsisVertical } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Image from 'next/image';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Toast } from './toastList';

function TimeAgo(timestamp: string | Date): string {
    const now = new Date();
    const past = new Date(timestamp);
    const seconds = Math.floor((now.getTime() - past.getTime()) / 1000);

    const intervals = [
        { label: "year", seconds: 31536000 },
        { label: "month", seconds: 2592000 },
        { label: "week", seconds: 604800 },
        { label: "day", seconds: 86400 },
        { label: "hour", seconds: 3600 },
        { label: "minute", seconds: 60 },
        { label: "second", seconds: 1 }
    ];

    for (const interval of intervals) {
        const count = Math.floor(seconds / interval.seconds);
        if (count >= 1) {
            return `${count} ${interval.label}${count !== 1 ? "s" : ""} ago`;
        }
    }

    return "just now";
}

function Dropdown({ onEdit, onDelete }: { onEdit: React.Dispatch<React.SetStateAction<boolean>>, onDelete: React.Dispatch<React.SetStateAction<boolean>> }) {
    const roleContext = useContext(RoleContext);
    if (!roleContext) return null;
    const { hasPermission } = roleContext;

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative flex items-center justify-center">
            <button
                className="px-2 rounded-md button-hover"
                onClick={() => setIsMenuOpen((prev) => !prev)}
            >
                <FontAwesomeIcon icon={faEllipsisVertical} className="text-gray-600 dark:text-gray-300" />
            </button>

            {isMenuOpen && (
                <div
                    ref={menuRef}
                    className="absolute right-0 top-5 mt-2 w-40 bg-card dark:bg-darkCard shadow-lg rounded-md border border-border dark:border-darkBorder"
                >
                    <ul className="py-2 text-sm">
                        {
                            (hasPermission('comment-edit') || hasPermission('comment-edit-all')) &&
                            <li>
                                <button
                                    className="w-full text-left px-4 py-2 button-hover"
                                    onClick={() => {
                                        onEdit(true);
                                        setIsMenuOpen(false);
                                    }}
                                >
                                    Edit
                                </button>
                            </li>
                        }
                        {
                            (hasPermission('comment-delete') || hasPermission('comment-delete-all')) &&
                            <li>
                                <button
                                    className="w-full text-left px-4 py-2 button-hover text-red-600 dark:text-red-400 transition"
                                    onClick={() => {
                                        onDelete(true);
                                        setIsMenuOpen(false);
                                    }}
                                >
                                    Delete
                                </button>
                            </li>
                        }
                    </ul>
                </div>
            )}
        </div>
    );
}

export default function CommentSection({ sourceId, type }: { sourceId: number; type: string }) {
    const roleContext = useContext(RoleContext);
    if (!roleContext) return null;
    const { hasPermission } = roleContext;

    const [commentData, setCommentData] = useState<Comment[]>();
    const [currentPage, setCurrentPage] = useState(1);
    const [limitPage, setLimitPage] = useState(5);
    const [order, setOrder] = useState<string>('DESC');
    const [total, setTotal] = useState<number>(0);

    const fetchCommentList = async () => {
        const response = await handleFetchComments(type, sourceId, order, 1, currentPage * limitPage, null);

        if (response.status === 200 && response.comments && response.total) {
            setTotal(response.total);
            setCommentData(response.comments);
        }
    };

    useEffect(() => {
        fetchCommentList();
    }, [currentPage, order])

    // New
    const [parentId, setParentId] = useState<number | null>(null);
    const [commentContent, setCommentContent] = useState('');

    const addNewComment = async () => {
        const response = await handleAddComment(type, sourceId, parentId, commentContent);

        if (response.status === 200 && response.message) {
            Toast('success', response.message);
            setParentId(null);
            setCommentContent('');
            setCommentData([]);
            fetchCommentList();
        } else if (response.message) {
            Toast('error', response.message);
        }
    }

    return (
        <div className="w-full flex flex-col items-start gap-5">
            <div className='w-full flex items-center justify-between'>
                <p className='text-xl font-semibold'>{total} Comments</p>
                <button className='button-hover px-2 py-1 text-text dark:text-darkText border-2 border-border dark:border-darkBorder rounded-lg transition-colors' type='button' onClick={() => {
                    if (order === 'ASC') {
                        setOrder('DESC');
                        setCurrentPage(1);
                        setCommentData([]);
                    } else {
                        setOrder('ASC');
                        setCurrentPage(1);
                        setCommentData([]);
                    }
                }}>
                    {
                        order === 'ASC' ? 'Oldest' : 'Recent'
                    }
                </button>
            </div>
            {
                hasPermission('comment-create') &&
                <div className='w-full flex flex-col items-end gap-2 mb-4'>
                    <div className='w-full flex items-start gap-3'>
                        <Image src={`/${MyAccount('photo')}`} alt='User Profile' width={40} height={40} className='rounded-full' />
                        <div className='w-full flex flex-col items-start gap-2'>
                            <p>{MyAccount('email')}</p>
                            <textarea
                                value={commentContent}
                                onChange={(e) => setCommentContent(e.target.value)}
                                placeholder="Add a comment"
                                className="w-full px-1 border-b-2 border-border dark:border-darkBorder bg-card dark:bg-darkCard min-h-8 h-8"
                                onInput={(e) => {
                                    e.currentTarget.style.height = "auto";
                                    e.currentTarget.style.height = `${e.currentTarget.scrollHeight}px`;
                                }}
                            />
                        </div>
                    </div>
                    {
                        commentContent && hasPermission('comment-create') &&
                        <div className='flex items-center gap-2'>
                            <button type="button" className="inline-flex items-center rounded-3xl bg-gray-100 px-3 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-300 cursor-pointer" onClick={() => setCommentContent('')}>Cancel</button>
                            <button type="button" className="inline-flex items-center rounded-3xl bg-primary px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 cursor-pointer" disabled={commentContent === ''} onClick={addNewComment}>Comment</button>
                        </div>
                    }
                </div>
            }
            {
                total > 0 ?
                    commentData?.map((comment, index) => (
                        <Comment type={type} sourceId={sourceId} comment={comment} refetchComment={() => fetchCommentList()} key={index} />
                    )) :
                    <div className='mx-auto flex flex-col items-center'>
                        <p className='text-xl font-bold uppercase text-secondaryText/30 dark:text-darkSecondaryText/30'>No Comment Available</p>
                        <p className='text-sm font-bold uppercase text-secondaryText/30 dark:text-darkSecondaryText/30'>be the first to comment</p>
                    </div>
            }
            {
                total > (limitPage * currentPage) &&
                <button type="button" className='mx-auto font-semibold text-sm text-blue-400 hover:text-blue-500 flex items-center gap-1' onClick={() => setCurrentPage((prev) => prev + 1)}>
                    More Comments
                    <FontAwesomeIcon icon={faChevronDown} className='pt-1' />
                </button>
            }
        </div>
    );
}

function Comment({ type, sourceId, comment, refetchComment }: { type: string; sourceId: number; comment: Comment; refetchComment: () => void; }) {
    const roleContext = useContext(RoleContext);
    if (!roleContext) return null;
    const { hasPermission } = roleContext;

    const [subCommentData, setSubCommentData] = useState<Comment[]>();
    const [currentPage, setCurrentPage] = useState(1);
    const [limitPage, setLimitPage] = useState(5);
    const [total, setTotal] = useState<number>(0);
    const [isSubCommentOpen, setIsSubCommentOpen] = useState(false);
    const [isEditingComment, setIsEditingComment] = useState(false);
    const [commentContent, setCommentContent] = useState(comment.content);
    const [isDeletingComment, setIsDeletingComment] = useState(false);

    const fetchSubCommentList = async () => {
        const response = await handleFetchComments(type, sourceId, 'ASC', 1, currentPage * limitPage, comment.id);

        if (response.status === 200 && response.comments && response.total) {
            setTotal(response.total);
            setSubCommentData(response.comments);
        }
    };

    useEffect(() => {
        fetchSubCommentList();
    }, [currentPage])

    const editComment = async (id: number, content: string) => {
        const response = await handleEditComment(type, id, content);

        if (response.status === 200 && response.message) {
            Toast('success', response.message);
            refetchComment();
            fetchSubCommentList();
        } else if (response.message) {
            Toast('error', response.message);
        }
    };

    const onEdit = () => {
        editComment(comment.id, commentContent);
        setIsEditingComment(false);
    }

    const deleteComment = async (id: number) => {
        const response = await handleDeleteComment(type, id);

        if (response.status === 200 && response.message) {
            Toast('success', response.message);
            refetchComment();
            fetchSubCommentList();
        } else if (response.message) {
            Toast('error', response.message);
        }
    };

    const onDelete = () => {
        deleteComment(comment.id);
        setIsDeletingComment(false);
    }

    //Sub Comment
    const [isWantReply, setIsWantReply] = useState(false);
    const [subCommentContent, setSubCommentContent] = useState('');

    const addNewSubComment = async () => {
        const response = await handleAddComment(type, sourceId, comment.id, subCommentContent);

        if (response.status === 200 && response.message) {
            Toast('success', response.message);
            setSubCommentContent('');
            setIsWantReply(false);
            setSubCommentData([]);
            fetchSubCommentList();
        } else if (response.message) {
            Toast('error', response.message);
        }
    }

    return (
        <>
            <div className="w-full flex flex-col items-start">
                <div className='w-full flex items-start gap-5'>
                    <Image src={`/${comment.photo}`} alt='User Profile' width={40} height={40} className='rounded-full' />
                    <div className='w-full flex flex-col items-start'>
                        <div className='w-full flex items-center justify-between font-semibold text-sm'>
                            <div className='flex items-center gap-2'>
                                <p>@{comment.email} • <span className='text-sm text-secondaryText/50 dark:text-darkSecondaryText'>{TimeAgo(comment.created_at)}</span></p>
                                {
                                    comment.updated_at !== null ?
                                        <span className='text-sm text-secondaryText/50 dark:text-darkSecondaryText'>{'(edited)'}</span> : null
                                }
                            </div>
                            <div>
                                {(hasPermission('comment-edit') || hasPermission('comment-edit-all') || hasPermission('comment-delete') || hasPermission('comment-delete-all')) && comment.user_id === MyAccount('id') &&
                                    <Dropdown onEdit={setIsEditingComment} onDelete={setIsDeletingComment} />
                                }
                            </div>
                        </div>
                        <div className='w-full'>
                            {
                                (hasPermission('comment-edit') || hasPermission('comment-edit-all')) && isEditingComment ?
                                    <div className='w-full flex flex-col items-end gap-2'>
                                        <textarea
                                            value={commentContent}
                                            onChange={(e) => setCommentContent(e.target.value)}
                                            placeholder={comment.content}
                                            className="w-full px-1 border-b-2 border-border dark:border-darkBorder bg-card dark:bg-darkCard min-h-8"
                                            onInput={(e) => {
                                                e.currentTarget.style.height = "auto";
                                                e.currentTarget.style.height = `${e.currentTarget.scrollHeight}px`;
                                            }}
                                        />
                                        {
                                            commentContent &&
                                            <div className='flex items-center gap-2'>
                                                <button type="button" className="inline-flex items-center rounded-3xl bg-gray-100 px-2 py-1 text-xs font-semibold text-gray-700 shadow-sm hover:bg-gray-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-300 cursor-pointer" onClick={() => { setCommentContent(comment.content); setIsEditingComment(false); }}>Cancel</button>
                                                <button type="button" className="inline-flex items-center rounded-3xl bg-primary px-2 py-1 text-xs font-semibold text-white shadow-sm hover:bg-primary/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 cursor-pointer" disabled={commentContent === ''} onClick={() => onEdit()}>Update</button>
                                            </div>
                                        }
                                    </div>
                                    :
                                    <p>{comment.content}</p>
                            }
                        </div>
                        {hasPermission('comment-create') &&
                            <>
                                <button type="button" className='ml-auto font-medium text-sm button-hover px-2 py-1 rounded-full' onClick={() => setIsWantReply(true)}>Reply</button>
                                {
                                    isWantReply && <div className='w-full flex flex-col items-end gap-2 mb-4'>
                                        <div className='w-full flex items-start gap-3'>
                                            <Image src={`/${MyAccount('photo')}`} alt='User Profile' width={20} height={20} className='rounded-full' />
                                            <div className='w-full flex flex-col items-start gap-2'>
                                                <textarea
                                                    value={subCommentContent}
                                                    onChange={(e) => setSubCommentContent(e.target.value)}
                                                    placeholder="Add a comment"
                                                    className="w-full px-1 border-b-2 border-border dark:border-darkBorder bg-card dark:bg-darkCard min-h-8 h-8"
                                                    onInput={(e) => {
                                                        e.currentTarget.style.height = "auto";
                                                        e.currentTarget.style.height = `${e.currentTarget.scrollHeight}px`;
                                                    }}
                                                />
                                            </div>
                                        </div>
                                        {
                                            subCommentContent &&
                                            <div className='flex items-center gap-1'>
                                                <button type="button" className="inline-flex items-center rounded-3xl bg-gray-100 px-2 py-1 text-xs font-semibold text-gray-700 shadow-sm hover:bg-gray-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-300 cursor-pointer" onClick={() => { setSubCommentContent(''); setIsWantReply(false); }}>Cancel</button>
                                                <button type="button" className="inline-flex items-center rounded-3xl bg-primary px-2 py-1 text-xs font-semibold text-white shadow-sm hover:bg-primary/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 cursor-pointer" disabled={subCommentContent === ''} onClick={addNewSubComment}>Reply</button>
                                            </div>
                                        }
                                    </div>
                                }
                            </>
                        }
                        <div className='w-full flex flex-col items-start gap-5'>
                            {
                                total > 0 &&
                                <button type="button" className='font-semibold text-sm text-blue-400 hover:text-blue-500 flex items-center gap-1' onClick={() => setIsSubCommentOpen((prev) => !prev)}>
                                    <FontAwesomeIcon icon={isSubCommentOpen ? faChevronUp : faChevronDown} className='pt-1' />
                                    {total} Replies
                                </button>
                            }
                            {
                                isSubCommentOpen && <>
                                    {
                                        subCommentData?.map((subComment, index) => (
                                            <SubComment
                                                key={index}
                                                subComment={subComment}
                                                editComment={editComment}
                                                deleteComment={deleteComment}
                                            />
                                        ))
                                    }
                                    {
                                        total > (limitPage * currentPage) &&
                                        <button type="button" className='font-semibold text-sm text-blue-400 hover:text-blue-500 flex items-center gap-1' onClick={() => setCurrentPage((prev) => prev + 1)}>
                                            <FontAwesomeIcon icon={faArrowDown} className='pt-1' />
                                            More Replies
                                        </button>
                                    }
                                </>
                            }
                        </div>
                    </div>
                </div>
            </div>

            {isDeletingComment && (hasPermission('comment-delete') || hasPermission('comment-delete-all')) && (
                <div className="overflow-y-auto overflow-x-hidden fixed top-0 left-0 right-0 bottom-0 z-50 flex justify-center items-center w-full h-full bg-darkBackground/40 text-text dark:text-darkText">
                    <div className="relative p-4 w-full max-w-2xl max-h-full">
                        <div className="relative bg-card dark:bg-darkCard rounded-lg shadow">
                            <div className="flex items-center justify-between p-4 md:p-5 rounded-t">
                                <h3 className="text-xl font-semibold text-text dark:text-darkText">Are you sure you want to delete this comment?</h3>
                                <button
                                    type="button"
                                    onClick={() => setIsDeletingComment((prev) => !prev)}
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
                                    onClick={() => setIsDeletingComment((prev) => !prev)}
                                    className="py-2.5 px-5 text-sm font-medium bg-card dark:bg-darkCard text-text dark:text-darkText focus:outline-none rounded-lg border border-gray-200 hover:bg-backgroundHover dark:hover:bg-darkBackgroundHover hover:text-blue-700 focus:z-10 button-hover button-ring"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={onDelete}
                                    type='button'
                                    className="text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

function SubComment({ subComment, editComment, deleteComment }: { subComment: Comment; editComment: (id: number, content: string) => void; deleteComment: (id: number) => void; }) {
    const roleContext = useContext(RoleContext);
    if (!roleContext) return null;
    const { hasPermission } = roleContext;

    const [subCommentContent, setSubCommentContent] = useState(subComment.content);
    const [isEditingSubComment, setIsEditingSubComment] = useState(false);
    const [isDeletingSubComment, setIsDeletingSubComment] = useState(false);

    const onEdit = () => {
        editComment(subComment.id, subCommentContent);
        setIsEditingSubComment(false);
    }

    const onDelete = () => {
        deleteComment(subComment.id);
        setIsDeletingSubComment(false);
    }

    return (
        <>
            <div className='w-full flex items-start gap-3'>
                <Image src={`/${subComment.photo}`} alt='User Profile' width={25} height={25} className='rounded-full' />
                <div className='w-full flex flex-col items-start'>
                    <div className='w-full flex items-center justify-between'>
                        <div className='flex items-center gap-2 font-semibold text-sm'>
                            <p>@{subComment.email} • <span className='text-sm text-secondaryText/50 dark:text-darkSecondaryText'>{TimeAgo(subComment.created_at)}</span></p>
                            {
                                subComment.updated_at !== null ?
                                    <span className='text-sm text-secondaryText/50 dark:text-darkSecondaryText'>{'(edited)'}</span> : null
                            }
                        </div>
                        <div>
                            {(hasPermission('comment-edit') || hasPermission('comment-edit-all') || hasPermission('comment-delete') || hasPermission('comment-delete-all')) && subComment.user_id === MyAccount('id') &&
                                <Dropdown onEdit={setIsEditingSubComment} onDelete={setIsDeletingSubComment} />
                            }
                        </div>
                    </div>
                    {
                        (hasPermission('comment-edit') || hasPermission('comment-edit-all')) && isEditingSubComment ?
                            <div className='w-full flex flex-col items-end gap-2'>
                                <textarea
                                    value={subCommentContent}
                                    onChange={(e) => setSubCommentContent(e.target.value)}
                                    placeholder={subComment.content}
                                    className="w-full px-1 border-b-2 border-border dark:border-darkBorder bg-card dark:bg-darkCard min-h-8"
                                    onInput={(e) => {
                                        e.currentTarget.style.height = "auto";
                                        e.currentTarget.style.height = `${e.currentTarget.scrollHeight}px`;
                                    }}
                                />
                                {
                                    subCommentContent &&
                                    <div className='flex items-center gap-2'>
                                        <button type="button" className="inline-flex items-center rounded-3xl bg-gray-100 px-2 py-1 text-xs font-semibold text-gray-700 shadow-sm hover:bg-gray-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-300 cursor-pointer" onClick={() => { setSubCommentContent(subComment.content); setIsEditingSubComment(false) }}>Cancel</button>
                                        <button type="button" className="inline-flex items-center rounded-3xl bg-primary px-2 py-1 text-xs font-semibold text-white shadow-sm hover:bg-primary/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 cursor-pointer" onClick={onEdit}>Update</button>
                                    </div>
                                }
                            </div>
                            :
                            <p>{subComment.content}</p>
                    }
                </div>
            </div>

            {isDeletingSubComment && (hasPermission('comment-delete') || hasPermission('comment-delete-all')) && (
                <div className="overflow-y-auto overflow-x-hidden fixed top-0 left-0 right-0 bottom-0 z-50 flex justify-center items-center w-full h-full bg-darkBackground/40 text-text dark:text-darkText">
                    <div className="relative p-4 w-full max-w-2xl max-h-full">
                        <div className="relative bg-card dark:bg-darkCard rounded-lg shadow">
                            <div className="flex items-center justify-between p-4 md:p-5 rounded-t">
                                <h3 className="text-xl font-semibold text-text dark:text-darkText">Are you sure you want to delete this comment?</h3>
                                <button
                                    type="button"
                                    onClick={() => setIsDeletingSubComment((prev) => !prev)}
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
                                    onClick={() => setIsDeletingSubComment((prev) => !prev)}
                                    className="py-2.5 px-5 text-sm font-medium bg-card dark:bg-darkCard text-text dark:text-darkText focus:outline-none rounded-lg border border-gray-200 hover:bg-backgroundHover dark:hover:bg-darkBackgroundHover hover:text-blue-700 focus:z-10 button-hover button-ring"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={onDelete}
                                    type='button'
                                    className="text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
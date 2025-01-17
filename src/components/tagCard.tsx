"use client";

import axios from 'axios';
import Link from 'next/link'
import { faEllipsisV, faPenToSquare, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { useEffect, useState } from 'react';
import { deleteTag } from '@/utils/tagsUtilities';

type TagProp = {
    id: number;
    name: string;
    slug: string;
    description: string;
    color: string;
    created_at: string;
    updated_at: string;
};

type TagCardProps = {
    tag: TagProp;
    reFetchData: () => void;
};

export default function TagCard({ tag, reFetchData }: TagCardProps) {
    const [isOpen, setIsOpen] = useState(false);

    const toggleDeleteModal = () => {
        setIsOpen(!isOpen);
    }

    const HandleDeleteTag = async (tagId: number) => {
        setIsOpen(!isOpen);

        deleteTag(tagId, reFetchData);
    }

    return (
        <div
            className="flex items-center gap-4 p-4 border rounded-lg bg-white shadow-md hover:shadow-lg transition-shadow"
        >
            <div className="flex-shrink-0">
                <div className={`w-[20px] h-[20px] rounded-full`} style={{ backgroundColor: tag.color }}></div>
            </div>

            <div className="flex-grow">
                <p className="text-lg font-semibold text-gray-800 truncate">{tag.name}</p>
                <p className="text-sm text-gray-600">{tag.description}</p>
            </div>

            <Menu as="div" className="relative inline-block text-left ms-auto">
                <div>
                    <MenuButton className="inline-flex items-center justify-center gap-x-1.5 rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200">
                        <FontAwesomeIcon icon={faEllipsisV} />
                    </MenuButton>
                </div>
                <MenuItems
                    transition
                    className="absolute right-0 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none z-20"
                >
                    <MenuItem>
                        <Link
                            href={`tags/${tag.slug}/edit`}
                            className="flex items-center gap-2 w-full px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-blue-500"
                            type="button"
                        >
                            <FontAwesomeIcon icon={faPenToSquare} />
                            <p>Edit</p>
                        </Link>
                    </MenuItem>
                    <MenuItem>
                        <button
                            onClick={toggleDeleteModal}
                            className="flex items-center gap-2 w-full px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-red-500"
                            type="button"
                        >
                            <FontAwesomeIcon icon={faTrashCan} />
                            <p>Delete</p>
                        </button>
                    </MenuItem>
                </MenuItems>
            </Menu>

            {
                isOpen && (
                    <div className="overflow-y-auto overflow-x-hidden fixed top-0 left-0 right-0 bottom-0 z-50 flex justify-center items-center w-full h-full bg-black/10">
                        <div className="relative p-4 w-full max-w-2xl max-h-full">
                            <div className="relative bg-white rounded-lg shadow">
                                <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t">
                                    <h3 className="text-xl font-semibold text-gray-900">Are you sure you want to delete this tag?</h3>
                                    <button type="button" onClick={toggleDeleteModal} className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center">
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
                                        <span className="sr-only">Close delete modal</span>
                                    </button>
                                </div>
                                <div className="flex items-center justify-end p-4 md:p-5 rounded-b gap-2.5">
                                    <button onClick={toggleDeleteModal} className="py-2.5 px-5 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100">Cancel</button>
                                    <button onClick={() => HandleDeleteTag(tag.id)} className="text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">Yes</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
        </div>
    );
}

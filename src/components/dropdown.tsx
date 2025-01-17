import { faEllipsisV, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';

import { useState } from 'react';

type DropdownProps = {
    onDelete: () => Promise<void>;
}

export default function Dropdown({ onDelete }: DropdownProps) {
    const [isOpen, setIsOpen] = useState(false);

    const toggleDeleteModal = () => {
        setIsOpen(!isOpen);
    }

    const DeleteNews = () => {
        setIsOpen(!isOpen);
        onDelete();
    }

    return (
        <>
            <Menu as="div" className="relative inline-block text-left" >
                <div>
                    <MenuButton className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 hover:shadow-sm hover:ring-1 hover:ring-inset hover:ring-gray-300 hover:bg-gray-50">
                        <FontAwesomeIcon icon={faEllipsisV} />
                    </MenuButton>
                </div>

                <MenuItems transition className="absolute right-0 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none z-20">
                    <MenuItem>
                        <button onClick={toggleDeleteModal} className={`flex items-center gap-2 w-full px-4 py-2 text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-red-500 data-[focus]:outline-none`} type="button">
                            <FontAwesomeIcon icon={faTrashCan} />
                            <p>Delete</p>
                        </button>
                    </MenuItem>
                </MenuItems>
            </Menu >

            {
                isOpen && (
                    <div className="overflow-y-auto overflow-x-hidden fixed top-0 left-0 right-0 bottom-0 z-50 flex justify-center items-center w-full h-full bg-black/40">
                        <div className="relative p-4 w-full max-w-2xl max-h-full">
                            <div className="relative bg-white rounded-lg shadow">
                                <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t">
                                    <h3 className="text-xl font-semibold text-gray-900">Are you sure you want to delete this news?</h3>
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
                                    <button onClick={DeleteNews} className="text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">Yes</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
        </>
    )
}
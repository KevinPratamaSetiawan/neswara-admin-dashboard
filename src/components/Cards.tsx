"use client";

import { Category, CategoryIcon, IconName, handleDeleteCategory, handleUpdateCategory } from '@/utils/categoryUtilities';
import { News, getStatusColor } from '@/utils/newsUtilities';
import { Permission, Role, handleDeleteRole, handleFetchRoleBySearch, handleUpdateRole } from '@/utils/roleUtilities';
import { Tag, handleDeleteTag, handleUpdateTag } from "@/utils/tagsUtilities";
import { MyAccount, User, handleEditUserRole } from '@/utils/userUtilities';
import { Video } from '@/utils/videoUtilities';
import { faPen, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useContext, useEffect, useState } from "react";
import Modal from "./Modal";
import { Toast } from "./toastList";
import { UserRoleModal } from './StatusModal';
import { RoleContext } from '@/provider/Provider';

export function NewsCard({ news }: { news: News }) {
    const router = useRouter();

    const [isHovered, setIsHovered] = useState(false);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    const handleMouseEnter = () => {
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
    };

    const handleMouseMove = (event: React.MouseEvent<HTMLTableRowElement>) => {
        const rect = event.currentTarget.getBoundingClientRect();
        setMousePosition({
            x: event.clientX - rect.left,
            y: event.clientY - rect.top,
        });
    };

    return (
        <tr
            key={news.id}
            className="text-text dark:text-darkText border-b border-border dark:border-darkBorder hover:bg-backgroundHover dark:hover:bg-darkBackgroundHover transition-colors relative cursor-pointer"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onMouseMove={handleMouseMove}
            onClick={() => router.push(`/news/view/${news.slug}`)}
        >
            <td className="px-3 py-1">
                <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(news.status)}`}
                >
                    {news.status[0].toUpperCase() + news.status.slice(1)}
                </span>
            </td>
            <td className="px-3 py-1 w-full md:w-[60%] max-w-[200px] sm:max-w-[300px] md:max-w-[420px] text-nowrap overflow-hidden text-ellipsis">{news.title}</td>
            <td className="px-3 py-1 hidden lg:table-cell">
                <div className='flex items-center gap-2'>
                    <p className="w-4">{CategoryIcon(news.category_icon)}</p>
                    <p>{news.category_name}</p>
                </div>
            </td>
            <td className="px-3 py-1 hidden xl:table-cell">
                <div className='flex items-center gap-1'>
                    <img src={news.user_photo} alt="User Profile" className="rounded-full w-5" />
                    <p className='text-nowrap'>{news.user_name}</p>
                </div>
            </td>
            {isHovered && (
                <td
                    className="absolute bg-card dark:bg-darkCard border-2 border-border dark:border-darkBorder shadow-lg rounded-md z-10"
                    style={{
                        top: mousePosition.y,
                        left: mousePosition.x,
                    }}
                >
                    <Image src={`/${news.news_images[0].file_path}`} alt="News Thumbnail" width={300} height={250} />
                </td>
            )}
        </tr>
    );
};

export function VideoCard({ video }: { video: Video }) {
    const router = useRouter();

    const [isHovered, setIsHovered] = useState(false);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    const handleMouseEnter = () => {
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
    };

    const handleMouseMove = (event: React.MouseEvent<HTMLTableRowElement>) => {
        const rect = event.currentTarget.getBoundingClientRect();
        setMousePosition({
            x: event.clientX - rect.left,
            y: event.clientY - rect.top,
        });
    };

    return (
        <tr
            key={video.id}
            className="text-text dark:text-darkText border-b border-border dark:border-darkBorder hover:bg-backgroundHover dark:hover:bg-darkBackgroundHover transition-colors relative cursor-pointer"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onMouseMove={handleMouseMove}
            onClick={() => router.push(`/videos/view/${video.slug}`)}
        >
            <td className="px-3 py-1">
                <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(video.status)}`}
                >
                    {video.status[0].toUpperCase() + video.status.slice(1)}
                </span>
            </td>
            <td className="px-3 py-1 w-full md:w-[60%] max-w-[200px] sm:max-w-[300px] md:max-w-[420px] text-nowrap overflow-hidden text-ellipsis">{video.title}</td>
            <td className="px-3 py-1 hidden lg:table-cell">
                <div className='flex items-center gap-2'>
                    <p className="w-4">{CategoryIcon(video.category_icon)}</p>
                    <p>{video.category_name}</p>
                </div>
            </td>
            <td className="px-3 py-1 hidden xl:table-cell">
                <div className='flex items-center gap-1'>
                    <img src={video.user_photo} alt="User Profile" className="rounded-full w-5" />
                    <p className='text-nowrap'>{video.username}</p>
                </div>
            </td>
            {isHovered && (
                <td
                    className="absolute bg-card dark:bg-darkCard border-2 border-border dark:border-darkBorder shadow-lg rounded-md z-10"
                    style={{
                        top: mousePosition.y,
                        left: mousePosition.x,
                    }}
                >
                    <Image src={`https://img.youtube.com/vi/${video.content_id}/maxresdefault.jpg`} alt="Video Thumbnail" width={300} height={250} />
                </td>
            )}
        </tr>
    );
};

export function CategoryCard({ category, refetch }: { category: Category; refetch: () => void; }) {
    const roleContext = useContext(RoleContext);
    if (!roleContext) return null;
    const { hasPermission } = roleContext;

    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [categoryIcon, setCategoryIcon] = useState(category.icon);
    const [categoryName, setCategoryName] = useState(category.name);
    const [categoryDesc, setCategoryDesc] = useState(category.description);

    useEffect(() => {
        setCategoryIcon(category.icon);
        setCategoryName(category.name);
        setCategoryDesc(category.description);
    }, [category]);

    const EditCategory = async () => {
        const response = await handleUpdateCategory(category.id, categoryName, categoryIcon, categoryDesc);

        if (response.status === 200 && response.message) {
            Toast('success', response.message);
            setIsDetailOpen(false);
            refetch();
        } else if (response.message) {
            Toast('error', response.message);
        }
    };

    const DeleteCategory = async () => {
        const response = await handleDeleteCategory(category.id);

        if (response.status === 200 && response.message) {
            Toast('success', response.message);
            setIsDetailOpen(false);
            setIsDeleteOpen(false);
            refetch();
        } else if (response.message) {
            Toast('error', response.message);
        }
    };

    return (
        <>
            <div
                key={category.id}
                className="table-row text-text dark:text-darkText border-b border-border dark:border-darkBorder hover:bg-backgroundHover dark:hover:bg-darkBackgroundHover transition-colors relative cursor-pointer"
                onClick={() => setIsDetailOpen(true)}
            >
                <div className="table-cell w-fit align-middle text-center">
                    <p className="w-5 mx-auto my-auto">{CategoryIcon(category.icon)}</p>
                </div>
                <div className="table-cell w-full px-3 py-1">
                    <div className="flex flex-col items-start">
                        <p>{category.name}</p>
                        <p>{category.description}</p>
                    </div>
                </div>
            </div>

            {isDetailOpen && (
                <Modal title="Detail" useButton={false} onClose={() => setIsDetailOpen(false)}>
                    <div className="w-full flex flex-col md:flex-row items-bottom gap-5">
                        <div className="w-full md:w-1/4 flex flex-col items-center justify-center gap-5">
                            <div className="w-20">{CategoryIcon(categoryIcon)}</div>
                            {hasPermission('category-edit') ?
                                <select
                                    value={categoryIcon}
                                    onChange={(e) => setCategoryIcon(e.target.value)}
                                    className="text-center bg-card dark:bg-darkCard border-b-2 border-text dark:border-darkText py-2"
                                >
                                    {IconName.map((icon, index) => (
                                        <option value={icon} key={index}>
                                            {icon}
                                        </option>
                                    ))}
                                </select> :
                                categoryIcon
                            }
                        </div>
                        <div className="w-full md:w-3/4 flex flex-col items-start gap-3">
                            <div className="w-full">
                                <p className="font-bold">Name</p>
                                {hasPermission('category-edit') ?
                                    <input
                                        type="text"
                                        placeholder="Name..."
                                        value={categoryName}
                                        onChange={(e) => setCategoryName(e.target.value)}
                                        className="w-full bg-card dark:bg-darkCard p-2"
                                    /> : categoryName
                                }
                            </div>
                            <div className="w-full">
                                <p className="font-bold">Description</p>
                                {hasPermission('category-edit') ?
                                    <textarea
                                        placeholder="Description..."
                                        value={categoryDesc}
                                        onChange={(e) => setCategoryDesc(e.target.value)}
                                        className="w-full p-2 text-base font-light bg-card dark:bg-darkCard"
                                    /> : categoryDesc
                                }
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center justify-end p-4 md:p-5 rounded-b gap-2.5">
                        {hasPermission('category-edit') && <button onClick={EditCategory} type="button" className="inline-flex items-center rounded-md bg-green-500 px-3 py-2 text-sm font-semibold text-darkText shadow-sm hover:bg-green-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-300 cursor-pointer" disabled={category.name === categoryName && category.icon === categoryIcon && category.description === categoryDesc}><FontAwesomeIcon icon={faPen} /></button>}
                        {hasPermission('category-delete') && <button onClick={() => setIsDeleteOpen(true)} type="button" className="inline-flex items-center rounded-md bg-red-500 px-3 py-2 text-sm font-semibold text-darkText shadow-sm hover:bg-red-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-300 cursor-pointer"><FontAwesomeIcon icon={faTrashCan} /></button>}
                    </div>
                </Modal>
            )}

            {isDeleteOpen && hasPermission('category-delete') && (
                <Modal
                    title="Are you sure you want to delete this category ?"
                    useButton={true}
                    onClose={() => setIsDeleteOpen(false)}
                    handleModal={() => DeleteCategory()}
                    buttonText="Delete"
                    isGreen={false}
                ></Modal>
            )}
        </>
    );
};

export function TagCard({ tag, refetch }: { tag: Tag; refetch: () => void }) {
    const roleContext = useContext(RoleContext);
    if (!roleContext) return null;
    const { hasPermission } = roleContext;

    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [tagColor, setTagColor] = useState(tag.color);
    const [tagName, setTagName] = useState(tag.name);
    const [tagDesc, setTagDesc] = useState(tag.description);

    useEffect(() => {
        setTagColor(tag.color);
        setTagName(tag.name);
        setTagDesc(tag.description);
    }, [tag]);

    const EditTag = async () => {
        const response = await handleUpdateTag(tag.id, tagName, tagColor, tagDesc);

        if (response.status === 200 && response.message) {
            Toast('success', response.message);
            setIsDetailOpen(false);
            refetch();
        } else if (response.message) {
            Toast('error', response.message);
        }
    };

    const DeleteTag = async () => {
        const response = await handleDeleteTag(tag.id);

        if (response.status === 200 && response.message) {
            Toast('success', response.message);
            setIsDetailOpen(false);
            setIsDeleteOpen(false);
            refetch();
        } else if (response.message) {
            Toast('error', response.message);
        }
    };

    return (
        <>
            <div
                key={tag.id}
                className="table-row text-text dark:text-darkText border-b border-border dark:border-darkBorder hover:bg-backgroundHover dark:hover:bg-darkBackgroundHover transition-colors relative cursor-pointer"
                onClick={() => setIsDetailOpen(true)}
            >
                <div className="table-cell w-fit align-middle text-center">
                    <p className='rounded-full border m-auto' style={{ backgroundColor: tag.color, width: '24px', height: '24px' }}></p>
                </div>
                <div className="table-cell w-full px-3 py-1">
                    <div className="flex flex-col items-start">
                        <p>{tag.name}</p>
                        <p>{tag.description}</p>
                    </div>
                </div>
            </div>

            {isDetailOpen && (
                <Modal title="Detail" useButton={false} onClose={() => setIsDetailOpen(false)}>
                    <div className="w-full flex flex-col md:flex-row items-bottom gap-5">
                        <div className="w-full md:w-1/4 flex flex-col items-center justify-center gap-5">
                            {hasPermission('tag-edit') ?
                                <input type="color" value={tagColor} onChange={(e) => setTagColor(e.target.value)} className='w-20 h-20 border-0 cursor-pointer shadow-sm appearance-none' /> :
                                <div className='w-20 h-20 border-0 rounded-full shadow-sm appearance-none' style={{ backgroundColor: tagColor }}></div>
                            }
                            {hasPermission('tag-edit') ?
                                <input
                                    type="text"
                                    placeholder='Hex Color...'
                                    value={tagColor}
                                    onChange={(e) => setTagColor(e.target.value)}
                                    className='w-full bg-card dark:bg-darkCard border-b-2 border-text text-center dark:border-darkText p-2'
                                /> : tagColor
                            }
                        </div>
                        <div className="w-full md:w-3/4 flex flex-col items-start gap-3">
                            <div className="w-full">
                                <p className="font-bold">Name</p>
                                {hasPermission('tag-edit') ?
                                    <input
                                        type="text"
                                        placeholder="Name..."
                                        value={tagName}
                                        onChange={(e) => setTagName(e.target.value)}
                                        className="w-full bg-card dark:bg-darkCard p-2"
                                    /> : tagName
                                }
                            </div>
                            <div className="w-full">
                                <p className="font-bold">Description</p>
                                {hasPermission('tag-edit') ?
                                    <textarea
                                        placeholder="Description..."
                                        value={tagDesc}
                                        onChange={(e) => setTagDesc(e.target.value)}
                                        className="w-full p-2 text-base font-light bg-card dark:bg-darkCard"
                                    /> : tagDesc
                                }
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center justify-end p-4 md:p-5 rounded-b gap-2.5">
                        {hasPermission('tag-edit') && <button onClick={EditTag} type="button" className="inline-flex items-center rounded-md bg-green-500 px-3 py-2 text-sm font-semibold text-darkText shadow-sm hover:bg-green-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-300 cursor-pointer" disabled={tag.name === tagName && tag.color === tagColor && tag.description === tagDesc}><FontAwesomeIcon icon={faPen} /></button>}
                        {hasPermission('tag-delete') && <button onClick={() => setIsDeleteOpen(true)} type="button" className="inline-flex items-center rounded-md bg-red-500 px-3 py-2 text-sm font-semibold text-darkText shadow-sm hover:bg-red-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-300 cursor-pointer"><FontAwesomeIcon icon={faTrashCan} /></button>}
                    </div>
                </Modal>
            )}

            {isDeleteOpen && hasPermission('tag-delete') && (
                <Modal
                    title="Are you sure you want to delete this tag ?"
                    useButton={true}
                    onClose={() => setIsDeleteOpen(false)}
                    handleModal={() => DeleteTag()}
                    buttonText="Delete"
                    isGreen={false}
                ></Modal>
            )}
        </>
    );
};

export function RoleCard({ role, permission, refetch }: { role: Role; permission: Permission[]; refetch: () => void; }) {
    const roleContext = useContext(RoleContext);
    if (!roleContext) return null;
    const { hasPermission } = roleContext;

    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [roleName, setRoleName] = useState(role.name);
    const [permissions, setPermissions] = useState(role.permissions);
    const [permissionList, setPermissionList] = useState(permission);
    const displayLimit = 13;

    const handlePermissionSelection = (perm: Permission, isChecked: boolean) => {
        if (isChecked) {
            setPermissions((prev) => [...prev, perm]);
            setPermissionList((prev) => prev.filter((p) => p.id !== perm.id));
        } else {
            setPermissionList((prev) => prev.filter((p) => p.id !== perm.id));
            setPermissionList((prev) => [...prev, perm]);
            setPermissions((prev) => prev.filter((p) => p.id !== perm.id));
        }
    };

    useEffect(() => {
        setRoleName(role.name);
        setPermissions(role.permissions);
    }, [role]);

    useEffect(() => {
        setPermissions(role.permissions);
        setPermissionList(permission);
    }, [isDetailOpen]);

    const EditRole = async () => {
        const response = await handleUpdateRole(role.id, roleName, permissions);

        if (response.status === 200 && response.message) {
            Toast('success', response.message);
            setIsDetailOpen(false);
            refetch();
            setRoleName('');
            setPermissions([]);
        } else if (response.message) {
            Toast('error', response.message);
        }
    };

    const DeleteRole = async () => {
        const response = await handleDeleteRole(role.id);

        if (response.status === 200 && response.message) {
            Toast('success', response.message);
            setIsDetailOpen(false);
            setIsDeleteOpen(false);
            refetch();
            setRoleName('');
            setPermissions([]);
        } else if (response.message) {
            Toast('error', response.message);
        }
    };

    return (
        <>
            <div
                key={role.id}
                className="table-row text-text dark:text-darkText border-b border-border dark:border-darkBorder hover:bg-backgroundHover dark:hover:bg-darkBackgroundHover transition-colors relative cursor-pointer"
                onClick={() => setIsDetailOpen(true)}
            >
                <div className="table-cell px-3">{role.name}</div>
                <div className="table-cell py-1 px-3">
                    <ul className='w-full flex items-center gap-2 flex-wrap'>
                        {
                            role.permissions.map((perm, index) => (
                                index < displayLimit &&
                                <li key={index} className='bg-backgroundHover dark:bg-darkBackgroundHover px-2 py-1 rounded-md text-xs font-mono'>{perm.name}</li>
                            ))
                        }

                        {
                            role.permissions.length > displayLimit ?
                                <li className='bg-backgroundHover dark:bg-darkBackgroundHover px-2 py-1 rounded-md text-xs font-mono'>+{role.permissions.length - displayLimit}</li>
                                : null
                        }
                    </ul>
                </div>
            </div>

            {isDetailOpen && (
                <Modal title="Detail" useButton={false} onClose={() => setIsDetailOpen(false)}>
                    <div className="w-full flex flex-col items-center gap-5">
                        <div className="w-full md:w-3/4 flex flex-col items-start gap-3">
                            <div className="w-full">
                                <p className="font-bold">Name</p>
                                {
                                    hasPermission('role-edit') ?
                                        <input
                                            type="text"
                                            placeholder="Name..."
                                            value={roleName}
                                            onChange={(e) => setRoleName(e.target.value)}
                                            className="w-full bg-card dark:bg-darkCard p-2"
                                        /> :
                                        <p className="w-full bg-card dark:bg-darkCard p-2">{roleName}</p>
                                }
                            </div>
                            <div className="w-full flex flex-col gap-3">
                                <div className='w-full flex items-center justify-between'>
                                    <p className="font-bold">Permission Selected</p>
                                    <span className='px-2 py-1 rounded-md bg-primary text-darkText text-xs font-bold'>{permissions.length}</span>
                                </div>
                                <ul className='w-full flex items-center gap-2 flex-wrap'>
                                    {
                                        permissions.length > 0 ?
                                            permissions.map((perm, index) => (
                                                <li key={index} className='bg-backgroundHover dark:bg-darkBackgroundHover px-2 py-1 rounded-md text-xs font-mono'>
                                                    {
                                                        hasPermission('role-edit') ?
                                                            <button type='button' onClick={() => handlePermissionSelection(perm, false)} className='flex items-center gap-2'>
                                                                {perm.name}
                                                            </button> :
                                                            <span className='flex items-center gap-2'>
                                                                {perm.name}
                                                            </span>
                                                    }
                                                </li>
                                            )) :

                                            <div className='w-full text-center text-secondaryText dark:text-darkSecondaryText'>no permission selected</div>
                                    }
                                </ul>
                                {
                                    hasPermission('role-edit') &&
                                    <>
                                        <hr className='border-text dark:border-darkText' />
                                        <ul className='w-full flex items-center gap-2 flex-wrap'>
                                            {
                                                permissionList.map((perm, index) => (
                                                    !permissions.find(p => p.id === perm.id) ?
                                                        <li key={index} className='bg-backgroundHover dark:bg-darkBackgroundHover px-2 py-1 rounded-md text-xs font-mono'>
                                                            <button type='button' onClick={() => handlePermissionSelection(perm, true)} className='flex items-center gap-2'>
                                                                {perm.name}
                                                            </button>
                                                        </li> : null
                                                ))
                                            }
                                        </ul>
                                    </>
                                }
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center justify-end p-4 md:p-5 rounded-b gap-2.5">
                        {hasPermission('role-edit') && <button onClick={EditRole} type="button" className="inline-flex items-center rounded-md bg-green-500 px-3 py-2 text-sm font-semibold text-darkText shadow-sm hover:bg-green-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-300 cursor-pointer" disabled={role.name === roleName && role.permissions === permissions}><FontAwesomeIcon icon={faPen} /></button>}
                        {hasPermission('role-delete') && <button onClick={() => setIsDeleteOpen(true)} type="button" className="inline-flex items-center rounded-md bg-red-500 px-3 py-2 text-sm font-semibold text-darkText shadow-sm hover:bg-red-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-300 cursor-pointer"><FontAwesomeIcon icon={faTrashCan} /></button>}
                    </div>
                </Modal>
            )}

            {isDeleteOpen && (
                <Modal
                    title="Are you sure you want to delete this role ?"
                    useButton={true}
                    onClose={() => setIsDeleteOpen(false)}
                    handleModal={() => DeleteRole()}
                    buttonText="Delete"
                    isGreen={false}
                ></Modal>
            )}
        </>
    );
};

export function UserCard({ user, refetch }: { user: User; refetch: () => void; }) {
    const roleContext = useContext(RoleContext);
    if (!roleContext) return null;
    const { hasPermission } = roleContext;

    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [isStatusOpen, setIsStatusOpen] = useState(false);
    const [roleDatas, setRoleDatas] = useState<Role[]>([]);
    const displayLimit = 13;

    useEffect(() => {
        const fetchRoleList = async () => {
            const response = await handleFetchRoleBySearch('', 1, 1000, 'ASC');

            if (response.status === 200 && response.data && response.meta) {
                setRoleDatas(response.data);
            } else if (response.message) {
                Toast('error', response.message);
                setRoleDatas([]);
            }
        };

        fetchRoleList();
    }, []);

    useEffect(() => {
        refetch();
    }, [isStatusOpen]);

    return (
        <>
            <div className="table-row text-text dark:text-darkText border-b border-border dark:border-darkBorder hover:bg-backgroundHover dark:hover:bg-darkBackgroundHover transition-colors relative cursor-pointer" onClick={() => setIsDetailOpen(true)}>
                <div className="table-cell px-3">
                    <div className='flex items-center gap-2 py-3'>
                        <Image
                            src={`/${user.photo}`}
                            alt="User Photo Profile"
                            className="rounded-full"
                            width={40}
                            height={40}
                        />
                        <div className='flex flex-col items-start'>
                            <p className='font-semibold'>{user.name}</p>
                            <p className='text-text/50 dark:text-darkText/50 text-xs max-w-[80px] md:max-w-none overflow-hidden text-ellipsis'>{user.email}</p>
                        </div>
                    </div>
                </div>
                <div className="table-cell py-1 px-3 align-middle">
                    <p>{user.role}</p>
                </div>
                <div className="hidden md:table-cell py-1 px-3 align-middle">
                    <p className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.active === 1 ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>{user.active === 1 ? 'Active' : 'Inactive'}</p>
                </div>
            </div>

            {isDetailOpen && (
                <Modal title="User Detail" useButton={false} onClose={() => setIsDetailOpen(false)}>
                    <div className="w-full flex flex-col items-stretch justify-evenly gap-5">
                        <div className='w-full flex items-stretch justify-evenly gap-5'>
                            <div className='flex flex-col items-start justify-between gap-5'>
                                <div className='flex items-center justify-center'>
                                    <Image
                                        src={`/${user.photo}`}
                                        alt="User Photo Profile"
                                        className="rounded-lg"
                                        width={50}
                                        height={50}
                                    />
                                </div>
                                <div className='flex flex-col items-start'>
                                    <p className='text-text/60 dark:text-darkText/60 text-sm'>Name</p>
                                    <p>{user.name}</p>
                                </div>
                                <div className='flex flex-col items-start'>
                                    <p className='text-text/60 dark:text-darkText/60 text-sm'>Phone Number</p>
                                    <p>{user.phone}</p>
                                </div>
                            </div>
                            <div className='flex flex-col items-start justify-between gap-5'>
                                <div className='flex flex-col items-start w-full'>
                                    <p className='text-text/60 dark:text-darkText/60 text-sm'>Role</p>
                                    <div className='flex items-center gap-2'>
                                        <p>{user.role}</p>
                                        {((user.role_id !== 1 && hasPermission('user-role-edit')) || (user.role_id === 1 && MyAccount('role') === 1)) && (
                                            <button onClick={() => setIsStatusOpen(true)} type="button" className="inline-flex items-center text-sm font-semibold cursor-pointer">
                                                <FontAwesomeIcon icon={faPen} />
                                            </button>
                                        )}
                                    </div>
                                </div>
                                <div className='flex flex-col items-start'>
                                    <p className='text-text/60 dark:text-darkText/60 text-sm'>Email</p>
                                    <p>{user.email}</p>
                                </div>
                                <div className='flex flex-col items-start'>
                                    <p className='text-text/60 dark:text-darkText/60 text-sm'>No KTP</p>
                                    <p>{user.no_ktp}</p>
                                </div>
                            </div>
                        </div>
                        <div className='w-full flex flex-col items-center gap-2'>
                            <p className='text-text/60 dark:text-darkText/60 text-sm'>Permission</p>
                            <ul className='flex items-center justify-center gap-2 flex-wrap'>
                                {
                                    roleDatas.map((role) => (
                                        role.id === user.role_id ?
                                            <>
                                                {
                                                    role.permissions.map((perm, index) => (
                                                        index < displayLimit &&
                                                        <li key={index} className='bg-backgroundHover dark:bg-darkBackgroundHover px-2 py-1 rounded-md text-xs font-mono'>{perm.name}</li>
                                                    ))
                                                }

                                                {
                                                    role.permissions.length > displayLimit ?
                                                        <li key={'plus'} className='bg-backgroundHover dark:bg-darkBackgroundHover px-2 py-1 rounded-md text-xs font-mono'>+{role.permissions.length - displayLimit}</li>
                                                        : null
                                                }

                                                {
                                                    role.permissions.length === 0 ?
                                                        <li key={'unavailable'} className='text-text/50 dark:text-darkText/50 font-mono'>no permission</li>
                                                        : null
                                                }
                                            </> : null
                                    ))
                                }
                            </ul>
                        </div>
                    </div>
                </Modal>
            )}
            {user && hasPermission('user-role-edit') && (<UserRoleModal user={user} open={isStatusOpen} roleData={roleDatas} onClose={() => setIsStatusOpen(false)} />)}
        </>
    );
};
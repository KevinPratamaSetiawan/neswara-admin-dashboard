"use client";

import { RoleCard, TagCard } from '@/components/Cards';
import Modal from '@/components/Modal';
import Footer from '@/components/footer';
import Header from '@/components/header';
import Pagination from '@/components/pagination';
import { Toast } from '@/components/toastList';
import { Meta } from '@/utils/newsUtilities';
import { faCalendar, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Image from 'next/image';
import { useContext, useEffect, useState } from 'react';
import { Tag, handleAddTag, handleFetchTagBySearch } from '@/utils/tagsUtilities';
import { Permission, Role, handleAddRole, handleFetchPermission, handleFetchRoleBySearch } from '@/utils/roleUtilities';
import { RoleContext } from '@/provider/Provider';
import { PageAccessCheck } from '@/utils/accessCheck';

export default function Role() {
    const roleContext = useContext(RoleContext);
    if (!roleContext) return null;
    const { hasPermission } = roleContext;

    const [currentPage, setCurrentPage] = useState(1);
    const [limitPage, setLimitPage] = useState(10);
    const [metaData, setMetaData] = useState<Meta>({
        currentPage: 1,
        itemsPerPage: 10,
        totalItems: 0,
        totalPages: 1
    });
    const [roleDatas, setRoleDatas] = useState<Role[]>([]);

    // Filter
    const [trySearch, setTrySearch] = useState<string>('');
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [order, setOrder] = useState<string>('ASC');

    const fetchRoleList = async () => {
        const response = await handleFetchRoleBySearch(searchTerm, currentPage, limitPage, order);

        if (response.status === 200 && response.data && response.meta) {
            setMetaData(response.meta);
            setRoleDatas(response.data);
        } else if (response.message) {
            Toast('error', response.message);
            setMetaData({
                currentPage: 1,
                itemsPerPage: 10,
                totalItems: 0,
                totalPages: 1
            });
            setRoleDatas([]);
        }
    };

    useEffect(() => {
        fetchRoleList();
    }, [currentPage, limitPage, searchTerm, order]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    // Add Section
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [roleName, setRoleName] = useState('');
    const [permissions, setPermissions] = useState<Permission[]>([]);
    const [permissionList, setPermissionList] = useState<Permission[]>([]);

    const handlePermissionSelection = (perm: Permission, isChecked: boolean) => {
        if (isChecked) {
            setPermissions((prev) => [...prev, perm]);
            setPermissionList((prev) => prev.filter((p) => p.id !== perm.id));
        } else {
            setPermissionList((prev) => [...prev, perm]);
            setPermissions((prev) => prev.filter((p) => p.id !== perm.id));
        }
    };

    const AddRole = async () => {
        const response = await handleAddRole(roleName, permissions);

        if (response.status === 200 && response.message) {
            Toast('success', response.message);
            setIsAddOpen(false);
            setRoleName('');
            setPermissions([]);
        } else if (response.message) {
            Toast('error', response.message);
        }
    };

    useEffect(() => {
        const fetchPermission = async () => {
            const response = await handleFetchPermission();

            if (response.status === 200 && response.permissions) {
                setPermissionList(response.permissions);
            } else if (response.message) {
                Toast('error', response.message);
            }
        };

        fetchPermission();
    }, [isAddOpen]);

    return (
        <>
            <PageAccessCheck permission={['role-list']} />
            <Header />
            <div className="w-full px-2 md:px-24 py-5 flex flex-col items-center gap-5 text-text dark:text-darkText">
                <div className='w-full flex items-center justify-between'>
                    <p className='text-2xl/7 font-bold sm:truncate sm:text-3xl sm:tracking-tight mr-auto'>Role</p>
                    {
                        hasPermission('role-create') &&
                        <button onClick={() => setIsAddOpen((prev) => !prev)} className='inline-flex items-center rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-primary/80 button-ring' type='button'>Add Role</button>
                    }
                </div>
                <div className='w-full flex flex-col items-center gap-4 bg-card dark:bg-darkCard border border-border dark:border-darkBorder rounded-xl px-2 md:px-5 py-3 shadow-lg'>
                    <div className='w-full flex flex-col md:flex-row items-stretch gap-3'>
                        <div className='w-full border-2 border-border dark:border-darkBorder rounded-lg overflow-hidden flex items-center button-ring transition-colors'>
                            <input
                                value={trySearch}
                                onChange={(e) => setTrySearch(e.target.value)}
                                type="text"
                                placeholder="Search..."
                                className='px-3 flex-1 outline-none bg-transparent text-sm text-text dark:text-darkText placeholder:text-secondaryText dark:placeholder:text-darkSecondaryText'
                            />
                            <button className='px-4 py-2 button-hover rounded-e-lg text-secondaryText dark:text-darkSecondaryText hover:text-text dark:hover:text-darkText transition-colors' onClick={() => setSearchTerm(trySearch)}>
                                <FontAwesomeIcon icon={faMagnifyingGlass} className='w-4 h-4' />
                            </button>
                        </div>
                        <button className='flex items-center justify-center gap-2 button-hover px-3 py-2 text-text dark:text-darkText border-2 border-border dark:border-darkBorder rounded-lg transition-colors' type='button' onClick={() => {
                            if (order === 'ASC') {
                                setOrder('DESC');
                                setCurrentPage(1);
                            } else {
                                setOrder('ASC');
                                setCurrentPage(1);
                            }
                        }}>
                            <FontAwesomeIcon icon={faCalendar} />
                            {
                                order === 'ASC' ? 'Oldest' : 'Recent'
                            }
                        </button>
                    </div>
                </div>
                <div className='w-full flex flex-col items-center gap-4 bg-card dark:bg-darkCard border border-border dark:border-darkBorder rounded-xl px-2 md:px-5 py-3 shadow-lg'>
                    <div className='table w-full border-collapse'>
                        {
                            metaData.totalItems ?
                                <>
                                    <div className='table-row text-left font-medium text-secondaryText dark:text-darkSecondaryText'>
                                        <div className='table-cell px-3'>Name</div>
                                        <div className='table-cell px-3'>Permission</div>
                                    </div>

                                    {roleDatas?.map((role, index) => (
                                        <RoleCard role={role} permission={permissionList} refetch={() => fetchRoleList()} key={index} />
                                    ))}
                                </>
                                :
                                <div className='table-row'>
                                    <div className='table-cell w-full text-center py-4 text-secondaryText dark:text-darkSecondaryText'>No role available.</div>
                                </div>
                        }
                    </div>

                    <Pagination
                        currentPage={currentPage}
                        itemsPerPage={limitPage}
                        totalItems={metaData.totalItems}
                        totalPages={metaData.totalPages}
                        onPageChange={handlePageChange}
                    />
                </div>
            </div>

            {isAddOpen && hasPermission('role-create') &&
                <Modal
                    title='New Role'
                    useButton={true}
                    onClose={() => setIsAddOpen(false)}
                    handleModal={AddRole}
                    isGreen={true}
                    buttonText='Add'
                >
                    <div className="w-full flex flex-col items-center gap-5">
                        <div className="w-full md:w-3/4 flex flex-col items-start gap-3">
                            <div className="w-full">
                                <p className="font-bold">Name</p>
                                <input
                                    type="text"
                                    placeholder="Name..."
                                    value={roleName}
                                    onChange={(e) => setRoleName(e.target.value)}
                                    className="w-full bg-card dark:bg-darkCard p-2"
                                />
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
                                                    <button type='button' onClick={() => handlePermissionSelection(perm, false)} className='flex items-center gap-2'>
                                                        {perm.name}
                                                    </button>
                                                </li>
                                            )) :

                                            <div className='w-full text-center text-secondaryText dark:text-darkSecondaryText'>no permission selected</div>
                                    }
                                </ul>

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
                            </div>
                        </div>
                    </div>
                </Modal>
            }
            <Footer />
        </>
    );
}

"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Footer from '@/components/footer';
import { AddCategory } from '@/utils/categoryUtilities';

export default function NewCategory() {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [icon, setIcon] = useState('');
    // const [icon, setIcon] = useState<File | null>(null);
    // const [iconPreview, setIconPreview] = useState<string | null>(null);
    const router = useRouter();
    const [isSaving, setIsSaving] = useState(false);

    // const handleIconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     const file = e.target.files ? e.target.files[0] : null;
    //     if (file) {
    //         setIcon(file);
    //         setIconPreview(URL.createObjectURL(file));
    //     }
    // };

    const handleSave = async () => {
        setIsSaving(true);

        AddCategory(name, description, icon, setIsSaving, router);
    };

    return (
        <>
            <div className="w-screen min-h-screen h-full flex flex-col items-center justify-center px-4 py-8 md:px-16 md:py-8">
                <div className="bg-white w-full max-w-3xl h-full px-6 py-8 rounded-3xl shadow-lg flex flex-col items-start gap-4">
                    <textarea
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        rows={1}
                        placeholder="Category Name..."
                        className="w-full px-3 py-2 text-2xl font-bold border-b-2 border-gray-400 focus:border-b-2 focus:border-indigo-600 resize-none"
                    />

                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={3}
                        placeholder="Description..."
                        className="w-full p-3 text-base font-light border-b-2 border-gray-400 focus:border-b-2 focus:border-indigo-600 resize-none"
                    />

                    {/* <div className="w-full flex flex-col gap-2">
                        <label htmlFor="icon" className="text-sm text-gray-700">Upload Category Icon</label>
                        <input
                            type="file"
                            id="icon"
                            accept="image/*"
                            onChange={handleIconChange}
                            className="w-full px-3 py-2 border-2 border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        {iconPreview && (
                            <div className="mt-2 flex justify-center">
                                <img
                                    src={iconPreview}
                                    alt="Icon Preview"
                                    className="w-16 h-16 object-cover rounded-full"
                                />
                            </div>
                        )}
                    </div> */}

                    <div className="w-full flex items-center justify-end gap-4 mt-4">
                        <Link
                            href={`/categories`}
                            className="inline-flex items-center rounded-md bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            Cancel
                        </Link>
                        <button
                            type="button"
                            onClick={handleSave}
                            disabled={isSaving}
                            className={`inline-flex items-center rounded-md px-4 py-2 text-sm font-semibold text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${isSaving ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-500'}`}
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

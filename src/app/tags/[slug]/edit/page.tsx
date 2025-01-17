"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Link from 'next/link';
import Footer from '@/components/footer';
import { updateTag, fetchTag } from '@/utils/tagsUtilities';

type TagProp = {
    id: number;
    name: string;
    slug: string;
    description: string;
    color: string;
    created_at: string;
    updated_at: string;
};

export default function EditTag({ params: paramsPromise }: { params: Promise<{ slug: string }> }) {
    const [tagId, setTagId] = useState<number>(0);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [color, setColor] = useState('#ffffff');
    const router = useRouter();
    const [isSaving, setIsSaving] = useState(false);
    const params = React.use(paramsPromise);
    const { slug } = params;

    const handleSave = async () => {
        setIsSaving(true);
        await updateTag(tagId, name, description, color, router);
        setIsSaving(false);
    };

    useEffect(() => {
        const loadData = async () => {
            if (slug) {
                const tagData = await fetchTag(slug);

                if (tagData) {
                    setTagId(tagData.id);
                    setName(tagData.name);
                    setDescription(tagData.description);
                    setColor(tagData.color)
                }
            }
        };

        loadData()
    }, []);

    return (
        <>
            <div className="w-screen min-h-screen h-full flex flex-col items-center justify-center px-4 py-8 md:px-16 md:py-8">
                <div className="bg-white w-full max-w-3xl h-full px-6 py-8 rounded-3xl shadow-lg flex flex-col items-start gap-4">
                    <textarea
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        rows={1}
                        placeholder="Tag Name..."
                        className="w-full px-3 py-2 text-2xl font-bold border-b-2 border-gray-400 focus:border-b-2 focus:border-indigo-600 resize-none"
                    />

                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={3}
                        placeholder="Description..."
                        className="w-full p-3 text-base font-light border-b-2 border-gray-400 focus:border-b-2 focus:border-indigo-600 resize-none"
                    />

                    <div className="w-full flex flex-col items-start gap-2">
                        <label htmlFor="color-picker" className="text-sm font-medium text-gray-700">
                            Tag Color
                        </label>
                        <input
                            id="color-picker"
                            type="color"
                            value={color}
                            onChange={(e) => setColor(e.target.value)}
                            className="w-full h-8 border-0 cursor-pointer"
                        />
                    </div>

                    <div className="w-full flex items-center justify-end gap-4 mt-4">
                        <Link
                            href={`/tags`}
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

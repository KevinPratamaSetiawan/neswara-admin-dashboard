import { Combobox, ComboboxButton, ComboboxInput, ComboboxOption, ComboboxOptions } from '@headlessui/react';
import clsx from 'clsx';
import { useEffect, useState } from 'react';

import { faCheck, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Category, CategoryIcon } from '@/utils/categoryUtilities';

interface SearchSelectProps {
    data: Category[];
    value: number;
    onChange: (value: number) => void;
    className?: string;
}

export default function SearchSelect({ data, value, onChange, className }: SearchSelectProps) {
    const [query, setQuery] = useState('');
    const [selectedCategoryIcon, setSelectedCategoryIcon] = useState('');

    const filteredData = query === ''
        ? data
        : data.filter((item) => item.name.toLowerCase().includes(query.toLowerCase()));

    useEffect(() => {
        const categoryIcon = data.find((item) => item.id === value)?.icon || '';
        setSelectedCategoryIcon(categoryIcon);
    }, [value])

    return (
        <Combobox value={value} onChange={onChange} onClose={() => setQuery('')}>
            <div className={`relative border border-border dark:border-darkBorder rounded-lg flex items-center ${className ? className : 'w-full'}`}>
                <div className="absolute left-4 w-4">{CategoryIcon(selectedCategoryIcon)}</div>
                <ComboboxInput
                    aria-label="Search"
                    placeholder="All Category"
                    className={clsx('w-full rounded-lg bg-card dark:bg-darkCard py-3 pr-8 pl-10 text-sm text-text dark:text-darkText', 'button-ring')}
                    displayValue={(id) => data.find((item) => item.id === id)?.name || ''}
                    onChange={(e) => setQuery(e.target.value)}
                />
                <ComboboxButton className="group absolute inset-y-0 right-0 px-2.5">
                    <FontAwesomeIcon icon={faChevronDown} className="text-gray-500 group-hover:text-gray-700" />
                </ComboboxButton>
            </div>

            <ComboboxOptions anchor="bottom" className={clsx('rounded-md border border-gray-200 bg-card dark:bg-darkCard shadow-lg p-1 empty:invisible', 'transition duration-100 ease-in')}>
                <ComboboxOption value={'-1'} className="group flex cursor-default items-center gap-2 rounded-md py-1.5 px-3 select-none hover:bg-backgroundHover dark:hover:bg-darkBackgroundHover">
                    <div className="text-sm">All</div>
                </ComboboxOption>
                {filteredData.map((item) => (
                    <ComboboxOption key={item.id} value={item.id} className="group flex cursor-default items-center gap-2 rounded-md py-1.5 px-3 select-none hover:bg-backgroundHover dark:hover:bg-darkBackgroundHover">
                        <p className='w-4'>{CategoryIcon(item.icon)}</p>
                        <div className="text-sm">{item.name}</div>
                    </ComboboxOption>
                ))}
            </ComboboxOptions>
        </Combobox>
    );
}
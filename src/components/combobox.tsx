import { Combobox, ComboboxButton, ComboboxInput, ComboboxOption, ComboboxOptions } from '@headlessui/react';
import clsx from 'clsx';
import { useState } from 'react';

import { faCheck, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface SearchSelectProps {
    data: { id: number; name: string }[];
    value: number;
    onChange: (value: number) => void;
}

export default function SearchSelect({ data, value, onChange }: SearchSelectProps) {
    const [query, setQuery] = useState('');

    const filteredData = query === ''
        ? data
        : data.filter((item) => item.name.toLowerCase().includes(query.toLowerCase()));

    return (
        <Combobox value={value} onChange={onChange} onClose={() => setQuery('')}>
            <div className="relative w-full sm:max-w-[200px]">
                <ComboboxInput
                    aria-label="Search"
                    className={clsx('w-full rounded-md border border-gray-300 bg-white py-1.5 pr-8 pl-3 text-sm text-gray-800', 'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500')}
                    displayValue={(id) => data.find((item) => item.id === id)?.name || ''}
                    onChange={(event) => setQuery(event.target.value)}
                />
                <ComboboxButton className="group absolute inset-y-0 right-0 px-2.5">
                    <FontAwesomeIcon icon={faChevronDown} className="text-gray-500 group-hover:text-gray-700" />
                </ComboboxButton>
            </div>

            <ComboboxOptions
                anchor="bottom"
                className={clsx('rounded-md border border-gray-200 bg-white shadow-lg p-1 empty:invisible', 'transition duration-100 ease-in')}
            >
                {filteredData.map((item) => (
                    <ComboboxOption key={item.id} value={item.id} className="group flex cursor-default items-center gap-2 rounded-md py-1.5 px-3 select-none hover:bg-gray-100">
                        <FontAwesomeIcon icon={faCheck} className="invisible text-blue-500 group-data-[selected]:visible" />
                        <div className="text-sm text-gray-800">{item.name}</div>
                    </ComboboxOption>
                ))}
            </ComboboxOptions>
        </Combobox>
    );
}
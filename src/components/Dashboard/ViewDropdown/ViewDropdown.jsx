import { useState, useRef, useEffect } from 'react';
import { SettingOutlined } from '@ant-design/icons';
import { useLocation } from 'react-router-dom';

const ViewDropdown = ({ selectedColumns, setSelectedColumns }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const location = useLocation().pathname;

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const handleClickOutside = (event) => {
        if (
            dropdownRef.current &&
            !dropdownRef.current.contains(event.target)
        ) {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleColumnChange = (column) => {
        setSelectedColumns((prevState) => ({
            ...prevState,
            [column]: !prevState[column],
        }));

        //set local storage
        localStorage.setItem(
            `selectedColumns${location}`,
            JSON.stringify({
                ...selectedColumns,
                [column]: !selectedColumns[column],
            })
        );
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={toggleDropdown}
                className="px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-100 focus:outline-none flex items-center text-sm font-semibold"
            >
                <SettingOutlined className="mr-2" />
                View
            </button>
            {isOpen && (
                <div className="absolute mt-2 -left-[50%] w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                    <div className="p-2 font-bold text-gray-700 border-b border-gray-200">
                        Toggle columns
                    </div>
                    <ul className="py-1">
                        {Object.keys(selectedColumns).map((column) => (
                            <li
                                key={column}
                                className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
                                onClick={() => handleColumnChange(column)}
                            >
                                <input
                                    type="checkbox"
                                    checked={selectedColumns[column]}
                                    onChange={() => handleColumnChange(column)}
                                    className="mr-2 accent-orange-400 cursor-pointer"
                                    onClick={(e) => e.stopPropagation()}
                                />
                                <span>{column}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default ViewDropdown;

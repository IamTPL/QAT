import { PlusCircleOutlined } from '@ant-design/icons';
import { useState, useRef, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Popover } from 'antd';
import { convertDateToMMDDYYYY } from "../../../helpers/dateFormats/dateFormats";

const DateUploadPopup = ({
    selectedStartDate,
    selectedEndDate,
    onDateChange,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [startDate, setStartDate] = useState(selectedStartDate);
    const [endDate, setEndDate] = useState(selectedEndDate);
    const popupRef = useRef(null);

    const togglePopup = () => {
        setIsOpen(!isOpen);
    };

   
    useEffect(() => {
        console.log('update the date when the user selects a date running...');
        console.log(selectedStartDate, selectedEndDate);
        console.log(startDate, endDate);
        let updated = false;
        if (selectedStartDate !== undefined) {
            console.log(
                'update the date when the user selects a date running 1...'
            );
            setStartDate(selectedStartDate);
            updated = true;
        }
        if (selectedEndDate !== undefined) {
            console.log(
                'update the date when the user selects a date running 2...'
            );
            setEndDate(selectedEndDate);
            updated = true;
        }
        if (updated && typeof onDateChange === 'function') {
            console.log('Call onDateChange when the user selects a date...');
            onDateChange(selectedStartDate, selectedEndDate);
        }
    }, [selectedStartDate, selectedEndDate]);

    // Call onDateChange when the user selects a date
    useEffect(() => {
        console.log('Call onDateChange when the user selects a date...');
        if (typeof onDateChange === 'function') {
            onDateChange(startDate, endDate);
        }
    }, [startDate, endDate]);

    // Close popup when clicking outside
    const handleClickOutside = (event) => {
        if (popupRef.current && !popupRef.current.contains(event.target)) {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // console.log(startDate, endDate);

    return (
        <div className="relative" ref={popupRef}>
            <button
                onClick={togglePopup}
                className="px-4 py-2 border border-dashed border-gray-300 rounded-md shadow-sm hover:bg-gray-100 focus:outline-none text-sm font-semibold"
            >
                <PlusCircleOutlined className="mr-2" />
                Date Upload
                {(startDate || endDate) && (
                    <Popover
                        content={
                            <>
                                <p className="text-orange-400">
                                    <span className="font-semibold">
                                        Start Date:
                                    </span>{' '}
                                    {startDate
                                        ? convertDateToMMDDYYYY(startDate)
                                        : 'Not selected'}
                                </p>
                                <p className="text-orange-400">
                                    <span className="font-semibold">
                                        End Date:
                                    </span>{' '}
                                    {endDate
                                        ? convertDateToMMDDYYYY(endDate)
                                        : 'Not selected'}
                                </p>
                            </>
                        }
                        placement="top"
                        trigger="hover"
                    >
                        <span className=""> | </span>
                        <span className="ml-1 text-sm font-normal bg-gray-200 px-2 py-1 rounded-md">
                            Date upload selected
                        </span>
                    </Popover>
                )}
            </button>
            {isOpen && (
                <div className="absolute top-12 left-0 bg-white border border-gray-300 rounded-lg shadow-lg p-4 z-10 w-72">
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">
                            Start Date:
                        </label>
                        <DatePicker
                            selected={startDate}
                            onChange={(date) => setStartDate(date)}
                            dateFormat="MM-dd-yyyy"
                            className="border border-gray-300 rounded-md p-2 w-full"
                            placeholderText='mm-dd-yyyy'
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">
                            End Date:
                        </label>
                        <DatePicker
                            selected={endDate}
                            onChange={(date) => setEndDate(date)}
                            dateFormat="MM-dd-yyyy"
                            className="border border-gray-300 rounded-md p-2 w-full"
                            placeholderText='mm-dd-yyyy'
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default DateUploadPopup;

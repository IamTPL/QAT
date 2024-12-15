import React, { useRef } from 'react';
import Sidebar from '../../components/Sidebar/Sidebar';

const AdmDashBoard = () => {
    const currentProcessingChecks = useRef([]);

    const handleChangeMenuSidebar = () => {
        currentProcessingChecks.current = [];
    };
    return (
        <div className="px-8 flex">
            <Sidebar onChangeMenuSidebar={handleChangeMenuSidebar}></Sidebar>
            <div>adm db</div>
        </div>
    );
};

export default AdmDashBoard;

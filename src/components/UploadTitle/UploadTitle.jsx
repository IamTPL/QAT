import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const UpdateTitle = () => {
    const location = useLocation();

    useEffect(() => {
        const path = location.pathname;

        if (path === '/checks') {
            document.title = 'Checks - QBO';
        } else if (path === '/') {
            document.title = 'Statement - QBO';
        } else if (path === '/login') {
            document.title = 'Login - QBO';
        } else if (path.includes('/statement-review')) {
            document.title = 'Statement Review - QBO';
        } else if (path.includes('/check-review')) {
            document.title = 'Check Review - QBO';
        } else {
            document.title = 'QBO';
        }
    }, [location]);

    return null;
};

export default UpdateTitle;

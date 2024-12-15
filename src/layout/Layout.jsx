import React from 'react';
import Header from '../components/Header/Header';

const Layout = ({ Component }) => {
    return (
        <>
            <Header></Header>
            <Component></Component>
            <div className="h-14"></div>
        </>
    );
};

export default Layout;

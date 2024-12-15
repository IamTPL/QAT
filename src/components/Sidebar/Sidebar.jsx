import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu } from 'antd'; // Assuming you're using Ant Design
import { BankOutlined, FileTextOutlined } from '@ant-design/icons';
import './SidebarStyle.css';

const items = [
    {
        key: '1',
        icon: <BankOutlined />,
        label: 'Bank Statement',
        route: '/',
        style: { color: 'black', fontSize: '16px' },
    },
    {
        key: '2',
        icon: <FileTextOutlined />,
        label: 'Check',
        route: '/checks',
        style: { color: 'black', fontSize: '16px' },
    },
];

const Sidebar = ({ onChangeMenuSidebar }) => {
    const navigate = useNavigate();
    const location = useLocation();

    // Determine which key to select based on current path
    const selectedKey =
        items.find((item) => item.route === location.pathname)?.key || '1';

    const handleMenuClick = (e) => {
        const selectedItem = items.find((item) => item.key === e.key);
        onChangeMenuSidebar('Bank Statement');
        if (selectedItem) {
            navigate(selectedItem.route);
        }
    };

    return (
        <div className="sidebar py-14 w-[16vw] border-r-[1px] min-w-[250px]">
            <p className="pl-7 font-semibold text-lg">Models</p>
            <Menu
                style={{
                    borderInlineEnd: 'none',
                }}
                theme="light"
                mode="inline"
                className="pr-8 br-0"
                selectedKeys={[selectedKey]} // Highlight the item that matches the route
                onClick={handleMenuClick}
                items={items}
            />
        </div>
    );
};

export default React.memo(Sidebar);

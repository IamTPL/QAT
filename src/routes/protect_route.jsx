import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loading from '../components/Loading/Loading';

const ProtectedRoute = ({ children, roles }) => {
    const { user, loading, logout } = useAuth();

    if (loading) {
        return (
            <div>
                <Loading></Loading>{' '}
            </div>
        );
    }

    if (!user.isAuthenticated) {
        return <Navigate to="/login" />;
    }

    if (roles && !roles.includes(user.role)) {
        return <Navigate to="/error" />;
    }

    return children;
};

export default ProtectedRoute;

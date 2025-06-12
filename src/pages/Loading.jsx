import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/loading.css';

function Loading() {
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => {
            navigate('/');
        }, 2000);
        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <div className="loading-container">
            <div className="logo">
                <img src="/logo/logo.png" alt="Logo Terang" />
            </div>
            <div className="loading-spinner"></div>
            <p className="loading-text">Tunggu, masih loading</p>
        </div>
    );
}

export default Loading;
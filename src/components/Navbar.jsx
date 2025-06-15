import React from 'react';
import { NavLink } from 'react-router-dom';
import '../styles/style.css'; 

function Navbar() {
    return (
        <div className="navbar">
            <NavLink to="/" className={({ isActive }) => "nav-item" + (isActive ? " active" : "")}>
                <img src="/icons/orders-icon.svg" alt="Orders" />
            </NavLink>
            <NavLink to="/katalog" className={({ isActive }) => "nav-item" + (isActive ? " active" : "")}>
                <img src="/icons/database-icon.svg" alt="Database" />
            </NavLink>
            <NavLink to="/riwayat" className={({ isActive }) => "nav-item" + (isActive ? " active" : "")}>
                <img src="/icons/laporan-icon.svg" alt="Laporan" />
            </NavLink>
        </div>
    );
}

export default Navbar;
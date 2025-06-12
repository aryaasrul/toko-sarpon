import React from 'react';
import { NavLink } from 'react-router-dom';
import '../styles/style.css'; 

function Navbar() {
    return (
        <div className="navbar">
            <NavLink to="/" className={({ isActive }) => "nav-item" + (isActive ? " active" : "")}>
                <img src="/icons/orders-icon.svg" alt="Kasir" />
                <span>Kasir</span>
            </NavLink>
            <NavLink to="/katalog" className={({ isActive }) => "nav-item" + (isActive ? " active" : "")}>
                <img src="/icons/database-icon.svg" alt="Katalog" />
                <span>Katalog</span>
            </NavLink>
            <NavLink to="/riwayat" className={({ isActive }) => "nav-item" + (isActive ? " active" : "")}>
                <img src="/icons/laporan-icon.svg" alt="Riwayat" />
                <span>Riwayat</span>
            </NavLink>
        </div>
    );
}

export default Navbar;
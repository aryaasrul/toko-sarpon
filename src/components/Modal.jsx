import React from 'react';
import '../styles/style.css'; // Menggunakan style.css untuk styling modal

function Modal({ isOpen, onClose, children }) {
    if (!isOpen) {
        return null; // Jangan render apapun jika modal tidak terbuka
    }

    return (
        // 'modal-backdrop' adalah lapisan gelap di belakang modal
        <div className="modal-backdrop" onClick={onClose}>
            {/* 'modal-content' adalah kotak putih di tengah */}
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                {children}
            </div>
        </div>
    );
}

export default Modal;
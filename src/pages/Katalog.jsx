// Ganti isi file: src/pages/Katalog.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // <-- Pastikan ini ada
import { supabase } from '../services/supabase';
import Modal from 'react-modal';
import '../styles/katalog.css';

const customModalStyles = { /* ... (style object tidak berubah) ... */ 
  overlay: { backgroundColor: 'rgba(0, 0, 0, 0.75)', zIndex: 1000, },
  content: { top: '50%', left: '50%', right: 'auto', bottom: 'auto', marginRight: '-50%', transform: 'translate(-50%, -50%)', width: '90%', maxWidth: '400px', padding: '20px', border: 'none', borderRadius: '8px', },
};

function Katalog() {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isOptionsModalOpen, setIsOptionsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const handleEditProduct = () => {
        if (selectedProduct) {
            navigate(`/katalog/edit/${selectedProduct.id}`);
        }
    };
    const fetchProducts = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase.from('products').select('*').order('name', { ascending: true });
            if (error) throw error;
            setProducts(data);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => { fetchProducts(); }, []);

    const openOptionsModal = (product) => {
        setSelectedProduct(product);
        setIsOptionsModalOpen(true);
    };

    const closeModals = () => {
        setIsOptionsModalOpen(false);
        setIsDeleteModalOpen(false);
        setSelectedProduct(null);
    };

    const openDeleteConfirm = () => {
        setIsOptionsModalOpen(false);
        setIsDeleteModalOpen(true);
    };
    
    const handleAddProduct = () => {
        navigate('/katalog/tambah');
    };

    const handleDeleteProduct = async () => {
        if (!selectedProduct) return;
        setIsDeleting(true);
        try {
            const { error } = await supabase.from('products').delete().eq('id', selectedProduct.id);
            if (error) throw error;
            alert(`Produk "${selectedProduct.name}" berhasil dihapus.`);
            closeModals();
            fetchProducts();
        } catch (error) {
            alert(`Gagal menghapus produk: ${error.message}`);
        } finally {
            setIsDeleting(false);
        }
    };

    if (loading) return <div className="loading-container">Memuat katalog...</div>;
    if (error) return <div className="error-container">Error: {error}</div>;

    return (
        <div>
            <div className="header">
                <h1>Katalog</h1>
                <button className="btn-tambah-produk" onClick={handleAddProduct}>
                    <img src="/icons/icon-plus-input-manual.svg" alt="Plus" />
                    Tambah Produk
                </button>
            </div>
            <div className="product-list">
                {products.map((product) => (
                    <div key={product.id} className="product-item-katalog">
                        <img src={product.image_url || 'https://via.placeholder.com/150'} alt={product.name} className="product-image" />
                        <div className="product-info">
                            <h3>{product.name}</h3>
                            <p>Rp {product.price.toLocaleString('id-ID')}</p>
                        </div>
                        <button className="options-btn" onClick={() => openOptionsModal(product)}>
                            <img src="/icons/icon-dots.svg" alt="Options" />
                        </button>
                    </div>
                ))}
            </div>
            <Modal isOpen={isOptionsModalOpen} onRequestClose={closeModals} style={customModalStyles}>
                <div className="modal-header">
                    <h2>Opsi Produk</h2>
                    <button onClick={closeModals} className="modal-close-btn">&times;</button>
                </div>
                <div className="modal-body">
                    <p style={{textAlign: 'center', marginBottom: '20px', fontWeight: 'bold'}}>{selectedProduct?.name}</p>
                    {/* --- UBAH DI SINI --- */}
                    <button className="option-btn" onClick={handleEditProduct}>Edit Produk</button>
                    <button className="option-btn danger" onClick={openDeleteConfirm}>Hapus Produk</button>
                </div>
            </Modal>
            <Modal isOpen={isDeleteModalOpen} onRequestClose={closeModals} style={customModalStyles}>
                <div className="modal-header"><h2>Konfirmasi Hapus</h2></div>
                <div className="modal-body"><p>Apakah Anda yakin ingin menghapus produk **"{selectedProduct?.name}"**? Tindakan ini tidak dapat dibatalkan.</p><div className="modal-buttons"><button className="option-btn" onClick={closeModals} disabled={isDeleting}>Batal</button><button className="option-btn danger" onClick={handleDeleteProduct} disabled={isDeleting}>{isDeleting ? 'Menghapus...' : 'Ya, Hapus'}</button></div></div>
            </Modal>
        </div>
    );
}

export default Katalog;
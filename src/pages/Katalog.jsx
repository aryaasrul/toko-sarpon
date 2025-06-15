import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabase';
import '../styles/katalog.css';
import '../styles/katalog-fixes.css';

function Katalog() {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState('Semua Produk');
    const [categories, setCategories] = useState(['Semua Produk']);
    
    // Modal states
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showOptionsModal, setShowOptionsModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        fetchProducts();
    }, []);

    useEffect(() => {
        loadCategories();
    }, [products]);

    useEffect(() => {
        filterProducts();
    }, [products, searchTerm, activeCategory]);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .order('name', { ascending: true });
            
            if (error) throw error;
            setProducts(data || []);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const loadCategories = () => {
        const uniqueCategories = new Set(['Semua Produk']);
        
        products.forEach(product => {
            if (product.kategori) {
                if (Array.isArray(product.kategori)) {
                    product.kategori.forEach(cat => uniqueCategories.add(cat));
                } else if (typeof product.kategori === 'string') {
                    try {
                        const kategoriArray = JSON.parse(product.kategori);
                        if (Array.isArray(kategoriArray)) {
                            kategoriArray.forEach(cat => uniqueCategories.add(cat));
                        }
                    } catch {
                        uniqueCategories.add(product.kategori);
                    }
                }
            }
        });

        // Add default categories if not many found
        if (uniqueCategories.size <= 2) {
            ['Espresso Based', 'Milk Based'].forEach(cat => uniqueCategories.add(cat));
        }

        setCategories(Array.from(uniqueCategories));
    };

    const filterProducts = () => {
        let filtered = [...products];

        // Filter by search
        if (searchTerm) {
            filtered = filtered.filter(product => 
                product.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Filter by category
        if (activeCategory !== 'Semua Produk') {
            filtered = filtered.filter(product => {
                if (!product.kategori) return false;
                
                if (Array.isArray(product.kategori)) {
                    return product.kategori.includes(activeCategory);
                } else if (typeof product.kategori === 'string') {
                    try {
                        const kategoriArray = JSON.parse(product.kategori);
                        return Array.isArray(kategoriArray) && kategoriArray.includes(activeCategory);
                    } catch {
                        return product.kategori === activeCategory;
                    }
                }
                return false;
            });
        }

        setFilteredProducts(filtered);
    };

    const handleAddProduct = () => {
        navigate('/katalog/tambah');
    };

    const handleEditProduct = () => {
        if (selectedProduct) {
            navigate(`/katalog/edit/${selectedProduct.id}`);
            setShowOptionsModal(false);
        }
    };

    const handleDeleteClick = () => {
        setShowOptionsModal(false);
        setShowDeleteModal(true);
    };

    const handleDeleteConfirm = async () => {
        if (!selectedProduct) return;

        setIsDeleting(true);
        try {
            const { error } = await supabase
                .from('products')
                .delete()
                .eq('id', selectedProduct.id);

            if (error) throw error;

            alert('Produk berhasil dihapus');
            setShowDeleteModal(false);
            setSelectedProduct(null);
            fetchProducts();
        } catch (error) {
            alert('Gagal menghapus produk: ' + error.message);
        } finally {
            setIsDeleting(false);
        }
    };

    const openOptionsModal = (product) => {
        setSelectedProduct(product);
        setShowOptionsModal(true);
    };

    const closeModals = () => {
        setShowOptionsModal(false);
        setShowDeleteModal(false);
        setSelectedProduct(null);
    };

    if (loading) return <div className="loading-container">Memuat katalog...</div>;
    if (error) return <div className="error-container">Error: {error}</div>;

    return (
        <div className="katalog-container">
            <div className="header">
                <h1>Katalog</h1>
                <button className="btn-tambah-produk" onClick={handleAddProduct}>
                    <img src="/icons/icon-plus-input-manual.svg" alt="Plus" />
                    Tambah Produk
                </button>
            </div>

            <div className="search-container">
                <div className="search-bar">
                    <input 
                        type="text" 
                        placeholder="Cari Produk"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <button className="btn-filter">
                    <img src="/icons/Filter.svg" alt="Filter" />
                </button>
            </div>

            <div className="categories">
                {categories.map((category) => (
                    <button 
                        key={category}
                        className={`category ${activeCategory === category ? 'active' : ''}`}
                        onClick={() => setActiveCategory(category)}
                    >
                        {category}
                    </button>
                ))}
            </div>

            <div className="product-list">
                {filteredProducts.length === 0 ? (
                    <p style={{ textAlign: 'center', padding: '20px' }}>
                        Tidak ada produk yang tersedia.
                    </p>
                ) : (
                    filteredProducts.map((product) => (
                        <div key={product.id} className="product-card">
                            <div className="product-info">
                                <div className="product-image"></div>
                                <div className="product-details">
                                    <h3>{product.name}</h3>
                                    <p>Rp. {product.price.toLocaleString('id-ID')}</p>
                                </div>
                            </div>
                            <div className="product-options">
                                <button 
                                    className="btn-options" 
                                    onClick={() => openOptionsModal(product)}
                                >
                                    <img src="/icons/More-Square.svg" alt="Options" />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Product Options Modal */}
            {showOptionsModal && (
                <div className="modal" style={{ display: 'block' }}>
                    <div className="modal-content">
                        <div className="modal-header">
                            <h2>Opsi Produk</h2>
                            <span className="close" onClick={closeModals}>&times;</span>
                        </div>
                        <div className="modal-body">
                            <button 
                                id="btn-edit-product" 
                                className="option-btn"
                                onClick={handleEditProduct}
                            >
                                Edit Produk
                            </button>
                            <button 
                                id="btn-delete-product" 
                                className="option-btn danger"
                                onClick={handleDeleteClick}
                            >
                                Hapus Produk
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="modal" style={{ display: 'block' }}>
                    <div className="modal-content">
                        <div className="modal-header">
                            <h2>Konfirmasi Hapus</h2>
                            <span className="close" onClick={closeModals}>&times;</span>
                        </div>
                        <div className="modal-body">
                            <p>Apakah Anda yakin ingin menghapus produk ini?</p>
                            <div className="modal-buttons">
                                <button 
                                    id="btn-cancel-delete" 
                                    className="option-btn"
                                    onClick={closeModals}
                                    disabled={isDeleting}
                                >
                                    Batal
                                </button>
                                <button 
                                    id="btn-confirm-delete" 
                                    className="option-btn danger"
                                    onClick={handleDeleteConfirm}
                                    disabled={isDeleting}
                                >
                                    {isDeleting ? 'Menghapus...' : 'Hapus'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Katalog;
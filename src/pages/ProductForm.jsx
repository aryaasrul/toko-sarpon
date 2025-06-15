import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../services/supabase';
import '../styles/form-produk.css';

function ProductForm() {
    const navigate = useNavigate();
    const { productId } = useParams();
    const isEditMode = Boolean(productId);

    // Form states
    const [namaProduk, setNamaProduk] = useState('');
    const [hargaJual, setHargaJual] = useState('');
    const [hargaHpp, setHargaHpp] = useState('');
    const [selectedKategori, setSelectedKategori] = useState(['Semua Produk']);
    const [availableKategori, setAvailableKategori] = useState(['Semua Produk', 'Espresso Based', 'Milk Based']);
    
    // UI states
    const [isLoading, setIsLoading] = useState(isEditMode);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showKategoriModal, setShowKategoriModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [newKategori, setNewKategori] = useState('');

    // Character counters
    const [namaProdukCount, setNamaProdukCount] = useState(0);
    const [hargaJualCount, setHargaJualCount] = useState(0);
    const [hargaHppCount, setHargaHppCount] = useState(0);

    useEffect(() => {
        loadKategori();
        if (isEditMode) {
            fetchProduct();
        }
    }, [productId, isEditMode]);

    const loadKategori = async () => {
        try {
            // Load unique categories from products
            const { data: products } = await supabase
                .from('products')
                .select('kategori');

            const uniqueKategori = new Set(['Semua Produk', 'Espresso Based', 'Milk Based']);
            
            products?.forEach(product => {
                if (product.kategori) {
                    if (Array.isArray(product.kategori)) {
                        product.kategori.forEach(cat => uniqueKategori.add(cat));
                    }
                }
            });

            setAvailableKategori(Array.from(uniqueKategori));
        } catch (error) {
            console.error('Error loading categories:', error);
        }
    };

    const fetchProduct = async () => {
        try {
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .eq('id', productId)
                .single();

            if (error) throw error;

            if (data) {
                setNamaProduk(data.name);
                setHargaJual(formatRupiah(data.price.toString()));
                setHargaHpp(formatRupiah((data.hpp || 0).toString()));
                setNamaProdukCount(data.name.length);
                setHargaJualCount(formatRupiah(data.price.toString()).length);
                setHargaHppCount(formatRupiah((data.hpp || 0).toString()).length);
                
                if (data.kategori && Array.isArray(data.kategori)) {
                    setSelectedKategori(data.kategori);
                } else {
                    setSelectedKategori(['Semua Produk']);
                }
            }
        } catch (error) {
            alert("Gagal memuat data: " + error.message);
            navigate('/katalog');
        } finally {
            setIsLoading(false);
        }
    };

    const formatRupiah = (value) => {
        let numericValue = value.replace(/\D/g, '');
        if (numericValue.length > 0) {
            numericValue = parseInt(numericValue).toString();
            numericValue = numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
            return 'Rp ' + numericValue;
        }
        return '';
    };

    const parseRupiah = (rupiahString) => {
        if (!rupiahString) return 0;
        return parseInt(rupiahString.replace(/\D/g, '')) || 0;
    };

    const handleNamaProdukChange = (e) => {
        const value = e.target.value;
        if (value.length <= 50) {
            setNamaProduk(value);
            setNamaProdukCount(value.length);
        }
    };

    const handleHargaJualChange = (e) => {
        const formatted = formatRupiah(e.target.value);
        setHargaJual(formatted);
        setHargaJualCount(formatted.length);
    };

    const handleHargaHppChange = (e) => {
        const formatted = formatRupiah(e.target.value);
        setHargaHpp(formatted);
        setHargaHppCount(formatted.length);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!namaProduk || !hargaJual) {
            alert('Nama Produk dan Harga Jual wajib diisi.');
            return;
        }

        setIsSubmitting(true);

        const productData = {
            name: namaProduk.trim(),
            price: parseRupiah(hargaJual),
            hpp: parseRupiah(hargaHpp),
            kategori: selectedKategori
        };

        try {
            if (isEditMode) {
                const { error } = await supabase
                    .from('products')
                    .update(productData)
                    .eq('id', productId);
                
                if (error) throw error;
                alert('Produk berhasil diupdate!');
            } else {
                const { error } = await supabase
                    .from('products')
                    .insert(productData);
                
                if (error) throw error;
                alert('Produk berhasil ditambahkan!');
            }
            
            navigate('/katalog');
        } catch (error) {
            alert(`Gagal menyimpan data: ${error.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async () => {
        try {
            const { error } = await supabase
                .from('products')
                .delete()
                .eq('id', productId);
                
            if (error) throw error;
            
            alert('Produk berhasil dihapus!');
            navigate('/katalog');
        } catch (error) {
            alert(`Gagal menghapus produk: ${error.message}`);
        }
    };

    const toggleKategori = (kategori) => {
        if (selectedKategori.includes(kategori)) {
            setSelectedKategori(selectedKategori.filter(k => k !== kategori));
        } else {
            setSelectedKategori([...selectedKategori, kategori]);
        }
    };

    const addNewKategori = () => {
        if (newKategori.trim() && !availableKategori.includes(newKategori.trim())) {
            const newCat = newKategori.trim();
            setAvailableKategori([...availableKategori, newCat]);
            setSelectedKategori([...selectedKategori, newCat]);
            setNewKategori('');
        }
    };

    if (isLoading) {
        return <div className="loading-container">Memuat data produk...</div>;
    }

    return (
        <div className="form-produk-container">
            <div className="header">
                <div className="back-button">
                    <img 
                        src="/icons/Arrow-Left-2.svg" 
                        alt="Back" 
                        onClick={() => navigate('/katalog')}
                    />
                    <h1>{isEditMode ? 'Ubah Produk' : 'Tambah Produk'}</h1>
                </div>
            </div>

            <div className="content">
                <h2>Informasi Produk</h2>

                <div className="form-container">
                    {/* Photo Section */}
                    <div className="form-section">
                        <div className="photo-section">
                            <label>Foto Produk (Optional)</label>
                            <p className="photo-limit">Max. 3 foto</p>
                            <div className="photo-upload-container">
                                <div className="photo-preview empty">
                                    <img src="/icons/Plus-square.svg" alt="Camera" className="camera-icon" />
                                    <input type="file" id="photo-upload" accept="image/*" className="photo-input" />
                                </div>
                                <div className="add-photo">
                                    <img src="/icons/Plus-square.svg" alt="Add Photo" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Form Fields */}
                    <div className="form-group">
                        <label htmlFor="nama-produk">Nama Produk</label>
                        <input 
                            type="text" 
                            id="nama-produk" 
                            placeholder="Nama Produk" 
                            maxLength="50"
                            value={namaProduk}
                            onChange={handleNamaProdukChange}
                        />
                        <div className="char-counter">
                            <span id="nama-produk-count">{namaProdukCount}</span>/50
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="harga-jual">Harga Jual</label>
                        <input 
                            type="text" 
                            id="harga-jual" 
                            placeholder="Rp 0" 
                            maxLength="50"
                            value={hargaJual}
                            onChange={handleHargaJualChange}
                        />
                        <div className="char-counter">
                            <span id="harga-jual-count">{hargaJualCount}</span>/50
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="harga-hpp">Harga Hpp</label>
                        <input 
                            type="text" 
                            id="harga-hpp" 
                            placeholder="Rp 0" 
                            maxLength="50"
                            value={hargaHpp}
                            onChange={handleHargaHppChange}
                        />
                        <div className="char-counter">
                            <span id="harga-hpp-count">{hargaHppCount}</span>/50
                        </div>
                    </div>

                    <div className="form-group">
                        <div className="kategori-header">
                            <label>Kategori</label>
                            <button 
                                type="button"
                                className="btn-atur-kategori"
                                onClick={() => setShowKategoriModal(true)}
                            >
                                <img src="/icons/Plus-square.svg" alt="Plus" />
                                Atur
                            </button>
                        </div>
                        <div className="selected-categories" id="selected-categories">
                            {selectedKategori.map(kat => (
                                <div key={kat} className="category-tag">
                                    {kat}
                                    <img 
                                        src="/icons/Close-Square.svg" 
                                        alt="Remove" 
                                        className="remove-icon"
                                        onClick={() => toggleKategori(kat)}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="button-group">
                        <button 
                            className="btn-simpan" 
                            id="btn-simpan"
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Menyimpan...' : 'Simpan'}
                        </button>
                        {isEditMode && (
                            <button 
                                className="btn-hapus" 
                                id="btn-hapus"
                                onClick={() => setShowDeleteModal(true)}
                            >
                                <img src="/icons/Delete.svg" alt="Delete" />
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Kategori Modal */}
            {showKategoriModal && (
                <div className="modal" style={{ display: 'block' }}>
                    <div className="modal-content">
                        <div className="modal-header">
                            <h2>Pilih Kategori</h2>
                            <span className="close" onClick={() => setShowKategoriModal(false)}>&times;</span>
                        </div>
                        <div className="modal-body">
                            <div className="kategori-list">
                                {availableKategori.map(kat => (
                                    <div key={kat} className="kategori-item">
                                        <input 
                                            type="checkbox" 
                                            id={`cat-${kat}`}
                                            className="kategori-checkbox"
                                            checked={selectedKategori.includes(kat)}
                                            onChange={() => toggleKategori(kat)}
                                        />
                                        <label htmlFor={`cat-${kat}`}>{kat}</label>
                                    </div>
                                ))}
                            </div>
                            <div className="form-group">
                                <label htmlFor="new-kategori">Tambah Kategori Baru</label>
                                <div className="add-kategori-input">
                                    <input 
                                        type="text" 
                                        id="new-kategori" 
                                        placeholder="Nama Kategori"
                                        value={newKategori}
                                        onChange={(e) => setNewKategori(e.target.value)}
                                    />
                                    <button onClick={addNewKategori}>Tambah</button>
                                </div>
                            </div>
                            <button 
                                className="btn-terapkan-kategori"
                                onClick={() => setShowKategoriModal(false)}
                            >
                                Terapkan
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
                            <span className="close" onClick={() => setShowDeleteModal(false)}>&times;</span>
                        </div>
                        <div className="modal-body">
                            <p>Apakah Anda yakin ingin menghapus produk ini?</p>
                            <div className="modal-buttons">
                                <button className="option-btn" onClick={() => setShowDeleteModal(false)}>
                                    Batal
                                </button>
                                <button className="option-btn danger" onClick={handleDelete}>
                                    Hapus
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ProductForm;
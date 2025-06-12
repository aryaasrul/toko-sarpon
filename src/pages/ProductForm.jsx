// Ganti isi file: src/pages/ProductForm.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../services/supabase';
import '../styles/form-produk.css';


function ProductForm() {
    const navigate = useNavigate();
    const { productId } = useParams();
    const isEditMode = Boolean(productId);

    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [hpp, setHpp] = useState('');
    
    const [isLoading, setIsLoading] = useState(isEditMode);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (isEditMode) {
            const fetchProduct = async () => {
                try {
                    const { data, error } = await supabase
                        .from('products')
                        .select('*')
                        .eq('id', productId)
                        .single();

                    if (error) throw error;

                    // --- PERBAIKAN DI SINI ---
                    // Cek dulu apakah data produknya ada
                    if (data) {
                        setName(data.name);
                        setPrice(data.price);
                        setHpp(data.hpp || '');
                    } else {
                        // Jika tidak ada, lemparkan error agar ditangkap oleh blok catch
                        throw new Error(`Produk dengan ID ${productId} tidak ditemukan.`);
                    }
                    
                } catch (error) {
                    alert("Gagal memuat data: " + error.message);
                    navigate('/katalog'); // Arahkan kembali jika ada error/data tidak ditemukan
                } finally {
                    setIsLoading(false);
                }
            };
            fetchProduct();
        }
    }, [productId, isEditMode, navigate]);

    const handleSubmit = async (e) => {
        // ... (Fungsi handleSubmit tidak ada perubahan)
        e.preventDefault();
        if (!name || !price) {
            alert('Nama Produk dan Harga Jual wajib diisi.');
            return;
        }
        setIsSubmitting(true);
        let error = null;
        const productData = { name: name, price: parseFloat(price), hpp: hpp ? parseFloat(hpp) : 0 };
        if (isEditMode) {
            const { error: updateError } = await supabase.from('products').update(productData).eq('id', productId);
            error = updateError;
        } else {
            const { error: insertError } = await supabase.from('products').insert(productData);
            error = insertError;
        }
        setIsSubmitting(false);
        if (error) {
            alert(`Gagal menyimpan data: ${error.message}`);
        } else {
            alert(`Produk berhasil di${isEditMode ? 'update' : 'tambahkan'}!`);
            navigate('/katalog');
        }
    };

    if (isLoading) {
        return <div className="loading-container">Memuat data produk...</div>;
    }

    return (
        <div>
            {/* ... (JSX tidak ada perubahan) ... */}
            <div className="header">
                <div className="back-button" onClick={() => navigate('/katalog')}><img src="/icons/Arrow-Left-2.svg" alt="Back" /></div>
                <h1>{isEditMode ? 'Ubah Produk' : 'Tambah Produk'}</h1>
            </div>
            <div className="content" style={{padding: '20px'}}>
                <h2>Informasi Produk</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group" style={{marginBottom: '15px'}}>
                        <label htmlFor="nama-produk">Nama Produk</label>
                        <input type="text" id="nama-produk" value={name} onChange={(e) => setName(e.target.value)} placeholder="Cth: Kopi Susu Gula Aren" style={{width: '100%', padding: '8px', marginTop: '5px'}} />
                    </div>
                    <div className="form-group" style={{marginBottom: '15px'}}>
                        <label htmlFor="harga-jual">Harga Jual</label>
                        <input type="number" id="harga-jual" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Cth: 20000" style={{width: '100%', padding: '8px', marginTop: '5px'}} />
                    </div>
                    <div className="form-group" style={{marginBottom: '15px'}}>
                        <label htmlFor="harga-hpp">Harga Pokok (HPP) (Opsional)</label>
                        <input type="number" id="harga-hpp" value={hpp} onChange={(e) => setHpp(e.target.value)} placeholder="Cth: 10000" style={{width: '100%', padding: '8px', marginTop: '5px'}} />
                    </div>
                    <button type="submit" className="btn-simpan" disabled={isSubmitting} style={{width: '100%', padding: '12px', background: 'black', color: 'white', border: 'none', borderRadius: '8px'}}>
                        {isSubmitting ? 'Menyimpan...' : (isEditMode ? 'Update Produk' : 'Simpan Produk')}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default ProductForm;
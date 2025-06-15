import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabase';
import '../styles/input-manual.css';
import '../styles/animations.css';

function InputManual() {
    const navigate = useNavigate();
    
    const [namaProduk, setNamaProduk] = useState('');
    const [hargaJual, setHargaJual] = useState('');
    const [hargaHpp, setHargaHpp] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Character counters
    const [namaProdukCount, setNamaProdukCount] = useState(0);
    const [hargaJualCount, setHargaJualCount] = useState(0);
    const [hargaHppCount, setHargaHppCount] = useState(0);

    const handleNamaProdukChange = (e) => {
        const value = e.target.value;
        if (value.length <= 50) {
            setNamaProduk(value);
            setNamaProdukCount(value.length);
        }
    };

    const formatRupiah = (value) => {
        // Remove non-digits
        let numericValue = value.replace(/\D/g, '');
        
        if (numericValue.length > 0) {
            // Convert to number and format
            numericValue = parseInt(numericValue).toString();
            // Add thousand separators
            numericValue = numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
            return 'Rp ' + numericValue;
        }
        return '';
    };

    const parseRupiah = (rupiahString) => {
        if (!rupiahString) return 0;
        return parseInt(rupiahString.replace(/\D/g, '')) || 0;
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

    const handleSelesai = async () => {
        // Validation
        if (!namaProduk.trim()) {
            alert('Nama produk tidak boleh kosong');
            return;
        }

        const hargaJualValue = parseRupiah(hargaJual);
        if (!hargaJualValue || hargaJualValue <= 0) {
            alert('Harga jual harus diisi dengan benar');
            return;
        }

        const hargaHppValue = parseRupiah(hargaHpp);
        if (hargaHppValue < 0) {
            alert('Harga HPP tidak valid');
            return;
        }

        setIsSubmitting(true);

        try {
            // Create order object
            const order = {
                name: namaProduk.trim(),
                price: hargaJualValue,
                hpp: hargaHppValue,
                quantity: 1,
                date: new Date().toISOString(),
                transaction_id: `manual_${Date.now()}`
            };

            // Insert to orders table
            const { error } = await supabase
                .from('orders')
                .insert([order]);

            if (error) throw error;

            alert('Pesanan berhasil disimpan!');
            
            // Navigate back to kasir
            navigate('/');
            
        } catch (error) {
            console.error('Error:', error);
            alert('Terjadi kesalahan: ' + error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="input-manual-container">
            <div className="header">
                <div className="back-button" onClick={() => navigate('/')}>
                    <img src="/icons/Arrow-Left-2.svg" alt="Back" />
                    <h1>Input Manual</h1>
                </div>
                <button 
                    id="btn-selesai" 
                    className="btn-selesai"
                    onClick={handleSelesai}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Menyimpan...' : 'Selesai'}
                </button>
            </div>

            <div className="content">
                <h2>Informasi Produk</h2>

                <div className="form-container">
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
                            placeholder="Rp 00,00" 
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
                            placeholder="Rp 00,00" 
                            maxLength="50"
                            value={hargaHpp}
                            onChange={handleHargaHppChange}
                        />
                        <div className="char-counter">
                            <span id="harga-hpp-count">{hargaHppCount}</span>/50
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default InputManual;
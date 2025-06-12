import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import Cart from '../components/Cart';
import { useAuth } from '../contexts/AuthContext'; // <-- BARU: Impor useAuth
import '../styles/style.css';

function Kasir() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [cart, setCart] = useState([]);
    const [total, setTotal] = useState(0);

    // --- BARU ---
    const [isProcessing, setIsProcessing] = useState(false); // State untuk proses checkout
    const { user } = useAuth(); // Ambil data user yang login dari context

    // ... (useEffect untuk fetchProducts dan calculateTotal tidak berubah) ...
    useEffect(() => {
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
        fetchProducts();
    }, []);

    useEffect(() => {
        const newTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        setTotal(newTotal);
    }, [cart]);


    // ... (Fungsi addToCart, handleUpdateQuantity, handleRemoveItem tidak berubah) ...
    const addToCart = (productToAdd) => {
        const existingProductIndex = cart.findIndex(item => item.id === productToAdd.id);
        if (existingProductIndex !== -1) {
            const updatedCart = cart.map((item, index) =>
                index === existingProductIndex ? { ...item, quantity: item.quantity + 1 } : item
            );
            setCart(updatedCart);
        } else {
            setCart([...cart, { ...productToAdd, quantity: 1 }]);
        }
    };
    const handleUpdateQuantity = (productId, newQuantity) => {
        if (newQuantity <= 0) {
            handleRemoveItem(productId);
        } else {
            const updatedCart = cart.map(item => item.id === productId ? { ...item, quantity: newQuantity } : item);
            setCart(updatedCart);
        }
    };
    const handleRemoveItem = (productId) => {
        const updatedCart = cart.filter(item => item.id !== productId);
        setCart(updatedCart);
    };


    // --- BARU: Fungsi untuk memproses pesanan ke Supabase ---
    const handleProcessOrder = async () => {
        if (cart.length === 0) return; // Jangan proses jika keranjang kosong

        setIsProcessing(true); // Mulai proses, nonaktifkan tombol

        try {
            // 1. Masukkan data ke tabel 'orders'
            const { data: orderData, error: orderError } = await supabase
                .from('orders')
                .insert({
                    total_price: total,
                    user_name: user.name // Simpan nama kasir yang login
                })
                .select() // Minta data yang baru saja dimasukkan
                .single(); // Karena kita hanya memasukkan 1 order

            if (orderError) throw orderError;

            // 2. Siapkan data untuk tabel 'order_items'
            const orderItems = cart.map(item => ({
                order_id: orderData.id, // Ambil ID dari order yang baru dibuat
                product_id: item.id,
                quantity: item.quantity,
                price: item.price // Simpan harga saat transaksi
            }));

            // 3. Masukkan semua item keranjang ke tabel 'order_items'
            const { error: itemsError } = await supabase
                .from('order_items')
                .insert(orderItems);

            if (itemsError) throw itemsError;

            // Jika semua berhasil
            alert('Pesanan berhasil diproses!');
            setCart([]); // Kosongkan keranjang

        } catch (error) {
            console.error("Error processing order:", error);
            alert(`Gagal memproses pesanan: ${error.message}`);
        } finally {
            setIsProcessing(false); // Selesaikan proses, aktifkan kembali tombol
        }
    };

    if (loading) return <div className="loading-container">Memuat produk...</div>;
    if (error) return <div className="error-container">Error: {error}</div>;

    return (
        <div>
            {/* ... (Bagian header, search, product list tidak berubah) ... */}
             <div className="product-list">
                {products.map((product) => (
                    <div key={product.id} className="product-item" onClick={() => addToCart(product)}>
                        <img src={product.image_url || 'https://via.placeholder.com/150'} alt={product.name} />
                        <div className="product-details">
                            <h3>{product.name}</h3>
                            <p>Rp {product.price.toLocaleString('id-ID')}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* BARU: Kirim props onProcessOrder dan isProcessing */}
            <Cart 
                cartItems={cart}
                onUpdateQuantity={handleUpdateQuantity}
                onRemoveItem={handleRemoveItem}
                total={total}
                onProcessOrder={handleProcessOrder}
                isProcessing={isProcessing}
            />
        </div>
    );
}

export default Kasir;
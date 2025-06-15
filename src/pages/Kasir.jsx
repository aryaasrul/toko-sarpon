import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabase';
import { useAuth } from '../contexts/AuthContext';
import '../styles/kasir.css';

function Kasir() {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [cart, setCart] = useState({});
    const [total, setTotal] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState('Semua Produk');
    const [categories] = useState(['Semua Produk', 'semua produk', 'espresso based', 'Our signature', 'milk based', 'Non coffe']);
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        fetchProducts();
    }, []);

    useEffect(() => {
        filterProducts();
    }, [products, searchTerm, activeCategory]);

    useEffect(() => {
        calculateTotal();
    }, [cart]);

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

    const filterProducts = () => {
        let filtered = [...products];

        // Filter by search term
        if (searchTerm) {
            filtered = filtered.filter(product => 
                product.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Filter by category
        if (activeCategory !== 'Semua Produk' && activeCategory !== 'semua produk') {
            // Add category filtering logic here based on your product structure
            // For now, we'll show all products
        }

        setFilteredProducts(filtered);
    };

    const handleCategoryClick = (category) => {
        setActiveCategory(category);
    };

    const incrementQuantity = (product) => {
        setCart(prevCart => ({
            ...prevCart,
            [product.id]: {
                ...product,
                quantity: (prevCart[product.id]?.quantity || 0) + 1
            }
        }));
    };

    const decrementQuantity = (productId) => {
        setCart(prevCart => {
            const newCart = { ...prevCart };
            if (newCart[productId] && newCart[productId].quantity > 0) {
                newCart[productId].quantity -= 1;
                if (newCart[productId].quantity === 0) {
                    delete newCart[productId];
                }
            }
            return newCart;
        });
    };

    const calculateTotal = () => {
        const newTotal = Object.values(cart).reduce((sum, item) => 
            sum + (item.price * item.quantity), 0
        );
        setTotal(newTotal);
    };

    const handleProcessOrder = async () => {
        if (Object.keys(cart).length === 0) return;

        setIsProcessing(true);
        try {
            // Create order items array
            const orderItems = Object.values(cart).map(item => ({
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                hpp: item.hpp || 0,
                date: new Date().toISOString(),
                transaction_id: `txn_${Date.now()}`
            }));

            // Insert to orders table
            const { error } = await supabase
                .from('orders')
                .insert(orderItems);

            if (error) throw error;

            alert('Pesanan berhasil diproses!');
            setCart({});
        } catch (error) {
            console.error("Error processing order:", error);
            alert(`Gagal memproses pesanan: ${error.message}`);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleInputManual = () => {
        navigate('/input-manual');
    };

    if (loading) return <div className="loading-container">Memuat produk...</div>;
    if (error) return <div className="error-container">Error: {error}</div>;

    return (
        <div className="kasir-container">
            {/* Header */}
            <div className="header">
                <h1>Kasir</h1>
                <div className="header-actions">
                    <span className="user-name">{user?.name || 'User'}</span>
                    <button className="logout-btn" onClick={logout}>Logout</button>
                    <button className="btn-input-manual" onClick={handleInputManual}>
                        <img src="/icons/icon-plus-input-manual.svg" alt="Plus" />
                        Input Manual
                    </button>
                </div>
            </div>

            {/* Search Bar */}
            <div className="search-bar">
                <input 
                    type="text" 
                    placeholder="Cari Produk"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Categories */}
            <div className="categories">
                {categories.map((category) => (
                    <button 
                        key={category}
                        className={`category ${activeCategory === category ? 'active' : ''}`}
                        onClick={() => handleCategoryClick(category)}
                    >
                        {category}
                    </button>
                ))}
            </div>

            {/* Product List */}
            <div className="product-list">
                {filteredProducts.map((product) => (
                    <div key={product.id} className="product-card">
                        <div className="product-info">
                            <div className="product-image"></div>
                            <div className="product-details">
                                <h3>{product.name}</h3>
                                <p>Rp. {product.price.toLocaleString('id-ID')}</p>
                            </div>
                        </div>
                        <div className="quantity-control">
                            <button onClick={() => decrementQuantity(product.id)}>
                                <img src="/icons/icon-minus-circle.svg" alt="Minus" />
                            </button>
                            <span>{cart[product.id]?.quantity || 0}</span>
                            <button onClick={() => incrementQuantity(product)}>
                                <img src="/icons/icon-plus-circle.svg" alt="Plus" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Cart Summary */}
            <div className="cart-summary">
                <div className="cart-info">
                    <p>Total</p>
                    <p id="total-amount">Rp. {total.toLocaleString('id-ID')}</p>
                </div>
                <button 
                    id="btn-process" 
                    className="btn-process"
                    onClick={handleProcessOrder}
                    disabled={isProcessing || Object.keys(cart).length === 0}
                >
                    {isProcessing ? 'Memproses...' : 'Proses Pesanan'}
                </button>
            </div>
        </div>
    );
}

export default Kasir;
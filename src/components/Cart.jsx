import React from 'react';

// BARU: Tambahkan onProcessOrder dan isProcessing di props
function Cart({ cartItems, onUpdateQuantity, onRemoveItem, total, onProcessOrder, isProcessing }) {
    
    // Cek jika keranjang kosong
    if (cartItems.length === 0) {
        return (
            <div className="cart-summary">
                <div className="cart-empty">
                    <p>Keranjang masih kosong</p>
                </div>
                 <div className="cart-info">
                    <p>Total</p>
                    <p>Rp 0</p>
                </div>
                {/* Tombol dinonaktifkan jika keranjang kosong */}
                <button className="btn-process disabled" disabled>Proses Pesanan</button>
            </div>
        );
    }

    return (
        <div className="cart-summary">
            <div className="cart-items-list">
                {/* ... (bagian map item tidak berubah) ... */}
                {cartItems.map(item => (
                    <div key={item.id} className="cart-item">
                        <div className="item-info">
                            <span className="item-name">{item.name}</span>
                            <span className="item-price">Rp {(item.price * item.quantity).toLocaleString('id-ID')}</span>
                        </div>
                        <div className="item-controls">
                            <button disabled={isProcessing} onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}>-</button>
                            <span className="item-quantity">{item.quantity}</span>
                            <button disabled={isProcessing} onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}>+</button>
                            <button disabled={isProcessing} className="remove-btn" onClick={() => onRemoveItem(item.id)}>×</button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="cart-info">
                <p>Total</p>
                <p id="total-amount">Rp {total.toLocaleString('id-ID')}</p>
            </div>

            {/* BARU: Tambahkan onClick, disabled, dan teks dinamis pada tombol */}
            <button 
                id="btn-process" 
                className="btn-process" 
                onClick={onProcessOrder}
                disabled={isProcessing}
            >
                {isProcessing ? 'Memproses...' : 'Proses Pesanan'}
            </button>
        </div>
    );
}

export default Cart;
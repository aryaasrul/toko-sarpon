// Versi final untuk: src/pages/Riwayat.jsx

import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import '../styles/riwayat.css';

function Riwayat() {
    const [groupedTransactions, setGroupedTransactions] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeDate, setActiveDate] = useState(null);

    const formatDate = (dateString) => {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('id-ID', options);
    };

    const formatTime = (dateString) => {
        const options = { hour: '2-digit', minute: '2-digit', hour12: false };
        return new Date(dateString).toLocaleTimeString('id-ID', options).replace('.',':');
    };

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const { data: orderItems, error } = await supabase
                    .from('orders')
                    .select('*')
                    .order('date', { ascending: false });

                if (error) throw error;
                
                const transactions = orderItems.reduce((acc, item) => {
                    const id = item.transaction_id;
                    if (!acc[id]) {
                        acc[id] = { items: [], total_price: 0, date: item.date };
                    }
                    acc[id].items.push(item);
                    acc[id].total_price += item.price;
                    return acc;
                }, {});

                const groupedByDate = Object.values(transactions).reduce((acc, tx) => {
                    const date = tx.date.split('T')[0];
                    if (!acc[date]) { acc[date] = []; }
                    acc[date].push(tx);
                    return acc;
                }, {});

                setGroupedTransactions(groupedByDate);

            } catch (err) {
                setError(err.message);
                console.error("Error fetching history:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, []);

    const toggleAccordion = (date) => {
        setActiveDate(activeDate === date ? null : date);
    };

    if (loading) return <div className="loading-container">Memuat riwayat...</div>;
    if (error) return <div className="error-container">Error: {error}</div>;

    return (
        <div>
            <div className="header"><h1>Riwayat</h1></div>
            <div className="tab-container">
                <button className="tab-btn active">Pemasukan</button>
                <button className="tab-btn">Pengeluaran</button>
            </div>
            <div className="order-list">
                {Object.keys(groupedTransactions).length === 0 && !loading && (
                    <p style={{textAlign: 'center', marginTop: '50px'}}>Belum ada riwayat transaksi.</p>
                )}
                {Object.keys(groupedTransactions).map(date => (
                    <div key={date} className="date-group">
                        <button className="accordion-header" onClick={() => toggleAccordion(date)}>
                            <span>{formatDate(date)}</span>
                            <span>{activeDate === date ? '-' : '+'}</span>
                        </button>
                        {activeDate === date && (
                            <div className="accordion-content">
                                {groupedTransactions[date].map(tx => (
                                    <div key={tx.items[0].transaction_id} className="order-card">
                                        <div className="order-summary">
                                            <span>Waktu: {formatTime(tx.date)}</span>
                                            <span className="total">Total: Rp {tx.total_price.toLocaleString('id-ID')}</span>
                                        </div>
                                        <div className="order-details">
                                            <strong>Detail Item:</strong>
                                            <ul>
                                                {tx.items.map((item) => (
                                                    <li key={item.id}>
                                                        {item.quantity}x {item.name}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Riwayat;
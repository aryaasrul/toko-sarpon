import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../styles/login.css';

function Login() {
    const [name, setName] = useState(localStorage.getItem('posUserName') || '');
    const [code, setCode] = useState('');
    const [remember, setRemember] = useState(localStorage.getItem('posRememberMe') === 'true');
    const [error, setError] = useState('');
    const [isPasswordShown, setIsPasswordShown] = useState(false);
    const { login, user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            navigate('/');
        }
    }, [user, navigate]);

    const handleLogin = (e) => {
        e.preventDefault();
        const success = login(name, code, remember);
        if (success) {
            navigate('/loading');
        } else {
            setError('Nama atau Kode Rahasia salah!');
        }
    };

    return (
        <div className="login-container">
            <h1>Part of Terang</h1>
            <form onSubmit={handleLogin}>
                <div className="form-group">
                    <label htmlFor="nama">Nama</label>
                    <input type="text" id="nama" placeholder="Your Name" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                <div className="form-group">
                    <label htmlFor="kode">Kode</label>
                    <div className="password-container">
                        <input type={isPasswordShown ? 'text' : 'password'} id="kode" placeholder="Tulis Kode Rahasia Dari Mas Arya" value={code} onChange={(e) => setCode(e.target.value)} required />
                        <button type="button" className="toggle-password" onClick={() => setIsPasswordShown(!isPasswordShown)}>
                            <img src={isPasswordShown ? "/icons/eye-slash.svg" : "/icons/eye.svg"} alt="Toggle Password" />
                        </button>
                    </div>
                </div>
                <div className="remember-me">
                    <input type="checkbox" id="remember" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
                    <label htmlFor="remember">Remember me?</label>
                </div>
                <button type="submit" className="btn-login">Masuk geys</button>
                {error && <p className="error-message">{error}</p>}
            </form>
        </div>
    );
}

export default Login;
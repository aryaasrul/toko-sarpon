import React from 'react';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Loading from './pages/Loading';
import Kasir from './pages/Kasir';
import InputManual from './pages/InputManual';
import Katalog from './pages/Katalog';
import ProductForm from './pages/ProductForm';
import Riwayat from './pages/Riwayat';
import './App.css';

// Komponen Layout untuk Halaman dengan Navbar
const AppLayout = () => {
  return (
    <div className="app-layout">
      <main className="app-content">
        <Outlet />
      </main>
      <Navbar />
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Rute tanpa Navbar */}
          <Route path="/login" element={<Login />} />
          <Route path="/loading" element={<Loading />} />
          
          {/* Rute dengan Navbar (protected) */}
          <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
            <Route path="/" element={<Kasir />} />
            <Route path="/input-manual" element={<InputManual />} />
            <Route path="/katalog" element={<Katalog />} />
            <Route path="/katalog/tambah" element={<ProductForm />} />
            <Route path="/katalog/edit/:productId" element={<ProductForm />} />
            <Route path="/riwayat" element={<Riwayat />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
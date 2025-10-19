import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import Layout from './components/Layout/Layout';
import HomePage from './pages/HomePage';
import CatalogPage from './pages/CatalogPage';
import BookDetailsPage from './pages/BookDetailsPage';
import CartPage from './pages/CartPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import AuthorsPage from './pages/AuthorsPage';
import NotFoundPage from './pages/NotFoundPage';
export function App() {
  return <ThemeProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/categories" element={<CatalogPage />} />
            <Route path="/categories/:category" element={<CatalogPage />} />
            <Route path="/best-sellers" element={<CatalogPage bestSellers={true} />} />
            <Route path="/new-arrivals" element={<CatalogPage newArrivals={true} />} />
            <Route path="/authors" element={<AuthorsPage />} />
            <Route path="/book/:id" element={<BookDetailsPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Layout>
      </Router>
    </ThemeProvider>;
}
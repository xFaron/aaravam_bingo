import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import BingoPage from './components/BingoPage';
import './App.css'; // Add some basic styling

function App() {
  const ProtectedRoute = ({ children }) => {
    const userName = localStorage.getItem('bingoUserName');
    return userName ? children : <Navigate to="/" />;
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/bingo" element={
          <ProtectedRoute>
            <BingoPage />
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;
import React from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { AdminScreen } from '../components/AdminScreen';
import { StatsScreen } from '../components/StatsScreen';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';

export const AdminRoute: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const { allResponses, teachers } = useApp();

  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  const handleGoHome = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-indigo-600">Panel de Administración</h1>
            </div>
            <div className="flex items-center">
              <button
                onClick={handleGoHome}
                className="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Volver al Inicio
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Routes>
          <Route path="/" element={<AdminScreen onSave={() => {}} onBackToHome={handleGoHome} />} />
          <Route path="/stats" element={
            <StatsScreen 
              responses={allResponses} 
              teachers={teachers} 
              onBackToHome={() => navigate('/admin')} 
            />
          } />
        </Routes>
      </div>
    </div>
  );
};
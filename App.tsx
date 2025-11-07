import React from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { AuthProvider } from './context/AuthContext';
import { HomeRoute } from './routes/HomeRoute';
import { QuizRoute } from './routes/QuizRoute';
import { AdminRoute } from './routes/AdminRoute';
import { ThankYouScreen } from './components/ThankYouScreen';
import { AllCompletedScreen } from './components/AllCompletedScreen';
import { useApp } from './context/AppContext';

const ThankYouRoute: React.FC = () => {
  const navigate = useNavigate();
  return <ThankYouScreen onBackToHome={() => navigate('/')} />;
};

const CompletedRoute: React.FC = () => {
  const navigate = useNavigate();
  const { studentId, selectedGrade, clearStudent } = useApp();

  const handleFinish = () => {
    clearStudent();
    navigate('/');
  };

  return (
    <AllCompletedScreen 
      studentName={studentId || 'Estudiante'}
      grade={selectedGrade || ''}
      onFinishSession={handleFinish}
    />
  );
};

const App: React.FC = () => {
  React.useEffect(() => {
    // Initialize data on app start
    import('./services/dataService').then(dataService => {
      dataService.initializeData();
    });
  }, []);

  return (
    <AuthProvider>
      <AppProvider>
        <Routes>
          <Route path="/" element={<HomeRoute />} />
          <Route path="/grade-select" element={<HomeRoute />} />
          <Route path="/quiz/:teacherId" element={<QuizRoute />} />
          <Route path="/admin/*" element={<AdminRoute />} />
          <Route path="/thankyou" element={<ThankYouRoute />} />
          <Route path="/completed" element={<CompletedRoute />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AppProvider>
    </AuthProvider>
  );
};

export default App;
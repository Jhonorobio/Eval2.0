import React from 'react';
import { useNavigate } from 'react-router-dom';
import { StatsScreen } from '../components/StatsScreen';
import { useApp } from '../context/AppContext';

export const StatsRoute: React.FC = () => {
  const navigate = useNavigate();
  const { allResponses, teachers, clearStudent } = useApp();

  return (
    <StatsScreen 
      responses={allResponses}
      teachers={teachers}
      onBackToHome={() => {
        clearStudent();
        navigate('/');
      }}
    />
  );
};
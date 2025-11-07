import React from 'react';
import { useNavigate } from 'react-router-dom';
import { WelcomeScreen } from '../components/WelcomeScreen';
import { GradeSelectionScreen } from '../components/GradeSelectionScreen';
import { Grade } from '../types';
import { useApp } from '../context/AppContext';
import { GRADES } from '../constants';
import { useQuiz } from '../hooks/useQuiz';

export const HomeRoute: React.FC = () => {
  const navigate = useNavigate();
  const {
    teachers,
    studentId,
    selectedGrade,
    inProgressQuiz,
    completedTeachers,
    setStudentId,
    setSelectedGrade,
    setInProgressQuiz,
    clearStudent
  } = useApp();
  const { startQuiz } = useQuiz();

  const handleSelectStudent = (name: string) => {
    setStudentId(name);
    navigate('/grade-select');
  };

  const handleSelectGrade = (grade: Grade) => {
    setSelectedGrade(grade);
    navigate('/');
  };

  const handleResumeQuiz = () => {
    if (inProgressQuiz) {
      navigate('/quiz');
    }
  };

  const handleDiscardQuiz = () => {
    if (studentId) {
      localStorage.removeItem(`inProgressQuiz_${studentId}`);
      setInProgressQuiz(null);
    }
  };

  // Si no hay studentId, mostrar pantalla de selección de estudiante
  if (!studentId) {
    return (
      <WelcomeScreen 
        teachers={teachers}
        onStartQuiz={() => {}} // No usado en esta vista
        onShowStats={() => navigate('/stats')}
        onGoToAdmin={() => navigate('/admin')}
        inProgressQuiz={null}
        onResumeQuiz={() => {}}
        onDiscardQuiz={() => {}}
        selectedGrade={null}
        completedTeachers={[]}
        studentId={null}
        onSelectStudent={handleSelectStudent}
        onClearStudent={clearStudent}
        onBackToGradeSelect={() => navigate('/grade-select')}
      />
    );
  }

  // Si hay studentId pero no hay grado seleccionado, mostrar selección de grado
  if (!selectedGrade) {
    return (
      <GradeSelectionScreen 
        studentId={studentId}
        grades={GRADES}
        onSelectGrade={handleSelectGrade}
        onClearStudent={clearStudent}
      />
    );
  }

  // Si hay studentId y grado, mostrar pantalla principal con profesores
  return (
    <WelcomeScreen 
      teachers={teachers}
      onStartQuiz={(teacher, grade) => {
        startQuiz(teacher, grade);
        navigate(`/quiz/${teacher.id}`);
      }}
      onShowStats={() => navigate('/stats')}
      onGoToAdmin={() => navigate('/admin')}
      inProgressQuiz={inProgressQuiz}
      onResumeQuiz={handleResumeQuiz}
      onDiscardQuiz={handleDiscardQuiz}
      selectedGrade={selectedGrade}
      completedTeachers={completedTeachers}
      studentId={studentId}
      onSelectStudent={handleSelectStudent}
      onClearStudent={clearStudent}
      onBackToGradeSelect={() => navigate('/grade-select')}
    />
  );
};
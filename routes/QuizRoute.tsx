import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { QuizScreen } from '../components/QuizScreen';
import { useApp } from '../context/AppContext';
import { useQuiz } from '../hooks/useQuiz';

export const QuizRoute: React.FC = () => {
  const navigate = useNavigate();
  const { teacherId } = useParams<{ teacherId: string }>();
  const { studentId, selectedGrade, teachers } = useApp();
  const { submitQuiz, currentQuestions, inProgressQuiz } = useQuiz();

  const selectedTeacher = teachers.find(t => t.id === teacherId);

  if (!selectedTeacher || !selectedGrade || !studentId || currentQuestions.length === 0) {
    navigate('/');
    return null;
  }

  return (
    <QuizScreen 
      teacher={selectedTeacher}
      grade={selectedGrade}
      studentId={studentId}
      questions={currentQuestions}
      onSubmit={(answers) => submitQuiz(answers, selectedGrade)}
      onBack={() => navigate('/')}
      initialAnswers={inProgressQuiz?.answers || []}
      initialQuestionIndex={inProgressQuiz?.currentQuestionIndex || 0}
    />
  );
};
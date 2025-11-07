import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Teacher, Grade, Answer, InProgressQuiz, Question } from '../types';
import { useApp } from '../context/AppContext';
import { PRIMARY_GRADES } from '../constants';

export const useQuiz = () => {
  const navigate = useNavigate();
  const {
    primaryQuestions,
    secondaryQuestions,
    studentId,
    inProgressQuiz,
    setInProgressQuiz,
    addResponse,
    saveTeacherCompletion,
    teachers,
    setError,
  } = useApp();

  const [currentQuestions, setCurrentQuestions] = useState<Question[]>([]);

  useEffect(() => {
    if (inProgressQuiz) {
      setCurrentQuestions(inProgressQuiz.questions);
    }
  }, [inProgressQuiz]);

  const startQuiz = useCallback(async (teacher: Teacher, grade: Grade, subjectId: string) => {
    if (!studentId) return;
    
    setError(null);
    try {
      const isPrimary = PRIMARY_GRADES.includes(grade);
      const questions = isPrimary ? primaryQuestions : secondaryQuestions;

      setCurrentQuestions(questions);
      
      const quizState: InProgressQuiz = {
        teacher,
        grade,
        questions,
        answers: [],
        currentQuestionIndex: 0
      };
      
      localStorage.setItem(`inProgressQuiz_${studentId}`, JSON.stringify(quizState));
      setInProgressQuiz(quizState);
    } catch (err) {
      setError('No se pudieron cargar las preguntas. Por favor, inténtalo de nuevo.');
      navigate('/');
    }
  }, [studentId, primaryQuestions, secondaryQuestions, setInProgressQuiz, setError, navigate]);

  const submitQuiz = useCallback((answers: Answer[], grade: Grade) => {
    if (!inProgressQuiz || !studentId) return;

    const { teacher: selectedTeacher } = inProgressQuiz;

    const newResponse = {
      teacherId: selectedTeacher.id,
      grade,
      studentId,
      subjectId: selectedTeacher.subjects[0].id,
      responseId: `${studentId}-${selectedTeacher.id}-${selectedTeacher.subjects[0].id}-${grade}-${Date.now()}`,
      answers,
    };

    addResponse(newResponse);
    saveTeacherCompletion(`${selectedTeacher.id}_${selectedTeacher.subjects[0].id}`, grade);
    
    if (localStorage.getItem(`inProgressQuiz_${studentId}`)) {
      localStorage.removeItem(`inProgressQuiz_${studentId}`);
      setInProgressQuiz(null);
    }

    const teachersForGrade = teachers.filter(t => t.gradesTaught.includes(grade));
    const isGradeCompleted = teachersForGrade.every(t => {
      const key = `completed_${studentId}_${grade}`;
      const completed = localStorage.getItem(key);
      return completed ? JSON.parse(completed).includes(t.id) : false;
    });

    navigate(isGradeCompleted ? '/completed' : '/thankyou');
  }, [inProgressQuiz, studentId, addResponse, saveTeacherCompletion, setInProgressQuiz, teachers, navigate]);

  return {
    startQuiz,
    submitQuiz,
    currentQuestions,
    inProgressQuiz,
  };
};
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Teacher, Grade, Question, QuizResponse, InProgressQuiz } from '../types';
import * as dataService from '../services/dataService';

interface AppContextType {
  // State
  teachers: Teacher[];
  primaryQuestions: Question[];
  secondaryQuestions: Question[];
  allResponses: QuizResponse[];
  studentId: string | null;
  selectedGrade: Grade | null;
  inProgressQuiz: InProgressQuiz | null;
  completedTeachers: string[];
  error: string | null;
  
  // Actions
  setStudentId: (id: string | null) => void;
  setSelectedGrade: (grade: Grade | null) => void;
  setInProgressQuiz: (quiz: InProgressQuiz | null) => void;
  addResponse: (response: QuizResponse) => void;
  clearStudent: () => void;
  setError: (error: string | null) => void;
  saveTeacherCompletion: (teacherId: string, grade: Grade) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [primaryQuestions, setPrimaryQuestions] = useState<Question[]>([]);
  const [secondaryQuestions, setSecondaryQuestions] = useState<Question[]>([]);
  const [allResponses, setAllResponses] = useState<QuizResponse[]>([]);
  const [studentId, setStudentId] = useState<string | null>(null);
  const [selectedGrade, setSelectedGrade] = useState<Grade | null>(null);
  const [inProgressQuiz, setInProgressQuiz] = useState<InProgressQuiz | null>(null);
  const [completedTeachers, setCompletedTeachers] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Initialize data on mount
  useEffect(() => {
    dataService.initializeData();
    setTeachers(dataService.getTeachers());
    setPrimaryQuestions(dataService.getPrimaryQuestions());
    setSecondaryQuestions(dataService.getSecondaryQuestions());
    setAllResponses(dataService.getResponses());
  }, []);

  // Load in-progress quiz when studentId changes
  useEffect(() => {
    if (!studentId) return;
    try {
      const savedQuiz = localStorage.getItem(`inProgressQuiz_${studentId}`);
      if (savedQuiz) {
        setInProgressQuiz(JSON.parse(savedQuiz));
      } else {
        setInProgressQuiz(null);
      }
    } catch (error) {
      console.error("Error al cargar el cuestionario en progreso:", error);
      if (studentId) localStorage.removeItem(`inProgressQuiz_${studentId}`);
    }
  }, [studentId]);

  // Load completed teachers when grade/student changes
  useEffect(() => {
    if (selectedGrade && studentId) {
      try {
        const completed = localStorage.getItem(`completed_${studentId}_${selectedGrade}`);
        if (completed) {
          setCompletedTeachers(JSON.parse(completed));
        } else {
          setCompletedTeachers([]);
        }
      } catch (error) {
        console.error("Error al cargar profesores completados:", error);
        setCompletedTeachers([]);
      }
    } else {
      setCompletedTeachers([]);
    }
  }, [selectedGrade, studentId]);

  const addResponse = (response: QuizResponse) => {
    const updatedResponses = [...allResponses, response];
    setAllResponses(updatedResponses);
    dataService.saveResponses(updatedResponses);
  };

  const clearStudent = () => {
    setStudentId(null);
    setSelectedGrade(null);
    setInProgressQuiz(null);
    setCompletedTeachers([]);
  };

  const saveTeacherCompletion = (teacherId: string, grade: Grade) => {
    if (!studentId) return;
    const updatedCompleted = [...completedTeachers, teacherId];
    setCompletedTeachers(updatedCompleted);
    try {
      localStorage.setItem(`completed_${studentId}_${grade}`, JSON.stringify(updatedCompleted));
    } catch (error) {
      console.error("Error guardando profesores completados:", error);
    }
  };

  return (
    <AppContext.Provider value={{
      teachers,
      primaryQuestions,
      secondaryQuestions,
      allResponses,
      studentId,
      selectedGrade,
      inProgressQuiz,
      completedTeachers,
      error,
      setStudentId,
      setSelectedGrade,
      setInProgressQuiz,
      addResponse,
      clearStudent,
      setError,
      saveTeacherCompletion
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
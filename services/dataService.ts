import { Teacher, Question, QuizResponse } from '../types';
import { INITIAL_TEACHERS, INITIAL_PRIMARY_QUESTIONS, INITIAL_SECONDARY_QUESTIONS } from '../data/initialData';

const TEACHERS_KEY = 'evaluation_teachers';
const PRIMARY_QUESTIONS_KEY = 'evaluation_primary_questions';
const SECONDARY_QUESTIONS_KEY = 'evaluation_secondary_questions';
const RESPONSES_KEY = 'evaluation_responses';

// --- Initialization ---
export const initializeData = () => {
  // Para profesores, convertir datos antiguos al nuevo formato si existen
  const existingTeachers = localStorage.getItem(TEACHERS_KEY);
  if (existingTeachers) {
    try {
      const teachers = JSON.parse(existingTeachers);
      // Verificar si los datos están en el formato antiguo (con subject en lugar de subjects)
      if (teachers.length > 0 && 'subject' in teachers[0]) {
        const updatedTeachers = teachers.map((t: any) => ({
          ...t,
          subjects: [{ id: `s${Date.now()}-${t.id}`, name: t.subject }],
        }));
        localStorage.setItem(TEACHERS_KEY, JSON.stringify(updatedTeachers));
      }
    } catch (e) {
      console.error('Error parsing teachers data:', e);
      localStorage.setItem(TEACHERS_KEY, JSON.stringify(INITIAL_TEACHERS));
    }
  } else {
    localStorage.setItem(TEACHERS_KEY, JSON.stringify(INITIAL_TEACHERS));
  }

  if (!localStorage.getItem(PRIMARY_QUESTIONS_KEY)) {
    localStorage.setItem(PRIMARY_QUESTIONS_KEY, JSON.stringify(INITIAL_PRIMARY_QUESTIONS));
  }
  if (!localStorage.getItem(SECONDARY_QUESTIONS_KEY)) {
    localStorage.setItem(SECONDARY_QUESTIONS_KEY, JSON.stringify(INITIAL_SECONDARY_QUESTIONS));
  }
  if (!localStorage.getItem(RESPONSES_KEY)) {
    localStorage.setItem(RESPONSES_KEY, JSON.stringify([]));
  }
};

// --- Teachers ---
export const getTeachers = (): Teacher[] => {
  const data = localStorage.getItem(TEACHERS_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveTeachers = (teachers: Teacher[]) => {
  localStorage.setItem(TEACHERS_KEY, JSON.stringify(teachers));
};

// --- Questions ---
export const getPrimaryQuestions = (): Question[] => {
  const data = localStorage.getItem(PRIMARY_QUESTIONS_KEY);
  return data ? JSON.parse(data) : [];
};

export const savePrimaryQuestions = (questions: Question[]) => {
  localStorage.setItem(PRIMARY_QUESTIONS_KEY, JSON.stringify(questions));
};

export const getSecondaryQuestions = (): Question[] => {
  const data = localStorage.getItem(SECONDARY_QUESTIONS_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveSecondaryQuestions = (questions: Question[]) => {
  localStorage.setItem(SECONDARY_QUESTIONS_KEY, JSON.stringify(questions));
};

// --- Responses ---
export const getResponses = (): QuizResponse[] => {
  const data = localStorage.getItem(RESPONSES_KEY);
  return data ? JSON.parse(data) : [];
}

export const saveResponses = (responses: QuizResponse[]) => {
  localStorage.setItem(RESPONSES_KEY, JSON.stringify(responses));
}

export const clearAllResponses = () => {
  // Limpiar las respuestas
  localStorage.setItem(RESPONSES_KEY, JSON.stringify([]));
  
  // Limpiar todos los datos relacionados con evaluaciones en progreso y completadas
  const keysToRemove = [];
  
  // Buscar todas las claves en localStorage que estén relacionadas con evaluaciones
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && (
      key.startsWith('inProgressQuiz_') || // Evaluaciones en progreso
      key.startsWith('completedTeachers_') || // Registro de profesores evaluados
      key.startsWith('student_') // Cualquier dato relacionado con estudiantes
    )) {
      keysToRemove.push(key);
    }
  }
  
  // Eliminar todas las claves encontradas
  keysToRemove.forEach(key => localStorage.removeItem(key));
};

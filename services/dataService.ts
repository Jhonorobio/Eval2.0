import { Teacher, Question, QuizResponse } from '../types';
import { supabase } from './supabaseClient';

// --- Teachers ---
export const getTeachers = async (): Promise<Teacher[]> => {
  const { data, error } = await supabase
    .from('teachers')
    .select('*');
  
  if (error) {
    console.error('Error fetching teachers:', error);
    return [];
  }
  
  return data || [];
};

export const saveTeachers = async (teachers: Teacher[]) => {
  const { error } = await supabase
    .from('teachers')
    .upsert(teachers);
    
  if (error) {
    console.error('Error saving teachers:', error);
  }
};

// --- Questions ---
export const getPrimaryQuestions = async (): Promise<Question[]> => {
  const { data, error } = await supabase
    .from('questions')
    .select('*')
    .eq('type', 'primary');
  
  if (error) {
    console.error('Error fetching primary questions:', error);
    return [];
  }
  
  return data || [];
};

export const getSecondaryQuestions = async (): Promise<Question[]> => {
  const { data, error } = await supabase
    .from('questions')
    .select('*')
    .eq('type', 'secondary');
  
  if (error) {
    console.error('Error fetching secondary questions:', error);
    return [];
  }
  
  return data || [];
};

export const savePrimaryQuestions = async (questions: Question[]) => {
  const { error } = await supabase
    .from('questions')
    .upsert(questions.map(q => ({ ...q, type: 'primary' })));
    
  if (error) {
    console.error('Error saving primary questions:', error);
  }
};

export const saveSecondaryQuestions = async (questions: Question[]) => {
  const { error } = await supabase
    .from('questions')
    .upsert(questions.map(q => ({ ...q, type: 'secondary' })));
    
  if (error) {
    console.error('Error saving secondary questions:', error);
  }
};

// --- Responses ---
export const getResponses = async (): Promise<QuizResponse[]> => {
  const { data, error } = await supabase
    .from('quiz_answers')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching responses:', error);
    return [];
  }
  
  return data || [];
};

export const saveResponses = async (responses: QuizResponse[]) => {
  const { error } = await supabase
    .from('quiz_answers')
    .upsert(responses);
    
  if (error) {
    console.error('Error saving responses:', error);
  }
};

export const clearAllResponses = async () => {
  // Borrar todas las respuestas
  const { error: answersError } = await supabase
    .from('quiz_answers')
    .delete()
    .neq('id', 0);
    
  if (answersError) {
    console.error('Error clearing responses:', answersError);
    return;
  }
  
  // Borrar todo el progreso de estudiantes
  const { error: progressError } = await supabase
    .from('student_progress')
    .delete()
    .neq('student_id', '');
    
  if (progressError) {
    console.error('Error clearing student progress:', progressError);
  }
};

// --- Student Progress ---
export const getStudentProgress = async (studentId: string): Promise<string[]> => {
  const { data, error } = await supabase
    .from('student_progress')
    .select('completed_evaluations')
    .eq('student_id', studentId)
    .single();
  
  if (error) {
    console.error('Error fetching student progress:', error);
    return [];
  }
  
  return data?.completed_evaluations || [];
};

export const updateStudentProgress = async (studentId: string, completedEvaluations: string[]) => {
  const { error } = await supabase
    .from('student_progress')
    .upsert({
      student_id: studentId,
      completed_evaluations: completedEvaluations
    });
    
  if (error) {
    console.error('Error updating student progress:', error);
  }
};

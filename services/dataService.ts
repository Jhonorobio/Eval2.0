import { Teacher, Question, QuizResponse } from '../types';
import { supabase } from './supabaseClient';
import { INITIAL_TEACHERS, INITIAL_PRIMARY_QUESTIONS, INITIAL_SECONDARY_QUESTIONS } from '../data/initialData';

// Initialize DB with initial data if tables are empty. This keeps backward
// compatibility with previous behavior where initial data lived in localStorage.
export const initializeData = async () => {
  try {
    // Seed teachers if table empty
    const { data: teacherSample, error: teacherErr } = await supabase
      .from('teachers')
      .select('id')
      .limit(1);
    if (teacherErr) console.error('Error checking teachers table:', teacherErr);
    if (!teacherSample || teacherSample.length === 0) {
      const { error } = await supabase.from('teachers').upsert(INITIAL_TEACHERS);
      if (error) console.error('Error seeding teachers:', error);
    }

    // Seed primary questions if none
    const { data: primarySample, error: pErr } = await supabase
      .from('questions')
      .select('id')
      .eq('type', 'primary')
      .limit(1);
    if (pErr) console.error('Error checking primary questions:', pErr);
    if (!primarySample || primarySample.length === 0) {
      const { error } = await supabase.from('questions').upsert(INITIAL_PRIMARY_QUESTIONS.map(q => ({ ...q, type: 'primary' })));
      if (error) console.error('Error seeding primary questions:', error);
    }

    // Seed secondary questions if none
    const { data: secondarySample, error: sErr } = await supabase
      .from('questions')
      .select('id')
      .eq('type', 'secondary')
      .limit(1);
    if (sErr) console.error('Error checking secondary questions:', sErr);
    if (!secondarySample || secondarySample.length === 0) {
      const { error } = await supabase.from('questions').upsert(INITIAL_SECONDARY_QUESTIONS.map(q => ({ ...q, type: 'secondary' })));
      if (error) console.error('Error seeding secondary questions:', error);
    }
  } catch (e) {
    console.error('initializeData error:', e);
  }
};

// --- Teachers ---
export const getTeachers = async (): Promise<Teacher[]> => {
  const { data, error } = await supabase
    .from('teachers')
    .select('*');
  
  if (error) {
    console.error('Error fetching teachers:', error);
    return [];
  }
  
  // Map DB rows to the app's Teacher shape. The DB currently stores minimal fields
  // (id, name, avatar). The frontend expects `subjects` and `gradesTaught` arrays,
  // so provide sensible defaults to avoid runtime errors.
  return (data || []).map((row: any) => ({
    id: row.id,
    name: row.name,
    avatar: row.avatar || '',
    subjects: row.subjects || [],
    gradesTaught: row.grades_taught || []
  }));
};

export const saveTeachers = async (teachers: Teacher[]) => {
  try {
    // First attempt: upsert full payload including subjects and grades_taught.
    // This requires the table to have `subjects jsonb` and `grades_taught text[]`.
    const fullPayload = teachers.map(t => ({
      id: t.id,
      name: t.name,
      avatar: t.avatar || '',
      subjects: t.subjects || [],
      grades_taught: t.gradesTaught || []
    }));

    const { data: fullData, error: fullError } = await supabase
      .from('teachers')
      .upsert(fullPayload, { onConflict: 'id' });

    if (!fullError) {
      return fullData;
    }

    // If the error indicates unknown columns or schema mismatch, fall back
    // to a minimal upsert (id, name, avatar). This keeps behavior safe for
    // older schemas.
    console.warn('Full upsert failed, falling back to minimal upsert:', fullError);

    const minimalPayload = teachers.map(t => ({ id: t.id, name: t.name, avatar: t.avatar || '' }));
    const { data: minData, error: minError } = await supabase
      .from('teachers')
      .upsert(minimalPayload, { onConflict: 'id' });

    if (minError) {
      console.error('Error saving teachers (minimal fallback):', minError);
      throw minError;
    }

    return minData;
  } catch (e) {
    console.error('saveTeachers unexpected error:', e);
    throw e;
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

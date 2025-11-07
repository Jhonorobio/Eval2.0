import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'TU_URL_DE_SUPABASE';
const supabaseKey = 'TU_ANON_KEY_DE_SUPABASE';

export const supabase = createClient(supabaseUrl, supabaseKey);

// Interfaces para las tablas
export interface TeacherRow {
  id: string;
  name: string;
  avatar: string;
  created_at?: string;
}

export interface TeacherSubjectRow {
  id: string;
  teacher_id: string;
  subject_name: string;
  created_at?: string;
}

export interface TeacherGradeRow {
  id: string;
  teacher_id: string;
  grade: string;
  created_at?: string;
}

export interface QuizResponseRow {
  id: string;
  teacher_id: string;
  subject_id: string;
  student_id: string;
  grade: string;
  created_at?: string;
}

export interface QuizAnswerRow {
  id: string;
  response_id: string;
  question_id: number;
  rating: number;
  created_at?: string;
}

// Funciones para interactuar con Supabase
export const supabaseService = {
  // Teachers
  async getTeachers() {
    const { data: teachers, error } = await supabase
      .from('teachers')
      .select(`
        *,
        teacher_subjects(id, subject_name),
        teacher_grades(grade)
      `);
    
    if (error) throw error;
    return teachers;
  },

  async saveTeacher(teacher: TeacherRow) {
    const { data, error } = await supabase
      .from('teachers')
      .insert(teacher)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Quiz Responses
  async saveQuizResponse(response: QuizResponseRow) {
    const { data, error } = await supabase
      .from('quiz_responses')
      .insert(response)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async saveQuizAnswers(answers: QuizAnswerRow[]) {
    const { data, error } = await supabase
      .from('quiz_answers')
      .insert(answers)
      .select();
    
    if (error) throw error;
    return data;
  },

  async getResponsesByStudent(studentId: string) {
    const { data, error } = await supabase
      .from('quiz_responses')
      .select(`
        *,
        quiz_answers(*)
      `)
      .eq('student_id', studentId);
    
    if (error) throw error;
    return data;
  },

  async getTeacherResponses(teacherId: string) {
    const { data, error } = await supabase
      .from('quiz_responses')
      .select(`
        *,
        quiz_answers(*)
      `)
      .eq('teacher_id', teacherId);
    
    if (error) throw error;
    return data;
  },

  // Helper function to check if a student has evaluated a teacher-subject combination
  async hasStudentEvaluated(studentId: string, teacherId: string, subjectId: string, grade: string) {
    const { data, error } = await supabase
      .from('quiz_responses')
      .select('id')
      .match({
        student_id: studentId,
        teacher_id: teacherId,
        subject_id: subjectId,
        grade: grade
      })
      .maybeSingle();
    
    if (error) throw error;
    return data !== null;
  }
};
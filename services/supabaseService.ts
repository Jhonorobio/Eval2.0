import { supabase } from '../config/supabase';
import { Teacher, Grade, QuizResponse, TeacherSubject } from '../types';

export const supabaseService = {
  // Teachers
  async getTeachers() {
    const { data: teachers, error } = await supabase
      .from('teachers')
      .select(`
        *,
        teacher_subjects (
          id,
          subject_name
        ),
        teacher_grades (
          grade
        )
      `);

    if (error) throw error;
    return teachers;
  },

  async saveTeacher(teacher: { id: string; name: string; avatar: string }) {
    const { data, error } = await supabase
      .from('teachers')
      .upsert(teacher)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async saveTeacherSubject(subject: { teacher_id: string; subject_name: string }) {
    const { data, error } = await supabase
      .from('teacher_subjects')
      .insert(subject)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async saveTeacherGrade(grade: { teacher_id: string; grade: string }) {
    const { data, error } = await supabase
      .from('teacher_grades')
      .insert(grade)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Quiz Responses
  async saveQuizResponse(response: {
    id: string;
    teacher_id: string;
    subject_id: string;
    student_id: string;
    grade: string;
  }) {
    const { data, error } = await supabase
      .from('quiz_responses')
      .insert(response)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async saveQuizAnswers(answers: Array<{
    response_id: string;
    question_id: number;
    rating: number;
  }>) {
    const { data, error } = await supabase
      .from('quiz_answers')
      .insert(answers)
      .select();

    if (error) throw error;
    return data;
  },

  async getAllResponses() {
    const { data, error } = await supabase
      .from('quiz_responses')
      .select(`
        *,
        quiz_answers (*)
      `);

    if (error) throw error;
    return data;
  },

  async hasStudentEvaluated(
    studentId: string,
    teacherId: string,
    subjectId: string,
    grade: string
  ) {
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
  },

  async deleteAllResponses() {
    const { error: answersError } = await supabase
      .from('quiz_answers')
      .delete();

    if (answersError) throw answersError;

    const { error: responsesError } = await supabase
      .from('quiz_responses')
      .delete();

    if (responsesError) throw responsesError;
  }
};
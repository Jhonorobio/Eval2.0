export type Grade = 'Preescolar' | '1º' | '2º' | '3º' | '4º' | '5º' | '6º' | '7º' | '8º' | '9º' | '10º' | '11º';

export interface TeacherSubject {
  id: string;
  name: string;
}

export interface Teacher {
  id: string;
  name: string;
  subjects: TeacherSubject[];
  avatar: string;
  gradesTaught: Grade[];
}

export interface Question {
  id: number;
  text: string;
}

export interface Answer {
  questionId: number;
  rating: number; 
}

export interface QuizResponse {
  teacherId: string;
  grade: Grade;
  studentId: string; // Now the student's name
  responseId: string; // Unique identifier for the response itself
  subjectId: string; // ID of the subject being evaluated
  subjectName: string; // Name of the subject being evaluated
  answers: Answer[];
  createdAt: string; // Timestamp of when the evaluation was made
}

// FIX: Add 'admin' to ViewState to allow navigation to the admin panel and resolve type errors.
export type ViewState = 'student_select' | 'grade_select' | 'welcome' | 'quiz' | 'stats' | 'thankyou' | 'loading' | 'all_completed' | 'admin';

export interface InProgressQuiz {
  teacher: Teacher;
  grade: Grade;
  questions: Question[];
  answers: Answer[];
  currentQuestionIndex: number;
}
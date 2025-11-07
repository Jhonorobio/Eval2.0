import React, { useState, useEffect } from 'react';
import { Teacher, Grade, Question, Answer, InProgressQuiz } from '../types';
import { RatingSystem } from './RatingSystem';

interface QuizScreenProps {
  teacher: Teacher;
  grade: Grade;
  studentId: string;
  questions: Question[];
  onSubmit: (answers: Answer[]) => void;
  onBack: () => void;
  initialAnswers?: Answer[];
  initialQuestionIndex?: number;
}

export const QuizScreen: React.FC<QuizScreenProps> = ({ teacher, grade, studentId, questions, onSubmit, onBack, initialAnswers = [], initialQuestionIndex = 0 }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(initialQuestionIndex);
  const [answers, setAnswers] = useState<Answer[]>(initialAnswers);

  useEffect(() => {
    const quizState: InProgressQuiz = {
      teacher,
      grade,
      questions,
      answers,
      currentQuestionIndex,
    };
    if (questions && questions.length > 0 && studentId) {
        localStorage.setItem(`inProgressQuiz_${studentId}`, JSON.stringify(quizState));
    }
  }, [answers, currentQuestionIndex, teacher, grade, questions, studentId]);

  const handleAnswerChange = (rating: number) => {
    const currentQuestionId = questions[currentQuestionIndex].id;
    const newAnswers = [...answers.filter(a => a.questionId !== currentQuestionId), { questionId: currentQuestionId, rating }];
    setAnswers(newAnswers);
  };
  
  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = () => {
    onSubmit(answers);
  };
  
  const currentAnswer = answers.find(a => a.questionId === questions[currentQuestionIndex].id)?.rating || 0;
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const isAnswered = currentAnswer > 0;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 to-purple-100 p-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl p-8 md:p-12 transform transition-all duration-500">
        <header className="text-center mb-8 border-b pb-4">
          <img src={teacher.avatar} alt={teacher.name} className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-indigo-200" />
          <h1 className="text-3xl font-bold text-slate-800">Cuestionario para {teacher.name}</h1>
          <div className="flex flex-wrap justify-center gap-2 mt-2">
            {teacher.subjects.map(subject => (
              <span key={subject.id} className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm">
                {subject.name}
              </span>
            ))}
          </div>
          <p className="text-slate-500 text-lg mt-2">Grado: {grade}</p>
        </header>

        <main className="text-center">
            <p className="text-slate-600 mb-4 text-lg">Pregunta {currentQuestionIndex + 1} de {questions.length}</p>
            <h2 className="text-2xl md:text-3xl font-semibold text-slate-800 mb-8 min-h-[100px] flex items-center justify-center">
                {questions[currentQuestionIndex].text}
            </h2>
            <div className="flex justify-center mb-10">
                <RatingSystem grade={grade} value={currentAnswer} onChange={handleAnswerChange} />
            </div>
        </main>
        
        <footer className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <button 
            onClick={currentQuestionIndex === 0 ? onBack : handleBack}
            className="px-6 py-3 bg-slate-200 text-slate-700 font-semibold rounded-lg hover:bg-slate-300 transition-colors w-full md:w-auto"
          >
            {currentQuestionIndex === 0 ? 'Cancelar' : 'Anterior'}
          </button>
          
          {isLastQuestion ? (
            <button
              onClick={handleSubmit}
              disabled={!isAnswered}
              className="px-8 py-4 bg-green-500 text-white font-bold text-lg rounded-lg shadow-lg hover:bg-green-600 transition-all transform hover:scale-105 disabled:bg-slate-400 disabled:cursor-not-allowed disabled:scale-100 w-full md:w-auto"
            >
              Finalizar y Enviar
            </button>
          ) : (
            <button
              onClick={handleNext}
              disabled={!isAnswered}
              className="px-8 py-4 bg-indigo-600 text-white font-bold text-lg rounded-lg shadow-lg hover:bg-indigo-700 transition-all transform hover:scale-105 disabled:bg-slate-400 disabled:cursor-not-allowed disabled:scale-100 w-full md:w-auto"
            >
              Siguiente
            </button>
          )}
        </footer>
      </div>
    </div>
  );
};
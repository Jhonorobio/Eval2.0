import React from 'react';
import { Grade } from '../types';
import { HomeIcon } from './icons';

interface AllCompletedScreenProps {
  studentName: string;
  grade: Grade | '';
  onFinishSession: () => void;
}

export const AllCompletedScreen: React.FC<AllCompletedScreenProps> = ({ studentName, grade, onFinishSession }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-green-50 p-4 text-center">
      <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 max-w-lg w-full">
        <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-16 h-16 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </div>
        <h1 className="text-4xl font-bold text-slate-800 mb-4">¡Felicidades, {studentName}!</h1>
        <p className="text-slate-600 text-lg mb-8">
          Has completado la evaluación de todos los profesores para el <strong>{grade}</strong>. ¡Muchas gracias por tu colaboración!
        </p>
        <button
          onClick={onFinishSession}
          className="flex items-center justify-center gap-2 w-full px-8 py-4 bg-indigo-600 text-white font-bold text-lg rounded-lg shadow-lg hover:bg-indigo-700 transition-transform transform hover:scale-105"
        >
          <HomeIcon className="w-6 h-6" />
          Volver al Inicio
        </button>
      </div>
    </div>
  );
};
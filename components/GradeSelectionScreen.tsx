import React from 'react';
import { Grade } from '../types';

interface GradeSelectionScreenProps {
  studentId: string;
  grades: Grade[];
  onSelectGrade: (grade: Grade) => void;
  onClearStudent: () => void;
}

export const GradeSelectionScreen: React.FC<GradeSelectionScreenProps> = ({
  studentId,
  grades,
  onSelectGrade,
  onClearStudent,
}) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-indigo-50 to-purple-50">
      <div className="w-full max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <div className="flex justify-center items-center gap-4 mb-2">
            <h1 className="text-4xl md:text-5xl font-bold text-indigo-700">Paso 1: Selecciona tu Grado</h1>
          </div>
          <div className="flex justify-center items-center gap-4">
            <span className="text-slate-600 text-lg bg-white px-3 py-1 rounded-full shadow">Evaluando como: <strong>{studentId}</strong></span>
            <button onClick={onClearStudent} className="text-sm text-indigo-600 hover:underline">Cambiar de Estudiante</button>
          </div>
        </header>

        <main className="bg-white rounded-2xl shadow-xl p-6 md:p-10">
          <section>
            <div className="flex flex-wrap justify-center gap-3">
              {grades.map(grade => (
                <button
                  key={grade}
                  onClick={() => onSelectGrade(grade)}
                  className="px-6 py-3 w-32 text-lg rounded-lg font-semibold border-2 transition-all duration-200 bg-white text-slate-700 border-slate-200 hover:border-indigo-500 hover:text-indigo-600 hover:bg-indigo-50 transform hover:scale-105"
                >
                  {grade}
                </button>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};
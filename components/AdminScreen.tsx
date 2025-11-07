import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Teacher, Question } from '../types';
import * as dataService from '../services/dataService';
import { ChartBarIcon, UserIcon } from './icons';
import { QuestionManager } from './QuestionManager';
import { TeacherManager } from './TeacherManager';
import { StatsScreen } from './StatsScreen';

type AdminView = 'questions' | 'teachers' | 'stats';

export const AdminScreen: React.FC<{ onSave: () => void; onBackToHome: () => void; }> = ({ onSave, onBackToHome }) => {
  const [currentView, setCurrentView] = useState<AdminView>('questions');
  const [primaryQuestions, setPrimaryQuestions] = useState<Question[]>([]);
  const [secondaryQuestions, setSecondaryQuestions] = useState<Question[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [responses, setResponses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const [primary, secondary, teachersList, responsesList] = await Promise.all([
          dataService.getPrimaryQuestions(),
          dataService.getSecondaryQuestions(),
          dataService.getTeachers(),
          dataService.getResponses()
        ]);
        
        setPrimaryQuestions(primary);
        setSecondaryQuestions(secondary);
        setTeachers(teachersList);
        setResponses(responsesList);
      } catch (error) {
        console.error('Error cargando datos:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const handleSaveQuestions = () => {
    onSave();
    setPrimaryQuestions(dataService.getPrimaryQuestions());
    setSecondaryQuestions(dataService.getSecondaryQuestions());
  };

  const handleSaveTeachers = async (updatedTeachers: Teacher[]) => {
    try {
      await dataService.saveTeachers(updatedTeachers);
      setTeachers(updatedTeachers);
    } catch (error) {
      console.error('Error guardando profesores:', error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="max-w-7xl mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={onBackToHome}
            className="text-indigo-600 hover:underline"
          >
            &larr; Volver al Inicio
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-6 border-b border-gray-200">
          <nav className="flex space-x-8">
            <button
              onClick={() => setCurrentView('questions')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                currentView === 'questions'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Gestión de Preguntas
            </button>
            <button
              onClick={() => setCurrentView('teachers')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                currentView === 'teachers'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Gestión de Profesores
            </button>
            <button
              onClick={() => setCurrentView('stats')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                currentView === 'stats'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Estadísticas
            </button>
          </nav>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-indigo-600 text-lg">Cargando datos...</div>
          </div>
        ) : (
          <>
            {currentView === 'questions' && (
              <QuestionManager
                primaryQuestions={primaryQuestions}
                secondaryQuestions={secondaryQuestions}
                onSave={handleSaveQuestions}
              />
            )}

            {currentView === 'teachers' && (
              <TeacherManager
                teachers={teachers}
                onSave={handleSaveTeachers}
              />
            )}

            {currentView === 'stats' && (
              <StatsScreen
                responses={responses}
                teachers={teachers}
                onBackToHome={() => setCurrentView('questions')}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

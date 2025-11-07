import React, { useState } from 'react';
import { Question } from '../types';
import * as dataService from '../services/dataService';

interface QuestionManagerProps {
  primaryQuestions: Question[];
  secondaryQuestions: Question[];
  onSave: () => void;
}

export const QuestionManager: React.FC<QuestionManagerProps> = ({
  primaryQuestions,
  secondaryQuestions,
  onSave
}) => {
  const [activeTab, setActiveTab] = useState<'primary' | 'secondary'>('primary');
  const [questions, setQuestions] = useState<Question[]>(
    activeTab === 'primary' ? primaryQuestions : secondaryQuestions
  );

  const handleSave = () => {
    if (activeTab === 'primary') {
      dataService.savePrimaryQuestions(questions);
    } else {
      dataService.saveSecondaryQuestions(questions);
    }
    onSave();
  };

  const handleAddQuestion = () => {
    const newQuestion: Question = {
      id: questions.length + 1 + (activeTab === 'primary' ? 0 : 100),
      text: '',
    };
    setQuestions([...questions, newQuestion]);
  };

  const handleUpdateQuestion = (id: number, text: string) => {
    setQuestions(questions.map(q => 
      q.id === id ? { ...q, text } : q
    ));
  };

  const handleDeleteQuestion = (id: number) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Gestionar Preguntas</h2>
        <div className="flex space-x-4 mb-4">
          <button
            onClick={() => {
              setActiveTab('primary');
              setQuestions(primaryQuestions);
            }}
            className={`px-4 py-2 rounded-lg ${
              activeTab === 'primary'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Preguntas Primaria
          </button>
          <button
            onClick={() => {
              setActiveTab('secondary');
              setQuestions(secondaryQuestions);
            }}
            className={`px-4 py-2 rounded-lg ${
              activeTab === 'secondary'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Preguntas Bachillerato
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {questions.map((question) => (
          <div key={question.id} className="flex items-start space-x-4 bg-gray-50 p-4 rounded-lg">
            <div className="flex-grow">
              <div className="flex items-center mb-2">
                <span className="text-sm font-medium text-gray-500">Pregunta {question.id}</span>
              </div>
              <textarea
                value={question.text}
                onChange={(e) => handleUpdateQuestion(question.id, e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                rows={2}
                placeholder="Escribe la pregunta aquí..."
              />
            </div>
            <button
              onClick={() => handleDeleteQuestion(question.id)}
              className="text-red-600 hover:text-red-800"
            >
              Eliminar
            </button>
          </div>
        ))}
      </div>

      <div className="mt-6 flex justify-between">
        <button
          onClick={handleAddQuestion}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          Añadir Pregunta
        </button>
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          Guardar Cambios
        </button>
      </div>
    </div>
  );
};
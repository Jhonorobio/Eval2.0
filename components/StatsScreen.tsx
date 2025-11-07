
import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { Teacher, QuizResponse, Grade, Answer } from '../types';
import { HomeIcon, StarIcon } from './icons';
import { PRIMARY_GRADES, SECONDARY_GRADES, GRADES } from '../constants';
import * as dataService from '../services/dataService';

interface StatsScreenProps {
  responses: QuizResponse[];
  teachers: Teacher[];
  onBackToHome: () => void;
}

const calculateTeacherGroupStats = (groupTeachers: Teacher[], allResponses: QuizResponse[]) => {
    return groupTeachers.map(teacher => {
      const teacherResponses = allResponses.filter(r => r.teacherId === teacher.id);
      if (teacherResponses.length === 0) {
        return { name: teacher.name, "Calificación Promedio": 0, "Total de Encuestas": 0 };
      }
      
      const totalNormalizedRating = teacherResponses.reduce((sum, res) => {
        const validAnswers = res.answers.filter(a => a.rating > 0);
        if (validAnswers.length === 0) return sum;

        const isPrimary = PRIMARY_GRADES.includes(res.grade);
        const maxRating = isPrimary ? 3 : 4;

        const responseAvg = validAnswers.reduce((ansSum, ans) => ansSum + ans.rating, 0) / validAnswers.length;
        const normalizedAvg = (responseAvg / maxRating) * 5;
        
        return sum + normalizedAvg;
      }, 0);

      return {
        name: teacher.name,
        "Calificación Promedio": parseFloat((totalNormalizedRating / teacherResponses.length).toFixed(2)),
        "Total de Encuestas": teacherResponses.length
      };
    });
};

const renderDetailedRating = (response: QuizResponse, answer: Answer) => {
    const isPrimary = PRIMARY_GRADES.includes(response.grade);
    const maxRating = isPrimary ? 3 : 4;
    const normalizedRating = Math.round((answer.rating / maxRating) * 5);

    return (
        <div className="flex items-center gap-2">
            <span className="font-mono text-sm text-slate-500">{`${answer.rating}/${maxRating}`}</span>
            <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                    <StarIcon key={i} className={`w-4 h-4 ${i < normalizedRating ? 'text-yellow-400' : 'text-slate-300'}`} />
                ))}
            </div>
        </div>
    );
};


export const StatsScreen: React.FC<StatsScreenProps> = ({ responses, teachers, onBackToHome }) => {
  const [selectedTeacherId, setSelectedTeacherId] = useState<string | 'all'>('all');
  const [detailGrade, setDetailGrade] = useState<Grade | ''>('');
  const [detailTeacherId, setDetailTeacherId] = useState<string | ''>('');
  
  const primaryTeachers = useMemo(() => teachers.filter(t => t.gradesTaught.some(g => PRIMARY_GRADES.includes(g))), [teachers]);
  const secondaryTeachers = useMemo(() => teachers.filter(t => t.gradesTaught.some(g => SECONDARY_GRADES.includes(g))), [teachers]);
  
  const primaryTeachersData = useMemo(() => calculateTeacherGroupStats(primaryTeachers, responses), [primaryTeachers, responses]);
  const secondaryTeachersData = useMemo(() => calculateTeacherGroupStats(secondaryTeachers, responses), [secondaryTeachers, responses]);

  const teacherDetailData = useMemo(() => {
    if (selectedTeacherId === 'all' || !selectedTeacherId) return null;

    const teacherResponses = responses.filter(r => r.teacherId === selectedTeacherId);
    if (teacherResponses.length === 0) return { byQuestion: [] };
    
    // We assume 5 questions per quiz for this aggregation. A more robust solution might map question text.
    const byQuestion = Array.from({ length: 5 }, (_, i) => ({ 
        question: `Pregunta ${i + 1}`, 
        "Calificación Promedio": 0,
        count: 0,
        totalNormalized: 0
    }));

    teacherResponses.forEach(res => {
      const isPrimary = PRIMARY_GRADES.includes(res.grade);
      const maxRating = isPrimary ? 3 : 4;

      res.answers.forEach(ans => {
        // Find question by index, assuming answers are sorted or questionId maps to index
        const questionIndex = (ans.questionId % 100) - 1; // Simple mapping for IDs 1-5 and 101-105
        if(byQuestion[questionIndex]) {
          const normalizedRating = (ans.rating / maxRating) * 5;
          byQuestion[questionIndex].totalNormalized += normalizedRating;
          byQuestion[questionIndex].count++;
        }
      });
    });
    
    byQuestion.forEach(q => {
        if(q.count > 0) {
            q["Calificación Promedio"] = parseFloat((q.totalNormalized / q.count).toFixed(2));
        }
    });

    return { byQuestion };
  }, [responses, selectedTeacherId]);
  
  const detailTeachers = useMemo(() => {
    if (!detailGrade) return [];
    return teachers.filter(t => t.gradesTaught.includes(detailGrade));
  }, [detailGrade, teachers]);

  const studentResponses = useMemo(() => {
    if (!detailGrade || !detailTeacherId) return [];
    return responses.filter(r => r.grade === detailGrade && r.teacherId === detailTeacherId);
  }, [responses, detailGrade, detailTeacherId]);


  const selectedTeacher = teachers.find(t => t.id === selectedTeacherId);

  const handleClearData = () => {
    if (window.confirm('¿Estás seguro de que quieres borrar todos los datos de evaluación? Esta acción no se puede deshacer.')) {
      dataService.clearAllResponses();
      window.location.reload(); // Recargar la página para actualizar las estadísticas
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-indigo-800">Estadísticas de Evaluación</h1>
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <button 
              onClick={handleClearData}
              className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white font-bold rounded-lg shadow-md hover:bg-red-700 transition-colors"
            >
              Borrar Datos
            </button>
            <button 
              onClick={onBackToHome} 
              className="flex items-center gap-2 px-6 py-3 bg-white text-indigo-600 border-2 border-indigo-600 font-bold rounded-lg shadow-md hover:bg-indigo-50 transition-colors"
            >
              <HomeIcon className="w-6 h-6" /> Volver al Inicio
            </button>
          </div>
        </header>

        <section className="bg-white p-6 rounded-2xl shadow-lg mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-slate-700">Calificación General (Primaria)</h2>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={primaryTeachersData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 5]} />
                <Tooltip />
                <Legend />
                <Bar dataKey="Calificación Promedio" fill="#4f46e5" />
                <Bar dataKey="Total de Encuestas" fill="#818cf8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="bg-white p-6 rounded-2xl shadow-lg mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-slate-700">Calificación General (Bachillerato)</h2>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={secondaryTeachersData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 5]} />
                <Tooltip />
                <Legend />
                <Bar dataKey="Calificación Promedio" fill="#10b981" />
                <Bar dataKey="Total de Encuestas" fill="#6ee7b7" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="bg-white p-6 rounded-2xl shadow-lg mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-slate-700">Análisis por Profesor</h2>
          <select
            value={selectedTeacherId}
            onChange={e => setSelectedTeacherId(e.target.value)}
            className="w-full md:w-1/3 p-3 border-2 border-slate-200 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">Ver todos</option>
            {teachers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>

          {selectedTeacherId !== 'all' && teacherDetailData && (
            <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="h-96">
                <h3 className="text-xl font-semibold mb-4 text-center">Calificación por Pregunta para {selectedTeacher?.name}</h3>
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={teacherDetailData.byQuestion}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="question" />
                    <PolarRadiusAxis angle={30} domain={[0, 5]} />
                    <Radar name={selectedTeacher?.name} dataKey="Calificación Promedio" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
              <div className="h-96">
                 <h3 className="text-xl font-semibold mb-4 text-center">Calificación por Pregunta (Barras)</h3>
                 <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={teacherDetailData.byQuestion}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="question" tick={{ fontSize: 12 }}/>
                        <YAxis domain={[0, 5]} />
                        <Tooltip />
                        <Bar dataKey="Calificación Promedio" fill="#4f46e5" />
                    </BarChart>
                 </ResponsiveContainer>
              </div>
            </div>
          )}
        </section>

        <section className="bg-white p-6 rounded-2xl shadow-lg">
          <h2 className="text-2xl font-semibold mb-4 text-slate-700">Análisis Detallado por Estudiante</h2>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <select
              value={detailGrade}
              onChange={e => {
                setDetailGrade(e.target.value as Grade);
                setDetailTeacherId('');
              }}
              className="w-full md:w-1/3 p-3 border-2 border-slate-200 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">-- Selecciona un Grado --</option>
              {GRADES.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
            <select
              value={detailTeacherId}
              onChange={e => setDetailTeacherId(e.target.value)}
              disabled={!detailGrade}
              className="w-full md:w-1/3 p-3 border-2 border-slate-200 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-slate-50"
            >
              <option value="">-- Selecciona un Profesor --</option>
              {detailTeachers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>
          <div className="mt-4">
              {studentResponses.length > 0 ? (
                <div className="space-y-4">
                  {studentResponses.map(res => (
                    <div key={res.responseId} className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                        <h3 className="font-bold text-lg text-indigo-700">{res.studentId}</h3>
                        <ul className="mt-2 space-y-2">
                           {res.answers.sort((a,b) => a.questionId - b.questionId).map(ans => (
                             <li key={ans.questionId} className="flex justify-between items-center">
                                <span className="text-slate-600">Pregunta {ans.questionId}:</span>
                                {renderDetailedRating(res, ans)}
                             </li>
                           ))}
                        </ul>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-500 text-center py-4">
                    {detailGrade && detailTeacherId ? 'No hay respuestas para esta selección.' : 'Selecciona un grado y profesor para ver las respuestas de los estudiantes.'}
                </p>
              )}
          </div>
        </section>
      </div>
    </div>
  );
};
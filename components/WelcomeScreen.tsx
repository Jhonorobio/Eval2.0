import React from 'react';
import { Teacher, Grade, QuizResponse, InProgressQuiz } from '../types';
import { ChartBarIcon, CheckIcon } from './icons';
import { PasswordDialog } from './PasswordDialog';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface WelcomeScreenProps {
  teachers: Teacher[];
  onStartQuiz: (teacher: Teacher, grade: Grade, subjectId: string) => void;
  onGoToAdmin: () => void;
  inProgressQuiz: InProgressQuiz | null;
  onResumeQuiz: () => void;
  onDiscardQuiz: () => void;
  selectedGrade: Grade | null;
  completedTeachers: string[];
  onSelectStudent: (studentName: string) => void;
  onClearStudent: () => void;
  onBackToGradeSelect: () => void;
  studentId: string | null;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ 
  teachers, 
  onStartQuiz, 
  onGoToAdmin,
  inProgressQuiz, 
  onResumeQuiz, 
  onDiscardQuiz,
  selectedGrade,
  completedTeachers,
  studentId,
  onSelectStudent,
  onClearStudent,
  onBackToGradeSelect
}) => {
  const [studentNameInput, setStudentNameInput] = React.useState('');
  const [inputError, setInputError] = React.useState('');
  const [showAdminLogin, setShowAdminLogin] = React.useState(false);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin');
    }
  }, [isAuthenticated, navigate]);

  const handleStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (studentNameInput.trim().length < 3) {
      setInputError('Por favor, introduce un nombre válido (mínimo 3 caracteres).');
      return;
    }
    setInputError('');
    onSelectStudent(studentNameInput.trim());
  };

  const filteredTeachersWithSubjects = React.useMemo(() => {
    if (!selectedGrade) return [];
    // Crear una entrada por cada materia de cada profesor
    const teacherSubjects: Array<{
      teacherId: string;
      teacherName: string;
      teacherAvatar: string;
      subjectId: string;
      subjectName: string;
      isCompleted: boolean;
    }> = [];

    teachers.forEach(teacher => {
      if (teacher.gradesTaught.includes(selectedGrade)) {
        teacher.subjects.forEach(subject => {
          teacherSubjects.push({
            teacherId: teacher.id,
            teacherName: teacher.name,
            teacherAvatar: teacher.avatar,
            subjectId: subject.id,
            subjectName: subject.name,
            isCompleted: completedTeachers.includes(`${teacher.id}_${subject.id}`)
          });
        });
      }
    });

    return teacherSubjects;
  }, [teachers, selectedGrade, completedTeachers]);

  const allTeachersForGradeCompleted = filteredTeachersWithSubjects.length > 0 && 
    filteredTeachersWithSubjects.every(t => t.isCompleted);

  // This part is now the "Student Selection Screen" or "Home Page"
  if (!studentId) {
    return (
      <>
        {showAdminLogin && (
          <PasswordDialog 
            onAccess={() => {
              setShowAdminLogin(false);
              // La navegación se gestionará con el useEffect
            }}
            onCancel={() => setShowAdminLogin(false)}
          />
        )}
        <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-indigo-50 to-purple-50">
          <div className="w-full max-w-md mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-indigo-700 mb-4">Evaluación Docente</h1>
            <p className="text-slate-600 mt-2 text-xl mb-8">Introduce tu nombre para iniciar la evaluación, o revisa los resultados.</p>
            <div className="bg-white rounded-2xl shadow-xl p-6 md:p-10">
              <form onSubmit={handleStudentSubmit}>
                <label htmlFor="studentName" className="text-left block text-sm font-medium text-slate-700 mb-2">Nombre del Estudiante</label>
                <input
                  id="studentName"
                  type="text"
                  value={studentNameInput}
                  onChange={(e) => setStudentNameInput(e.target.value)}
                  placeholder="Escribe tu nombre completo"
                  className="w-full p-4 border-2 border-slate-200 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  aria-label="Nombre del estudiante"
                />
                {inputError && <p className="text-red-500 text-sm mt-2">{inputError}</p>}
                <button
                  type="submit"
                  className="mt-6 w-full p-4 bg-indigo-600 text-white font-bold text-lg rounded-lg shadow-lg hover:bg-indigo-700 transition-transform transform hover:scale-105"
                >
                  Comenzar Evaluación
                </button>
              </form>

              <div className="text-center mt-6">
                  <button onClick={() => setShowAdminLogin(true)} className="text-sm text-slate-500 hover:text-indigo-600 hover:underline">
                      Panel de Administración
                  </button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  // This part is now the "Teacher Selection Screen"
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-indigo-50 to-purple-50">
      <div className="w-full max-w-4xl mx-auto">
        {inProgressQuiz && (
            <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-8 rounded-r-lg shadow-md" role="alert">
                <p className="font-bold">Cuestionario en Progreso</p>
                <p>Tienes un cuestionario sin terminar para <strong>{inProgressQuiz.teacher.name}</strong> ({inProgressQuiz.grade}).</p>
                <div className="mt-3">
                    <button onClick={onResumeQuiz} className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded mr-2 transition-colors">
                        Continuar
                    </button>
                    <button onClick={onDiscardQuiz} className="bg-transparent hover:bg-yellow-200 text-yellow-700 font-semibold py-2 px-4 border border-yellow-500 rounded transition-colors">
                        Descartar
                    </button>
                </div>
            </div>
        )}
        <header className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-indigo-700">Paso 2: Selecciona un Profesor/a</h1>
          <div className="flex justify-center items-center flex-wrap gap-4 mt-4">
            <span className="text-slate-600 text-lg bg-white px-3 py-1 rounded-full shadow">Estudiante: <strong>{studentId}</strong></span>
            <span className="text-slate-600 text-lg bg-white px-3 py-1 rounded-full shadow">Grado: <strong>{selectedGrade}</strong></span>
          </div>
           <div className="flex justify-center items-center gap-4 mt-2">
            <button onClick={onBackToGradeSelect} className="text-sm text-indigo-600 hover:underline">Cambiar de Grado</button>
            <button onClick={onClearStudent} className="text-sm text-indigo-600 hover:underline">Cambiar de Estudiante</button>
          </div>
        </header>

        <main className="bg-white rounded-2xl shadow-xl p-6 md:p-10">
          {selectedGrade && (
            <section className="mb-8">
              {filteredTeachersWithSubjects.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {filteredTeachersWithSubjects.map(item => (
                    <button
                      key={`${item.teacherId}_${item.subjectId}`}
                      onClick={() => !item.isCompleted && onStartQuiz(
                        {
                          id: item.teacherId,
                          name: item.teacherName,
                          avatar: item.teacherAvatar,
                          subjects: [{
                            id: item.subjectId,
                            name: item.subjectName
                          }],
                          gradesTaught: selectedGrade ? [selectedGrade] : []
                        },
                        selectedGrade!,
                        item.subjectId
                      )}
                      disabled={item.isCompleted}
                      className={`relative flex flex-col items-center p-4 border-2 rounded-lg transition-all duration-200 ${
                        item.isCompleted 
                        ? 'border-slate-200 bg-slate-50 opacity-60 cursor-not-allowed'
                        : 'border-slate-200 hover:border-indigo-500 hover:bg-indigo-50 hover:scale-105 hover:shadow-md cursor-pointer'
                      }`}
                    >
                      {item.isCompleted && (
                        <div className="absolute top-2 right-2 text-green-500 bg-white rounded-full">
                          <CheckIcon className="w-8 h-8" />
                        </div>
                      )}
                      <img src={item.teacherAvatar} alt={item.teacherName} className="w-20 h-20 rounded-full mb-3" />
                      <span className="font-semibold text-center">{item.teacherName}</span>
                      <span className="text-sm text-gray-600 px-3 py-1 bg-gray-100 rounded-full mt-2">
                        {item.subjectName}
                      </span>
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-slate-500 text-center p-4 bg-slate-50 rounded-lg">No hay profesores asignados para este grado.</p>
              )}
            </section>
          )}

          {allTeachersForGradeCompleted && selectedGrade && (
            <div className="text-center mb-6 p-4 bg-green-100 text-green-800 rounded-lg">
              <p className="font-bold">¡Felicidades!</p>
              <p>Has completado las encuestas para todos tus profesores de {selectedGrade}.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
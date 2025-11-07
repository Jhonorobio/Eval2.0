import React, { useState, useRef } from 'react';
import { getAvatar } from '../services/avatar';
import { Teacher, Grade, TeacherSubject } from '../types';
import { GRADES } from '../constants';

interface TeacherManagerProps {
  teachers: Teacher[];
  onSave: (teachers: Teacher[]) => void;
}

export const TeacherManager: React.FC<TeacherManagerProps> = ({ teachers, onSave }) => {
  const [editingTeachers, setEditingTeachers] = useState<Teacher[]>(teachers);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const handleAddTeacher = (teacher: Teacher) => {
    const newTeachers = [...editingTeachers, { ...teacher, id: `t${editingTeachers.length + 1}` }];
    setEditingTeachers(newTeachers);
    onSave(newTeachers);
    setShowAddForm(false);
  };

  const handleEditTeacher = (updatedTeacher: Teacher) => {
    const newTeachers = editingTeachers.map(t => 
      t.id === updatedTeacher.id ? updatedTeacher : t
    );
    setEditingTeachers(newTeachers);
    onSave(newTeachers);
    setSelectedTeacher(null);
  };

  const handleDeleteTeacher = (teacherId: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este profesor?')) {
      const newTeachers = editingTeachers.filter(t => t.id !== teacherId);
      setEditingTeachers(newTeachers);
      onSave(newTeachers);
    }
  };

  const TeacherForm: React.FC<{
    teacher?: Teacher;
    onSubmit: (teacher: Omit<Teacher, 'id'>) => void;
    onCancel: () => void;
  }> = ({ teacher, onSubmit, onCancel }) => {
    const [name, setName] = useState(teacher?.name || '');
    const [subjects, setSubjects] = useState<TeacherSubject[]>(teacher?.subjects || []);
    const [newSubject, setNewSubject] = useState('');
    const [avatar, setAvatar] = useState(teacher?.avatar || '');
    const [selectedGrades, setSelectedGrades] = useState<Grade[]>(teacher?.gradesTaught || []);
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const handleSubjectAdd = () => {
      if (newSubject.trim()) {
        setSubjects(prev => [...prev, { id: `s${Date.now()}`, name: newSubject.trim() }]);
        setNewSubject('');
      }
    };

    const handleSubjectRemove = (subjectId: string) => {
      setSubjects(prev => prev.filter(s => s.id !== subjectId));
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            setAvatar(e.target.result as string);
          }
        };
        reader.readAsDataURL(file);
      }
    };

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (subjects.length === 0) {
        alert('Debes agregar al menos una materia');
        return;
      }
      onSubmit({
        name,
        subjects,
        avatar,
        gradesTaught: selectedGrades,
      });
    };

    const toggleGrade = (grade: Grade) => {
      setSelectedGrades(prev => 
        prev.includes(grade)
          ? prev.filter(g => g !== grade)
          : [...prev, grade]
      );
    };

    return (
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-xl font-bold mb-4">
          {teacher ? 'Editar Profesor' : 'Agregar Nuevo Profesor'}
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nombre</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Materias</label>
            <div className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Nombre de la materia"
                />
                <button
                  type="button"
                  onClick={handleSubjectAdd}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  Agregar
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {subjects.map(subject => (
                  <div key={subject.id} className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full">
                    <span>{subject.name}</span>
                    <button
                      type="button"
                      onClick={() => handleSubjectRemove(subject.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Imagen del Profesor</label>
            <div className="mt-2 flex items-center gap-4">
              <img src={getAvatar(avatar)} alt={name} className="w-20 h-20 rounded-full object-cover" />
              <div className="flex-1">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Seleccionar Imagen
                </button>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Grados</label>
            <div className="grid grid-cols-4 gap-2">
              {GRADES.map((grade) => (
                <button
                  key={grade}
                  type="button"
                  onClick={() => toggleGrade(grade)}
                  className={`p-2 rounded ${
                    selectedGrades.includes(grade)
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {grade}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md"
          >
            {teacher ? 'Guardar Cambios' : 'Agregar Profesor'}
          </button>
        </div>
      </form>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Gestión de Profesores</h2>
        <button
          onClick={() => setShowAddForm(true)}
          className="px-4 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
        >
          Agregar Profesor
        </button>
      </div>

      {(showAddForm || selectedTeacher) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="max-w-2xl w-full">
            <TeacherForm
              teacher={selectedTeacher || undefined}
              onSubmit={(teacher) => {
                if (selectedTeacher) {
                  handleEditTeacher({ ...teacher, id: selectedTeacher.id });
                } else {
                  handleAddTeacher(teacher as Teacher);
                }
              }}
              onCancel={() => {
                setSelectedTeacher(null);
                setShowAddForm(false);
              }}
            />
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {editingTeachers.map(teacher => (
          <div key={teacher.id} className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-4">
              <img src={getAvatar(teacher.avatar)} alt={teacher.name} className="w-16 h-16 rounded-full" />
              <div>
                <h3 className="text-lg font-semibold">{teacher.name}</h3>
                <div className="flex flex-wrap gap-1">
                  {teacher.subjects.map(subject => (
                    <span key={subject.id} className="text-sm text-gray-600 px-2 py-1 bg-gray-100 rounded-full">
                      {subject.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-700">Grados:</h4>
              <div className="flex flex-wrap gap-1 mt-1">
                {teacher.gradesTaught.map(grade => (
                  <span key={grade} className="px-2 py-1 text-xs bg-gray-100 rounded">
                    {grade}
                  </span>
                ))}
              </div>
            </div>
            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={() => setSelectedTeacher(teacher)}
                className="px-3 py-1 text-sm text-indigo-600 hover:bg-indigo-50 rounded"
              >
                Editar
              </button>
              <button
                onClick={() => handleDeleteTeacher(teacher.id)}
                className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded"
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
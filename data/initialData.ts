import { Teacher, Question } from '../types';

export const INITIAL_TEACHERS: Teacher[] = [
  { 
    id: 't1', 
    name: 'Sra. Martinez', 
    subjects: [{ id: 's1', name: 'Matemáticas' }], 
    avatar: 'https://i.pravatar.cc/150?img=1',
    gradesTaught: ['5º', '6º', '7º', '8º'] 
  },
  { 
    id: 't2', 
    name: 'Sr. Gonzalez', 
    subjects: [{ id: 's2', name: 'Ciencias' }], 
    avatar: 'https://i.pravatar.cc/150?img=2',
    gradesTaught: ['7º', '8º', '9º', '10º', '11º']
  },
  { 
    id: 't3', 
    name: 'Sra. Rodriguez', 
    subjects: [{ id: 's3', name: 'Historia' }], 
    avatar: 'https://i.pravatar.cc/150?img=3',
    gradesTaught: ['9º', '10º', '11º']
  },
  { 
    id: 't4', 
    name: 'Sr. Perez', 
    subjects: [{ id: 's4', name: 'Arte' }], 
    avatar: 'https://i.pravatar.cc/150?img=4',
    gradesTaught: ['Preescolar', '1º', '2º', '3º', '4º', '5º', '6º']
  },
  {
    id: 't5',
    name: 'Sra. Diaz',
    subjects: [{ id: 's5', name: 'Lenguaje' }], 
    avatar: 'https://i.pravatar.cc/150?img=5',
    gradesTaught: ['1º', '2º', '3º', '4º']
  },
  {
    id: 't6',
    name: 'Sr. Castillo',
    subjects: [{ id: 's6', name: 'Educación Física' }], 
    avatar: 'https://i.pravatar.cc/150?img=6',
    gradesTaught: ['Preescolar', '1º', '2º', '3º', '4º', '5º', '6º', '7º', '8º', '9º', '10º', '11º']
  }
];


export const INITIAL_PRIMARY_QUESTIONS: Question[] = [
  { id: 1, text: '¿Tu profe es amable contigo?' },
  { id: 2, text: '¿Aprendes cosas nuevas con tu profe?' },
  { id: 3, text: '¿Te diviertes en las clases?' },
  { id: 4, text: '¿Tu profe te ayuda cuando no entiendes algo?' },
  { id: 5, text: '¿Las clases que da tu profe son interesantes?' },
];

export const INITIAL_SECONDARY_QUESTIONS: Question[] = [
  { id: 101, text: '¿El profesor/a explica los temas de forma clara y comprensible?' },
  { id: 102, text: '¿El profesor/a fomenta la participación y el pensamiento crítico en clase?' },
  { id: 103, text: '¿Las clases son interesantes y los materiales utilizados son adecuados?' },
  { id: 104, text: '¿El profesor/a es justo/a y transparente en las evaluaciones?' },
  { id: 105, text: '¿El profesor/a muestra respeto y está disponible para resolver dudas?' },
];

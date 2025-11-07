import React, { useEffect } from 'react';

interface ThankYouScreenProps {
  onBackToHome: () => void;
}

export const ThankYouScreen: React.FC<ThankYouScreenProps> = ({ onBackToHome }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onBackToHome();
    }, 2500); // 2.5 seconds

    return () => clearTimeout(timer); // Cleanup timer on unmount
  }, [onBackToHome]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-50 to-teal-50 p-4 text-center">
      <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 max-w-lg w-full">
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-16 h-16 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
        </div>
        <h1 className="text-4xl font-bold text-slate-800 mb-4">¡Gracias!</h1>
        <p className="text-slate-600 text-lg mb-8">Tus respuestas han sido guardadas. Preparando la siguiente evaluación...</p>
        <div className="relative w-full bg-slate-200 rounded-full h-2.5">
            <div className="bg-green-500 h-2.5 rounded-full animate-[pulse_2s_ease-in-out_infinite]"></div>
        </div>
      </div>
    </div>
  );
};
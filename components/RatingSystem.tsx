import React, { useState } from 'react';
import { Grade } from '../types';
import { PRIMARY_GRADES } from '../constants';
import { StarIcon, SmileySadIcon, SmileyNeutralIcon, SmileyHappyIcon } from './icons';

interface RatingSystemProps {
  grade: Grade;
  value: number;
  onChange: (rating: number) => void;
}

const RATING_LABELS = {
    primary: ["Ninguna vez", "A veces", "Siempre"],
    secondary: ["Ninguna vez", "Pocas veces", "Casi siempre", "Siempre"],
};

export const RatingSystem: React.FC<RatingSystemProps> = ({ grade, value, onChange }) => {
  const [hover, setHover] = useState(0);
  const isPrimary = PRIMARY_GRADES.includes(grade);

  if (isPrimary) {
    const icons = [SmileySadIcon, SmileyNeutralIcon, SmileyHappyIcon];
    const colors = ['text-red-400', 'text-yellow-400', 'text-green-500'];
    const bgColors = ['hover:bg-red-50', 'hover:bg-yellow-50', 'hover:bg-green-50'];
    const borderColors = ['hover:border-red-400', 'hover:border-yellow-400', 'hover:border-green-400'];
    const defaultColor = 'text-slate-300';

    return (
        <div className="flex items-center justify-center space-x-2 md:space-x-4">
            {icons.map((Icon, index) => {
                const ratingValue = index + 1;
                const isSelected = ratingValue === value;
                const isHovered = ratingValue === hover;
                const color = isSelected ? colors[index] : (isHovered ? colors[index] : defaultColor);

                return (
                    <div key={index} className="text-center">
                        <label className={`flex flex-col items-center p-2 border-2 rounded-lg cursor-pointer transition-all ${isSelected ? `border-transparent ${bgColors[index].replace('hover:','')}` : 'border-transparent'} ${bgColors[index]} ${borderColors[index]}`}>
                            <input
                                type="radio"
                                name="rating"
                                className="hidden"
                                value={ratingValue}
                                onClick={() => onChange(ratingValue)}
                            />
                            <Icon
                                className={`w-14 h-14 md:w-16 md:h-16 transition-transform transform hover:scale-110 ${color}`}
                                onMouseEnter={() => setHover(ratingValue)}
                                onMouseLeave={() => setHover(0)}
                            />
                        </label>
                        <span className={`mt-2 text-sm font-medium transition-colors ${isSelected || isHovered ? 'text-slate-700' : 'text-slate-400'}`}>
                            {RATING_LABELS.primary[index]}
                        </span>
                    </div>
                );
            })}
        </div>
    );
  }

  // Secondary (Stars)
  return (
     <div className="flex flex-col items-center space-y-3">
        <div className="flex items-center space-x-2 md:space-x-4">
        {[...Array(4)].map((_, index) => {
            const ratingValue = index + 1;
            return (
            <label key={index}>
                <input
                type="radio"
                name="rating"
                className="hidden"
                value={ratingValue}
                onClick={() => onChange(ratingValue)}
                />
                <StarIcon
                className={`w-10 h-10 md:w-14 md:h-14 cursor-pointer transition-all duration-200 ${
                    ratingValue <= (hover || value) ? 'text-yellow-400' : 'text-slate-300'
                } hover:scale-125`}
                onMouseEnter={() => setHover(ratingValue)}
                onMouseLeave={() => setHover(0)}
                />
            </label>
            );
        })}
        </div>
        <p className="text-slate-600 font-semibold h-6">
            { (hover > 0 && RATING_LABELS.secondary[hover - 1]) || (value > 0 && RATING_LABELS.secondary[value - 1]) || 'Selecciona una opción' }
        </p>
    </div>
  );
};
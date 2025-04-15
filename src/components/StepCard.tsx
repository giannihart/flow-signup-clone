
import React, { ReactNode } from "react";

interface StepCardProps {
  stepNumber: number;
  title: string;
  children: ReactNode;
  active?: boolean;
  completed?: boolean;
}

const StepCard: React.FC<StepCardProps> = ({ 
  stepNumber, 
  title, 
  children, 
  active = false,
  completed = false
}) => {
  return (
    <div 
      data-step={stepNumber}
      className={`border rounded-md p-5 mb-4 transition-all duration-300 animate-fade-in 
        ${active ? "border-green-600/30" : completed ? "border-gray-700" : "border-gray-800"}
        ${active ? "shadow-[0_0_10px_rgba(16,185,129,0.1)]" : ""}
      `}
    >
      <h3 className={`text-lg font-medium mb-2 flex items-center
        ${active ? "text-green-500" : completed ? "text-gray-400" : "text-white"}
      `}>
        {completed ? (
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-5 w-5 mr-2 text-green-500" 
            viewBox="0 0 20 20" 
            fill="currentColor"
            style={{ animation: 'checkmarkAnimation 0.5s ease-out forwards' }}
          >
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        ) : (
          <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full mr-2 text-sm
            ${active ? "bg-green-500 text-black animate-pulse" : "bg-gray-800 text-gray-400"}
          `}>
            {stepNumber}
          </span>
        )}
        {title}
      </h3>
      <div className="text-gray-400 text-sm">{children}</div>
    </div>
  );
};

export default StepCard;

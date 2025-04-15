
import React from "react";
import { Github } from "lucide-react";

interface GitHubButtonProps {
  onClick?: () => void;
  children: React.ReactNode;
  disabled?: boolean;
}

const GitHubButton: React.FC<GitHubButtonProps> = ({ 
  onClick, 
  children,
  disabled = false 
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center justify-center w-full py-3 px-4 bg-white text-black font-medium rounded-md transition-all
        ${disabled ? 'opacity-70 cursor-not-allowed' : 'hover:bg-gray-100 active:scale-[0.99]'}
      `}
    >
      <svg 
        viewBox="0 0 24 24" 
        width="20" 
        height="20" 
        stroke="currentColor" 
        strokeWidth="2" 
        fill="none" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className="mr-2"
      >
        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
      </svg>
      {children}
    </button>
  );
};

export default GitHubButton;

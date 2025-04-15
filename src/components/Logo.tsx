
import React from "react";

const Logo = () => {
  return (
    <div className="flex items-center mb-4">
      <svg
        width="36"
        height="36"
        viewBox="0 0 36 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-green-500"
      >
        <path
          d="M18 3C9.75 3 3 9.75 3 18C3 26.25 9.75 33 18 33C26.25 33 33 26.25 33 18C33 9.75 26.25 3 18 3ZM18 30C11.4 30 6 24.6 6 18C6 11.4 11.4 6 18 6C24.6 6 30 11.4 30 18C30 24.6 24.6 30 18 30Z"
          fill="currentColor"
        />
        <path
          d="M21 10.5C18.75 10.5 16.5 11.25 15 12.75L12 9.75V18H20.25L17.25 15C18 14.25 19.5 13.5 21 13.5C24 13.5 26.25 15.75 26.25 18.75C26.25 21.75 24 24 21 24C18.375 24 16.5 22.125 16.125 19.875H13.125C13.5 23.625 16.875 27 21 27C25.5 27 29.25 23.25 29.25 18.75C29.25 14.25 25.5 10.5 21 10.5Z"
          fill="#10B981"
        />
      </svg>
    </div>
  );
};

export default Logo;

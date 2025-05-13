import React from 'react';

interface ButtonProps {
  onClick?: () => void;
  className?: string;
  children: React.ReactNode;
  title?: string;
}

const Button: React.FC<ButtonProps> = ({ onClick, className, children, title }) => {
  return (
    <button className={className} onClick={onClick}>
        {children} {title}
    </button>
  );
};

export default Button;

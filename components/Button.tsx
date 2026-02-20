import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  icon,
  className = '',
  ...props
}) => {
  const baseStyles = "inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all duration-300 text-xs uppercase tracking-[0.15em] focus:outline-none disabled:opacity-30 disabled:cursor-not-allowed border";

  const variants = {
    primary: "bg-transparent border-claude-orange/40 text-claude-orange hover:border-claude-orange hover:bg-claude-orange hover:text-claude-bg focus:border-claude-orange active:scale-[0.98] shadow-[0_0_15px_rgba(217,119,87,0.1)] hover:shadow-[0_0_20px_rgba(217,119,87,0.3)]",
    secondary: "bg-claude-surface text-claude-text-primary border-claude-border hover:bg-claude-accent hover:text-claude-bg focus:border-claude-text-secondary active:scale-[0.98]",
    outline: "bg-transparent text-claude-orange border-claude-orange/30 hover:border-claude-orange hover:bg-claude-orange/10 active:scale-[0.98]"
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {icon && <span className="w-4 h-4">{icon}</span>}
      {children}
    </button>
  );
};
import React, { ButtonHTMLAttributes } from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  icon?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  icon,
  className = '',
  disabled,
  ...props
}) => {
  const baseClasses = "rounded-md font-medium transition-all duration-300 flex items-center justify-center";
  
const sizeClasses = {
  sm: 'text-sm py-1.5 px-3',
  md: 'py-2 px-4',
  lg: 'text-lg py-3 px-6',
};
  
  const variantClasses = {
    primary: 'bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white',
    secondary: 'bg-gray-800 hover:bg-gray-700 text-white border border-gray-700',
    outline: 'bg-transparent border border-gray-700 hover:bg-gray-800 text-gray-300',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
  };
  
  const classes = `
    ${baseClasses}
    ${sizeClasses[size]}
    ${variantClasses[variant]}
    ${disabled || isLoading ? 'opacity-70 cursor-not-allowed' : ''}
    ${className}
  `;

  return (
    <button 
      className={classes} 
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16} className="animate-spin mr-2" />
          <span>{children}</span>
        </>
      ) : (
        <>
          {icon && <span className="mr-2">{icon}</span>}
          <span>{children}</span>
        </>
      )}
    </button>
  );
};

export default Button;
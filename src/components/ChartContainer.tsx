import { ReactNode } from 'react';

interface ChartContainerProps {
  title: string;
  children: ReactNode;
  className?: string;
}

const ChartContainer = ({ title, children, className = '' }: ChartContainerProps) => {
  return (
    <div className={`card animate-fade-in ${className}`}>
      <h3 className="text-lg font-medium mb-4">{title}</h3>
      <div className="w-full h-full">{children}</div>
    </div>
  );
};

export default ChartContainer;
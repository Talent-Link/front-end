import { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

const StatCard = ({ title, value, icon, trend, className = '' }: StatCardProps) => {
  return (
    <div className={`card animate-fade-in ${className}`}>
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-dark-300 text-sm font-medium mb-1">{title}</h3>
          <div className="text-2xl font-semibold">{value}</div>
          
          {trend && (
            <div className="flex items-center mt-2">
              <span className={`text-sm font-medium ${trend.isPositive ? 'text-green-500' : 'text-red-500'}`}>
                {trend.isPositive ? '+' : ''}{trend.value}%
              </span>
              <span className="text-dark-400 text-xs ml-1">from last period</span>
            </div>
          )}
        </div>
        
        <div className="p-2 rounded-lg bg-dark-700">{icon}</div>
      </div>
    </div>
  );
};

export default StatCard;
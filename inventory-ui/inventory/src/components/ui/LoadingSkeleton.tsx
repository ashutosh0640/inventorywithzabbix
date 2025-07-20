import React from 'react';

interface LoadingSkeletonProps {
  rows?: number;
  columns?: number;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ 
  rows = 5, 
  columns = 6 
}) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Table Header Skeleton */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="flex">
          {Array.from({ length: columns }).map((_, index) => (
            <div key={index} className="flex-1 px-6 py-4">
              <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Table Body Skeleton */}
      <div className="divide-y divide-gray-200">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className="flex animate-pulse">
            {Array.from({ length: columns }).map((_, colIndex) => (
              <div key={colIndex} className="flex-1 px-6 py-4">
                <div className="flex items-center">
                  {colIndex === 0 && (
                    <div className="w-4 h-4 bg-gray-200 rounded mr-3 animate-pulse"></div>
                  )}
                  <div 
                    className={`bg-gray-200 rounded animate-pulse ${
                      colIndex === 0 ? 'h-4 w-32' : 
                      colIndex === columns - 1 ? 'h-6 w-16' : 
                      'h-4 w-24'
                    }`}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export const TableSkeleton: React.FC<{ title: string; icon: React.ReactNode }> = ({ 
  title, 
  icon 
}) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 bg-blue-50">
        <div className="flex items-center">
          {icon}
          <div className="ml-2 h-5 w-32 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>
      
      {/* Loading Content */}
      <LoadingSkeleton rows={8} columns={7} />
    </div>
  );
};

export const WaveLoader: React.FC = () => {
  return (
    <div className="flex justify-center items-center py-12">
      <div className="flex space-x-2">
        {[0, 1, 2, 3, 4].map((index) => (
          <div
            key={index}
            className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"
            style={{
              animationDelay: `${index * 0.1}s`,
              animationDuration: '0.6s'
            }}
          ></div>
        ))}
      </div>
    </div>
  );
};
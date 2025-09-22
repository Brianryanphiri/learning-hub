import React from 'react';

interface ProgressBarProps {
  percentage: number; // 0 to 100
}

export default function ProgressBar({ percentage }: ProgressBarProps) {
  return (
    <div className="bg-gray-200 rounded h-3 w-full">
      <div
        className="bg-blue-600 h-3 rounded transition-all"
        style={{ width: `${percentage}%` }}
      ></div>
    </div>
  );
}

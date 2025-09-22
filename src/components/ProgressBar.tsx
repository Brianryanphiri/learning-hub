// ProgressBar.tsx
interface ProgressBarProps {
  progress: number; // 0 to 100
}

export default function ProgressBar({ progress }: ProgressBarProps) {
  return (
    <div className="bg-gray-200 rounded h-3 w-full">
      <div
        className="bg-blue-600 h-3 rounded transition-all duration-300"
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  );
}

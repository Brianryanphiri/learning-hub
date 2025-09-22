import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';


interface ProgressContextType {
  progress: { [courseId: number]: number[] }; // stores completed lesson indexes
  toggleLesson: (courseId: number, lessonIndex: number) => void;
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState<{ [courseId: number]: number[] }>({});

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('progress');
    if (saved) {
      setProgress(JSON.parse(saved));
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('progress', JSON.stringify(progress));
  }, [progress]);

  const toggleLesson = (courseId: number, lessonIndex: number) => {
    setProgress(prev => {
      const courseProgress = prev[courseId] || [];
      const exists = courseProgress.includes(lessonIndex);

      return {
        ...prev,
        [courseId]: exists
          ? courseProgress.filter(i => i !== lessonIndex)
          : [...courseProgress, lessonIndex]
      };
    });
  };

  return (
    <ProgressContext.Provider value={{ progress, toggleLesson }}>
      {children}
    </ProgressContext.Provider>
  );
}

// ✅ Make sure to export this exactly
export function useProgress() {
  const context = useContext(ProgressContext);
  if (!context) throw new Error('useProgress must be used within a ProgressProvider');
  return context;
}

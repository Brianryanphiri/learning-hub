export interface Course {
  id: number;
  title: string;
  category: string;
  lessons: string[];
}

export const courses: Course[] = [
  {
    id: 1,
    title: 'React for Beginners',
    category: 'Web Development',
    lessons: ['Introduction', 'JSX Basics', 'Components', 'Props & State']
  },
  {
    id: 2,
    title: 'Advanced TypeScript',
    category: 'Programming',
    lessons: ['Types', 'Generics', 'Interfaces', 'Advanced Patterns']
  },
  {
    id: 3,
    title: 'TailwindCSS Mastery',
    category: 'Design',
    lessons: ['Setup', 'Utilities', 'Components', 'Responsive Design']
  }
];

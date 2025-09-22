import { useState } from 'react';
import CourseCard from '../components/CourseCard';
import { courses } from '../data/courses';
import { useProgress } from '../context/ProgressContext';

export default function Catalog() {
  const { progress } = useProgress();

  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', ...Array.from(new Set(courses.map(c => c.category)))];

  // Filter courses based on selected category
  const filteredCourses =
    selectedCategory === 'All'
      ? courses
      : courses.filter(c => c.category === selectedCategory);

  // Add progress for each course
  const coursesWithProgress = filteredCourses.map(course => {
    const completed = progress[course.id]?.length || 0;
    const percent = Math.round((completed / course.lessons.length) * 100);
    return { ...course, progress: percent };
  });

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Course Catalog</h1>

      {/* Category Filter */}
      <div className="flex flex-wrap justify-center gap-3 mb-6">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded font-medium transition ${
              selectedCategory === category
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Courses Grid */}
      {coursesWithProgress.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {coursesWithProgress.map(course => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 mt-8">
          No courses found in this category.
        </p>
      )}
    </div>
  );
}

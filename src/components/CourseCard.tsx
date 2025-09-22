import { Link } from 'react-router-dom';
import { useProgress } from '../context/ProgressContext';
import ProgressBar from './ProgressBar';
import type { Course } from '../data/courses';

interface Props {
  course: Course;
}

export default function CourseCard({ course }: Props) {
  const { progress } = useProgress();

  const completedLessons = progress[course.id]?.length || 0;
  const totalLessons = course.lessons.length;
  const completionPercentage = Math.round((completedLessons / totalLessons) * 100);

  return (
    <div className="border p-4 rounded shadow hover:shadow-lg transition">
      <h2 className="text-lg font-bold">{course.title}</h2>
      <p className="text-sm text-gray-600">{course.category}</p>

      <div className="my-2">
        <ProgressBar percentage={completionPercentage} />
        <p className="text-xs text-gray-500 mt-1">{completionPercentage}% completed</p>
      </div>

      <Link
        to={`/courses/${course.id}`}
        className="text-blue-600 hover:underline mt-2 inline-block"
      >
        View Course
      </Link>
    </div>
  );
}

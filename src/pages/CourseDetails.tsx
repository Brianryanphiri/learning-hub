import { useParams } from 'react-router-dom';
import { courses } from '../data/courses';
import { useProgress } from '../context/ProgressContext';
import ProgressBar from '../components/ProgressBar';

export default function CourseDetails() {
  const { id } = useParams();
  const courseId = Number(id);
  const course = courses.find(c => c.id === courseId);
  const { progress, toggleLesson } = useProgress();

  if (!course) return <div className="p-4 text-red-500">Course not found</div>;

  const completedLessons = progress[courseId] || [];
  const completionPercentage = Math.round(
    (completedLessons.length / course.lessons.length) * 100
  );

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
      <p className="text-gray-600 mb-4">{course.category}</p>

      <div className="mb-4">
        <ProgressBar progress={completionPercentage} />
        <p className="text-sm text-gray-500 mt-1">{completionPercentage}% completed</p>
      </div>

      <h2 className="text-xl font-semibold mt-6 mb-2">Lessons:</h2>
      <ul className="space-y-2">
        {course.lessons.map((lesson, index) => (
          <li key={index} className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={completedLessons.includes(index)}
              onChange={() => toggleLesson(courseId, index)}
              className="w-4 h-4"
            />
            <span
              className={completedLessons.includes(index) ? 'line-through text-gray-400' : ''}
            >
              {lesson}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

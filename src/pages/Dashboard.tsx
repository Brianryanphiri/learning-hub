import { courses } from '../data/courses';
import { useProgress } from '../context/ProgressContext';
import ProgressBar from '../components/ProgressBar';

export default function Dashboard() {
  const { progress } = useProgress();

  const totalLessons = courses.reduce((sum, c) => sum + c.lessons.length, 0);
  const completedLessons = courses.reduce(
    (sum, c) => sum + (progress[c.id]?.length || 0),
    0
  );
  const overallPercentage = Math.round((completedLessons / totalLessons) * 100);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Your Dashboard</h1>

      <div className="mb-6">
        <h2 className="text-lg font-semibold">Overall Progress</h2>
        <ProgressBar percentage={overallPercentage} />
        <p className="text-sm text-gray-500 mt-1">{overallPercentage}% completed</p>
      </div>

      <h2 className="text-lg font-semibold mb-2">Courses</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {courses.map(course => {
          const completed = progress[course.id]?.length || 0;
          const percent = Math.round((completed / course.lessons.length) * 100);

          return (
            <div key={course.id} className="border p-4 rounded shadow">
              <h3 className="font-bold mb-2">{course.title}</h3>
              <ProgressBar percentage={percent} />
              <p className="text-xs text-gray-500 mt-1">{percent}% completed</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

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
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-extrabold text-gray-800 mb-8">Your Dashboard</h1>

        {/* Overall Progress Card */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-700 mb-2">Overall Progress</h2>
          <ProgressBar progress={overallPercentage} />
          <p className="text-sm text-gray-500 mt-2">{overallPercentage}% of all lessons completed</p>
        </div>

        {/* Courses Section */}
        <h2 className="text-xl font-bold text-gray-700 mb-4">Courses</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map(course => {
            const completed = progress[course.id]?.length || 0;
            const percent = Math.round((completed / course.lessons.length) * 100);

            return (
              <div key={course.id} className="bg-white border border-gray-200 rounded-lg shadow-sm p-5 transition-transform transform hover:scale-105">
                <h3 className="font-semibold text-lg text-gray-800 mb-2">{course.title}</h3>
                <p className="text-sm text-gray-600 mb-3">{course.lessons.length} lessons</p>
                <ProgressBar progress={percent} />
                <p className="text-xs text-gray-500 mt-2">{percent}% completed</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
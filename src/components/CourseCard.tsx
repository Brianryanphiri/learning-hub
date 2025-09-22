import { Link } from 'react-router-dom';

interface Course {
  id: number;
  title: string;
  category: string;
  progress: number;
}

interface Props {
  course: Course;
}

export default function CourseCard({ course }: Props) {
  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition transform hover:-translate-y-1 p-6 flex flex-col justify-between h-full">
      <div>
        <h2 className="text-lg font-bold text-gray-800 mb-2">{course.title}</h2>
        <p className="text-sm text-gray-500 mb-4">{course.category}</p>

        {/* Progress Bar */}
        <div className="bg-gray-200 rounded-full h-3 w-full mb-2 overflow-hidden">
          <div
            className="bg-blue-500 h-3 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${course.progress}%` }}
          ></div>
        </div>
        <p className="text-xs text-gray-400">{course.progress}% completed</p>
      </div>

      <Link
        to={`/courses/${course.id}`}
        className="mt-4 text-blue-600 font-semibold hover:underline"
      >
        View Course
      </Link>
    </div>
  );
}

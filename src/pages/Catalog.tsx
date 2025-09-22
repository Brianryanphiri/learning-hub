import CourseCard from '../components/CourseCard';
import { courses } from '../data/courses';

export default function Catalog() {
  return (
    <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {courses.map(course => (
        <CourseCard key={course.id} course={course} /> // no 'progress' added
      ))}
    </div>
  );
}

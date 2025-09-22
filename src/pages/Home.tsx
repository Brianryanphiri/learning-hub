import { Link } from 'react-router-dom';
import { courses } from '../data/courses';
import CourseCard from '../components/CourseCard';
import { useProgress } from '../context/ProgressContext';

export default function Home() {
  const { progress } = useProgress();

  // Pick 3 featured courses
  const featuredCourses = courses.slice(0, 3).map(course => {
    const completed = progress[course.id]?.length || 0;
    const percent = Math.round((completed / course.lessons.length) * 100);
    return { ...course, progress: percent };
  });

  return (
    <div className="bg-white min-h-screen font-sans antialiased">
      {/* Hero Section */}
      <section className="bg-blue-700 text-white py-28 px-4 text-center relative overflow-hidden">
        {/* Subtle background pattern for visual interest */}
        <div className="absolute inset-0 z-0 opacity-10" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23FFFFFF\' fill-opacity=\'0.4\'%3E%3Cpath d=\'M36 34.225L42.5 40.725L42.5 40.725L42.5 40.725L36 34.225L36 34.225L36 34.225L36 34.225L36 34.225ZM18.5 24.225L25 30.725L25 30.725L25 30.725L18.5 24.225L18.5 24.225L18.5 24.225L18.5 24.225L18.5 24.225ZM48.5 12.225L55 18.725L55 18.725L55 18.725L48.5 12.225L48.5 12.225L48.5 12.225L48.5 12.225L48.5 12.225ZM6 24.225L12.5 30.725L12.5 30.725L12.5 30.725L6 24.225L6 24.225L6 24.225L6 24.225L6 24.225Z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }} />
        <div className="relative z-10">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 drop-shadow-lg">Welcome to Learning Hub</h1>
          <p className="text-lg md:text-xl mb-8 max-w-3xl mx-auto opacity-90">
            Learn at your own pace with expertly designed courses in Web Development,
            Programming, and Design. Track your progress and achieve your learning goals.
          </p>
          <Link
            to="/catalog"
            className="bg-white text-blue-700 font-semibold py-3 px-8 rounded-full shadow-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105"
          >
            Browse Courses
          </Link>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="py-24 px-4 max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-gray-800">Featured Courses</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredCourses.map(course => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </section>

      {/* Categories Section */}
      <section className="bg-gray-100 py-24 px-4">
        <h2 className="text-3xl md:text-4xl font-bold mb-10 text-center text-gray-800">Explore Categories</h2>
        <div className="flex flex-wrap justify-center gap-6 max-w-5xl mx-auto">
          {['Web Development', 'Programming', 'Design'].map((category, index) => (
            <Link
              key={index}
              to="/catalog"
              className="bg-white shadow-md px-8 py-5 rounded-lg hover:shadow-xl transition-all font-medium text-blue-600 border border-gray-200"
            >
              {category}
            </Link>
          ))}
        </div>
      </section>

      {/* Call-to-Action */}
      <section className="py-24 px-4 text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-800">Start Learning Today!</h2>
        <p className="mb-8 text-gray-600 max-w-2xl mx-auto text-lg">
          Join thousands of learners and track your progress seamlessly with Learning Hub.
        </p>
        <Link
          to="/catalog"
          className="bg-blue-700 text-white font-semibold py-4 px-12 rounded-full shadow-lg hover:bg-blue-800 transition-all duration-300 transform hover:scale-105"
        >
          Get Started
        </Link>
      </section>
    </div>
  );
}
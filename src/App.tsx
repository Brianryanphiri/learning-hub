import React, { useState, useEffect, createContext, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useParams } from 'react-router-dom';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';
import type { User } from 'firebase/auth';
import { getFirestore, doc, onSnapshot, setDoc } from 'firebase/firestore';

// Declare global variables to satisfy TypeScript.
declare const __app_id: string | undefined;
declare const __firebase_config: string | undefined;
declare const __initial_auth_token: string | undefined;

// Explicitly declare global variables for local development and TypeScript compatibility
let appId = 'local-app-id';
let firebaseConfig = {};
let initialAuthToken = null;

// Use the actual global variables if they are provided by the environment
if (typeof __app_id !== 'undefined') {
  appId = __app_id;
}
if (typeof __firebase_config !== 'undefined') {
  try {
    firebaseConfig = JSON.parse(__firebase_config);
  } catch (e) {
    console.error("Failed to parse firebase config:", e);
  }
}
if (typeof __initial_auth_token !== 'undefined') {
  initialAuthToken = __initial_auth_token;
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Data
const courses = [
  {
    id: 'web-dev-101',
    title: 'Web Development 101',
    description: 'Learn the fundamentals of HTML, CSS, and JavaScript.',
    image: 'https://placehold.co/600x400/FF5733/FFFFFF?text=Web+Dev',
    lessons: [
      { id: 'html-intro', title: 'Introduction to HTML', content: 'HTML (HyperText Markup Language) is the most basic building block of the Web. It defines the meaning and structure of web content. Other technologies besides HTML are generally used to describe a web page\'s appearance/presentation (CSS) or functionality/behavior (JavaScript).' },
      { id: 'css-basics', title: 'CSS Fundamentals', content: 'Cascading Style Sheets (CSS) is a style sheet language used for describing the presentation of a document written in a markup language such as HTML. CSS is a cornerstone technology of the World Wide Web, alongside HTML and JavaScript.' },
      { id: 'js-dom', title: 'JavaScript and the DOM', content: 'JavaScript is a scripting language that enables you to create dynamically updating content, control multimedia, animate images, and much more. The DOM (Document Object Model) is a programming interface for web documents.' },
      { id: 'forms', title: 'Building Forms', content: 'HTML forms are used to collect user input. The input is most often sent to a server for processing. Forms are a critical part of web applications for user interaction.' },
      { id: 'flexbox', title: 'Flexbox and Responsive Design', content: 'Flexbox is a one-dimensional layout method for arranging items in rows or columns. Items flex to fill extra space or shrink to prevent overflow. It is perfect for building responsive web designs.' },
    ],
  },
  {
    id: 'react-from-scratch',
    title: 'React from Scratch',
    description: 'Master modern React with hooks, context, and more.',
    image: 'https://placehold.co/600x400/33C7FF/FFFFFF?text=React',
    lessons: [
      { id: 'react-intro', title: 'Getting Started with React', content: 'React is a free and open-source front-end JavaScript library for building user interfaces based on components. It is maintained by Meta and a community of individual developers and companies.' },
      { id: 'components', title: 'Functional Components', content: 'Functional components are plain JavaScript functions that return JSX. They are the standard way to build components in modern React and can be managed with state and side effects using hooks.' },
      { id: 'state-hooks', title: 'State and Hooks', content: 'Hooks are functions that let you "hook into" React state and lifecycle features from functional components. Hooks allow you to use state and other React features without writing a class.' },
      { id: 'context-api', title: 'Using the Context API', content: 'Context provides a way to pass data through the component tree without having to pass props down manually at every level. It is designed to share data that can be considered “global” for a tree of React components.' },
    ],
  },
  {
    id: 'tailwind-css',
    title: 'Mastering Tailwind CSS',
    description: 'Go from zero to hero with Tailwind CSS.',
    image: 'https://placehold.co/600x400/8B80F9/FFFFFF?text=Tailwind+CSS',
    lessons: [
      { id: 'tailwind-intro', title: 'Introduction to Tailwind', content: 'Tailwind CSS is a utility-first CSS framework for rapidly building custom user interfaces. Instead of pre-designed components, it provides a set of low-level "utility classes" that let you build unique designs.' },
      { id: 'layout', title: 'Layout and Spacing', content: 'Tailwind\'s layout utilities provide a straightforward way to control the layout and spacing of elements in your design. They include utilities for display, flexbox, grid, and spacing.' },
      { id: 'components', title: 'Building Components', content: 'Tailwind encourages a utility-first workflow, where you build reusable components by composing utility classes directly in your markup. This allows for highly customized designs without writing custom CSS.' },
    ],
  },
];

// Define a type for the progress object
interface Progress {
  [key: string]: string[];
}

// Define the shape of the context value
interface ProgressContextType {
  progress: Progress;
  toggleLesson: (courseId: string, lessonId: string) => void;
  user: User | null;
  isLoading: boolean;
}

// Define a default context value to satisfy TypeScript's `createContext`
const defaultProgressContext: ProgressContextType = {
  progress: {},
  toggleLesson: () => {},
  user: null,
  isLoading: true,
};

// Context
const ProgressContext = createContext<ProgressContextType>(defaultProgressContext);

const useProgress = () => useContext(ProgressContext);

interface ProgressProviderProps {
  children: React.ReactNode;
}

const ProgressProvider = ({ children }: ProgressProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [progress, setProgress] = useState<Progress>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // This is the main listener for auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        
        // Listen for real-time progress updates from Firestore
        const userRef = doc(db, 'artifacts', appId, 'users', currentUser.uid);
        const unsubscribeSnapshot = onSnapshot(userRef, (docSnap) => {
          if (docSnap.exists()) {
            setProgress(docSnap.data().courseProgress as Progress || {});
          } else {
            // Document does not exist, initialize with empty progress
            setProgress({});
          }
          setIsLoading(false);
        }, (error) => {
          console.error("Error listening to user doc:", error);
          setIsLoading(false);
        });
        
        // Return the cleanup function for the onSnapshot listener
        return () => unsubscribeSnapshot();
      } else {
        // No user signed in, sign in using the available token or anonymously
        try {
          if (initialAuthToken) {
            await signInWithCustomToken(auth, initialAuthToken);
          } else {
            await signInAnonymously(auth);
          }
        } catch (error) {
          console.error("Firebase sign-in failed:", error);
        }
      }
    });

    // Return the cleanup function for the onAuthStateChanged listener
    return () => unsubscribe();
  }, [appId]);

  const toggleLesson = async (courseId: string, lessonId: string) => {
    if (!user) {
      console.error('User not authenticated.');
      return;
    }

    const currentProgress = progress[courseId] || [];
    const lessonIndex = currentProgress.indexOf(lessonId);
    const newProgress: Progress = { ...progress };

    if (lessonIndex > -1) {
      newProgress[courseId] = currentProgress.filter((id: string) => id !== lessonId);
    } else {
      newProgress[courseId] = [...currentProgress, lessonId];
    }

    setProgress(newProgress);
    const userRef = doc(db, 'artifacts', appId, 'users', user.uid);
    try {
      await setDoc(userRef, { courseProgress: newProgress }, { merge: true });
    } catch (error) {
      console.error("Failed to update progress:", error);
    }
  };

  const contextValue: ProgressContextType = {
    progress,
    toggleLesson,
    user,
    isLoading
  }

  return (
    <ProgressContext.Provider value={contextValue}>
      {children}
    </ProgressContext.Provider>
  );
};

// Components
const Navbar = () => {
  const { user } = useProgress();
  return (
    <header className="bg-white shadow-md p-4 sticky top-0 z-50">
      <nav className="flex items-center justify-between max-w-7xl mx-auto">
        <Link to="/" className="text-2xl font-bold text-blue-600">
          Learning Hub
        </Link>
        <div className="space-x-4 flex items-center">
          <Link to="/" className="text-gray-600 hover:text-blue-600 font-medium transition">
            Home
          </Link>
          <Link to="/catalog" className="text-gray-600 hover:text-blue-600 font-medium transition">
            Catalog
          </Link>
          <Link to="/dashboard" className="text-gray-600 hover:text-blue-600 font-medium transition">
            Dashboard
          </Link>
        </div>
      </nav>
      {user && (
        <div className="max-w-7xl mx-auto text-xs text-gray-500 mt-2">
          User ID: {user.uid}
        </div>
      )}
    </header>
  );
};

const Footer = () => (
  <footer className="bg-gray-800 text-white p-6 text-center">
    <div className="max-w-7xl mx-auto">
      <p className="text-sm">
        &copy; {new Date().getFullYear()} Learning Hub. All rights reserved.
      </p>
    </div>
  </footer>
);

interface ProgressBarProps {
  progress: number;
}
const ProgressBar = ({ progress }: ProgressBarProps) => {
  return (
    <div className="w-full bg-gray-200 rounded-full h-2.5">
      <div
        className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  );
};

interface Lesson {
  id: string;
  title: string;
  content: string;
}

interface Course {
  id: string;
  title: string;
  description: string;
  image: string;
  lessons: Lesson[];
}

interface CourseCardProps {
  course: Course;
}
const CourseCard = ({ course }: CourseCardProps) => {
  const { progress } = useProgress();
  const completed = progress[course.id]?.length || 0;
  const percent = Math.round((completed / course.lessons.length) * 100);

  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 p-6 flex flex-col justify-between">
      <div>
        <h3 className="font-bold text-xl text-gray-800 mb-2">{course.title}</h3>
        <p className="text-gray-600 text-sm mb-4">{course.description}</p>
      </div>
      <div>
        <ProgressBar progress={percent} />
        <div className="flex justify-between items-center mt-2">
          <p className="text-sm text-gray-500">{percent}% Completed</p>
          <Link to={`/courses/${course.id}`} className="text-blue-600 font-semibold text-sm hover:underline">
            View Course
          </Link>
        </div>
      </div>
    </div>
  );
};

const Home = () => {
  const { progress } = useProgress();
  const featuredCourses = courses.slice(0, 3).map(course => {
    const completed = progress[course.id]?.length || 0;
    const percent = Math.round((completed / course.lessons.length) * 100);
    return { ...course, progress: percent };
  });

  return (
    <div className="bg-white min-h-screen font-sans antialiased">
      {/* Hero Section */}
      <section className="bg-blue-700 text-white py-28 px-4 text-center relative overflow-hidden">
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
      <section className="py-24 px-4 max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-gray-800">Featured Courses</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredCourses.map(course => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </section>
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
};

const Dashboard = () => {
  const { progress } = useProgress();

  const totalLessons = courses.reduce((sum, c) => sum + c.lessons.length, 0);
  const completedLessons = courses.reduce(
    (sum, c) => sum + (progress[c.id]?.length || 0),
    0
  );
  const overallPercentage = Math.round((completedLessons / totalLessons) * 100);

  return (
    <div className="min-h-screen bg-gray-100 p-8 font-sans antialiased">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-extrabold text-gray-800 mb-8">Your Dashboard</h1>
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-700 mb-2">Overall Progress</h2>
          <ProgressBar progress={overallPercentage} />
          <p className="text-sm text-gray-500 mt-2">{overallPercentage}% of all lessons completed</p>
        </div>
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
};

const Catalog = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-8 font-sans antialiased">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-extrabold text-gray-800 mb-8">All Courses</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map(course => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </div>
    </div>
  );
};

const CourseDetails = () => {
  const { id } = useParams();
  const { progress, toggleLesson } = useProgress();
  const course = courses.find(c => c.id === id);

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-100 p-8 text-center font-sans antialiased">
        <h1 className="text-3xl font-extrabold text-gray-800">Course not found</h1>
        <Link to="/catalog" className="text-blue-600 hover:underline mt-4 block">
          Go back to Catalog
        </Link>
      </div>
    );
  }

  const completedLessons = progress[course.id] || [];
  const percent = Math.round((completedLessons.length / course.lessons.length) * 100);

  return (
    <div className="min-h-screen bg-gray-100 p-8 font-sans antialiased">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-xl p-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">{course.title}</h1>
        <p className="text-gray-600 text-lg mb-6">{course.description}</p>
        <ProgressBar progress={percent} />
        <p className="text-sm text-gray-500 mt-2">{percent}% Completed</p>
        <div className="my-8">
          <img
            src={course.image}
            alt={course.title}
            className="w-full h-auto rounded-lg shadow-lg"
            onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
              e.currentTarget.onerror = null; // prevents infinite loop
              e.currentTarget.src = "https://placehold.co/600x400/CCCCCC/000000?text=Image+Not+Found";
            }}
          />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Lessons</h2>
        <div className="space-y-4">
          {course.lessons.map(lesson => {
            const isCompleted = completedLessons.includes(lesson.id);
            return (
              <div
                key={lesson.id}
                className={`p-5 rounded-lg border-2 transition-all duration-200 cursor-pointer ${
                  isCompleted ? 'bg-green-50 border-green-500' : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                }`}
                onClick={() => toggleLesson(course.id, lesson.id)}
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-lg text-gray-800">{lesson.title}</h3>
                  <span className={`text-sm font-medium ${isCompleted ? 'text-green-600' : 'text-gray-400'}`}>
                    {isCompleted ? 'Completed' : 'Mark as Complete'}
                  </span>
                </div>
                <p className="mt-2 text-sm text-gray-600">{lesson.content}</p>
              </div>
            );
          })}
        </div>
        <Link
          to="/catalog"
          className="mt-8 inline-block bg-blue-600 text-white font-semibold py-3 px-6 rounded-full shadow-lg hover:bg-blue-700 transition-all transform hover:-translate-y-1"
        >
          Back to Catalog
        </Link>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <ProgressProvider>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/catalog" element={<Catalog />} />
              <Route path="/courses/:id" element={<CourseDetails />} />
              <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </ProgressProvider>
    </Router>
  );
};

export default App;

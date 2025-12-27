import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Welcome to <span className="text-blue-600 dark:text-blue-400">EduConnect</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8">
            Connect, Learn, and Grow Together
          </p>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto">
            A comprehensive educational platform that brings students and educators together. 
            Explore courses, share knowledge, and build your learning community.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/auth/register"
              className="px-8 py-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors w-full sm:w-auto"
            >
              Get Started
            </Link>
            <Link
              href="/courses"
              className="px-8 py-4 bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 border-2 border-blue-600 dark:border-blue-400 rounded-lg font-semibold hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors w-full sm:w-auto"
            >
              Browse Courses
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="text-4xl mb-4">🎓</div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              Quality Courses
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Access a wide range of courses designed by expert educators to help you achieve your learning goals.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="text-4xl mb-4">📰</div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              Educational Posts
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Stay updated with the latest educational content, tips, and insights from our community.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="text-4xl mb-4">🤝</div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              Connect & Collaborate
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Build meaningful connections with students and educators from around the world.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="bg-blue-600 dark:bg-blue-700 rounded-2xl p-12 text-center max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Start Your Learning Journey?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of learners already on EduConnect
          </p>
          <Link
            href="/auth/register"
            className="inline-block px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
          >
            Create Free Account
          </Link>
        </div>
      </section>
    </div>
  );
}

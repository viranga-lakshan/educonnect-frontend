export default function TeacherDashboard() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
          Teacher Dashboard
        </h1>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            Welcome to your teacher dashboard! This page will contain your courses, students, and content management tools.
          </p>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-blue-900 dark:text-blue-300 mb-2">
                My Courses
              </h3>
              <p className="text-blue-700 dark:text-blue-400">Coming Soon</p>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-green-900 dark:text-green-300 mb-2">
                Students
              </h3>
              <p className="text-green-700 dark:text-green-400">Coming Soon</p>
            </div>
            <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-purple-900 dark:text-purple-300 mb-2">
                Content
              </h3>
              <p className="text-purple-700 dark:text-purple-400">Coming Soon</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

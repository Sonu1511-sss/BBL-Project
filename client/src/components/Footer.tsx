export default function Footer() {
  return (
    <footer className="bg-dark-900 border-t border-dark-700 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-gray-100 mb-4">Babua LMS</h3>
            <p className="text-sm text-gray-400">
              Complete curriculum for tech interviews. 100% free, forever.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-100 mb-4">Learn</h4>
            <ul className="space-y-2">
              <li><a href="/courses" className="text-sm text-gray-400 hover:text-gray-100">Courses</a></li>
              <li><a href="/community" className="text-sm text-gray-400 hover:text-gray-100">Community</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-100 mb-4">Account</h4>
            <ul className="space-y-2">
              <li><a href="/dashboard" className="text-sm text-gray-400 hover:text-gray-100">Dashboard</a></li>
              <li><a href="/profile" className="text-sm text-gray-400 hover:text-gray-100">Profile</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-100 mb-4">Support</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-sm text-gray-400 hover:text-gray-100">Help Center</a></li>
              <li><a href="#" className="text-sm text-gray-400 hover:text-gray-100">Contact Us</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-dark-700 text-center text-sm text-gray-400">
          <p>&copy; 2024 Babua LMS. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

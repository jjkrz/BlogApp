import { Link } from 'react-router-dom';
import { isAuthenticated, getUser, logout } from '../utils/auth';
import { LogOut, User } from 'lucide-react';

export default function Navbar() {
  const user = getUser();
  const authenticated = isAuthenticated();

  return (
    <nav className="w-full bg-white shadow-md border-b border-gray-200">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link 
            to="/" 
            className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
          >
            Blog App
          </Link>

          {/* Nawigacja */}
          <div className="flex items-center gap-6">

            {authenticated ? (
              <>
                {/* Chronione linki */}
                <Link 
                  to="/create" 
                  className="text-gray-700 hover:text-black transition"
                >
                  Utwórz post
                </Link>

                <Link 
                  to={`/users/${user?.id}/posts`} 
                  className="text-gray-700 hover:text-black transition"
                >
                  Moje posty
                </Link>

                <Link 
                  to="/users" 
                  className="text-gray-700 hover:text-black transition"
                >
                  Lista użytkowników
                </Link>

                {/* Użytkownik + logout */}
                <div className="flex items-center gap-2 text-gray-700">
                  <User className="w-5 h-5" />
                  <span className="font-semibold">{user?.username}</span>
                </div>

                <button
                  onClick={logout}
                  className="flex items-center gap-2 px-4 py-2 bg-red-500 text-black rounded-lg hover:bg-red-600 transition"
                >
                  <LogOut className="w-4 h-4" />
                  Wyloguj
                </button>
              </>
            ) : (
              <>
                {/* Linki dla niezalogowanych */}
                <Link
                  to="/login"
                  className="px-4 py-2 text-blue-600 font-semibold hover:text-blue-700 transition"
                >
                  Zaloguj się
                </Link>

                <Link
                  to="/register"
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition"
                >
                  Zarejestruj się
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

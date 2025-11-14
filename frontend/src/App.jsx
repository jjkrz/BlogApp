// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import CreatePost from './pages/CreatePost';
import PostDetail from './pages/PostDetail';
import PostEdit from './pages/PostEdit';
import UserPosts from './pages/UserPosts';
import UsersList from './pages/UsersList';
import UserDetails from './pages/UserDetails';
import UserEdit from './pages/UserEdit';
import ProtectedRoute from './components/ProtectedRoute';
import BigButton from './pages/BigButton.jsx';

function App() {
  return (
    <BrowserRouter>
    <div className="min-h-screen">
        <Navbar />
          <main className="w-full">
          <Routes>
            {/* Publiczne ścieżki */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route path="/posts/:id" element={<PostDetail />} />

            <Route path="/users" element={<UsersList />} />
            <Route path="/users/:id" element={<UserDetails />} />

            {/* Chronione ścieżki */}
            <Route
              path="/create"
              element={
                <ProtectedRoute>
                  <CreatePost />
                </ProtectedRoute>
              }
            />

            <Route
              path="/posts/:id/edit"
              element={
                <ProtectedRoute>
                  <PostEdit />
                </ProtectedRoute>
              }
            />

            <Route
              path="/users/:id/posts"
              element={
                <ProtectedRoute>
                  <UserPosts />
                </ProtectedRoute>
              }
            />

            <Route
              path="/users/:id/edit"
              element={
                <ProtectedRoute>
                  <UserEdit />
                </ProtectedRoute>
              }
            />
            
          </Routes>
          </main>
      </div>
    </BrowserRouter>
  );
}

export default App;

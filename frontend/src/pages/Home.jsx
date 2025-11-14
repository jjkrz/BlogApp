import { useEffect, useState } from "react";
import api from "../utils/axios"; // <-- Użyj api zamiast axios
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Calendar, User, Clock, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Teraz używamy api zamiast axios - token jest automatycznie dodawany
    api.get("/blog/posts/")
      .then(res => {
        setPosts(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pl-PL', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const calculateReadTime = (content) => {
    const wordsPerMinute = 200;
    const words = content.split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return minutes;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-2xl h-64"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50">
      <div className="max-w-5xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-16 text-center">
          <h1 className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-4">
            Najnowsze wpisy
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Odkryj inspirujące historie, pomysły i wiedzę od naszej społeczności
          </p>
        </div>

        {/* Featured Post (pierwszy post) */}
        {posts.length > 0 && (
          <Card className="mb-12 group hover:shadow-2xl transition-all duration-500 border-0 bg-white overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600"></div>
            <CardContent className="p-0">
              <div className="p-10">
                <span className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-bold px-4 py-2 rounded-full mb-6">
                  ⭐ WYRÓŻNIONY WPIS
                </span>

                <h2 className="text-4xl font-bold text-gray-900 mb-6 group-hover:text-blue-600 transition-colors duration-300 leading-tight">
                  {posts[0].title}
                </h2>

                <p className="text-gray-700 text-lg leading-relaxed mb-8">
                  {posts[0].content.slice(0, 280)}
                  {posts[0].content.length > 280 ? '...' : ''}
                </p>

                <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 mb-6">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-blue-600" />
                    <span className="font-semibold text-gray-900">{posts[0].author}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-blue-600" />
                    <span>{formatDate(posts[0].created_at)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-blue-600" />
                    <span>{calculateReadTime(posts[0].content)} min czytania</span>
                  </div>
                </div>

                <button onClick={() => navigate(`/posts/${posts[0].id}`)} className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold px-6 py-3 rounded-lg hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200">
                  Czytaj więcej
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Regular Posts Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {posts.slice(1).map((post) => (
            <Card 
              key={post.id} 
              className="group hover:shadow-xl transition-all duration-300 border-0 bg-white hover:-translate-y-1 overflow-hidden"
            >
              <CardContent className="p-0">
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors duration-200 leading-snug">
                    {post.title}
                  </h3>

                  <p className="text-gray-600 leading-relaxed mb-6 line-clamp-3">
                    {post.content.slice(0, 150)}
                    {post.content.length > 150 ? '...' : ''}
                  </p>

                  <div className="flex flex-col gap-3 text-sm text-gray-500 mb-6">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-blue-500" />
                      <span className="font-medium text-gray-700">{post.author}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-blue-500" />
                        <span>{formatDate(post.created_at)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-blue-500" />
                        <span>{calculateReadTime(post.content)} min</span>
                      </div>
                    </div>
                  </div>

                  <button onClick={() => navigate(`/posts/${post.id}`)} className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:gap-3 transition-all duration-200">
                    Czytaj dalej
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {posts.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Brak postów</h3>
            <p className="text-gray-600">Wkrótce pojawią się tutaj nowe artykuły!</p>
          </div>
        )}
      </div>
    </div>
  );
}
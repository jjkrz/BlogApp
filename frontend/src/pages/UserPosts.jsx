import { useEffect, useState } from "react";
import api from "../utils/axios";
import { Card, CardContent } from "@/components/ui/card";
import { Link, useParams } from "react-router-dom";
import { Calendar, User, Clock } from "lucide-react";

export default function UserPosts() {
  const { id } = useParams(); 
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get(`/blog/users/${id}/posts/`)
      .then((res) => {
        setPosts(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Błąd pobierania postów użytkownika:", err);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center text-gray-500">
        Ładowanie postów...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
        <User className="w-6 h-6" />
        Posty użytkownika: {posts[0]?.author}
      </h1>

      {posts.length === 0 ? (
        <p className="text-gray-500">Ten użytkownik nie ma jeszcze żadnych postów.</p>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <Link to={`/posts/${post.id}`} key={post.id}>
              <Card className="cursor-pointer hover:shadow-md transition">
                <CardContent className="p-5">
                  <h2 className="text-xl font-semibold mb-2">{post.title}</h2>

                  <p classclassName="text-gray-700 line-clamp-2">
                    {post.content}
                  </p>

                  <div className="flex items-center gap-4 text-gray-500 text-sm mt-3">
                    <span className="flex items-center gap-1">
                      <Calendar size={16} />
                      {new Date(post.created_at).toLocaleDateString()}
                    </span>

                    <span className="flex items-center gap-1">
                      <Clock size={16} />
                      {new Date(post.created_at).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

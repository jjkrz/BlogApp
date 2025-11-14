import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../utils/axios";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Pencil, Trash2 } from "lucide-react";
import { getUser } from "../utils/auth";

export default function PostDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const currentUser = getUser();
  const [user, setUser] = useState(null);

  const handleDelete = async () => {
    try {
      await api.delete(`/blog/posts/${id}/`);
      navigate("/");
    } catch (err) {
      console.error("Błąd podczas usuwania posta:", err);
      setError("Nie udało się usunąć posta");
    }
  };

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await api.get(`/blog/posts/${id}/`);
        setPost(response.data);
      } catch (err) {
        setError("Nie udało się pobrać posta");
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);
  

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get(`users/${currentUser.id}`);
        setUser(response.data);
      } catch (err) {
        console.error("Błąd pobierania użytkownika:", err);
      }
    };

    fetchUser();
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-600">
        <Loader2 className="w-8 h-8 animate-spin" />
        <span className="ml-3 text-lg font-medium">Ładowanie...</span>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <Alert className="bg-red-50 border-red-200 max-w-xl">
          <AlertDescription className="text-red-800 text-lg">
            {error}
          </AlertDescription>
        </Alert>
      </div>
    );

  if (!post)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-700 text-xl">
        Nie znaleziono posta.
      </div>
    );

  const canModify =
    user &&
    (user.is_staff ||
      user?.groups[0] === "moderators" ||
      user.username === post?.author);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <Card className="shadow-2xl border-0">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-gray-900">
              {post.title}
            </CardTitle>
            <p className="text-gray-600 mt-1">Autor: {post.author}</p>
          </CardHeader>

          <CardContent>
            <div className="prose max-w-none text-gray-800 mb-8 whitespace-pre-wrap">
              {post.content}
            </div>

            {/* Błąd akcji */}
            {error && (
              <Alert className="mb-4 bg-red-50 border-red-200">
                <AlertDescription className="text-red-800">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            {/* ----------------------------------------------------
                PRZYCISKI WIDOCZNE TYLKO DLA STAFF / MODERATOR / AUTOR
               ---------------------------------------------------- */}
            {canModify && (
              <div className="flex gap-4 mt-6">
                <button
                  onClick={() => navigate(`/posts/${id}/edit`)}
                  className="flex items-center gap-2 px-5 py-3 bg-blue-600 text-black font-semibold rounded-lg hover:bg-blue-700 transition shadow-md hover:shadow-lg"
                >
                  <Pencil className="w-5 h-5" />
                  Edytuj posta
                </button>

                <button
                  onClick={handleDelete}
                  className="flex items-center gap-2 px-5 py-3 bg-red-600 text-black font-semibold rounded-lg hover:bg-red-700 transition shadow-md hover:shadow-lg"
                >
                  <Trash2 className="w-5 h-5" />
                  Usuń posta
                </button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

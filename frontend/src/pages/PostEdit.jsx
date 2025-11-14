import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../utils/axios";

const PostEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api
      .get(`/blog/posts/${id}/`)
      .then((res) => {
        setTitle(res.data.title);
        setContent(res.data.content);
        setLoading(false);
      })
      .catch((err) => {
        setError("Nie udało się pobrać posta.");
        setLoading(false);
      });
  }, [id]);

  const handleUpdate = async () => {
    try {
      await api.put(`/blog/posts/${id}/`, {
        title,
        content,
      });

      navigate(`/posts/${id}`);
    } catch (err) {
      console.error(err);
      setError("Nie udało się zaktualizować posta.");
    }
  };

  if (loading) return <p>Ładowanie...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="max-w-xl mx-auto mt-10">
      <h1 className="text-3xl font-bold mb-6">Edytuj post</h1>

      <div className="flex flex-col gap-4">

        <input
          className="border p-2 rounded"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Tytuł posta"
        />

        <textarea
          className="border p-2 rounded min-h-[200px]"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Treść posta..."
        />

        <button
          onClick={handleUpdate}
          className="bg-blue-600 hover:bg-blue-700 text-black px-4 py-2 rounded transition"
        >
          Zapisz zmiany
        </button>

        <button
          onClick={() => navigate(-1)}
          className="bg-gray-400 hover:bg-gray-500 text-black px-4 py-2 rounded transition"
        >
          Anuluj
        </button>
      </div>
    </div>
  );
};

export default PostEdit;

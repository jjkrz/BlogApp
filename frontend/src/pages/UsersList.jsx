import { useEffect, useState } from "react";
import api from "../utils/axios";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api
      .get("/users/")
      .then((res) => {
        setUsers(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Nie udało się pobrać użytkowników.");
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Ładowanie...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="max-w-2xl mx-auto mt-10">
      <h1 className="text-3xl font-bold mb-6">Lista użytkowników</h1>

      <div className="flex flex-col gap-4">
        {users.map((user) => (
          <Card key={user.id} className="shadow-md p-4">
            <CardContent>
              <p className="text-xl font-semibold">{user.username}</p>

              <Link
                to={`/users/${user.id}`}
                className="text-blue-600 hover:underline"
              >
                Zobacz profil →
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default UsersList;

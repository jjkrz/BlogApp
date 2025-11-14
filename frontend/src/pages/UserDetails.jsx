import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Crown, User, Calendar, Mail, Trash2, Edit, Loader2 } from "lucide-react";
import api from "../utils/axios";
import { getUser } from "../utils/auth";

const UserDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const currentUser = getUser();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUserData, setCurrentUserData] = useState(null);

  useEffect(() => {
    api
      .get(`/users/${id}/`)
      .then((res) => {
        setUser(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Nie udało się pobrać użytkownika.");
        setLoading(false);
      });
  }, [id]);

    useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get(`users/${currentUser.id}`);
        setCurrentUserData(response.data);
      } catch (err) {
        console.error("Błąd pobierania użytkownika:", err);
      }
    };

    fetchUser();
  }, []);

  const handleEdit = () => {
    navigate(`/users/${id}/edit`);
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      `Czy na pewno chcesz usunąć użytkownika ${user.username}? Tej operacji nie można cofnąć.`
    );
    if (!confirmDelete) return;

    try {
      await api.delete(`/users/${id}/`);
      alert("Użytkownik został usunięty.");
      navigate("/users");
    } catch (err) {
      console.error(err);
      alert("Nie udało się usunąć użytkownika.");
    }
  };

  // Określ rolę użytkownika
  const getUserRole = (userData) => {
    if (!userData) return null;

    if (userData.is_staff) {
      return {
        label: "Administrator",
        icon: Crown,
        badgeBg: "bg-red-100",
        badgeBorder: "border-red-300",
        textColor: "text-red-700",
      };
    }

    const groups = userData.groups || [];
    if (groups.includes("moderators")) {
      return {
        label: "Moderator",
        icon: Shield,
        badgeBg: "bg-orange-100",
        badgeBorder: "border-orange-300",
        textColor: "text-orange-700",
      };
    }

    return {
      label: "Użytkownik",
      icon: User,
      badgeBg: "bg-green-100",
      badgeBorder: "border-green-300",
      textColor: "text-green-700",
    };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Ładowanie danych użytkownika...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="bg-red-50 border border-red-200 text-red-800 px-6 py-4 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-gray-600">Użytkownik nie istnieje.</p>
      </div>
    );
  }

  const role = getUserRole(user);
  const RoleIcon = role.icon;

  const canModify =
    currentUser &&
    (currentUserData?.is_staff ||
      user.username === currentUserData?.username);

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Profil użytkownika
        </h1>
        <p className="text-gray-600">
          Szczegółowe informacje o koncie
        </p>
      </div>

      <Card className="shadow-lg border-2 border-gray-200">
        <CardContent className="p-8">
          
          {/* Role Badge */}
          <div className="flex justify-center mb-6">
            <div className={`flex items-center gap-3 px-6 py-3 rounded-full ${role.badgeBg} border-2 ${role.badgeBorder}`}>
              <RoleIcon className={`w-6 h-6 ${role.textColor}`} />
              <span className={`text-lg font-bold ${role.textColor}`}>
                {role.label}
              </span>
            </div>
          </div>

          {/* Username */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
              {user.username}
            </h2>
          </div>

          {/* User Info Grid */}
          <div className="space-y-4 bg-gray-50 rounded-lg p-6 mb-6">
            
            {/* ID */}
            <div className="flex items-center justify-between">
              <span className="text-gray-600 font-semibold">ID użytkownika:</span>
              <span className="text-gray-900 font-mono">{user.id}</span>
            </div>

            {/* Email */}
            {user.email && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-600 font-semibold">Email:</span>
                </div>
                <span className="text-gray-900">{user.email}</span>
              </div>
            )}

            {/* Date Joined */}
            {user.date_joined && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-600 font-semibold">Data dołączenia:</span>
                </div>
                <span className="text-gray-900">
                  {new Date(user.date_joined).toLocaleDateString('pl-PL', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
            )}

            {/* Groups */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-gray-500" />
                <span className="text-gray-600 font-semibold">Grupy:</span>
              </div>
              <div className="text-right">
                {user.groups && user.groups.length > 0 ? (
                  <div className="flex flex-wrap gap-2 justify-end">
                    {user.groups.map((group, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
                      >
                        {group}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="text-gray-500 italic">Brak grup</span>
                )}
              </div>
            </div>

            {/* Admin Status */}
            <div className="flex items-center justify-between">
              <span className="text-gray-600 font-semibold">Status administratora:</span>
              <span className={`font-bold ${user.is_staff ? 'text-red-600' : 'text-gray-500'}`}>
                {user.is_staff ? 'Tak' : 'Nie'}
              </span>
            </div>

          </div>

        {/* Action Buttons */}
        {canModify && (
        <div className="flex gap-4 mt-6">
            <button
            onClick={handleEdit}
            className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-black px-6 py-3 rounded-lg font-semibold transition shadow-md hover:shadow-lg"
            >
            <Edit className="w-4 h-4" />
            Edytuj konto
            </button>

            <button
                onClick={handleDelete}
                className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-black px-6 py-3 rounded-lg font-semibold transition shadow-md hover:shadow-lg"
            >
                <Trash2 className="w-4 h-4" />
                Usuń
            </button>

        </div>
        )}

          {/* Info dla zwykłych użytkowników */}
          {!canModify && (
            <div className="mt-6 p-4 bg-gray-100 rounded-lg text-center text-gray-600">
              Nie masz uprawnień do modyfikacji tego konta
            </div>
          )}

        </CardContent>
      </Card>
    </div>
  );
};

export default UserDetails;
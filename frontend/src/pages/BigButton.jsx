import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../utils/axios";
import { getUser } from "../utils/auth";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Crown, User, Settings, Loader2 } from "lucide-react";

const UserProfile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const currentUser = getUser(); // Pobierz zalogowanego użytkownika z localStorage

  useEffect(() => {
    const fetchUserData = async () => {
      if (!currentUser) {
        setError("Nie jesteś zalogowany");
        setLoading(false);
        return;
      }

      try {
        // Pobierz pełne dane użytkownika z API
        const response = await api.get(`/users/${currentUser.id}/`);
        setUserData(response.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Nie udało się pobrać danych użytkownika");
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Funkcja określająca rolę użytkownika
  const getUserRole = (user) => {
    if (!user) return null;

    if (user.is_staff) {
      return {
        label: "Administrator",
        icon: Crown,
        bgColor: "bg-red-500",
        hoverColor: "hover:bg-red-600",
        shadowColor: "hover:shadow-red-200",
        borderColor: "border-red-300",
        textColor: "text-red-700",
        badgeBg: "bg-red-100",
        description: "Masz pełne uprawnienia administratora systemu"
      };
    }
    
    const groups = user.groups || [];
    if (groups.includes("moderators")) {
      return {
        label: "Moderator",
        icon: Shield,
        bgColor: "bg-orange-500",
        hoverColor: "hover:bg-orange-600",
        shadowColor: "hover:shadow-orange-200",
        borderColor: "border-orange-300",
        textColor: "text-orange-700",
        badgeBg: "bg-orange-100",
        description: "Masz uprawnienia moderatora"
      };
    }
    
    return {
      label: "Użytkownik",
      icon: User,
      bgColor: "bg-green-500",
      hoverColor: "hover:bg-green-600",
      shadowColor: "hover:shadow-green-200",
      borderColor: "border-green-300",
      textColor: "text-green-700",
      badgeBg: "bg-green-100",
      description: "Standardowe konto użytkownika"
    };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Ładowanie profilu...</p>
        </div>
      </div>
    );
  }

  if (error || !userData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50">
        <div className="bg-red-50 border border-red-200 text-red-800 px-6 py-4 rounded-lg">
          {error || "Nie znaleziono danych użytkownika"}
        </div>
      </div>
    );
  }

  const role = getUserRole(userData);
  const Icon = role.icon;

  return (
    <div className="container mx-auto py-12 px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-4">
            Twój profil
          </h1>
          <p className="text-xl text-gray-600">
            Zarządzaj swoim kontem
          </p>
        </div>

        {/* Profile Card */}
        <Card className={`shadow-2xl border-2 ${role.borderColor} bg-white overflow-hidden`}>
          <CardContent className="p-8">
            {/* Role Badge */}
            <div className="flex justify-center mb-6">
              <div className={`flex items-center gap-3 px-6 py-3 rounded-full ${role.badgeBg} border-2 ${role.borderColor}`}>
                <Icon className={`w-6 h-6 ${role.textColor}`} />
                <span className={`text-lg font-bold ${role.textColor}`}>
                  {role.label}
                </span>
              </div>
            </div>

            {/* Username */}
            <div className="text-center mb-2">
              <h2 className="text-4xl font-bold text-gray-900">
                {userData.username}
              </h2>
            </div>

            {/* Role Description */}
            <p className="text-center text-gray-600 mb-8">
              {role.description}
            </p>

            {/* User Details */}
            <div className="space-y-4 mb-8 bg-gray-50 rounded-lg p-6">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 font-semibold">ID użytkownika:</span>
                <span className="text-gray-900 font-bold">{userData.id}</span>
              </div>
              
              {userData.email && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-semibold">Email:</span>
                  <span className="text-gray-900">{userData.email}</span>
                </div>
              )}
              
              {userData.date_joined && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-semibold">Data dołączenia:</span>
                  <span className="text-gray-900">
                    {new Date(userData.date_joined).toLocaleDateString('pl-PL', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
              )}

              <div className="flex justify-between items-center">
                <span className="text-gray-600 font-semibold">Status:</span>
                <span className={`font-bold ${role.textColor}`}>
                  {role.label}
                </span>
              </div>
            </div>

          </CardContent>
        </Card>
      </div>
  );
};

export default UserProfile;
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Save, X, AlertCircle } from "lucide-react";
import api from "../utils/axios";
import { getUser } from "../utils/auth";


const UserEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const currentUser = getUser();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [currentUserData, setCurrentUserData] = useState(null);
  
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    groups: [],
    is_staff: false
  });

  const [availableGroups] = useState(["moderators"]); // Lista dostępnych grup
  const isAdmin = currentUserData?.is_staff;

  // Pobierz dane użytkownika
  useEffect(() => {
    api
      .get(`/users/${id}/`)
      .then((res) => {
        setFormData({
          username: res.data.username || "",
          email: res.data.email || "",
          password: "",
          groups: res.data.groups || [],
          is_staff: res.data.is_staff || false
        });
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

  // Obsługa zmian w formularzu
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  // Obsługa grup (checkbox)
  const handleGroupToggle = (groupName) => {
    setFormData(prev => {
      const groups = prev.groups.includes(groupName)
        ? prev.groups.filter(g => g !== groupName)
        : [...prev.groups, groupName];
      return { ...prev, groups };
    });
  };

  // Zapisz zmiany
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const payload = {
        username: formData.username,
        email: formData.email,
      };

      // Hasło tylko jeśli zostało wpisane
      if (formData.password) {
        payload.password = formData.password;
      }

      // Groups i is_staff tylko dla admina
      if (isAdmin) {
        payload.groups = formData.groups;
        payload.is_staff = formData.is_staff;
      }

      await api.patch(`/users/${id}/`, payload);
      alert("Użytkownik został zaktualizowany!");
      navigate(`/users/${id}`);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || "Nie udało się zaktualizować użytkownika.");
    } finally {
      setSaving(false);
    }
  };

  // Sprawdź uprawnienia
  const canEdit = currentUser && (currentUserData?.is_staff || currentUserData?.username === formData.username);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Ładowanie danych...</p>
        </div>
      </div>
    );
  }

  if (!canEdit) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-2xl">
        <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6 text-center">
          <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-red-800 mb-2">Brak uprawnień</h2>
          <p className="text-red-700">Nie masz uprawnień do edycji tego użytkownika.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl">
      
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Edycja użytkownika
        </h1>
        <p className="text-gray-600">
          Zaktualizuj dane konta
        </p>
      </div>

      <Card className="shadow-lg border-2 border-gray-200">
        <CardContent className="p-8">
          
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Username */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Nazwa użytkownika
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Nowe hasło
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Pozostaw puste, aby nie zmieniać"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition"
              />
              <p className="text-sm text-gray-500 mt-1">
                Wpisz nowe hasło tylko jeśli chcesz je zmienić
              </p>
            </div>

            {/* ADMIN ONLY SECTION */}
            {isAdmin && (
              <>
                <div className="border-t-2 border-gray-200 pt-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">
                    Uprawnienia administratora
                  </h3>

                  {/* Groups */}
                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Grupy użytkownika
                    </label>
                    <div className="space-y-2">
                      {availableGroups.map(group => (
                        <label
                          key={group}
                          className="flex items-center gap-3 p-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer transition"
                        >
                          <input
                            type="checkbox"
                            checked={formData.groups.includes(group)}
                            onChange={() => handleGroupToggle(group)}
                            className="w-5 h-5 text-blue-600"
                          />
                          <span className="font-medium text-gray-700 capitalize">
                            {group}
                          </span>
                        </label>
                      ))}
                      {availableGroups.length === 0 && (
                        <p className="text-gray-500 italic">Brak dostępnych grup</p>
                      )}
                    </div>
                  </div>

                </div>
              </>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4 pt-6">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-black px-6 py-3 rounded-lg font-semibold transition shadow-md hover:shadow-lg"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Zapisywanie...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Zapisz zmiany
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => navigate(`/users/${id}`)}
                className="flex items-center justify-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold transition"
              >
                <X className="w-5 h-5" />
                Anuluj
              </button>
            </div>

          </form>

        </CardContent>
      </Card>

      {/* Info box */}
      {!isAdmin && (
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-blue-800 text-sm">
            <strong>Uwaga:</strong> Możesz edytować tylko podstawowe dane swojego konta. 
            Uprawnienia i grupy może zmieniać tylko administrator.
          </p>
        </div>
      )}

    </div>
  );
};

export default UserEdit;
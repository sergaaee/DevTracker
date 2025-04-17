// Profile.tsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getUserProfile } from "../services/user";

interface UserProfile {
  id: number;
  username: string;
  email: string;
}

export default function Profile() {
  const { user: currentUser, isLoading: authLoading } = useAuth();
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {

    const fetchProfile = async () => {
      if (authLoading) {
        console.log("Auth still loading, waiting...");
        return;
      }

      if (!username) {
        console.log("No username in URL, redirecting to /login");
        navigate("/login", { replace: true });
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const data = await getUserProfile(username);
        setProfile(data);
      } catch (err: any) {
        console.error("Error fetching profile:", err);
        setError("Ошибка загрузки профиля");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [username, authLoading, navigate]);

  if (authLoading || loading) {
    return <p className="text-center text-gray-400">Загрузка...</p>;
  }

  if (error || !profile) {
    return <p className="text-center text-red-500">{error || "Профиль не найден"}</p>;
  }

  const isCurrentUser = currentUser?.username === profile.username;

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      <div className="bg-gray-800 p-10 rounded-xl shadow-xl w-full max-w-lg">
        <div className="flex items-center gap-4 mb-6">
          <img
            src={`https://avatars.githubusercontent.com/${profile.username}`}
            alt="User Avatar"
            className="w-16 h-16 rounded-full border-2 border-blue-500"
          />
          <div>
            <h2 className="text-2xl font-semibold">{profile.username}</h2>
            <p
              className={`text-sm ${
                isCurrentUser ? "text-green-400" : "text-gray-400"
              }`}
            >
              ID: {profile.id}
            </p>
            <p className="text-sm text-gray-400">Email: {profile.email}</p>
          </div>
        </div>
        <div className="bg-gray-700 rounded-lg p-4">
          <p className="text-gray-300">
            Здесь будет информация о ваших последних коммитах, активностях и друзей.
          </p>
        </div>
      </div>
    </div>
  );
}
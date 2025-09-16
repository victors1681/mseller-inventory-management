import { User } from "firebase/auth";
import React, { createContext, useContext, useEffect, useState } from "react";
import { updateAxiosConfig } from "../services/api";
import { initializeUserSession } from "../services/userService";
import { UserTypes } from "../types/user";
import { useAuth } from "./AuthContext";

interface UserContextType {
  user: User | null;
  userProfile: UserTypes | null;
  loading: boolean;
  error: string | null;
  refreshUserProfile: () => Promise<void>;
}

const UserContext = createContext<UserContextType>({
  user: null,
  userProfile: null,
  loading: true,
  error: null,
  refreshUserProfile: async () => {},
});

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

interface UserProviderProps {
  children: React.ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const { user, loading: authLoading } = useAuth();
  const [userProfile, setUserProfile] = useState<UserTypes | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) {
        setUserProfile(null);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const profile = await initializeUserSession();
        setUserProfile(profile || null);

        // Update axios configuration with user's business config
        if (profile?.business?.config) {
          updateAxiosConfig(profile.business.config, profile.testMode);
        }
      } catch (err) {
        console.error("Error fetching user profile:", err);
        setError(
          err instanceof Error ? err.message : "Failed to fetch user profile"
        );
        setUserProfile(null);
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) {
      fetchUserProfile();
    }
  }, [user, authLoading]);

  const refreshUserProfile = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      const profile = await initializeUserSession();
      setUserProfile(profile || null);

      // Update axios configuration with user's business config
      if (profile?.business?.config) {
        updateAxiosConfig(profile.business.config, profile.testMode);
      }
    } catch (err) {
      console.error("Error refreshing user profile:", err);
      setError(
        err instanceof Error ? err.message : "Failed to refresh user profile"
      );
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    userProfile,
    loading: authLoading || loading,
    error,
    refreshUserProfile,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

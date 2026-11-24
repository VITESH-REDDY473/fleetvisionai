"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  roleTitle: string;
  avatar: string;
  clearanceLevel: string;
}

export const DEMO_ACCOUNTS: Record<string, UserProfile & { passwordHint: string }> = {
  operations: {
    id: "USR-001",
    name: "Alex Mercer",
    email: "alex.mercer@fleetvision.ai",
    role: "FLEET_DIRECTOR",
    roleTitle: "Fleet Operations Director",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
    clearanceLevel: "Level 4 - Enterprise Fleet & Safety Admin",
    passwordHint: "fleetops2026"
  },
  safety: {
    id: "USR-002",
    name: "Dr. Samantha Reed",
    email: "sreed@fleetvision.ai",
    role: "SAFETY_OFFICER",
    roleTitle: "Chief Safety & Vision AI Officer",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150",
    clearanceLevel: "Level 3 - Vision AI & Compliance Lead",
    passwordHint: "safetyfirst2026"
  },
  dispatch: {
    id: "USR-003",
    name: "Liam O'Connor",
    email: "loconnor@fleetvision.ai",
    role: "DISPATCH_LEAD",
    roleTitle: "Senior Logistics Dispatcher",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
    clearanceLevel: "Level 2 - Route & Asset Control",
    passwordHint: "dispatch2026"
  }
};

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password?: string) => Promise<boolean>;
  loginAsDemo: (accountKey: keyof typeof DEMO_ACCOUNTS) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => false,
  loginAsDemo: () => {},
  logout: () => {}
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Load existing session from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("fleetvision_session");
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch (err) {
      console.warn("Failed to parse stored auth session:", err);
    }
  }, []);

  const login = async (email: string, password?: string): Promise<boolean> => {
    // Check if matches any demo user email
    const foundKey = Object.keys(DEMO_ACCOUNTS).find(
      (k) => DEMO_ACCOUNTS[k].email.toLowerCase() === email.toLowerCase()
    );

    let authedUser: UserProfile;
    if (foundKey) {
      authedUser = DEMO_ACCOUNTS[foundKey];
    } else {
      // Default fallback profile for custom email login
      const namePart = email.split("@")[0].replace(".", " ");
      const formattedName = namePart.charAt(0).toUpperCase() + namePart.slice(1);
      authedUser = {
        id: `USR-${Date.now().toString().slice(-4)}`,
        name: formattedName || "Fleet Supervisor",
        email: email,
        role: "FLEET_OPERATOR",
        roleTitle: "Fleet Operations Specialist",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
        clearanceLevel: "Level 3 - Fleet Operations"
      };
    }

    setUser(authedUser);
    localStorage.setItem("fleetvision_session", JSON.stringify(authedUser));
    return true;
  };

  const loginAsDemo = (accountKey: keyof typeof DEMO_ACCOUNTS) => {
    const authedUser = DEMO_ACCOUNTS[accountKey];
    if (authedUser) {
      setUser(authedUser);
      localStorage.setItem("fleetvision_session", JSON.stringify(authedUser));
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("fleetvision_session");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        loginAsDemo,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

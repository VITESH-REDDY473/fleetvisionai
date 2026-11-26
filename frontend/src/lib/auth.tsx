"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type UserRole = "ADMIN" | "DRIVER" | "MANAGER";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  roleTitle: string;
  avatar: string;
  clearanceLevel: string;
  assignedVehicleId?: string;
}

// Exactly matches the 3 user types in the system diagram: Admin, Driver, Manager
export const DEMO_ACCOUNTS: Record<string, UserProfile & { passwordHint: string }> = {
  admin: {
    id: "USR-ADM",
    name: "Alex Mercer",
    email: "admin@fleetvision.ai",
    role: "ADMIN",
    roleTitle: "System Administrator",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
    clearanceLevel: "Full Access • Modules 1, 2 & 3",
    passwordHint: "admin2026"
  },
  manager: {
    id: "USR-MGR",
    name: "Dr. Samantha Reed",
    email: "manager@fleetvision.ai",
    role: "MANAGER",
    roleTitle: "Fleet Operations Manager",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150",
    clearanceLevel: "Operations • Trips, Tracking & Reports",
    passwordHint: "manager2026"
  },
  driver: {
    id: "USR-DRV",
    name: "Marcus Vance",
    email: "driver@fleetvision.ai",
    role: "DRIVER",
    roleTitle: "Commercial Fleet Driver",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
    clearanceLevel: "Driver Portal • Assigned: VEH-101",
    assignedVehicleId: "VEH-101",
    passwordHint: "driver2026"
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
  isLoading: false,
  login: async () => false,
  loginAsDemo: () => {},
  logout: () => {}
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);

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
    const foundKey = Object.keys(DEMO_ACCOUNTS).find(
      (k) => DEMO_ACCOUNTS[k].email.toLowerCase() === email.toLowerCase()
    );

    let authedUser: UserProfile;
    if (foundKey) {
      authedUser = DEMO_ACCOUNTS[foundKey];
    } else {
      const namePart = email.split("@")[0].replace(".", " ");
      const formattedName = namePart.charAt(0).toUpperCase() + namePart.slice(1);
      authedUser = {
        id: `USR-${Date.now().toString().slice(-4)}`,
        name: formattedName || "Fleet Specialist",
        email: email,
        role: "ADMIN",
        roleTitle: "Fleet Specialist",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
        clearanceLevel: "Standard Access"
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

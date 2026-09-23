"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { login as loginRequest } from "@/lib/api/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false); // true once we've checked localStorage
  const router = useRouter();

  useEffect(() => {
    const token = window.localStorage.getItem("spa_token");
    const rawUser = window.localStorage.getItem("spa_user");
    if (token && rawUser) {
      try {
        setUser(JSON.parse(rawUser));
      } catch {
        window.localStorage.removeItem("spa_token");
        window.localStorage.removeItem("spa_user");
      }
    }
    setReady(true);
  }, []);

  async function login(username, password) {
    const data = await loginRequest(username, password);
    const { token, ...profile } = data;
    window.localStorage.setItem("spa_token", token);
    window.localStorage.setItem("spa_user", JSON.stringify(profile));
    setUser(profile);
    return profile;
  }

  function logout() {
    window.localStorage.removeItem("spa_token");
    window.localStorage.removeItem("spa_user");
    setUser(null);
    router.push("/login");
  }

  return (
    <AuthContext.Provider value={{ user, ready, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}

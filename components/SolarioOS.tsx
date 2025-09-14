"use client";

import { useState, useEffect } from "react";
import BootSequence from "./boot/BootSequence";
import LoginScreen from "./auth/LoginScreen";
import Desktop from "./desktop/Desktop";

interface User {
  id: string;
  username: string;
  fullName: string;
  avatar?: string;
}

type SystemState = "booting" | "login" | "desktop";

export default function SolarioOS() {
  const [systemState, setSystemState] = useState<SystemState>("booting");
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isFirstBoot, setIsFirstBoot] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const savedUser = localStorage.getItem("solario_current_user");
    const hasBooted = localStorage.getItem("solario_has_booted");

    if (hasBooted) {
      setIsFirstBoot(false);
    }

    if (savedUser && !isFirstBoot) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setCurrentUser(parsedUser);
        setSystemState("desktop");
      } catch (error) {
        // Clear invalid data if JSON parsing fails
        localStorage.removeItem("solario_current_user");
        console.warn("Invalid user data in localStorage, cleared");
      }
    }
  }, [isFirstBoot]);

  const handleBootComplete = () => {
    localStorage.setItem("solario_has_booted", "true");
    setIsFirstBoot(false);
    setSystemState("login");
  };

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem("solario_current_user", JSON.stringify(user));
    setSystemState("desktop");
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem("solario_current_user");
    setSystemState("login");
  };

  return (
    <div className="w-full h-screen overflow-hidden bg-gradient-to-br from-blue-950 via-purple-950 to-indigo-950">
      {/* Solario OS Header */}
      <div className="absolute top-4 left-4 z-50 flex items-center space-x-2 text-white/80">
      </div>

      {systemState === "booting" && (
        <BootSequence onBootComplete={handleBootComplete} />
      )}

      {systemState === "login" && (
        <LoginScreen onLogin={handleLogin} />
      )}

      {systemState === "desktop" && currentUser && (
        <Desktop user={currentUser} onLogout={handleLogout} />
      )}
    </div>
  );
}

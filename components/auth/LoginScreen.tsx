"use client";

import { useState, useEffect } from "react";
import { Eye, EyeOff, User, Plus } from "lucide-react";

interface User {
  id: string;
  username: string;
  fullName: string;
  avatar?: string;
}

interface LoginScreenProps {
  onLogin: (user: User) => void;
}

export default function LoginScreen({ onLogin }: LoginScreenProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isCreatingUser, setIsCreatingUser] = useState(false);
  const [newUser, setNewUser] = useState({ username: "", fullName: "", password: "" });
  const [error, setError] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    // Load users from localStorage
    const savedUsers = localStorage.getItem("solario_users");
    if (savedUsers) {
      try {
        const parsedUsers = JSON.parse(savedUsers);
        if (Array.isArray(parsedUsers)) {
          setUsers(parsedUsers);
          if (parsedUsers.length > 0) {
            setSelectedUser(parsedUsers[0]);
          } else {
            // No users exist, show create user form
            setIsCreatingUser(true);
          }
        } else {
          // Invalid data format, reset to empty
          setUsers([]);
          setIsCreatingUser(true);
          localStorage.removeItem("solario_users");
        }
      } catch (error) {
        // JSON parsing failed, reset to empty
        setUsers([]);
        setIsCreatingUser(true);
        localStorage.removeItem("solario_users");
      }
    } else {
      // No users exist, show create user form
      setUsers([]);
      setIsCreatingUser(true);
    }

    // Update time every second
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleLogin = () => {
    if (!selectedUser) return;

    // Check stored password
    const storedPassword = localStorage.getItem(`solario_password_${selectedUser.id}`);
    
    if (password === storedPassword) {
      onLogin(selectedUser);
    } else {
      setError("Incorrect password");
      setPassword("");
      setTimeout(() => setError(""), 3000);
    }
  };

  const handleCreateUser = () => {
    if (!newUser.username || !newUser.fullName || !newUser.password) {
      setError("Please fill in all fields");
      return;
    }

    const user: User = {
      id: Date.now().toString(),
      username: newUser.username,
      fullName: newUser.fullName
    };

    const updatedUsers = [...users, user];
    setUsers(updatedUsers);
    localStorage.setItem("solario_users", JSON.stringify(updatedUsers));
    localStorage.setItem(`solario_password_${user.id}`, newUser.password);

    setSelectedUser(user);
    setIsCreatingUser(false);
    setNewUser({ username: "", fullName: "", password: "" });
    setError("");
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString([], { 
      weekday: 'long',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="w-full h-screen relative overflow-hidden">
      {/* Dynamic Solario wallpaper */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }} />
      </div>

      {/* Time and date */}
      <div className="absolute top-8 left-1/2 transform -translate-x-1/2 text-center text-white">
        <div className="text-6xl font-light mb-2 tracking-wide">
          {formatTime(currentTime)}
        </div>
        <div className="text-lg opacity-80">
          {formatDate(currentTime)}
        </div>
      </div>

      {/* Login container */}
      <div className="absolute bottom-32 left-1/2 transform -translate-x-1/2 w-96">
        {!isCreatingUser && users.length > 0 ? (
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-white/20">
            {/* User selection */}
            <div className="flex justify-center mb-6">
              <div className="flex space-x-4 overflow-x-auto pb-2">
                {users.map((user) => (
                  <button
                    key={user.id}
                    onClick={() => {
                      setSelectedUser(user);
                      setPassword("");
                      setError("");
                    }}
                    className={`flex flex-col items-center p-3 rounded-xl transition-all ${
                      selectedUser?.id === user.id
                        ? 'bg-white/20 scale-105'
                        : 'hover:bg-white/10'
                    }`}
                  >
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-2 shadow-lg border-2 border-white/20">
                      <User className="w-8 h-8 text-white" />
                    </div>
                    <span className="text-white text-sm font-medium">
                      {user.fullName}
                    </span>
                  </button>
                ))}
                
                {/* Add user button */}
                <button
                  onClick={() => setIsCreatingUser(true)}
                  className="flex flex-col items-center p-3 rounded-xl hover:bg-white/10 transition-all"
                >
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-2 border-2 border-dashed border-white/40">
                    <Plus className="w-8 h-8 text-white/60" />
                  </div>
                  <span className="text-white/60 text-sm">Add User</span>
                </button>
              </div>
            </div>

            {selectedUser && (
              <>
                <div className="text-center mb-6">
                      <h2 className="text-white text-xl font-medium">
                    {selectedUser.fullName}
                  </h2>
                  <p className="text-white/60 text-sm">@{selectedUser.username}</p>
                </div>

                {/* Password input */}
                <div className="relative mb-4">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleLogin()}
                    placeholder="Enter password"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent backdrop-blur-sm"
                    autoFocus
                  />
                  <button
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>

                {error && (
                  <div className="text-red-400 text-sm text-center mb-4 bg-red-500/10 py-2 px-4 rounded-lg border border-red-500/20">
                    {error}
                  </div>
                )}

                <button
                  onClick={handleLogin}
                  disabled={!password}
                  className="w-full py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-500/50 disabled:cursor-not-allowed text-white rounded-xl font-medium transition-all shadow-lg"
                >
                  Sign In
                </button>

              </>
            )}
          </div>
        ) : (
          /* Create user form */
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-white/20">
            <div className="text-center mb-6">
              <h2 className="text-white text-xl font-medium">
                Welcome
              </h2>
              <p className="text-white/70 text-sm mt-1">Create your first account</p>
            </div>

            <div className="space-y-4">
              <input
                type="text"
                value={newUser.fullName}
                onChange={(e) => setNewUser({ ...newUser, fullName: e.target.value })}
                placeholder="Full Name"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent backdrop-blur-sm"
              />
              
              <input
                type="text"
                value={newUser.username}
                onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                placeholder="Username"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent backdrop-blur-sm"
              />
              
              <input
                type="password"
                value={newUser.password}
                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                placeholder="Password"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent backdrop-blur-sm"
              />
            </div>

            {error && (
              <div className="text-red-400 text-sm text-center mt-4 bg-red-500/10 py-2 px-4 rounded-lg border border-red-500/20">
                {error}
              </div>
            )}

            <div className="flex space-x-4 mt-6">
              {users.length > 0 && (
                <button
                  onClick={() => {
                    setIsCreatingUser(false);
                    setNewUser({ username: "", fullName: "", password: "" });
                    setError("");
                  }}
                  className="flex-1 py-3 bg-gray-500/50 hover:bg-gray-500/70 text-white rounded-xl font-medium transition-all"
                >
                  Cancel
                </button>
              )}
              <button
                onClick={handleCreateUser}
                className="flex-1 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-medium transition-all shadow-lg"
              >
                Create User
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Bottom info */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/60 text-sm text-center">
        <div className="flex items-center justify-center space-x-2">
          <span>Your Digital Universe</span>
        </div>
      </div>
    </div>
  );
}

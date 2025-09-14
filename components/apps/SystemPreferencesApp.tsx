"use client";

import { useState, useEffect } from "react";
import { Monitor, Palette, Shield, Wifi, Volume2, Battery, User, Globe, Accessibility, Clock, HardDrive, Smartphone, Camera, Gamepad2, Zap, Brain, Eye, Lock } from "lucide-react";

interface SystemPreferencesAppProps {
  windowId: string;
  isDarkMode?: boolean;
}

interface PreferenceCategory {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
}

export default function SystemPreferencesApp({ windowId, isDarkMode = false }: SystemPreferencesAppProps) {
  const [selectedCategory, setSelectedCategory] = useState("general");

  // Detect system dark mode
  const [systemDarkMode, setSystemDarkMode] = useState(false);

  useEffect(() => {
    const detectDarkMode = () => {
      const savedDarkMode = localStorage.getItem('solario_dark_mode') === 'true';
      const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setSystemDarkMode(savedDarkMode || systemDark);
    };

    detectDarkMode();

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', detectDarkMode);

    return () => mediaQuery.removeEventListener('change', detectDarkMode);
  }, []);

  const currentDarkMode = isDarkMode || systemDarkMode;

  const [settings, setSettings] = useState({
    // General
    computerName: "MacBook-Pro-of-Infinite-Procrastination",
    darkMode: false,
    accentColor: "blue",

    // Display
    resolution: "2560x1600",
    brightness: 75,
    nightShift: false,

    // Sound
    outputVolume: 50,
    inputVolume: 75,
    soundEffects: true,

    // Network
    wifi: true,
    bluetooth: true,

    // Security
    firewall: true,
    fileVault: false,
    automaticLogin: false,

    // Energy Saver
    displaySleep: 10,
    computerSleep: 30,
    preventSleep: false,

    // Users
    allowGuests: false,
    fastUserSwitching: true,

    // Accessibility
    voiceOver: false,
    zoom: false,
    increaseContrast: false,
    reduceMotion: false,

    // Privacy & Security
    locationServices: true,
    analytics: false,
    crashReports: true,

    // Gaming
    gameMode: false,
    hdrGaming: true,
    gameBar: true,

    // AI & Machine Learning
    aiAssistant: true,
    smartSuggestions: true,
    voiceRecognition: true,

    // Advanced
    developerMode: false,
    experimentalFeatures: false,
    debugMode: false
  });

  // Load settings from localStorage on mount
  useEffect(() => {
    const loadSettings = () => {
      const newSettings = { ...settings };
      Object.keys(settings).forEach(key => {
        const saved = localStorage.getItem(`solario_${key}`);
        if (saved) {
          try {
            (newSettings as any)[key] = JSON.parse(saved);
          } catch (e) {
            console.warn(`Failed to parse setting ${key}:`, e);
          }
        }
      });
      setSettings(newSettings);
    };
    loadSettings();
  }, []);

  const categories: PreferenceCategory[] = [
    {
      id: "general",
      name: "General",
      icon: <Monitor className="w-8 h-8" />,
      description: "General system settings"
    },
    {
      id: "desktop",
      name: "Desktop & Screen Saver",
      icon: <Palette className="w-8 h-8" />,
      description: "Desktop background and screen saver"
    },
    {
      id: "dock",
      name: "Dock & Menu Bar",
      icon: <HardDrive className="w-8 h-8" />,
      description: "Dock and menu bar settings"
    },
    {
      id: "displays",
      name: "Displays",
      icon: <Monitor className="w-8 h-8" />,
      description: "Display resolution and arrangement"
    },
    {
      id: "sound",
      name: "Sound",
      icon: <Volume2 className="w-8 h-8" />,
      description: "Sound input and output settings"
    },
    {
      id: "network",
      name: "Network",
      icon: <Wifi className="w-8 h-8" />,
      description: "Wi-Fi, Ethernet, and other connections"
    },
    {
      id: "bluetooth",
      name: "Bluetooth",
      icon: <Smartphone className="w-8 h-8" />,
      description: "Bluetooth device connections"
    },
    {
      id: "security",
      name: "Security & Privacy",
      icon: <Shield className="w-8 h-8" />,
      description: "Security and privacy settings"
    },
    {
      id: "users",
      name: "Users & Groups",
      icon: <User className="w-8 h-8" />,
      description: "User accounts and login options"
    },
    {
      id: "accessibility",
      name: "Accessibility",
      icon: <Accessibility className="w-8 h-8" />,
      description: "Accessibility features"
    },
    {
      id: "energy",
      name: "Energy Saver",
      icon: <Battery className="w-8 h-8" />,
      description: "Energy and battery settings"
    },
    {
      id: "datetime",
      name: "Date & Time",
      icon: <Clock className="w-8 h-8" />,
      description: "Date, time, and time zone"
    },
    {
      id: "privacy",
      name: "Privacy & Security",
      icon: <Eye className="w-8 h-8" />,
      description: "Privacy settings and data protection"
    },
    {
      id: "gaming",
      name: "Gaming",
      icon: <Gamepad2 className="w-8 h-8" />,
      description: "Gaming performance and features"
    },
    {
      id: "ai",
      name: "AI & Machine Learning",
      icon: <Brain className="w-8 h-8" />,
      description: "Artificial intelligence features"
    },
    {
      id: "advanced",
      name: "Advanced",
      icon: <Zap className="w-8 h-8" />,
      description: "Developer and experimental features"
    }
  ];

  const handleSettingChange = (key: string, value: boolean | string | number) => {
    setSettings(prev => ({ ...prev, [key]: value }));

    // Save to localStorage
    localStorage.setItem(`solario_${key}`, JSON.stringify(value));

    // Apply certain settings immediately
    if (key === "darkMode") {
      localStorage.setItem('solario_dark_mode', value.toString());
      if (value) {
        document.documentElement.classList.add('dark');
        document.body.style.backgroundColor = '#111827';
      } else {
        document.documentElement.classList.remove('dark');
        document.body.style.backgroundColor = '#ffffff';
      }
      // Dispatch event to notify other components
      window.dispatchEvent(new CustomEvent('darkModeChanged', { detail: value }));
    }

    if (key === "brightness") {
      document.body.style.filter = `brightness(${value}%)`;
    }

    if (key === "nightShift" && value) {
      document.body.style.filter = (document.body.style.filter || '') + ' sepia(20%) hue-rotate(-10deg)';
    } else if (key === "nightShift" && !value) {
      document.body.style.filter = document.body.style.filter.replace(/ sepia\(20%\) hue-rotate\(-10deg\)/g, '');
    }

    if (key === "increaseContrast" && value) {
      document.body.style.filter = (document.body.style.filter || '') + ' contrast(150%)';
    } else if (key === "increaseContrast" && !value) {
      document.body.style.filter = document.body.style.filter.replace(/ contrast\(150%\)/g, '');
    }

    if (key === "reduceMotion") {
      if (value) {
        document.documentElement.style.setProperty('--animation-duration', '0s');
        document.documentElement.style.setProperty('transition-duration', '0s');
      } else {
        document.documentElement.style.removeProperty('--animation-duration');
        document.documentElement.style.removeProperty('transition-duration');
      }
    }

    if (key === "gameMode" && value) {
      document.body.style.filter = (document.body.style.filter || '') + ' saturate(120%) contrast(110%)';
    } else if (key === "gameMode" && !value) {
      document.body.style.filter = document.body.style.filter.replace(/ saturate\(120%\) contrast\(110%\)/g, '');
    }
  };

  const renderCategoryContent = () => {
    switch (selectedCategory) {
      case "general":
        return (
          <div className="space-y-6">
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                currentDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>Computer Name</label>
              <input
                type="text"
                value={settings.computerName}
                onChange={(e) => handleSettingChange("computerName", e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  currentDarkMode
                    ? 'bg-gray-800 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              />
            </div>

            <div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={settings.darkMode}
                  onChange={(e) => handleSettingChange("darkMode", e.target.checked)}
                  className="rounded"
                />
                <span className={currentDarkMode ? 'text-white' : 'text-gray-900'}>
                  Use dark menu bar and Dock
                </span>
              </label>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${
                currentDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>Accent Color</label>
              <div className="flex space-x-2">
                {["blue", "purple", "pink", "red", "orange", "yellow", "green"].map(color => (
                  <button
                    key={color}
                    onClick={() => handleSettingChange("accentColor", color)}
                    className={`w-8 h-8 rounded-full bg-${color}-500 transition-all hover:scale-110 ${
                      settings.accentColor === color
                        ? 'ring-2 ring-offset-2 ring-blue-400'
                        : 'hover:ring-2 hover:ring-offset-2 hover:ring-gray-400'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        );

      case "displays":
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Resolution</label>
              <select
                value={settings.resolution}
                onChange={(e) => handleSettingChange("resolution", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="1920x1080">1920 × 1080</option>
                <option value="2560x1600">2560 × 1600 (Recommended)</option>
                <option value="3840x2160">3840 × 2160</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Brightness: {settings.brightness}%
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={settings.brightness}
                onChange={(e) => handleSettingChange("brightness", Number(e.target.value))}
                className="w-full"
              />
            </div>

            <div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={settings.nightShift}
                  onChange={(e) => handleSettingChange("nightShift", e.target.checked)}
                  className="rounded"
                />
                <span>Night Shift</span>
              </label>
              <p className="text-sm text-gray-600 mt-1">
                Automatically adjust display colors at night
              </p>
            </div>
          </div>
        );

      case "sound":
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Output Volume: {settings.outputVolume}%
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={settings.outputVolume}
                onChange={(e) => handleSettingChange("outputVolume", Number(e.target.value))}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Input Volume: {settings.inputVolume}%
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={settings.inputVolume}
                onChange={(e) => handleSettingChange("inputVolume", Number(e.target.value))}
                className="w-full"
              />
            </div>

            <div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={settings.soundEffects}
                  onChange={(e) => handleSettingChange("soundEffects", e.target.checked)}
                  className="rounded"
                />
                <span>Play user interface sound effects</span>
              </label>
            </div>
          </div>
        );

      case "network":
        return (
          <div className="space-y-6">
            <div className={`border rounded-lg p-4 ${
              settings.wifi
                ? 'bg-green-50 border-green-200'
                : 'bg-red-50 border-red-200'
            }`}>
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${
                  settings.wifi ? 'bg-green-500' : 'bg-red-500'
                }`}></div>
                <span className="font-medium">
                  Wi-Fi: {settings.wifi ? 'Connected' : 'Disconnected'}
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                {settings.wifi ? 'Solario-Network-of-Endless-Memes' : 'No Connection'}
              </p>
            </div>

            <div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={settings.wifi}
                  onChange={(e) => handleSettingChange("wifi", e.target.checked)}
                  className="rounded"
                />
                <span>Wi-Fi</span>
              </label>
            </div>

            <div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={settings.bluetooth}
                  onChange={(e) => handleSettingChange("bluetooth", e.target.checked)}
                  className="rounded"
                />
                <span>Bluetooth</span>
              </label>
              <p className="text-sm text-gray-600 mt-1">
                Status: {settings.bluetooth ? 'On (Searching for AirPods...)' : 'Off'}
              </p>
            </div>

            <div>
              <h3 className="font-medium text-gray-900 mb-3">Network Statistics</h3>
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <div className="flex justify-between">
                  <span>Download Speed:</span>
                  <span className="font-mono">420.69 Mbps</span>
                </div>
                <div className="flex justify-between">
                  <span>Upload Speed:</span>
                  <span className="font-mono">69.42 Mbps</span>
                </div>
                <div className="flex justify-between">
                  <span>Ping:</span>
                  <span className="font-mono">1337ms (Gaming Mode)</span>
                </div>
              </div>
            </div>
          </div>
        );

      case "security":
        return (
          <div className="space-y-6">
            <div>
              <h3 className="font-medium text-gray-900 mb-3">General</h3>
              <div className="space-y-3">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={settings.firewall}
                    onChange={(e) => handleSettingChange("firewall", e.target.checked)}
                    className="rounded"
                  />
                  <span>Enable Firewall</span>
                </label>

                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={settings.fileVault}
                    onChange={(e) => handleSettingChange("fileVault", e.target.checked)}
                    className="rounded"
                  />
                  <span>FileVault (Disk Encryption)</span>
                </label>
              </div>
            </div>

            <div>
              <h3 className="font-medium text-gray-900 mb-3">Privacy</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600">
                  Privacy settings help you control which apps can access your information.
                </p>
                <button className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600">
                  Privacy Settings...
                </button>
              </div>
            </div>
          </div>
        );

      case "energy":
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Turn display off after: {settings.displaySleep} minutes
              </label>
              <input
                type="range"
                min="1"
                max="60"
                value={settings.displaySleep}
                onChange={(e) => handleSettingChange("displaySleep", Number(e.target.value))}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Put computer to sleep after: {settings.computerSleep} minutes
              </label>
              <input
                type="range"
                min="1"
                max="180"
                value={settings.computerSleep}
                onChange={(e) => handleSettingChange("computerSleep", Number(e.target.value))}
                className="w-full"
              />
            </div>

            <div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={settings.preventSleep}
                  onChange={(e) => handleSettingChange("preventSleep", e.target.checked)}
                  className="rounded"
                />
                <span>Prevent computer from sleeping automatically when display is off</span>
              </label>
            </div>
          </div>
        );

      case "accessibility":
        return (
          <div className="space-y-6">
            <div>
              <h3 className="font-medium text-gray-900 mb-3">Vision</h3>
              <div className="space-y-3">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={settings.voiceOver}
                    onChange={(e) => handleSettingChange("voiceOver", e.target.checked)}
                    className="rounded"
                  />
                  <span>VoiceOver</span>
                </label>

                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={settings.zoom}
                    onChange={(e) => handleSettingChange("zoom", e.target.checked)}
                    className="rounded"
                  />
                  <span>Zoom</span>
                </label>

                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={settings.increaseContrast}
                    onChange={(e) => handleSettingChange("increaseContrast", e.target.checked)}
                    className="rounded"
                  />
                  <span>Increase Contrast</span>
                </label>
              </div>
            </div>

            <div>
              <h3 className="font-medium text-gray-900 mb-3">Motion</h3>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={settings.reduceMotion}
                  onChange={(e) => handleSettingChange("reduceMotion", e.target.checked)}
                  className="rounded"
                />
                <span>Reduce Motion</span>
              </label>
            </div>
          </div>
        );

      case "privacy":
        return (
          <div className="space-y-6">
            <div>
              <h3 className={`font-medium mb-3 ${
                currentDarkMode ? 'text-white' : 'text-gray-900'
              }`}>Location Services</h3>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={settings.locationServices}
                  onChange={(e) => handleSettingChange("locationServices", e.target.checked)}
                  className="rounded"
                />
                <span className={currentDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                  Enable Location Services
                </span>
              </label>
            </div>

            <div>
              <h3 className={`font-medium mb-3 ${
                currentDarkMode ? 'text-white' : 'text-gray-900'
              }`}>Analytics & Diagnostics</h3>
              <div className="space-y-3">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={settings.analytics}
                    onChange={(e) => handleSettingChange("analytics", e.target.checked)}
                    className="rounded"
                  />
                  <span className={currentDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                    Share Analytics Data
                  </span>
                </label>

                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={settings.crashReports}
                    onChange={(e) => handleSettingChange("crashReports", e.target.checked)}
                    className="rounded"
                  />
                  <span className={currentDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                    Send Crash Reports
                  </span>
                </label>
              </div>
            </div>
          </div>
        );

      case "gaming":
        return (
          <div className="space-y-6">
            <div>
              <h3 className={`font-medium mb-3 ${
                currentDarkMode ? 'text-white' : 'text-gray-900'
              }`}>Game Mode</h3>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={settings.gameMode}
                  onChange={(e) => handleSettingChange("gameMode", e.target.checked)}
                  className="rounded"
                />
                <span className={currentDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                  Enable Game Mode (Enhanced Colors & Performance)
                </span>
              </label>
            </div>

            <div>
              <h3 className={`font-medium mb-3 ${
                currentDarkMode ? 'text-white' : 'text-gray-900'
              }`}>Graphics Features</h3>
              <div className="space-y-3">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={settings.hdrGaming}
                    onChange={(e) => handleSettingChange("hdrGaming", e.target.checked)}
                    className="rounded"
                  />
                  <span className={currentDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                    HDR Gaming Support
                  </span>
                </label>

                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={settings.gameBar}
                    onChange={(e) => handleSettingChange("gameBar", e.target.checked)}
                    className="rounded"
                  />
                  <span className={currentDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                    Game Bar Overlay
                  </span>
                </label>
              </div>
            </div>
          </div>
        );

      case "ai":
        return (
          <div className="space-y-6">
            <div>
              <h3 className={`font-medium mb-3 ${
                currentDarkMode ? 'text-white' : 'text-gray-900'
              }`}>AI Assistant</h3>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={settings.aiAssistant}
                  onChange={(e) => handleSettingChange("aiAssistant", e.target.checked)}
                  className="rounded"
                />
                <span className={currentDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                  Enable ARIA AI Assistant
                </span>
              </label>
            </div>

            <div>
              <h3 className={`font-medium mb-3 ${
                currentDarkMode ? 'text-white' : 'text-gray-900'
              }`}>Smart Features</h3>
              <div className="space-y-3">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={settings.smartSuggestions}
                    onChange={(e) => handleSettingChange("smartSuggestions", e.target.checked)}
                    className="rounded"
                  />
                  <span className={currentDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                    Smart Suggestions
                  </span>
                </label>

                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={settings.voiceRecognition}
                    onChange={(e) => handleSettingChange("voiceRecognition", e.target.checked)}
                    className="rounded"
                  />
                  <span className={currentDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                    Voice Recognition
                  </span>
                </label>
              </div>
            </div>
          </div>
        );

      case "advanced":
        return (
          <div className="space-y-6">
            <div className={`p-4 rounded-lg border-2 border-dashed ${
              currentDarkMode ? 'border-yellow-600 bg-yellow-900/20' : 'border-yellow-500 bg-yellow-50'
            }`}>
              <div className="flex items-center space-x-2 mb-2">
                <Zap className={`w-5 h-5 ${
                  currentDarkMode ? 'text-yellow-400' : 'text-yellow-600'
                }`} />
                <span className={`font-medium ${
                  currentDarkMode ? 'text-yellow-400' : 'text-yellow-700'
                }`}>Warning</span>
              </div>
              <p className={`text-sm ${
                currentDarkMode ? 'text-yellow-300' : 'text-yellow-700'
              }`}>
                These settings are for advanced users only. Changing them may affect system stability.
              </p>
            </div>

            <div className="space-y-3">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={settings.developerMode}
                  onChange={(e) => handleSettingChange("developerMode", e.target.checked)}
                  className="rounded"
                />
                <span className={currentDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                  Developer Mode
                </span>
              </label>

              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={settings.experimentalFeatures}
                  onChange={(e) => handleSettingChange("experimentalFeatures", e.target.checked)}
                  className="rounded"
                />
                <span className={currentDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                  Experimental Features
                </span>
              </label>

              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={settings.debugMode}
                  onChange={(e) => handleSettingChange("debugMode", e.target.checked)}
                  className="rounded"
                />
                <span className={currentDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                  Debug Mode
                </span>
              </label>
            </div>
          </div>
        );

      default:
        return (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="text-6xl mb-4">⚙️</div>
              <h3 className={`text-lg font-medium mb-2 ${
                currentDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                {categories.find(cat => cat.id === selectedCategory)?.name}
              </h3>
              <p className={currentDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                Settings for this category are coming soon.
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className={`h-full flex ${
      currentDarkMode ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      {/* Sidebar */}
      <div className={`w-80 border-r overflow-y-auto ${
        currentDarkMode
          ? 'bg-gray-800 border-gray-700'
          : 'bg-white border-gray-200'
      }`}>
        <div className="p-6">
          <h2 className={`text-xl font-semibold mb-6 ${
            currentDarkMode ? 'text-white' : 'text-gray-800'
          }`}>System Preferences</h2>
          <div className="grid grid-cols-2 gap-4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`p-4 rounded-lg text-left transition-colors border-2 ${
                  selectedCategory === category.id
                    ? (currentDarkMode ? 'bg-blue-900 border-blue-400' : 'bg-blue-100 border-blue-500')
                    : (currentDarkMode
                      ? 'bg-gray-700 hover:bg-gray-600 border-transparent'
                      : 'bg-gray-50 hover:bg-gray-100 border-transparent')
                }`}
              >
                <div className="flex flex-col items-center space-y-2">
                  <div className={`${
                    selectedCategory === category.id
                      ? (currentDarkMode ? 'text-blue-400' : 'text-blue-600')
                      : (currentDarkMode ? 'text-blue-400' : 'text-blue-600')
                  }`}>{category.icon}</div>
                  <div>
                    <div className={`font-medium text-sm ${
                      currentDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>{category.name}</div>
                    <div className={`text-xs mt-1 ${
                      currentDarkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>{category.description}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-8">
          <div className="max-w-2xl">
            <h1 className={`text-2xl font-bold mb-2 ${
              currentDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              {categories.find(c => c.id === selectedCategory)?.name}
            </h1>
            <p className={`mb-8 ${
              currentDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {categories.find(c => c.id === selectedCategory)?.description}
            </p>

            {renderCategoryContent()}
          </div>
        </div>
      </div>
    </div>
  );
}

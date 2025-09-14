"use client";

import React, { useState, useEffect } from 'react';
import { 
  Battery, 
  BatteryLow, 
  Bluetooth,
  BluetoothConnected,
  Calendar, 
  Clock, 
  Folder,
  Grid3X3, 
  LogOut,
  Mic,
  Moon, 
  Search, 
  Settings, 
  Speaker,
  Sun, 
  Terminal,
  User, 
  Volume1, 
  Volume2, 
  VolumeX, 
  Wifi, 
  WifiOff 
} from 'lucide-react';

interface User {
  id: string;
  username: string;
  fullName: string;
  avatar?: string;
}

interface Window {
  id: string;
  title: string;
  appId: string;
}

interface MenuBarProps {
  user: User | null;
  onLogout: () => void;
  onOpenSpotlight: () => void;
  activeWindows: Window[];
  onOpenApp?: (appId: string) => void;
  onOpenSystemPreferences?: () => void;
  isDarkMode?: boolean;
  onToggleDarkMode?: () => void;
}

export default function MenuBar({ user, onLogout, onOpenSpotlight, activeWindows, onOpenApp, onOpenSystemPreferences, isDarkMode, onToggleDarkMode }: MenuBarProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [batteryLevel, setBatteryLevel] = useState(85);
  const [isCharging, setIsCharging] = useState(false);
  const [showWifiModal, setShowWifiModal] = useState(false);
  const [showBatteryModal, setShowBatteryModal] = useState(false);
  const [showVolumeModal, setShowVolumeModal] = useState(false);
  const [showControlCenter, setShowControlCenter] = useState(false);
  const [showNotificationCenter, setShowNotificationCenter] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showDateTimeModal, setShowDateTimeModal] = useState(false);
  const [showSpotlightModal, setShowSpotlightModal] = useState(false);
  const [networkStrength, setNetworkStrength] = useState(3);
  const [isWifiConnected, setIsWifiConnected] = useState(true);
  const [volume, setVolume] = useState(75);
  const [isMuted, setIsMuted] = useState(false);
  const [bluetoothEnabled, setBluetoothEnabled] = useState(true);
  const [airDropEnabled, setAirDropEnabled] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'System Update', message: 'Solario OS update available', time: '2 min ago', type: 'system' },
    { id: 2, title: 'Battery Low', message: 'Battery at 15%', time: '5 min ago', type: 'warning' }
  ]);

  useEffect(() => {
    // Update time every second
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Battery API if available
    if ('getBattery' in navigator) {
      (navigator as any).getBattery().then((battery: any) => {
        setBatteryLevel(Math.round(battery.level * 100));
        setIsCharging(battery.charging);
        
        battery.addEventListener('levelchange', () => {
          setBatteryLevel(Math.round(battery.level * 100));
        });
        
        battery.addEventListener('chargingchange', () => {
          setIsCharging(battery.charging);
        });
      });
    }

    return () => clearInterval(timer);
  }, [user?.id]);

  const formatTime = (date: Date) => {
    return date.toLocaleString([], { 
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const toggleDarkMode = () => {
    onToggleDarkMode?.();
  };

  const getBatteryIcon = () => {
    if (batteryLevel > 75) return "🔋";
    if (batteryLevel > 50) return "🔋";
    if (batteryLevel > 25) return "🪫";
    return "🪫";
  };

  const getWifiIcon = () => {
    if (!isWifiConnected) return <WifiOff className="w-4 h-4" />;
    return <Wifi className="w-4 h-4" />;
  };

  const closeAllModals = () => {
    setShowWifiModal(false);
    setShowBatteryModal(false);
    setShowVolumeModal(false);
    setShowNotificationCenter(false);
    setShowDateTimeModal(false);
    setShowUserMenu(false);
    setShowControlCenter(false);
  };

  return (
    <>
      <div className="fixed top-0 left-0 right-0 h-8 bg-black/40 backdrop-blur-xl border-b border-white/10 z-50 flex items-center justify-between px-4 text-white text-sm">
        {/* Left side - Solario branding */}
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => onOpenApp?.('finder')}
            className="flex items-center space-x-2 hover:bg-white/10 px-2 py-1 rounded-md transition-all duration-200"
            title="Open Finder"
          >
            <div className="w-5 h-5 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
              <Sun className="w-3 h-3 text-white" />
            </div>
            <span className="text-sm font-semibold bg-gradient-to-r from-blue-200 to-purple-200 bg-clip-text text-transparent">
              Solario
            </span>
          </button>
        </div>

        {/* Right side - System status */}
        <div className="flex items-center space-x-2">
          {/* WiFi */}
          <div className="relative">
            <button
              onClick={() => {
                closeAllModals();
                setShowWifiModal(!showWifiModal);
              }}
              title="Network"
            >
              {getWifiIcon()}
            </button>
            
            {showNotificationCenter && (
              <div className="absolute top-full right-0 mt-2 w-80 bg-black/90 backdrop-blur-xl rounded-2xl p-4 border border-white/20 shadow-2xl z-50">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-semibold">WiFi</h3>
                  <button 
                    onClick={() => setIsWifiConnected(!isWifiConnected)}
                    className={`w-12 h-6 rounded-full transition-colors ${
                      isWifiConnected ? 'bg-blue-500' : 'bg-gray-600'
                    }`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                      isWifiConnected ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>
                
                {isWifiConnected ? (
                  <div className="space-y-3">
                    <div className="bg-white/10 rounded-lg p-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-white font-medium">Solario Network</div>
                          <div className="text-gray-400 text-sm">Connected</div>
                        </div>
                        <Wifi className="w-5 h-5 text-blue-400" />
                      </div>
                    </div>
                    
                    <div className="text-gray-400 text-sm">
                      <div>IP: 192.168.1.100</div>
                      <div>Speed: 150 Mbps</div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <WifiOff className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-400">WiFi is turned off</p>
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* Battery */}
          <div className="relative">
            <button
              onClick={() => {
                closeAllModals();
                setShowBatteryModal(!showBatteryModal);
              }}
              className="flex items-center space-x-1 hover:bg-white/20 p-1.5 rounded-md transition-all duration-200"
              title="Battery"
            >
              {batteryLevel < 20 ? (
                <BatteryLow className="w-4 h-4" />
              ) : (
                <Battery className="w-4 h-4" />
              )}
              <span className="text-xs font-medium">{batteryLevel}%</span>
            </button>
            
            {showBatteryModal && (
              <div className="absolute top-full right-0 mt-2 w-72 bg-black/90 backdrop-blur-xl rounded-2xl p-4 border border-white/20 shadow-2xl z-50">
                <h3 className="text-white font-semibold mb-4">Battery</h3>
                
                <div className="space-y-4">
                  <div className="bg-white/10 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white">Battery Level</span>
                      <span className="text-white font-medium">{batteryLevel}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all ${
                          batteryLevel > 20 ? 'bg-green-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${batteryLevel}%` }}
                      />
                    </div>
                  </div>
                  
                  <div className="text-gray-400 text-sm space-y-1">
                    <div>Status: {isCharging ? 'Charging' : 'On Battery'}</div>
                    <div>Time remaining: {isCharging ? '2h 30m until full' : '4h 15m'}</div>
                    <div>Health: Excellent</div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Volume */}
          <div className="relative">
            <button
              onClick={() => {
                closeAllModals();
                setShowVolumeModal(!showVolumeModal);
              }}
              className="hover:bg-white/20 p-1.5 rounded-md transition-all duration-200"
              title="Volume"
            >
              {volume === 0 ? (
                <VolumeX className="w-4 h-4" />
              ) : volume < 50 ? (
                <Volume1 className="w-4 h-4" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
            </button>
            
            {showVolumeModal && (
              <div className="absolute top-full right-0 mt-2 w-64 bg-black/90 backdrop-blur-xl rounded-2xl p-4 border border-white/20 shadow-2xl z-50">
                <h3 className="text-white font-semibold mb-4">Volume</h3>
                
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Speaker className="w-4 h-4 text-gray-400" />
                      <span className="text-white text-sm">{volume}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={volume}
                      onChange={(e) => setVolume(parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Mic className="w-4 h-4 text-gray-400" />
                      <span className="text-white text-sm">Input</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      defaultValue="75"
                      className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Spotlight Search */}
          <div className="relative">
            <button
              onClick={() => {
                closeAllModals();
                setShowSpotlightModal(!showSpotlightModal);
              }}
              className="p-2 hover:bg-white/20 rounded-md transition-all duration-200"
              title="Spotlight Search (⌘Space)"
            >
              <Search className="w-4 h-4" />
            </button>
            
            {showSpotlightModal && (
              <div className="absolute top-full right-0 mt-2 w-96 bg-black/90 backdrop-blur-xl rounded-2xl p-4 border border-white/20 shadow-2xl z-50">
                <h3 className="text-white font-semibold mb-4 flex items-center">
                  <Search className="w-5 h-5 mr-2 text-blue-400" />
                  Spotlight Search
                </h3>
                
                <div className="space-y-4">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search apps, files, and more..."
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      autoFocus
                    />
                    <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-gray-400 text-xs uppercase tracking-wide">Quick Actions</div>
                    <div className="space-y-1">
                      <button 
                        onClick={() => {
                          closeAllModals();
                          onOpenApp?.('finder');
                        }}
                        className="w-full flex items-center space-x-3 p-2 hover:bg-white/10 rounded-lg transition-colors text-left"
                      >
                        <Folder className="w-4 h-4 text-blue-400" />
                        <span className="text-white">Open Finder</span>
                      </button>
                      <button 
                        onClick={() => {
                          closeAllModals();
                          onOpenApp?.('terminal');
                        }}
                        className="w-full flex items-center space-x-3 p-2 hover:bg-white/10 rounded-lg transition-colors text-left"
                      >
                        <Terminal className="w-4 h-4 text-green-400" />
                        <span className="text-white">Open Terminal</span>
                      </button>
                      <button 
                        onClick={() => {
                          closeAllModals();
                          onOpenSystemPreferences?.();
                        }}
                        className="w-full flex items-center space-x-3 p-2 hover:bg-white/10 rounded-lg transition-colors text-left"
                      >
                        <Settings className="w-4 h-4 text-gray-400" />
                        <span className="text-white">System Preferences</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Control Center */}
          <div className="relative">
            <button
              onClick={() => {
                closeAllModals();
                setShowControlCenter(!showControlCenter);
              }}
              className="hover:bg-white/20 p-1.5 rounded-md transition-all duration-200"
              title="Control Center"
            >
              <Settings className="w-4 h-4" />
            </button>

            {showControlCenter && (
              <div className="absolute top-full right-0 mt-2 w-80 bg-black/90 backdrop-blur-xl rounded-2xl p-4 border border-white/20 shadow-2xl z-50">
                <h3 className="text-white font-semibold mb-4">Control Center</h3>
                
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <button
                    onClick={() => setIsWifiConnected(!isWifiConnected)}
                    className={`rounded-xl p-3 transition-all text-left ${
                      isWifiConnected ? 'bg-blue-500/20 border border-blue-500/30' : 'bg-white/10'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <Wifi className="w-5 h-5" />
                      <span className="text-xs">Wi-Fi</span>
                    </div>
                    <div className="text-sm font-medium">{isWifiConnected ? 'Connected' : 'Off'}</div>
                  </button>
                  
                  <button
                    onClick={() => setBluetoothEnabled(!bluetoothEnabled)}
                    className={`rounded-xl p-3 transition-all text-left ${
                      bluetoothEnabled ? 'bg-blue-500/20 border border-blue-500/30' : 'bg-white/10'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      {bluetoothEnabled ? <BluetoothConnected className="w-5 h-5" /> : <Bluetooth className="w-5 h-5" />}
                      <span className="text-xs">Bluetooth</span>
                    </div>
                    <div className="text-sm font-medium">{bluetoothEnabled ? 'On' : 'Off'}</div>
                  </button>
                  
                  <button
                    onClick={toggleDarkMode}
                    className={`rounded-xl p-3 transition-all text-left ${
                      isDarkMode ? 'bg-blue-500/20 border border-blue-500/30' : 'bg-white/10'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                      <span className="text-xs">Dark Mode</span>
                    </div>
                    <div className="text-sm font-medium">{isDarkMode ? 'On' : 'Off'}</div>
                  </button>
                  
                  <button
                    onClick={() => {
                      closeAllModals();
                      setShowBatteryModal(true);
                    }}
                    className="bg-white/10 hover:bg-white/15 rounded-xl p-3 transition-all text-left"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <Battery className="w-5 h-5" />
                      <span className="text-xs">Battery</span>
                    </div>
                    <div className="text-sm font-medium">{batteryLevel}%</div>
                    <div className="w-full bg-white/20 rounded-full h-1 mt-2">
                      <div 
                        className={`h-1 rounded-full transition-all ${
                          batteryLevel > 20 ? 'bg-green-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${batteryLevel}%` }}
                      />
                    </div>
                  </button>
                </div>
                
                <div className="border-t border-white/20 pt-3">
                  <button 
                    onClick={() => {
                      closeAllModals();
                      onOpenSystemPreferences?.();
                    }}
                    className="w-full text-left hover:bg-white/10 rounded-lg p-2 flex items-center space-x-2 transition-colors"
                  >
                    <Settings className="w-4 h-4" />
                    <span>System Preferences</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="hover:bg-white/20 p-1.5 rounded-md transition-all duration-200"
            title="Toggle Dark Mode"
          >
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            {isDarkMode ? 'Light Mode' : 'Dark Mode'}
          </button>

          {/* Spotlight Search */}
          <button
            onClick={onOpenSpotlight}
            className="hover:bg-white/20 p-1.5 rounded-md transition-all duration-200"
            title="Spotlight Search (⌘Space)"
          >
            <Search className="w-4 h-4" />
          </button>


          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => {
                closeAllModals();
                setShowUserMenu(!showUserMenu);
              }}
              className="flex items-center space-x-2 hover:bg-white/20 px-2 py-1 rounded-md transition-all duration-200"
              title="User Menu"
            >
              <div className="w-5 h-5 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                <User className="w-3 h-3 text-white" />
              </div>
              <span className="text-sm font-medium">{user?.fullName || 'User'}</span>
            </button>

            {showUserMenu && (
              <div className="absolute top-full right-0 mt-2 w-64 bg-black/90 backdrop-blur-xl rounded-xl p-2 border border-white/20 shadow-2xl z-50">
                <div className="px-3 py-2 border-b border-white/20 mb-2">
                  <div className="font-medium text-white">{user?.fullName || 'Solario User'}</div>
                  <div className="text-xs text-white/60">@{user?.username || 'user'}@solario.os</div>
                </div>
                
                <button 
                  onClick={() => {
                    closeAllModals();
                    onOpenSystemPreferences?.();
                  }}
                  className="w-full text-left hover:bg-white/10 rounded-lg p-2 flex items-center space-x-2 text-white transition-colors"
                >
                  <User className="w-4 h-4" />
                  <span>System Preferences...</span>
                </button>
                
                <button 
                  onClick={() => {
                    closeAllModals();
                    onOpenApp?.('browser');
                  }}
                  className="w-full text-left hover:bg-white/10 rounded-lg p-2 flex items-center space-x-2 text-white transition-colors"
                >
                  <Settings className="w-4 h-4" />
                  <span>App Store...</span>
                </button>
                
                <div className="border-t border-white/20 my-2" />
                
                <button
                  onClick={() => {
                    closeAllModals();
                    onLogout();
                  }}
                  className="w-full text-left hover:bg-red-500/20 rounded-lg p-2 flex items-center space-x-2 text-red-400 transition-colors"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  <span>Log Out {user?.fullName || 'User'}...</span>
                </button>
              </div>
            )}
          </div>

          {/* Date & Time */}
          <div className="relative">
            <button
              onClick={() => {
                closeAllModals();
                setShowDateTimeModal(!showDateTimeModal);
              }}
              className="text-sm font-medium hover:bg-white/20 px-2 py-1 rounded-md transition-all duration-200"
              title="Date & Time"
            >
              {formatTime(currentTime)}
            </button>
            
            {showDateTimeModal && (
              <div className="absolute top-full right-0 mt-2 w-80 bg-black/90 backdrop-blur-xl rounded-2xl p-4 border border-white/20 shadow-2xl z-50">
                <h3 className="text-white font-semibold mb-4">Date & Time</h3>
                
                <div className="space-y-4">
                  <div className="bg-white/10 rounded-lg p-4 text-center">
                    <Clock className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-white mb-1">
                      {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    <div className="text-gray-300">
                      {currentTime.toLocaleDateString([], { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </div>
                  </div>
                  
                  <div className="bg-white/10 rounded-lg p-3">
                    <div className="flex items-center space-x-2 mb-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-white text-sm font-medium">Time Zone</span>
                    </div>
                    <div className="text-gray-300 text-sm">GMT+1 (London)</div>
                  </div>
                  
                  <button 
                    onClick={() => {
                      closeAllModals();
                      onOpenApp?.('calendar');
                    }}
                    className="w-full bg-blue-600 hover:bg-blue-500 text-white rounded-lg p-2 transition-colors"
                  >
                    Open Calendar
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Click outside to close menus */}
      {(showUserMenu || showControlCenter || showWifiModal || showBatteryModal || showVolumeModal || showNotificationCenter || showDateTimeModal || showSpotlightModal) && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={closeAllModals}
        />
      )}
    </>
  );
}

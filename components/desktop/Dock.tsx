"use client";

import { useState, useEffect } from "react";
import { Folder, Globe, Terminal, Calculator, Settings, Music, FileText, Camera, Mail, Calendar, Trash2, Plus, X, MoreHorizontal } from "lucide-react";
import FinderApp from "../apps/FinderApp";
// import SafariApp from "../apps/SafariApp"; // TODO: Create SafariApp component
import TerminalApp from "../apps/TerminalApp";
import CalculatorApp from "../apps/CalculatorApp";
import SystemPreferencesApp from "../apps/SystemPreferencesApp";
import MusicApp from "../apps/MusicApp";
import TextEditApp from "../apps/TextEditApp";

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
  isMinimized: boolean;
}

interface DockProps {
  windows: Window[];
  onOpenWindow: (appId: string, component: React.ComponentType<any>, title: string, options?: any) => void;
  onRestoreWindow: (windowId: string) => void;
  onMinimizeWindow: (windowId: string) => void;
  user: User;
  onChangeWallpaper: (wallpaper: string) => void;
}

interface DockApp {
  id: string;
  name: string;
  icon: React.ReactNode;
  component: React.ComponentType<any>;
  isPersistent: boolean;
}

export default function Dock({ windows, onOpenWindow, onRestoreWindow, onMinimizeWindow, user, onChangeWallpaper }: DockProps) {
  const [hoveredApp, setHoveredApp] = useState<string | null>(null);
  const [showTrash, setShowTrash] = useState(false);
  const [showTrashModal, setShowTrashModal] = useState(false);
  const [showContextMenu, setShowContextMenu] = useState<{appId: string, x: number, y: number} | null>(null);
  const [draggedApp, setDraggedApp] = useState<string | null>(null);

  const dockApps: DockApp[] = [
    {
      id: "finder",
      name: "Finder",
      icon: <Folder className="w-8 h-8 text-blue-500" />,
      component: FinderApp,
      isPersistent: true
    },
    {
      id: "safari",
      name: "Safari",
      icon: <Globe className="w-8 h-8 text-blue-600" />,
      component: TerminalApp, // Temporary placeholder until SafariApp is created
      isPersistent: true
    },
    {
      id: "terminal",
      name: "Terminal",
      icon: <Terminal className="w-8 h-8 text-black" />,
      component: TerminalApp,
      isPersistent: true
    },
    {
      id: "calculator",
      name: "Calculator",
      icon: <Calculator className="w-8 h-8 text-orange-500" />,
      component: CalculatorApp,
      isPersistent: true
    },
    {
      id: "textedit",
      name: "TextEdit",
      icon: <FileText className="w-8 h-8 text-blue-500" />,
      component: TextEditApp,
      isPersistent: true
    },
    {
      id: "music",
      name: "Music",
      icon: <Music className="w-8 h-8 text-red-500" />,
      component: MusicApp,
      isPersistent: true
    },
    {
      id: "system-preferences",
      name: "System Preferences",
      icon: <Settings className="w-8 h-8 text-gray-600" />,
      component: SystemPreferencesApp,
      isPersistent: true
    }
  ];

  const handleAppClick = (app: DockApp) => {
    // Check if app already has a window open
    const existingWindow = windows.find(w => w.appId === app.id && !w.isMinimized);
    const minimizedWindow = windows.find(w => w.appId === app.id && w.isMinimized);

    if (minimizedWindow) {
      // Restore minimized window
      onRestoreWindow(minimizedWindow.id);
    } else if (existingWindow) {
      // Focus existing window (handled by window manager)
      return;
    } else {
      // Open new window
      onOpenWindow(app.id, app.component, app.name, {
        size: getDefaultWindowSize(app.id)
      });
    }
  };

  const handleAppRightClick = (e: React.MouseEvent, app: DockApp) => {
    e.preventDefault();
    setShowContextMenu({
      appId: app.id,
      x: e.clientX,
      y: e.clientY
    });
  };

  const handleTrashClick = () => {
    setShowTrashModal(true);
  };

  const emptyTrash = () => {
    console.log('Emptying trash...');
    setShowTrashModal(false);
  };

  // Close context menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setShowContextMenu(null);
    };
    
    if (showContextMenu) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [showContextMenu]);

  const getDefaultWindowSize = (appId: string) => {
    switch (appId) {
      case "calculator":
        return { width: 300, height: 400 };
      case "terminal":
        return { width: 800, height: 500 };
      case "finder":
        return { width: 900, height: 600 };
      case "safari":
        return { width: 1000, height: 700 };
      case "system-preferences":
        return { width: 800, height: 600 };
      default:
        return { width: 800, height: 600 };
    }
  };

  const getAppWindows = (appId: string) => {
    return windows.filter(w => w.appId === appId);
  };

  const isAppRunning = (appId: string) => {
    return windows.some(w => w.appId === appId);
  };

  return (
    <div className="fixed bottom-2 left-1/2 transform -translate-x-1/2 z-40">
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-2 border border-white/20 shadow-2xl">
        <div className="flex items-end space-x-1">
          {dockApps.map((app) => {
            const appWindows = getAppWindows(app.id);
            const isRunning = isAppRunning(app.id);
            const isHovered = hoveredApp === app.id;

            return (
              <div key={app.id} className="relative group">
                <button
                  onClick={() => handleAppClick(app)}
                  onContextMenu={(e) => handleAppRightClick(e, app)}
                  onMouseEnter={() => setHoveredApp(app.id)}
                  onMouseLeave={() => setHoveredApp(null)}
                  className={`
                    relative p-3 rounded-xl transition-all duration-200 ease-out
                    ${isHovered ? 'transform -translate-y-2 scale-110' : ''}
                    hover:bg-white/10 select-none
                  `}
                  draggable
                  onDragStart={(e) => {
                    setDraggedApp(app.id);
                    e.dataTransfer.effectAllowed = 'move';
                  }}
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.dataTransfer.dropEffect = 'move';
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    if (draggedApp && draggedApp !== app.id) {
                      console.log(`Reordering ${draggedApp} to position of ${app.id}`);
                    }
                    setDraggedApp(null);
                  }}
                >
                  {/* App Icon */}
                  <div className="relative">
                    {app.icon}

                    {/* Running indicator */}
                    {isRunning && (
                      <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white rounded-full" />
                    )}
                  </div>

                  {/* Tooltip */}
                  {isHovered && (
                    <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-black/80 text-white text-xs rounded whitespace-nowrap">
                      {app.name}
                      {appWindows.length > 0 && (
                        <span className="ml-1 text-gray-300">({appWindows.length})</span>
                      )}
                    </div>
                  )}

                  {/* Window previews for minimized windows */}
                  {appWindows.filter(w => w.isMinimized).length > 0 && isHovered && (
                    <div className="absolute bottom-full mb-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
                      {appWindows.filter(w => w.isMinimized).map((window) => (
                        <button
                          key={window.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            onRestoreWindow(window.id);
                          }}
                          className="w-32 h-20 bg-gray-800 rounded-lg border border-gray-600 flex items-center justify-center text-white text-xs hover:bg-gray-700 transition-colors"
                        >
                          {window.title}
                        </button>
                      ))}
                    </div>
                  )}
                </button>
              </div>
            );
          })}

          {/* Divider */}
          <div className="w-px h-12 bg-white/20 mx-2" />

          {/* Trash */}
          <div className="relative group">
            <button
              onClick={handleTrashClick}
              onMouseEnter={() => setShowTrash(true)}
              onMouseLeave={() => setShowTrash(false)}
              className={`
                p-3 rounded-xl transition-all duration-200 ease-out
                ${showTrash ? 'transform -translate-y-2 scale-110' : ''}
                hover:bg-white/10
              `}
            >
              <Trash2 className="w-8 h-8 text-gray-600" />

              {/* Tooltip */}
              {showTrash && (
                <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-black/80 text-white text-xs rounded whitespace-nowrap">
                  Trash (Empty)
                </div>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Context Menu */}
      {showContextMenu && (
        <div 
          className="fixed bg-black/80 backdrop-blur-xl rounded-lg border border-white/20 shadow-2xl z-50 min-w-48"
          style={{ 
            left: showContextMenu.x, 
            top: showContextMenu.y - 120,
            transform: 'translateX(-50%)'
          }}
        >
          <div className="p-2">
            <button 
              onClick={() => {
                const app = dockApps.find(a => a.id === showContextMenu.appId);
                if (app) handleAppClick(app);
                setShowContextMenu(null);
              }}
              className="w-full text-left px-3 py-2 text-white hover:bg-white/10 rounded-md text-sm"
            >
              Open
            </button>
            <button 
              onClick={() => {
                console.log(`Show in Finder: ${showContextMenu.appId}`);
                setShowContextMenu(null);
              }}
              className="w-full text-left px-3 py-2 text-white hover:bg-white/10 rounded-md text-sm"
            >
              Show in Finder
            </button>
            <div className="border-t border-white/20 my-1" />
            <button 
              onClick={() => {
                console.log(`Options for: ${showContextMenu.appId}`);
                setShowContextMenu(null);
              }}
              className="w-full text-left px-3 py-2 text-white hover:bg-white/10 rounded-md text-sm"
            >
              Options...
            </button>
            <button 
              onClick={() => {
                console.log(`Remove from Dock: ${showContextMenu.appId}`);
                setShowContextMenu(null);
              }}
              className="w-full text-left px-3 py-2 text-white hover:bg-white/10 rounded-md text-sm"
            >
              Remove from Dock
            </button>
          </div>
        </div>
      )}

      {/* Trash Modal */}
      {showTrashModal && (
        <>
          <div className="fixed inset-0 bg-black/50 z-50" onClick={() => setShowTrashModal(false)} />
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl z-50 p-6 min-w-96">
            <div className="text-center">
              <Trash2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Trash</h3>
              <p className="text-gray-300 mb-6">The Trash is empty.</p>
              
              <div className="flex space-x-3 justify-center">
                <button
                  onClick={() => setShowTrashModal(false)}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={emptyTrash}
                  className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg transition-colors"
                  disabled
                >
                  Empty Trash
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

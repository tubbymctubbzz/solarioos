"use client";

import { useState, useEffect } from "react";
import MenuBar from "./MenuBar";
import Dock from "./Dock";
import WindowManager from "./WindowManager";
import Wallpaper from "./Wallpaper";
import Spotlight from "./Spotlight";

interface User {
  id: string;
  username: string;
  fullName: string;
  avatar?: string;
}

interface DesktopProps {
  user: User;
  onLogout: () => void;
}

export interface Window {
  id: string;
  title: string;
  appId: string;
  component: React.ComponentType<any>;
  isMinimized: boolean;
  isMaximized: boolean;
  position: { x: number; y: number };
  size: { width: number; height: number };
  zIndex: number;
  isClosable: boolean;
  isResizable: boolean;
}

export default function Desktop({ user, onLogout }: DesktopProps) {
  const [windows, setWindows] = useState<Window[]>([]);
  const [activeWindowId, setActiveWindowId] = useState<string | null>(null);
  const [showSpotlight, setShowSpotlight] = useState(false);
  const [wallpaper, setWallpaper] = useState("monterey");
  const [nextZIndex, setNextZIndex] = useState(1000);

  useEffect(() => {
    // Load saved wallpaper
    const savedWallpaper = localStorage.getItem(`solario_wallpaper_${user.id}`);
    if (savedWallpaper) {
      setWallpaper(savedWallpaper);
    }

    // Global keyboard shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey) {
        switch (e.key) {
          case ' ':
            e.preventDefault();
            setShowSpotlight(true);
            break;
          case 'w':
            if (activeWindowId) {
              e.preventDefault();
              closeWindow(activeWindowId);
            }
            break;
          case 'm':
            if (activeWindowId) {
              e.preventDefault();
              minimizeWindow(activeWindowId);
            }
            break;
        }
      }

      if (e.key === 'Escape') {
        setShowSpotlight(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [activeWindowId, user.id]);

  const openWindow = (appId: string, component: React.ComponentType<any>, title: string, options?: Partial<Window>) => {
    const windowId = `${appId}_${Date.now()}`;
    const newWindow: Window = {
      id: windowId,
      title,
      appId,
      component,
      isMinimized: false,
      isMaximized: false,
      position: {
        x: 100 + (windows.length * 30),
        y: 100 + (windows.length * 30)
      },
      size: { width: 800, height: 600 },
      zIndex: nextZIndex,
      isClosable: true,
      isResizable: true,
      ...options
    };

    setWindows(prev => [...prev, newWindow]);
    setActiveWindowId(windowId);
    setNextZIndex(prev => prev + 1);
  };

  const closeWindow = (windowId: string) => {
    setWindows(prev => prev.filter(w => w.id !== windowId));
    if (activeWindowId === windowId) {
      const remainingWindows = windows.filter(w => w.id !== windowId);
      setActiveWindowId(remainingWindows.length > 0 ? remainingWindows[remainingWindows.length - 1].id : null);
    }
  };

  const minimizeWindow = (windowId: string) => {
    setWindows(prev => prev.map(w =>
      w.id === windowId ? { ...w, isMinimized: true } : w
    ));
    if (activeWindowId === windowId) {
      setActiveWindowId(null);
    }
  };

  const maximizeWindow = (windowId: string) => {
    setWindows(prev => prev.map(w =>
      w.id === windowId ? { ...w, isMaximized: !w.isMaximized } : w
    ));
  };

  const restoreWindow = (windowId: string) => {
    setWindows(prev => prev.map(w =>
      w.id === windowId ? { ...w, isMinimized: false } : w
    ));
    focusWindow(windowId);
  };

  const focusWindow = (windowId: string) => {
    setActiveWindowId(windowId);
    setWindows(prev => prev.map(w =>
      w.id === windowId ? { ...w, zIndex: nextZIndex } : w
    ));
    setNextZIndex(prev => prev + 1);
  };

  const updateWindowPosition = (windowId: string, position: { x: number; y: number }) => {
    setWindows(prev => prev.map(w =>
      w.id === windowId ? { ...w, position } : w
    ));
  };

  const updateWindowSize = (windowId: string, size: { width: number; height: number }) => {
    setWindows(prev => prev.map(w =>
      w.id === windowId ? { ...w, size } : w
    ));
  };

  const changeWallpaper = (newWallpaper: string) => {
    setWallpaper(newWallpaper);
    localStorage.setItem(`solario_wallpaper_${user.id}`, newWallpaper);
  };

  return (
    <div className="w-full h-screen overflow-hidden relative bg-black">
      {/* Wallpaper */}
      <Wallpaper wallpaper={wallpaper} />

      {/* Menu Bar */}
      <MenuBar
        user={user}
        onLogout={onLogout}
        onOpenSpotlight={() => setShowSpotlight(true)}
        activeWindows={windows.filter(w => !w.isMinimized)}
      />

      {/* Desktop Area */}
      <div className="absolute inset-0 pt-6">
        {/* Window Manager */}
        <WindowManager
          windows={windows}
          activeWindowId={activeWindowId}
          onClose={closeWindow}
          onMinimize={minimizeWindow}
          onMaximize={maximizeWindow}
          onFocus={focusWindow}
          onUpdatePosition={updateWindowPosition}
          onUpdateSize={updateWindowSize}
        />
      </div>

      {/* Dock */}
      <Dock
        windows={windows}
        onOpenWindow={openWindow}
        onRestoreWindow={restoreWindow}
        onMinimizeWindow={minimizeWindow}
        user={user}
        onChangeWallpaper={changeWallpaper}
      />

      {/* Spotlight Search */}
      {showSpotlight && (
        <Spotlight
          onClose={() => setShowSpotlight(false)}
          onOpenWindow={openWindow}
        />
      )}
    </div>
  );
}

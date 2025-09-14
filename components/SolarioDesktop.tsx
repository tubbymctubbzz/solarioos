'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Battery,
  BatteryLow,
  Calculator,
  ChevronDown,
  FileText,
  Folder,
  FolderPlus,
  Globe,
  Grid3X3,
  Image,
  Info,
  LogOut,
  Monitor,
  Moon,
  Music,
  RefreshCw,
  Search,
  Settings,
  Sun,
  Terminal,
  Trash2,
  User,
  UserCircle,
  Volume1,
  Volume2,
  VolumeX,
  Wifi,
  WifiOff,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';

// Import applications
import EnhancedTerminalApp from './apps/EnhancedTerminalApp';
import EnhancedTextEditApp from './apps/EnhancedTextEditApp';
import CalculatorApp from './apps/CalculatorApp';
import MusicApp from './apps/MusicApp';
import MenuBar from './desktop/MenuBar';
import SystemPreferencesApp from './apps/SystemPreferencesApp';
import SolarioBrowserApp from './apps/SolarioBrowserApp';
import FinderApp from './apps/FinderApp';
import ImageViewerApp from './apps/ImageViewerApp';

// Import system components
import LoginScreen from './auth/LoginScreen';
import BootSequence from './boot/BootSequence';
import ContextMenu, { ContextMenuItem } from './ui/ContextMenu';
import InfoModal from './ui/InfoModal';
import TrashModal from './ui/TrashModal';

interface User {
  id: string;
  username: string;
  fullName: string;
  avatar?: string;
}

interface App {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  component?: React.ComponentType<any>;
}

type SystemState = 'booting' | 'login' | 'desktop';

interface Window {
  id: string;
  appId: string;
  title: string;
  component: React.ComponentType<any>;
  x: number;
  y: number;
  width: number;
  height: number;
  isMinimized: boolean;
  isMaximized: boolean;
  isFullscreen: boolean;
  zIndex: number;
  isDragging: boolean;
  isResizing: boolean;
  dragOffset: { x: number; y: number };
}

interface TrashItem {
  id: number;
  name: string;
  type: 'file' | 'folder' | 'image' | 'music' | 'video';
  size: string;
  deletedDate: Date;
  originalPath: string;
}

export default function SolarioDesktop() {
  // System state management
  const [systemState, setSystemState] = useState<SystemState>('booting');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isFirstBoot, setIsFirstBoot] = useState(true);

  // Desktop state
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const [windows, setWindows] = useState<Window[]>([]);
  const [nextZIndex, setNextZIndex] = useState(100);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSpotlightOpen, setIsSpotlightOpen] = useState(false);
  const [volume, setVolume] = useState(50);
  const [draggedWindow, setDraggedWindow] = useState<string | null>(null);
  const [resizingWindow, setResizingWindow] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [draggedIcon, setDraggedIcon] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  // System state
  const [batteryLevel, setBatteryLevel] = useState(85);
  const [isCharging, setIsCharging] = useState(false);
  const [networkType, setNetworkType] = useState('4g');
  const [isWifiConnected, setIsWifiConnected] = useState(true);
  const [systemUptime, setSystemUptime] = useState(0);

  // UI state
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [showWifiMenu, setShowWifiMenu] = useState(false);
  const [showBatteryInfo, setShowBatteryInfo] = useState(false);
  const [showTrashModal, setShowTrashModal] = useState(false);
  const [trashItems, setTrashItems] = useState<TrashItem[]>([]);

  // Context menu state
  const [contextMenu, setContextMenu] = useState<{
    isOpen: boolean;
    position: { x: number; y: number };
    type: 'desktop' | 'dock' | null;
    targetId?: string;
  }>({
    isOpen: false,
    position: { x: 0, y: 0 },
    type: null,
  });

  // Info modal state
  const [infoModal, setInfoModal] = useState<{
    isOpen: boolean;
    title: string;
    content: string;
  }>({
    isOpen: false,
    title: '',
    content: '',
  });

  // System info with funny computer name
  const [computerName] = useState('MacBook-Pro-of-Infinite-Procrastination');
  const [systemInfo, setSystemInfo] = useState({
    osVersion: 'Solario 14.2.1 (Caffeinated Coder Edition)',
    processor: 'Apple M3 Pro (Overworked & Undercaffeinated)',
    memory: '18 GB (Mostly Chrome Tabs)',
    storage: '512 GB SSD (97% Memes, 3% Actual Work)',
    graphics: 'Apple M3 Pro GPU (Powered by Pure Determination)',
  });

  // Wallpaper options
  const [wallpapers] = useState([
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
    'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
  ]);
  const [currentWallpaper, setCurrentWallpaper] = useState(0);

  const [desktopIcons, setDesktopIcons] = useState([
    {
      id: 'finder-desktop',
      appId: 'finder',
      name: 'Finder',
      icon: Folder,
      x: 50,
      y: 100,
    },
    {
      id: 'browser-desktop',
      appId: 'browser',
      name: 'Solario Browser',
      icon: Globe,
      x: 50,
      y: 200,
    },
    {
      id: 'terminal-desktop',
      appId: 'terminal',
      name: 'Terminal',
      icon: Terminal,
      x: 50,
      y: 300,
    },
    {
      id: 'calculator-desktop',
      appId: 'calculator',
      name: 'Calculator',
      icon: Calculator,
      x: 50,
      y: 400,
    },
  ]);

  const apps: App[] = [
    {
      id: 'finder',
      name: 'Finder',
      icon: Folder,
      component: () => <FinderApp windowId="finder" onMoveToTrash={moveToTrash} isDarkMode={isDarkMode} onOpenTextEditor={openTextEditor} onOpenImageViewer={openImageViewer} />
    },
    {
      id: 'browser',
      name: 'Solario Browser',
      icon: Globe,
      component: SolarioBrowserApp,
    },
    {
      id: 'terminal',
      name: 'Terminal',
      icon: Terminal,
      component: EnhancedTerminalApp,
    },
    {
      id: 'calculator',
      name: 'Calculator',
      icon: Calculator,
      component: CalculatorApp,
    },
    {
      id: 'textedit',
      name: 'Solario++',
      icon: FileText,
      component: EnhancedTextEditApp,
    },
    { id: 'music', name: 'Music', icon: Music, component: MusicApp },
    {
      id: 'imageviewer',
      name: 'Image Viewer',
      icon: Image,
      component: () => <ImageViewerApp windowId="imageviewer" isDarkMode={isDarkMode} onMoveToTrash={moveToTrash} />
    },
    {
      id: 'settings',
      name: 'System Preferences',
      icon: Settings,
      component: SystemPreferencesApp,
    },
  ];

  useEffect(() => {
    setIsClient(true);
    setCurrentTime(new Date());

    // Load wallpaper on mount
    const savedWallpaper = localStorage.getItem('solario_wallpaper');
    if (savedWallpaper) {
      setCurrentWallpaper(parseInt(savedWallpaper));
    }

    // Check if user is already logged in
    const savedUser = localStorage.getItem('solario_current_user');
    const hasBooted = localStorage.getItem('solario_has_booted');

    if (hasBooted) {
      setIsFirstBoot(false);
    }

    if (savedUser && !hasBooted) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setCurrentUser(parsedUser);
        setSystemState('desktop');
      } catch (error) {
        localStorage.removeItem('solario_current_user');
        console.warn('Invalid user data in localStorage, cleared');
      }
    }

    // Check for dark mode preference
    const darkMode = localStorage.getItem('solario_dark_mode') === 'true';
    setIsDarkMode(darkMode);

    const timer = setInterval(() => {
      setCurrentTime(new Date());
      setSystemUptime((prev) => prev + 1);
    }, 1000);

    initializeSystemAPIs();

    return () => {
      clearInterval(timer);
    };
  }, []);

  // Initialize empty trash - items will be added when user deletes files
  useEffect(() => {
    // Load trash items from localStorage if they exist
    const savedTrashItems = localStorage.getItem('solario_trash_items');
    if (savedTrashItems) {
      try {
        const parsedItems = JSON.parse(savedTrashItems);
        setTrashItems(parsedItems.map((item: any) => ({
          ...item,
          deletedDate: new Date(item.deletedDate)
        })));
      } catch (error) {
        console.error('Error loading trash items:', error);
      }
    }
  }, []);

  // Save trash items to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('solario_trash_items', JSON.stringify(trashItems));
  }, [trashItems]);


  // Event listeners setup
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey && e.key === ' ') {
        e.preventDefault();
        setIsSpotlightOpen(true);
      }
      if (e.key === 'Escape') {
        setIsSpotlightOpen(false);
        setShowUserMenu(false);
        setShowVolumeSlider(false);
        setShowWifiMenu(false);
        setShowBatteryInfo(false);
      }
    };

    const handleClickOutside = () => {
      setShowUserMenu(false);
      setShowVolumeSlider(false);
      setShowWifiMenu(false);
      setShowBatteryInfo(false);
    };

    const handleGlobalMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });

      if (draggedWindow) {
        const window = windows.find((w) => w.id === draggedWindow);
        if (window) {
          const newX = Math.max(
            0,
            Math.min(
              e.clientX - window.dragOffset.x,
              globalThis.innerWidth - window.width
            )
          );
          const newY = Math.max(
            32,
            Math.min(
              e.clientY - window.dragOffset.y,
              globalThis.innerHeight - window.height
            )
          );

          setWindows(
            windows.map((w) =>
              w.id === draggedWindow ? { ...w, x: newX, y: newY } : w
            )
          );
        }
      }

      if (resizingWindow) {
        const window = windows.find((w) => w.id === resizingWindow);
        if (window) {
          const newWidth = Math.max(300, e.clientX - window.x);
          const newHeight = Math.max(200, e.clientY - window.y);

          setWindows(
            windows.map((w) =>
              w.id === resizingWindow
                ? { ...w, width: newWidth, height: newHeight }
                : w
            )
          );
        }
      }

      if (draggedIcon) {
        const icon = desktopIcons.find((i) => i.id === draggedIcon);
        if (icon) {
          const newX = Math.max(
            20,
            Math.min(e.clientX - 32, globalThis.innerWidth - 84)
          );
          const newY = Math.max(
            60,
            Math.min(e.clientY - 32, globalThis.innerHeight - 120)
          );

          setDesktopIcons(
            desktopIcons.map((i) =>
              i.id === draggedIcon ? { ...i, x: newX, y: newY } : i
            )
          );
        }
      }
    };

    const handleGlobalMouseUp = () => {
      if (draggedWindow) {
        setWindows(
          windows.map((w) =>
            w.id === draggedWindow ? { ...w, isDragging: false } : w
          )
        );
        setDraggedWindow(null);
      }
      if (resizingWindow) {
        setWindows(
          windows.map((w) =>
            w.id === resizingWindow ? { ...w, isResizing: false } : w
          )
        );
        setResizingWindow(null);
      }
      if (draggedIcon) {
        setDraggedIcon(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    document.addEventListener('click', handleClickOutside);
    document.addEventListener('mousemove', handleGlobalMouseMove);
    document.addEventListener('mouseup', handleGlobalMouseUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [draggedWindow, resizingWindow, draggedIcon, windows, desktopIcons]);

  const initializeSystemAPIs = async () => {
    // Battery API
    if ('getBattery' in navigator) {
      try {
        const battery = await (navigator as any).getBattery();
        setBatteryLevel(Math.round(battery.level * 100));
        setIsCharging(battery.charging);

        battery.addEventListener('levelchange', () => {
          setBatteryLevel(Math.round(battery.level * 100));
        });

        battery.addEventListener('chargingchange', () => {
          setIsCharging(battery.charging);
        });
      } catch (error) {
        console.log('Battery API not supported');
      }
    }

    // Network Information API
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      setNetworkType(connection.effectiveType || 'unknown');
      setIsWifiConnected(connection.type !== 'cellular');

      connection.addEventListener('change', () => {
        setNetworkType(connection.effectiveType || 'unknown');
        setIsWifiConnected(connection.type !== 'cellular');
      });
    }

    // Get initial uptime from performance API
    setSystemUptime(Math.floor(performance.now() / 1000));
  };

  // System state handlers
  const handleBootComplete = () => {
    localStorage.setItem('solario_has_booted', 'true');
    setIsFirstBoot(false);
    setSystemState('login');
  };

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('solario_current_user', JSON.stringify(user));
    setSystemState('desktop');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('solario_current_user');
    setSystemState('login');
    // Close all windows
    setWindows([]);
    // Close all menus
    setShowUserMenu(false);
    setShowVolumeSlider(false);
    setShowWifiMenu(false);
    setShowBatteryInfo(false);
    setIsSpotlightOpen(false);
  };

  // Check if any window is fullscreen
  const hasFullscreenWindow = windows.some(
    (w) => w.isFullscreen && !w.isMinimized
  );

  const openTextEditor = (fileName: string, content?: string) => {
    const textEditorApp = apps.find(app => app.id === 'solario-plus-plus');
    if (textEditorApp) {
      const windowId = `solario-plus-plus_${isClient ? Date.now() : Math.floor(Math.random() * 10000)}`;
      const AppComponent = () => (
        <EnhancedTextEditApp
          windowId={windowId}
          isDarkMode={isDarkMode}
          initialContent={content}
          initialFileName={fileName}
        />
      );

      const newWindow: Window = {
        id: windowId,
        appId: 'solario-plus-plus',
        title: `Solario++ - ${fileName}`,
        component: AppComponent,
        x: Math.random() * (globalThis.innerWidth - 800),
        y: Math.random() * (globalThis.innerHeight - 600) + 50,
        width: 800,
        height: 600,
        isMinimized: false,
        isMaximized: false,
        isFullscreen: false,
        zIndex: nextZIndex,
        isDragging: false,
        isResizing: false,
        dragOffset: { x: 0, y: 0 },
      };

      setWindows([...windows, newWindow]);
      setNextZIndex(nextZIndex + 1);
    }
  };

  // Open application window
  const openApp = (app: App, fullscreen = false) => {
    const existingWindow = windows.find(w => w.appId === app.id);
    if (existingWindow) {
      focusWindow(existingWindow.id);
      return;
    }

    const windowId = `${app.id}_${isClient ? Date.now() : Math.floor(Math.random() * 10000)}`;
    const AppComponent = app.component || (() => <div className="p-4 text-center">App not found</div>);

    const newWindow: Window = {
      id: windowId,
      appId: app.id,
      title: app.name,
      component: AppComponent,
      x: fullscreen ? 0 : Math.random() * (globalThis.innerWidth - 800),
      y: fullscreen ? 24 : Math.random() * (globalThis.innerHeight - 600) + 50,
      width: fullscreen ? globalThis.innerWidth : 800,
      height: fullscreen ? globalThis.innerHeight - 24 : 600,
      isMinimized: false,
      isMaximized: fullscreen,
      isFullscreen: fullscreen,
      zIndex: nextZIndex,
      isDragging: false,
      isResizing: false,
      dragOffset: { x: 0, y: 0 },
    };

    setWindows([...windows, newWindow]);
    setNextZIndex(nextZIndex + 1);
  };

  // Function to open image viewer with specific image
  const openImageViewer = (imageName: string, imagePath?: string) => {
    const imageViewerApp = apps.find(app => app.id === 'imageviewer');
    if (imageViewerApp) {
      openApp(imageViewerApp);
      // Note: In a real implementation, you'd pass the image data to the viewer
    }
  };

  const closeWindow = (windowId: string) => {
    setWindows(windows.filter((w) => w.id !== windowId));
  };

  const minimizeWindow = (windowId: string) => {
    setWindows(
      windows.map((w) => (w.id === windowId ? { ...w, isMinimized: true } : w))
    );
  };

  const toggleMaximize = (windowId: string) => {
    setWindows((prev) =>
      prev.map((window) => {
        if (window.id === windowId) {
          if (window.isMaximized) {
            return {
              ...window,
              isMaximized: false,
              isFullscreen: false,
              x: Math.random() * (globalThis.innerWidth - 800),
              y: Math.random() * (globalThis.innerHeight - 600) + 50,
              width: 800,
              height: 600,
            };
          } else {
            return {
              ...window,
              isMaximized: true,
              isFullscreen: true,
              x: 0,
              y: 24,
              width: globalThis.innerWidth,
              height: globalThis.innerHeight - 24,
            };
          }
        }
        return window;
      })
    );
  };

  const focusWindow = (windowId: string) => {
    setWindows(
      windows.map((w) =>
        w.id === windowId ? { ...w, zIndex: nextZIndex, isMinimized: false } : w
      )
    );
    setNextZIndex(nextZIndex + 1);
  };

  // Context menu handlers
  const handleDesktopContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenu({
      isOpen: true,
      position: { x: e.clientX, y: e.clientY },
      type: 'desktop',
    });
  };

  const handleDockAppContextMenu = (e: React.MouseEvent, appId: string) => {
    e.preventDefault();
    e.stopPropagation();

    // Position context menu above the dock
    const rect = e.currentTarget.getBoundingClientRect();
    const menuHeight = 300; // Estimated menu height

    setContextMenu({
      isOpen: true,
      position: {
        x: e.clientX,
        y: rect.top - menuHeight - 10, // Position above with some padding
      },
      type: 'dock',
      targetId: appId,
    });
  };

  const closeContextMenu = () => {
    setContextMenu({
      isOpen: false,
      position: { x: 0, y: 0 },
      type: null,
    });
  };

  // Desktop context menu items
  const getDesktopContextMenuItems = (): ContextMenuItem[] => [
    {
      id: 'new-folder',
      label: 'New Folder',
      icon: FolderPlus,
      onClick: () => {
        const newIcon = {
          id: `folder-${Date.now()}`,
          appId: 'folder',
          name: 'New Folder',
          icon: Folder,
          x: Math.max(50, contextMenu.position.x - 200),
          y: Math.max(100, contextMenu.position.y - 100),
        };
        setDesktopIcons([...desktopIcons, newIcon]);
      },
    },
    {
      id: 'separator-1',
      label: '',
      separator: true,
      onClick: () => {},
    },
    {
      id: 'refresh',
      label: 'Refresh Desktop',
      icon: RefreshCw,
      onClick: () => {
        setDesktopIcons([...desktopIcons]);
      },
    },
    {
      id: 'change-wallpaper',
      label: 'Change Wallpaper',
      icon: Monitor,
      onClick: () => {
        const nextWallpaper = (currentWallpaper + 1) % wallpapers.length;
        setCurrentWallpaper(nextWallpaper);
        localStorage.setItem('solario_wallpaper', nextWallpaper.toString());
      },
    },
    {
      id: 'separator-2',
      label: '',
      separator: true,
      onClick: () => {},
    },
    {
      id: 'view-options',
      label: 'View Options',
      icon: Grid3X3,
      onClick: () => {
        // Toggle between different desktop icon arrangements
        const shuffledIcons = [...desktopIcons].sort(() => Math.random() - 0.5);
        shuffledIcons.forEach((icon, index) => {
          icon.x = 50 + (index % 4) * 120;
          icon.y = 150 + Math.floor(index / 4) * 100;
        });
        setDesktopIcons(shuffledIcons);
      },
    },
    {
      id: 'desktop-info',
      label: 'Get Info',
      icon: Info,
      onClick: () => {
        const iconCount = desktopIcons.length;
        const windowCount = windows.length;
        const runningApps = new Set(windows.map((w) => w.appId)).size;
        setInfoModal({
          isOpen: true,
          title: 'Desktop Information',
          content: `Computer Name: ${computerName}\nDesktop Icons: ${iconCount}\nOpen Windows: ${windowCount}\nRunning Apps: ${runningApps}\nCurrent User: ${
            currentUser?.fullName || 'Guest'
          }\n\nSystem Information:\nOS: ${systemInfo.osVersion}\nProcessor: ${
            systemInfo.processor
          }\nMemory: ${systemInfo.memory}\nStorage: ${
            systemInfo.storage
          }\nGraphics: ${systemInfo.graphics}`,
        });
      },
    },
  ];

  // Dock context menu items
  const getDockContextMenuItems = (appId: string): ContextMenuItem[] => {
    const app = apps.find((a) => a.id === appId);
    const appWindows = windows.filter((w) => w.appId === appId);
    const isRunning = appWindows.length > 0;

    if (!app) return [];

    const items: ContextMenuItem[] = [
      {
        id: 'open',
        label: isRunning ? 'Show' : 'Open',
        onClick: () => {
          if (isRunning) {
            const activeWindow = appWindows.reduce((prev, current) =>
              prev.zIndex > current.zIndex ? prev : current
            );
            focusWindow(activeWindow.id);
          } else {
            openApp(app);
          }
        },
      },
    ];

    if (isRunning) {
      items.push({
        id: 'separator-1',
        label: '',
        separator: true,
        onClick: () => {},
      });

      appWindows.forEach((window, index) => {
        items.push({
          id: `window-${window.id}`,
          label: `${window.title}${window.isMinimized ? ' (Minimized)' : ''}`,
          onClick: () => {
            focusWindow(window.id);
          },
        });
      });

      items.push(
        {
          id: 'separator-2',
          label: '',
          separator: true,
          onClick: () => {},
        },
        {
          id: 'quit',
          label: 'Quit',
          onClick: () => {
            appWindows.forEach((window) => {
              closeWindow(window.id);
            });
          },
        }
      );
    }

    items.push(
      {
        id: 'separator-3',
        label: '',
        separator: true,
        onClick: () => {},
      },
      {
        id: 'show-in-finder',
        label: 'Show in Finder',
        icon: Folder,
        onClick: () => {
          const finderApp = apps.find((a) => a.id === 'finder');
          if (finderApp) {
            openApp(finderApp);
            // Focus on Applications folder or similar
          }
        },
      },
      {
        id: 'app-info',
        label: 'Get Info',
        icon: Info,
        onClick: () => {
          const windowCount = appWindows.length;
          const totalMemory = windowCount * 50; // Simulated memory usage
          setInfoModal({
            isOpen: true,
            title: `${app.name} Information`,
            content: `Application: ${app.name}\nStatus: ${
              isRunning ? 'Running' : 'Not Running'
            }\nWindows: ${windowCount}\nMemory Usage: ~${totalMemory}MB\nApp ID: ${
              app.id
            }\n\nFun Fact: This app is ${
              isRunning
                ? 'currently consuming your precious RAM'
                : 'peacefully sleeping'
            }`,
          });
        },
      }
    );

    return items;
  };

  // Window dragging functions
  const handleMouseDown = (e: React.MouseEvent, windowId: string) => {
    e.preventDefault();
    const window = windows.find((w) => w.id === windowId);
    if (!window) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const offsetX = e.clientX - window.x;
    const offsetY = e.clientY - window.y;

    setDraggedWindow(windowId);
    setWindows(
      windows.map((w) =>
        w.id === windowId
          ? {
              ...w,
              isDragging: true,
              dragOffset: { x: offsetX, y: offsetY },
              zIndex: nextZIndex,
            }
          : w
      )
    );
    setNextZIndex(nextZIndex + 1);
  };

  const handleResizeStart = (e: React.MouseEvent, windowId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setResizingWindow(windowId);
    setWindows(
      windows.map((w) => (w.id === windowId ? { ...w, isResizing: true } : w))
    );
  };

  const handleIconDragStart = (e: React.MouseEvent, iconId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setDraggedIcon(iconId);
  };

  const handleIconDoubleClick = (appId: string) => {
    const app = apps.find((a) => a.id === appId);
    if (app) {
      openApp(app);
    }
  };

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    localStorage.setItem('solario_dark_mode', newDarkMode.toString());
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString([], {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  // Add item to trash
  const moveToTrash = (name: string, type: 'file' | 'folder' | 'image' | 'music' | 'video', size: string, originalPath: string) => {
    const newTrashItem: TrashItem = {
      id: Date.now(),
      name,
      type,
      size,
      deletedDate: new Date(),
      originalPath
    };
    setTrashItems(prev => [newTrashItem, ...prev]);
  };

  // Empty trash
  const emptyTrash = () => {
    setTrashItems([]);
  };

  // Restore from trash
  const restoreFromTrash = (itemId: number) => {
    setTrashItems(prev => prev.filter(i => i.id !== itemId));
  };

  // Delete from trash permanently
  const deleteFromTrash = (itemId: number) => {
    setTrashItems(prev => prev.filter(i => i.id !== itemId));
  };

  // Show boot sequence if booting
  if (systemState === 'booting') {
    return (
      <div className="w-full h-screen overflow-hidden bg-gradient-to-br from-blue-950 via-purple-950 to-indigo-950">
        <BootSequence onBootComplete={handleBootComplete} />
      </div>
    );
  }

  // Show login screen if not logged in
  if (systemState === 'login') {
    return (
      <div className="w-full h-screen overflow-hidden bg-gradient-to-br from-blue-950 via-purple-950 to-indigo-950">
        {/* Solario OS Header */}
        <div className="absolute top-4 left-4 z-50 flex items-center space-x-2 text-white/80">
          <div className="text-2xl">☀️</div>
          <span className="text-sm font-medium">Solario OS</span>
        </div>
        <LoginScreen onLogin={handleLogin} />
      </div>
    );
  }

  // Show desktop if logged in
  return (
    <div
      className={`w-full h-screen relative overflow-hidden transition-colors duration-300 ${
        isDarkMode
          ? 'bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900'
          : 'bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500'
      }`}
      onContextMenu={handleDesktopContextMenu}
    >
      {/* Desktop Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* Menu Bar */}
      <div
        className={`absolute top-0 left-0 right-0 h-8 flex items-center justify-between px-4 backdrop-blur-md border-b ${
          isDarkMode
            ? 'bg-black/40 border-white/10 text-white'
            : 'bg-white/40 border-white/20 text-white'
        }`}
      >
        {/* Left side - Solario branding */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <div className="w-5 h-5 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
              <Sun className="w-3 h-3 text-white" />
            </div>
            <span className="text-sm font-semibold bg-gradient-to-r from-blue-200 to-purple-200 bg-clip-text text-transparent">
              Solario
            </span>
          </div>
        </div>

        {/* Right side - System status */}
        <div className="flex items-center space-x-2 text-sm relative" onClick={(e) => e.stopPropagation()}>
          {/* WiFi */}
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowWifiMenu(!showWifiMenu);
              }}
              className="hover:bg-white/20 p-1.5 rounded-md transition-all duration-200"
              title="Network"
            >
              {isWifiConnected ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
            </button>
            {showWifiMenu && (
              <div
                className={`absolute top-full right-0 mt-2 w-56 rounded-lg shadow-lg border z-50 ${
                  isDarkMode
                    ? 'bg-black border-gray-700 text-white'
                    : 'bg-white border-gray-200 text-gray-900'
                }`}
              >
                <div className="p-3">
                  <div className="text-sm font-medium mb-2">Network Status</div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
                      <div className="flex items-center space-x-2">
                        {isWifiConnected ? (
                          <Wifi className="w-4 h-4" />
                        ) : (
                          <WifiOff className="w-4 h-4" />
                        )}
                        <span className="text-sm">
                          {isWifiConnected ? 'Solario Network' : 'Disconnected'}
                        </span>
                      </div>
                      <div
                        className={`text-xs ${
                          isWifiConnected ? 'text-green-500' : 'text-red-500'
                        }`}
                      >
                        {isWifiConnected ? 'Connected' : 'Offline'}
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 px-2">
                      Connection Type: {networkType.toUpperCase()}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 px-2">
                      Uptime: {Math.floor(systemUptime / 3600)}h{' '}
                      {Math.floor((systemUptime % 3600) / 60)}m
                    </div>
                    {navigator.onLine && (
                      <div className="text-xs text-green-500 px-2">
                        ✓ Internet Access
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Battery */}
          <div className="relative">
            <button
              onClick={() => setShowBatteryInfo(!showBatteryInfo)}
              className="hover:bg-white/20 p-1.5 rounded-md transition-all duration-200 flex items-center space-x-1"
              title="Battery"
            >
              {batteryLevel < 20 ? (
                <BatteryLow className="w-4 h-4" />
              ) : (
                <Battery className="w-4 h-4" />
              )}
              <span className="text-xs font-medium">{batteryLevel}%</span>
            </button>
            {showBatteryInfo && (
              <div
                className={`absolute top-full right-0 mt-2 w-48 rounded-lg shadow-lg border z-50 ${
                  isDarkMode
                    ? 'bg-black border-gray-700 text-white'
                    : 'bg-white border-gray-200 text-gray-900'
                }`}
              >
                <div className="p-3">
                  <div className="text-sm font-medium mb-2">Battery Status</div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span>Level:</span>
                      <span>{batteryLevel}%</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span>Status:</span>
                      <span
                        className={
                          isCharging ? 'text-green-500' : 'text-gray-500'
                        }
                      >
                        {isCharging ? 'Charging' : 'Not Charging'}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span>Health:</span>
                      <span
                        className={
                          batteryLevel > 80
                            ? 'text-green-500'
                            : batteryLevel > 50
                            ? 'text-yellow-500'
                            : 'text-red-500'
                        }
                      >
                        {batteryLevel > 80
                          ? 'Good'
                          : batteryLevel > 50
                          ? 'Fair'
                          : 'Poor'}
                      </span>
                    </div>
                    <div
                      className={`w-full rounded-full h-2 ${
                        isDarkMode ? 'bg-gray-800' : 'bg-gray-200'
                      }`}
                    >
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${
                          batteryLevel > 50
                            ? 'bg-green-500'
                            : batteryLevel > 20
                            ? 'bg-yellow-500'
                            : 'bg-red-500'
                        }`}
                        style={{ width: `${batteryLevel}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Volume */}
          <div className="relative">
            <button
              onClick={() => setShowVolumeSlider(!showVolumeSlider)}
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
            {showVolumeSlider && (
              <div
                className={`absolute top-full right-0 mt-2 w-32 rounded-lg shadow-lg border z-50 ${
                  isDarkMode
                    ? 'bg-black border-gray-700 text-white'
                    : 'bg-white border-gray-200 text-gray-900'
                }`}
              >
                <div className="p-3">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={volume}
                    onChange={(e) => setVolume(parseInt(e.target.value))}
                    className="w-full"
                  />
                  <div className="text-center text-xs mt-1">{volume}%</div>
                </div>
              </div>
            )}
          </div>

          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="hover:bg-white/10 p-1 rounded"
          >
            {isDarkMode ? (
              <Sun className="w-4 h-4" />
            ) : (
              <Moon className="w-4 h-4" />
            )}
          </button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="hover:bg-white/10 p-1 rounded flex items-center space-x-1">
                <User className="w-4 h-4" />
                <ChevronDown className="w-3 h-3" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className={`w-56 ${
                isDarkMode
                  ? 'bg-black border-gray-700 text-white'
                  : 'bg-white border-gray-200 text-black'
              }`}
            >
              <DropdownMenuLabel
                className={`${isDarkMode ? 'text-white' : 'text-black'}`}
              >
                <div className="flex items-center space-x-2">
                  <UserCircle className="w-8 h-8" />
                  <div>
                    <div className="font-medium">
                      {currentUser?.fullName || 'Solario User'}
                    </div>
                    <div
                      className={`text-xs ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-600'
                      }`}
                    >
                      {currentUser?.username || 'user'}@solario.os
                    </div>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator
                className={`${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}
              />
              <DropdownMenuItem
                onClick={() =>
                  openApp(apps.find((app) => app.id === 'settings')!, true)
                }
                className={`${
                  isDarkMode
                    ? 'hover:bg-gray-800 text-white focus:bg-gray-800 focus:text-white'
                    : 'hover:bg-gray-100 text-black focus:bg-gray-100 focus:text-black'
                }`}
              >
                <UserCircle className="w-4 h-4 mr-2" />
                Account Settings
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  openApp(apps.find((app) => app.id === 'settings')!, true)
                }
                className={`${
                  isDarkMode
                    ? 'hover:bg-gray-800 text-white focus:bg-gray-800 focus:text-white'
                    : 'hover:bg-gray-100 text-black focus:bg-gray-100 focus:text-black'
                }`}
              >
                <Monitor className="w-4 h-4 mr-2" />
                System Preferences
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={toggleDarkMode}
                className={`${
                  isDarkMode
                    ? 'hover:bg-gray-800 text-white focus:bg-gray-800 focus:text-white'
                    : 'hover:bg-gray-100 text-black focus:bg-gray-100 focus:text-black'
                }`}
              >
                {isDarkMode ? (
                  <Sun className="w-4 h-4 mr-2" />
                ) : (
                  <Moon className="w-4 h-4 mr-2" />
                )}
                {isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              </DropdownMenuItem>
              <DropdownMenuSeparator
                className={`${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}
              />
              <DropdownMenuItem
                onClick={handleLogout}
                className={`text-red-500 ${
                  isDarkMode
                    ? 'hover:bg-gray-800 focus:bg-gray-800'
                    : 'hover:bg-gray-100 focus:bg-gray-100'
                }`}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Time */}
          <div
            className="text-sm font-medium cursor-pointer hover:bg-white/10 px-2 py-1 rounded"
            title="Click for date & time info"
          >
            {currentTime && formatTime(currentTime)}
          </div>

          {/* Date */}
          <div className="text-xs">
            {isClient && currentTime ? formatDate(currentTime) : 'Loading...'}
          </div>
        </div>
      </div>

      {/* Desktop Icons */}
      {desktopIcons.map((icon) => (
        <div
          key={icon.id}
          className={`absolute flex flex-col items-center p-2 rounded-lg cursor-pointer select-none transition-all duration-200 hover:bg-white/10 ${
            draggedIcon === icon.id ? 'opacity-50 scale-110' : ''
          }`}
          style={{
            left: icon.x,
            top: icon.y,
            width: 64,
            height: 80,
          }}
          onMouseDown={(e) => handleIconDragStart(e, icon.id)}
          onDoubleClick={() => handleIconDoubleClick(icon.appId)}
        >
          <div
            className={`w-12 h-12 rounded-lg flex items-center justify-center mb-1 ${
              isDarkMode ? 'bg-gray-700/50' : 'bg-white/20'
            }`}
          >
            <icon.icon className="w-8 h-8 text-white drop-shadow-lg" />
          </div>
          <span className="text-xs text-white text-center drop-shadow-lg font-medium">
            {icon.name}
          </span>
        </div>
      ))}

      {/* Windows */}
      {windows
        .filter((w) => !w.isMinimized)
        .map((window) => (
          <div
            key={window.id}
            className={`absolute rounded-lg shadow-2xl overflow-hidden select-none ${
              isDarkMode
                ? 'bg-black text-white border border-gray-800'
                : 'bg-white text-gray-900'
            } ${window.isDragging ? 'cursor-grabbing' : ''}`}
            style={{
              left: window.x,
              top: window.y,
              width: window.width,
              height: window.height,
              zIndex: window.zIndex,
              transition: window.isDragging ? 'none' : 'all 0.2s ease',
            }}
            onClick={() => focusWindow(window.id)}
          >
            {/* Window Title Bar */}
            <div
              className={`h-8 flex items-center justify-between px-4 cursor-grab active:cursor-grabbing ${
                isDarkMode
                  ? 'bg-gray-700 border-b border-gray-600'
                  : 'bg-gray-100 border-b border-gray-200'
              }`}
              onMouseDown={(e) => handleMouseDown(e, window.id)}
            >
              <div className="flex items-center space-x-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    closeWindow(window.id);
                  }}
                  className="w-3 h-3 bg-red-500 rounded-full hover:bg-red-600 transition-colors"
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    minimizeWindow(window.id);
                  }}
                  className="w-3 h-3 bg-yellow-500 rounded-full hover:bg-yellow-600 transition-colors"
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleMaximize(window.id);
                  }}
                  className="w-3 h-3 bg-green-500 rounded-full hover:bg-green-600 transition-colors"
                />
              </div>
              <span className="text-sm font-medium pointer-events-none">
                {window.title}
              </span>
            </div>

            {/* Window Content */}
            <div className="relative" style={{ height: window.height - 32 }}>
              <div className="w-full h-full overflow-auto">
                <window.component
                  windowId={window.id}
                  isDarkMode={isDarkMode}
                />
              </div>

              {/* Resize Handle */}
              <div
                className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize opacity-50 hover:opacity-100"
                onMouseDown={(e) => handleResizeStart(e, window.id)}
                style={{
                  background: `linear-gradient(-45deg, transparent 30%, ${
                    isDarkMode ? '#374151' : '#9CA3AF'
                  } 30%, ${
                    isDarkMode ? '#374151' : '#9CA3AF'
                  } 70%, transparent 70%)`,
                }}
              />
            </div>
          </div>
        ))}

      {/* Dock - Hidden when fullscreen */}
      {!hasFullscreenWindow && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
          <div
            className={`flex items-center space-x-2 px-4 py-2 rounded-2xl backdrop-blur-md border ${
              isDarkMode
                ? 'bg-black/60 border-gray-800'
                : 'bg-white/40 border-white/30'
            }`}
          >
            {apps.map((app) => {
              const appWindows = windows.filter((w) => w.appId === app.id);
              const isRunning = appWindows.length > 0;
              const hasMinimizedWindows = appWindows.some((w) => w.isMinimized);

              return (
                <div key={app.id} className="relative">
                  <button
                    onClick={() => {
                      if (hasMinimizedWindows) {
                        // Restore first minimized window
                        const minimizedWindow = appWindows.find(
                          (w) => w.isMinimized
                        );
                        if (minimizedWindow) {
                          focusWindow(minimizedWindow.id);
                        }
                      } else if (isRunning) {
                        // Focus the most recent window (highest z-index)
                        const activeWindow = appWindows.reduce(
                          (prev, current) =>
                            prev.zIndex > current.zIndex ? prev : current
                        );
                        focusWindow(activeWindow.id);
                      } else {
                        // Open new window
                        openApp(app);
                      }
                    }}
                    onContextMenu={(e) => handleDockAppContextMenu(e, app.id)}
                    className={`p-3 rounded-xl transition-all duration-200 hover:scale-110 relative ${
                      isDarkMode
                        ? 'hover:bg-white/20 text-white'
                        : 'hover:bg-white/30 text-white'
                    } ${isRunning ? 'bg-white/10' : ''}`}
                    title={`${app.name}${
                      appWindows.length > 0 ? ` (${appWindows.length})` : ''
                    }`}
                  >
                    <app.icon className="w-6 h-6" />

                    {/* Running indicator */}
                    {isRunning && (
                      <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white rounded-full" />
                    )}

                    {/* Multiple windows indicator */}
                    {appWindows.length > 1 && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                        {appWindows.length}
                      </div>
                    )}
                  </button>
                </div>
              );
            })}

            {/* Divider */}
            <div
              className={`w-px h-8 ${
                isDarkMode ? 'bg-white/20' : 'bg-white/30'
              }`}
            />


            {/* Trash */}
            <div className="relative">
              <button
                onClick={() => setShowTrashModal(true)}
                className={`p-3 rounded-xl transition-all duration-200 hover:scale-110 relative ${
                  isDarkMode
                    ? 'hover:bg-white/20 text-white'
                    : 'hover:bg-white/30 text-white'
                }`}
                title={`Trash (${trashItems.length} items)`}
              >
                <Trash2 className="w-6 h-6" />
                {trashItems.length > 0 && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                    {trashItems.length}
                  </div>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Context Menu */}
      <ContextMenu
        isOpen={contextMenu.isOpen}
        position={contextMenu.position}
        items={
          contextMenu.type === 'desktop'
            ? getDesktopContextMenuItems()
            : contextMenu.type === 'dock' && contextMenu.targetId
            ? getDockContextMenuItems(contextMenu.targetId)
            : []
        }
        onClose={closeContextMenu}
        isDarkMode={isDarkMode}
      />

      {/* Trash Modal */}
      <TrashModal
        isOpen={showTrashModal}
        onClose={() => setShowTrashModal(false)}
        trashItems={trashItems}
        onRestore={restoreFromTrash}
        onDelete={deleteFromTrash}
        onEmptyTrash={emptyTrash}
        isDarkMode={isDarkMode}
      />

      {/* Info Modal */}
      <InfoModal
        isOpen={infoModal.isOpen}
        onClose={() => setInfoModal({ isOpen: false, title: '', content: '' })}
        title={infoModal.title}
        content={infoModal.content}
        isDarkMode={isDarkMode}
      />

      {/* Spotlight Search */}
      {isSpotlightOpen && (
        <div
          className="absolute inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setIsSpotlightOpen(false)}
        >
          <div
            className={`w-96 rounded-xl shadow-2xl overflow-hidden ${
              isDarkMode ? 'bg-black border border-gray-800' : 'bg-white'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4">
              <div className="flex items-center space-x-3">
                <Search
                  className={`w-5 h-5 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}
                />
                <input
                  type="text"
                  placeholder="Search Solario..."
                  className={`flex-1 bg-transparent outline-none text-lg ${
                    isDarkMode
                      ? 'text-white placeholder-gray-400'
                      : 'text-gray-900 placeholder-gray-500'
                  }`}
                  autoFocus
                />
              </div>
            </div>
            <div
              className={`border-t ${
                isDarkMode ? 'border-gray-700' : 'border-gray-200'
              }`}
            >
              {apps.slice(0, 5).map((app) => (
                <button
                  key={app.id}
                  onClick={() => {
                    openApp(app);
                    setIsSpotlightOpen(false);
                  }}
                  className={`w-full flex items-center space-x-3 p-3 hover:bg-opacity-50 ${
                    isDarkMode
                      ? 'hover:bg-gray-700 text-white'
                      : 'hover:bg-gray-100 text-gray-900'
                  }`}
                >
                  <app.icon className="w-5 h-5" />
                  <span>{app.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

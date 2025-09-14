"use client";

import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  ArrowRight,
  RefreshCw,
  Home,
  Plus,
  X,
  Star,
  Download,
  History,
  Settings,
  Bookmark,
  Share,
  Search,
  Globe,
  Shield,
  Menu,
  RotateCcw
} from "lucide-react";

interface Tab {
  id: string;
  title: string;
  url: string;
  isLoading: boolean;
}

interface HistoryItem {
  url: string;
  title: string;
  timestamp: number;
  favicon: string;
}

interface BookmarkItem {
  id: number;
  title: string;
  url: string;
  favicon: string;
  timestamp: string;
}

interface DownloadItem {
  id: number;
  filename: string;
  url: string;
  size: string;
  timestamp: string;
  status: 'downloading' | 'completed' | 'failed';
}

interface BrowserSettings {
  homepage: string;
  searchEngine: 'google' | 'bing' | 'duckduckgo' | 'yahoo';
  autoComplete: boolean;
  popupBlocker: boolean;
  javascriptEnabled: boolean;
  cookiesEnabled: boolean;
  locationAccess: boolean;
  notificationsEnabled: boolean;
  downloadLocation: string;
  clearDataOnExit: boolean;
  rememberPasswords: boolean;
  autoFillForms: boolean;
}

export default function SolarioBrowserApp({ isDarkMode }: { isDarkMode: boolean }) {
  const [tabs, setTabs] = useState<Tab[]>([
    { id: '1', title: 'Welcome to Solario OS', url: 'solario://welcome', isLoading: false }
  ]);
  const [activeTabId, setActiveTabId] = useState('1');
  const [addressBarValue, setAddressBarValue] = useState('solario://welcome');
  const [isPrivate, setIsPrivate] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [customBookmarks, setCustomBookmarks] = useState<BookmarkItem[]>([]);
  const [downloads, setDownloads] = useState<DownloadItem[]>([]);
  const [tabHistory, setTabHistory] = useState<Record<string, { urls: string[], currentIndex: number }>>({});
  const [browserSettings, setBrowserSettings] = useState<BrowserSettings>({
    homepage: 'solario://welcome',
    searchEngine: 'google',
    autoComplete: true,
    popupBlocker: true,
    javascriptEnabled: true,
    cookiesEnabled: true,
    locationAccess: false,
    notificationsEnabled: true,
    downloadLocation: 'Downloads',
    clearDataOnExit: false,
    rememberPasswords: true,
    autoFillForms: true
  });

  // Enhanced adblocker state
  const [adBlockerEnabled, setAdBlockerEnabled] = useState(true);
  const [showAdBlockerPanel, setShowAdBlockerPanel] = useState(false);
  const [blockedAdsCount, setBlockedAdsCount] = useState(0);
  const [blockedTrackersCount, setBlockedTrackersCount] = useState(0);
  const [blockedMalwareCount, setBlockedMalwareCount] = useState(0);
  const [adBlockerSettings, setAdBlockerSettings] = useState({
    blockAds: true,
    blockTrackers: true,
    blockPopups: true,
    blockMalware: true,
    blockCookies: true,
    blockFingerprinting: true,
    allowYouTube: true,
    allowSocialMedia: false,
    strictMode: false,
    whitelist: ['solarioos.com', 'localhost', 'youtube.com', 'youtu.be']
  });
  const [customFilters, setCustomFilters] = useState<string[]>([
    '||doubleclick.net^',
    '||googlesyndication.com^',
    '||googletagmanager.com^',
    '||facebook.com/tr^',
    '||google-analytics.com^'
  ]);
  const [iframeError, setIframeError] = useState<Record<string, boolean>>({});

  // Default bookmarks - mix of iframe-friendly and popular sites
  const defaultBookmarks = [
    { name: "DuckDuckGo", url: "https://duckduckgo.com", icon: "🦆" },
    { name: "Bing", url: "https://bing.com", icon: "🔍" },
    { name: "Wikipedia", url: "https://wikipedia.org", icon: "📚" },
    { name: "Archive.org", url: "https://archive.org", icon: "📦" },
    { name: "Google", url: "https://www.google.com", icon: "🔍" },
    { name: "YouTube", url: "https://www.youtube.com", icon: "📺" },
    { name: "GitHub", url: "https://github.com", icon: "🐙" },
    { name: "Stack Overflow", url: "https://stackoverflow.com", icon: "📝" }
  ];

  // Load data from localStorage on mount
  useEffect(() => {
    const savedBookmarks = localStorage.getItem('solario-custom-bookmarks');
    if (savedBookmarks) {
      setCustomBookmarks(JSON.parse(savedBookmarks));
    }

    const savedSettings = localStorage.getItem('solario-browser-settings');
    if (savedSettings) {
      setBrowserSettings(JSON.parse(savedSettings));
    }

    const savedPrivate = localStorage.getItem('solario-browser-private');
    if (savedPrivate) {
      setIsPrivate(JSON.parse(savedPrivate));
    }

    const savedHistory = localStorage.getItem('solario-browser-history');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }

    const savedDownloads = localStorage.getItem('solario-browser-downloads');
    if (savedDownloads) {
      setDownloads(JSON.parse(savedDownloads));
    }
  }, []);

  // Save data to localStorage when they change
  useEffect(() => {
    localStorage.setItem('solario-custom-bookmarks', JSON.stringify(customBookmarks));
  }, [customBookmarks]);

  useEffect(() => {
    localStorage.setItem('solario-browser-settings', JSON.stringify(browserSettings));
  }, [browserSettings]);

  useEffect(() => {
    localStorage.setItem('solario-browser-private', JSON.stringify(isPrivate));
  }, [isPrivate]);

  useEffect(() => {
    localStorage.setItem('solario-browser-history', JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem('solario-browser-downloads', JSON.stringify(downloads));
  }, [downloads]);

  // Helper functions
  const getFavicon = (url: string) => {
    if (url.startsWith('solario://')) return '🌟';
    if (url.includes('google.com')) return '🔍';
    if (url.includes('youtube.com')) return '📺';
    if (url.includes('github.com')) return '🐙';
    if (url.includes('wikipedia.org')) return '📚';
    if (url.includes('reddit.com')) return '🤖';
    if (url.includes('twitter.com')) return '🐦';
    if (url.includes('stackoverflow.com')) return '📝';
    if (url.includes('developer.mozilla.org')) return '🔧';
    if (url.includes('solarioos.com')) return '🌟';
    return '🌐';
  };

  const getPageTitle = (url: string) => {
    if (url.startsWith('solario://')) {
      const path = url.replace('solario://', '');
      switch (path) {
        case 'welcome': return 'Welcome to Solario OS';
        case 'newtab': return 'New Tab';
        case 'bookmarks': return 'Bookmarks';
        case 'history': return 'History';
        case 'downloads': return 'Downloads';
        case 'settings': return 'Settings';
        default: return 'Solario Browser';
      }
    }
    if (url.includes('solarioos.com')) return 'Solario OS - Official Website';
    try {
      const domain = new URL(url).hostname;
      return domain.charAt(0).toUpperCase() + domain.slice(1);
    } catch {
      return url;
    }
  };
  const handleNavigate = (input: string) => {
    let url = input.trim();

    if (!url.startsWith('http://') && !url.startsWith('https://') && !url.startsWith('solario://')) {
      if (url.includes('.') && !url.includes(' ')) {
        url = 'https://' + url;
      } else {
        const searchEngines = {
          google: `https://www.google.com/search?q=${encodeURIComponent(url)}`,
          bing: `https://www.bing.com/search?q=${encodeURIComponent(url)}`,
          duckduckgo: `https://duckduckgo.com/?q=${encodeURIComponent(url)}`,
          yahoo: `https://search.yahoo.com/search?p=${encodeURIComponent(url)}`
        };
        url = searchEngines[browserSettings.searchEngine] || searchEngines.google;
      }
    }

    setTabs(prev => prev.map(tab =>
      tab.id === activeTabId
        ? { ...tab, url, title: getPageTitle(url), isLoading: true }
        : tab
    ));

    setAddressBarValue(url);

    if (!isPrivate) {
      setHistory(prev => [
        {
          url,
          title: getPageTitle(url),
          timestamp: Date.now(),
          favicon: getFavicon(url)
        },
        ...prev.slice(0, 99)
      ]);
    }

    setTabHistory(prev => {
      const currentHistory = prev[activeTabId] || { urls: [], currentIndex: -1 };
      const newUrls = [...currentHistory.urls.slice(0, currentHistory.currentIndex + 1), url];
      return {
        ...prev,
        [activeTabId]: {
          urls: newUrls,
          currentIndex: newUrls.length - 1
        }
      };
    });

    setTimeout(() => {
      setTabs(prev => prev.map(tab =>
        tab.id === activeTabId ? { ...tab, isLoading: false } : tab
      ));
    }, 1000);
  };


  // Handle download
  const handleDownload = (url: string) => {
    const filename = url.split('/').pop() || 'download';
    const download = {
      id: Date.now(),
      filename,
      url,
      size: '0 KB',
      timestamp: new Date().toISOString(),
      status: 'downloading' as const
    };

    setDownloads(prev => [download, ...prev]);

    // Simulate download completion
    setTimeout(() => {
      setDownloads(prev => prev.map(d =>
        d.id === download.id
          ? { ...d, status: 'completed' as const, size: '1.2 MB' }
          : d
      ));
    }, 2000);
  };

  // Navigation functions
  const navigateBack = () => {
    const currentHistory = tabHistory[activeTabId];
    if (currentHistory && currentHistory.currentIndex > 0) {
      const newIndex = currentHistory.currentIndex - 1;
      const url = currentHistory.urls[newIndex];

      setTabHistory(prev => ({
        ...prev,
        [activeTabId]: { ...currentHistory, currentIndex: newIndex }
      }));

      setTabs(prev => prev.map(tab =>
        tab.id === activeTabId
          ? { ...tab, url, title: getPageTitle(url), isLoading: true }
          : tab
      ));

      setAddressBarValue(url);

      setTimeout(() => {
        setTabs(prev => prev.map(tab =>
          tab.id === activeTabId ? { ...tab, isLoading: false } : tab
        ));
      }, 500);
    }
  };

  const navigateForward = () => {
    const currentHistory = tabHistory[activeTabId];
    if (currentHistory && currentHistory.currentIndex < currentHistory.urls.length - 1) {
      const newIndex = currentHistory.currentIndex + 1;
      const url = currentHistory.urls[newIndex];

      setTabHistory(prev => ({
        ...prev,
        [activeTabId]: { ...currentHistory, currentIndex: newIndex }
      }));

      setTabs(prev => prev.map(tab =>
        tab.id === activeTabId
          ? { ...tab, url, title: getPageTitle(url), isLoading: true }
          : tab
      ));

      setAddressBarValue(url);

      setTimeout(() => {
        setTabs(prev => prev.map(tab =>
          tab.id === activeTabId ? { ...tab, isLoading: false } : tab
        ));
      }, 500);
    }
  };

  const canNavigateBack = (tabId: string) => {
    const currentHistory = tabHistory[tabId];
    return currentHistory && currentHistory.currentIndex > 0;
  };

  const canNavigateForward = (tabId: string) => {
    const currentHistory = tabHistory[tabId];
    return currentHistory && currentHistory.currentIndex < currentHistory.urls.length - 1;
  };

  // Tab management
  const handleNewTab = () => {
    const newTab = {
      id: Date.now().toString(),
      title: 'New Tab',
      url: 'solario://newtab',
      isLoading: false
    };
    setTabs(prev => [...prev, newTab]);
    setActiveTabId(newTab.id);
    setAddressBarValue(newTab.url);
  };

  const handleCloseTab = (tabId: string) => {
    if (tabs.length === 1) return;

    const tabIndex = tabs.findIndex(tab => tab.id === tabId);
    const newTabs = tabs.filter(tab => tab.id !== tabId);
    setTabs(newTabs);

    if (activeTabId === tabId) {
      const newActiveIndex = Math.min(tabIndex, newTabs.length - 1);
      setActiveTabId(newTabs[newActiveIndex].id);
      setAddressBarValue(newTabs[newActiveIndex].url);
    }

    // Clean up tab history
    setTabHistory(prev => {
      const newHistory = { ...prev };
      delete newHistory[tabId];
      return newHistory;
    });
  };

  const handleTabClick = (tabId: string) => {
    setActiveTabId(tabId);
    const tab = tabs.find(t => t.id === tabId);
    if (tab) {
      setAddressBarValue(tab.url);
    }
  };

  // Bookmark management
  const addBookmark = (url: string, title: string) => {
    const bookmark = {
      id: Date.now(),
      title,
      url,
      favicon: getFavicon(url),
      timestamp: new Date().toISOString()
    };
    setCustomBookmarks(prev => [bookmark, ...prev]);
  };

  const removeBookmark = (url: string) => {
    setCustomBookmarks(prev => prev.filter(bookmark => bookmark.url !== url));
  };

  const isBookmarked = (url: string) => {
    return customBookmarks.some(bookmark => bookmark.url === url);
  };

  const activeTab = tabs.find(tab => tab.id === activeTabId);

  // Enhanced adblocker functions
  const toggleAdBlocker = () => {
    setAdBlockerEnabled(!adBlockerEnabled);
    if (!adBlockerEnabled) {
      setBlockedAdsCount(prev => prev + Math.floor(Math.random() * 8) + 3);
      setBlockedTrackersCount(prev => prev + Math.floor(Math.random() * 12) + 5);
      setBlockedMalwareCount(prev => prev + Math.floor(Math.random() * 3) + 1);
    }
  };

  const advancedUrlAnalysis = (url: string) => {
    if (!adBlockerEnabled) return { blocked: false, type: null };
    
    // Enhanced blocking lists
    const adDomains = [
      'doubleclick.net', 'googlesyndication.com', 'googleadservices.com',
      'facebook.com/tr', 'google-analytics.com', 'googletagmanager.com',
      'ads.yahoo.com', 'bing.com/ads', 'amazon-adsystem.com',
      'outbrain.com', 'taboola.com', 'criteo.com', 'adsystem.com'
    ];
    
    const trackerDomains = [
      'scorecardresearch.com', 'quantserve.com', 'hotjar.com',
      'mixpanel.com', 'segment.com', 'amplitude.com', 'fullstory.com'
    ];
    
    const malwareDomains = [
      'malicious-site.com', 'phishing-example.net', 'fake-bank.org'
    ];
    
    const socialTrackers = [
      'facebook.com/plugins', 'twitter.com/widgets', 'linkedin.com/widgets'
    ];

    // Check whitelist first
    const isWhitelisted = adBlockerSettings.whitelist.some(domain => 
      url.toLowerCase().includes(domain.toLowerCase())
    );
    
    if (isWhitelisted) return { blocked: false, type: null };
    
    // Advanced pattern matching
    const urlLower = url.toLowerCase();
    
    if (adBlockerSettings.blockMalware && malwareDomains.some(domain => urlLower.includes(domain))) {
      return { blocked: true, type: 'malware' };
    }
    
    if (adBlockerSettings.blockTrackers && trackerDomains.some(domain => urlLower.includes(domain))) {
      return { blocked: true, type: 'tracker' };
    }
    
    if (!adBlockerSettings.allowSocialMedia && socialTrackers.some(domain => urlLower.includes(domain))) {
      return { blocked: true, type: 'social' };
    }
    
    if (adBlockerSettings.blockAds && adDomains.some(domain => urlLower.includes(domain))) {
      return { blocked: true, type: 'ad' };
    }
    
    // Custom filter matching
    for (const filter of customFilters) {
      if (filter.startsWith('||') && filter.endsWith('^')) {
        const domain = filter.slice(2, -1);
        if (urlLower.includes(domain)) {
          return { blocked: true, type: 'custom' };
        }
      }
    }
    
    return { blocked: false, type: null };
  };

  const simulateAdvancedBlocking = (url: string) => {
    const analysis = advancedUrlAnalysis(url);
    
    if (analysis.blocked) {
      switch (analysis.type) {
        case 'ad':
          setBlockedAdsCount(prev => prev + 1);
          break;
        case 'tracker':
        case 'social':
          setBlockedTrackersCount(prev => prev + 1);
          break;
        case 'malware':
          setBlockedMalwareCount(prev => prev + 1);
          break;
        case 'custom':
          setBlockedAdsCount(prev => prev + 1);
          break;
      }
      return true;
    }
    
    // Simulate background blocking activity
    if (adBlockerEnabled && Math.random() < 0.3) {
      const blockType = Math.random();
      if (blockType < 0.5) {
        setBlockedAdsCount(prev => prev + 1);
      } else if (blockType < 0.8) {
        setBlockedTrackersCount(prev => prev + 1);
      } else {
        setBlockedMalwareCount(prev => prev + 1);
      }
    }
    
    return false;
  };

  // Helper functions

  // Render page content
  const renderPageContent = () => {
    if (!activeTab) return null;

    // Welcome page
    if (activeTab.url === 'solario://welcome') {
      return (
        <div className={`h-full overflow-auto ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
          {/* Hero Section */}
          <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800 relative">
            <div className="absolute inset-0 bg-black/20" />
            <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
              <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-3xl flex items-center justify-center shadow-2xl animate-pulse">
                <span className="text-6xl font-bold text-white">S</span>
              </div>
              <h1 className="text-7xl font-bold text-white mb-6 tracking-tight">
                Welcome to Solario OS
              </h1>
              <p className="text-2xl text-blue-100 mb-12 max-w-3xl mx-auto leading-relaxed">
                Experience the future of browsing with our advanced, secure, and beautiful browser
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
                <button
                  onClick={() => handleNavigate('https://solarioos.com')}
                  className="px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold text-lg hover:bg-blue-50 transition-all transform hover:scale-105 shadow-lg"
                >
                  Visit Official Website
                </button>
                <button
                  onClick={() => handleNavigate('solario://newtab')}
                  className="px-8 py-4 border-2 border-white text-white rounded-xl font-semibold text-lg hover:bg-white hover:text-blue-600 transition-all transform hover:scale-105"
                >
                  Start Browsing
                </button>
                <button
                  onClick={() => handleNavigate('solario://settings')}
                  className="px-8 py-4 border-2 border-white text-white rounded-xl font-semibold text-lg hover:bg-white hover:text-blue-600 transition-all transform hover:scale-105"
                >
                  Browser Settings
                </button>
              </div>
            </div>
          </section>

          {/* Quick Access */}
          <section className={`py-20 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h2 className={`text-5xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Quick Access
                </h2>
                <p className={`text-xl ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Your favorite sites, just one click away
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {defaultBookmarks.map((bookmark, index) => (
                  <div
                    key={index}
                    onClick={() => handleNavigate(bookmark.url)}
                    className={`p-6 rounded-2xl border transition-all hover:scale-105 cursor-pointer shadow-lg hover:shadow-xl ${
                      isDarkMode ? 'bg-gray-700 border-gray-600 hover:bg-gray-600' : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    <div className="text-3xl mb-3 text-center">{bookmark.icon}</div>
                    <h3 className={`font-medium text-center ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>{bookmark.name}</h3>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Footer */}
          <footer className={`py-12 border-t ${
            isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'
          }`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <span className="text-white text-lg font-bold">S</span>
                </div>
                <span className={`text-xl font-bold ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>Solario Browser</span>
              </div>
              <p className={`${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>Version 2.0.0 • © 2025 Solario OS</p>
            </div>
          </footer>
        </div>
      );
    }

    // Check if this is solarioos.com (handle as internal page)
    if (activeTab.url === 'https://solarioos.com' || activeTab.url === 'http://solarioos.com' || activeTab.url === 'solarioos.com') {
      return (
        <div className={`h-full overflow-auto ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
          {/* Hero Section */}
          <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800 relative">
            <div className="absolute inset-0 bg-black/20" />
            <div className="relative z-10 text-center px-4 max-w-6xl mx-auto">
              <div className="w-40 h-40 mx-auto mb-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-3xl flex items-center justify-center shadow-2xl animate-pulse">
                <span className="text-8xl font-bold text-white">S</span>
              </div>
              <h1 className="text-8xl font-bold text-white mb-6 tracking-tight">
                Solario OS
              </h1>
              <p className="text-3xl text-blue-100 mb-8 max-w-4xl mx-auto leading-relaxed">
                A Complete Desktop Operating System Built for the Modern Web
              </p>
              <p className="text-xl text-blue-200 mb-12 max-w-3xl mx-auto">
                Experience a full-featured desktop environment with 8+ professional applications, ARIA AI assistant, and beautiful design - all running entirely in your browser with zero backend required.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
                <button
                  onClick={() => handleNavigate('solario://welcome')}
                  className="px-10 py-5 bg-white text-blue-600 rounded-xl font-bold text-xl hover:bg-blue-50 transition-all transform hover:scale-105 shadow-xl"
                >
                  🚀 Launch Desktop Now
                </button>
                <button
                  onClick={() => window.scrollTo({ top: 800, behavior: 'smooth' })}
                  className="px-10 py-5 border-2 border-white text-white rounded-xl font-bold text-xl hover:bg-white hover:text-blue-600 transition-all transform hover:scale-105"
                >
                  📱 Explore Applications
                </button>
              </div>
              
              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                <div>
                  <div className="text-4xl font-bold text-white mb-2">8+</div>
                  <div className="text-blue-200">Built-in Apps</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-white mb-2">100%</div>
                  <div className="text-blue-200">Web-based</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-white mb-2">0</div>
                  <div className="text-blue-200">Backend Required</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-white mb-2">∞</div>
                  <div className="text-blue-200">Possibilities</div>
                </div>
              </div>
            </div>
          </section>

          {/* Applications Showcase */}
          <section className={`py-24 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h2 className={`text-5xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Professional Application Suite
                </h2>
                <p className={`text-xl max-w-3xl mx-auto ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Everything you need for productivity, creativity, and system management
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                  {
                    icon: '🌐',
                    name: 'Solario Browser',
                    description: 'Full-featured web browser with tabs, bookmarks, history, downloads, and privacy settings'
                  },
                  {
                    icon: '💻',
                    name: 'Advanced Terminal',
                    description: '20+ Linux commands, file operations, process monitoring, and system information'
                  },
                  {
                    icon: '📁',
                    name: 'File Manager',
                    description: 'Complete filesystem with upload, download, search, and navigation capabilities'
                  },
                  {
                    icon: '📝',
                    name: 'Text Editor',
                    description: 'Rich text editing with markdown support, save/open, and syntax highlighting'
                  },
                  {
                    icon: '🎵',
                    name: 'Music Player',
                    description: 'Beautiful audio interface with playlists, controls, and volume management'
                  },
                  {
                    icon: '🧮',
                    name: 'Scientific Calculator',
                    description: 'Advanced mathematical functions, memory operations, and keyboard support'
                  },
                  {
                    icon: '🧠',
                    name: 'ARIA AI Assistant',
                    description: 'Conversational AI with voice I/O, personality modes, and system integration'
                  },
                  {
                    icon: '⚙️',
                    name: 'System Settings',
                    description: '11 categories of settings including AI features, gaming modes, and accessibility'
                  }
                ].map((app, index) => (
                  <div 
                    key={index}
                    className={`p-6 rounded-2xl border transition-all hover:scale-105 cursor-pointer shadow-lg hover:shadow-xl ${isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'}`}
                  >
                    <div className="text-5xl mb-4 text-center">{app.icon}</div>
                    <h3 className={`text-xl font-bold mb-3 text-center ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {app.name}
                    </h3>
                    <p className={`text-sm text-center leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      {app.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Key Features */}
          <section className={`py-24 ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h2 className={`text-5xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Desktop Environment Features
                </h2>
                <p className={`text-xl max-w-3xl mx-auto ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  A complete operating system experience with advanced capabilities
                </p>
              </div>
              
              <div className="grid md:grid-cols-3 gap-12">
                {[
                  {
                    icon: '🖥️',
                    title: 'Full Window Management',
                    features: ['Drag & drop windows', 'Minimize/maximize/close', 'Window resizing', 'Focus management', 'Desktop icons', '8 gradient wallpapers']
                  },
                  {
                    icon: '👥',
                    title: 'Multi-User System',
                    features: ['Secure authentication', 'User profiles', 'Persistent sessions', 'Local storage', 'Privacy protection', 'Account management']
                  },
                  {
                    icon: '🎨',
                    title: 'Beautiful Interface',
                    features: ['Dark/light themes', 'Smooth animations', 'Modern design', 'Responsive layout', 'Touch support', 'Accessibility features']
                  }
                ].map((feature, index) => (
                  <div key={index} className={`p-8 rounded-2xl ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                    <div className="text-6xl mb-6 text-center">{feature.icon}</div>
                    <h3 className={`text-2xl font-bold mb-6 text-center ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {feature.title}
                    </h3>
                    <ul className="space-y-3">
                      {feature.features.map((item, i) => (
                        <li key={i} className={`flex items-center ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                          <span className="text-green-500 mr-3">✓</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Technical Specifications */}
          <section className={`py-24 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h2 className={`text-5xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Technical Excellence
                </h2>
                <p className={`text-xl max-w-3xl mx-auto ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Built with cutting-edge web technologies for optimal performance
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[
                  { icon: '⚛️', title: 'React 19 & Next.js 15', desc: 'Latest frameworks for optimal performance' },
                  { icon: '📘', title: 'Full TypeScript', desc: 'Complete type safety and error prevention' },
                  { icon: '🎨', title: 'Tailwind CSS', desc: 'Modern styling with shadcn/ui components' },
                  { icon: '💾', title: 'Local Storage', desc: 'No backend required - your data stays private' },
                  { icon: '📱', title: 'Fully Responsive', desc: 'Works on desktop, tablet, and mobile' },
                  { icon: '🔧', title: 'Zero Configuration', desc: 'Deploy anywhere with no setup required' }
                ].map((tech, index) => (
                  <div key={index} className={`p-6 rounded-xl ${isDarkMode ? 'bg-gray-900' : 'bg-white'} shadow-lg`}>
                    <div className="text-4xl mb-4 text-center">{tech.icon}</div>
                    <h3 className={`text-lg font-bold mb-3 text-center ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {tech.title}
                    </h3>
                    <p className={`text-sm text-center ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      {tech.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Call to Action */}
          <section className="py-24 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800 relative">
            <div className="absolute inset-0 bg-black/20" />
            <div className="relative z-10 max-w-4xl mx-auto text-center px-4">
              <h2 className="text-5xl md:text-6xl font-bold text-white mb-8">
                Ready to Experience the Future?
              </h2>
              <p className="text-xl text-blue-100 mb-12 max-w-2xl mx-auto">
                Join the revolution in web-based operating systems. No installation, no configuration, just pure innovation.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <button
                  onClick={() => handleNavigate('solario://welcome')}
                  className="px-10 py-5 bg-white text-blue-600 rounded-xl font-bold text-xl hover:bg-blue-50 transition-all transform hover:scale-105 shadow-xl"
                >
                  🚀 Launch Solario OS Now
                </button>
                <button
                  onClick={() => handleNavigate('solario://settings')}
                  className="px-10 py-5 border-2 border-white text-white rounded-xl font-bold text-xl hover:bg-white hover:text-blue-600 transition-all transform hover:scale-105"
                >
                  ⚙️ Explore Settings
                </button>
              </div>
            </div>
          </section>

          {/* Footer */}
          <footer className={`py-16 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
            <div className="max-w-6xl mx-auto px-4 text-center">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-3xl font-bold text-white">S</span>
              </div>
              <h3 className={`text-2xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Solario OS
              </h3>
              <p className={`mb-8 max-w-2xl mx-auto ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                The complete desktop operating system built for the modern web. Experience the future of computing with advanced applications, AI integration, and beautiful design.
              </p>
              <div className="flex flex-wrap justify-center gap-4 mb-8">
                {[
                  'Desktop Environment', 'Web Browser', 'Terminal', 'File Manager', 
                  'Text Editor', 'Music Player', 'Calculator', 'AI Assistant',
                  'Settings', 'Multi-User', 'Dark Mode', 'Zero Backend'
                ].map((feature, index) => (
                  <span key={index} className={`px-3 py-1 rounded-full text-sm ${isDarkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-200 text-gray-700'}`}>
                    {feature}
                  </span>
                ))}
              </div>
              <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Version 2.0.0 • © 2025 Solario OS • Built with React 19 & Next.js 15
              </p>
            </div>
          </footer>
        </div>
      );
    }

    // New Tab page
    if (activeTab.url === 'solario://newtab') {
      return (
        <div className={`h-full flex flex-col items-center justify-center p-8 ${
          isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
        }`}>
          <div className="text-center max-w-4xl w-full">
            <h2 className={`text-2xl font-semibold mb-8 ${
              isDarkMode ? 'text-white' : 'text-gray-800'
            }`}>New Tab</h2>

            {/* Quick Access */}
            <div className="grid grid-cols-4 gap-4 mb-12">
              {defaultBookmarks.map((bookmark, index) => (
                <button
                  key={index}
                  onClick={() => {
                    handleNavigate(bookmark.url);
                  }}
                  className={`rounded-xl p-4 shadow-lg hover:shadow-xl transition-all hover:scale-105 ${
                    isDarkMode
                      ? 'bg-gray-800 border border-gray-700 hover:bg-gray-700'
                      : 'bg-white hover:bg-gray-50'
                  }`}
                >
                  <div className="text-3xl mb-2">{bookmark.icon}</div>
                  <h3 className={`font-medium text-sm ${
                    isDarkMode ? 'text-white' : 'text-gray-800'
                  }`}>{bookmark.name}</h3>
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-400'
                }`} />
                <input
                  type="text"
                  placeholder="Search Google or enter a URL"
                  className={`w-full pl-14 pr-4 py-5 text-lg border rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-lg transition-all ${
                    isDarkMode
                      ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400'
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      const value = (e.target as HTMLInputElement).value;
                      if (value.trim()) {
                        handleNavigate(value);
                        (e.target as HTMLInputElement).value = '';
                      }
                    }
                  }}
                />
              </div>

              {/* Recent History */}
              {history.length > 0 && (
                <div className="mt-8">
                  <h3 className={`text-lg font-semibold mb-4 ${
                    isDarkMode ? 'text-white' : 'text-gray-800'
                  }`}>Recently Visited</h3>
                  <div className="grid grid-cols-1 gap-2">
                    {history.slice(0, 5).map((item, index) => (
                      <button
                        key={index}
                        onClick={() => handleNavigate(item.url)}
                        className={`flex items-center space-x-3 p-3 rounded-lg text-left hover:bg-opacity-80 transition-colors ${
                          isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
                        }`}
                      >
                        <Globe className={`w-4 h-4 flex-shrink-0 ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-500'
                        }`} />
                        <div className="flex-1 min-w-0">
                          <div className={`font-medium truncate ${
                            isDarkMode ? 'text-white' : 'text-gray-900'
                          }`}>{item.title}</div>
                          <div className={`text-sm truncate ${
                            isDarkMode ? 'text-gray-400' : 'text-gray-500'
                          }`}>{item.url}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }

    // Bookmarks page
    if (activeTab.url === 'solario://bookmarks') {
      return (
        <div className={`h-full p-8 overflow-y-auto ${
          isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
        }`}>
          <div className="max-w-4xl mx-auto">
            <h2 className={`text-3xl font-bold mb-8 ${
              isDarkMode ? 'text-white' : 'text-gray-800'
            }`}>Bookmarks</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Default Bookmarks */}
              {defaultBookmarks.map((bookmark, index) => (
                <div key={`default-${index}`} className={`rounded-lg p-4 border ${
                  isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                }`}>
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">{bookmark.icon}</div>
                    <div className="flex-1">
                      <h3 className={`font-medium ${
                        isDarkMode ? 'text-white' : 'text-gray-900'
                      }`}>{bookmark.name}</h3>
                      <p className={`text-sm truncate ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}>{bookmark.url}</p>
                    </div>
                    <button
                      onClick={() => handleNavigate(bookmark.url)}
                      className={`px-3 py-1 rounded text-sm ${
                        isDarkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'
                      } text-white transition-colors`}
                    >
                      Visit
                    </button>
                  </div>
                </div>
              ))}

              {/* Custom Bookmarks */}
              {customBookmarks.map((bookmark, index) => (
                <div key={`custom-${index}`} className={`rounded-lg p-4 border ${
                  isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                }`}>
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">{bookmark.favicon}</div>
                    <div className="flex-1">
                      <h3 className={`font-medium ${
                        isDarkMode ? 'text-white' : 'text-gray-900'
                      }`}>{bookmark.title}</h3>
                      <p className={`text-sm truncate ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}>{bookmark.url}</p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleNavigate(bookmark.url)}
                        className={`px-3 py-1 rounded text-sm ${
                          isDarkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'
                        } text-white transition-colors`}
                      >
                        Visit
                      </button>
                      <button
                        onClick={() => removeBookmark(bookmark.url)}
                        className={`px-2 py-1 rounded text-sm ${
                          isDarkMode ? 'bg-red-600 hover:bg-red-700' : 'bg-red-500 hover:bg-red-600'
                        } text-white transition-colors`}
                        title="Remove bookmark"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    // History page
    if (activeTab.url === 'solario://history') {
      return (
        <div className={`h-full p-8 overflow-y-auto ${
          isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
        }`}>
          <div className="max-w-4xl mx-auto">
            <h2 className={`text-3xl font-bold mb-8 ${
              isDarkMode ? 'text-white' : 'text-gray-800'
            }`}>History</h2>

            {history.length === 0 ? (
              <div className="text-center py-12">
                <Globe className={`w-16 h-16 mx-auto mb-4 ${
                  isDarkMode ? 'text-gray-600' : 'text-gray-400'
                }`} />
                <p className={`text-lg ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>No browsing history yet</p>
              </div>
            ) : (
              <div className="space-y-2">
                {history.map((item, index) => (
                  <div key={index} className={`flex items-center space-x-4 p-4 rounded-lg border ${
                    isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                  }`}>
                    <Globe className={`w-5 h-5 flex-shrink-0 ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <h3 className={`font-medium truncate ${
                        isDarkMode ? 'text-white' : 'text-gray-900'
                      }`}>{item.title}</h3>
                      <p className={`text-sm truncate ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}>{item.url}</p>
                      <p className={`text-xs ${
                        isDarkMode ? 'text-gray-500' : 'text-gray-400'
                      }`}>{new Date(item.timestamp).toLocaleString()}</p>
                    </div>
                    <button
                      onClick={() => handleNavigate(item.url)}
                      className={`px-3 py-1 rounded text-sm ${
                        isDarkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'
                      } text-white transition-colors`}
                    >
                      Visit
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      );
    }

    // Downloads page
    if (activeTab.url === 'solario://downloads') {
      return (
        <div className={`h-full p-8 overflow-y-auto ${
          isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
        }`}>
          <div className="max-w-4xl mx-auto">
            <h2 className={`text-3xl font-bold mb-8 ${
              isDarkMode ? 'text-white' : 'text-gray-800'
            }`}>Downloads</h2>

            {downloads.length === 0 ? (
              <div className="text-center py-12">
                <Download className={`w-16 h-16 mx-auto mb-4 ${
                  isDarkMode ? 'text-gray-600' : 'text-gray-400'
                }`} />
                <p className={`text-lg ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>No downloads yet</p>
                <p className={`text-sm mt-2 ${
                  isDarkMode ? 'text-gray-500' : 'text-gray-500'
                }`}>Files you download will appear here</p>
              </div>
            ) : (
              <div className="space-y-3">
                {downloads.map((download) => (
                  <div key={download.id} className={`flex items-center space-x-4 p-4 rounded-lg border ${
                    isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                  }`}>
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      download.status === 'completed' ? 'bg-green-100 text-green-600' :
                      download.status === 'downloading' ? 'bg-blue-100 text-blue-600' :
                      'bg-red-100 text-red-600'
                    }`}>
                      {download.status === 'completed' ? '✓' :
                       download.status === 'downloading' ? '↓' : '✗'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className={`font-medium truncate ${
                        isDarkMode ? 'text-white' : 'text-gray-900'
                      }`}>{download.filename}</h3>
                      <p className={`text-sm truncate ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}>{download.url}</p>
                      <p className={`text-xs ${
                        isDarkMode ? 'text-gray-500' : 'text-gray-400'
                      }`}>
                        {new Date(download.timestamp).toLocaleString()} •
                        <span className={`${
                          download.status === 'completed' ? 'text-green-600' :
                          download.status === 'downloading' ? 'text-blue-600' :
                          'text-red-600'
                        }`}>
                          {download.status === 'completed' ? 'Completed' :
                           download.status === 'downloading' ? 'Downloading...' : 'Failed'}
                        </span>
                      </p>
                    </div>
                    {download.status === 'completed' && (
                      <button
                        onClick={() => {
                          // In a real browser, this would open the file
                          alert(`Opening ${download.filename}`);
                        }}
                        className={`px-3 py-1 rounded text-sm ${
                          isDarkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'
                        } text-white transition-colors`}
                      >
                        Open
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}

            <div className="mt-8">
              <h3 className={`text-lg font-semibold mb-4 ${
                isDarkMode ? 'text-white' : 'text-gray-800'
              }`}>Quick Download</h3>
              <div className="flex space-x-2">
                <input
                  type="url"
                  placeholder="Enter URL to download"
                  className={`flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    isDarkMode
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      const url = (e.target as HTMLInputElement).value;
                      if (url.trim()) {
                        handleDownload(url);
                        (e.target as HTMLInputElement).value = '';
                      }
                    }
                  }}
                />
                <button
                  onClick={() => {
                    const input = document.querySelector('input[type="url"]') as HTMLInputElement;
                    if (input && input.value.trim()) {
                      handleDownload(input.value);
                      input.value = '';
                    }
                  }}
                  className={`px-4 py-2 rounded text-sm ${
                    isDarkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'
                  } text-white transition-colors`}
                >
                  Download
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Settings page
    if (activeTab.url === 'solario://settings') {
      return (
        <div className={`h-full p-8 overflow-y-auto ${
          isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
        }`}>
          <div className="max-w-4xl mx-auto">
            <h2 className={`text-3xl font-bold mb-8 ${
              isDarkMode ? 'text-white' : 'text-gray-800'
            }`}>Browser Settings</h2>

            <div className="space-y-8">
              {/* General */}
              <div className={`rounded-lg p-6 border ${
                isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
              }`}>
                <h3 className={`text-xl font-semibold mb-4 ${
                  isDarkMode ? 'text-white' : 'text-gray-800'
                }`}>General</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className={`font-medium mb-2 ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>Homepage</h4>
                    <select
                      value={browserSettings.homepage}
                      onChange={(e) => setBrowserSettings(prev => ({ ...prev, homepage: e.target.value }))}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        isDarkMode
                          ? 'bg-gray-700 border-gray-600 text-white'
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    >
                      <option value="solario://newtab">New Tab</option>
                      <option value="solario://welcome">Welcome Page</option>
                      <option value="https://solarioos.com">Solario OS Website</option>
                      <option value="https://www.google.com">Google</option>
                    </select>
                  </div>

                  <div>
                    <h4 className={`font-medium mb-2 ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>Default Search Engine</h4>
                    <select
                      value={browserSettings.searchEngine}
                      onChange={(e) => setBrowserSettings(prev => ({ ...prev, searchEngine: e.target.value as 'google' | 'bing' | 'duckduckgo' | 'yahoo' }))}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        isDarkMode
                          ? 'bg-gray-700 border-gray-600 text-white'
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    >
                      <option value="google">Google</option>
                      <option value="bing">Bing</option>
                      <option value="duckduckgo">DuckDuckGo</option>
                      <option value="yahoo">Yahoo</option>
                    </select>
                  </div>

                  <div>
                    <h4 className={`font-medium mb-2 ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>Download Location</h4>
                    <input
                      type="text"
                      value={browserSettings.downloadLocation}
                      onChange={(e) => setBrowserSettings(prev => ({ ...prev, downloadLocation: e.target.value }))}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        isDarkMode
                          ? 'bg-gray-700 border-gray-600 text-white'
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    />
                  </div>
                </div>
              </div>

              {/* Privacy & Security */}
              <div className={`rounded-lg p-6 border ${
                isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
              }`}>
                <h3 className={`text-xl font-semibold mb-4 ${
                  isDarkMode ? 'text-white' : 'text-gray-800'
                }`}>Privacy & Security</h3>
                <div className="space-y-4">
                  {[
                    { key: 'popupBlocker', label: 'Block Pop-ups', desc: 'Prevent websites from opening unwanted pop-up windows' },
                    { key: 'javascriptEnabled', label: 'Enable JavaScript', desc: 'Allow websites to run JavaScript code' },
                    { key: 'cookiesEnabled', label: 'Accept Cookies', desc: 'Allow websites to store cookies on your device' },
                    { key: 'locationAccess', label: 'Location Access', desc: 'Allow websites to request your location' },
                    { key: 'notificationsEnabled', label: 'Web Notifications', desc: 'Allow websites to show notifications' },
                    { key: 'rememberPasswords', label: 'Remember Passwords', desc: 'Save passwords for websites' },
                    { key: 'autoFillForms', label: 'Auto-fill Forms', desc: 'Automatically fill form data' },
                    { key: 'clearDataOnExit', label: 'Clear Data on Exit', desc: 'Remove browsing data when closing browser' }
                  ].map((setting) => (
                    <div key={setting.key} className="flex items-center justify-between">
                      <div>
                        <h4 className={`font-medium ${
                          isDarkMode ? 'text-white' : 'text-gray-900'
                        }`}>{setting.label}</h4>
                        <p className={`text-sm ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}>{setting.desc}</p>
                      </div>
                      <button
                        onClick={() => setBrowserSettings(prev => ({
                          ...prev,
                          [setting.key]: !prev[setting.key as keyof typeof prev]
                        }))}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          browserSettings[setting.key as keyof typeof browserSettings]
                            ? 'bg-blue-600'
                            : (isDarkMode ? 'bg-gray-600' : 'bg-gray-300')
                        }`}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          browserSettings[setting.key as keyof typeof browserSettings]
                            ? 'translate-x-6'
                            : 'translate-x-1'
                        }`} />
                      </button>
                    </div>
                  ))}

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className={`font-medium ${
                        isDarkMode ? 'text-white' : 'text-gray-900'
                      }`}>Private Browsing</h4>
                      <p className={`text-sm ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}>Browse without saving history or cookies</p>
                    </div>
                    <button
                      onClick={() => setIsPrivate(!isPrivate)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        isPrivate ? 'bg-blue-600' : (isDarkMode ? 'bg-gray-600' : 'bg-gray-300')
                      }`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        isPrivate ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className={`font-medium ${
                        isDarkMode ? 'text-white' : 'text-gray-900'
                      }`}>Clear Browsing Data</h4>
                      <p className={`text-sm ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}>Remove history, bookmarks, and cached data</p>
                    </div>
                    <button
                      onClick={() => {
                        if (confirm('Are you sure you want to clear all browsing data? This action cannot be undone.')) {
                          setHistory([]);
                          setCustomBookmarks([]);
                          setDownloads([]);
                          setTabHistory({});
                          localStorage.removeItem('solario-custom-bookmarks');
                          localStorage.removeItem('solario-browser-history');
                          localStorage.removeItem('solario-browser-downloads');
                        }
                      }}
                      className={`px-4 py-2 rounded text-sm ${
                        isDarkMode ? 'bg-red-600 hover:bg-red-700' : 'bg-red-500 hover:bg-red-600'
                      } text-white transition-colors`}
                    >
                      Clear All Data
                    </button>
                  </div>
                </div>
              </div>

              {/* Appearance */}
              <div className={`rounded-lg p-6 border ${
                isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
              }`}>
                <h3 className={`text-xl font-semibold mb-4 ${
                  isDarkMode ? 'text-white' : 'text-gray-800'
                }`}>Appearance</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className={`font-medium mb-2 ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>Theme</h4>
                    <p className={`text-sm mb-3 ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>Theme is controlled by the system settings</p>
                    <div className={`px-3 py-2 rounded border ${
                      isDarkMode ? 'bg-gray-700 border-gray-600 text-gray-300' : 'bg-gray-100 border-gray-300 text-gray-700'
                    }`}>
                      Current theme: {isDarkMode ? 'Dark' : 'Light'}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className={`font-medium ${
                        isDarkMode ? 'text-white' : 'text-gray-900'
                      }`}>Auto-Complete Suggestions</h4>
                      <p className={`text-sm ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}>Show suggestions while typing in address bar</p>
                    </div>
                    <button
                      onClick={() => setBrowserSettings(prev => ({ ...prev, autoComplete: !prev.autoComplete }))}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        browserSettings.autoComplete ? 'bg-blue-600' : (isDarkMode ? 'bg-gray-600' : 'bg-gray-300')
                      }`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        browserSettings.autoComplete ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Advanced */}
              <div className={`rounded-lg p-6 border ${
                isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
              }`}>
                <h3 className={`text-xl font-semibold mb-4 ${
                  isDarkMode ? 'text-white' : 'text-gray-800'
                }`}>Advanced</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className={`font-medium mb-2 ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>Browser Information</h4>
                    <div className={`space-y-2 text-sm ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      <p>Solario Browser v2.0.0</p>
                      <p>Built on Chromium Engine</p>
                      <p>Developer: Harvey</p>
                      <p>User Agent: {navigator.userAgent}</p>
                      <p>Platform: {navigator.platform}</p>
                      <p>Language: {navigator.language}</p>
                      <p>Online Status: {navigator.onLine ? 'Connected' : 'Offline'}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className={`font-medium mb-2 ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>Storage Usage</h4>
                    <div className={`text-sm ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      <p>History items: {history.length}</p>
                      <p>Custom bookmarks: {customBookmarks.length}</p>
                      <p>Downloads: {downloads.length}</p>
                      <p>Active tabs: {tabs.length}</p>
                      <p>Tab history entries: {Object.keys(tabHistory).length}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className={`font-medium mb-2 ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>Reset Settings</h4>
                    <p className={`text-sm mb-3 ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>Restore all settings to their default values</p>
                    <button
                      onClick={() => {
                        if (confirm('Are you sure you want to reset all settings to default? This action cannot be undone.')) {
                          setBrowserSettings({
                            homepage: 'solario://welcome',
                            searchEngine: 'google',
                            autoComplete: true,
                            popupBlocker: true,
                            javascriptEnabled: true,
                            cookiesEnabled: true,
                            locationAccess: false,
                            notificationsEnabled: true,
                            downloadLocation: 'Downloads',
                            clearDataOnExit: false,
                            rememberPasswords: true,
                            autoFillForms: true
                          });
                          localStorage.removeItem('solario-browser-settings');
                        }
                      }}
                      className={`px-4 py-2 rounded text-sm ${
                        isDarkMode ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-yellow-500 hover:bg-yellow-600'
                      } text-white transition-colors`}
                    >
                      Reset to Defaults
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // External website - enhanced iframe browsing with fallback handling
    if (activeTab.url.startsWith('http://') || activeTab.url.startsWith('https://')) {
      // Check if URL should be blocked
      if (simulateAdvancedBlocking(activeTab.url)) {
        return (
          <div className={`h-full flex items-center justify-center ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
            <div className="text-center p-8">
              <Shield className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h2 className={`text-xl font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                🛡️ Content Blocked
              </h2>
              <p className={`mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                This content was blocked by Solario AdBlocker
              </p>
              <button
                onClick={() => {
                  setAdBlockerSettings(prev => ({
                    ...prev,
                    whitelist: [...prev.whitelist, new URL(activeTab.url).hostname]
                  }));
                  setTabs(prev => prev.map(tab =>
                    tab.id === activeTabId ? { ...tab, isLoading: true } : tab
                  ));
                }}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              >
                Allow This Site
              </button>
            </div>
          </div>
        );
      }

      // Special handling for sites that typically block iframes
      const isFrameBlocked = (url: string) => {
        const blockedDomains = [
          'google.com', 'facebook.com', 'twitter.com', 'instagram.com',
          'linkedin.com', 'amazon.com', 'netflix.com', 'github.com'
        ];
        return blockedDomains.some(domain => url.includes(domain));
      };

      // If site likely blocks iframes or iframe failed to load, show fallback
      if (isFrameBlocked(activeTab.url) || iframeError[activeTabId]) {
        return (
          <div className={`h-full flex flex-col items-center justify-center p-8 ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
            <div className="text-center max-w-2xl">
              <div className={`w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center ${
                isDarkMode ? 'bg-gray-800' : 'bg-gray-100'
              }`}>
                <Globe className={`w-10 h-10 ${isDarkMode ? 'text-blue-400' : 'text-blue-500'}`} />
              </div>
              
              <h2 className={`text-2xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                🌐 External Website
              </h2>
              
              <p className={`text-lg mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {getPageTitle(activeTab.url)}
              </p>
              
              <p className={`text-sm mb-6 break-all ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {activeTab.url}
              </p>
              
              <div className={`p-4 rounded-lg mb-6 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                <p className={`text-sm mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  This website cannot be displayed in an embedded frame due to security restrictions.
                  You can visit it directly by opening it in a new window.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => {
                    window.open(activeTab.url, '_blank', 'noopener,noreferrer');
                  }}
                  className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
                >
                  🚀 Open in New Window
                </button>
                
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(activeTab.url);
                    alert('URL copied to clipboard!');
                  }}
                  className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                    isDarkMode 
                      ? 'bg-gray-700 text-white hover:bg-gray-600' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  📋 Copy URL
                </button>
                
                <button
                  onClick={() => {
                    setIframeError(prev => ({ ...prev, [activeTabId]: false }));
                    setTabs(prev => prev.map(tab =>
                      tab.id === activeTabId ? { ...tab, isLoading: true } : tab
                    ));
                    setTimeout(() => {
                      setTabs(prev => prev.map(tab =>
                        tab.id === activeTabId ? { ...tab, isLoading: false } : tab
                      ));
                    }, 1000);
                  }}
                  className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                    isDarkMode 
                      ? 'bg-gray-700 text-white hover:bg-gray-600' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  🔄 Try Again
                </button>
              </div>
              
              {/* Quick suggestions */}
              <div className="mt-8">
                <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Try these popular sites instead:
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { name: 'DuckDuckGo', url: 'https://duckduckgo.com', icon: '🦆' },
                    { name: 'Bing', url: 'https://bing.com', icon: '🔍' },
                    { name: 'Wikipedia', url: 'https://wikipedia.org', icon: '📚' },
                    { name: 'Archive.org', url: 'https://archive.org', icon: '📦' },
                    { name: 'Hacker News', url: 'https://news.ycombinator.com', icon: '📰' },
                    { name: 'Dev.to', url: 'https://dev.to', icon: '💻' },
                    { name: 'CodePen', url: 'https://codepen.io', icon: '🖊️' },
                    { name: 'JSFiddle', url: 'https://jsfiddle.net', icon: '🎯' }
                  ].map((site, index) => (
                    <button
                      key={index}
                      onClick={() => handleNavigate(site.url)}
                      className={`p-3 rounded-lg transition-all hover:scale-105 ${
                        isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'
                      }`}
                    >
                      <div className="text-2xl mb-1">{site.icon}</div>
                      <div className={`text-xs font-medium ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}>{site.name}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      }

      // Try to load in iframe for sites that might work
      return (
        <div className={`h-full ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
          <div className={`h-full flex items-center justify-center ${
            activeTab.isLoading ? 'block' : 'hidden'
          }`}>
            <div className="text-center">
              <div className={`w-8 h-8 border-2 border-t-transparent rounded-full animate-spin mx-auto mb-4 ${
                isDarkMode ? 'border-gray-400' : 'border-gray-600'
              }`} />
              <p className={`${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>Loading {getPageTitle(activeTab.url)}...</p>
              {adBlockerEnabled && (
                <p className={`text-xs mt-2 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                  🛡️ AdBlocker is protecting you
                </p>
              )}
            </div>
          </div>
          <iframe
            src={activeTab.url}
            className={`w-full h-full border-0 ${
              activeTab.isLoading ? 'hidden' : 'block'
            }`}
            title={activeTab.title}
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-presentation allow-top-navigation allow-autoplay allow-downloads"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; microphone; camera; geolocation"
            onLoad={() => {
              setTabs(prev => prev.map(tab =>
                tab.id === activeTabId
                  ? { ...tab, isLoading: false }
                  : tab
              ));
              // Simulate ad blocking for the page
              if (adBlockerEnabled) {
                setBlockedAdsCount(prev => prev + Math.floor(Math.random() * 3) + 1);
              }
            }}
            onError={() => {
              setIframeError(prev => ({ ...prev, [activeTabId]: true }));
              setTabs(prev => prev.map(tab =>
                tab.id === activeTabId
                  ? { ...tab, isLoading: false }
                  : tab
              ));
            }}
          />
        </div>
      );
    }

    // Fallback for unknown URLs
    return (
      <div className={`h-full flex items-center justify-center ${
        isDarkMode ? 'bg-gray-900' : 'bg-white'
      }`}>
        <div className="text-center">
          <div className={`w-16 h-16 rounded-lg mx-auto mb-4 flex items-center justify-center ${
            isDarkMode ? 'bg-gray-800' : 'bg-gray-200'
          }`}>
            <span className="text-2xl">🌐</span>
          </div>
          <h3 className={`text-xl font-semibold mb-2 ${
            isDarkMode ? 'text-white' : 'text-gray-800'
          }`}>
            {getPageTitle(activeTab.url)}
          </h3>
          <p className={`mb-4 ${
            isDarkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>{activeTab.url}</p>
          <div className={`text-sm ${
            isDarkMode ? 'text-gray-400' : 'text-gray-500'
          }`}>
            Enter a valid URL to browse the web
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`h-full flex flex-col ${
      isDarkMode ? 'bg-gray-900' : 'bg-gray-100'
    }`}>
      {/* Tab Bar */}
      <div className={`border-b flex items-center ${
        isDarkMode
          ? 'bg-gray-800 border-gray-700'
          : 'bg-gray-200 border-gray-300'
      }`}>
        <div className="flex-1 flex items-center overflow-x-auto">
          {tabs.map((tab) => (
            <div
              key={tab.id}
              className={`flex items-center min-w-0 max-w-xs border-r ${
                isDarkMode ? 'border-gray-700' : 'border-gray-300'
              } ${
                tab.id === activeTabId
                  ? (isDarkMode ? 'bg-gray-900' : 'bg-white')
                  : (isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-200 hover:bg-gray-100')
              }`}
            >
              <button
                onClick={() => handleTabClick(tab.id)}
                className="flex-1 flex items-center space-x-2 px-3 py-2 min-w-0"
              >
                <div className="w-4 h-4 flex-shrink-0 flex items-center justify-center text-xs">
                  {getFavicon(tab.url)}
                </div>
                <span className={`text-sm truncate ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>{tab.title}</span>
                {tab.isLoading && (
                  <div className={`w-3 h-3 border border-t-transparent rounded-full animate-spin flex-shrink-0 ${
                    isDarkMode ? 'border-gray-400' : 'border-gray-400'
                  }`} />
                )}
              </button>
              {tabs.length > 1 && (
                <button
                  onClick={() => handleCloseTab(tab.id)}
                  className={`p-1 rounded ${
                    isDarkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-300'
                  }`}
                >
                  <X className={`w-3 h-3 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-600'
                  }`} />
                </button>
              )}
            </div>
          ))}
        </div>

        <button
          onClick={handleNewTab}
          className={`p-2 rounded ${
            isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-300'
          }`}
        >
          <Plus className={`w-4 h-4 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`} />
        </button>
      </div>

      {/* Navigation Bar */}
      <div className={`border-b flex items-center p-2 space-x-2 ${
        isDarkMode
          ? 'bg-gray-800 border-gray-700'
          : 'bg-white border-gray-300'
      }`}>
        <div className="flex items-center space-x-1">
          <button
            className={`p-2 rounded disabled:opacity-50 ${
              isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
            }`}
            disabled={!activeTab || !canNavigateBack(activeTab.id)}
            onClick={navigateBack}
          >
            <ArrowLeft className={`w-4 h-4 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`} />
          </button>
          <button
            className={`p-2 rounded disabled:opacity-50 ${
              isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
            }`}
            disabled={!activeTab || !canNavigateForward(activeTab.id)}
            onClick={navigateForward}
          >
            <ArrowRight className={`w-4 h-4 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`} />
          </button>
          <button
            className={`p-2 rounded ${
              isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
            }`}
            onClick={() => {
              if (activeTab) {
                handleNavigate(activeTab.url);
              }
            }}
          >
            <RefreshCw className={`w-4 h-4 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`} />
          </button>
          <button
            className={`p-2 rounded ${
              isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
            }`}
            onClick={() => {
              if (navigator.share && activeTab) {
                try {
                  // Only share if it's a valid external URL
                  if (activeTab.url.startsWith('http://') || activeTab.url.startsWith('https://')) {
                    navigator.share({
                      title: activeTab.title,
                      url: activeTab.url
                    });
                  } else {
                    // For internal URLs, copy to clipboard instead
                    navigator.clipboard.writeText(`${activeTab.title} - ${activeTab.url}`);
                    alert('Link copied to clipboard!');
                  }
                } catch (error) {
                  // Fallback to clipboard if share fails
                  navigator.clipboard.writeText(`${activeTab.title} - ${activeTab.url}`);
                  alert('Link copied to clipboard!');
                }
              }
            }}
          >
            <Share className={`w-4 h-4 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`} />
          </button>
          {activeTab && !activeTab.url.startsWith('solario://') && (
            <button
              className={`p-2 rounded ${
                isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
              } ${
                isBookmarked(activeTab.url) ? 'text-yellow-500' : (isDarkMode ? 'text-gray-300' : 'text-gray-600')
              }`}
              onClick={() => {
                if (isBookmarked(activeTab.url)) {
                  removeBookmark(activeTab.url);
                } else {
                  addBookmark(activeTab.url, activeTab.title);
                }
              }}
              title={isBookmarked(activeTab.url) ? 'Remove bookmark' : 'Add bookmark'}
            >
              <Star className={`w-4 h-4 ${
                isBookmarked(activeTab.url) ? 'fill-current' : ''
              }`} />
            </button>
          )}
          <button
            className={`p-2 rounded ${
              isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
            }`}
            onClick={() => handleNavigate('solario://bookmarks')}
          >
            <Bookmark className={`w-4 h-4 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`} />
          </button>
          <button
            className={`p-2 rounded ${
              isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
            }`}
            onClick={() => handleNavigate('solario://newtab')}
          >
            <Home className={`w-4 h-4 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`} />
          </button>
          <button
            className={`p-2 rounded ${
              isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
            }`}
            onClick={() => handleNavigate('solario://history')}
          >
            <Menu className={`w-4 h-4 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`} />
          </button>
          <button
            className={`p-2 rounded ${
              isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
            }`}
            onClick={() => handleNavigate('solario://downloads')}
          >
            <Download className={`w-4 h-4 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`} />
          </button>
          <button
            className={`p-2 rounded ${
              isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
            }`}
            onClick={() => handleNavigate('solario://settings')}
          >
            <Settings className={`w-4 h-4 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`} />
          </button>
        </div>

        <div className="flex-1 relative">
          <input
            type="text"
            value={addressBarValue}
            onChange={(e) => setAddressBarValue(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleNavigate(addressBarValue);
              }
            }}
            className={`w-full px-3 py-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              isDarkMode
                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                : 'bg-white border-gray-300 text-gray-900'
            }`}
          />
          <button
            onClick={() => setShowAdBlockerPanel(!showAdBlockerPanel)}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            title={`AdBlocker ${adBlockerEnabled ? 'ON' : 'OFF'} - ${blockedAdsCount} ads blocked`}
          >
            <Shield className={`w-4 h-4 ${adBlockerEnabled ? 'text-green-500' : 'text-gray-400'}`} />
            {blockedAdsCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                {blockedAdsCount > 99 ? '99+' : blockedAdsCount}
              </span>
            )}
          </button>
        </div>

      </div>

      {/* AdBlocker Panel */}
      {showAdBlockerPanel && (
        <div className={`absolute top-16 right-4 w-80 p-4 rounded-lg shadow-lg border z-50 ${
          isDarkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-200'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              🛡️ Solario AdBlocker
            </h3>
            <button
              onClick={() => setShowAdBlockerPanel(false)}
              className={`p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}
            >
              ✕
            </button>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                AdBlocker Status
              </span>
              <button
                onClick={toggleAdBlocker}
                className={`px-3 py-1 rounded text-sm font-medium ${
                  adBlockerEnabled 
                    ? 'bg-green-500 text-white' 
                    : 'bg-gray-300 text-gray-700'
                }`}
              >
                {adBlockerEnabled ? 'ON' : 'OFF'}
              </button>
            </div>

            <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              <div className="flex justify-between">
                <span>Ads Blocked:</span>
                <span className="font-semibold text-red-500">{blockedAdsCount}</span>
              </div>
              <div className="flex justify-between">
                <span>Trackers Blocked:</span>
                <span className="font-semibold text-orange-500">{blockedTrackersCount}</span>
              </div>
              <div className="flex justify-between">
                <span>Malware Blocked:</span>
                <span className="font-semibold text-purple-500">{blockedMalwareCount}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Blocked:</span>
                <span className="font-semibold text-blue-500">{blockedAdsCount + blockedTrackersCount + blockedMalwareCount}</span>
              </div>
            </div>

            <div className="border-t pt-3 space-y-2">
              {Object.entries(adBlockerSettings).map(([key, value]) => {
                if (key === 'whitelist') return null;
                return (
                  <div key={key} className="flex items-center justify-between">
                    <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </span>
                    <button
                      onClick={() => setAdBlockerSettings(prev => ({ ...prev, [key]: !value }))}
                      className={`w-8 h-4 rounded-full transition-colors ${
                        value ? 'bg-blue-500' : 'bg-gray-300'
                      }`}
                    >
                      <div className={`w-3 h-3 bg-white rounded-full transition-transform ${
                        value ? 'translate-x-4' : 'translate-x-0.5'
                      }`} />
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="border-t pt-3">
              <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Whitelist: {adBlockerSettings.whitelist.join(', ')}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Content Area */}
      <div className="flex-1 overflow-hidden">
        {renderPageContent()}
      </div>
    </div>
  );
}

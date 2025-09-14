"use client";

import { useState, useEffect, useRef } from "react";
import { Search, Folder, Globe, Terminal, Calculator, Settings, Music, FileText, Command } from "lucide-react";
import FinderApp from "../apps/FinderApp";
import TerminalApp from "../apps/TerminalApp";
import CalculatorApp from "../apps/CalculatorApp";
import TextEditApp from "../apps/TextEditApp";
import MusicApp from "../apps/MusicApp";
import SystemPreferencesApp from "../apps/SystemPreferencesApp";

interface SpotlightProps {
  onClose: () => void;
  onOpenWindow: (appId: string, component: React.ComponentType<any>, title: string, options?: any) => void;
}

interface SearchResult {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  category: string;
  action: () => void;
}

export default function Spotlight({ onClose, onOpenWindow }: SpotlightProps) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [results, setResults] = useState<SearchResult[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const allItems: SearchResult[] = [
    {
      id: "finder",
      title: "Finder",
      subtitle: "File manager",
      icon: <Folder className="w-6 h-6 text-blue-500" />,
      category: "Applications",
      action: () => {
        onOpenWindow("finder", FinderApp, "Finder");
        onClose();
      }
    },
    {
      id: "terminal",
      title: "Terminal",
      subtitle: "Command line interface",
      icon: <Terminal className="w-6 h-6 text-black" />,
      category: "Applications",
      action: () => {
        onOpenWindow("terminal", TerminalApp, "Terminal");
        onClose();
      }
    },
    {
      id: "calculator",
      title: "Calculator",
      subtitle: "Perform calculations",
      icon: <Calculator className="w-6 h-6 text-orange-500" />,
      category: "Applications",
      action: () => {
        onOpenWindow("calculator", CalculatorApp, "Calculator");
        onClose();
      }
    },
    {
      id: "textedit",
      title: "TextEdit",
      subtitle: "Text editor",
      icon: <FileText className="w-6 h-6 text-blue-500" />,
      category: "Applications",
      action: () => {
        onOpenWindow("textedit", TextEditApp, "TextEdit");
        onClose();
      }
    },
    {
      id: "music",
      title: "Music",
      subtitle: "Music player",
      icon: <Music className="w-6 h-6 text-red-500" />,
      category: "Applications",
      action: () => {
        onOpenWindow("music", MusicApp, "Music");
        onClose();
      }
    },
    {
      id: "system-preferences",
      title: "System Preferences",
      subtitle: "System settings",
      icon: <Settings className="w-6 h-6 text-gray-600" />,
      category: "Applications",
      action: () => {
        onOpenWindow("system-preferences", SystemPreferencesApp, "System Preferences");
        onClose();
      }
    }
  ];

  useEffect(() => {
    // Focus input when component mounts
    if (inputRef.current) {
      inputRef.current.focus();
    }

    // Filter results based on query
    if (query.trim() === "") {
      setResults(allItems.slice(0, 8));
    } else {
      const filtered = allItems.filter(item =>
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.subtitle.toLowerCase().includes(query.toLowerCase())
      );
      setResults(filtered.slice(0, 8));
    }

    setSelectedIndex(0);
  }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex(prev => Math.min(prev + 1, results.length - 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex(prev => Math.max(prev - 1, 0));
        break;
      case "Enter":
        e.preventDefault();
        if (results[selectedIndex]) {
          results[selectedIndex].action();
        }
        break;
      case "Escape":
        onClose();
        break;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center pt-32">
      <div className="w-full max-w-2xl mx-4">
        <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 overflow-hidden">
          {/* Search Input */}
          <div className="flex items-center p-4 border-b border-gray-200/50">
            <Search className="w-6 h-6 text-gray-400 mr-3" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Spotlight Search"
              className="flex-1 text-lg bg-transparent outline-none placeholder-gray-400"
            />
            <div className="flex items-center space-x-1 text-xs text-gray-400">
              <Command className="w-3 h-3" />
              <span>Space</span>
            </div>
          </div>

          {/* Results */}
          <div className="max-h-96 overflow-y-auto">
            {results.length > 0 ? (
              <div className="py-2">
                {results.map((result, index) => (
                  <button
                    key={result.id}
                    onClick={result.action}
                    className={`w-full flex items-center p-3 hover:bg-blue-50 transition-colors ${
                      index === selectedIndex ? 'bg-blue-100' : ''
                    }`}
                  >
                    <div className="mr-3">
                      {result.icon}
                    </div>
                    <div className="flex-1 text-left">
                      <div className="font-medium text-gray-900">
                        {result.title}
                      </div>
                      <div className="text-sm text-gray-500">
                        {result.subtitle}
                      </div>
                    </div>
                    <div className="text-xs text-gray-400 uppercase tracking-wide">
                      {result.category}
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-gray-500">
                <Search className="w-12 h-12 mx-auto mb-4 opacity-30" />
                <div>No results found for &quot;{query}&quot;</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Click outside to close */}
      <div
        className="absolute inset-0 -z-10"
        onClick={onClose}
      />
    </div>
  );
}

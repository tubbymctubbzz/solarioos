"use client";

import React, { useState, useEffect } from 'react';
import {
  Folder,
  FileText,
  Search,
  Grid3X3,
  List,
  ArrowLeft,
  Home,
  Image,
  Music,
  Trash2,
  Clipboard,
  RotateCcw,
  Download,
  Video,
  ArrowRight,
  ChevronRight
} from "lucide-react";

interface FileItem {
  id: string;
  name: string;
  type: "folder" | "file";
  size?: number;
  modified: Date;
  icon: React.ReactNode;
  path: string;
}

interface FinderAppProps {
  windowId: string;
  isDarkMode?: boolean;
  onOpenTextEditor?: (fileName: string, content: string) => void;
  onOpenImageViewer?: (imageName: string, imagePath?: string) => void;
  onMoveToTrash?: (name: string, type: "folder" | "file" | "video" | "image" | "music", size: string, originalPath: string) => void;
}

interface ContextMenuProps {
  x: number;
  y: number;
  onClose: () => void;
  onNewFolder: () => void;
  onNewFile: () => void;
  onPaste: () => void;
  onRefresh: () => void;
  isDarkMode?: boolean;
}

export default function FinderApp({ windowId, isDarkMode = false, onOpenTextEditor, onOpenImageViewer }: FinderAppProps) {
  const [currentPath, setCurrentPath] = useState("/Users/solario");
  const [files, setFiles] = useState<FileItem[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [deletedFiles, setDeletedFiles] = useState<string[]>([]);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);

  const sidebarItems = [
    { name: "Desktop", path: "/Users/solario/Desktop", icon: <Home className="w-4 h-4" /> },
    { name: "Documents", path: "/Users/solario/Documents", icon: <FileText className="w-4 h-4" /> },
    { name: "Downloads", path: "/Users/solario/Downloads", icon: <Download className="w-4 h-4" /> },
    { name: "Pictures", path: "/Users/solario/Pictures", icon: <Image className="w-4 h-4" /> },
    { name: "Music", path: "/Users/solario/Music", icon: <Music className="w-4 h-4" /> },
    { name: "Movies", path: "/Users/solario/Movies", icon: <Video className="w-4 h-4" /> },
    { name: "Trash", path: "/Trash", icon: <Trash2 className="w-4 h-4" /> }
  ];

  useEffect(() => {
    // Generate sample files based on current path
    const newFiles = generateFiles(currentPath);
    setFiles(newFiles);
  }, [currentPath]);

  const generateFiles = (path: string): FileItem[] => {
    const baseFiles: FileItem[] = [];
    
    if (path === "/Users/solario") {
      return [
        { id: "desktop", name: "Desktop", type: "folder", modified: new Date(), icon: <Folder className="w-5 h-5 text-blue-500" />, path: "/Users/solario/Desktop" },
        { id: "documents", name: "Documents", type: "folder", modified: new Date(), icon: <Folder className="w-5 h-5 text-blue-500" />, path: "/Users/solario/Documents" },
        { id: "downloads", name: "Downloads", type: "folder", modified: new Date(), icon: <Folder className="w-5 h-5 text-blue-500" />, path: "/Users/solario/Downloads" },
        { id: "pictures", name: "Pictures", type: "folder", modified: new Date(), icon: <Folder className="w-5 h-5 text-blue-500" />, path: "/Users/solario/Pictures" },
        { id: "music", name: "Music", type: "folder", modified: new Date(), icon: <Folder className="w-5 h-5 text-blue-500" />, path: "/Users/solario/Music" },
        { id: "movies", name: "Movies", type: "folder", modified: new Date(), icon: <Folder className="w-5 h-5 text-blue-500" />, path: "/Users/solario/Movies" },
        { id: "welcome", name: "Welcome to Solario", type: "folder", modified: new Date(), icon: <Folder className="w-5 h-5 text-purple-500" />, path: "/Users/solario/Welcome to Solario" },
      ];
    }
    
    if (path === "/Users/solario/Welcome to Solario") {
      return [
        { id: "welcome-readme", name: "Getting Started.md", type: "file", size: 2048, modified: new Date(), icon: <FileText className="w-5 h-5 text-blue-500" />, path: "/Users/solario/Welcome to Solario/Getting Started.md" },
        { id: "welcome-tips", name: "Tips & Tricks.txt", type: "file", size: 1536, modified: new Date(), icon: <FileText className="w-5 h-5 text-green-500" />, path: "/Users/solario/Welcome to Solario/Tips & Tricks.txt" },
        { id: "welcome-wallpaper", name: "Solario Wallpaper.jpg", type: "file", size: 2500000, modified: new Date(), icon: <Image className="w-5 h-5 text-purple-500" />, path: "/Users/solario/Welcome to Solario/Solario Wallpaper.jpg" },
        { id: "welcome-shortcuts", name: "Keyboard Shortcuts.pdf", type: "file", size: 512000, modified: new Date(), icon: <FileText className="w-5 h-5 text-red-500" />, path: "/Users/solario/Welcome to Solario/Keyboard Shortcuts.pdf" },
        { id: "sample-folder", name: "Sample Files", type: "folder", modified: new Date(), icon: <Folder className="w-5 h-5 text-orange-500" />, path: "/Users/solario/Welcome to Solario/Sample Files" },
      ];
    }
    
    if (path === "/Users/solario/Welcome to Solario/Sample Files") {
      return [
        { id: "sample-doc", name: "Sample Document.docx", type: "file", size: 25600, modified: new Date(), icon: <FileText className="w-5 h-5 text-blue-500" />, path: "/Users/solario/Welcome to Solario/Sample Files/Sample Document.docx" },
        { id: "sample-image", name: "Sample Image.png", type: "file", size: 1200000, modified: new Date(), icon: <Image className="w-5 h-5 text-green-500" />, path: "/Users/solario/Welcome to Solario/Sample Files/Sample Image.png" },
        { id: "sample-music", name: "Sample Audio.mp3", type: "file", size: 3500000, modified: new Date(), icon: <Music className="w-5 h-5 text-purple-500" />, path: "/Users/solario/Welcome to Solario/Sample Files/Sample Audio.mp3" },
      ];
    }
    
    // All other folders are empty by default
    return baseFiles;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY });
  };

  const closeContextMenu = () => {
    setContextMenu(null);
  };

  const handleNewFolder = () => {
    const newFolder: FileItem = {
      id: `folder_${Date.now()}`,
      name: "New Folder",
      type: "folder",
      modified: new Date(),
      icon: <Folder className="w-5 h-5 text-blue-500" />,
      path: `${currentPath}/New Folder`
    };
    setFiles(prev => [...prev, newFolder]);
    closeContextMenu();
  };

  const handleNewFile = () => {
    const newFile: FileItem = {
      id: `file_${Date.now()}`,
      name: "Untitled.txt",
      type: "file",
      size: 0,
      modified: new Date(),
      icon: <FileText className="w-5 h-5 text-gray-500" />,
      path: `${currentPath}/Untitled.txt`
    };
    setFiles(prev => [...prev, newFile]);
    closeContextMenu();
  };

  const handleRefresh = () => {
    const newFiles = generateFiles(currentPath);
    setFiles(newFiles);
    closeContextMenu();
  };

  const handleItemClick = (item: FileItem) => {
    if (item.type === "folder") {
      setCurrentPath(item.path);
    } else {
      // Open image files with Image Viewer
      const isImageFile = item.name.toLowerCase().match(/\.(jpg|jpeg|png|gif|bmp|webp|svg|tiff|ico|heic|heif)$/);
      if (isImageFile && onOpenImageViewer) {
        onOpenImageViewer(item.name, item.path);
        return;
      }
      
      // Open text files with Solario++
      const isTextFile = item.name.toLowerCase().match(/\.(txt|md|js|ts|jsx|tsx|json|css|html|xml|yaml|yml|py|java|cpp|c|h|php|rb|go|rs|swift|kt|scala|sh|bat|ps1|sql|log|conf|ini|cfg|pdf|docx)$/);
      if (isTextFile && onOpenTextEditor) {
        // Generate realistic content based on file name
        let sampleContent = '';
        
        if (item.name === 'Getting Started.md') {
          sampleContent = `# Welcome to Solario OS! 🚀

## Getting Started

Welcome to your new Solario desktop environment! This guide will help you get familiar with the system.

### Key Features

- **Modern Interface**: Clean, intuitive design inspired by the best desktop environments
- **File Management**: Full-featured Finder with search, multiple views, and file operations
- **Applications**: Built-in apps including Terminal, Text Editor, Image Viewer, and more
- **Customization**: Dark/light mode, wallpapers, and system preferences
- **Keyboard Shortcuts**: Efficient navigation with familiar shortcuts

### Quick Start

1. **Explore the Dock**: Click on app icons to launch applications
2. **Use Finder**: Navigate your files and folders with the file manager
3. **Try the Terminal**: Access a full command-line interface
4. **Customize**: Open System Preferences to personalize your experience

### Need Help?

- Check out "Tips & Tricks.txt" for helpful shortcuts
- View "Keyboard Shortcuts.pdf" for a complete reference
- Explore the Sample Files folder for examples

Enjoy your Solario experience!`;
        } else if (item.name === 'Tips & Tricks.txt') {
          sampleContent = `Solario OS Tips & Tricks

=== KEYBOARD SHORTCUTS ===
⌘ + Space: Open Spotlight Search
⌘ + Tab: Switch between applications
⌘ + W: Close window
⌘ + Q: Quit application
⌘ + N: New window/document
⌘ + S: Save
⌘ + C/V: Copy/Paste

=== FINDER TIPS ===
• Double-click folders to navigate
• Use the sidebar for quick access to common locations
• Switch between list and grid view with the toolbar buttons
• Search files using the search box
• Delete files by selecting them and pressing Delete

=== SYSTEM FEATURES ===
• Click the menu bar time to see date/time info
• Use the Control Center for quick system toggles
• Battery, WiFi, and volume controls in the menu bar
• Drag windows by their title bars
• Resize windows from corners and edges

=== CUSTOMIZATION ===
• Change wallpapers in System Preferences
• Toggle dark mode from the menu bar or Control Center
• Adjust system settings in System Preferences
• Personalize your dock with frequently used apps

=== PRODUCTIVITY ===
• Use multiple windows for multitasking
• Minimize windows to the dock when not in use
• Use the trash for temporary file storage
• Create folders to organize your files

Happy computing with Solario OS!`;
        } else if (item.name === 'Keyboard Shortcuts.pdf') {
          sampleContent = `SOLARIO OS KEYBOARD SHORTCUTS REFERENCE

=== SYSTEM SHORTCUTS ===
⌘ + Space          Open Spotlight Search
⌘ + Tab            Application Switcher
⌘ + Shift + 3      Take Screenshot
⌘ + Shift + 4      Screenshot Selection
⌘ + Option + Esc   Force Quit Applications

=== WINDOW MANAGEMENT ===
⌘ + M              Minimize Window
⌘ + W              Close Window
⌘ + Q              Quit Application
⌘ + H              Hide Application
⌘ + Option + H     Hide Others

=== FILE OPERATIONS ===
⌘ + N              New Window/Document
⌘ + O              Open File
⌘ + S              Save
⌘ + Shift + S      Save As
⌘ + P              Print
⌘ + Z              Undo
⌘ + Shift + Z      Redo

=== TEXT EDITING ===
⌘ + C              Copy
⌘ + X              Cut
⌘ + V              Paste
⌘ + A              Select All
⌘ + F              Find
⌘ + G              Find Next

=== FINDER SHORTCUTS ===
⌘ + Delete         Move to Trash
⌘ + Shift + Delete Empty Trash
⌘ + D              Duplicate
⌘ + I              Get Info
⌘ + 1              Icon View
⌘ + 2              List View
⌘ + 3              Column View

=== NAVIGATION ===
Arrow Keys         Navigate
Enter              Open/Rename
Space              Quick Look
⌘ + Up Arrow       Go Up One Level
⌘ + Down Arrow     Open Selected Item

=== SYSTEM PREFERENCES ===
⌘ + ,              Open Preferences
⌘ + Shift + A      Applications Folder
⌘ + Shift + U      Utilities Folder
⌘ + Shift + D      Desktop Folder

Remember: ⌘ = Command Key

For more shortcuts, explore the applications and their menus!`;
        } else if (item.name === 'Sample Document.docx') {
          sampleContent = `Sample Document - Solario OS

This is a sample document to demonstrate text file handling in Solario OS.

Document Features:
- Rich text editing capabilities
- Multiple file format support
- Auto-save functionality
- Find and replace
- Word count and statistics

You can create, edit, and save documents using Solario++, the built-in text editor.

Key Features of Solario++:
• Syntax highlighting for code files
• Markdown preview support
• Multiple tabs for editing several files
• Customizable themes and fonts
• Integration with the file system

This document demonstrates how various file types can be opened and edited within the Solario environment.

Feel free to modify this content and save it to see the text editor in action!`;
        } else {
          sampleContent = `# ${item.name}

This file was opened from: ${item.path}
Last modified: ${item.modified.toLocaleString()}
File size: ${item.size ? formatFileSize(item.size) : 'Unknown'}

This is a sample file in the Solario OS environment. You can edit this content and save it using Solario++.

## About This File

This file demonstrates the text editing capabilities of Solario OS. The system supports various file formats and provides a rich editing experience.

## Features

- Syntax highlighting
- Auto-save
- Multiple tabs
- Find and replace
- Customizable themes

Feel free to explore and modify this content!`;
        }
        
        onOpenTextEditor(item.name, sampleContent);
      }
    }
  };

  const navigateBack = () => {
    const pathParts = currentPath.split("/").filter(Boolean);
    if (pathParts.length > 0) {
      pathParts.pop();
      setCurrentPath("/" + pathParts.join("/"));
    }
  };

  const getPathBreadcrumbs = () => {
    const parts = currentPath.split("/").filter(Boolean);
    return parts.map((part, index) => ({
      name: part,
      path: "/" + parts.slice(0, index + 1).join("/")
    }));
  };

  const filteredFiles = files.filter(file =>
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDeleteSelected = () => {
    if (selectedFiles.length === 0) return;
    
    selectedFiles.forEach(itemId => {
      const file = files.find(f => f.id === itemId);
      if (file) {
        const fileType = file.name.toLowerCase().includes('.jpg') || file.name.toLowerCase().includes('.png') ? 'image' :
                        file.name.toLowerCase().includes('.mp3') || file.name.toLowerCase().includes('.wav') ? 'music' :
                        file.name.toLowerCase().includes('.mp4') || file.name.toLowerCase().includes('.mov') ? 'video' :
                        file.type === 'folder' ? 'folder' : 'file';
        
        const fileSize = file.size ? formatFileSize(file.size) : '0 KB';
        
        // onMoveToTrash(file.name, fileType, fileSize, file.path);
      }
    });
    
    // Remove deleted files from the current view
    setFiles(prev => prev.filter(f => !selectedFiles.includes(f.id)));
    setSelectedFiles([]);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Delete' || e.key === 'Backspace') {
      handleDeleteSelected();
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [selectedFiles, files]);

  return (
    <div className={`h-full flex ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Sidebar */}
      <div className={`w-48 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-100 border-gray-200'} border-r flex flex-col`}>
        <div className={`p-3 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <h3 className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Favorites</h3>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {sidebarItems.map((item) => (
            <button
              key={item.path}
              onClick={() => setCurrentPath(item.path)}
              className={`w-full flex items-center space-x-2 px-3 py-2 text-left transition-colors ${
                currentPath === item.path 
                  ? (isDarkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-700')
                  : (isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-200')
              }`}
            >
              {item.icon}
              <span className="text-sm">{item.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className={`h-12 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b flex items-center px-4 space-x-4`}>
          <div className="flex items-center space-x-2">
            <button
              onClick={navigateBack}
              disabled={currentPath === "/"}
              className={`p-1 rounded disabled:opacity-50 disabled:cursor-not-allowed ${
                isDarkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-700'
              }`}
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <button className={`p-1 rounded opacity-50 cursor-not-allowed ${
              isDarkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-700'
            }`}>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Path Breadcrumbs */}
          <div className="flex items-center space-x-1 flex-1">
            {getPathBreadcrumbs().map((crumb, index) => (
              <div key={index} className="flex items-center space-x-1">
                {index > 0 && <ChevronRight className="w-3 h-3 text-gray-400" />}
                <button
                  onClick={() => setCurrentPath(crumb.path)}
                  className={`text-sm hover:underline ${
                    isDarkMode ? 'text-gray-400 hover:text-blue-400' : 'text-gray-600 hover:text-blue-600'
                  }`}
                >
                  {crumb.name}
                </button>
              </div>
            ))}
          </div>

          {/* View Controls */}
          <div className="flex items-center space-x-2">
            {selectedFiles.length > 0 && (
              <button
                onClick={handleDeleteSelected}
                className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                title="Delete selected items (Delete key)"
              >
                Delete ({selectedFiles.length})
              </button>
            )}
            
            <div className="relative">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search"
                className={`pl-8 pr-3 py-1 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
              />
            </div>
            
            <div className={`flex border rounded ${isDarkMode ? 'border-gray-600' : 'border-gray-300'}`}>
              <button
                onClick={() => setViewMode("list")}
                className={`p-1 ${
                  viewMode === "list" 
                    ? 'bg-blue-500 text-white' 
                    : (isDarkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-700')
                }`}
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1 ${
                  viewMode === "grid" 
                    ? 'bg-blue-500 text-white' 
                    : (isDarkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-700')
                }`}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* File List */}
        <div className="flex-1 overflow-auto p-4">
          {viewMode === "list" ? (
            <div className="space-y-1">
              {filteredFiles.map((file) => (
                <div
                  key={file.id}
                  onClick={() => handleItemClick(file)}
                  onDoubleClick={() => handleItemClick(file)}
                  className={`flex items-center space-x-3 p-2 rounded cursor-pointer transition-colors ${
                    selectedFiles.includes(file.id) 
                      ? (isDarkMode ? 'bg-blue-900/50' : 'bg-blue-100')
                      : (isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-blue-50')
                  }`}
                >
                  {file.icon}
                  <div className="flex-1 min-w-0">
                    <div className={`text-sm font-medium truncate ${
                      isDarkMode ? 'text-gray-100' : 'text-gray-900'
                    }`}>
                      {file.name}
                    </div>
                  </div>
                  <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {file.modified.toLocaleDateString()}
                  </div>
                  {file.size && (
                    <div className={`text-xs w-20 text-right ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {formatFileSize(file.size)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-4">
              {filteredFiles.map((file) => (
                <div
                  key={file.id}
                  onClick={() => handleItemClick(file)}
                  onDoubleClick={() => handleItemClick(file)}
                  className={`flex flex-col items-center p-4 rounded-lg cursor-pointer transition-colors ${
                    selectedFiles.includes(file.id) 
                      ? (isDarkMode ? 'bg-blue-900/50' : 'bg-blue-100')
                      : (isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-blue-50')
                  }`}
                >
                  <div className="mb-2">
                    {file.icon}
                  </div>
                  <div className={`text-sm text-center truncate w-full ${
                    isDarkMode ? 'text-gray-100' : 'text-gray-900'
                  }`}>
                    {file.name}
                  </div>
                </div>
              ))}
            </div>
          )}

          {filteredFiles.length === 0 && (
            <div className={`flex flex-col items-center justify-center h-64 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              <Folder className="w-16 h-16 mb-4 opacity-30" />
              <div className="text-lg font-medium mb-2">No items found</div>
              <div className="text-sm">This folder is empty or no items match your search.</div>
            </div>
          )}
        </div>

        {/* Status Bar */}
        <div className={`h-6 border-t flex items-center justify-between px-4 text-xs ${
          isDarkMode 
            ? 'bg-gray-800 border-gray-700 text-gray-400' 
            : 'bg-gray-100 border-gray-200 text-gray-600'
        }`}>
          <div>{filteredFiles.length} items</div>
          <div>{selectedFiles.length} selected</div>
        </div>

        {/* Context Menu */}
        {contextMenu && (
          <ContextMenu
            x={contextMenu.x}
            y={contextMenu.y}
            onClose={closeContextMenu}
            onNewFolder={handleNewFolder}
            onNewFile={handleNewFile}
            onPaste={() => closeContextMenu()}
            onRefresh={handleRefresh}
            isDarkMode={isDarkMode}
          />
        )}
      </div>
    </div>
  );
}

function ContextMenu({ x, y, onClose, onNewFolder, onNewFile, onPaste, onRefresh, isDarkMode }: ContextMenuProps) {
  return (
    <div
      className={`fixed z-50 min-w-48 rounded-lg shadow-lg border ${
        isDarkMode
          ? 'bg-gray-800 border-gray-700 text-white'
          : 'bg-white border-gray-200 text-gray-900'
      }`}
      style={{ left: x, top: y }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="py-2">
        <button
          onClick={onNewFolder}
          className={`w-full px-4 py-2 text-left text-sm hover:${
            isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
          } flex items-center space-x-2`}
        >
          <Folder className="w-4 h-4" />
          <span>New Folder</span>
        </button>
        <button
          onClick={onNewFile}
          className={`w-full px-4 py-2 text-left text-sm hover:${
            isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
          } flex items-center space-x-2`}
        >
          <FileText className="w-4 h-4" />
          <span>New File</span>
        </button>
        <hr className={`my-1 ${
          isDarkMode ? 'border-gray-700' : 'border-gray-200'
        }`} />
        <button
          onClick={onPaste}
          className={`w-full px-4 py-2 text-left text-sm hover:${
            isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
          } flex items-center space-x-2 opacity-50 cursor-not-allowed`}
        >
          <Clipboard className="w-4 h-4" />
          <span>Paste</span>
        </button>
        <button
          onClick={onRefresh}
          className={`w-full px-4 py-2 text-left text-sm hover:${
            isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
          } flex items-center space-x-2`}
        >
          <RotateCcw className="w-4 h-4" />
          <span>Refresh</span>
        </button>
      </div>
    </div>
  );
}

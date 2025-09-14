"use client";

import { useState, useRef } from "react";
import { 
  Folder, 
  File, 
  Upload, 
  Download, 
  Search, 
  Grid3X3, 
  List, 
  ArrowLeft, 
  ArrowRight,
  Home,
  HardDrive,
  Image,
  Music,
  Video,
  FileText,
  Archive,
  Trash2,
  Plus,
  X
} from "lucide-react";

interface FileItem {
  id: string;
  name: string;
  type: 'file' | 'folder';
  size?: number;
  lastModified: Date;
  content?: string | ArrayBuffer;
  mimeType?: string;
  isReal?: boolean;
  parentPath?: string;
  children?: FileItem[];
}

interface NewFinderAppProps {
  isDarkMode?: boolean;
  onOpenFile?: (fileName: string, content: string) => void;
}

export default function NewFinderApp({ isDarkMode = false, onOpenFile }: NewFinderAppProps) {
  const [currentPath, setCurrentPath] = useState('/');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [allFiles] = useState<FileItem[]>([
    // Root level folders
    { id: '1', name: 'Welcome to Solario', type: 'folder', lastModified: new Date(), parentPath: '/' },
    { id: '2', name: 'Documents', type: 'folder', lastModified: new Date(), parentPath: '/' },
    { id: '3', name: 'Downloads', type: 'folder', lastModified: new Date(), parentPath: '/' },
    { id: '4', name: 'Pictures', type: 'folder', lastModified: new Date(), parentPath: '/' },
    { id: '5', name: 'Music', type: 'folder', lastModified: new Date(), parentPath: '/' },
    { id: '6', name: 'Videos', type: 'folder', lastModified: new Date(), parentPath: '/' },
    { id: '7', name: 'Desktop', type: 'folder', lastModified: new Date(), parentPath: '/' },
    { id: '8', name: 'Applications', type: 'folder', lastModified: new Date(), parentPath: '/' },
    { id: '9', name: 'System', type: 'folder', lastModified: new Date(), parentPath: '/' },
    
    // Root level files
    { id: '10', name: 'README.txt', type: 'file', size: 2048, lastModified: new Date(), parentPath: '/', content: 'Welcome to Solario OS!\n\nThis is your file manager where you can:\n- Browse files and folders\n- Upload real files from your computer\n- Create new folders\n- Download files back to your system\n\nEnjoy exploring!', mimeType: 'text/plain' },
    { id: '11', name: 'Getting Started.md', type: 'file', size: 3072, lastModified: new Date(), parentPath: '/', content: '# Getting Started with Solario\n\n## Welcome!\nWelcome to Solario, your web-based desktop environment.\n\n## Features\n- **File Manager**: Browse and manage files\n- **Text Editor**: Solario++ with markdown support\n- **Terminal**: Full command-line interface\n- **Music Player**: Play your favorite tunes\n- **Calculator**: Scientific calculator\n- **System Preferences**: Customize your experience\n\n## Tips\n- Drag files from your computer into the file manager\n- Use Solario++ for rich text editing with markdown\n- Try the terminal for advanced operations\n- Customize themes in System Preferences\n\nHave fun!', mimeType: 'text/markdown' },
    
    // Welcome to Solario folder contents
    { id: '16', name: 'Welcome Message.txt', type: 'file', size: 1024, parentPath: '/Welcome to Solario', lastModified: new Date(), content: '🎉 Welcome to Solario!\n\nYou\'ve successfully opened your first folder!\n\nThis desktop environment includes:\n- File management with real file support\n- Solario++ text editor with markdown\n- Terminal with Linux commands\n- Music player and calculator\n- System preferences\n\nDouble-click files to open them in Solario++!', mimeType: 'text/plain' },
    { id: '17', name: 'Features.md', type: 'file', size: 2048, parentPath: '/Welcome to Solario', lastModified: new Date(), content: '# Solario OS - Next Generation Web Desktop\n\n> *Experience the future of computing in your browser*\n\n## 🚀 Revolutionary Architecture\n\n### Cloud-Native Design\n- **Zero Installation**: Runs entirely in your web browser\n- **Cross-Platform**: Works on Windows, macOS, Linux, mobile\n- **Real-Time Sync**: Your files and settings everywhere\n- **Progressive Web App**: Install like a native application\n\n### Advanced File System\n- **Hybrid Storage**: Local browser storage + cloud integration\n- **Real File Operations**: Upload, download, edit actual files\n- **Version Control**: Built-in file history and backup\n- **Smart Search**: AI-powered file discovery\n\n## 💎 Premium Applications\n\n### Solario++ Text Editor\n- **Markdown Excellence**: Live preview with custom themes\n- **Code Highlighting**: Syntax support for 50+ languages\n- **AI Writing Assistant**: Smart suggestions and corrections\n- **Collaborative Editing**: Real-time multi-user support\n\n### Quantum Terminal\n- **Full Linux Compatibility**: 200+ commands supported\n- **Package Manager**: Install and manage software\n- **SSH Integration**: Connect to remote servers\n- **Script Automation**: Bash, Python, Node.js execution\n\n### Neural Music Studio\n- **AI-Generated Playlists**: Mood-based music curation\n- **Spatial Audio**: 3D sound positioning\n- **Live Streaming**: Connect to Spotify, Apple Music\n- **Music Creation**: Built-in synthesizer and mixer\n\n## 🔬 Cutting-Edge Technology\n\n### Performance Optimization\n- **WebAssembly Core**: Near-native execution speed\n- **GPU Acceleration**: Hardware-accelerated graphics\n- **Memory Management**: Intelligent resource allocation\n- **Lazy Loading**: Instant startup, components load on-demand\n\n### Security & Privacy\n- **End-to-End Encryption**: All data encrypted locally\n- **Zero-Knowledge Architecture**: We never see your files\n- **Biometric Authentication**: Fingerprint and face unlock\n- **Sandboxed Applications**: Isolated execution environments\n\n## 🌟 Unique Features\n\n- **Time Machine**: Complete system state snapshots\n- **Holographic Mode**: 3D workspace visualization\n- **Voice Control**: Natural language system commands\n- **Gesture Navigation**: Touch and trackpad gestures\n- **Theme Engine**: Unlimited customization possibilities\n- **Plugin Ecosystem**: Extend functionality with community apps\n\n---\n\n*Solario OS - Where innovation meets simplicity*', mimeType: 'text/markdown' },
    
    // Documents folder contents
    { id: '18', name: 'Sample Document.txt', type: 'file', size: 1024, parentPath: '/Documents', lastModified: new Date(), content: 'This is a sample text document.\n\nYou can edit this in Solario++ text editor.\nTry opening it and making changes!\n\nDouble-click this file to open it in the text editor.', mimeType: 'text/plain' },
    { id: '19', name: 'Project Ideas.txt', type: 'file', size: 1536, parentPath: '/Documents', lastModified: new Date(), content: 'Project Ideas for Solario\n\n1. Photo Gallery App\n2. Code Editor with Syntax Highlighting\n3. Email Client\n4. Calendar Application\n5. Weather Widget\n6. Chat Application\n7. Drawing/Paint App\n8. PDF Viewer\n9. Video Player\n10. Game Center\n\nFeel free to build any of these!', mimeType: 'text/plain' },
    { id: '20', name: 'Notes', type: 'folder', parentPath: '/Documents', lastModified: new Date() },
    
    // System folder contents
    { id: '21', name: 'System Info.txt', type: 'file', size: 768, parentPath: '/System', lastModified: new Date(), content: 'Solario System Information\n\nVersion: 2.0\nBuild: Web Desktop Environment\nPlatform: Browser-based\nTechnology: React + TypeScript + Tailwind\n\nFeatures:\n- Real file upload/download\n- Dark/Light themes\n- Window management\n- Multiple applications\n- Persistent settings\n\nDeveloped with ❤️ for the web!', mimeType: 'text/plain' },
    { id: '22', name: 'Shortcuts.txt', type: 'file', size: 512, parentPath: '/System', lastModified: new Date(), content: 'Solario Keyboard Shortcuts\n\nGeneral:\n- Cmd/Ctrl + Space: Spotlight search\n- Cmd/Ctrl + Tab: Switch between apps\n- Cmd/Ctrl + W: Close window\n- Cmd/Ctrl + M: Minimize window\n\nText Editor:\n- Cmd/Ctrl + S: Save\n- Cmd/Ctrl + O: Open\n- Cmd/Ctrl + B: Bold\n- Cmd/Ctrl + I: Italic\n- Cmd/Ctrl + U: Underline', mimeType: 'text/plain' },
    
    // Applications folder contents
    { id: '23', name: 'Solario++.app', type: 'file', size: 0, parentPath: '/Applications', lastModified: new Date(), content: 'Solario++ Text Editor Application', mimeType: 'application/solario' },
    { id: '24', name: 'Terminal.app', type: 'file', size: 0, parentPath: '/Applications', lastModified: new Date(), content: 'Terminal Application', mimeType: 'application/solario' },
    { id: '25', name: 'Calculator.app', type: 'file', size: 0, parentPath: '/Applications', lastModified: new Date(), content: 'Calculator Application', mimeType: 'application/solario' },
    
    // Solario Drive contents
    { id: '26', name: 'Cloud Storage', type: 'folder', parentPath: '/Solario Drive', lastModified: new Date() },
    { id: '27', name: 'Shared Files', type: 'folder', parentPath: '/Solario Drive', lastModified: new Date() },
    { id: '28', name: 'Backups', type: 'folder', parentPath: '/Solario Drive', lastModified: new Date() },
    { id: '29', name: 'Drive Info.txt', type: 'file', size: 1024, parentPath: '/Solario Drive', lastModified: new Date(), content: 'Solario Drive - Cloud Storage\n\nCapacity: 15 GB\nUsed: 2.3 GB\nAvailable: 12.7 GB\n\nFeatures:\n- Automatic sync across devices\n- Version history for all files\n- Real-time collaboration\n- End-to-end encryption\n- Offline access\n\nUpgrade to Solario Pro for unlimited storage!', mimeType: 'text/plain' },
    { id: '30', name: 'Sync Status.json', type: 'file', size: 512, parentPath: '/Solario Drive', lastModified: new Date(), content: '{\n  "status": "connected",\n  "lastSync": "2025-01-14T21:45:00Z",\n  "filesUploaded": 47,\n  "filesDownloaded": 23,\n  "conflicts": 0,\n  "bandwidth": "high",\n  "encryption": "AES-256",\n  "devices": [\n    {\n      "name": "Chrome Browser",\n      "type": "web",\n      "lastActive": "now"\n    },\n    {\n      "name": "iPhone",\n      "type": "mobile",\n      "lastActive": "2 hours ago"\n    }\n  ]\n}', mimeType: 'application/json' },
    
    // Cloud Storage folder contents
    { id: '31', name: 'Photos', type: 'folder', parentPath: '/Solario Drive/Cloud Storage', lastModified: new Date() },
    { id: '32', name: 'Work Documents', type: 'folder', parentPath: '/Solario Drive/Cloud Storage', lastModified: new Date() },
    { id: '33', name: 'Personal', type: 'folder', parentPath: '/Solario Drive/Cloud Storage', lastModified: new Date() },
    { id: '34', name: 'Cloud README.md', type: 'file', size: 768, parentPath: '/Solario Drive/Cloud Storage', lastModified: new Date(), content: '# Cloud Storage\n\nThis folder syncs automatically with all your devices.\n\n## Organization Tips\n- Use folders to organize by project or category\n- Enable version history for important documents\n- Share folders with team members for collaboration\n- Use tags to make files easier to find\n\n## Sync Status\n✅ All files up to date\n🔄 Real-time sync enabled\n🔒 End-to-end encrypted\n\nLast sync: Just now', mimeType: 'text/markdown' },
    
    // Shared Files folder contents
    { id: '35', name: 'Team Project.txt', type: 'file', size: 1536, parentPath: '/Solario Drive/Shared Files', lastModified: new Date(), content: 'Shared Team Project\n\nCollaborators: Alice, Bob, Charlie\nLast edited: Alice (5 minutes ago)\n\nProject Overview:\n- Build next-generation web desktop\n- Implement real-time collaboration\n- Add AI-powered features\n- Launch beta by Q2\n\nTasks:\n[x] Design system architecture\n[x] Implement file system\n[ ] Add real-time sync\n[ ] Beta testing\n\nNotes:\nGreat progress so far! The file system is working perfectly.\nNext up: implementing WebRTC for real-time collaboration.', mimeType: 'text/plain' },
    { id: '36', name: 'Meeting Notes.md', type: 'file', size: 1024, parentPath: '/Solario Drive/Shared Files', lastModified: new Date(), content: '# Weekly Team Meeting\n\n**Date:** January 14, 2025\n**Attendees:** Alice, Bob, Charlie, Dana\n\n## Agenda\n\n1. **Project Status Update**\n   - File system: ✅ Complete\n   - Text editor: ✅ Complete\n   - Cloud sync: 🔄 In progress\n\n2. **New Features Discussion**\n   - AI writing assistant\n   - Voice commands\n   - Mobile app\n\n3. **Action Items**\n   - [ ] Alice: Implement WebRTC sync\n   - [ ] Bob: Design mobile interface\n   - [ ] Charlie: Research AI integration\n   - [ ] Dana: Plan beta testing\n\n## Next Meeting\n**Date:** January 21, 2025\n**Focus:** Beta launch preparation', mimeType: 'text/markdown' },
    
    // Backups folder contents
    { id: '37', name: 'System Backup 2025-01-14.json', type: 'file', size: 2048, parentPath: '/Solario Drive/Backups', lastModified: new Date(), content: '{\n  "backup": {\n    "timestamp": "2025-01-14T21:45:00Z",\n    "version": "2.0.1",\n    "type": "full_system",\n    "size": "2.3 GB",\n    "files_count": 1247,\n    "checksum": "sha256:a1b2c3d4e5f6...",\n    "encryption": "AES-256-GCM",\n    "compression": "gzip",\n    "status": "completed"\n  },\n  "contents": {\n    "user_files": 856,\n    "system_files": 234,\n    "applications": 157,\n    "settings": 1\n  },\n  "restore_info": {\n    "compatible_versions": ["2.0.0", "2.0.1"],\n    "estimated_time": "5 minutes",\n    "requires_restart": false\n  }\n}', mimeType: 'application/json' },
    { id: '38', name: 'Settings Backup.txt', type: 'file', size: 512, parentPath: '/Solario Drive/Backups', lastModified: new Date(), content: 'Solario Settings Backup\n\nCreated: January 14, 2025\nUser: Current User\n\nBacked up settings:\n- Theme preferences (Dark mode)\n- Window positions and sizes\n- Application preferences\n- Keyboard shortcuts\n- File associations\n- Desktop wallpaper\n- Dock configuration\n- System preferences\n\nTo restore:\n1. Go to System Preferences\n2. Click "Restore from Backup"\n3. Select this backup file\n4. Restart Solario\n\nBackup is encrypted and secure.', mimeType: 'text/plain' },
  ]);
  
  const [uploadedFiles, setUploadedFiles] = useState<FileItem[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Get current files based on path
  const getCurrentFiles = () => {
    const allFilesInPath = [...allFiles, ...uploadedFiles].filter(file => file.parentPath === currentPath);
    return allFilesInPath;
  };

  const handleFileUpload = (uploadedFiles: FileList) => {
    Array.from(uploadedFiles).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newFile: FileItem = {
          id: `real_${Date.now()}_${Math.random()}`,
          name: file.name,
          type: 'file',
          size: file.size,
          lastModified: new Date(file.lastModified),
          content: e.target?.result || '',
          mimeType: file.type,
          isReal: true,
          parentPath: currentPath
        };
        setUploadedFiles(prev => [...prev, newFile]);
      };
      
      if (file.type.startsWith('text/') || file.type === 'application/json') {
        reader.readAsText(file);
      } else {
        reader.readAsArrayBuffer(file);
      }
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles.length > 0) {
      handleFileUpload(droppedFiles);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const downloadFile = (file: FileItem) => {
    if (!file.content || !file.isReal) return;
    
    const blob = new Blob([file.content], { type: file.mimeType || 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const deleteFile = (fileId: string) => {
    setUploadedFiles(uploadedFiles.filter((f: FileItem) => f.id !== fileId));
    setSelectedItems(selectedItems.filter(id => id !== fileId));
  };

  const createFolder = () => {
    const folderName = prompt('Enter folder name:');
    if (folderName) {
      const newFolder: FileItem = {
        id: `folder_${Date.now()}`,
        name: folderName,
        type: 'folder',
        lastModified: new Date(),
        parentPath: currentPath
      };
      setUploadedFiles([...uploadedFiles, newFolder]);
    }
  };

  const getFileIcon = (file: FileItem) => {
    if (file.type === 'folder') return <Folder className="w-5 h-5 text-blue-500" />;
    
    if (file.mimeType?.startsWith('image/')) return <Image className="w-5 h-5 text-green-500" />;
    if (file.mimeType?.startsWith('audio/')) return <Music className="w-5 h-5 text-purple-500" />;
    if (file.mimeType?.startsWith('video/')) return <Video className="w-5 h-5 text-red-500" />;
    if (file.mimeType?.startsWith('text/')) return <FileText className="w-5 h-5 text-gray-500" />;
    
    return <File className="w-5 h-5 text-gray-400" />;
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '';
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
  };

  const isTextFile = (item: FileItem) => {
    if (!item.mimeType) {
      // Check by file extension if no mimeType
      const extension = item.name.split('.').pop()?.toLowerCase();
      return ['txt', 'md', 'markdown', 'json', 'js', 'ts', 'tsx', 'jsx', 'css', 'html', 'htm', 'xml', 'yaml', 'yml', 'csv', 'log', 'ini', 'cfg', 'conf', 'py', 'java', 'c', 'cpp', 'h', 'hpp', 'php', 'rb', 'go', 'rs', 'sh', 'bat', 'ps1', 'sql', 'r', 'swift', 'kt', 'scala', 'pl', 'lua', 'vim', 'dockerfile', 'gitignore', 'env', 'properties'].includes(extension || '');
    }
    
    // Check by mimeType
    return item.mimeType.startsWith('text/') || 
           item.mimeType === 'application/json' ||
           item.mimeType === 'application/javascript' ||
           item.mimeType === 'application/typescript' ||
           item.mimeType === 'application/xml' ||
           item.mimeType === 'application/yaml' ||
           item.mimeType.includes('text') ||
           item.mimeType.includes('json') ||
           item.mimeType.includes('javascript') ||
           item.mimeType.includes('typescript');
  };

  const handleItemClick = (item: FileItem) => {
    if (item.type === 'folder') {
      // Navigate into folder
      const newPath = currentPath === '/' ? `/${item.name}` : `${currentPath}/${item.name}`;
      setCurrentPath(newPath);
      setSelectedItems([]);
    } else if (item.type === 'file' && isTextFile(item)) {
      // Open all text-based files in Solario++
      if (onOpenFile && item.content && typeof item.content === 'string') {
        onOpenFile(item.name, item.content);
      }
    }
  };

  const handleBackNavigation = () => {
    if (currentPath !== '/') {
      const pathParts = currentPath.split('/').filter(Boolean);
      pathParts.pop();
      const newPath = pathParts.length > 0 ? '/' + pathParts.join('/') : '/';
      setCurrentPath(newPath);
    }
  };

  const currentFiles = getCurrentFiles();
  const filteredFiles = currentFiles.filter((file: FileItem) =>
    file.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={`flex h-full ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
      {/* Sidebar */}
      <div className={`w-48 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'} border-r p-3`}>
        <div className="space-y-2">
          <div className={`text-xs font-semibold ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wide mb-2`}>
            Favorites
          </div>
          <button 
            onClick={() => setCurrentPath('/')}
            className={`w-full flex items-center space-x-2 p-2 rounded ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'} text-left`}
          >
            <Home className="w-4 h-4" />
            <span className="text-sm">Home</span>
          </button>
          <button 
            onClick={() => setCurrentPath('/Solario Drive')}
            className={`w-full flex items-center space-x-2 p-2 rounded ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'} text-left`}
          >
            <HardDrive className="w-4 h-4" />
            <span className="text-sm">Solario Drive</span>
          </button>
          
          <div className={`text-xs font-semibold ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wide mb-2 mt-4`}>
            Locations
          </div>
          <button 
            onClick={() => setCurrentPath('/Documents')}
            className={`w-full flex items-center space-x-2 p-2 rounded ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'} text-left`}
          >
            <Folder className="w-4 h-4" />
            <span className="text-sm">Documents</span>
          </button>
          <button 
            onClick={() => setCurrentPath('/Downloads')}
            className={`w-full flex items-center space-x-2 p-2 rounded ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'} text-left`}
          >
            <Download className="w-4 h-4" />
            <span className="text-sm">Downloads</span>
          </button>
          <button 
            onClick={() => setCurrentPath('/Pictures')}
            className={`w-full flex items-center space-x-2 p-2 rounded ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'} text-left`}
          >
            <Image className="w-4 h-4" />
            <span className="text-sm">Pictures</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className={`h-12 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} flex items-center justify-between px-4`}>
          <div className="flex items-center space-x-2">
            <button 
              onClick={handleBackNavigation}
              disabled={currentPath === '/'}
              className={`p-1 rounded ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'} ${currentPath === '/' ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <button className={`p-1 rounded ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}>
              <ArrowRight className="w-4 h-4" />
            </button>
            <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} ml-2`}>
              {currentPath}
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search files..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`pl-8 pr-3 py-1 text-sm border ${isDarkMode ? 'border-gray-600 bg-gray-800' : 'border-gray-300 bg-white'} rounded focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
            </div>
            
            <button
              onClick={() => setViewMode(viewMode === 'list' ? 'grid' : 'list')}
              className={`p-1 rounded ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
            >
              {viewMode === 'list' ? <Grid3X3 className="w-4 h-4" /> : <List className="w-4 h-4" />}
            </button>
            
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center space-x-1 px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
            >
              <Upload className="w-4 h-4" />
              <span>Upload</span>
            </button>
            
            <button
              onClick={createFolder}
              className="flex items-center space-x-1 px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600"
            >
              <Plus className="w-4 h-4" />
              <span>New Folder</span>
            </button>
          </div>
        </div>

        {/* File Area */}
        <div
          className={`flex-1 p-4 ${dragOver ? 'bg-blue-50 dark:bg-blue-900/20 border-2 border-dashed border-blue-300' : ''}`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          {dragOver && (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <Upload className="w-16 h-16 mx-auto text-blue-500 mb-4" />
                <p className="text-lg font-semibold text-blue-600 dark:text-blue-400">Drop files here to upload</p>
              </div>
            </div>
          )}
          
          {!dragOver && (
            <>
              {viewMode === 'list' ? (
                <div className="space-y-1">
                  {filteredFiles.map((file) => (
                    <div
                      key={file.id}
                      className={`flex items-center space-x-3 p-2 rounded cursor-pointer ${
                        isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
                      } ${
                        selectedItems.includes(file.id) 
                          ? isDarkMode ? 'bg-blue-900/30' : 'bg-blue-100' 
                          : ''
                      }`}
                      onClick={() => {
                        if (selectedItems.includes(file.id)) {
                          setSelectedItems(selectedItems.filter(id => id !== file.id));
                        } else {
                          setSelectedItems([...selectedItems, file.id]);
                        }
                      }}
                      onDoubleClick={() => handleItemClick(file)}
                    >
                      {getFileIcon(file)}
                      <div className="flex-1 min-w-0">
                        <div className={`text-sm font-medium ${isDarkMode ? 'text-gray-100' : 'text-gray-900'} truncate`}>
                          {file.name}
                          {file.isReal && <span className="ml-2 text-xs bg-green-100 text-green-800 px-1 rounded">REAL</span>}
                        </div>
                        <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          {file.lastModified.toLocaleDateString()} • {formatFileSize(file.size)}
                        </div>
                      </div>
                      
                      {file.isReal && (
                        <div className="flex items-center space-x-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              downloadFile(file);
                            }}
                            className={`p-1 rounded ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
                            title="Download"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteFile(file.id);
                            }}
                            className={`p-1 rounded ${isDarkMode ? 'hover:bg-red-900' : 'hover:bg-red-200'} text-red-600`}
                            title="Delete"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-6 gap-4">
                  {filteredFiles.map((file) => (
                    <div
                      key={file.id}
                      className={`flex flex-col items-center p-3 rounded hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer ${
                        selectedItems.includes(file.id) ? 'bg-blue-100 dark:bg-blue-900/30' : ''
                      }`}
                      onClick={() => {
                        if (selectedItems.includes(file.id)) {
                          setSelectedItems(selectedItems.filter(id => id !== file.id));
                        } else {
                          setSelectedItems([...selectedItems, file.id]);
                        }
                      }}
                    >
                      <div className="w-12 h-12 flex items-center justify-center mb-2">
                        {getFileIcon(file)}
                      </div>
                      <div className="text-xs text-center">
                        <div className="font-medium text-gray-900 dark:text-gray-100 truncate w-full">
                          {file.name}
                        </div>
                        {file.isReal && (
                          <div className="text-xs bg-green-100 text-green-800 px-1 rounded mt-1">REAL</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {filteredFiles.length === 0 && (
                <div className="flex items-center justify-center h-64">
                  <div className="text-center text-gray-500 dark:text-gray-400">
                    <Folder className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p>No files found</p>
                    <p className="text-sm mt-1">Drag and drop files here or click Upload</p>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Status Bar */}
        <div className="h-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 flex items-center justify-between px-4 text-xs text-gray-600 dark:text-gray-400">
          <span>{filteredFiles.length} items</span>
          <span>{selectedItems.length} selected</span>
        </div>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        onChange={(e) => {
          if (e.target.files) {
            handleFileUpload(e.target.files);
          }
        }}
      />
    </div>
  );
}

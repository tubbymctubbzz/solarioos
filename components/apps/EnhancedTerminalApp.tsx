"use client";

import { useState, useEffect, useRef } from "react";

interface TerminalAppProps {
  windowId: string;
  isDarkMode?: boolean;
}

interface CommandHistory {
  command: string;
  output: string;
  timestamp: Date;
}

export default function EnhancedTerminalApp({ windowId, isDarkMode = false }: TerminalAppProps) {
  const [currentPath, setCurrentPath] = useState("~");
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<CommandHistory[]>([
    {
      command: "",
      output: "Welcome to Solario Terminal v2.0\nType 'help' for available commands.",
      timestamp: new Date()
    }
  ]);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isProcessing, setIsProcessing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  const fileSystem = {
    "~": {
      type: "directory",
      contents: ["Documents", "Downloads", "Desktop", "Pictures", "Music", "Movies", ".bashrc", ".profile", ".solario"]
    },
    "~/Documents": {
      type: "directory", 
      contents: ["resume.pdf", "notes.txt", "projects", "work"]
    },
    "~/Downloads": {
      type: "directory",
      contents: ["installer.dmg", "screenshot.png", "archive.zip"]
    },
    "~/Desktop": {
      type: "directory",
      contents: ["README.md", "todo.txt", "shortcuts.txt"]
    },
    "~/Pictures": {
      type: "directory",
      contents: ["vacation.jpg", "family.png", "screenshots"]
    },
    "~/Music": {
      type: "directory",
      contents: ["playlist.m3u", "favorites", "albums"]
    }
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]);

  const getSystemInfo = () => {
    const userAgent = navigator.userAgent;
    const platform = navigator.platform;
    const language = navigator.language;
    const cores = navigator.hardwareConcurrency || 'Unknown';
    const memory = (navigator as { deviceMemory?: number }).deviceMemory || 'Unknown';
    
    return {
      os: platform,
      browser: userAgent.includes('Chrome') ? 'Chrome' : userAgent.includes('Firefox') ? 'Firefox' : 'Unknown',
      language,
      cores,
      memory: memory !== 'Unknown' ? `${memory} GB` : memory,
      uptime: Math.floor((Date.now() - performance.timeOrigin) / 1000)
    };
  };

  const executeCommand = async (cmd: string): Promise<string> => {
    const parts = cmd.trim().split(' ');
    const command = parts[0].toLowerCase();
    const args = parts.slice(1);

    switch (command) {
      case 'help':
        return `Available commands:
  help          - Show this help message
  ls            - List directory contents
  cd <dir>      - Change directory
  pwd           - Print working directory
  cat <file>    - Display file contents
  mkdir <dir>   - Create directory
  rmdir <dir>   - Remove directory
  touch <file>  - Create empty file
  rm <file>     - Remove file
  cp <src> <dst> - Copy file
  mv <src> <dst> - Move/rename file
  find <name>   - Find files/directories
  grep <text>   - Search for text in files
  ps            - Show running processes
  top           - Show system resources
  whoami        - Show current user
  date          - Show current date/time
  uptime        - Show system uptime
  clear         - Clear terminal
  history       - Show command history
  echo <text>   - Display text
  uname         - Show system information
  df            - Show disk usage
  free          - Show memory usage
  curl <url>    - Fetch URL content
  ping <host>   - Ping a host
  exit          - Close terminal`;

      case 'ls':
        const currentDir = fileSystem[currentPath as keyof typeof fileSystem];
        if (currentDir && currentDir.type === 'directory') {
          const items = currentDir.contents;
          const detailed = args.includes('-l');
          if (detailed) {
            return items.map(item => {
              const isDir = item.endsWith('/') || !item.includes('.');
              const size = isDir ? 'dir' : `${Math.floor(Math.random() * 10000)}B`;
              const date = new Date().toLocaleDateString();
              const perms = isDir ? 'drwxr-xr-x' : '-rw-r--r--';
              return `${perms} 1 user user ${size.padStart(8)} ${date} ${item}`;
            }).join('\n');
          }
          return items.join('  ');
        }
        return 'Directory not found';

      case 'pwd':
        return currentPath;

      case 'cd':
        if (args.length === 0) {
          setCurrentPath('~');
          return '';
        }
        const targetPath = args[0] === '..' ? 
          currentPath.split('/').slice(0, -1).join('/') || '~' :
          args[0].startsWith('/') ? args[0] : 
          currentPath === '~' ? `~/${args[0]}` : `${currentPath}/${args[0]}`;
        
        if (fileSystem[targetPath as keyof typeof fileSystem]) {
          setCurrentPath(targetPath);
          return '';
        }
        return `cd: ${args[0]}: No such file or directory`;

      case 'cat':
        if (args.length === 0) return 'cat: missing file operand';
        const fileName = args[0];
        if (fileName === '.bashrc') return '# Solario Terminal Configuration\nexport PATH=$PATH:/usr/local/bin\nalias ll="ls -la"';
        if (fileName === 'notes.txt') return 'Meeting notes:\n- Discuss project timeline\n- Review requirements\n- Plan next sprint';
        if (fileName === 'README.md') return '# Solario OS\n\nWelcome to the future of computing!\n\n## Features\n- Modern UI\n- Fast performance\n- Secure by design';
        return `cat: ${fileName}: No such file or directory`;

      case 'whoami':
        return 'solario-user';

      case 'date':
        return new Date().toString();

      case 'uptime':
        const info = getSystemInfo();
        return `System uptime: ${Math.floor(info.uptime / 3600)}h ${Math.floor((info.uptime % 3600) / 60)}m ${info.uptime % 60}s`;

      case 'ps':
        return `PID  COMMAND
1234 SolarioOS
1235 Terminal
1236 Finder
1237 Safari
1238 SystemPrefs`;

      case 'top':
        const sysInfo = getSystemInfo();
        return `System Resources:
CPU Cores: ${sysInfo.cores}
Memory: ${sysInfo.memory}
Platform: ${sysInfo.os}
Browser: ${sysInfo.browser}
Language: ${sysInfo.language}
Uptime: ${Math.floor(sysInfo.uptime / 3600)}h ${Math.floor((sysInfo.uptime % 3600) / 60)}m`;

      case 'uname':
        const flags = args.join(' ');
        if (flags.includes('-a')) {
          return 'SolarioOS 2.0.0 WebOS x86_64 Solario Kernel';
        }
        return 'SolarioOS';

      case 'echo':
        return args.join(' ');

      case 'clear':
        setHistory([]);
        return '';

      case 'history':
        return commandHistory.map((cmd, i) => `${i + 1}  ${cmd}`).join('\n');

      case 'mkdir':
        if (args.length === 0) return 'mkdir: missing operand';
        return `Directory '${args[0]}' created`;

      case 'touch':
        if (args.length === 0) return 'touch: missing file operand';
        return `File '${args[0]}' created`;

      case 'rm':
        if (args.length === 0) return 'rm: missing operand';
        return `File '${args[0]}' removed`;

      case 'find':
        if (args.length === 0) return 'find: missing search term';
        const searchTerm = args[0];
        const results = Object.values(fileSystem)
          .flatMap(dir => dir.type === 'directory' ? dir.contents : [])
          .filter(item => item.toLowerCase().includes(searchTerm.toLowerCase()));
        return results.length > 0 ? results.join('\n') : 'No files found';

      case 'df':
        return `Filesystem     1K-blocks    Used Available Use% Mounted on
/dev/sda1       10485760 5242880   5242880  50% /
tmpfs            2097152  102400   1994752   5% /tmp`;

      case 'free':
        // const memInfo = getSystemInfo();
        return `              total        used        free      shared
Mem:        8388608     4194304     4194304           0
Swap:       2097152           0     2097152`;

      case 'ping':
        if (args.length === 0) return 'ping: missing host';
        const host = args[0];
        setIsProcessing(true);
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsProcessing(false);
        return `PING ${host}: 56 data bytes
64 bytes from ${host}: icmp_seq=0 time=12.345 ms
64 bytes from ${host}: icmp_seq=1 time=11.234 ms
64 bytes from ${host}: icmp_seq=2 time=13.456 ms
--- ${host} ping statistics ---
3 packets transmitted, 3 received, 0% packet loss`;

      case 'curl':
        if (args.length === 0) return 'curl: missing URL';
        setIsProcessing(true);
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsProcessing(false);
        return `HTTP/1.1 200 OK
Content-Type: text/html
Content-Length: 1234

<!DOCTYPE html>
<html><head><title>Example</title></head>
<body><h1>Hello from ${args[0]}</h1></body></html>`;

      case 'exit':
        return 'Terminal session ended. Close the window to exit.';

      default:
        return `${command}: command not found`;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isProcessing) return;

    const command = input.trim();
    setCommandHistory(prev => [...prev, command]);
    setHistoryIndex(-1);
    setInput('');
    setIsProcessing(true);

    const output = await executeCommand(command);
    
    setHistory(prev => [...prev, {
      command,
      output,
      timestamp: new Date()
    }]);
    setIsProcessing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyIndex < commandHistory.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setInput(commandHistory[commandHistory.length - 1 - newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInput(commandHistory[commandHistory.length - 1 - newIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInput('');
      }
    }
  };

  return (
    <div className={`h-full font-mono flex flex-col ${
      isDarkMode ? 'bg-black text-white' : 'bg-gray-100 text-gray-900'
    }`}>
      <div ref={terminalRef} className="flex-1 overflow-y-auto p-4 space-y-2">
        {history.map((entry, index) => (
          <div key={index} className="space-y-1">
            {entry.command && (
              <div className="flex items-center">
                <span className={isDarkMode ? 'text-blue-400' : 'text-blue-600'}>solario-user@solarios</span>
                <span>:</span>
                <span className={isDarkMode ? 'text-purple-400' : 'text-purple-600'}>{currentPath}</span>
                <span>$ </span>
                <span className={isDarkMode ? 'text-green-400' : 'text-green-600'}>{entry.command}</span>
              </div>
            )}
            {entry.output && (
              <pre className={`whitespace-pre-wrap pl-4 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                {entry.output}
              </pre>
            )}
          </div>
        ))}
        
        {isProcessing && (
          <div className="flex items-center">
            <span className={isDarkMode ? 'text-blue-400' : 'text-blue-600'}>solario-user@solarios</span>
            <span>:</span>
            <span className={isDarkMode ? 'text-purple-400' : 'text-purple-600'}>{currentPath}</span>
            <span>$ </span>
            <span className={isDarkMode ? 'text-green-400' : 'text-green-600'}>{input}</span>
            <div className={`w-2 h-2 rounded-full animate-pulse ml-2 ${
              isDarkMode ? 'bg-green-400' : 'bg-green-600'
            }`}></div>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className={`p-4 border-t ${
        isDarkMode ? 'border-gray-800' : 'border-gray-300'
      }`}>
        <div className="flex items-center">
          <span className={isDarkMode ? 'text-blue-400' : 'text-blue-600'}>solario-user@solarios</span>
          <span>:</span>
          <span className={isDarkMode ? 'text-purple-400' : 'text-purple-600'}>{currentPath}</span>
          <span>$ </span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className={`flex-1 bg-transparent outline-none ml-1 ${
              isDarkMode ? 'text-green-400' : 'text-green-600'
            }`}
            disabled={isProcessing}
            autoComplete="off"
            spellCheck={false}
          />
          {isProcessing && (
            <div className={`w-2 h-2 rounded-full animate-pulse ml-2 ${
              isDarkMode ? 'bg-green-400' : 'bg-green-600'
            }`}></div>
          )}
        </div>
      </form>
    </div>
  );
}

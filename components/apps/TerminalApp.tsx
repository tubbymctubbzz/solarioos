"use client";

import { useState, useEffect, useRef } from "react";

interface TerminalAppProps {
  windowId: string;
}

interface CommandHistory {
  command: string;
  output: string;
  timestamp: Date;
}

export default function TerminalApp({ windowId }: TerminalAppProps) {
  const [currentPath, setCurrentPath] = useState("~");
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<CommandHistory[]>([
    {
      command: "",
      output: "Welcome to Solario Terminal\nType 'help' for available commands.",
      timestamp: new Date()
    }
  ]);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  const fileSystem = {
    "~": {
      type: "directory",
      contents: ["Documents", "Downloads", "Desktop", "Pictures", "Music", "Movies", ".bashrc", ".profile"]
    },
    "~/Documents": {
      type: "directory", 
      contents: ["resume.pdf", "notes.txt", "projects"]
    },
    "~/Downloads": {
      type: "directory",
      contents: ["installer.dmg", "screenshot.png"]
    },
    "~/Desktop": {
      type: "directory",
      contents: ["README.md", "todo.txt"]
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

  const executeCommand = (command: string) => {
    const trimmedCommand = command.trim();
    if (!trimmedCommand) return;

    // Add to command history
    setCommandHistory(prev => [...prev, trimmedCommand]);
    setHistoryIndex(-1);

    const args = trimmedCommand.split(" ");
    const cmd = args[0].toLowerCase();
    let output = "";

    switch (cmd) {
      case "help":
        output = `Available commands:
  help          - Show this help message
  ls            - List directory contents
  pwd           - Print working directory
  cd <dir>      - Change directory
  mkdir <dir>   - Create directory
  touch <file>  - Create empty file
  cat <file>    - Display file contents
  echo <text>   - Display text
  date          - Show current date and time
  whoami        - Show current user
  uname         - Show system information
  clear         - Clear terminal
  history       - Show command history
  ps            - Show running processes
  top           - Show system processes
  df            - Show disk usage
  free          - Show memory usage
  uptime        - Show system uptime`;
        break;

      case "ls":
        const currentDir = fileSystem[currentPath as keyof typeof fileSystem];
        if (currentDir && currentDir.type === "directory") {
          output = currentDir.contents.join("  ");
        } else {
          output = "Directory not found";
        }
        break;

      case "pwd":
        output = currentPath === "~" ? "/Users/solario" : currentPath.replace("~", "/Users/solario");
        break;

      case "cd":
        if (args.length < 2) {
          setCurrentPath("~");
          output = "";
        } else {
          const targetDir = args[1];
          if (targetDir === "..") {
            if (currentPath !== "~") {
              const pathParts = currentPath.split("/");
              pathParts.pop();
              setCurrentPath(pathParts.join("/") || "~");
            }
            output = "";
          } else if (targetDir === "~" || targetDir === "/") {
            setCurrentPath("~");
            output = "";
          } else {
            const newPath = currentPath === "~" ? `~/${targetDir}` : `${currentPath}/${targetDir}`;
            const targetDirObj = fileSystem[newPath as keyof typeof fileSystem];
            if (targetDirObj && targetDirObj.type === "directory") {
              setCurrentPath(newPath);
              output = "";
            } else {
              output = `cd: ${targetDir}: No such file or directory`;
            }
          }
        }
        break;

      case "mkdir":
        if (args.length < 2) {
          output = "mkdir: missing operand";
        } else {
          output = `Directory '${args[1]}' created`;
        }
        break;

      case "touch":
        if (args.length < 2) {
          output = "touch: missing file operand";
        } else {
          output = `File '${args[1]}' created`;
        }
        break;

      case "cat":
        if (args.length < 2) {
          output = "cat: missing file operand";
        } else {
          const filename = args[1];
          if (filename === "README.md") {
            output = `# Solario OS
Welcome to Solario OS - A modern desktop operating system built with React and TypeScript.

## Features
- Beautiful macOS-inspired interface
- Full window management system
- Built-in applications
- Terminal with command support
- And much more!`;
          } else if (filename === "notes.txt") {
            output = `Personal Notes
=============
- Finish Solario OS development
- Add more applications
- Improve performance
- Write documentation`;
          } else if (filename === ".bashrc") {
            output = `# Solario Terminal Configuration
export PS1="\\u@solario:\\w$ "
alias ll="ls -la"
alias la="ls -A"
alias l="ls -CF"`;
          } else {
            output = `cat: ${filename}: No such file or directory`;
          }
        }
        break;

      case "echo":
        output = args.slice(1).join(" ");
        break;

      case "date":
        output = new Date().toString();
        break;

      case "whoami":
        output = "solario";
        break;

      case "uname":
        if (args[1] === "-a") {
          output = "Solario 1.0.0 Darwin Kernel Version 21.0.0 x86_64";
        } else {
          output = "Solario";
        }
        break;

      case "clear":
        setHistory([]);
        setInput("");
        return;

      case "history":
        output = commandHistory.map((cmd, index) => `${index + 1}  ${cmd}`).join("\n");
        break;

      case "ps":
        output = `  PID TTY           TIME CMD
    1 console    0:01.23 /sbin/launchd
  123 ttys000    0:00.45 -bash
  456 ttys000    0:00.12 finder
  789 ttys000    0:00.34 safari
 1011 ttys000    0:00.67 terminal`;
        break;

      case "top":
        output = `Processes: 156 total, 3 running, 153 sleeping
Load Avg: 1.23, 1.45, 1.67
CPU usage: 12.3% user, 5.6% sys, 82.1% idle
Memory: 8.00GB used, 7.23GB wired, 768MB unused

PID   COMMAND      %CPU  %MEM
  1   kernel_task   2.1   0.0
123   WindowServer  8.4   2.3
456   Finder        1.2   1.8
789   Safari       15.6   8.9`;
        break;

      case "df":
        output = `Filesystem     1K-blocks      Used Available Use% Mounted on
/dev/disk1s1   488245288 245678432 241078344  51% /
/dev/disk1s2     1048576    524288    524288  50% /System/Volumes/VM
/dev/disk1s3     1048576    262144    786432  25% /System/Volumes/Preboot`;
        break;

      case "free":
        output = `              total        used        free      shared  buff/cache   available
Mem:        8388608     6291456     1048576      524288      786432     1572864
Swap:       2097152      262144     1835008`;
        break;

      case "uptime":
        output = "up 2 days, 14:32, 1 user, load averages: 1.23 1.45 1.67";
        break;

      default:
        output = `zsh: command not found: ${cmd}`;
        break;
    }

    setHistory(prev => [...prev, {
      command: trimmedCommand,
      output,
      timestamp: new Date()
    }]);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      executeCommand(input);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setInput(commandHistory[newIndex]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex !== -1) {
        const newIndex = historyIndex + 1;
        if (newIndex >= commandHistory.length) {
          setHistoryIndex(-1);
          setInput("");
        } else {
          setHistoryIndex(newIndex);
          setInput(commandHistory[newIndex]);
        }
      }
    }
  };

  const getPrompt = () => {
    const user = "solario";
    const host = "solario";
    const path = currentPath === "~" ? "~" : currentPath.split("/").pop() || "~";
    return `${user}@${host}:${path}$`;
  };

  return (
    <div className="h-full bg-black text-green-400 font-mono text-sm overflow-hidden flex flex-col">
      <div 
        ref={terminalRef}
        className="flex-1 overflow-y-auto p-4 space-y-1"
        onClick={() => inputRef.current?.focus()}
      >
        {history.map((entry, index) => (
          <div key={index}>
            {entry.command && (
              <div className="flex">
                <span className="text-blue-400">{getPrompt()}</span>
                <span className="ml-2">{entry.command}</span>
              </div>
            )}
            {entry.output && (
              <div className="whitespace-pre-wrap text-gray-300 mb-2">
                {entry.output}
              </div>
            )}
          </div>
        ))}
        
        {/* Current input line */}
        <div className="flex items-center">
          <span className="text-blue-400">{getPrompt()}</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="ml-2 bg-transparent outline-none flex-1 text-green-400 caret-green-400"
            autoComplete="off"
            spellCheck={false}
          />
        </div>
      </div>
    </div>
  );
}

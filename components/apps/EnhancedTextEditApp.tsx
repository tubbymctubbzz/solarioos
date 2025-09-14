"use client";

import { useState, useEffect, useRef } from "react";
import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Save,
  FolderOpen,
  Download,
  Search,
  Undo,
  Redo,
  Copy,
  Scissors,
  Clipboard,
  Code,
  FileText,
  Palette,
  Settings,
  ZoomIn,
  ZoomOut,
  Eye,
  EyeOff,
  Moon,
  Sun,
  Type,
  Hash,
  List,
  Quote,
  Link,
  Image,
  Table
} from "lucide-react";

interface SolarioPlusPlusProps {
  windowId: string;
  isDarkMode?: boolean;
  initialContent?: string;
  initialFileName?: string;
}

export default function SolarioPlusPlus({ windowId, isDarkMode = false, initialContent, initialFileName }: SolarioPlusPlusProps) {
  const [content, setContent] = useState(initialContent || "# Welcome to Solario++\n\n**The most advanced text editor for Solario OS**\n\n## Features:\n- 🎨 **Beautiful UI** with modern design\n- 🌙 **Dark/Light themes** with custom color schemes\n- 📝 **Markdown support** with live preview\n- 🔍 **Advanced search** with regex support\n- 📊 **Real-time statistics** and word count\n- 💾 **Auto-save** and session recovery\n- 🎯 **Focus mode** for distraction-free writing\n- 📱 **Responsive design** that adapts to any screen\n\n---\n\n### Getting Started\nStart typing to experience the power of Solario++. Use the toolbar above for formatting options, or try these markdown shortcuts:\n\n- `**bold text**` for **bold text**\n- `*italic text*` for *italic text*\n- `# Heading` for headings\n- `> Quote` for quotes\n- `- List item` for lists\n\nEnjoy writing! ✨");
  const [fileName, setFileName] = useState(initialFileName || "Welcome to Solario++");
  const [isModified, setIsModified] = useState(false);
  const [fontSize, setFontSize] = useState(16);
  const [fontFamily, setFontFamily] = useState("Inter, system-ui, sans-serif");
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [textAlign, setTextAlign] = useState("left");
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [lineCount, setLineCount] = useState(0);
  const [autoSave, setAutoSave] = useState(true);
  const [findText, setFindText] = useState("");
  const [replaceText, setReplaceText] = useState("");
  const [showFindReplace, setShowFindReplace] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [editorTheme, setEditorTheme] = useState("default");
  const [showPreview, setShowPreview] = useState(false);
  const [focusMode, setFocusMode] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [lineNumbers, setLineNumbers] = useState(true);
  const [wordWrap, setWordWrap] = useState(true);
  const [typewriterMode, setTypewriterMode] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Update word count and statistics
  useEffect(() => {
    const words = content.trim() ? content.trim().split(/\s+/).length : 0;
    const chars = content.length;
    const lines = content.split('\n').length;

    setWordCount(words);
    setCharCount(chars);
    setLineCount(lines);
  }, [content]);

  // Auto-save functionality
  useEffect(() => {
    if (autoSave && isModified) {
      const timer = setTimeout(() => {
        handleSave();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [content, autoSave, isModified]);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);
    setIsModified(true);

    // Add to history for undo/redo
    if (historyIndex < history.length - 1) {
      setHistory(prev => [...prev.slice(0, historyIndex + 1), newContent]);
    } else {
      setHistory(prev => [...prev, newContent]);
    }
    setHistoryIndex(prev => prev + 1);
  };

  const applyFormatting = (format: string) => {
    if (!textareaRef.current) return;

    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);

    if (selectedText) {
      let formattedText = selectedText;

      switch (format) {
        case 'bold':
          formattedText = `**${selectedText}**`;
          break;
        case 'italic':
          formattedText = `*${selectedText}*`;
          break;
        case 'underline':
          formattedText = `<u>${selectedText}</u>`;
          break;
        case 'heading':
          formattedText = `# ${selectedText}`;
          break;
        case 'quote':
          formattedText = `> ${selectedText}`;
          break;
        case 'list':
          formattedText = `- ${selectedText}`;
          break;
      }

      const newContent = content.substring(0, start) + formattedText + content.substring(end);
      setContent(newContent);
      setIsModified(true);

      // Restore cursor position
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + formattedText.length, start + formattedText.length);
      }, 0);
    }
  };

  const handleSave = () => {
    console.log("Saving document:", fileName);
    setIsModified(false);

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${fileName}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleOpen = () => {
    fileInputRef.current?.click();
  };

  const handleFileLoad = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        setContent(text);
        setFileName(file.name.replace(/\.[^/.]+$/, ""));
        setIsModified(false);
        setHistory([text]);
        setHistoryIndex(0);
      };
      reader.readAsText(file);
    }
  };

  const handleExport = () => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${fileName}_export.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(prev => prev - 1);
      setContent(history[historyIndex - 1]);
      setIsModified(true);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(prev => prev + 1);
      setContent(history[historyIndex + 1]);
      setIsModified(true);
    }
  };

  const handleCopy = async () => {
    if (textareaRef.current) {
      const selectedText = textareaRef.current.value.substring(
        textareaRef.current.selectionStart,
        textareaRef.current.selectionEnd
      );
      if (selectedText) {
        await navigator.clipboard.writeText(selectedText);
      }
    }
  };

  const handleCut = async () => {
    if (textareaRef.current) {
      const start = textareaRef.current.selectionStart;
      const end = textareaRef.current.selectionEnd;
      const selectedText = textareaRef.current.value.substring(start, end);

      if (selectedText) {
        await navigator.clipboard.writeText(selectedText);
        const newContent = content.substring(0, start) + content.substring(end);
        setContent(newContent);
        setIsModified(true);
      }
    }
  };

  const renderMarkdownPreview = (text: string) => {
    let html = text;
    
    // Escape HTML entities first
    html = html.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    
    // Code blocks (triple backticks) - handle before other formatting
    html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
      return `<pre class="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg my-4 overflow-x-auto border border-gray-200 dark:border-gray-700"><code class="text-sm font-mono text-gray-800 dark:text-gray-200 whitespace-pre">${code.trim()}</code></pre>`;
    });
    
    // Headers (must be at start of line)
    html = html.replace(/^#### (.*$)/gim, '<h4 class="text-base font-medium mb-2 text-gray-800 dark:text-gray-200 mt-4">$1</h4>');
    html = html.replace(/^### (.*$)/gim, '<h3 class="text-lg font-medium mb-2 text-gray-800 dark:text-gray-200 mt-4">$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100 mt-6">$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100 mt-8 pb-2 border-b border-gray-200 dark:border-gray-700">$1</h1>');
    
    // Bold and italic (avoid conflicts with each other)
    html = html.replace(/\*\*\*(.*?)\*\*\*/g, '<strong class="font-bold italic text-gray-900 dark:text-gray-100">$1</strong>');
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-gray-900 dark:text-gray-100">$1</strong>');
    html = html.replace(/(?<!\*)\*([^*\n]+)\*(?!\*)/g, '<em class="italic text-gray-800 dark:text-gray-200">$1</em>');
    
    // Strikethrough
    html = html.replace(/~~(.*?)~~/g, '<del class="line-through text-gray-600 dark:text-gray-400">$1</del>');
    
    // Inline code (single backticks)
    html = html.replace(/`([^`\n]+)`/g, '<code class="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm font-mono text-red-600 dark:text-red-400 border border-gray-200 dark:border-gray-700">$1</code>');
    
    // Links
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-600 dark:text-blue-400 underline hover:text-blue-800 dark:hover:text-blue-300 transition-colors">$1</a>');
    
    // Images
    html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="max-w-full h-auto rounded-lg shadow-md my-4 border border-gray-200 dark:border-gray-700" />');
    
    // Blockquotes (handle multi-line)
    html = html.replace(/^> (.*$)/gim, '<blockquote class="border-l-4 border-blue-500 pl-4 italic text-gray-600 dark:text-gray-400 my-4 bg-blue-50 dark:bg-blue-900/20 py-3 rounded-r">$1</blockquote>');
    
    // Unordered lists
    html = html.replace(/^[\s]*[-*+] (.*$)/gim, '<li class="ml-6 text-gray-700 dark:text-gray-300 mb-1 list-disc">$1</li>');
    
    // Ordered lists
    html = html.replace(/^[\s]*\d+\. (.*$)/gim, '<li class="ml-6 text-gray-700 dark:text-gray-300 mb-1 list-decimal">$1</li>');
    
    // Wrap consecutive list items in ul/ol tags
    html = html.replace(/(<li class="[^"]*list-disc[^"]*">[^<]*<\/li>\s*)+/g, '<ul class="my-4">$&</ul>');
    html = html.replace(/(<li class="[^"]*list-decimal[^"]*">[^<]*<\/li>\s*)+/g, '<ol class="my-4">$&</ol>');
    
    // Horizontal rules
    html = html.replace(/^---+$/gim, '<hr class="border-gray-300 dark:border-gray-600 my-6 border-t-2">');
    
    // Tables (basic support)
    const tableRegex = /^\|(.+)\|\s*\n\|[-\s|:]+\|\s*\n((?:\|.+\|\s*\n?)*)/gm;
    html = html.replace(tableRegex, (match, header, rows) => {
      const headerCells = header.split('|').map((cell: string) => cell.trim()).filter((cell: string) => cell);
      const headerRow = headerCells.map((cell: string) => `<th class="px-4 py-2 text-left font-semibold border-b border-gray-200 dark:border-gray-700">${cell}</th>`).join('');
      
      const bodyRows = rows.trim().split('\n').map((row: string) => {
        const cells = row.split('|').map((cell: string) => cell.trim()).filter((cell: string) => cell);
        return '<tr>' + cells.map((cell: string) => `<td class="px-4 py-2 border-b border-gray-100 dark:border-gray-800">${cell}</td>`).join('') + '</tr>';
      }).join('');
      
      return `<table class="w-full my-4 border-collapse border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"><thead class="bg-gray-50 dark:bg-gray-800"><tr>${headerRow}</tr></thead><tbody>${bodyRows}</tbody></table>`;
    });
    
    // Line breaks and paragraphs
    html = html.replace(/\n\s*\n/g, '</p><p class="mb-4 text-gray-700 dark:text-gray-300 leading-relaxed">');
    html = html.replace(/\n/g, '<br>');
    
    // Wrap in paragraph tags if content doesn't start with a block element
    if (!html.match(/^<(h[1-6]|div|p|ul|ol|blockquote|pre|table|hr)/)) {
      html = '<p class="mb-4 text-gray-700 dark:text-gray-300 leading-relaxed">' + html + '</p>';
    }
    
    // Clean up empty paragraphs
    html = html.replace(/<p[^>]*><\/p>/g, '');
    
    return html;
  };

  const handlePaste = async () => {
    try {
      const clipboardText = await navigator.clipboard.readText();
      if (textareaRef.current && clipboardText) {
        const start = textareaRef.current.selectionStart;
        const end = textareaRef.current.selectionEnd;
        const newContent = content.substring(0, start) + clipboardText + content.substring(end);
        setContent(newContent);
        setIsModified(true);
      }
    } catch (error) {
      console.warn("Failed to paste from clipboard");
    }
  };

  const getTextStyle = () => ({
    fontSize: `${fontSize}px`,
    fontFamily,
    fontWeight: isBold ? 'bold' : 'normal',
    fontStyle: isItalic ? 'italic' : 'normal',
    textDecoration: isUnderline ? 'underline' : 'none',
    textAlign: textAlign as 'left' | 'center' | 'right'
  });

  const getEditorTheme = () => {
    const themes = {
      default: {
        bg: isDarkMode ? 'bg-gray-900' : 'bg-white',
        text: isDarkMode ? 'text-gray-100' : 'text-gray-900',
        accent: 'text-blue-500'
      },
      ocean: {
        bg: isDarkMode ? 'bg-slate-900' : 'bg-blue-50',
        text: isDarkMode ? 'text-slate-100' : 'text-slate-900',
        accent: 'text-cyan-500'
      },
      forest: {
        bg: isDarkMode ? 'bg-green-900' : 'bg-green-50',
        text: isDarkMode ? 'text-green-100' : 'text-green-900',
        accent: 'text-emerald-500'
      },
      sunset: {
        bg: isDarkMode ? 'bg-orange-900' : 'bg-orange-50',
        text: isDarkMode ? 'text-orange-100' : 'text-orange-900',
        accent: 'text-amber-500'
      }
    };
    return themes[editorTheme as keyof typeof themes] || themes.default;
  };

  const theme = getEditorTheme();

  return (
    <div className={`h-full flex flex-col ${theme.bg} transition-all duration-300`}>
      {/* Header with Solario++ Branding */}
      <div className={`border-b px-4 py-3 ${
        isDarkMode
          ? 'border-gray-700 bg-gray-800'
          : 'border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Code className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className={`text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent`}>
                  Solario++
                </h1>
                <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Text Editor
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setFocusMode(!focusMode)}
              className={`p-2 rounded-lg transition-all ${
                focusMode
                  ? 'bg-blue-100 text-blue-700 shadow-md'
                  : (isDarkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-200 text-gray-600')
              }`}
              title="Focus Mode"
            >
              {focusMode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setShowPreview(!showPreview)}
              className={`p-2 rounded-lg transition-all ${
                showPreview
                  ? 'bg-green-100 text-green-700 shadow-md'
                  : (isDarkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-200 text-gray-600')
              }`}
              title="Preview Mode"
            >
              <FileText className="w-4 h-4" />
            </button>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className={`p-2 rounded-lg transition-all ${
                showSettings
                  ? 'bg-purple-100 text-purple-700 shadow-md'
                  : (isDarkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-200 text-gray-600')
              }`}
              title="Settings"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced Toolbar */}
      <div className={`border-b p-3 ${
        isDarkMode
          ? 'border-gray-700 bg-gray-800/50'
          : 'border-gray-200 bg-white/80'
      } backdrop-blur-sm ${focusMode ? 'hidden' : ''}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {/* Quick Actions */}
            <div className="flex items-center space-x-1 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg p-1">
              <button
                onClick={handleSave}
                className="p-2 rounded-md bg-blue-500 hover:bg-blue-600 text-white transition-all shadow-sm"
                title="Save (Ctrl+S)"
              >
                <Save className="w-4 h-4" />
              </button>
              <button
                onClick={handleOpen}
                className={`p-2 rounded-md transition-all ${
                  isDarkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-200 text-gray-700'
                }`}
                title="Open File"
              >
                <FolderOpen className="w-4 h-4" />
              </button>
              <button
                onClick={handleExport}
                className={`p-2 rounded-md transition-all ${
                  isDarkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-200 text-gray-700'
                }`}
                title="Export"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>

            {/* Markdown Tools */}
            <div className="flex items-center space-x-1 bg-gradient-to-r from-green-500/10 to-teal-500/10 rounded-lg p-1">
              <button
                onClick={() => applyFormatting('heading')}
                className={`p-2 rounded-lg transition-all ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-white hover:bg-gray-50 text-gray-700'} shadow-sm`}
                title="Heading"
              >
                <Hash className="w-4 h-4" />
              </button>
              <button
                onClick={() => applyFormatting('quote')}
                className={`p-2 rounded-lg transition-all ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-white hover:bg-gray-50 text-gray-700'} shadow-sm`}
                title="Quote"
              >
                <Quote className="w-4 h-4" />
              </button>
              <button
                onClick={() => applyFormatting('list')}
                className={`p-2 rounded-lg transition-all ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-white hover:bg-gray-50 text-gray-700'} shadow-sm`}
                title="List"
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            {/* Formatting Tools */}
            <div className="flex items-center space-x-1 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg p-1">
              <button
                onClick={() => applyFormatting('bold')}
                className={`p-2 rounded-lg transition-all ${
                  isBold
                    ? 'bg-purple-500 text-white shadow-lg'
                    : `${isDarkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-white hover:bg-gray-50 text-gray-700'} shadow-sm`
                }`}
                title="Bold"
              >
                <Bold className="w-4 h-4" />
              </button>
              <button
                onClick={() => applyFormatting('italic')}
                className={`p-2 rounded-lg transition-all ${
                  isItalic
                    ? 'bg-purple-500 text-white shadow-lg'
                    : `${isDarkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-white hover:bg-gray-50 text-gray-700'} shadow-sm`
                }`}
                title="Italic"
              >
                <Italic className="w-4 h-4" />
              </button>
              <button
                onClick={() => applyFormatting('underline')}
                className={`p-2 rounded-lg transition-all ${
                  isUnderline
                    ? 'bg-purple-500 text-white shadow-lg'
                    : `${isDarkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-white hover:bg-gray-50 text-gray-700'} shadow-sm`
                }`}
                title="Underline"
              >
                <Underline className="w-4 h-4" />
              </button>
            </div>

            {/* Markdown Tools */}
            <div className="flex items-center space-x-1 bg-gradient-to-r from-green-500/10 to-teal-500/10 rounded-lg p-1">
              <button
                onClick={() => {
                  const selection = textareaRef.current?.value.substring(
                    textareaRef.current.selectionStart,
                    textareaRef.current.selectionEnd
                  );
                  if (selection) {
                    const newContent = content.replace(selection, `# ${selection}`);
                    setContent(newContent);
                  }
                }}
                className={`p-2 rounded-md transition-all ${
                  isDarkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-200 text-gray-700'
                }`}
                title="Heading"
              >
                <Hash className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  const selection = textareaRef.current?.value.substring(
                    textareaRef.current.selectionStart,
                    textareaRef.current.selectionEnd
                  );
                  if (selection) {
                    const newContent = content.replace(selection, `> ${selection}`);
                    setContent(newContent);
                  }
                }}
                className={`p-2 rounded-md transition-all ${
                  isDarkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-200 text-gray-700'
                }`}
                title="Quote"
              >
                <Quote className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  const selection = textareaRef.current?.value.substring(
                    textareaRef.current.selectionStart,
                    textareaRef.current.selectionEnd
                  );
                  if (selection) {
                    const newContent = content.replace(selection, `- ${selection}`);
                    setContent(newContent);
                  }
                }}
                className={`p-2 rounded-md transition-all ${
                  isDarkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-200 text-gray-700'
                }`}
                title="List"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Theme Selector */}
            <select
              value={editorTheme}
              onChange={(e) => setEditorTheme(e.target.value)}
              className={`px-3 py-1 text-sm border rounded-lg ${
                isDarkMode
                  ? 'border-gray-600 bg-gray-700 text-white'
                  : 'border-gray-300 bg-white'
              }`}
            >
              <option value="default">Default</option>
              <option value="ocean">Ocean</option>
              <option value="forest">Forest</option>
              <option value="sunset">Sunset</option>
            </select>

            {/* Font Size Controls */}
            <div className="flex items-center space-x-1">
              <button
                onClick={() => setFontSize(Math.max(8, fontSize - 2))}
                className={`p-1 rounded transition-all ${
                  isDarkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-200 text-gray-700'
                }`}
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className={`text-sm px-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {fontSize}px
              </span>
              <button
                onClick={() => setFontSize(Math.min(72, fontSize + 2))}
                className={`p-1 rounded transition-all ${
                  isDarkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-200 text-gray-700'
                }`}
              >
                <ZoomIn className="w-4 h-4" />
              </button>
            </div>

            {/* Search */}
            <button
              onClick={() => setShowFindReplace(!showFindReplace)}
              className={`p-2 rounded-lg transition-all ${
                showFindReplace
                  ? 'bg-amber-500 text-white shadow-sm'
                  : (isDarkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-200 text-gray-700')
              }`}
              title="Find & Replace"
            >
              <Search className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Find & Replace Panel */}
        {showFindReplace && (
          <div className={`border-t p-3 mt-2 ${
            isDarkMode
              ? 'border-gray-700 bg-gray-800'
              : 'border-gray-200 bg-gray-50'
          }`}>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                placeholder="Find..."
                value={findText}
                onChange={(e) => setFindText(e.target.value)}
                className={`flex-1 px-3 py-1 text-sm border rounded ${
                  isDarkMode
                    ? 'border-gray-600 bg-gray-700 text-white'
                    : 'border-gray-300 bg-white'
                }`}
              />
              <input
                type="text"
                placeholder="Replace..."
                value={replaceText}
                onChange={(e) => setReplaceText(e.target.value)}
                className={`flex-1 px-3 py-1 text-sm border rounded ${
                  isDarkMode
                    ? 'border-gray-600 bg-gray-700 text-white'
                    : 'border-gray-300 bg-white'
                }`}
              />
              <button
                onClick={() => {
                  if (findText) {
                    const newContent = content.replace(new RegExp(findText, 'g'), replaceText);
                    setContent(newContent);
                    setIsModified(true);
                  }
                }}
                className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                Replace All
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Main Editor Area */}
      <div className="flex-1 flex">
        {/* Editor */}
        <div className={`flex-1 flex flex-col ${showPreview ? 'w-1/2' : 'w-full'}`}>
          {/* Line Numbers & Editor */}
          <div className="flex-1 flex">
            {lineNumbers && !focusMode && (
              <div className={`w-12 p-4 text-right text-sm border-r ${
                isDarkMode
                  ? 'bg-gray-800/50 border-gray-700 text-gray-500'
                  : 'bg-gray-50/50 border-gray-200 text-gray-400'
              }`}>
                {content.split('\n').map((_, index) => (
                  <div key={index} className="leading-6">
                    {index + 1}
                  </div>
                ))}
              </div>
            )}

            <textarea
              ref={textareaRef}
              value={content}
              onChange={handleContentChange}
              className={`flex-1 p-6 resize-none outline-none border-none ${theme.bg} ${theme.text} leading-relaxed transition-all duration-300 ${
                typewriterMode ? 'font-mono' : ''
              } ${focusMode ? 'p-12' : ''}`}
              style={{
                ...getTextStyle(),
                lineHeight: '1.8',
                letterSpacing: '0.01em'
              }}
              placeholder="Start writing something amazing..."
              spellCheck={true}
            />
          </div>
        </div>

        {/* Preview Panel */}
        {showPreview && (
          <div className={`w-1/2 border-l ${
            isDarkMode ? 'border-gray-700' : 'border-gray-200'
          }`}>
            <div className={`h-full overflow-y-auto p-6 ${theme.bg} ${theme.text}`}>
              <div className="prose prose-lg max-w-none">
                <div dangerouslySetInnerHTML={{
                  __html: renderMarkdownPreview(content)
                }} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className={`border-t p-4 ${
          isDarkMode
            ? 'border-gray-700 bg-gray-800/50'
            : 'border-gray-200 bg-gray-50/50'
        }`}>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <h4 className={`font-semibold mb-2 ${theme.text}`}>Editor</h4>
              <div className="space-y-2">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={lineNumbers}
                    onChange={(e) => setLineNumbers(e.target.checked)}
                    className="rounded"
                  />
                  <span className={`text-sm ${theme.text}`}>Line Numbers</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={wordWrap}
                    onChange={(e) => setWordWrap(e.target.checked)}
                    className="rounded"
                  />
                  <span className={`text-sm ${theme.text}`}>Word Wrap</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={typewriterMode}
                    onChange={(e) => setTypewriterMode(e.target.checked)}
                    className="rounded"
                  />
                  <span className={`text-sm ${theme.text}`}>Typewriter Mode</span>
                </label>
              </div>
            </div>

            <div>
              <h4 className={`font-semibold mb-2 ${theme.text}`}>Font</h4>
              <select
                value={fontFamily}
                onChange={(e) => setFontFamily(e.target.value)}
                className={`w-full px-3 py-1 text-sm border rounded ${
                  isDarkMode
                    ? 'border-gray-600 bg-gray-700 text-white'
                    : 'border-gray-300 bg-white'
                }`}
              >
                <option value="Inter, system-ui, sans-serif">Inter</option>
                <option value="Georgia, serif">Georgia</option>
                <option value="'Courier New', monospace">Courier New</option>
                <option value="'Times New Roman', serif">Times New Roman</option>
                <option value="'Helvetica Neue', sans-serif">Helvetica</option>
              </select>
            </div>

            <div>
              <h4 className={`font-semibold mb-2 ${theme.text}`}>Preferences</h4>
              <div className="space-y-2">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={autoSave}
                    onChange={(e) => setAutoSave(e.target.checked)}
                    className="rounded"
                  />
                  <span className={`text-sm ${theme.text}`}>Auto-save</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Status Bar */}
      <div className={`border-t px-6 py-3 ${
        isDarkMode
          ? 'border-gray-700 bg-gray-800/80'
          : 'border-gray-200 bg-white/80'
      } backdrop-blur-sm ${focusMode ? 'hidden' : ''}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${isModified ? 'bg-amber-500' : 'bg-green-500'}`}></div>
              <span className={`text-sm font-medium ${theme.text}`}>
                {fileName}{isModified ? ' (Modified)' : ' (Saved)'}
              </span>
            </div>

            <div className="flex items-center space-x-4 text-sm">
              <span className={`${theme.accent} font-medium`}>
                📝 {wordCount} words
              </span>
              <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                📄 {lineCount} lines
              </span>
              <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                🔤 {charCount} chars
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className={`text-xs px-2 py-1 rounded-full ${
              isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
            }`}>
              Theme: {editorTheme}
            </div>
            <div className={`text-xs px-2 py-1 rounded-full ${
              isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
            }`}>
              {fontSize}px
            </div>
            {autoSave && (
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-green-600">Auto-save</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".txt,.md,.rtf"
        onChange={handleFileLoad}
        className="hidden"
      />
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, Save, FolderOpen, FileText, Type } from "lucide-react";

interface TextEditAppProps {
  windowId: string;
}

export default function TextEditApp({ windowId }: TextEditAppProps) {
  const [content, setContent] = useState("Welcome to TextEdit\n\nThis is a rich text editor for Solario OS. You can format text, change fonts, and save your documents.\n\nStart typing to create your document...");
  const [fileName, setFileName] = useState("Untitled");
  const [isModified, setIsModified] = useState(false);
  const [fontSize, setFontSize] = useState(14);
  const [fontFamily, setFontFamily] = useState("system-ui");
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [textAlign, setTextAlign] = useState("left");
  const [wordCount, setWordCount] = useState(0);

  useEffect(() => {
    // Update word count
    const words = content.trim().split(/\s+/).filter(word => word.length > 0);
    setWordCount(words.length);
  }, [content]);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    setIsModified(true);
  };

  const handleSave = () => {
    // Simulate saving
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${fileName}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setIsModified(false);
  };

  const handleOpen = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.txt,.md,.rtf';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const text = e.target?.result as string;
          setContent(text);
          setFileName(file.name.replace(/\.[^/.]+$/, ""));
          setIsModified(false);
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const handleNew = () => {
    if (isModified) {
      const save = confirm("Do you want to save changes to your document?");
      if (save) {
        handleSave();
      }
    }
    setContent("");
    setFileName("Untitled");
    setIsModified(false);
  };

  const getTextStyle = () => ({
    fontSize: `${fontSize}px`,
    fontFamily,
    fontWeight: isBold ? 'bold' : 'normal',
    fontStyle: isItalic ? 'italic' : 'normal',
    textDecoration: isUnderline ? 'underline' : 'none',
    textAlign: textAlign as any
  });

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Menu Bar */}
      <div className="border-b border-gray-200 p-2">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <button
              onClick={handleNew}
              className="px-3 py-1 text-sm hover:bg-gray-100 rounded"
            >
              New
            </button>
            <button
              onClick={handleOpen}
              className="px-3 py-1 text-sm hover:bg-gray-100 rounded flex items-center space-x-1"
            >
              <FolderOpen className="w-4 h-4" />
              <span>Open</span>
            </button>
            <button
              onClick={handleSave}
              className="px-3 py-1 text-sm hover:bg-gray-100 rounded flex items-center space-x-1"
            >
              <Save className="w-4 h-4" />
              <span>Save</span>
            </button>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="border-b border-gray-200 p-3">
        <div className="flex items-center space-x-4">
          {/* Font Controls */}
          <div className="flex items-center space-x-2">
            <select
              value={fontFamily}
              onChange={(e) => setFontFamily(e.target.value)}
              className="px-2 py-1 border border-gray-300 rounded text-sm"
            >
              <option value="system-ui">System</option>
              <option value="serif">Times</option>
              <option value="monospace">Monaco</option>
              <option value="cursive">Brush Script</option>
            </select>
            
            <select
              value={fontSize}
              onChange={(e) => setFontSize(Number(e.target.value))}
              className="px-2 py-1 border border-gray-300 rounded text-sm w-16"
            >
              <option value={10}>10</option>
              <option value={12}>12</option>
              <option value={14}>14</option>
              <option value={16}>16</option>
              <option value={18}>18</option>
              <option value={24}>24</option>
              <option value={36}>36</option>
              <option value={48}>48</option>
            </select>
          </div>

          <div className="w-px h-6 bg-gray-300" />

          {/* Format Controls */}
          <div className="flex items-center space-x-1">
            <button
              onClick={() => setIsBold(!isBold)}
              className={`p-2 rounded hover:bg-gray-100 ${isBold ? 'bg-gray-200' : ''}`}
            >
              <Bold className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsItalic(!isItalic)}
              className={`p-2 rounded hover:bg-gray-100 ${isItalic ? 'bg-gray-200' : ''}`}
            >
              <Italic className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsUnderline(!isUnderline)}
              className={`p-2 rounded hover:bg-gray-100 ${isUnderline ? 'bg-gray-200' : ''}`}
            >
              <Underline className="w-4 h-4" />
            </button>
          </div>

          <div className="w-px h-6 bg-gray-300" />

          {/* Alignment Controls */}
          <div className="flex items-center space-x-1">
            <button
              onClick={() => setTextAlign('left')}
              className={`p-2 rounded hover:bg-gray-100 ${textAlign === 'left' ? 'bg-gray-200' : ''}`}
            >
              <AlignLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setTextAlign('center')}
              className={`p-2 rounded hover:bg-gray-100 ${textAlign === 'center' ? 'bg-gray-200' : ''}`}
            >
              <AlignCenter className="w-4 h-4" />
            </button>
            <button
              onClick={() => setTextAlign('right')}
              className={`p-2 rounded hover:bg-gray-100 ${textAlign === 'right' ? 'bg-gray-200' : ''}`}
            >
              <AlignRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 p-6 overflow-auto">
        <textarea
          value={content}
          onChange={handleContentChange}
          style={getTextStyle()}
          className="w-full h-full resize-none outline-none bg-transparent leading-relaxed"
          placeholder="Start typing..."
        />
      </div>

      {/* Status Bar */}
      <div className="border-t border-gray-200 px-4 py-2 bg-gray-50 flex items-center justify-between text-sm text-gray-600">
        <div className="flex items-center space-x-4">
          <span>{fileName}{isModified ? ' •' : ''}</span>
          <span>{wordCount} words</span>
          <span>{content.length} characters</span>
        </div>
        <div className="flex items-center space-x-2">
          <Type className="w-4 h-4" />
          <span>Plain Text</span>
        </div>
      </div>
    </div>
  );
}

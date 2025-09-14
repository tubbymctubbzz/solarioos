"use client";

import React from 'react';
import { X } from 'lucide-react';

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: string;
  isDarkMode?: boolean;
}

const InfoModal: React.FC<InfoModalProps> = ({ 
  isOpen, 
  onClose, 
  title, 
  content, 
  isDarkMode = false 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999]" onClick={onClose}>
      <div 
        className={`w-96 rounded-xl shadow-2xl overflow-hidden ${
          isDarkMode ? 'bg-gray-900 border border-gray-700' : 'bg-white border border-gray-200'
        }`} 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`flex items-center justify-between p-4 border-b ${
          isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'
        }`}>
          <h3 className={`text-lg font-semibold ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            {title}
          </h3>
          <button
            onClick={onClose}
            className={`p-1 rounded-lg transition-colors ${
              isDarkMode 
                ? 'hover:bg-gray-700 text-gray-400 hover:text-white' 
                : 'hover:bg-gray-200 text-gray-500 hover:text-gray-700'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          <pre className={`whitespace-pre-wrap font-mono text-sm ${
            isDarkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>
            {content}
          </pre>
        </div>

        {/* Footer */}
        <div className={`flex justify-end p-4 border-t ${
          isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'
        }`}>
          <button
            onClick={onClose}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              isDarkMode
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default InfoModal;

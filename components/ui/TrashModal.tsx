'use client';

import React from 'react';
import { X, Trash2, RotateCcw, File, Folder, Image, Music, Video } from 'lucide-react';

interface TrashItem {
  id: number;
  name: string;
  type: 'file' | 'folder' | 'image' | 'music' | 'video';
  size: string;
  deletedDate: Date;
  originalPath: string;
}

interface TrashModalProps {
  isOpen: boolean;
  onClose: () => void;
  trashItems: TrashItem[];
  onRestore: (itemId: number) => void;
  onDelete: (itemId: number) => void;
  onEmptyTrash: () => void;
  isDarkMode: boolean;
}

const getFileIcon = (type: string) => {
  switch (type) {
    case 'folder': return Folder;
    case 'image': return Image;
    case 'music': return Music;
    case 'video': return Video;
    default: return File;
  }
};

export default function TrashModal({
  isOpen,
  onClose,
  trashItems,
  onRestore,
  onDelete,
  onEmptyTrash,
  isDarkMode
}: TrashModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div 
        className={`w-[600px] h-[500px] rounded-xl shadow-2xl overflow-hidden ${
          isDarkMode ? 'bg-gray-900 border border-gray-700' : 'bg-white border border-gray-200'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`flex items-center justify-between p-4 border-b ${
          isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'
        }`}>
          <div className="flex items-center space-x-3">
            <Trash2 className={`w-5 h-5 ${isDarkMode ? 'text-red-400' : 'text-red-500'}`} />
            <h2 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Trash ({trashItems.length} items)
            </h2>
          </div>
          <div className="flex items-center space-x-2">
            {trashItems.length > 0 && (
              <button
                onClick={onEmptyTrash}
                className={`px-3 py-1 text-sm rounded-md transition-colors ${
                  isDarkMode 
                    ? 'bg-red-600 hover:bg-red-700 text-white' 
                    : 'bg-red-500 hover:bg-red-600 text-white'
                }`}
              >
                Empty Trash
              </button>
            )}
            <button
              onClick={onClose}
              className={`p-1 rounded-md transition-colors ${
                isDarkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-200 text-gray-500'
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-4">
          {trashItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full">
              <Trash2 className={`w-16 h-16 mb-4 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
              <p className={`text-lg font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Trash is Empty
              </p>
              <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                Items you delete will appear here
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {trashItems.map((item) => {
                const IconComponent = getFileIcon(item.type);
                return (
                  <div
                    key={item.id}
                    className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                      isDarkMode 
                        ? 'border-gray-700 hover:bg-gray-800' 
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3 flex-1">
                      <IconComponent className={`w-6 h-6 ${
                        isDarkMode ? 'text-blue-400' : 'text-blue-500'
                      }`} />
                      <div className="flex-1">
                        <div className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          {item.name}
                        </div>
                        <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          {item.size} • Deleted {item.deletedDate.toLocaleDateString()}
                        </div>
                        <div className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                          Original location: {item.originalPath}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => onRestore(item.id)}
                        className={`p-2 rounded-md transition-colors ${
                          isDarkMode 
                            ? 'hover:bg-green-600 text-green-400 hover:text-white' 
                            : 'hover:bg-green-100 text-green-600'
                        }`}
                        title="Restore"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete(item.id)}
                        className={`p-2 rounded-md transition-colors ${
                          isDarkMode 
                            ? 'hover:bg-red-600 text-red-400 hover:text-white' 
                            : 'hover:bg-red-100 text-red-600'
                        }`}
                        title="Delete Permanently"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

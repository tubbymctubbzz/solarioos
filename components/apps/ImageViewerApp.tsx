"use client";

import React, { useState, useEffect } from 'react';
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCw, 
  Download, 
  Share, 
  Trash2, 
  ChevronLeft, 
  ChevronRight,
  Maximize2,
  Minimize2,
  Info
} from 'lucide-react';

interface ImageViewerAppProps {
  windowId: string;
  isDarkMode?: boolean;
  imagePath?: string;
  imageName?: string;
  onMoveToTrash?: (name: string, type: 'image', size: string, originalPath: string) => void;
}

export default function ImageViewerApp({ 
  windowId, 
  isDarkMode = false, 
  imagePath, 
  imageName = "Sample Image",
  onMoveToTrash 
}: ImageViewerAppProps) {
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [showInfo, setShowInfo] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // Real images based on what's actually in the system
  const sampleImages = [
    { name: "Solario Wallpaper.jpg", path: "/Users/solario/Welcome to Solario/Solario Wallpaper.jpg", size: "2.5 MB" },
    { name: "Sample Image.png", path: "/Users/solario/Welcome to Solario/Sample Files/Sample Image.png", size: "1.2 MB" }
  ];
  
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [images] = useState(sampleImages);
  const currentImage = images[currentImageIndex];

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 25, 500));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 25, 25));
  };

  const handleRotate = () => {
    setRotation(prev => (prev + 90) % 360);
  };

  const handlePrevious = () => {
    setCurrentImageIndex(prev => prev > 0 ? prev - 1 : images.length - 1);
  };

  const handleNext = () => {
    setCurrentImageIndex(prev => prev < images.length - 1 ? prev + 1 : 0);
  };

  const handleDelete = () => {
    if (onMoveToTrash && currentImage) {
      onMoveToTrash(currentImage.name, 'image', currentImage.size, currentImage.path);
    }
  };

  const handleDownload = () => {
    // Simulate download
    const link = document.createElement('a');
    link.href = '#';
    link.download = currentImage.name;
    link.click();
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowLeft':
          handlePrevious();
          break;
        case 'ArrowRight':
          handleNext();
          break;
        case '+':
        case '=':
          handleZoomIn();
          break;
        case '-':
          handleZoomOut();
          break;
        case 'r':
        case 'R':
          handleRotate();
          break;
        case 'Delete':
        case 'Backspace':
          handleDelete();
          break;
        case 'f':
        case 'F':
          setIsFullscreen(!isFullscreen);
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen]);

  return (
    <div className={`h-full flex flex-col ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Toolbar */}
      <div className={`flex items-center justify-between p-3 border-b ${
        isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <div className="flex items-center space-x-2">
          <button
            onClick={handlePrevious}
            className={`p-2 rounded-lg transition-colors ${
              isDarkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-700'
            }`}
            title="Previous Image (←)"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          
          <button
            onClick={handleNext}
            className={`p-2 rounded-lg transition-colors ${
              isDarkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-700'
            }`}
            title="Next Image (→)"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          
          <div className={`h-6 w-px ${isDarkMode ? 'bg-gray-700' : 'bg-gray-300'}`} />
          
          <button
            onClick={handleZoomOut}
            className={`p-2 rounded-lg transition-colors ${
              isDarkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-700'
            }`}
            title="Zoom Out (-)"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          
          <span className={`text-sm font-medium px-2 ${
            isDarkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>
            {zoom}%
          </span>
          
          <button
            onClick={handleZoomIn}
            className={`p-2 rounded-lg transition-colors ${
              isDarkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-700'
            }`}
            title="Zoom In (+)"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          
          <button
            onClick={handleRotate}
            className={`p-2 rounded-lg transition-colors ${
              isDarkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-700'
            }`}
            title="Rotate (R)"
          >
            <RotateCw className="w-4 h-4" />
          </button>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowInfo(!showInfo)}
            className={`p-2 rounded-lg transition-colors ${
              showInfo 
                ? 'bg-blue-500 text-white' 
                : (isDarkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-700')
            }`}
            title="Image Info"
          >
            <Info className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className={`p-2 rounded-lg transition-colors ${
              isDarkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-700'
            }`}
            title="Fullscreen (F)"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
          
          <button
            onClick={handleDownload}
            className={`p-2 rounded-lg transition-colors ${
              isDarkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-700'
            }`}
            title="Download"
          >
            <Download className="w-4 h-4" />
          </button>
          
          <button
            onClick={handleDelete}
            className="p-2 rounded-lg transition-colors hover:bg-red-500/20 text-red-500"
            title="Move to Trash (Delete)"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Main Image Area */}
        <div className={`flex-1 flex items-center justify-center p-4 ${
          isDarkMode ? 'bg-gray-900' : 'bg-gray-100'
        }`}>
          <div 
            className="relative overflow-hidden rounded-lg shadow-lg bg-white"
            style={{
              transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
              transition: 'transform 0.2s ease'
            }}
          >
            {/* Image display */}
            <div className="w-96 h-64 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 flex items-center justify-center relative overflow-hidden">
              {currentImage.name === "Solario Wallpaper.jpg" ? (
                <div className="w-full h-full bg-gradient-to-br from-purple-600 via-blue-500 to-teal-400 flex items-center justify-center">
                  <div className="text-white text-center">
                    <div className="text-4xl font-bold mb-4">SOLARIO</div>
                    <div className="text-lg opacity-90">Desktop Environment</div>
                  </div>
                </div>
              ) : currentImage.name === "Sample Image.png" ? (
                <div className="w-full h-full bg-gradient-to-br from-green-400 via-blue-500 to-purple-600 flex items-center justify-center">
                  <div className="text-white text-center">
                    <div className="text-2xl font-semibold mb-2">🖼️</div>
                    <div className="text-lg font-medium mb-1">Sample Image</div>
                    <div className="text-sm opacity-80">PNG Format</div>
                  </div>
                </div>
              ) : (
                <div className="text-white text-center">
                  <div className="text-lg font-semibold mb-2">{currentImage.name}</div>
                  <div className="text-sm opacity-80">Image Preview</div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Info Panel */}
        {showInfo && (
          <div className={`w-80 border-l p-4 ${
            isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          }`}>
            <h3 className={`text-lg font-semibold mb-4 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Image Information
            </h3>
            
            <div className="space-y-3">
              <div>
                <label className={`text-sm font-medium ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Name
                </label>
                <p className={`text-sm ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                  {currentImage.name}
                </p>
              </div>
              
              <div>
                <label className={`text-sm font-medium ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Size
                </label>
                <p className={`text-sm ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                  {currentImage.size}
                </p>
              </div>
              
              <div>
                <label className={`text-sm font-medium ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Dimensions
                </label>
                <p className={`text-sm ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                  {currentImage.name === "Solario Wallpaper.jpg" ? "2560 × 1440 pixels" : "1920 × 1080 pixels"}
                </p>
              </div>
              
              <div>
                <label className={`text-sm font-medium ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Format
                </label>
                <p className={`text-sm ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                  {currentImage.name.split('.').pop()?.toUpperCase()}
                </p>
              </div>
              
              <div>
                <label className={`text-sm font-medium ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Created
                </label>
                <p className={`text-sm ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                  {currentImage.name === "Solario Wallpaper.jpg" ? "December 15, 2024" : "December 20, 2024"}
                </p>
              </div>
              
              <div>
                <label className={`text-sm font-medium ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Location
                </label>
                <p className={`text-sm ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                  {currentImage.path}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Status Bar */}
      <div className={`flex items-center justify-between px-4 py-2 text-xs border-t ${
        isDarkMode 
          ? 'bg-gray-800 border-gray-700 text-gray-400' 
          : 'bg-gray-50 border-gray-200 text-gray-600'
      }`}>
        <div>
          {currentImageIndex + 1} of {images.length} images
        </div>
        <div>
          Zoom: {zoom}% | Rotation: {rotation}°
        </div>
      </div>
    </div>
  );
}

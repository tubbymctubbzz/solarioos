"use client";

import { useState, useRef, useEffect } from "react";
import { X, Minus, Square, RotateCcw } from "lucide-react";

interface Window {
  id: string;
  title: string;
  appId: string;
  component: React.ComponentType<any>;
  isMinimized: boolean;
  isMaximized: boolean;
  position: { x: number; y: number };
  size: { width: number; height: number };
  zIndex: number;
  isClosable: boolean;
  isResizable: boolean;
}

interface WindowManagerProps {
  windows: Window[];
  activeWindowId: string | null;
  onClose: (windowId: string) => void;
  onMinimize: (windowId: string) => void;
  onMaximize: (windowId: string) => void;
  onFocus: (windowId: string) => void;
  onUpdatePosition: (windowId: string, position: { x: number; y: number }) => void;
  onUpdateSize: (windowId: string, size: { width: number; height: number }) => void;
}

export default function WindowManager({
  windows,
  activeWindowId,
  onClose,
  onMinimize,
  onMaximize,
  onFocus,
  onUpdatePosition,
  onUpdateSize
}: WindowManagerProps) {
  const [dragState, setDragState] = useState<{
    windowId: string;
    isDragging: boolean;
    dragOffset: { x: number; y: number };
  } | null>(null);

  const [resizeState, setResizeState] = useState<{
    windowId: string;
    isResizing: boolean;
    resizeHandle: string;
    startPos: { x: number; y: number };
    startSize: { width: number; height: number };
    startPosition: { x: number; y: number };
  } | null>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (dragState?.isDragging) {
        const newX = e.clientX - dragState.dragOffset.x;
        const newY = Math.max(24, e.clientY - dragState.dragOffset.y); // Keep below menu bar
        onUpdatePosition(dragState.windowId, { x: newX, y: newY });
      }

      if (resizeState?.isResizing) {
        const deltaX = e.clientX - resizeState.startPos.x;
        const deltaY = e.clientY - resizeState.startPos.y;
        
        let newWidth = resizeState.startSize.width;
        let newHeight = resizeState.startSize.height;
        let newX = resizeState.startPosition.x;
        let newY = resizeState.startPosition.y;

        const handle = resizeState.resizeHandle;
        
        if (handle.includes('right')) {
          newWidth = Math.max(300, resizeState.startSize.width + deltaX);
        }
        if (handle.includes('left')) {
          newWidth = Math.max(300, resizeState.startSize.width - deltaX);
          newX = resizeState.startPosition.x + deltaX;
        }
        if (handle.includes('bottom')) {
          newHeight = Math.max(200, resizeState.startSize.height + deltaY);
        }
        if (handle.includes('top')) {
          newHeight = Math.max(200, resizeState.startSize.height - deltaY);
          newY = Math.max(24, resizeState.startPosition.y + deltaY);
        }

        onUpdateSize(resizeState.windowId, { width: newWidth, height: newHeight });
        if (newX !== resizeState.startPosition.x || newY !== resizeState.startPosition.y) {
          onUpdatePosition(resizeState.windowId, { x: newX, y: newY });
        }
      }
    };

    const handleMouseUp = () => {
      setDragState(null);
      setResizeState(null);
    };

    if (dragState?.isDragging || resizeState?.isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragState, resizeState, onUpdatePosition, onUpdateSize]);

  const handleMouseDown = (e: React.MouseEvent, windowId: string, action: 'drag' | 'resize', handle?: string) => {
    e.preventDefault();
    onFocus(windowId);

    if (action === 'drag') {
      const window = windows.find(w => w.id === windowId);
      if (!window) return;

      setDragState({
        windowId,
        isDragging: true,
        dragOffset: {
          x: e.clientX - window.position.x,
          y: e.clientY - window.position.y
        }
      });
    } else if (action === 'resize' && handle) {
      const window = windows.find(w => w.id === windowId);
      if (!window) return;

      setResizeState({
        windowId,
        isResizing: true,
        resizeHandle: handle,
        startPos: { x: e.clientX, y: e.clientY },
        startSize: { ...window.size },
        startPosition: { ...window.position }
      });
    }
  };

  const getResizeHandles = (windowId: string) => {
    const handles = [
      'top', 'top-right', 'right', 'bottom-right',
      'bottom', 'bottom-left', 'left', 'top-left'
    ];

    return handles.map(handle => (
      <div
        key={handle}
        className={`absolute ${getHandleClasses(handle)} cursor-${getHandleCursor(handle)} opacity-0 hover:opacity-100 bg-blue-500 transition-opacity`}
        onMouseDown={(e) => handleMouseDown(e, windowId, 'resize', handle)}
      />
    ));
  };

  const getHandleClasses = (handle: string) => {
    const classes: { [key: string]: string } = {
      'top': 'top-0 left-2 right-2 h-1',
      'top-right': 'top-0 right-0 w-3 h-3',
      'right': 'top-2 bottom-2 right-0 w-1',
      'bottom-right': 'bottom-0 right-0 w-3 h-3',
      'bottom': 'bottom-0 left-2 right-2 h-1',
      'bottom-left': 'bottom-0 left-0 w-3 h-3',
      'left': 'top-2 bottom-2 left-0 w-1',
      'top-left': 'top-0 left-0 w-3 h-3'
    };
    return classes[handle] || '';
  };

  const getHandleCursor = (handle: string) => {
    const cursors: { [key: string]: string } = {
      'top': 'ns-resize',
      'top-right': 'ne-resize',
      'right': 'ew-resize',
      'bottom-right': 'se-resize',
      'bottom': 'ns-resize',
      'bottom-left': 'sw-resize',
      'left': 'ew-resize',
      'top-left': 'nw-resize'
    };
    return cursors[handle] || 'default';
  };

  return (
    <>
      {windows
        .filter(window => !window.isMinimized)
        .map((window) => {
          const Component = window.component;
          const isActive = window.id === activeWindowId;
          
          return (
            <div
              key={window.id}
              className={`absolute bg-white rounded-lg shadow-2xl border transition-all duration-200 ${
                isActive ? 'border-blue-500 shadow-blue-500/20' : 'border-gray-300'
              }`}
              style={{
                left: window.isMaximized ? 0 : window.position.x,
                top: window.isMaximized ? 24 : window.position.y,
                width: window.isMaximized ? '100vw' : window.size.width,
                height: window.isMaximized ? 'calc(100vh - 24px - 80px)' : window.size.height,
                zIndex: window.zIndex,
                transform: window.isMaximized ? 'none' : undefined
              }}
              onClick={() => onFocus(window.id)}
            >
              {/* Title Bar */}
              <div
                className={`flex items-center justify-between h-8 px-4 rounded-t-lg cursor-move select-none ${
                  isActive ? 'bg-gray-100' : 'bg-gray-50'
                }`}
                onMouseDown={(e) => !window.isMaximized && handleMouseDown(e, window.id, 'drag')}
                onDoubleClick={() => onMaximize(window.id)}
              >
                {/* Traffic Light Buttons */}
                <div className="flex items-center space-x-2">
                  {window.isClosable && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onClose(window.id);
                      }}
                      className="w-3 h-3 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center group"
                    >
                      <X className="w-2 h-2 text-red-800 opacity-0 group-hover:opacity-100" />
                    </button>
                  )}
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onMinimize(window.id);
                    }}
                    className="w-3 h-3 bg-yellow-500 hover:bg-yellow-600 rounded-full flex items-center justify-center group"
                  >
                    <Minus className="w-2 h-2 text-yellow-800 opacity-0 group-hover:opacity-100" />
                  </button>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onMaximize(window.id);
                    }}
                    className="w-3 h-3 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center group"
                  >
                    {window.isMaximized ? (
                      <RotateCcw className="w-2 h-2 text-green-800 opacity-0 group-hover:opacity-100" />
                    ) : (
                      <Square className="w-2 h-2 text-green-800 opacity-0 group-hover:opacity-100" />
                    )}
                  </button>
                </div>

                {/* Window Title */}
                <div className="flex-1 text-center">
                  <span className="text-sm font-medium text-gray-700">
                    {window.title}
                  </span>
                </div>

                {/* Spacer for symmetry */}
                <div className="w-16" />
              </div>

              {/* Window Content */}
              <div className="h-full pb-8 overflow-hidden">
                <Component windowId={window.id} />
              </div>

              {/* Resize Handles */}
              {window.isResizable && !window.isMaximized && getResizeHandles(window.id)}
            </div>
          );
        })}
    </>
  );
}

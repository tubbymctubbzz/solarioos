"use client";

import React, { useEffect, useRef } from 'react';
import { LucideIcon } from 'lucide-react';

export interface ContextMenuItem {
  id: string;
  label: string;
  icon?: LucideIcon;
  onClick: () => void;
  disabled?: boolean;
  separator?: boolean;
  submenu?: ContextMenuItem[];
}

interface ContextMenuProps {
  isOpen: boolean;
  position: { x: number; y: number };
  items: ContextMenuItem[];
  onClose: () => void;
  isDarkMode?: boolean;
}

export default function ContextMenu({ 
  isOpen, 
  position, 
  items, 
  onClose, 
  isDarkMode = false 
}: ContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  // Adjust position to keep menu within viewport
  const adjustedPosition = React.useMemo(() => {
    if (!isOpen || !menuRef.current) return position;

    const menuWidth = 200; // Approximate menu width
    const menuHeight = items.length * 40; // Approximate item height
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let { x, y } = position;

    // Adjust horizontal position
    if (x + menuWidth > viewportWidth) {
      x = viewportWidth - menuWidth - 10;
    }

    // Adjust vertical position
    if (y + menuHeight > viewportHeight) {
      y = viewportHeight - menuHeight - 10;
    }

    return { x: Math.max(10, x), y: Math.max(10, y) };
  }, [position, isOpen, items.length]);

  if (!isOpen) return null;

  return (
    <div
      ref={menuRef}
      className={`fixed z-[9999] min-w-[200px] rounded-lg shadow-2xl border backdrop-blur-md ${
        isDarkMode
          ? 'bg-gray-800/95 border-gray-700 text-white'
          : 'bg-white/95 border-gray-200 text-gray-900'
      }`}
      style={{
        left: adjustedPosition.x,
        top: adjustedPosition.y,
      }}
    >
      <div className="py-2">
        {items.map((item, index) => {
          if (item.separator) {
            return (
              <div
                key={`separator-${index}`}
                className={`my-1 h-px ${
                  isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
                }`}
              />
            );
          }

          return (
            <button
              key={item.id}
              onClick={() => {
                if (!item.disabled) {
                  item.onClick();
                  onClose();
                }
              }}
              disabled={item.disabled}
              className={`w-full px-4 py-2 text-left flex items-center space-x-3 transition-colors ${
                item.disabled
                  ? 'opacity-50 cursor-not-allowed'
                  : isDarkMode
                  ? 'hover:bg-gray-700 active:bg-gray-600'
                  : 'hover:bg-gray-100 active:bg-gray-200'
              }`}
            >
              {item.icon && (
                <item.icon className="w-4 h-4 flex-shrink-0" />
              )}
              <span className="text-sm font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

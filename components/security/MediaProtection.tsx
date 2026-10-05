'use client';

import React, { useEffect, useState } from 'react';
import { ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function MediaProtection() {
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showSecurityNotice = (msg = 'Protected Media · Downloading and copying are disabled. © Kashinath Jale') => {
    setToastMessage(msg);
  };

  useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => {
      setToastMessage(null);
    }, 2800);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  useEffect(() => {
    // 1. Disable Right-Click (Context Menu)
    const handleContextMenu = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      // Allow right-click on input and textarea for normal editing
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) {
        return;
      }
      e.preventDefault();
      showSecurityNotice();
    };

    // 2. Disable Drag-and-Drop of images/videos to desktop or new tab
    const handleDragStart = (e: DragEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'IMG' ||
          target.tagName === 'VIDEO' ||
          target.tagName === 'PICTURE' ||
          target.tagName === 'CANVAS' ||
          target.closest('img') ||
          target.closest('video'))
      ) {
        e.preventDefault();
      }
    };

    // 3. Disable Keyboard shortcuts (Save, Print, View Source, DevTools)
    const handleKeyDown = (e: KeyboardEvent) => {
      const isCmdOrCtrl = e.ctrlKey || e.metaKey;
      const key = e.key.toLowerCase();

      // Ctrl/Cmd + S (Save)
      if (isCmdOrCtrl && key === 's') {
        e.preventDefault();
        showSecurityNotice('Saving this page or its media assets is disabled.');
        return;
      }

      // Ctrl/Cmd + P (Print to PDF)
      if (isCmdOrCtrl && key === 'p') {
        e.preventDefault();
        showSecurityNotice('Printing photographic assets is disabled.');
        return;
      }

      // Ctrl/Cmd + U (View Source)
      if (isCmdOrCtrl && key === 'u') {
        e.preventDefault();
        return;
      }

      // F12 or Ctrl/Cmd + Shift + I/J/C (Inspect / DevTools)
      if (
        e.key === 'F12' ||
        (isCmdOrCtrl && e.shiftKey && (key === 'i' || key === 'j' || key === 'c'))
      ) {
        e.preventDefault();
        return;
      }
    };

    // 4. Anti-Screenshot PrintScreen interception
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'PrintScreen') {
        try {
          if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(
              '© Kashinath Jale Studio — Visual assets are protected by copyright. Screen capture restricted.'
            );
          }
        } catch {
          // ignore
        }
        showSecurityNotice('Screen capture detected. Photographic work is protected. © Kashinath Jale');
      }
    };

    window.addEventListener('contextmenu', handleContextMenu, { capture: true });
    window.addEventListener('dragstart', handleDragStart, { capture: true });
    window.addEventListener('keydown', handleKeyDown, { capture: true });
    window.addEventListener('keyup', handleKeyUp, { capture: true });

    return () => {
      window.removeEventListener('contextmenu', handleContextMenu, { capture: true });
      window.removeEventListener('dragstart', handleDragStart, { capture: true });
      window.removeEventListener('keydown', handleKeyDown, { capture: true });
      window.removeEventListener('keyup', handleKeyUp, { capture: true });
    };
  }, []);

  return (
    <AnimatePresence>
      {toastMessage && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.25 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] px-4 py-2.5 rounded-full bg-ink/95 border border-gold/40 shadow-2xl backdrop-blur-xl flex items-center gap-2.5 pointer-events-none text-xs text-text font-mono"
        >
          <ShieldAlert className="w-4 h-4 text-gold shrink-0" />
          <span className="text-text/90 tracking-wide">{toastMessage}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

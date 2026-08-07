'use client';

import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { LogOut } from 'lucide-react';

interface SignOutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const SignOutModal: React.FC<SignOutModalProps> = ({
  isOpen,
  onClose,
  onConfirm
}) => {
  const [mounted, setMounted] = useState(false);
  const cancelButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
      // Focus initial Cancel button for accessibility
      setTimeout(() => {
        cancelButtonRef.current?.focus();
      }, 50);
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="signOutModalTitle"
      aria-describedby="signOutModalDesc"
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6"
    >
      {/* 100vw x 100vh Full Viewport Backdrop (Blurs Sidebar + Header + Content equally) */}
      <div
        className="fixed inset-0 z-[9999] bg-black/30 dark:bg-black/50 backdrop-blur-md transition-opacity duration-200 animate-fade-in cursor-pointer"
        onClick={onClose}
      />

      {/* Perfectly Viewport-Centered Theme-Aware Modal Card */}
      <div className="relative z-[10000] w-full max-w-[90vw] sm:max-w-md rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-2xl p-6 text-center space-y-5 transition-all duration-220 ease-out animate-slide-up">
        {/* Header Icon */}
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-500 border border-rose-500/20 shadow-xs">
          <LogOut size={26} />
        </div>

        {/* Title & Description */}
        <div className="space-y-1.5">
          <h2 id="signOutModalTitle" className="text-lg font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight">
            Are you sure you want to sign out?
          </h2>
          <p id="signOutModalDesc" className="text-xs text-zinc-500 dark:text-zinc-400 font-semibold leading-relaxed">
            You&apos;ll need to sign in again to access your LaunchPad AI workspace.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            ref={cancelButtonRef}
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2.5 text-xs font-bold rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-zinc-400"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 px-4 py-2.5 text-xs font-bold rounded-xl bg-rose-600 hover:bg-rose-500 text-white shadow-md transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-rose-500"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

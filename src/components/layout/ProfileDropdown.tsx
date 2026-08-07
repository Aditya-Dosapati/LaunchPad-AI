'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useApp, AppRoute } from '../../context/AppContext';
import { 
  User, 
  Settings as SettingsIcon, 
  Shield, 
  Bell, 
  Sun, 
  HelpCircle, 
  LogOut, 
  AlertTriangle 
} from 'lucide-react';
import { Modal } from '../ui/Modal';

interface ProfileDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTab?: (tab: string) => void;
  className?: string;
  triggerRef?: React.RefObject<HTMLElement | null>;
}

export const ProfileDropdown: React.FC<ProfileDropdownProps> = ({
  isOpen,
  onClose,
  onSelectTab,
  className,
  triggerRef
}) => {
  const { setRoute, role, currentUser } = useApp();
  const menuRef = useRef<HTMLDivElement>(null);
  const [isSignOutModalOpen, setIsSignOutModalOpen] = useState(false);

  const userName = currentUser?.name || (role === 'admin' ? 'Elena Rostova' : role === 'hr' ? 'Emma Watson' : role === 'manager' ? 'Sarah Connor' : 'David Chen');
  const userAvatar = currentUser?.avatar || (role === 'admin' ? 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150' : role === 'hr' ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150' : role === 'manager' ? 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150' : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150');
  const userEmail = `${userName.toLowerCase().replace(' ', '.')}@launchpad.ai`;

  // Close on click outside or escape key
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        menuRef.current && 
        !menuRef.current.contains(target) &&
        (!triggerRef?.current || !triggerRef.current.contains(target))
      ) {
        onClose();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose, triggerRef]);

  if (!isOpen && !isSignOutModalOpen) return null;

  const handleNavigate = (routeTarget: AppRoute, tabSetting?: string) => {
    if (tabSetting && onSelectTab) {
      onSelectTab(tabSetting);
    }
    setRoute(routeTarget);
    onClose();
  };

  const handleConfirmSignOut = () => {
    setIsSignOutModalOpen(false);
    onClose();
    setRoute('auth');
  };

  return (
    <>
      {/* Profile Popover / Dropdown Menu */}
      {isOpen && (
        <div
          ref={menuRef}
          role="menu"
          aria-label="User Profile Menu"
          className={`absolute z-50 w-72 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white/95 dark:bg-[#0c0e1c]/95 backdrop-blur-xl shadow-2xl p-2 text-left transition-all duration-180 ease-out animate-fade-in origin-top-right ${
            className || 'right-0 top-full mt-2'
          }`}
        >
          {/* User Header */}
          <div className="p-3 border-b border-zinc-100 dark:border-zinc-900/60 flex items-center gap-3">
            <img src={userAvatar} alt={userName} className="h-10 w-10 rounded-full object-cover border border-zinc-200 dark:border-zinc-800" />
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100 truncate">{userName}</p>
              <p className="text-[10px] text-zinc-400 font-semibold truncate">{userEmail}</p>
              <span className="inline-block mt-1 px-1.5 py-0.2 text-[8px] font-extrabold uppercase bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded capitalize">
                {role} Workspace
              </span>
            </div>
          </div>

          {/* Menu Actions */}
          <div className="py-1 space-y-0.5">
            <button
              onClick={() => handleNavigate('profile')}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-zinc-700 dark:text-zinc-300 hover:bg-indigo-500/10 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-xl transition-colors cursor-pointer"
            >
              <User size={14} />
              <span>My Profile</span>
            </button>

            <button
              onClick={() => handleNavigate('settings', 'account')}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-zinc-700 dark:text-zinc-300 hover:bg-indigo-500/10 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-xl transition-colors cursor-pointer"
            >
              <SettingsIcon size={14} />
              <span>Account Settings</span>
            </button>

            <button
              onClick={() => handleNavigate('settings', 'security')}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-zinc-700 dark:text-zinc-300 hover:bg-indigo-500/10 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-xl transition-colors cursor-pointer"
            >
              <Shield size={14} />
              <span>Security</span>
            </button>

            <button
              onClick={() => handleNavigate('settings', 'notifications')}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-zinc-700 dark:text-zinc-300 hover:bg-indigo-500/10 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-xl transition-colors cursor-pointer"
            >
              <Bell size={14} />
              <span>Notifications</span>
            </button>

            <button
              onClick={() => handleNavigate('settings', 'appearance')}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-zinc-700 dark:text-zinc-300 hover:bg-indigo-500/10 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-xl transition-colors cursor-pointer"
            >
              <Sun size={14} />
              <span>Appearance</span>
            </button>

            <button
              onClick={() => handleNavigate('help')}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-zinc-700 dark:text-zinc-300 hover:bg-indigo-500/10 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-xl transition-colors cursor-pointer"
            >
              <HelpCircle size={14} />
              <span>Help Center</span>
            </button>
          </div>

          {/* Divider & Sign Out */}
          <div className="pt-1 border-t border-zinc-100 dark:border-zinc-900/60">
            <button
              onClick={() => setIsSignOutModalOpen(true)}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors cursor-pointer"
            >
              <LogOut size={14} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}

      {/* Sign Out Confirmation Modal */}
      {isSignOutModalOpen && (
        <Modal
          isOpen={isSignOutModalOpen}
          onClose={() => setIsSignOutModalOpen(false)}
          title="Confirm Sign Out"
        >
          <div className="space-y-4 text-left">
            <div className="flex items-center gap-3 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-bold">
              <AlertTriangle size={18} className="shrink-0" />
              <span>Are you sure you want to sign out of LaunchPad AI? You will need to sign in again to access your workspace.</span>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setIsSignOutModalOpen(false)}
                className="px-4 py-2 border border-zinc-200 dark:border-zinc-800 text-xs font-bold rounded-xl text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmSignOut}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-xs font-bold rounded-xl text-white shadow-2xs transition-colors cursor-pointer"
              >
                Sign Out
              </button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

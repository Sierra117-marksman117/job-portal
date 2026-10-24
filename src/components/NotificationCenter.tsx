'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Bell, CheckCircle2, Calendar, FileText, ShieldCheck } from 'lucide-react';

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'INTERVIEW' | 'APPLICATION' | 'KYC' | 'MATCH';
  read: boolean;
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'Interview Confirmed',
    message: 'FinWave Technologies scheduled Technical Round 1 on Oct 28 at 11:00 AM IST.',
    timestamp: '10m ago',
    type: 'INTERVIEW',
    read: false,
  },
  {
    id: 'notif-2',
    title: 'Skill Compatibility Alert',
    message: 'Your profile matches 92% with Senior Backend Systems Engineer at FinWave.',
    timestamp: '1h ago',
    type: 'MATCH',
    read: false,
  },
  {
    id: 'notif-3',
    title: 'Application Shortlisted',
    message: 'Kavach Cybersecurity marked your Cloud Infrastructure application as Shortlisted.',
    timestamp: '3h ago',
    type: 'APPLICATION',
    read: false,
  },
  {
    id: 'notif-4',
    title: 'KYC Verification',
    message: 'FinWave Technologies corporate GSTIN registration approved by Platform Admin.',
    timestamp: '1d ago',
    type: 'KYC',
    read: true,
  },
];

export function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const getIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'INTERVIEW':
        return <Calendar className="w-4 h-4 text-emerald-600" />;
      case 'MATCH':
        return <CheckCircle2 className="w-4 h-4 text-blue-600" />;
      case 'KYC':
        return <ShieldCheck className="w-4 h-4 text-purple-600" />;
      case 'APPLICATION':
      default:
        return <FileText className="w-4 h-4 text-amber-600" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        id="btn-notifications-trigger"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={`Notifications (${unreadCount} unread)`}
        className="btn-press relative p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors flex items-center justify-center min-h-[36px] min-w-[36px]"
      >
        <Bell className="w-4 h-4 text-slate-700" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-600 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-slate-200 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
          {/* Header */}
          <div className="p-3.5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-slate-900 text-xs">Activity & Notifications</span>
              {unreadCount > 0 && (
                <span className="px-1.5 py-0.5 rounded-full bg-rose-100 text-rose-700 text-[10px] font-bold">
                  {unreadCount} new
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-[11px] text-blue-600 hover:text-blue-800 font-semibold"
              >
                Mark all read
              </button>
            )}
          </div>

          {/* List */}
          <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto text-xs">
            {notifications.map((notif) => (
              <div
                key={notif.id}
                className={`p-3.5 flex gap-3 hover:bg-slate-50 transition-colors ${
                  !notif.read ? 'bg-blue-50/30' : ''
                }`}
              >
                <div className="mt-0.5 shrink-0">{getIcon(notif.type)}</div>
                <div className="flex-1 space-y-0.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-xs">{notif.title}</span>
                    <span className="text-[10px] text-slate-400">{notif.timestamp}</span>
                  </div>
                  <p className="text-slate-600 text-[11px] leading-relaxed">{notif.message}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="p-2 border-t border-slate-100 bg-slate-50/50 text-center text-[10px] text-slate-400">
            Real-time event stream active
          </div>
        </div>
      )}
    </div>
  );
}

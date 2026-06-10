"use client";

import React, { useState } from "react";
import { Bell, Check, Info, AlertTriangle, ShieldCheck, FileText } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const MOCK_NOTIFICATIONS = [
  { id: 1, type: "info", title: "New RFQ Published", message: "A new RFQ for IT Equipment has been published.", time: "10m ago", read: false },
  { id: 2, type: "warning", title: "Action Required", message: "Your GST verification is pending approval.", time: "1h ago", read: false },
  { id: 3, type: "success", title: "Quotation Accepted", message: "Your quotation for RFQ-2026-003 was accepted.", time: "2h ago", read: true },
  { id: 4, type: "info", title: "System Update", message: "Scheduled maintenance on Saturday 2AM-4AM.", time: "1d ago", read: true },
];

export function NotificationCenter() {
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "info": return <FileText className="w-4 h-4 text-blue-500" />;
      case "warning": return <AlertTriangle className="w-4 h-4 text-orange-500" />;
      case "success": return <ShieldCheck className="w-4 h-4 text-green-500" />;
      default: return <Info className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="focus:outline-none relative p-2 text-on-surface-variant hover:text-on-surface hover:bg-surface-container rounded-full transition-all">
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-error text-white text-[9px] font-bold rounded-full flex items-center justify-center border-2 border-white dark:border-gray-900 shadow-sm">
            {unreadCount}
          </span>
        )}
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-[340px] p-0 font-body-md shadow-2xl rounded-xl border-outline-variant overflow-hidden">
        <div className="p-4 bg-surface-container-lowest border-b border-outline-variant/50 flex items-center justify-between">
          <h3 className="font-bold text-on-surface flex items-center gap-2">
            <Bell className="w-4 h-4 text-primary" /> Notifications
          </h3>
          {unreadCount > 0 && (
            <button onClick={markAllAsRead} className="text-[11px] font-bold text-primary hover:underline flex items-center gap-1">
              <Check className="w-3 h-3" /> Mark all read
            </button>
          )}
        </div>
        
        <div className="max-h-[300px] overflow-y-auto bg-surface custom-scrollbar divide-y divide-outline-variant/30">
          {notifications.length > 0 ? (
            notifications.map(notification => (
              <div 
                key={notification.id} 
                className={`p-4 flex gap-3 hover:bg-surface-container-lowest transition-colors cursor-pointer ${!notification.read ? 'bg-primary/5' : ''}`}
              >
                <div className="mt-0.5 shrink-0">
                  {getIcon(notification.type)}
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex justify-between items-start gap-2">
                    <h4 className={`text-sm ${!notification.read ? 'font-bold text-on-surface' : 'font-semibold text-on-surface-variant'}`}>
                      {notification.title}
                    </h4>
                    <span className="text-[10px] font-medium text-outline whitespace-nowrap">
                      {notification.time}
                    </span>
                  </div>
                  <p className="text-xs text-on-surface-variant line-clamp-2 leading-relaxed">
                    {notification.message}
                  </p>
                </div>
                {!notification.read && (
                  <div className="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0"></div>
                )}
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-outline text-sm">
              <Bell className="w-8 h-8 mx-auto mb-2 opacity-20" />
              No notifications
            </div>
          )}
        </div>
        
        <div className="p-3 bg-surface-container-low border-t border-outline-variant/50 text-center">
          <button className="text-xs font-bold text-primary hover:underline">View All Notifications</button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

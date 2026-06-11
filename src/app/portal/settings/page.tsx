"use client";

import React, { useState } from "react";

export default function SettingsPage() {
  const [theme, setTheme] = useState("System");
  const [language, setLanguage] = useState("English (US)");
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const handleSave = () => {
    // In a full implementation, this would save to the users table
    alert("Preferences saved successfully.");
  };

  return (
    <div className="w-full text-on-background font-body-md selection:bg-primary-fixed selection:text-on-primary-fixed max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="font-headline-md text-[28px] font-bold text-primary mb-1">Account Settings</h2>
        <p className="text-on-surface-variant text-sm">Manage your preferences and application settings.</p>
      </div>

      <div className="bg-surface rounded-2xl border border-outline-variant shadow-sm overflow-hidden mb-6">
        <div className="p-6 border-b border-outline-variant">
          <h3 className="text-[18px] font-bold text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">palette</span> Appearance
          </h3>
        </div>
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-[12px] font-bold text-on-surface-variant">Theme Preference</label>
              <select value={theme} onChange={(e) => setTheme(e.target.value)} className="w-full bg-surface-container-lowest border-outline-variant border rounded-lg px-4 py-2.5 text-sm focus:border-primary outline-none">
                <option value="Light">Light Mode</option>
                <option value="Dark">Dark Mode</option>
                <option value="System">System Default</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[12px] font-bold text-on-surface-variant">Language</label>
              <select value={language} onChange={(e) => setLanguage(e.target.value)} className="w-full bg-surface-container-lowest border-outline-variant border rounded-lg px-4 py-2.5 text-sm focus:border-primary outline-none">
                <option value="English (US)">English (US)</option>
                <option value="English (UK)">English (UK)</option>
                <option value="Spanish">Spanish</option>
                <option value="French">French</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-surface rounded-2xl border border-outline-variant shadow-sm overflow-hidden mb-8">
        <div className="p-6 border-b border-outline-variant">
          <h3 className="text-[18px] font-bold text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">notifications</span> Notification Preferences
          </h3>
        </div>
        <div className="p-6">
          <label className="flex items-center justify-between cursor-pointer p-4 border border-outline-variant rounded-xl hover:bg-surface-container-lowest transition-colors">
            <div>
              <p className="font-bold text-sm text-on-surface">Email Notifications</p>
              <p className="text-[12px] text-on-surface-variant">Receive alerts for RFQs and POs via email.</p>
            </div>
            <input 
              type="checkbox" 
              checked={notificationsEnabled}
              onChange={(e) => setNotificationsEnabled(e.target.checked)}
              className="w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary" 
            />
          </label>
        </div>
      </div>

      <div className="flex justify-end">
        <button onClick={handleSave} className="px-6 py-2.5 bg-primary text-white font-bold rounded-lg text-sm hover:bg-primary/90 transition-colors">
          Save Changes
        </button>
      </div>
    </div>
  );
}

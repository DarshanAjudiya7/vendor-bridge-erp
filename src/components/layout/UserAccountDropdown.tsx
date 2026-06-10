"use client";

import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
  DropdownMenuSubContent
} from "@/components/ui/dropdown-menu";
import { 
  User, Settings, LogOut, Shield, Globe, Monitor, 
  Moon, Sun, Clock, Building2, Briefcase, Bell, LayoutDashboard,
  CheckCircle2, Download, HelpCircle, MessageSquare
} from "lucide-react";
import { signOut } from "next-auth/react";
import { getUserProfileDetails, updateUserPreferences } from "@/lib/actions/user";
import { useTheme } from "next-themes";
import Link from "next/link";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

export function UserAccountDropdown({ sessionUser }: { sessionUser?: any }) {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { theme, setTheme } = useTheme();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      try {
        const data = await getUserProfileDetails();
        setProfile(data);
      } catch (e) {
        console.error("Failed to load profile details", e);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, []);

  const handleLogout = () => {
    signOut({ callbackUrl: "/login" });
  };

  const getInitials = (name: string) => {
    if (!name) return "U";
    return name.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase();
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className="focus:outline-none outline-none group relative">
          <Avatar className="h-9 w-9 border-2 border-transparent group-hover:border-primary/20 transition-all">
            <AvatarImage src={profile?.avatarUrl || ""} alt={sessionUser?.name || "User"} />
            <AvatarFallback className="bg-primary/10 text-primary font-bold">
              {getInitials(sessionUser?.name || "")}
            </AvatarFallback>
          </Avatar>
          <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white dark:border-gray-900"></div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[380px] p-0 font-body-md shadow-2xl rounded-xl overflow-hidden border-outline-variant">
          
          {loading ? (
            <div className="p-8 text-center text-sm text-outline animate-pulse">Loading profile...</div>
          ) : (
            <>
              {/* Header Section */}
              <div className="p-5 bg-surface-container-lowest border-b border-outline-variant/50 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -z-0"></div>
                <div className="flex items-start gap-4 relative z-10">
                  <Avatar className="h-16 w-16 shadow-sm border border-outline-variant">
                    <AvatarImage src={profile?.avatarUrl || ""} alt={profile?.name} />
                    <AvatarFallback className="bg-primary/10 text-primary font-bold text-xl">
                      {getInitials(profile?.name || "")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col flex-1 pt-1">
                    <h3 className="font-bold text-lg text-on-surface leading-tight">{profile?.name}</h3>
                    <p className="text-sm text-on-surface-variant leading-tight mb-2">{profile?.email}</p>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-bold uppercase rounded tracking-wider">
                        {profile?.role}
                      </span>
                      {profile?.vendorDetails?.verificationStatus === "VERIFIED" && (
                        <span className="flex items-center gap-1 text-[10px] text-green-600 font-bold uppercase">
                          <CheckCircle2 className="w-3 h-3" /> Verified
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 mt-4 text-[11px] text-outline">
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3"/> Member since {new Date(profile?.createdAt).getFullYear()}</span>
                  <span className="flex items-center gap-1"><Monitor className="w-3 h-3"/> Last login: {profile?.lastLogin ? new Date(profile.lastLogin).toLocaleDateString() : 'Just now'}</span>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-3 divide-x divide-outline-variant border-b border-outline-variant/50 bg-surface">
                <div className="p-3 text-center hover:bg-surface-container-lowest transition-colors">
                  <div className="text-lg font-bold text-primary font-mono">{profile?.totalLogins || 1}</div>
                  <div className="text-[10px] font-bold text-outline uppercase tracking-wider mt-0.5">Logins</div>
                </div>
                <div className="p-3 text-center hover:bg-surface-container-lowest transition-colors">
                  <div className="text-lg font-bold text-primary font-mono">{profile?.activityCount || 0}</div>
                  <div className="text-[10px] font-bold text-outline uppercase tracking-wider mt-0.5">Activities</div>
                </div>
                <div className="p-3 text-center hover:bg-surface-container-lowest transition-colors relative">
                  <div className="text-lg font-bold text-primary font-mono">{profile?.profileCompletion || 100}%</div>
                  <div className="text-[10px] font-bold text-outline uppercase tracking-wider mt-0.5">Completion</div>
                  <div className="absolute bottom-0 left-0 h-0.5 bg-primary/20 w-full">
                    <div className="h-full bg-primary" style={{ width: `${profile?.profileCompletion || 100}%` }}></div>
                  </div>
                </div>
              </div>

              {/* Scrollable Menu Area */}
              <div className="max-h-[340px] overflow-y-auto py-2 bg-surface custom-scrollbar">
                
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="text-xs font-bold text-outline uppercase tracking-wider px-4 py-2">My Account</DropdownMenuLabel>
                  <DropdownMenuItem className="px-4 py-2.5 cursor-pointer flex items-center gap-3">
                    <User className="w-4 h-4 text-on-surface-variant" />
                    <span>View Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="px-4 py-2.5 cursor-pointer flex items-center gap-3">
                    <Settings className="w-4 h-4 text-on-surface-variant" />
                    <span>Account Settings</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>

                <DropdownMenuSeparator className="my-1 border-outline-variant/50" />

                {profile?.role === "VENDOR" && profile?.vendorDetails && (
                  <DropdownMenuGroup>
                    <DropdownMenuLabel className="text-xs font-bold text-outline uppercase tracking-wider px-4 py-2">Business</DropdownMenuLabel>
                    <DropdownMenuItem className="px-4 py-2.5 cursor-pointer flex items-center gap-3">
                      <Building2 className="w-4 h-4 text-on-surface-variant" />
                      <div className="flex flex-col">
                        <span>{profile.vendorDetails.companyName}</span>
                        <span className="text-[10px] text-outline">GST: {profile.vendorDetails.gstNumber}</span>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="px-4 py-2.5 cursor-pointer flex items-center gap-3">
                      <Briefcase className="w-4 h-4 text-on-surface-variant" />
                      <span>Company Profile</span>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                )}

                <DropdownMenuSeparator className="my-1 border-outline-variant/50" />

                <DropdownMenuGroup>
                  <DropdownMenuLabel className="text-xs font-bold text-outline uppercase tracking-wider px-4 py-2">Security & Preferences</DropdownMenuLabel>
                  <DropdownMenuItem className="px-4 py-2.5 cursor-pointer flex items-center gap-3">
                    <Shield className="w-4 h-4 text-on-surface-variant" />
                    <div className="flex flex-col flex-1">
                      <span>Security Settings</span>
                      <span className="text-[10px] text-outline">{profile?.twoFactorEnabled ? '2FA Enabled' : '2FA Disabled'}</span>
                    </div>
                  </DropdownMenuItem>
                  
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger className="px-4 py-2.5 cursor-pointer flex items-center gap-3">
                      {theme === 'dark' ? <Moon className="w-4 h-4 text-on-surface-variant" /> : <Sun className="w-4 h-4 text-on-surface-variant" />}
                      <span>Theme</span>
                    </DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                      <DropdownMenuSubContent className="w-36 rounded-lg shadow-xl">
                        <DropdownMenuItem onClick={() => setTheme("light")} className="cursor-pointer">Light</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setTheme("dark")} className="cursor-pointer">Dark</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setTheme("system")} className="cursor-pointer">System</DropdownMenuItem>
                      </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                  </DropdownMenuSub>

                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger className="px-4 py-2.5 cursor-pointer flex items-center gap-3">
                      <Globe className="w-4 h-4 text-on-surface-variant" />
                      <span>Language</span>
                    </DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                      <DropdownMenuSubContent className="w-36 rounded-lg shadow-xl">
                        <DropdownMenuItem className="cursor-pointer font-bold">English (US)</DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer">Gujarati</DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer">Hindi</DropdownMenuItem>
                      </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                  </DropdownMenuSub>
                </DropdownMenuGroup>

                <DropdownMenuSeparator className="my-1 border-outline-variant/50" />
                
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="text-xs font-bold text-outline uppercase tracking-wider px-4 py-2">Support</DropdownMenuLabel>
                  <DropdownMenuItem className="px-4 py-2.5 cursor-pointer flex items-center gap-3">
                    <HelpCircle className="w-4 h-4 text-on-surface-variant" />
                    <span>Help Center</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="px-4 py-2.5 cursor-pointer flex items-center gap-3">
                    <MessageSquare className="w-4 h-4 text-on-surface-variant" />
                    <span>Feedback</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </div>

              {/* Footer */}
              <div className="p-3 bg-surface-container-low border-t border-outline-variant/50 flex items-center justify-between">
                <button className="text-xs font-bold text-outline hover:text-primary flex items-center gap-1 transition-colors px-2 py-1 rounded hover:bg-primary/10">
                  <Download className="w-3 h-3" /> Data
                </button>
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    setShowLogoutConfirm(true);
                  }}
                  className="text-xs font-bold text-error hover:bg-error/10 px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" /> Sign Out
                </button>
              </div>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <ConfirmDialog 
        open={showLogoutConfirm}
        onOpenChange={setShowLogoutConfirm}
        title="Sign Out"
        description="Are you sure you want to sign out of your account? You will need to log in again to access the portal."
        onConfirm={handleLogout}
        variant="destructive"
      />
    </>
  );
}

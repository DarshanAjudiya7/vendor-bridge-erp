"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
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
  CheckCircle2, Download, HelpCircle, MessageSquare, X
} from "lucide-react";
import { signOut } from "next-auth/react";
import { getUserProfileDetails } from "@/lib/actions/user";
import { useTheme } from "next-themes";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { cn } from "@/lib/utils";

export function UserAccountDropdown({ sessionUser }: { sessionUser?: any }) {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { theme, setTheme } = useTheme();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  
  // Responsive states
  const [isMobile, setIsMobile] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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

  const UserMenuContent = ({ isMobileView = false }: { isMobileView?: boolean }) => (
    <>
      {loading ? (
        <div className="p-8 text-center text-sm text-outline animate-pulse">Loading profile...</div>
      ) : (
        <div className={cn("flex flex-col h-full", isMobileView && "overflow-y-auto")}>
          {/* Header Section */}
          <div className="p-5 bg-surface-container-lowest border-b border-outline-variant/50 relative overflow-hidden shrink-0">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -z-0"></div>
            
            {isMobileView && (
              <button 
                onClick={() => setMobileOpen(false)}
                className="absolute top-4 right-4 z-20 p-2 bg-surface-container-highest rounded-full text-on-surface-variant hover:text-on-surface"
              >
                <X className="w-5 h-5" />
              </button>
            )}

            <div className="flex items-start gap-4 relative z-10">
              <Avatar className="h-16 w-16 shadow-sm border border-outline-variant">
                <AvatarImage src={profile?.avatarUrl || ""} alt={profile?.name} />
                <AvatarFallback className="bg-primary/10 text-primary font-bold text-xl">
                  {getInitials(profile?.name || "")}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col flex-1 pt-1 pr-8">
                <h3 className="font-bold text-lg text-on-surface leading-tight">{profile?.name}</h3>
                <p className="text-sm text-on-surface-variant leading-tight mb-2 truncate">{profile?.email}</p>
                <div className="flex items-center gap-2 flex-wrap">
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
            
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-4 text-[11px] text-outline">
              <span className="flex items-center gap-1"><Clock className="w-3 h-3"/> Member since {new Date(profile?.createdAt || Date.now()).getFullYear()}</span>
              <span className="flex items-center gap-1"><Monitor className="w-3 h-3"/> Last login: {profile?.lastLogin ? new Date(profile.lastLogin).toLocaleDateString() : 'Just now'}</span>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-3 divide-x divide-outline-variant border-b border-outline-variant/50 bg-surface shrink-0">
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
          <div className={cn("overflow-y-auto py-2 bg-surface custom-scrollbar flex-1", !isMobileView && "max-h-[340px]")}>
            
            <div className="px-4 py-2">
              <div className="text-xs font-bold text-outline uppercase tracking-wider mb-2">My Account</div>
              <Link href="/portal/settings" onClick={() => isMobileView && setMobileOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-surface-container-highest cursor-pointer transition-colors active:scale-95">
                <User className="w-4 h-4 text-on-surface-variant" />
                <span>View Profile</span>
              </Link>
              <Link href="/portal/settings" onClick={() => isMobileView && setMobileOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-surface-container-highest cursor-pointer transition-colors active:scale-95">
                <Settings className="w-4 h-4 text-on-surface-variant" />
                <span>Account Settings</span>
              </Link>
            </div>

            <div className="h-px w-full bg-outline-variant/50 my-1" />

            {profile?.role === "VENDOR" && profile?.vendorDetails && (
              <>
                <div className="px-4 py-2">
                  <div className="text-xs font-bold text-outline uppercase tracking-wider mb-2">Business</div>
                  <div className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-surface-container-highest cursor-pointer transition-colors active:scale-95">
                    <Building2 className="w-4 h-4 text-on-surface-variant shrink-0" />
                    <div className="flex flex-col truncate">
                      <span className="truncate">{profile.vendorDetails.companyName}</span>
                      <span className="text-[10px] text-outline">GST: {profile.vendorDetails.gstNumber}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-surface-container-highest cursor-pointer transition-colors active:scale-95">
                    <Briefcase className="w-4 h-4 text-on-surface-variant shrink-0" />
                    <span>Company Profile</span>
                  </div>
                </div>
                <div className="h-px w-full bg-outline-variant/50 my-1" />
              </>
            )}

            <div className="px-4 py-2">
              <div className="text-xs font-bold text-outline uppercase tracking-wider mb-2">Security & Preferences</div>
              <div className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-surface-container-highest cursor-pointer transition-colors active:scale-95">
                <Shield className="w-4 h-4 text-on-surface-variant shrink-0" />
                <div className="flex flex-col flex-1">
                  <span>Security Settings</span>
                  <span className="text-[10px] text-outline">{profile?.twoFactorEnabled ? '2FA Enabled' : '2FA Disabled'}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between px-4 py-3 rounded-lg hover:bg-surface-container-highest cursor-pointer transition-colors">
                <div className="flex items-center gap-3">
                  {theme === 'dark' ? <Moon className="w-4 h-4 text-on-surface-variant shrink-0" /> : <Sun className="w-4 h-4 text-on-surface-variant shrink-0" />}
                  <span>Theme</span>
                </div>
                <div className="flex gap-2 text-xs">
                  <button onClick={() => setTheme("light")} className={cn("px-2 py-1 rounded", theme === 'light' ? 'bg-primary/10 text-primary font-bold' : 'text-outline')}>Light</button>
                  <button onClick={() => setTheme("dark")} className={cn("px-2 py-1 rounded", theme === 'dark' ? 'bg-primary/10 text-primary font-bold' : 'text-outline')}>Dark</button>
                </div>
              </div>
            </div>

            <div className="h-px w-full bg-outline-variant/50 my-1" />
            
            <div className="px-4 py-2">
              <div className="text-xs font-bold text-outline uppercase tracking-wider mb-2">Support</div>
              <Link href="/support" onClick={() => isMobileView && setMobileOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-surface-container-highest cursor-pointer transition-colors active:scale-95">
                <HelpCircle className="w-4 h-4 text-on-surface-variant shrink-0" />
                <span>Help Center</span>
              </Link>
              <Link href="/support" onClick={() => isMobileView && setMobileOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-surface-container-highest cursor-pointer transition-colors active:scale-95">
                <MessageSquare className="w-4 h-4 text-on-surface-variant shrink-0" />
                <span>Feedback</span>
              </Link>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 sm:p-3 bg-surface-container-low border-t border-outline-variant/50 flex items-center justify-between shrink-0">
            <button onClick={() => { navigator.clipboard?.writeText(profile?.email || ''); }} className="text-sm sm:text-xs font-bold text-outline hover:text-primary flex items-center gap-2 sm:gap-1 transition-colors px-3 py-2 sm:px-2 sm:py-1 rounded hover:bg-primary/10 active:scale-95" title="Copy email to clipboard">
              <Download className="w-4 h-4 sm:w-3 sm:h-3" />
              Data
            </button>
            <button 
              onClick={(e) => {
                e.preventDefault();
                setShowLogoutConfirm(true);
                if (isMobileView) setMobileOpen(false);
              }}
              className="text-sm sm:text-xs font-bold text-error hover:bg-error/10 px-4 py-2 sm:px-3 sm:py-1.5 rounded-lg flex items-center gap-2 sm:gap-1.5 transition-colors active:scale-95"
            >
              <LogOut className="w-4 h-4 sm:w-3.5 sm:h-3.5" /> Sign Out
            </button>
          </div>
        </div>
      )}
    </>
  );

  return (
    <>
      {isMobile ? (
        <>
          <button 
            className="focus:outline-none outline-none group relative"
            onClick={() => setMobileOpen(true)}
          >
            <Avatar className="h-9 w-9 border-2 border-transparent group-hover:border-primary/20 transition-all">
              <AvatarImage src={profile?.avatarUrl || ""} alt={sessionUser?.name || "User"} />
              <AvatarFallback className="bg-primary/10 text-primary font-bold">
                {getInitials(sessionUser?.name || "")}
              </AvatarFallback>
            </Avatar>
            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white dark:border-gray-900"></div>
          </button>

          {/* Mobile Bottom Sheet/Panel */}
          {mobileOpen && (
            <div className="fixed inset-0 z-[100] flex flex-col justify-end">
              <div 
                className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
                onClick={() => setMobileOpen(false)}
              />
              <div className="relative bg-surface w-full h-[85vh] sm:h-full sm:max-h-[90vh] rounded-t-2xl sm:rounded-none flex flex-col animate-in slide-in-from-bottom-full duration-300">
                <UserMenuContent isMobileView={true} />
              </div>
            </div>
          )}
        </>
      ) : (
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
            <UserMenuContent />
          </DropdownMenuContent>
        </DropdownMenu>
      )}

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

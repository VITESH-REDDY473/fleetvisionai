"use client";

import React, { useState } from "react";
import { Activity, ShieldAlert, Cpu, Eye, Radio, Sparkles, LogOut, ChevronDown } from "lucide-react";
import { useAuth } from "../lib/auth";

interface HeaderProps {
  isConnected: boolean;
  activeAlertsCount: number;
  onQuickSimulate: () => void;
}

export const Header: React.FC<HeaderProps> = ({ isConnected, activeAlertsCount, onQuickSimulate }) => {
  const { user, logout } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  return (
    <header className="bg-gray-900/90 backdrop-blur-md border-b border-gray-800 px-5 py-3 sticky top-0 z-50">
      <div className="flex items-center justify-between">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 shadow-lg shadow-blue-500/25">
            <Eye className="w-5 h-5 text-white" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-1.5">
                FleetVision<span className="text-cyan-400">AI</span>
              </h1>
              <span className="text-[10px] uppercase font-semibold tracking-wider px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                Command v2.4
              </span>
            </div>
            <p className="text-xs text-gray-400">Intelligent Real-Time Fleet Telematics & Vision AI Operations</p>
          </div>
        </div>

        {/* Center Indicators */}
        <div className="hidden lg:flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-800/60 border border-gray-700/50">
            <Radio className={`w-4 h-4 ${isConnected ? "text-emerald-400 animate-pulse" : "text-amber-500"}`} />
            <span className="text-xs font-medium text-gray-300">
              {isConnected ? "Telematics Stream: LIVE (1Hz)" : "Connecting to Gateway..."}
            </span>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-800/60 border border-gray-700/50">
            <Cpu className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-medium text-gray-300">Edge Vision Engine: Active</span>
          </div>
        </div>

        {/* Right Action Controls & User Profile */}
        <div className="flex items-center gap-3">
          <button
            onClick={onQuickSimulate}
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 rounded-lg shadow-sm shadow-blue-500/30 transition-all border border-blue-400/30 active:scale-95"
            title="Simulate random AI Safety Event"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-200" />
            <span>Simulate AI Incident</span>
          </button>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-950/40 border border-red-500/30">
            <ShieldAlert className="w-4 h-4 text-red-400" />
            <span className="text-xs font-bold text-red-300">{activeAlertsCount}</span>
            <span className="text-[11px] text-red-400/80 uppercase tracking-wide">Alerts</span>
          </div>

          {/* User Account / Sign Out Dropdown */}
          {user && (
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-2.5 p-1.5 pl-2.5 rounded-xl bg-gray-800/80 hover:bg-gray-700/80 border border-gray-700/60 transition-all"
              >
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-7 h-7 rounded-lg object-cover border border-cyan-400/30"
                />
                <div className="text-left hidden sm:block">
                  <div className="text-xs font-bold text-white leading-none">{user.name}</div>
                  <div className="text-[10px] text-cyan-400 font-medium leading-tight mt-0.5">
                    {user.roleTitle.split(" ")[0]} {user.roleTitle.split(" ")[1] || ""}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
              </button>

              {/* Dropdown Menu */}
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-gray-900 border border-gray-700/80 shadow-2xl p-3 z-50 animate-fade-in text-xs">
                  <div className="pb-3 border-b border-gray-800 mb-2">
                    <p className="font-bold text-white">{user.name}</p>
                    <p className="text-gray-400 text-[11px] font-mono">{user.email}</p>
                    <span className="inline-block mt-1.5 px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[10px] font-semibold">
                      {user.clearanceLevel}
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      logout();
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-red-400 hover:bg-red-950/40 hover:text-red-300 transition-colors font-medium"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out of FleetVision</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

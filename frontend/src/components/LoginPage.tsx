"use client";

import React, { useState } from "react";
import { useAuth, DEMO_ACCOUNTS } from "../lib/auth";
import { Eye, EyeOff, ShieldCheck, Lock, Mail, ArrowRight, Sparkles, Radio, Cpu, CheckCircle, Shield, UserCheck, Truck } from "lucide-react";

export const LoginPage: React.FC = () => {
  const { login, loginAsDemo } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMessage("Please enter both enterprise email and workstation password.");
      return;
    }

    setErrorMessage("");
    setIsSubmitting(true);

    try {
      await new Promise((res) => setTimeout(res, 500));
      await login(email, password);
    } catch {
      setErrorMessage("Authentication failed. Please verify your credentials.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#070A11] text-gray-100 flex items-center justify-center p-4 lg:p-8 relative overflow-hidden font-sans">
      {/* Background High-Tech Ambient Effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[550px] h-[550px] rounded-full bg-blue-600/15 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-cyan-500/10 blur-[140px] pointer-events-none"></div>

      {/* Cyber Grid Pattern Backdrop */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(#3B82F6 1px, transparent 1px), linear-gradient(90deg, #3B82F6 1px, transparent 1px)",
          backgroundSize: "40px 40px"
        }}
      ></div>

      {/* Main Container */}
      <div className="w-full max-w-5xl rounded-3xl border border-gray-800/80 bg-gray-900/60 backdrop-blur-2xl shadow-2xl grid grid-cols-1 lg:grid-cols-12 overflow-hidden z-10">
        {/* Left Column: Architecture Branding (5 cols) */}
        <div className="lg:col-span-5 bg-gradient-to-br from-blue-950/40 via-gray-950/80 to-gray-900/40 p-8 lg:p-10 border-b lg:border-b-0 lg:border-r border-gray-800/80 flex flex-col justify-between relative">
          <div>
            {/* Logo */}
            <div className="flex items-center gap-3 mb-8">
              <div className="relative flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 shadow-xl shadow-blue-500/30">
                <Truck className="w-6 h-6 text-white" />
                <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-cyan-400"></span>
                </span>
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
                  FleetVision<span className="text-cyan-400">AI</span>
                </h1>
                <span className="text-[10px] uppercase font-semibold tracking-wider text-blue-400">
                  Intelligent Fleet Management Platform
                </span>
              </div>
            </div>

            <h2 className="text-2xl font-black tracking-tight text-white leading-tight">
              Vehicle Tracking, Telematics & Trip Management.
            </h2>
            <p className="text-xs text-gray-400 mt-3 leading-relaxed">
              Enterprise 3-tier architecture with role-based access for Administrators, Fleet Operations Managers, and Commercial Drivers.
            </p>

            {/* Core Modules List */}
            <div className="mt-8 space-y-3">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-900/80 border border-gray-800/60">
                <span className="w-6 h-6 rounded-lg bg-blue-500/20 text-blue-400 font-bold flex items-center justify-center text-xs">
                  1
                </span>
                <div>
                  <h4 className="text-xs font-bold text-white">Vehicle & Driver Management</h4>
                  <p className="text-[11px] text-gray-400">Add/Update Vehicles, Drivers & Assignments</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-900/80 border border-gray-800/60">
                <span className="w-6 h-6 rounded-lg bg-cyan-500/20 text-cyan-400 font-bold flex items-center justify-center text-xs">
                  2
                </span>
                <div>
                  <h4 className="text-xs font-bold text-white">Real-Time Tracking & Trips</h4>
                  <p className="text-[11px] text-gray-400">Live GPS tracking, Trip status & dispatch</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-900/80 border border-gray-800/60">
                <span className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center text-xs">
                  3
                </span>
                <div>
                  <h4 className="text-xs font-bold text-white">Alerts, Maintenance & Reports</h4>
                  <p className="text-[11px] text-gray-400">Overspeed alerts, service logs & analytics</p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-gray-800/80 mt-6 flex items-center justify-between text-[11px] text-gray-500">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              MySQL Database Layer
            </span>
            <span>Live GPS / Location Services</span>
          </div>
        </div>

        {/* Right Column: Login Form & 3-Role Fast Login (7 cols) */}
        <div className="lg:col-span-7 p-8 lg:p-12 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-white tracking-tight">Portal Authentication</h3>
                <p className="text-xs text-gray-400 mt-1">Select your role or enter credentials to sign in</p>
              </div>
              <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-semibold">
                SECURE ACCESS
              </span>
            </div>

            {errorMessage && (
              <div className="mb-5 p-3 rounded-xl bg-red-950/60 border border-red-500/40 text-xs text-red-300 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-400"></span>
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Quick 1-Click Role Login Bar - EXACTLY AS IN ARCHITECTURE DIAGRAM */}
            <div className="mb-6 p-4 rounded-2xl bg-gray-950/90 border border-blue-500/30">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  Select System Role (1-Click Access)
                </span>
                <span className="text-[10px] text-gray-400">Architecture Diagram Roles</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {/* 1. Admin */}
                <button
                  type="button"
                  onClick={() => loginAsDemo("admin")}
                  className="p-3 rounded-xl bg-gray-900 border border-gray-700 hover:border-blue-500 hover:bg-blue-950/30 text-left transition-all group"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="p-1 rounded-md bg-blue-500/20 text-blue-400">
                      <Shield className="w-3.5 h-3.5" />
                    </span>
                    <span className="text-xs font-bold text-white group-hover:text-blue-300">
                      Admin
                    </span>
                  </div>
                  <p className="text-[11px] text-blue-400 font-medium">Alex Mercer</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">All 3 Modules</p>
                </button>

                {/* 2. Driver */}
                <button
                  type="button"
                  onClick={() => loginAsDemo("driver")}
                  className="p-3 rounded-xl bg-gray-900 border border-gray-700 hover:border-emerald-500 hover:bg-emerald-950/30 text-left transition-all group"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="p-1 rounded-md bg-emerald-500/20 text-emerald-400">
                      <Truck className="w-3.5 h-3.5" />
                    </span>
                    <span className="text-xs font-bold text-white group-hover:text-emerald-300">
                      Driver
                    </span>
                  </div>
                  <p className="text-[11px] text-emerald-400 font-medium">Marcus Vance</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">Assigned Trips</p>
                </button>

                {/* 3. Manager */}
                <button
                  type="button"
                  onClick={() => loginAsDemo("manager")}
                  className="p-3 rounded-xl bg-gray-900 border border-gray-700 hover:border-purple-500 hover:bg-purple-950/30 text-left transition-all group"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="p-1 rounded-md bg-purple-500/20 text-purple-400">
                      <UserCheck className="w-3.5 h-3.5" />
                    </span>
                    <span className="text-xs font-bold text-white group-hover:text-purple-300">
                      Manager
                    </span>
                  </div>
                  <p className="text-[11px] text-purple-400 font-medium">Dr. S. Reed</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">Tracking & Reports</p>
                </button>
              </div>
            </div>

            {/* Standard Credential Inputs */}
            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@fleetvision.ai"
                    required
                    className="w-full bg-gray-950/80 border border-gray-700/80 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-medium text-gray-300">Password</label>
                  <span className="text-[11px] text-gray-500">Demo: any password</span>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    required
                    className="w-full bg-gray-950/80 border border-gray-700/80 rounded-xl pl-10 pr-10 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-3.5 h-3.5 rounded bg-gray-950 border-gray-700 text-cyan-500"
                  />
                  <span className="text-xs text-gray-400">Remember session</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-semibold text-xs shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition-all active:scale-[0.99] disabled:opacity-50 mt-1"
              >
                {isSubmitting ? (
                  <span>Signing In...</span>
                ) : (
                  <>
                    <span>Sign In to System</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="mt-6 text-center text-xs text-gray-500">
            FleetVisionAI • Multi-Role Fleet Tracking & Operations
          </div>
        </div>
      </div>
    </div>
  );
};

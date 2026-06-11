"use client";

import React, { useState } from "react";
import Link from "next/link";
import { requestPasswordReset } from "@/lib/actions/auth";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setStatus("idle");
    setErrorMessage("");

    try {
      const res = await requestPasswordReset(email);
      if (res.success) {
        setStatus("success");
      } else {
        setStatus("error");
        setErrorMessage(res.error || "Failed to process request. Please try again.");
      }
    } catch (err) {
      setStatus("error");
      setErrorMessage("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col justify-center py-12 sm:px-6 lg:px-8 selection:bg-primary-fixed selection:text-on-primary-fixed">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center mb-6">
          <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center">
            <span className="material-symbols-outlined text-primary text-3xl">lock_reset</span>
          </div>
        </div>
        <h2 className="mt-2 text-center text-[28px] font-bold tracking-tight text-on-surface font-headline-lg">
          Reset your password
        </h2>
        <p className="mt-2 text-center text-sm text-on-surface-variant max-w-[80%] mx-auto">
          Enter your email address and we'll send you a link to reset your password.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-[440px]">
        <div className="bg-surface-container-lowest py-8 px-4 shadow-sm sm:rounded-3xl sm:px-10 border border-outline-variant/30">
          
          {status === "success" ? (
            <div className="text-center animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-secondary/10 mb-4">
                <span className="material-symbols-outlined text-secondary">check</span>
              </div>
              <h3 className="text-lg font-bold text-on-surface mb-2">Check your email</h3>
              <p className="text-sm text-on-surface-variant mb-6">
                If an account exists for <span className="font-semibold text-on-surface">{email}</span>, we've sent instructions to reset your password.
              </p>
              <Link 
                href="/login" 
                className="w-full flex justify-center py-2.5 px-4 border border-outline-variant rounded-xl shadow-sm text-sm font-bold text-on-surface bg-surface hover:bg-surface-container transition-colors"
              >
                Return to login
              </Link>
            </div>
          ) : (
            <form className="space-y-6 animate-in fade-in duration-300" onSubmit={handleSubmit}>
              {status === "error" && (
                <div className="bg-error/10 border-l-4 border-error p-4 rounded-r-lg">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <span className="material-symbols-outlined text-error text-[20px]">error</span>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-error font-medium">{errorMessage}</p>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-sm font-bold text-on-surface mb-1.5">
                  Email address
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full appearance-none rounded-xl border border-outline-variant px-4 py-2.5 placeholder-outline focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm bg-surface text-on-surface transition-colors"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full justify-center rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="material-symbols-outlined animate-spin text-[20px]">progress_activity</span>
                      Sending...
                    </span>
                  ) : (
                    "Send reset link"
                  )}
                </button>
              </div>

              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-outline-variant/50" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="bg-surface-container-lowest px-2 text-on-surface-variant font-medium">Or</span>
                  </div>
                </div>

                <div className="mt-6 text-center">
                  <Link href="/login" className="text-sm font-bold text-primary hover:text-primary/80 transition-colors">
                    Return to login
                  </Link>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { resetPassword } from "@/lib/actions/auth";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const router = useRouter();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  if (!token) {
    return (
      <div className="text-center">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-error/10 mb-4">
          <span className="material-symbols-outlined text-error">error</span>
        </div>
        <h3 className="text-lg font-bold text-on-surface mb-2">Invalid Request</h3>
        <p className="text-sm text-on-surface-variant mb-6">
          No password reset token was provided in the URL. Please request a new link.
        </p>
        <Link 
          href="/forgot-password" 
          className="w-full flex justify-center py-2.5 px-4 border border-outline-variant rounded-xl shadow-sm text-sm font-bold text-on-surface bg-surface hover:bg-surface-container transition-colors"
        >
          Request new link
        </Link>
      </div>
    );
  }

  const validatePassword = (password: string) => {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const isValidLength = password.length >= 8;

    if (!isValidLength) return "Password must be at least 8 characters long.";
    if (!hasUpperCase) return "Password must contain at least one uppercase letter.";
    if (!hasLowerCase) return "Password must contain at least one lowercase letter.";
    if (!hasNumbers) return "Password must contain at least one number.";
    if (!hasSpecialChar) return "Password must contain at least one special character.";
    
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      setStatus("error");
      setErrorMessage("Passwords do not match.");
      return;
    }

    const validationError = validatePassword(newPassword);
    if (validationError) {
      setStatus("error");
      setErrorMessage(validationError);
      return;
    }

    setLoading(true);
    setStatus("idle");
    setErrorMessage("");

    try {
      const res = await resetPassword(token, newPassword);
      if (res.success) {
        setStatus("success");
      } else {
        setStatus("error");
        setErrorMessage(res.error || "Failed to reset password. Please try again.");
      }
    } catch (err) {
      setStatus("error");
      setErrorMessage("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (status === "success") {
    return (
      <div className="text-center animate-in fade-in slide-in-from-bottom-2 duration-300">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-secondary/10 mb-4">
          <span className="material-symbols-outlined text-secondary">check_circle</span>
        </div>
        <h3 className="text-lg font-bold text-on-surface mb-2">Password Reset Successful</h3>
        <p className="text-sm text-on-surface-variant mb-6">
          Your password has been updated securely. You can now log in with your new password.
        </p>
        <Link 
          href="/login" 
          className="w-full flex justify-center py-2.5 px-4 rounded-xl shadow-sm text-sm font-bold text-white bg-primary hover:bg-primary/90 transition-colors"
        >
          Go to login
        </Link>
      </div>
    );
  }

  return (
    <form className="space-y-5 animate-in fade-in duration-300" onSubmit={handleSubmit}>
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
        <label htmlFor="new-password" className="block text-sm font-bold text-on-surface mb-1.5">
          New Password
        </label>
        <div className="mt-1">
          <input
            id="new-password"
            name="new-password"
            type="password"
            required
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="block w-full appearance-none rounded-xl border border-outline-variant px-4 py-2.5 placeholder-outline focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm bg-surface text-on-surface transition-colors"
            placeholder="••••••••"
          />
        </div>
        <p className="text-[11px] text-on-surface-variant mt-1.5">
          Must be at least 8 characters with 1 uppercase, 1 lowercase, 1 number, and 1 special character.
        </p>
      </div>

      <div>
        <label htmlFor="confirm-password" className="block text-sm font-bold text-on-surface mb-1.5">
          Confirm Password
        </label>
        <div className="mt-1">
          <input
            id="confirm-password"
            name="confirm-password"
            type="password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="block w-full appearance-none rounded-xl border border-outline-variant px-4 py-2.5 placeholder-outline focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm bg-surface text-on-surface transition-colors"
            placeholder="••••••••"
          />
        </div>
      </div>

      <div className="pt-2">
        <button
          type="submit"
          disabled={loading}
          className="flex w-full justify-center rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="material-symbols-outlined animate-spin text-[20px]">progress_activity</span>
              Resetting...
            </span>
          ) : (
            "Reset Password"
          )}
        </button>
      </div>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-surface flex flex-col justify-center py-12 sm:px-6 lg:px-8 selection:bg-primary-fixed selection:text-on-primary-fixed">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center mb-6">
          <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center">
            <span className="material-symbols-outlined text-primary text-3xl">password</span>
          </div>
        </div>
        <h2 className="mt-2 text-center text-[28px] font-bold tracking-tight text-on-surface font-headline-lg">
          Set new password
        </h2>
        <p className="mt-2 text-center text-sm text-on-surface-variant max-w-[80%] mx-auto">
          Please enter your new password below.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-[440px]">
        <div className="bg-surface-container-lowest py-8 px-4 shadow-sm sm:rounded-3xl sm:px-10 border border-outline-variant/30">
          <Suspense fallback={<div className="py-12 flex justify-center"><span className="material-symbols-outlined animate-spin text-primary text-3xl">progress_activity</span></div>}>
            <ResetPasswordForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

import React from "react";
import Link from "next/link";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-surface p-8 max-w-4xl mx-auto">
      <Link href="/login" className="text-primary hover:underline font-bold text-sm mb-8 inline-block">&larr; Back to Login</Link>
      <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
      <p className="text-on-surface-variant mb-4">Last updated: June 2026</p>
      <div className="space-y-6 text-on-surface">
        <section>
          <h2 className="text-xl font-bold mb-2">1. Information We Collect</h2>
          <p>We collect information you provide directly to us, such as when you create or modify your account, request on-demand services, contact customer support, or otherwise communicate with us. This information may include: name, email, phone number, postal address, profile picture, payment method, and other information you choose to provide.</p>
        </section>
        <section>
          <h2 className="text-xl font-bold mb-2">2. How We Use Information</h2>
          <p>We use the information we collect about you to provide, maintain, and improve our services, such as to facilitate payments, send receipts, provide products and services you request, develop new features, provide customer support to Users and Vendors, develop safety features, authenticate users, and send product updates and administrative messages.</p>
        </section>
      </div>
    </div>
  );
}

import React from "react";
import Link from "next/link";

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-surface p-8 max-w-4xl mx-auto">
      <Link href="/login" className="text-primary hover:underline font-bold text-sm mb-8 inline-block">&larr; Back to Login</Link>
      <h1 className="text-3xl font-bold mb-4">Terms of Service</h1>
      <p className="text-on-surface-variant mb-4">Last updated: June 2026</p>
      <div className="space-y-6 text-on-surface">
        <section>
          <h2 className="text-xl font-bold mb-2">1. Agreement to Terms</h2>
          <p>By viewing or using this website, which can be accessed at vendorbridge.com, you are agreeing to be bound by these Website Terms and Conditions of Use and agree that you are responsible for the agreement with any applicable local laws. If you disagree with any of these terms, you are prohibited from accessing this site.</p>
        </section>
      </div>
    </div>
  );
}

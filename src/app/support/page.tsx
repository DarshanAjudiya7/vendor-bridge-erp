import React from "react";
import Link from "next/link";

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-surface p-8 max-w-4xl mx-auto text-center mt-20">
      <Link href="/login" className="text-primary hover:underline font-bold text-sm mb-8 inline-block">&larr; Back to Login</Link>
      <h1 className="text-3xl font-bold mb-4">How can we help you?</h1>
      <p className="text-on-surface-variant mb-8">Reach out to our dedicated support team.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
        <div className="p-6 border border-outline-variant rounded-xl shadow-sm">
          <span className="material-symbols-outlined text-[48px] text-primary mb-4">mail</span>
          <h3 className="font-bold text-lg">Email Support</h3>
          <p className="text-sm text-on-surface-variant mt-2">Send us an email anytime and we will get back to you within 24 hours.</p>
          <p className="font-mono mt-4 font-bold">support@vendorbridge.com</p>
        </div>
        <div className="p-6 border border-outline-variant rounded-xl shadow-sm">
          <span className="material-symbols-outlined text-[48px] text-primary mb-4">call</span>
          <h3 className="font-bold text-lg">Phone Support</h3>
          <p className="text-sm text-on-surface-variant mt-2">Available Mon-Fri, 9am to 6pm EST.</p>
          <p className="font-mono mt-4 font-bold">1-800-VENDOR-5</p>
        </div>
      </div>
    </div>
  );
}

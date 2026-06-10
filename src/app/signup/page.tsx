"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SignUpPage() {
  const [step, setStep] = useState(1);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const router = useRouter();

  const handleNextStep = () => {
    setStep(2);
  };

  const handlePrevStep = () => {
    setStep(1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Registration data submitted to VendorBridge Enterprise Cluster.');
    router.push('/login');
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white text-on-surface font-body-md selection:bg-secondary-container">
      {/* Left Side: Visual/Branding Section */}
      <div className="hidden md:flex md:w-5/12 bg-surface-container-low relative overflow-hidden p-12 flex-col justify-between">
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <span className="material-symbols-outlined text-white" style={{ fontVariationSettings: "'FILL' 1" }}>hub</span>
            </div>
            <h1 className="font-headline-md text-headline-md font-bold text-primary">VendorBridge</h1>
          </div>
          <div className="mt-24 max-w-md">
            <h2 className="font-display-lg text-[48px] text-on-background font-bold leading-tight tracking-tight">Modernizing the Global Supply Chain.</h2>
            <p className="mt-6 font-body-lg text-body-lg text-on-surface-variant">Join the enterprise ERP ecosystem designed for high-trust vendor relations and precision procurement.</p>
          </div>
        </div>
        
        <div className="relative z-10 flex items-center gap-4">
          <div className="flex -space-x-3">
            <img alt="User" className="w-10 h-10 rounded-full border-2 border-white object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAS5rt_nxe61gECY_nD_fi-cRA3EINaC1Ii_n-5gc5ltuxb6RI2T5gdrTZ_WPGnhL5Zfmj30FiHaq5keEVF7WKBxSU17-V3oi73Vy9pVL1HAj9EPgPIdJT2tshcrEtAoEqV5_aFWqnx713NNfuO5InMgBqtMJEIcS-YVOAX28_h2oXVIY2TBG0h8zLjXYQKwFnUE_6m_CF8jxksb4LvQ4vX1E292S2Gt8IgOE2HDwPI3fiDCQpy3SLZPOyXKYRlj5I5Y0vq-RZceU0"/>
            <img alt="User" className="w-10 h-10 rounded-full border-2 border-white object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCi7uBE7gLPZc_vUhmG7dUoXsRsanFJjzTydz5kk6Uz1NHCt0XdbQHECtXxleT_QTNjVWofcw2Sa-qIhAZ4h_NBmAltZ7Aa7gFIzvI4M_GQxL43nLz4AEK_5rTXRWWwbuC3ggLztrjcAbhr1HTn3Ja27nW4gnoxwP73QFXXtjgMlmDSDL6j8hcWop1EV0-xKx0c4yPv02K7hHuGJEq_ar-qJPFUTNrEr6-CM8zQMPcwpIXGxRwyQ-SNb7617vKvm6_Ru-fdxRaI3Yg"/>
            <img alt="User" className="w-10 h-10 rounded-full border-2 border-white object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAOQqmYFvMvKhN6h5mt_7OSFC_rKKG8WKFvVWD1WDC-czUn9ownHDHuMVSWbTAij0O81kSYGlf5cE76CwQWlcXr5OCUtSG3IbBh9dgKM2wkofi2wk9rP-odg4AaDbwu6rcmXu5BKN2l8eBZJt6mTr6ajvIWGnK9o5wcFDVSSM2erSl_L3XDZN_Lql0VvWsKTz1PE0bf4njiwCw-ozPaqfi7pQRBfRdL0qz2fmvF7M3EHfKn9lcCyj18mWvVHTmFSHJ3dUlfqiS63QY"/>
          </div>
          <p className="font-label-md text-[12px] font-medium text-on-surface-variant">Trusted by 2,400+ Enterprise Procurement Officers</p>
        </div>

        {/* Decorative Illustration */}
        <div className="absolute bottom-0 right-0 w-full h-2/3 pointer-events-none opacity-40">
          <img alt="Business Data" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB3_cJpuYE-YPyxA8tpRhnh63EWHbPg42j89VgXSOVCJUq9shAhuY83pEun9l3Q8LtijHHei5yvcFs0R-TM-Rs5kKTuQyIN-oD4mncvgB814DLqaBYLhLRN_rqq2oZikkShFwN1oaX-7N8S_KYDhhMgFt1eGcnHTixKVprjxef68iVdDmrFdWCn1Iq2J4kOcyNQp9JdX8QG-CoWAPvUSjI9UNG5eRNee43clrSFk7WjK2cXj_9x1gQhTDRDTaxp5l9BYFIGSiAmpKE"/>
        </div>
      </div>

      {/* Right Side: Signup Form */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-16 lg:p-24 overflow-y-auto bg-white">
        <div className="w-full max-w-xl">
          {/* Progress Indicator */}
          <div className="mb-12">
            <div className="flex justify-between items-center mb-4">
              <span className="font-label-md text-[12px] text-primary font-bold">
                {step === 1 ? 'STEP 1: PERSONAL DETAILS' : 'STEP 2: ACCOUNT ROLE'}
              </span>
              <span className="font-label-md text-[12px] text-on-surface-variant font-medium">
                {step} of 2
              </span>
            </div>
            <div className="h-1 w-full bg-surface-container rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-400 ease-[cubic-bezier(0.4,0,0.2,1)]" 
                style={{ width: step === 1 ? '50%' : '100%' }}
              ></div>
            </div>
          </div>

          {/* Form Content */}
          <form className="space-y-8" onSubmit={handleSubmit}>
            
            {/* Step 1: Basic Info */}
            <div className={`space-y-6 ${step !== 1 ? 'hidden' : ''}`}>
              <div className="space-y-2">
                <h3 className="font-headline-md text-[24px] font-semibold text-on-background">Create your account</h3>
                <p className="font-body-md text-body-md text-on-surface-variant">Enter your professional details to begin the onboarding process.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="font-label-md text-[12px] font-medium text-on-surface">Full Name</label>
                  <input required className="w-full h-12 px-4 border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-body-md bg-transparent" placeholder="e.g. Sarah Mitchell" type="text"/>
                </div>
                <div className="space-y-2">
                  <label className="font-label-md text-[12px] font-medium text-on-surface">Work Email</label>
                  <input required className="w-full h-12 px-4 border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-body-md bg-transparent" placeholder="sarah@company.com" type="email"/>
                </div>
                <div className="space-y-2">
                  <label className="font-label-md text-[12px] font-medium text-on-surface">Company Name</label>
                  <input required className="w-full h-12 px-4 border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-body-md bg-transparent" placeholder="Enterprise Corp Ltd." type="text"/>
                </div>
                <div className="space-y-2">
                  <label className="font-label-md text-[12px] font-medium text-on-surface">Phone Number</label>
                  <input required className="w-full h-12 px-4 border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-body-md bg-transparent" placeholder="+1 (555) 000-0000" type="tel"/>
                </div>
              </div>
              
              <button 
                type="button"
                className="w-full h-14 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 shadow-sm active:scale-[0.98]"
                onClick={handleNextStep}
              >
                Continue to Role Selection
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>
            </div>

            {/* Step 2: Role Selection */}
            <div className={`space-y-6 ${step !== 2 ? 'hidden' : ''}`}>
              <div className="space-y-2">
                <h3 className="font-headline-md text-[24px] font-semibold text-on-background">What is your role?</h3>
                <p className="font-body-md text-body-md text-on-surface-variant">This helps us customize your workspace and notification settings.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Admin */}
                <div 
                  className={`p-4 border rounded-xl cursor-pointer hover:bg-surface-container-low transition-all group flex items-start gap-4 active:scale-[0.98] ${selectedRole === 'Admin' ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-outline-variant'}`}
                  onClick={() => setSelectedRole('Admin')}
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${selectedRole === 'Admin' ? 'bg-primary text-white' : 'bg-surface-container-high text-primary group-hover:bg-primary group-hover:text-white'}`}>
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>admin_panel_settings</span>
                  </div>
                  <div>
                    <h4 className="font-label-md text-[12px] font-bold">Admin</h4>
                    <p className="text-[10px] text-on-surface-variant mt-1 leading-relaxed">Full access to billing, users, and global settings.</p>
                  </div>
                </div>

                {/* Procurement Officer */}
                <div 
                  className={`p-4 border rounded-xl cursor-pointer hover:bg-surface-container-low transition-all group flex items-start gap-4 active:scale-[0.98] ${selectedRole === 'Procurement Officer' ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-outline-variant'}`}
                  onClick={() => setSelectedRole('Procurement Officer')}
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${selectedRole === 'Procurement Officer' ? 'bg-primary text-white' : 'bg-surface-container-high text-primary group-hover:bg-primary group-hover:text-white'}`}>
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>request_quote</span>
                  </div>
                  <div>
                    <h4 className="font-label-md text-[12px] font-bold">Procurement Officer</h4>
                    <p className="text-[10px] text-on-surface-variant mt-1 leading-relaxed">Manage RFQs, POs, and vendor evaluations.</p>
                  </div>
                </div>

                {/* Vendor */}
                <div 
                  className={`p-4 border rounded-xl cursor-pointer hover:bg-surface-container-low transition-all group flex items-start gap-4 active:scale-[0.98] ${selectedRole === 'Vendor' ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-outline-variant'}`}
                  onClick={() => setSelectedRole('Vendor')}
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${selectedRole === 'Vendor' ? 'bg-primary text-white' : 'bg-surface-container-high text-primary group-hover:bg-primary group-hover:text-white'}`}>
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>storefront</span>
                  </div>
                  <div>
                    <h4 className="font-label-md text-[12px] font-bold">Vendor</h4>
                    <p className="text-[10px] text-on-surface-variant mt-1 leading-relaxed">Submit bids, manage catalogs, and invoices.</p>
                  </div>
                </div>

                {/* Manager */}
                <div 
                  className={`p-4 border rounded-xl cursor-pointer hover:bg-surface-container-low transition-all group flex items-start gap-4 active:scale-[0.98] ${selectedRole === 'Manager' ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-outline-variant'}`}
                  onClick={() => setSelectedRole('Manager')}
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${selectedRole === 'Manager' ? 'bg-primary text-white' : 'bg-surface-container-high text-primary group-hover:bg-primary group-hover:text-white'}`}>
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>analytics</span>
                  </div>
                  <div>
                    <h4 className="font-label-md text-[12px] font-bold">Manager</h4>
                    <p className="text-[10px] text-on-surface-variant mt-1 leading-relaxed">View reports, approve requests, and monitor KPIs.</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  type="button"
                  className="flex-1 h-14 border border-outline text-on-surface font-bold rounded-lg hover:bg-surface-container transition-colors active:scale-[0.98]"
                  onClick={handlePrevStep}
                >
                  Back
                </button>
                <button 
                  type="submit"
                  disabled={!selectedRole}
                  className="flex-[2] h-14 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
                >
                  Complete Registration
                  <span className="material-symbols-outlined">how_to_reg</span>
                </button>
              </div>
            </div>

            <div className="text-center pt-4">
              <p className="font-body-md text-body-md text-on-surface-variant">
                Already have an account?{' '}
                <Link href="/login" className="text-secondary font-bold hover:underline">
                  Sign in
                </Link>
              </p>
            </div>
          </form>

          <div className="mt-12 flex justify-center gap-6 text-[12px] text-on-surface-variant font-medium">
            <Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-primary transition-colors">Terms of Service</Link>
            <Link href="#" className="hover:text-primary transition-colors">Support Hub</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { registerUser } from "@/lib/actions/auth";
import { toast } from "sonner";

export default function SignupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("VENDOR");
  const [avatar, setAvatar] = useState<string | null>(null);

  // Field visibility states
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    // Subtle parallax to the left side illustration card
    const handleMouseMove = (e: MouseEvent) => {
      const card = document.querySelector('.glass-effect') as HTMLElement;
      if (!card) return;
      const xAxis = (window.innerWidth / 2 - e.pageX) / 45;
      const yAxis = (window.innerHeight / 2 - e.pageY) / 45;
      card.style.transform = `rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
    };
    if (window.matchMedia("(pointer: fine)").matches) {
      document.addEventListener('mousemove', handleMouseMove);
    }
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Password strength check helper
  const checkPasswordStrength = (pass: string) => {
    const checks = {
      length: pass.length >= 8,
      hasUpper: /[A-Z]/.test(pass),
      hasNumber: /[0-9]/.test(pass),
      hasSpecial: /[^A-Za-z0-9]/.test(pass),
    };
    const score = Object.values(checks).filter(Boolean).length;
    return { checks, score };
  };

  const strength = checkPasswordStrength(password);

  const getStrengthLabel = (score: number) => {
    if (score === 0) return "Very Weak";
    if (score === 1) return "Weak";
    if (score === 2) return "Fair";
    if (score === 3) return "Good";
    return "Strong";
  };

  const getStrengthColor = (score: number) => {
    if (score <= 1) return "bg-red-500";
    if (score === 2) return "bg-yellow-500";
    if (score === 3) return "bg-blue-500";
    return "bg-green-500";
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Image file size must be less than 2MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Client-side validations
    if (!name.trim() || !username.trim() || !email.trim() || !password || !confirmPassword) {
      setError("All required fields must be filled out.");
      setLoading(false);
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      setError("Please enter a valid email address.");
      setLoading(false);
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      setLoading(false);
      return;
    }

    if (strength.score < 3) {
      setError("Please choose a stronger password (must satisfy at least 3 requirements).");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("username", username.toLowerCase().trim());
      formData.append("email", email.toLowerCase().trim());
      formData.append("password", password);
      formData.append("role", role);
      
      if (phone) formData.append("phone", phone);
      if (companyName) formData.append("companyName", companyName);
      if (avatar) formData.append("avatarUrl", avatar);

      const result = await registerUser(formData);
      if (result.success) {
        toast.success("Account created successfully! Please log in.");
        router.push("/login");
      } else {
        setError(result.error || "Registration failed. Please try again.");
      }
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "An unexpected error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen w-full font-body-md text-on-surface bg-surface overflow-hidden">
      {/* Left Side: Abstract Pattern & Branding */}
      <section className="hidden lg:flex lg:w-1/2 relative bg-primary-container items-center justify-center p-container-margin overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-primary opacity-20 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-[-5%] left-[-5%] w-[400px] h-[400px] bg-secondary opacity-20 rounded-full blur-[100px]"></div>
        </div>
        {/* Grid Pattern Overlay */}
        <div 
          className="absolute inset-0 opacity-[0.03] z-0" 
          style={{ backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)", backgroundSize: "24px 24px" }}
        ></div>
        
        <div className="relative z-10 w-full max-w-lg text-on-primary-container">
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-on-primary-container rounded-xl flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>hub</span>
              </div>
              <h1 className="font-headline-lg text-[32px] font-semibold tracking-tight">VendorBridge</h1>
            </div>
            <div className="space-y-6">
              <h2 className="font-display-lg text-[44px] font-bold leading-tight">Join the VendorBridge Network.</h2>
              <p className="font-body-lg text-[16px] text-on-primary-container/80 max-w-md">
                Register today to access our digital procurement portal, submit quotations, track purchase orders, and manage operations in real-time.
              </p>
            </div>
          </div>
          
          {/* Glass Illustration Card */}
          <div 
            className="glass-effect rounded-2xl p-8 relative overflow-hidden group"
            style={{ background: "rgba(255, 255, 255, 0.1)", backdropFilter: "blur(12px)", border: "1px solid rgba(255, 255, 255, 0.2)" }}
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center">
                <span className="material-symbols-outlined text-on-primary-fixed text-xl">verified_user</span>
              </div>
              <div>
                <p className="font-label-md text-[12px] font-medium uppercase tracking-wider opacity-70">Secured Onboarding</p>
                <p className="font-title-lg text-[18px] font-semibold">Enterprise Grade Compliance</p>
              </div>
            </div>
            <p className="text-sm leading-relaxed opacity-95">
              All transaction records, RFQs, invoices, and profile configurations are strictly isolated on a per-user basis.
            </p>
          </div>
        </div>
        
        {/* Image Background */}
        <div className="absolute inset-0 -z-10 opacity-40">
          <img 
            alt="Office background" 
            className="w-full h-full object-cover" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuC4DQx8s_aC1Ziz2DD28ZsA-6_0y1i-5iONuhfigAXFIgCiKUE-0SYyn7aROtz_5mhF9ECBNA-lFWJFP-JNP1O04u8UGcTYMUrEC_uRbjcMofFIpJ3usN7nT6B_qpcZn05O_r_wxnCT26FROC84V5_DOrbA0s-PgRb_YppAB3SJHsxBwlyO6uld_Drr8ED0eWqkQxTEIQjV3qVSEoVWFpuPtFayrA86gUa-jdUG8jD0bleVW0IYLxe-mbmEy6s7vWD_AKgILfzLwzo"
          />
        </div>
      </section>

      {/* Right Side: Signup Form */}
      <section className="w-full lg:w-1/2 bg-surface-container-lowest flex items-center justify-center p-8 md:p-12 overflow-y-auto max-h-screen">
        <div className="w-full max-w-md py-6">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <span className="material-symbols-outlined text-primary text-3xl">hub</span>
            <span className="font-headline-md text-[24px] text-primary font-bold">VendorBridge</span>
          </div>
          
          <div className="mb-6">
            <h2 className="font-headline-md text-[24px] font-semibold text-on-surface mb-1">Create an Account</h2>
            <p className="font-body-md text-[14px] text-on-surface-variant">Sign up to configure your workspace profile.</p>
          </div>
          
          <form className="space-y-4" onSubmit={handleSubmit}>
            {error && (
              <div className="p-3 text-sm text-white bg-red-600 rounded-md">
                {error}
              </div>
            )}

            {/* Profile Picture Uploader */}
            <div className="flex flex-col items-center gap-2 pb-2">
              <div className="relative w-20 h-20 rounded-full bg-surface border-2 border-outline-variant hover:border-primary transition-all overflow-hidden group">
                {avatar ? (
                  <img src={avatar} alt="Avatar Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-outline group-hover:text-primary transition-colors">
                    <span className="material-symbols-outlined text-2xl">add_a_photo</span>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  title="Upload profile picture"
                />
              </div>
              <span className="font-label-md text-[11px] text-on-surface-variant">Profile Picture (Optional)</span>
            </div>

            {/* Account Type Grid Selector */}
            <div className="space-y-2">
              <label className="font-label-md text-[13px] sm:text-[12px] font-medium text-on-surface-variant ml-1">Account Type</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {[
                  { value: "VENDOR", label: "Vendor", icon: "storefront" },
                  { value: "PROCUREMENT_OFFICER", label: "Procurement", icon: "assignment" },
                  { value: "MANAGER", label: "Manager", icon: "supervisor_account" }
                ].map((item) => (
                  <label
                    key={item.value}
                    className={`flex sm:flex-col items-center sm:justify-center p-3 rounded-xl sm:rounded-lg border cursor-pointer transition-all active:scale-[0.98] ${
                      role === item.value
                        ? "border-primary bg-primary/10 text-primary font-semibold shadow-sm"
                        : "border-outline-variant hover:border-outline text-on-surface-variant bg-surface"
                    }`}
                  >
                    <input
                      type="radio"
                      name="role"
                      value={item.value}
                      checked={role === item.value}
                      onChange={(e) => setRole(e.target.value)}
                      className="sr-only"
                    />
                    <span className="material-symbols-outlined text-xl sm:text-lg mr-3 sm:mr-0 sm:mb-1">{item.icon}</span>
                    <span className="text-[14px] sm:text-xs flex-1 sm:flex-none">{item.label}</span>
                    {role === item.value && <span className="material-symbols-outlined text-lg sm:hidden">check_circle</span>}
                  </label>
                ))}
              </div>
            </div>

            {/* Name Field */}
            <div className="space-y-1">
              <label className="font-label-md text-[13px] sm:text-[12px] font-medium text-on-surface-variant ml-1" htmlFor="name">Full Name *</label>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors">person</span>
                <input 
                  className="w-full pl-11 pr-4 py-2.5 sm:py-2 bg-surface rounded-xl sm:rounded-lg border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-body-md text-[16px] sm:text-sm" 
                  id="name" 
                  placeholder="John Doe" 
                  required 
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>

            {/* Username Field */}
            <div className="space-y-1">
              <label className="font-label-md text-[13px] sm:text-[12px] font-medium text-on-surface-variant ml-1" htmlFor="username">Username *</label>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors">badge</span>
                <input 
                  className="w-full pl-11 pr-4 py-2.5 sm:py-2 bg-surface rounded-xl sm:rounded-lg border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-body-md text-[16px] sm:text-sm" 
                  id="username" 
                  placeholder="johndoe" 
                  required 
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-1">
              <label className="font-label-md text-[13px] sm:text-[12px] font-medium text-on-surface-variant ml-1" htmlFor="email">Email Address *</label>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors">mail</span>
                <input 
                  className="w-full pl-11 pr-4 py-2.5 sm:py-2 bg-surface rounded-xl sm:rounded-lg border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-body-md text-[16px] sm:text-sm" 
                  id="email" 
                  placeholder="name@example.com" 
                  required 
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  inputMode="email"
                />
              </div>
            </div>

            {/* Optional Fields Group */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-2">
              {/* Phone Field */}
              <div className="space-y-1">
                <label className="font-label-md text-[13px] sm:text-[12px] font-medium text-on-surface-variant ml-1" htmlFor="phone">Phone Number</label>
                <div className="relative group">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors">phone</span>
                  <input 
                    className="w-full pl-10 pr-2 py-2.5 sm:py-2 bg-surface rounded-xl sm:rounded-lg border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-body-md text-[16px] sm:text-sm" 
                    id="phone" 
                    placeholder="+1 (555) 000-0000" 
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </div>

              {/* Company Name Field */}
              <div className="space-y-1">
                <label className="font-label-md text-[13px] sm:text-[12px] font-medium text-on-surface-variant ml-1" htmlFor="companyName">
                  Company {role === "VENDOR" ? "*" : ""}
                </label>
                <div className="relative group">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors">store</span>
                  <input 
                    className="w-full pl-10 pr-2 py-2.5 sm:py-2 bg-surface rounded-xl sm:rounded-lg border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-body-md text-[16px] sm:text-sm" 
                    id="companyName" 
                    placeholder="Acme Corp" 
                    required={role === "VENDOR"}
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1">
              <label className="font-label-md text-[13px] sm:text-[12px] font-medium text-on-surface-variant ml-1" htmlFor="password">Password *</label>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors">lock</span>
                <input 
                  className="w-full pl-11 pr-12 py-2.5 sm:py-2 bg-surface rounded-xl sm:rounded-lg border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-body-md text-[16px] sm:text-sm" 
                  id="password" 
                  placeholder="••••••••" 
                  required 
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button 
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface transition-colors p-2 rounded-full active:bg-surface-container" 
                  onClick={() => setShowPassword(!showPassword)} 
                  type="button"
                >
                  <span className="material-symbols-outlined text-[20px] sm:text-lg">{showPassword ? 'visibility_off' : 'visibility'}</span>
                </button>
              </div>
            </div>

            {/* Real-time Password Strength Meter */}
            {password && (
              <div className="space-y-1.5 py-1">
                <div className="flex justify-between items-center text-xs ml-1">
                  <span className="text-on-surface-variant font-medium">Password Strength:</span>
                  <span className={`font-semibold text-${getStrengthColor(strength.score).replace('bg-', '')}`}>
                    {getStrengthLabel(strength.score)}
                  </span>
                </div>
                <div className="flex gap-1 h-1.5 w-full bg-surface-container-high rounded-full overflow-hidden">
                  {[1, 2, 3, 4].map((index) => (
                    <div
                      key={index}
                      className={`h-full flex-1 rounded-full transition-all duration-300 ${
                        strength.score >= index ? getStrengthColor(strength.score) : "bg-outline-variant"
                      }`}
                    />
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-x-2 gap-y-1 mt-1 ml-1 text-[11px] text-on-surface-variant">
                  <div className="flex items-center gap-1">
                    <span className={`material-symbols-outlined text-[13px] ${strength.checks.length ? 'text-green-600 font-bold' : 'text-outline'}`}>
                      {strength.checks.length ? 'check_circle' : 'circle'}
                    </span>
                    <span>Min. 8 characters</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className={`material-symbols-outlined text-[13px] ${strength.checks.hasUpper ? 'text-green-600 font-bold' : 'text-outline'}`}>
                      {strength.checks.hasUpper ? 'check_circle' : 'circle'}
                    </span>
                    <span>Uppercase letter</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className={`material-symbols-outlined text-[13px] ${strength.checks.hasNumber ? 'text-green-600 font-bold' : 'text-outline'}`}>
                      {strength.checks.hasNumber ? 'check_circle' : 'circle'}
                    </span>
                    <span>At least one number</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className={`material-symbols-outlined text-[13px] ${strength.checks.hasSpecial ? 'text-green-600 font-bold' : 'text-outline'}`}>
                      {strength.checks.hasSpecial ? 'check_circle' : 'circle'}
                    </span>
                    <span>Special character</span>
                  </div>
                </div>
              </div>
            )}

            {/* Confirm Password Field */}
            <div className="space-y-1">
              <label className="font-label-md text-[13px] sm:text-[12px] font-medium text-on-surface-variant ml-1" htmlFor="confirmPassword">Confirm Password *</label>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors">lock_reset</span>
                <input 
                  className="w-full pl-11 pr-12 py-2.5 sm:py-2 bg-surface rounded-xl sm:rounded-lg border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-body-md text-[16px] sm:text-sm" 
                  id="confirmPassword" 
                  placeholder="••••••••" 
                  required 
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button 
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface transition-colors p-2 rounded-full active:bg-surface-container" 
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)} 
                  type="button"
                >
                  <span className="material-symbols-outlined text-[20px] sm:text-lg">{showConfirmPassword ? 'visibility_off' : 'visibility'}</span>
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button 
              className={`w-full bg-primary hover:bg-primary-container text-white font-title-lg text-[16px] font-semibold py-3.5 mt-2 rounded-lg shadow-sm hover:shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-2 ${loading ? 'opacity-80 cursor-not-allowed' : ''}`}
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <><span className="material-symbols-outlined animate-spin text-lg">progress_activity</span> Creating Account...</>
              ) : (
                <>Register Account <span className="material-symbols-outlined">arrow_forward</span></>
              )}
            </button>
          </form>
          
          <div className="mt-6 pt-6 border-t border-outline-variant text-center">
            <p className="font-body-md text-[14px] text-on-surface-variant">
              Already have an account?{" "}
              <Link className="text-secondary font-semibold hover:underline decoration-2 underline-offset-4 ml-1 transition-all" href="/login">
                Login
              </Link>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

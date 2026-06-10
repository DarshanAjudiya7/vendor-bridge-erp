"use client";

import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@vendorbridge.com");
  const [password, setPassword] = useState("admin");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    // Subtle parallax to the left side illustration card
    const handleMouseMove = (e: MouseEvent) => {
      const card = document.querySelector('.glass-effect') as HTMLElement;
      if (!card) return;
      const xAxis = (window.innerWidth / 2 - e.pageX) / 45;
      const yAxis = (window.innerHeight / 2 - e.pageY) / 45;
      card.style.transform = `rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
    };
    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      setError("Invalid credentials");
      setLoading(false);
    } else {
      router.push("/portal");
      router.refresh();
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
              <h2 className="font-display-lg text-[48px] font-bold leading-tight">Streamlining Enterprise Supply Chains.</h2>
              <p className="font-body-lg text-[16px] text-on-primary-container/80 max-w-md">
                Experience the next generation of procurement and vendor management. Efficient, transparent, and built for modern enterprise scale.
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
                <span className="material-symbols-outlined text-on-primary-fixed text-xl">analytics</span>
              </div>
              <div>
                <p className="font-label-md text-[12px] font-medium uppercase tracking-wider opacity-70">Real-time Insights</p>
                <p className="font-title-lg text-[18px] font-semibold">Vendor Performance Index</p>
              </div>
            </div>
            {/* Decorative Chart Placeholder */}
            <div className="h-32 w-full flex items-end gap-2 px-2">
              <div className="flex-1 bg-primary-fixed/30 rounded-t-lg h-[40%] transition-all duration-500 group-hover:h-[60%]"></div>
              <div className="flex-1 bg-primary-fixed/50 rounded-t-lg h-[70%] transition-all duration-500 group-hover:h-[40%]"></div>
              <div className="flex-1 bg-primary-fixed/30 rounded-t-lg h-[50%] transition-all duration-500 group-hover:h-[80%]"></div>
              <div className="flex-1 bg-primary-fixed/70 rounded-t-lg h-[90%] transition-all duration-500 group-hover:h-[50%]"></div>
              <div className="flex-1 bg-primary-fixed/40 rounded-t-lg h-[60%] transition-all duration-500 group-hover:h-[70%]"></div>
              <div className="flex-1 bg-primary-fixed/20 rounded-t-lg h-[30%] transition-all duration-500 group-hover:h-[45%]"></div>
            </div>
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

      {/* Right Side: Login Form */}
      <section className="w-full lg:w-1/2 bg-surface-container-lowest flex items-center justify-center p-8 md:p-16">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-2 mb-12">
            <span className="material-symbols-outlined text-primary text-3xl">hub</span>
            <span className="font-headline-md text-[24px] text-primary font-bold">VendorBridge</span>
          </div>
          
          <div className="mb-10">
            <h2 className="font-headline-md text-[24px] font-semibold text-on-surface mb-2">Login to VendorBridge</h2>
            <p className="font-body-md text-[14px] text-on-surface-variant">Access your enterprise dashboard and manage operations.</p>
          </div>
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="p-3 text-sm text-white bg-red-600 rounded-md">
                {error}
              </div>
            )}
            
            {/* Email Field */}
            <div className="space-y-2">
              <label className="font-label-md text-[12px] font-medium text-on-surface-variant ml-1" htmlFor="email">Email Address</label>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors">mail</span>
                <input 
                  className="w-full pl-11 pr-4 py-3 bg-surface rounded-lg border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-body-md" 
                  id="email" 
                  name="email" 
                  placeholder="name@company.com" 
                  required 
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            
            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="font-label-md text-[12px] font-medium text-on-surface-variant" htmlFor="password">Password</label>
                <a className="font-label-md text-[12px] text-secondary hover:underline transition-all" href="#">Forgot password?</a>
              </div>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors">lock</span>
                <input 
                  className="w-full pl-11 pr-12 py-3 bg-surface rounded-lg border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-body-md" 
                  id="password" 
                  name="password" 
                  placeholder="••••••••" 
                  required 
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button 
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface transition-colors" 
                  onClick={() => setShowPassword(!showPassword)} 
                  type="button"
                >
                  <span className="material-symbols-outlined">{showPassword ? 'visibility_off' : 'visibility'}</span>
                </button>
              </div>
            </div>
            
            {/* Remember Me */}
            <div className="flex items-center gap-2 py-2">
              <input className="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary bg-surface" id="remember" type="checkbox"/>
              <label className="font-body-md text-[14px] text-on-surface-variant cursor-pointer select-none" htmlFor="remember">Remember this device for 30 days</label>
            </div>
            
            {/* Login Button */}
            <button 
              className={`w-full bg-primary hover:bg-primary-container text-on-primary font-title-lg text-[18px] font-semibold py-4 rounded-lg shadow-sm hover:shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-2 ${loading ? 'opacity-80 cursor-not-allowed' : ''}`}
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <><span className="material-symbols-outlined animate-spin">progress_activity</span> Authenticating...</>
              ) : (
                <>Login <span className="material-symbols-outlined">arrow_forward</span></>
              )}
            </button>
          </form>
          
          <div className="mt-8 pt-8 border-t border-outline-variant text-center">
            <p className="font-body-md text-[14px] text-on-surface-variant">
              Don't have an account? 
              <a className="text-secondary font-semibold hover:underline decoration-2 underline-offset-4 ml-1 transition-all" href="#">Sign up</a>
            </p>
          </div>
          
          {/* Footer Links */}
          <div className="mt-16 flex flex-wrap justify-center gap-x-6 gap-y-2 opacity-60">
            <a className="font-label-md text-[12px] hover:text-primary transition-colors" href="#">Privacy Policy</a>
            <a className="font-label-md text-[12px] hover:text-primary transition-colors" href="#">Terms of Service</a>
            <a className="font-label-md text-[12px] hover:text-primary transition-colors" href="#">Support</a>
          </div>
        </div>
      </section>
    </main>
  );
}

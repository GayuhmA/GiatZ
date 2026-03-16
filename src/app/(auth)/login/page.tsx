"use client";

import Button from "@/components/shared/Button";
import Input from "@/components/shared/Input";
import { useAuthStore } from "@/store/useAuthStore";
import { AtSymbolIcon, LockClosedIcon } from "@heroicons/react/24/outline";
import { Hand } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function LoginPage() {
  const { signInWithEmail, signInWithGoogle, loading } = useAuthStore();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }
    
    try {
      await signInWithEmail(email, password);
      // AuthProvider will redirect
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || "Failed to log in");
      } else {
        setError("Failed to log in");
      }
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle();
      // AuthProvider will redirect
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || "Failed to log in with Google");
      } else {
        setError("Failed to log in with Google");
      }
    }
  };

  return (
    <div className="w-full max-w-5xl bg-white/50 rounded-4xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden flex flex-col md:flex-row min-h-150">
      
      {/* Left Side - Image Panel */}
      <div className="hidden md:flex flex-col w-1/2 p-10 relative items-center justify-center text-center">
        <div className="w-full max-w-[320px] aspect-4/5 relative rounded-3xl overflow-hidden shadow-2xl mb-8">
          <Image 
            src="/images/gia-mascot.webp" 
            alt="Gia Mascot" 
            fill 
            className="object-cover"
            priority
          />
        </div>
        <h2 className="text-3xl font-extrabold mb-3 font-heading">
          Learn with GiatZ
        </h2>
        <p className="text-lg font-medium">
          Your smart companion for every subject.
        </p>
      </div>

      {/* Right Side - Form Panel */}
      <div className="w-full md:w-1/2 p-8 md:p-14 flex flex-col justify-center bg-white">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-10">
          <Image 
            src="/images/logo.webp" 
            alt="GiatZ Logo" 
            width={96} 
            height={96} 
            quality={100}
            className="w-12 h-12 rounded-full shrink-0 border-2 border-primary object-cover"
          />
          <h1 className="text-primary font-extrabold text-3xl tracking-wide font-heading">GiatZ</h1>
        </div>

        {/* Header */}
        <div className="mb-10">
          <h2 className="text-3xl font-extrabold text-text-primary mb-2 flex items-center gap-2">
            Welcome Back! <Hand className="w-8 h-8 text-primary-dark" />
          </h2>
          <p className="text-text-secondary font-medium">
            Ready to continue your learning journey?
          </p>
        </div>

        {/* Form */}
        <form className="flex flex-col gap-6" onSubmit={handleEmailLogin}>
          {error && (
            <div className="bg-danger-light text-danger p-3 rounded-lg text-sm font-bold">
              {error}
            </div>
          )}
          
          <Input 
            label="EMAIL ADDRESS"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="yourname@email.com"
            rightElement={<AtSymbolIcon className="w-5 h-5 text-text-secondary" />}
          />

          <div className="relative">
            <Input 
              label="PASSWORD"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              rightElement={<LockClosedIcon className="w-5 h-5 text-text-secondary" />}
            />
            <Link 
              href="/forgot-password" 
              className="absolute right-0 top-0 text-[11px] font-bold text-primary uppercase tracking-wider hover:text-primary-dark transition-colors"
            >
              FORGOT?
            </Link>
          </div>

          <Button 
            type="submit"
            disabled={loading}
            fullWidth
            variant="primary"
            className="mt-2"
          >
            {loading ? "LOGGING IN..." : "LOG IN"}
          </Button>
        </form>

        {/* Divider */}
        <div className="my-8 flex items-center">
          <div className="flex-1 border-t border-border"></div>
          <span className="px-4 text-xs font-bold text-text-secondary uppercase tracking-wider">
            OR CONNECT WITH
          </span>
          <div className="flex-1 border-t border-border"></div>
        </div>

        {/* Social Login */}
        <div className="flex justify-center">
          <Button 
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            variant="social"
            fullWidth
            icon={
              <svg viewBox="0 0 24 24" className="w-5 h-5 absolute" aria-hidden="true" style={{ position: 'relative' }}>
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
            }
          >
            Google
          </Button>
        </div>

        {/* Footer */}
        <p className="mt-10 text-center text-sm text-text-secondary font-medium">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-primary font-bold hover:underline">
            Sign up here
          </Link>
        </p>
      </div>

    </div>
  );
}

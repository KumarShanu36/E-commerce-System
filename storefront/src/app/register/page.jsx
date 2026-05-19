"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import CountryCodeSelect from "@/components/CountryCodeSelect";
import {
  User,
  Mail,
  Lock,
  Phone,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  // Step 1: Form Data
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const [phoneNumber, setPhoneNumber] = useState("");
  // Step 2: OTP State
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [mockOtpMsg, setMockOtpMsg] = useState("");

  const fullPhoneNumber = `${countryCode}${phoneNumber}`;

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      // Typically you'd call your backend here
      const res = await fetch(
        "http://localhost:5000/api/v1/auth/register/send-otp",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phone: fullPhoneNumber }),
        },
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send OTP");
      setMockOtpMsg(`Mock OTP received: ${data.mockOtp}`);
      setStep(2);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      const res = await fetch(
        "http://localhost:5000/api/v1/auth/register/verify",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name,
            email,
            password,
            phone: fullPhoneNumber,
            code: otp,
          }),
        },
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Verification failed");
      setSuccessMsg("Account created successfully! Redirecting...");
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full animate-float"></div>
      <div
        className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/20 blur-[120px] rounded-full animate-float"
        style={{ animationDelay: "2s" }}
      ></div>

      <div className="w-full max-w-md z-10">
        <div className="glass-morphism rounded-3xl p-8 shadow-2xl border border-white/10 relative overflow-hidden">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2 gradient-text">
              {step === 1 ? "Create Account" : "Verify Phone"}
            </h1>
            <p className="text-white/60">
              {step === 1
                ? "Join our premium e-commerce platform today"
                : `Enter the 6-digit code sent to ${fullPhoneNumber}`}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm text-center">
              {error}
            </div>
          )}

          {successMsg && (
            <div className="mb-6 p-3 bg-green-500/10 border border-green-500/20 text-green-400 rounded-xl text-sm flex items-center justify-center gap-2">
              <CheckCircle2 size={18} />
              {successMsg}
            </div>
          )}

          {step === 1 ? (
            <form onSubmit={handleSendOtp} className="space-y-5">
              {/* Phone Number Section at the top as requested */}
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Contact Number
                </label>
                <div className="flex rounded-xl focus-within:ring-2 focus-within:ring-primary/50 transition-all">
                  <CountryCodeSelect
                    selectedCode={countryCode}
                    onChange={setCountryCode}
                  />

                  <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone size={18} className="text-white/40" />
                    </div>
                    <input
                      type="tel"
                      required
                      value={phoneNumber}
                      onChange={(e) =>
                        setPhoneNumber(e.target.value.replace(/\D/g, ""))
                      }
                      className="w-full h-[50px] bg-white/5 border border-white/10 border-l-0 rounded-r-xl pl-10 pr-4 text-white focus:outline-none placeholder:text-white/30"
                      placeholder="Enter mobile number"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User size={18} className="text-white/40" />
                  </div>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full h-[50px] bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 placeholder:text-white/30 transition-all"
                    placeholder="John Doe"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail size={18} className="text-white/40" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-[50px] bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 placeholder:text-white/30 transition-all"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock size={18} className="text-white/40" />
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full h-[50px] bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 placeholder:text-white/30 transition-all"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-[50px] mt-6 bg-gradient-to-r from-primary via-secondary to-accent rounded-xl text-white font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoading ? "Sending OTP..." : "Continue"}
                {!isLoading && <ArrowRight size={18} />}
              </button>

              <div className="text-center mt-6">
                <p className="text-white/60 text-sm">
                  Already have an account?{" "}
                  <Link
                    href="/login"
                    className="text-primary hover:text-white transition-colors"
                  >
                    Sign In
                  </Link>
                </p>
              </div>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-6">
              {mockOtpMsg && (
                <div className="p-3 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-xl text-sm text-center font-mono">
                  {mockOtpMsg}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-white/80 mb-2 text-center">
                  6-Digit Security Code
                </label>
                <div className="relative max-w-[200px] mx-auto">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <ShieldCheck size={20} className="text-primary" />
                  </div>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                    className="w-full h-[60px] bg-white/5 border border-white/20 rounded-xl pl-12 pr-4 text-white text-2xl tracking-widest font-mono text-center focus:outline-none focus:ring-2 focus:ring-primary/50 placeholder:text-white/10 transition-all"
                    placeholder="000000"
                    autoFocus
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading || otp.length !== 6 || successMsg !== ""}
                className="w-full h-[50px] bg-gradient-to-r from-primary via-secondary to-accent rounded-xl text-white font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoading ? "Verifying..." : "Verify & Create Account"}
                {!isLoading && <CheckCircle2 size={18} />}
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-white/50 text-sm hover:text-white transition-colors"
                >
                  Change phone number or details
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

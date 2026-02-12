"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

type AuthMode = "password" | "otp-send" | "otp-verify";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [mode, setMode] = useState<AuthMode>("password");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handlePasswordLogin(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push("/admin/blog");
    router.refresh();
  }

  async function handleSendOtp(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({ email });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setMessage("Check your email for the verification code!");
    setMode("otp-verify");
    setLoading(false);
  }

  async function handleVerifyOtp(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createClient();
    const { error } = await supabase.auth.verifyOtp({
      email,
      token: otpCode,
      type: "email",
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push("/admin/blog");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-white mb-2 text-center">Admin Login</h1>
        <p className="text-gray-400 text-center mb-8">Sign in to manage your blog</p>

        {/* Auth mode tabs */}
        <div className="flex mb-6 bg-white/5 rounded-lg p-1">
          <button
            type="button"
            onClick={() => { setMode("password"); setError(""); setMessage(""); }}
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all cursor-pointer ${
              mode === "password"
                ? "bg-blue-600 text-white shadow"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Password
          </button>
          <button
            type="button"
            onClick={() => { setMode("otp-send"); setError(""); setMessage(""); }}
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all cursor-pointer ${
              mode === "otp-send" || mode === "otp-verify"
                ? "bg-blue-600 text-white shadow"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Email OTP
          </button>
        </div>

        {/* Password login */}
        {mode === "password" && (
          <form onSubmit={handlePasswordLogin} className="space-y-5">
            <Input
              id="email"
              label="Email"
              type="email"
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              id="password"
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {error && <p className="text-red-400 text-sm">{error}</p>}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing in..." : "Sign In with Password"}
            </Button>
          </form>
        )}

        {/* OTP - send code */}
        {mode === "otp-send" && (
          <form onSubmit={handleSendOtp} className="space-y-5">
            <Input
              id="otp-email"
              label="Email"
              type="email"
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            {error && <p className="text-red-400 text-sm">{error}</p>}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Sending..." : "Send Verification Code"}
            </Button>
          </form>
        )}

        {/* OTP - verify code */}
        {mode === "otp-verify" && (
          <form onSubmit={handleVerifyOtp} className="space-y-5">
            <div className="text-center mb-2">
              <p className="text-sm text-gray-400">
                Code sent to <span className="text-white font-medium">{email}</span>
              </p>
            </div>

            {message && (
              <p className="text-green-400 text-sm text-center">{message}</p>
            )}

            <Input
              id="otp-code"
              label="Verification Code"
              type="text"
              placeholder="Enter 6-digit code"
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value)}
              required
              autoFocus
            />

            {error && <p className="text-red-400 text-sm">{error}</p>}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Verifying..." : "Verify & Sign In"}
            </Button>

            <button
              type="button"
              onClick={() => { setMode("otp-send"); setOtpCode(""); setError(""); }}
              className="w-full text-sm text-gray-400 hover:text-white transition-colors cursor-pointer"
            >
              Resend code
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

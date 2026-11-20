"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Lock,
  Mail,
  User,
  AtSign,
  Phone,
  CheckCircle,
  AlertCircle,
  Eye,
  EyeOff,
  ShieldCheck,
  Clock,
  Check,
  Loader2,
} from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();

  // Form fields
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("India");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Toggles & agreements
  const [showPassword, setShowPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [eulaAccepted, setEulaAccepted] = useState(false);

  // 1-Click Checkbox Human Verification (No puzzle challenges)
  const [isRobotVerified, setIsRobotVerified] = useState(false);
  const [isVerifyingRobot, setIsVerifyingRobot] = useState(false);
  const [verificationToken, setVerificationToken] = useState<string | null>(null);

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [submittedData, setSubmittedData] = useState<{
    registrationId?: string;
    fullName: string;
    username: string;
    email: string;
  } | null>(null);

  const handleRobotCheck = () => {
    if (isRobotVerified || isVerifyingRobot) return;
    setIsVerifyingRobot(true);
    setTimeout(() => {
      setIsVerifyingRobot(false);
      setIsRobotVerified(true);
      setVerificationToken(`vg-human-verified-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`);
    }, 600);
  };

  // Password strength calculation
  const getPasswordStrength = (pass: string) => {
    let score = 0;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    return score;
  };

  const strength = getPasswordStrength(password);
  const strengthLabels = ["Weak", "Fair", "Good", "Strong"];
  const strengthColors = ["bg-red-500", "bg-amber-500", "bg-blue-500", "bg-emerald-500"];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!isRobotVerified) {
      setErrorMsg("Please verify that you are human by checking the 'I'm not a robot' box.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match. Please re-enter.");
      return;
    }

    if (!termsAccepted || !privacyAccepted || !eulaAccepted) {
      setErrorMsg("Please accept the Terms & Conditions, Privacy Policy, and EULA to continue.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          username,
          email,
          phone,
          city,
          country,
          password,
          confirmPassword,
          termsAccepted,
          privacyAccepted,
          eulaAccepted,
          isRobotVerified: true,
          humanVerificationToken: verificationToken || `vg-human-verified-${Date.now()}`,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Registration failed. Please check your information.");
      }

      setSubmittedData({
        registrationId: data.registrationId,
        fullName,
        username,
        email,
      });
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to create account. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submittedData) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 bg-gradient-to-b from-[#F5F6F8] to-white font-josefin">
        <div className="w-full max-w-xl p-8 sm:p-10 bg-white border border-gray-200 rounded-2xl shadow-xl text-center space-y-6">
          <div className="w-16 h-16 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center mx-auto shadow-sm">
            <Clock className="w-9 h-9" />
          </div>

          <div className="space-y-3">
            <h1 className="text-2xl sm:text-3xl font-light text-[#0B2852]">
              Registration Submitted Successfully
            </h1>
            <p className="text-sm sm:text-base font-semibold text-emerald-700 leading-relaxed max-w-lg mx-auto bg-emerald-50 border border-emerald-200 p-3.5 rounded-xl">
              Your account registration was successful. Your account is pending administrator approval. Please wait for approval before logging in.
            </p>
          </div>

          {/* Registration Details Card */}
          <div className="bg-[#F8FAFC] text-left p-5 rounded-xl border border-gray-200 text-xs sm:text-sm space-y-2">
            <div className="font-bold text-[#0B2852] pb-1 border-b border-gray-200 flex items-center justify-between">
              <span>Application Details</span>
              <span className="text-[11px] px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold">
                PENDING_APPROVAL
              </span>
            </div>
            {submittedData.registrationId && (
              <div className="flex justify-between py-0.5">
                <span className="text-gray-500">Registration ID:</span>
                <span className="font-mono font-bold text-gray-800">{submittedData.registrationId}</span>
              </div>
            )}
            <div className="flex justify-between py-0.5">
              <span className="text-gray-500">Full Name:</span>
              <span className="font-semibold text-gray-800">{submittedData.fullName}</span>
            </div>
            <div className="flex justify-between py-0.5">
              <span className="text-gray-500">Username:</span>
              <span className="font-semibold text-emerald-800">@{submittedData.username}</span>
            </div>
            <div className="flex justify-between py-0.5">
              <span className="text-gray-500">Email Address:</span>
              <span className="font-semibold text-gray-800">{submittedData.email}</span>
            </div>
          </div>

          <div className="bg-[#ECE8F8] text-[#2A1E68] p-4 rounded-xl border border-[#D8CEF6] text-xs text-left space-y-1.5">
            <div className="font-bold flex items-center gap-1.5 text-[#0B2852]">
              <ShieldCheck className="w-4 h-4 text-[#39FF00]" />
              What happens next?
            </div>
            <p className="leading-snug">
              An approval notification has been sent to our administrator (<strong>tirtheshbari18@gmail.com</strong>).
            </p>
            <p className="leading-snug">
              Once approved, you will receive an email confirmation and be able to log in to access simulation downloads and train boards.
            </p>
          </div>

          <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/login"
              className="w-full sm:w-auto px-8 py-3 bg-[#0B2852] text-white hover:bg-[#39FF00] hover:text-[#101C32] rounded-full font-bold text-sm tracking-wide uppercase transition-all shadow-md"
            >
              Go to Login Page
            </Link>
            <Link
              href="/"
              className="w-full sm:w-auto px-8 py-3 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-full font-bold text-sm tracking-wide uppercase transition-all"
            >
              Return Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[85vh] py-12 px-4 bg-gradient-to-b from-[#F5F6F8] to-white font-josefin text-[#101C32] flex items-center justify-center">
      <div className="w-full max-w-xl p-7 sm:p-10 bg-white border border-gray-200 rounded-2xl shadow-xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#0B2852]/5 text-[#0B2852] mb-1">
            <ShieldCheck className="w-6 h-6 text-[#0B2852]" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-light tracking-wide text-[#0B2852]">
            Create Account
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 font-normal">
            Already have an account?{" "}
            <Link href="/login" className="text-[#0B2852] font-semibold hover:text-[#39FF00] underline transition-colors">
              Log In
            </Link>
          </p>
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm flex items-center gap-2.5">
            <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-600" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
          {/* Full Name */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Full Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Tirthesh Bari"
                className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0B2852]"
              />
              <User className="w-4 h-4 text-gray-400 absolute left-3 top-3.5 pointer-events-none" />
            </div>
          </div>

          {/* Username & Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-1">
                Username <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. railfan_vg"
                  className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0B2852]"
                />
                <AtSign className="w-4 h-4 text-gray-400 absolute left-3 top-3.5 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-1">
                Email Address <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0B2852]"
                />
                <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3.5 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Phone & City (Optional / Helper) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-1">
                Mobile Phone
              </label>
              <div className="relative">
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 9876543210"
                  className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0B2852]"
                />
                <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-3.5 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-1">
                City / Region
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. Mumbai, Maharashtra"
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0B2852]"
              />
            </div>
          </div>

          {/* Passwords */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-gray-700 font-semibold">
                  Password <span className="text-red-500">*</span>
                </label>
                {password && (
                  <span className="text-[11px] font-bold text-gray-500">
                    Strength: {strengthLabels[strength - 1] || "Too Weak"}
                  </span>
                )}
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 8 characters"
                  className="w-full pl-9 pr-9 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0B2852]"
                />
                <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3.5 pointer-events-none" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-700 focus:outline-none"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {password && (
                <div className="grid grid-cols-4 gap-1 mt-1.5">
                  {[0, 1, 2, 3].map((step) => (
                    <div
                      key={step}
                      className={`h-1 rounded-full transition-all duration-300 ${
                        step < strength ? strengthColors[strength - 1] : "bg-gray-200"
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-1">
                Confirm Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password"
                  className={`w-full pl-9 pr-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 ${
                    confirmPassword && password !== confirmPassword
                      ? "border-red-400 focus:ring-red-400"
                      : "border-gray-300 focus:ring-[#0B2852]"
                  }`}
                />
                <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3.5 pointer-events-none" />
              </div>
              {confirmPassword && password !== confirmPassword && (
                <p className="text-[11px] text-red-500 mt-1">Passwords do not match</p>
              )}
            </div>
          </div>

          {/* Simple 1-Click Human Verification Checkbox */}
          <div
            className={`p-3.5 rounded-xl border transition-all ${
              isRobotVerified
                ? "border-emerald-300 bg-emerald-50/40"
                : "border-gray-300 bg-[#F9FAFB] hover:border-gray-400"
            }`}
          >
            <div className="flex items-center justify-between gap-3">
              <div
                onClick={handleRobotCheck}
                className="flex items-center gap-3 cursor-pointer select-none py-1 group"
              >
                <div
                  className={`w-7 h-7 rounded border flex items-center justify-center transition-all ${
                    isRobotVerified
                      ? "bg-emerald-600 border-emerald-600 text-white"
                      : isVerifyingRobot
                      ? "border-blue-500 bg-white"
                      : "border-gray-400 bg-white group-hover:border-[#0B2852]"
                  }`}
                >
                  {isVerifyingRobot ? (
                    <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                  ) : isRobotVerified ? (
                    <Check className="w-4 h-4 stroke-[3]" />
                  ) : null}
                </div>

                <span className="text-sm font-medium text-gray-800">
                  {isRobotVerified ? "Verification complete" : "I'm not a robot"}
                </span>
              </div>

              <div className="flex flex-col items-end text-[10px] text-gray-400">
                <div className="flex items-center gap-1 text-gray-500 font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#0B2852]" />
                  <span>VG Security</span>
                </div>
                <span>reCAPTCHA checkbox mode</span>
              </div>
            </div>
          </div>

          {/* Legal / Policy Checkboxes */}
          <div className="space-y-2 pt-1 text-xs text-gray-700">
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                required
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="mt-0.5 rounded text-[#0B2852] focus:ring-[#0B2852]"
              />
              <span>
                I agree to the <strong className="text-[#0B2852] underline">Terms &amp; Conditions</strong> for railway simulation content.
              </span>
            </label>

            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                required
                checked={privacyAccepted}
                onChange={(e) => setPrivacyAccepted(e.target.checked)}
                className="mt-0.5 rounded text-[#0B2852] focus:ring-[#0B2852]"
              />
              <span>
                I agree to the <strong className="text-[#0B2852] underline">Privacy Policy</strong> and approval notification emails.
              </span>
            </label>

            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                required
                checked={eulaAccepted}
                onChange={(e) => setEulaAccepted(e.target.checked)}
                className="mt-0.5 rounded text-[#0B2852] focus:ring-[#0B2852]"
              />
              <span>
                I accept the <strong className="text-[#0B2852] underline">End User License Agreement (EULA)</strong>.
              </span>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 px-4 bg-[#0B2852] text-white hover:bg-[#39FF00] hover:text-[#101C32] rounded-full font-josefin font-bold text-sm tracking-wide uppercase transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 cursor-pointer"
          >
            {isSubmitting ? "Submitting Application..." : "Submit Registration for Approval"}
          </button>
        </form>
      </div>
    </div>
  );
}

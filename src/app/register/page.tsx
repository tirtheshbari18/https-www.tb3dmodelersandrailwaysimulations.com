"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Lock,
  Mail,
  User,
  Phone,
  MapPin,
  Building,
  CheckCircle,
  AlertCircle,
  Eye,
  EyeOff,
  RefreshCw,
  ShieldCheck,
  Clock,
} from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();

  // Form fields
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [address2, setAddress2] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("India");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Toggles & agreements
  const [showPassword, setShowPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [eulaAccepted, setEulaAccepted] = useState(false);

  // CAPTCHA
  const [captchaToken, setCaptchaToken] = useState("");
  const [captchaSvg, setCaptchaSvg] = useState("");
  const [captchaAnswer, setCaptchaAnswer] = useState("");
  const [isLoadingCaptcha, setIsLoadingCaptcha] = useState(true);

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmittedSuccess, setIsSubmittedSuccess] = useState(false);

  const fetchCaptcha = async () => {
    setIsLoadingCaptcha(true);
    try {
      const res = await fetch("/api/auth/captcha", { cache: "no-store" });
      const data = await res.json();
      if (data.token && data.svg) {
        setCaptchaToken(data.token);
        setCaptchaSvg(data.svg);
        setCaptchaAnswer("");
      }
    } catch (e) {
      console.error("Failed to load captcha", e);
    } finally {
      setIsLoadingCaptcha(false);
    }
  };

  useEffect(() => {
    fetchCaptcha();
  }, []);

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
    setIsSubmitting(true);
    setErrorMsg(null);

    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match");
      setIsSubmitting(false);
      return;
    }

    if (!termsAccepted || !privacyAccepted || !eulaAccepted) {
      setErrorMsg("Please accept all required agreements (Terms, Privacy Policy, and EULA)");
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          phone,
          address,
          address2,
          city,
          state,
          postalCode,
          country,
          password,
          confirmPassword,
          termsAccepted,
          privacyAccepted,
          eulaAccepted,
          captchaToken,
          captchaAnswer,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Registration failed");
      }

      setIsSubmittedSuccess(true);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to create account. Please try again.");
      fetchCaptcha();
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmittedSuccess) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 bg-gradient-to-b from-[#F5F6F8] to-white font-josefin">
        <div className="w-full max-w-xl p-8 sm:p-10 bg-white border border-gray-200 rounded-2xl shadow-xl text-center space-y-6">
          <div className="w-16 h-16 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center mx-auto shadow-sm">
            <Clock className="w-9 h-9" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-light text-[#0B2852]">
              Registration Awaiting Approval
            </h1>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed max-w-md mx-auto">
              Thank you for registering, <strong>{firstName} {lastName}</strong>! Your account has been created and is currently awaiting administrator review.
            </p>
          </div>

          <div className="bg-[#ECE8F8] text-[#2A1E68] p-5 rounded-xl border border-[#D8CEF6] text-xs sm:text-sm text-left space-y-2">
            <div className="font-bold flex items-center gap-1.5 text-[#0B2852]">
              <ShieldCheck className="w-4 h-4 text-[#39FF00]" />
              Official Verification Policy
            </div>
            <p className="leading-snug">
              To protect our proprietary 3D simulation assets and provide high-quality support, all registrations undergo verification by Varun Ganesh and the VG-3D administration team.
            </p>
            <p className="leading-snug font-semibold text-emerald-800">
              An email notification will be dispatched to <u>{email}</u> as soon as your access is granted.
            </p>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
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
      <div className="w-full max-w-2xl p-7 sm:p-10 bg-white border border-gray-200 rounded-2xl shadow-xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
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

        <form onSubmit={handleSubmit} className="space-y-5 text-xs sm:text-sm">
          {/* Row 1: First Name & Last Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-1">
                First Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="e.g. Tirthesh"
                  className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B2852]"
                />
                <User className="w-4 h-4 text-gray-400 absolute left-3 top-3.5 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-1">
                Last Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="e.g. Bari"
                  className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B2852]"
                />
                <User className="w-4 h-4 text-gray-400 absolute left-3 top-3.5 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Row 2: Email & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                  className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B2852]"
                />
                <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3.5 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-1">
                Mobile Phone <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 9876543210"
                  className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B2852]"
                />
                <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-3.5 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Address Line 1 */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Address Line 1 <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="House / Flat / Street address"
                className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B2852]"
              />
              <MapPin className="w-4 h-4 text-gray-400 absolute left-3 top-3.5 pointer-events-none" />
            </div>
          </div>

          {/* Address Line 2 */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Address Line 2 (Optional)
            </label>
            <input
              type="text"
              value={address2}
              onChange={(e) => setAddress2(e.target.value)}
              placeholder="Apartment, suite, unit, building, floor, etc."
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B2852]"
            />
          </div>

          {/* City, State, Postal Code, Country */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-gray-700 font-semibold mb-1">
                City <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. Mumbai"
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B2852]"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-1">
                State <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={state}
                onChange={(e) => setState(e.target.value)}
                placeholder="e.g. Maharashtra"
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B2852]"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-1">
                PIN / Postal Code <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                placeholder="e.g. 400001"
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B2852]"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-1">
                Country <span className="text-red-500">*</span>
              </label>
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#0B2852]"
              >
                <option value="India">India</option>
                <option value="United States">United States</option>
                <option value="United Kingdom">United Kingdom</option>
                <option value="Australia">Australia</option>
                <option value="Canada">Canada</option>
                <option value="Bangladesh">Bangladesh</option>
                <option value="Germany">Germany</option>
                <option value="Other">Other</option>
              </select>
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
                  className="w-full pl-9 pr-9 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B2852]"
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

              {/* Password strength meter */}
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
                  className={`w-full pl-9 pr-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 ${
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

          {/* CAPTCHA Challenge */}
          <div className="p-3.5 bg-gray-50 border border-gray-200 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                Security Verification <span className="text-red-500">*</span>
              </label>
              <button
                type="button"
                onClick={fetchCaptcha}
                disabled={isLoadingCaptcha}
                className="flex items-center gap-1 text-xs text-[#0B2852] hover:text-blue-700 font-medium"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoadingCaptcha ? "animate-spin" : ""}`} />
                <span>Refresh Code</span>
              </button>
            </div>

            <div className="flex items-center gap-3">
              <div
                className="flex-shrink-0 overflow-hidden rounded-md border border-gray-300 shadow-inner"
                dangerouslySetInnerHTML={{ __html: captchaSvg || "<div class='w-[180px] h-[50px] bg-gray-200 animate-pulse'></div>" }}
              />
              <input
                type="text"
                required
                value={captchaAnswer}
                onChange={(e) => setCaptchaAnswer(e.target.value.toUpperCase())}
                placeholder="Enter 5-character code"
                maxLength={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono tracking-widest uppercase text-center focus:outline-none focus:ring-2 focus:ring-[#0B2852]"
              />
            </div>
          </div>

          {/* Legal / Policy Checkboxes */}
          <div className="space-y-2.5 pt-2 text-xs text-gray-700">
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                required
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="mt-0.5 rounded text-[#0B2852] focus:ring-[#0B2852]"
              />
              <span>
                I agree to the{" "}
                <strong className="text-[#0B2852] underline">Terms &amp; Conditions</strong> and acknowledge that all downloadable content is for personal simulation use only.
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
                I agree to the{" "}
                <strong className="text-[#0B2852] underline">Privacy Policy</strong> and consent to receiving order confirmation and approval status emails.
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
                I accept the{" "}
                <strong className="text-[#0B2852] underline">End User License Agreement (EULA)</strong> and agree NOT to redistribute, resell, share, or pirate any models or textures.
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

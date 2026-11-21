"use client";

import React, { useState } from "react";
import { CheckCircle2, Send, MessageCircle, Mail, Phone, Clock, ShieldCheck } from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg(null);

    const fullName = `${formData.firstName} ${formData.lastName}`.trim();

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fullName || "Visitor",
          email: formData.email,
          phone: null,
          subject: "Contact Form Message",
          message: formData.message,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to submit message");
      }

      setSubmitSuccess(true);
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        message: "",
      });
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to submit. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full bg-[#F4F7FB] text-[#172033]">
      {/* 1. Header Hero Banner */}
      <div className="bg-[#101D35] text-white py-16 px-4 border-b border-[#174EA6]/40">
        <div className="max-w-[1080px] mx-auto text-center space-y-4">
          <span className="text-xs font-bold bg-[#00B8D9]/20 text-[#00B8D9] border border-[#00B8D9]/40 px-3.5 py-1 rounded-full uppercase tracking-wider inline-block">
            Support &amp; Community
          </span>
          <h1 className="font-josefin text-[36px] sm:text-[48px] font-extralight tracking-wide text-white">
            Contact <span className="font-bold text-[#00B8D9]">TB PRO</span>
          </h1>
          <p className="font-josefin text-sm sm:text-base text-[#A0C4E8] max-w-xl mx-auto">
            Official contact points for TB PRO Indian Railways simulations, asset inquiries, installation assistance, and support.
          </p>
        </div>
      </div>

      {/* 2. Contact Details & Team Cards */}
      <div className="max-w-[1080px] mx-auto px-4 py-12 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-[850px] mx-auto text-left">
          {/* Card 1: Varun Ganesh */}
          <div className="p-6 bg-white rounded-2xl border border-gray-200 shadow-sm space-y-3 hover:border-[#174EA6] transition-colors">
            <div className="flex items-center justify-between">
              <span className="font-josefin font-bold text-xs text-[#101D35] bg-[#E8F0FE] px-3 py-1 rounded-full">
                Lead Modeler &amp; Simulation Specialist
              </span>
              <a
                href="https://wa.me/917738980989"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#25D366] hover:scale-110 transition-transform"
                aria-label="WhatsApp Varun Ganesh"
              >
                <img src="/assets/icons/whatsapp.png" alt="WhatsApp" className="w-6 h-6 object-contain" />
              </a>
            </div>
            <h3 className="font-josefin text-[22px] font-bold text-[#101D35]">
              Varun Ganesh
            </h3>
            <p className="font-josefin text-[14px] text-gray-700 flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#174EA6]" />
              <span>Email: </span>
              <a href="mailto:varunganesh221@gmail.com" className="font-semibold text-[#174EA6] hover:underline">
                varunganesh221@gmail.com
              </a>
            </p>
            <p className="font-josefin text-[14px] text-gray-700 flex items-center gap-2">
              <Phone className="w-4 h-4 text-[#174EA6]" />
              <span>Phone: <strong>+91 7738980989</strong> <span className="text-xs text-gray-500">(WhatsApp preferred)</span></span>
            </p>
          </div>

          {/* Card 2: Srivallabhan G */}
          <div className="p-6 bg-white rounded-2xl border border-gray-200 shadow-sm space-y-3 hover:border-[#174EA6] transition-colors">
            <div className="flex items-center justify-between">
              <span className="font-josefin font-bold text-xs text-[#101D35] bg-[#E8F0FE] px-3 py-1 rounded-full">
                Platform Administrator
              </span>
              <a
                href="https://wa.me/919381000590"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#25D366] hover:scale-110 transition-transform"
                aria-label="WhatsApp Srivallabhan"
              >
                <img src="/assets/icons/whatsapp.png" alt="WhatsApp" className="w-6 h-6 object-contain" />
              </a>
            </div>
            <h3 className="font-josefin text-[22px] font-bold text-[#101D35]">
              Srivallabhan G
            </h3>
            <p className="font-josefin text-[14px] text-gray-700 flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#174EA6]" />
              <span>Email: </span>
              <a href="mailto:vallabh12626777@gmail.com" className="font-semibold text-[#174EA6] hover:underline">
                vallabh12626777@gmail.com
              </a>
            </p>
            <p className="font-josefin text-[14px] text-gray-700 flex items-center gap-2">
              <Phone className="w-4 h-4 text-[#174EA6]" />
              <span>Phone: <strong>+91 9381000590</strong> <span className="text-xs text-gray-500">(WhatsApp preferred)</span></span>
            </p>
          </div>
        </div>

        {/* Social Icons row */}
        <div className="flex items-center justify-center gap-4 pt-2">
          <a
            href="https://wa.me/917738980989"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp"
            className="p-3 bg-white rounded-full shadow-sm hover:scale-110 transition-transform border border-gray-200"
          >
            <img
              src="/assets/icons/whatsapp.png"
              alt="WhatsApp"
              className="w-7 h-7 object-contain"
            />
          </a>
          <a
            href="https://www.facebook.com/VarunGaneshTheRailfan/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
            className="p-3 bg-white rounded-full shadow-sm hover:scale-110 transition-transform border border-gray-200"
          >
            <img
              src="/assets/icons/facebook.png"
              alt="Facebook"
              className="w-7 h-7 object-contain"
            />
          </a>
          <a
            href="https://www.youtube.com/channel/UCdIyw1n50s4H7VPCcTbr5wQ"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="YouTube"
            className="p-3 bg-white rounded-full shadow-sm hover:scale-110 transition-transform border border-gray-200"
          >
            <img
              src="/assets/icons/youtube.png"
              alt="YouTube"
              className="w-7 h-7 object-contain"
            />
          </a>
        </div>
      </div>

      {/* 3. "Let's Chat" & Contact Form */}
      <div className="w-full bg-white py-16 px-4 border-t border-gray-200">
        <div className="max-w-[850px] mx-auto space-y-8">
          <div className="space-y-1 text-center">
            <span className="text-xs font-bold text-[#174EA6] uppercase tracking-wider">Direct Message</span>
            <h2 className="font-josefin text-[32px] sm:text-[40px] font-bold text-[#101D35]">
              Let&apos;s Connect
            </h2>
            <p className="font-josefin text-sm text-gray-500 max-w-md mx-auto">
              Have questions regarding simulator compatibility, LHB physics, or need installation help? Leave us a message below.
            </p>
          </div>

          {/* Form */}
          {submitSuccess ? (
            <div className="p-8 bg-[#F4F7FB] rounded-2xl border border-gray-200 shadow-md text-center space-y-4">
              <CheckCircle2 className="w-12 h-12 text-[#16A34A] mx-auto" />
              <h3 className="font-josefin text-[22px] font-bold text-[#101D35]">Message Sent Successfully!</h3>
              <p className="font-josefin text-[14px] text-gray-600 max-w-sm mx-auto">
                Thank you for contacting TB PRO. Our team will review your inquiry and reply as soon as possible.
              </p>
              <button
                onClick={() => setSubmitSuccess(false)}
                className="mt-4 px-6 py-2.5 bg-[#101D35] text-white font-josefin text-sm font-bold rounded-full hover:bg-[#00B8D9] hover:text-[#101D35] transition-colors"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 bg-[#F4F7FB] p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-josefin text-[13px] font-bold text-gray-700 mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl bg-white text-[#172033] font-josefin text-[14px] focus:outline-none focus:ring-2 focus:ring-[#174EA6]"
                    placeholder="First name"
                  />
                </div>
                <div>
                  <label className="block font-josefin text-[13px] font-bold text-gray-700 mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl bg-white text-[#172033] font-josefin text-[14px] focus:outline-none focus:ring-2 focus:ring-[#174EA6]"
                    placeholder="Last name"
                  />
                </div>
              </div>

              <div>
                <label className="block font-josefin text-[13px] font-bold text-gray-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl bg-white text-[#172033] font-josefin text-[14px] focus:outline-none focus:ring-2 focus:ring-[#174EA6]"
                  placeholder="your.email@example.com"
                />
              </div>

              <div>
                <label className="block font-josefin text-[13px] font-bold text-gray-700 mb-1">
                  Message *
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl bg-white text-[#172033] font-josefin text-[14px] focus:outline-none focus:ring-2 focus:ring-[#174EA6]"
                  placeholder="Tell us what coaches, trainboards, or simulation features you are inquiring about..."
                />
              </div>

              {errorMsg && (
                <div className="p-3 bg-red-100 text-red-700 text-xs rounded-xl font-medium">
                  {errorMsg}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 bg-[#101D35] hover:bg-[#00B8D9] text-white hover:text-[#101D35] font-josefin font-bold text-sm uppercase tracking-wider rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-md cursor-pointer disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? "Sending Message..." : "Submit Inquiry"}</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

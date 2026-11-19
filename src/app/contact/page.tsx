"use client";

import React, { useState } from "react";
import { CheckCircle2, Send, MessageCircle } from "lucide-react";

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
    <div className="w-full bg-white text-[#101C32]">
      {/* 1. White Top Section: Contact & Administration Details */}
      <div className="max-w-[1080px] mx-auto px-4 py-16 text-center space-y-8">
        <div>
          <span className="text-xs font-semibold bg-[#A7D2F7]/40 text-[#0B2852] px-3.5 py-1 rounded-full uppercase tracking-wider inline-block mb-3">
            Get In Touch
          </span>
          <h1 className="font-josefin text-[38px] sm:text-[48px] font-extralight tracking-wide text-[#0B2852]">
            Contact
          </h1>
          <p className="font-josefin text-sm sm:text-base text-gray-500 max-w-md mx-auto mt-1">
            Official contact points for VG-3D Modelers & Railway Simulations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-[850px] mx-auto text-left">
          {/* Card 1: Varun Ganesh */}
          <div className="p-6 bg-[#F5F6F8] rounded-2xl border border-gray-200 shadow-sm space-y-2 hover:border-[#0B2852] transition-colors">
            <div className="flex items-center justify-between">
              <span className="font-josefin font-bold text-xs text-[#0B2852] bg-[#A7D2F7] px-2.5 py-0.5 rounded-full">
                Founder & Lead Modeler
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
            <h3 className="font-josefin text-[20px] font-semibold text-[#0B2852]">
              Varun Ganesh
            </h3>
            <p className="font-josefin text-[14px] text-gray-700">
              Email:{" "}
              <a href="mailto:varunganesh221@gmail.com" className="font-semibold text-[#0B2852] hover:underline">
                varunganesh221@gmail.com
              </a>
            </p>
            <p className="font-josefin text-[14px] text-gray-700">
              Phone: <strong>+91 7738980989</strong> <span className="text-xs text-gray-500">(Contact only on WhatsApp)</span>
            </p>
          </div>

          {/* Card 2: Srivallabhan G */}
          <div className="p-6 bg-[#F5F6F8] rounded-2xl border border-gray-200 shadow-sm space-y-2 hover:border-[#0B2852] transition-colors">
            <div className="flex items-center justify-between">
              <span className="font-josefin font-bold text-xs text-[#0B2852] bg-[#A7D2F7] px-2.5 py-0.5 rounded-full">
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
            <h3 className="font-josefin text-[20px] font-semibold text-[#0B2852]">
              Srivallabhan G
            </h3>
            <p className="font-josefin text-[14px] text-gray-700">
              Email:{" "}
              <a href="mailto:vallabh12626777@gmail.com" className="font-semibold text-[#0B2852] hover:underline">
                vallabh12626777@gmail.com
              </a>
            </p>
            <p className="font-josefin text-[14px] text-gray-700">
              Phone: <strong>+91 9381000590</strong> <span className="text-xs text-gray-500">(Contact only on WhatsApp)</span>
            </p>
          </div>
        </div>

        {/* Social Icons row */}
        <div className="flex items-center justify-center gap-4 pt-4">
          <a
            href="https://wa.me/917738980989"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp"
            className="p-2 bg-[#F5F6F8] rounded-full shadow-sm hover:scale-110 transition-transform border border-gray-200"
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
            className="p-2 bg-[#F5F6F8] rounded-full shadow-sm hover:scale-110 transition-transform border border-gray-200"
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
            className="p-2 bg-[#F5F6F8] rounded-full shadow-sm hover:scale-110 transition-transform border border-gray-200"
          >
            <img
              src="/assets/icons/youtube.png"
              alt="YouTube"
              className="w-7 h-7 object-contain"
            />
          </a>
        </div>
      </div>

      {/* 2. Light Grey Section: "Let's Chat" & Contact Form */}
      <div className="w-full bg-[#F5F6F8] py-16 px-4 border-t border-gray-200">
        <div className="max-w-[900px] mx-auto space-y-8">
          <div className="space-y-1">
            <h2 className="font-josefin text-[34px] sm:text-[42px] font-extralight text-[#0B2852]">
              Let&apos;s Chat
            </h2>
            <p className="font-josefin text-sm text-gray-500">
              Have a question about simulator compatibility, installation, or custom commission?
            </p>
          </div>

          {/* Contact Details 3 Columns */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <div>
              <p className="font-josefin text-xs font-bold text-gray-400 uppercase mb-1">Phone</p>
              <p className="font-josefin text-[15px] font-medium text-[#101C32]">+91 7738980989</p>
            </div>
            <div>
              <p className="font-josefin text-xs font-bold text-gray-400 uppercase mb-1">Email</p>
              <a
                href="mailto:varunganesh221@gmail.com"
                className="font-josefin text-[15px] font-semibold text-[#0B2852] hover:underline"
              >
                varunganesh221@gmail.com
              </a>
            </div>
            <div>
              <p className="font-josefin text-xs font-bold text-gray-400 uppercase mb-1">Official Chat</p>
              <a
                href="https://wa.me/917738980989"
                target="_blank"
                rel="noopener noreferrer"
                className="font-josefin text-[14px] text-[#25D366] font-semibold flex items-center gap-1 hover:underline"
              >
                <MessageCircle className="w-4 h-4" /> WhatsApp Direct
              </a>
            </div>
          </div>

          {/* Form */}
          {submitSuccess ? (
            <div className="p-8 bg-white rounded-2xl border border-gray-200 shadow-md text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-[#39FF00] mx-auto" />
              <h3 className="font-josefin text-[22px] font-semibold text-[#0B2852]">Message Sent Successfully!</h3>
              <p className="font-josefin text-[14px] text-gray-600 max-w-sm mx-auto">
                Thank you for contacting VG-3D Modelers. We will review your message and reply promptly.
              </p>
              <button
                onClick={() => setSubmitSuccess(false)}
                className="mt-4 px-6 py-2.5 bg-[#0B2852] text-white font-josefin text-sm font-semibold rounded-full hover:bg-[#39FF00] hover:text-[#101C32] transition-colors"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-sm">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-josefin text-[13px] font-semibold text-gray-700 mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-[#101C32] font-josefin text-[14px] focus:outline-none focus:border-[#0B2852]"
                    placeholder="First name"
                  />
                </div>
                <div>
                  <label className="block font-josefin text-[13px] font-semibold text-gray-700 mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-[#101C32] font-josefin text-[14px] focus:outline-none focus:border-[#0B2852]"
                    placeholder="Last name"
                  />
                </div>
                <div>
                  <label className="block font-josefin text-[13px] font-semibold text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-[#101C32] font-josefin text-[14px] focus:outline-none focus:border-[#0B2852]"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div>
                <label className="block font-josefin text-[13px] font-semibold text-gray-700 mb-1">
                  Message *
                </label>
                <textarea
                  rows={4}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-[#101C32] font-josefin text-[14px] focus:outline-none focus:border-[#0B2852]"
                  placeholder="How can we assist you with VG-3D Railway Models?"
                />
              </div>

              {errorMsg && (
                <p className="text-red-600 text-xs font-josefin">{errorMsg}</p>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-3 bg-[#0B2852] hover:bg-[#39FF00] hover:text-[#101C32] text-white font-josefin text-[15px] font-semibold rounded-full shadow transition-all duration-200 disabled:opacity-50 flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? "Submitting..." : "Submit Message"}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

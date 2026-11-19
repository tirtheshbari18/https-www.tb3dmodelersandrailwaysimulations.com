"use client";

import React, { useState } from "react";
import { CheckCircle2 } from "lucide-react";

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
    <div className="w-full bg-white text-[#041229]">
      {/* 1. White Top Section: Contact & Administration Details */}
      <div className="max-w-[980px] mx-auto px-4 py-16 text-center space-y-6">
        <h1 className="font-futuraBook text-[36px] sm:text-[40px] font-normal tracking-wide text-[#041229]">
          Contact
        </h1>

        <div className="space-y-6 text-[#041229]">
          <div className="space-y-1">
            <p className="font-futuraBook text-[17px] sm:text-[19px] font-normal text-[#041229]">
              1. Varun Ganesh (Founder of VG-3D Modelers &amp; Railway Simulations)
            </p>
            <p className="font-futuraLight text-[15px] sm:text-[16px] leading-[26px]">
              Email:{" "}
              <a href="mailto:varunganesh221@gmail.com" className="hover:underline">
                varunganesh221@gmail.com
              </a>
            </p>
            <p className="font-futuraLight text-[15px] sm:text-[16px] leading-[26px]">
              Phone: +91 7738980989 (Contact only on Whatsapp)
            </p>
          </div>

          <div className="space-y-1">
            <p className="font-futuraBook text-[17px] sm:text-[19px] font-normal text-[#041229]">
              2. Srivallabhan G (Admin of VG-3D Modelers &amp; Railway Simulations)
            </p>
            <p className="font-futuraLight text-[15px] sm:text-[16px] leading-[26px]">
              Email:{" "}
              <a href="mailto:vallabh12626777@gmail.com" className="hover:underline">
                vallabh12626777@gmail.com
              </a>
            </p>
            <p className="font-futuraLight text-[15px] sm:text-[16px] leading-[26px]">
              Phone: +91 9381000590 (Contact only on Whatsapp)
            </p>
          </div>
        </div>

        {/* Social Icons row */}
        <div className="flex items-center justify-center gap-3 pt-2">
          <a
            href="https://wa.me/917738980989"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp"
            className="hover:scale-105 transition-transform"
          >
            <img
              src="/assets/icons/whatsapp.png"
              alt="WhatsApp"
              className="w-[34px] h-[34px] object-contain rounded"
            />
          </a>
          <a
            href="https://www.facebook.com/VarunGaneshTheRailfan/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
            className="hover:scale-105 transition-transform"
          >
            <img
              src="/assets/icons/facebook.png"
              alt="Facebook"
              className="w-[34px] h-[34px] object-contain rounded"
            />
          </a>
          <a
            href="https://www.youtube.com/channel/UCdIyw1n50s4H7VPCcTbr5wQ"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="YouTube"
            className="hover:scale-105 transition-transform"
          >
            <img
              src="/assets/icons/youtube.png"
              alt="YouTube"
              className="w-[34px] h-[34px] object-contain rounded"
            />
          </a>
        </div>
      </div>

      {/* 2. Soft Gray Bottom Section: "Let's Chat" & Contact Form */}
      <div className="w-full bg-[#d9d9d9] py-16 px-4">
        <div className="max-w-[900px] mx-auto space-y-8">
          <h2 className="font-futuraBook text-[36px] sm:text-[40px] font-normal text-[#041229]">
            Let&apos;s Chat
          </h2>

          {/* Contact Details 3 Columns */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-[#041229]">
            <div>
              <p className="font-futuraBook text-[14px] text-gray-700 uppercase mb-1">Phone</p>
              <p className="font-futuraLight text-[15px]">+91 7738980989</p>
            </div>
            <div>
              <p className="font-futuraBook text-[14px] text-gray-700 uppercase mb-1">Email</p>
              <a
                href="mailto:varunganesh221@gmail.com"
                className="font-futuraLight text-[15px] hover:underline"
              >
                varunganesh221@gmail.com
              </a>
            </div>
            <div>
              <p className="font-futuraBook text-[14px] text-gray-700 uppercase mb-1">Social Media</p>
              <div className="flex items-center gap-2">
                <a
                  href="https://wa.me/917738980989"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src="/assets/icons/whatsapp.png"
                    alt="WhatsApp"
                    className="w-5 h-5 object-contain"
                  />
                </a>
                <a
                  href="https://www.facebook.com/VarunGaneshTheRailfan/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src="/assets/icons/facebook.png"
                    alt="Facebook"
                    className="w-5 h-5 object-contain"
                  />
                </a>
                <a
                  href="https://www.youtube.com/channel/UCdIyw1n50s4H7VPCcTbr5wQ"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src="/assets/icons/youtube.png"
                    alt="YouTube"
                    className="w-5 h-5 object-contain"
                  />
                </a>
              </div>
            </div>
          </div>

          {/* Form */}
          {submitSuccess ? (
            <div className="p-6 bg-white rounded border border-gray-300 text-center space-y-2">
              <CheckCircle2 className="w-10 h-10 text-[#38D300] mx-auto" />
              <h3 className="font-futuraBook text-[20px] font-normal">Message Sent!</h3>
              <p className="font-futuraLight text-[14px] text-gray-600">
                Thank you for contacting VG-3D Modelers. We will get back to you shortly.
              </p>
              <button
                onClick={() => setSubmitSuccess(false)}
                className="mt-3 px-5 py-2 bg-[#041229] text-white font-futuraLight text-[13px] font-bold rounded"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-futuraLight text-[13px] font-bold text-gray-700 mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-400 bg-white text-[#041229] font-futuraLight text-[14px] focus:outline-none focus:border-[#041229]"
                  />
                </div>
                <div>
                  <label className="block font-futuraLight text-[13px] font-bold text-gray-700 mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-400 bg-white text-[#041229] font-futuraLight text-[14px] focus:outline-none focus:border-[#041229]"
                  />
                </div>
                <div>
                  <label className="block font-futuraLight text-[13px] font-bold text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-400 bg-white text-[#041229] font-futuraLight text-[14px] focus:outline-none focus:border-[#041229]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-futuraLight text-[13px] font-bold text-gray-700 mb-1">
                  Message
                </label>
                <textarea
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-400 bg-white text-[#041229] font-futuraLight text-[14px] focus:outline-none focus:border-[#041229]"
                />
              </div>

              {errorMsg && (
                <p className="text-red-600 text-xs font-futuraLight">{errorMsg}</p>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-2.5 bg-[#041229] hover:bg-black text-white font-futuraLight text-[15px] font-bold transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? "Submitting..." : "Submit"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import { X, Send, CheckCircle2 } from "lucide-react";

interface ServicesClientProps {
  services: any[];
}

export default function ServicesClient({ services }: ServicesClientProps) {
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const defaultServices = [
    {
      num: "01",
      title: "Engineering Design",
      desc: "An engineering approach of design is always used for creating products. Primary design and conceptual designs are analyzed.",
    },
    {
      num: "02",
      title: "3D Modelling",
      desc: "Highly detailed, high quality, physics and engineering based 3D models are developed for various purposes.",
    },
    {
      num: "03",
      title: "Product design",
      desc: "Since an engineering approach is used, product design is also a core competence.",
    },
    {
      num: "04",
      title: "Simulations",
      desc: "Simulations for non destructive computer testing as well as gaming. Currently, involved in creation of railway simulation addons for Open Rails Train Simulator/MSTS.",
    },
    {
      num: "05",
      title: "Visualization",
      desc: "Creation of models for visualizations applications using rendering tools.",
    },
    {
      num: "06",
      title: "Installation support",
      desc: "If assistance is required in installing product, then installation support is provided.",
    },
  ];

  const handleOpenModal = (title?: string) => {
    setSelectedService(title || "General Engineering Inquiry");
    setSubmitSuccess(false);
    setSubmitError(null);
    setFormData({
      name: "",
      email: "",
      phone: "",
      message: title ? `Inquiry regarding ${title}: ` : "",
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          subject: `Service Inquiry: ${selectedService}`,
          message: formData.message,
        }),
      });

      if (res.ok) {
        setSubmitSuccess(true);
      } else {
        const err = await res.json();
        setSubmitError(err.error || "Failed to submit enquiry. Please try again.");
      }
    } catch (e: any) {
      setSubmitError(e.message || "An error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full bg-white text-[#101C32]">
      {/* 1. Light Blue Top Section: "What We Offer" + Vistadome Banner */}
      <div className="w-full bg-[#A7D2F7] py-16 px-4 border-b border-gray-200">
        <div className="max-w-[1080px] mx-auto text-center space-y-8">
          <h1 className="font-josefin text-[38px] sm:text-[46px] font-extralight tracking-wide text-[#0B2852]">
            What We Offer
          </h1>

          <div className="flex justify-center">
            <div className="border-4 border-[#0B2852] p-1.5 bg-white shadow-2xl rounded-2xl max-w-[850px] w-full overflow-hidden hover:scale-[1.01] transition-transform">
              <img
                src="/assets/tbpro/lhb_vistadome.png"
                alt="TB PRO LHB Coaches modeled for Open Rails and MSTS"
                className="w-full h-auto object-contain cursor-pointer rounded-xl"
                onClick={() => handleOpenModal("3D Modelling & Visualization")}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 2. Light Grey Bottom Section: "Our Services" + 2-Column Grid */}
      <div className="w-full bg-[#F5F6F8] py-20 px-4">
        <div className="max-w-[1080px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-10 items-start">
          {/* Left Title: "Our Services" */}
          <div className="md:col-span-4 space-y-4">
            <h2 className="font-josefin text-[38px] sm:text-[46px] font-extralight text-[#0B2852] leading-tight">
              Our<br />
              <span className="font-normal">Services</span>
            </h2>
            <p className="font-josefin text-sm text-gray-600 max-w-xs">
              Specialized engineering, 3D simulation modeling, and railway asset customization services.
            </p>

            <div className="pt-4">
              <button
                onClick={() => handleOpenModal()}
                className="px-8 py-3 rounded-full bg-[#0B2852] text-white font-josefin text-[15px] font-semibold hover:bg-[#39FF00] hover:text-[#101C32] transition-all shadow-md"
              >
                Inquire About Services
              </button>
            </div>
          </div>

          {/* Right Area: 2-Column Numbered Services (01 - 06) */}
          <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-10">
            {defaultServices.map((srv) => (
              <div key={srv.num} className="space-y-2 bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:border-[#0B2852] hover:shadow-md transition-all">
                <span className="inline-block font-josefin text-xs font-bold text-[#101C32] bg-[#39FF00] px-2.5 py-0.5 rounded-full">
                  {srv.num}
                </span>
                <h3
                  onClick={() => handleOpenModal(srv.title)}
                  className="font-josefin text-[22px] sm:text-[24px] font-semibold text-[#0B2852] hover:text-[#FF6600] cursor-pointer transition-colors block"
                >
                  {srv.title}
                </h3>
                <p className="font-josefin text-[15px] text-gray-700 leading-relaxed font-normal">
                  {srv.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Service Inquiry Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 animate-in fade-in backdrop-blur-sm"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 text-[#101C32] shadow-2xl relative border border-gray-200"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-black w-8 h-8 rounded-full flex items-center justify-center bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-josefin text-[24px] font-semibold text-[#0B2852] mb-1">
              Inquire: {selectedService}
            </h3>
            <p className="font-josefin text-[14px] text-gray-600 mb-6">
              Send your project specifications directly to the VG-3D engineering team.
            </p>

            {submitSuccess ? (
              <div className="py-8 text-center space-y-4">
                <CheckCircle2 className="w-14 h-14 text-[#39FF00] mx-auto" />
                <h4 className="font-josefin text-[22px] font-semibold text-[#0B2852]">Enquiry Received!</h4>
                <p className="font-josefin text-[14px] text-gray-600 max-w-xs mx-auto">
                  Thank you for reaching out. Varun Ganesh and the engineering team will respond promptly.
                </p>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="mt-4 px-8 py-2.5 bg-[#0B2852] text-white text-sm rounded-full font-josefin font-semibold hover:bg-[#39FF00] hover:text-[#101C32] transition-colors"
                >
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {submitError && (
                  <div className="p-3 bg-red-50 text-red-700 text-xs rounded border border-red-200">
                    {submitError}
                  </div>
                )}

                <div>
                  <label className="block font-josefin text-[13px] font-semibold text-gray-700 mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm font-josefin focus:outline-none focus:border-[#0B2852]"
                    placeholder="Enter your name"
                  />
                </div>

                <div>
                  <label className="block font-josefin text-[13px] font-semibold text-gray-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm font-josefin focus:outline-none focus:border-[#0B2852]"
                    placeholder="Enter your email"
                  />
                </div>

                <div>
                  <label className="block font-josefin text-[13px] font-semibold text-gray-700 mb-1">
                    Phone / WhatsApp Number
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm font-josefin focus:outline-none focus:border-[#0B2852]"
                    placeholder="+91..."
                  />
                </div>

                <div>
                  <label className="block font-josefin text-[13px] font-semibold text-gray-700 mb-1">
                    Project Requirements / Message *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm font-josefin focus:outline-none focus:border-[#0B2852]"
                    placeholder="Describe your simulator rolling stock or route modeling requirements..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-[#0B2852] hover:bg-[#39FF00] hover:text-[#101C32] text-white font-josefin font-semibold rounded-full shadow transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? "Submitting..." : "Send Engineering Enquiry"}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

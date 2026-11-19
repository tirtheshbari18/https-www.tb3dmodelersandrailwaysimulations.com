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
    <div className="w-full bg-white text-[#041229]">
      {/* 1. Sky Blue Top Section: "What We Offer" + Vistadome Banner */}
      <div className="w-full bg-[#9ac7f7] py-14 px-4">
        <div className="max-w-[980px] mx-auto text-center space-y-8">
          <h1 className="font-futuraBook text-[36px] sm:text-[40px] font-normal tracking-wide text-[#041229]">
            What We Offer
          </h1>

          <div className="flex justify-center">
            <div className="border-[3px] border-[#041229] p-1 bg-white shadow-md max-w-[800px] w-full">
              <img
                src="/assets/banners/services_vistadome_banner.png"
                alt="VG LHB VISTADOME COACHES modeled by Varun Ganesh"
                className="w-full h-auto object-contain cursor-pointer"
                onClick={() => handleOpenModal("3D Modelling & Visualization")}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 2. Soft Gray Bottom Section: "Our Services" + 2-Column Grid */}
      <div className="w-full bg-[#d9d9d9] py-16 px-4">
        <div className="max-w-[980px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Left Title: "Our Services" */}
          <div className="md:col-span-4">
            <h2 className="font-futuraBook text-[36px] sm:text-[40px] font-normal text-[#041229] leading-tight">
              Our<br />Services
            </h2>

            <div className="mt-8">
              <button
                onClick={() => handleOpenModal()}
                className="px-6 py-2.5 rounded-full bg-[#041229] text-white font-futuraLight text-[14px] font-bold hover:bg-black transition-colors shadow-sm"
              >
                Inquire About Services
              </button>
            </div>
          </div>

          {/* Right Area: 2-Column Numbered Services (01 - 06) */}
          <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-10">
            {defaultServices.map((srv) => (
              <div key={srv.num} className="space-y-1.5">
                <span className="block font-futuraBook text-[15px] text-[#041229] font-normal">
                  {srv.num}
                </span>
                <h3
                  onClick={() => handleOpenModal(srv.title)}
                  className="font-futuraBook text-[22px] sm:text-[24px] font-normal text-[#041229] hover:underline cursor-pointer"
                >
                  {srv.title}
                </h3>
                <p className="font-futuraLight text-[15px] sm:text-[16px] text-[#041229] leading-[26px]">
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
          className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-white rounded-lg max-w-lg w-full p-6 text-[#041229] shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-black"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-futuraBook text-[22px] font-normal mb-1">
              Inquire: {selectedService}
            </h3>
            <p className="font-futuraLight text-[14px] text-gray-600 mb-4">
              Send your project specifications directly to the VG-3D engineering team.
            </p>

            {submitSuccess ? (
              <div className="py-6 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-[#38D300] mx-auto" />
                <h4 className="font-futuraBook text-[18px] font-normal">Enquiry Received!</h4>
                <p className="font-futuraLight text-[14px] text-gray-600">
                  Thank you for reaching out. We will respond via email or WhatsApp promptly.
                </p>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="mt-4 px-6 py-2 bg-[#041229] text-white text-sm rounded font-futuraLight font-bold"
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
                  <label className="block font-futuraLight text-[13px] font-bold text-gray-700 mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm font-futuraLight focus:outline-none focus:border-[#041229]"
                    placeholder="Enter your name"
                  />
                </div>

                <div>
                  <label className="block font-futuraLight text-[13px] font-bold text-gray-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm font-futuraLight focus:outline-none focus:border-[#041229]"
                    placeholder="Enter your email"
                  />
                </div>

                <div>
                  <label className="block font-futuraLight text-[13px] font-bold text-gray-700 mb-1">
                    Phone / WhatsApp Number
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm font-futuraLight focus:outline-none focus:border-[#041229]"
                    placeholder="+91..."
                  />
                </div>

                <div>
                  <label className="block font-futuraLight text-[13px] font-bold text-gray-700 mb-1">
                    Project Details / Requirements *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm font-futuraLight focus:outline-none focus:border-[#041229]"
                    placeholder="Describe your 3D modeling, simulator, or engineering requirements..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2.5 bg-[#041229] hover:bg-black text-white text-sm font-futuraLight font-bold rounded flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  {isSubmitting ? "Sending..." : "Submit Inquiry"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

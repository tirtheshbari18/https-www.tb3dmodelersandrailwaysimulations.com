"use client";

import React from "react";

export default function WhatsAppButton() {
  const phoneNumber = "917738980989";
  const defaultMessage = encodeURIComponent(
    "Hi Varun! I am reaching out from VG-3D Modelers & Railway Simulations website regarding rolling stock / add-on queries."
  );
  const waUrl = `https://wa.me/${phoneNumber}?text=${defaultMessage}`;

  return (
    <aside aria-label="Quick WhatsApp Contact" className="fixed bottom-6 right-6 z-40 group">
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with Varun Ganesh on WhatsApp"
        className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all duration-300 relative"
      >
        <img
          src="/assets/icons/whatsapp.png"
          alt="WhatsApp"
          className="w-12 h-12 object-contain rounded-full shadow-md"
        />
      </a>
    </aside>
  );
}

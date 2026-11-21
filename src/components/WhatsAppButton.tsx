"use client";

import React from "react";

export default function WhatsAppButton() {
  const phoneNumber = "917738980989";
  const defaultMessage = encodeURIComponent(
    "Hi! I am reaching out from TB PRO website regarding Indian Railways LHB coaches and Open Rails / MSTS simulation add-ons."
  );
  const waUrl = `https://wa.me/${phoneNumber}?text=${defaultMessage}`;

  return (
    <aside aria-label="Quick WhatsApp Contact" className="fixed bottom-6 right-6 z-40 group">
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with TB PRO Support on WhatsApp"
        className="w-13 h-13 p-2 bg-[#16A34A] hover:bg-[#15803d] rounded-full flex items-center justify-center shadow-xl hover:scale-110 active:scale-95 transition-all duration-300 relative border-2 border-white"
      >
        <img
          src="/assets/icons/whatsapp.png"
          alt="WhatsApp"
          className="w-7 h-7 object-contain"
        />
      </a>
    </aside>
  );
}

import React from "react";
import { prisma } from "@/lib/prisma";
import { ShieldCheck, AlertTriangle } from "lucide-react";

export const revalidate = 0;

export const metadata = {
  title: "Railway Simulation Disclaimer | VG-3D Modelers",
};

export default async function DisclaimerPage() {
  const setting = await prisma.websiteSetting.findUnique({ where: { id: "default" } });

  return (
    <div className="min-h-screen bg-railway-darkest text-slate-100 pb-20">
      <div className="py-16 bg-railway-dark border-b border-railway-border text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-railway-accent/20 border border-railway-accent/40 text-xs font-bold text-red-400 uppercase tracking-wider mb-4">
          <AlertTriangle className="w-3.5 h-3.5 text-railway-accent" />
          <span>Trademark & Non-Affiliation Notice</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight">
          Independent Simulator Disclaimer
        </h1>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-railway-card p-6 sm:p-10 rounded-3xl border border-railway-border space-y-6 text-sm text-slate-300 leading-relaxed shadow-xl">
          <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-800/40 text-amber-300 text-xs flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <span>
              {setting?.disclaimerText ||
                "VG-3D Modelers & Railway Simulations is an independent digital creator platform operated by Varun Ganesh. All simulation models, rolling stock add-ons, and visual assets are crafted for train simulation enthusiasts and personal virtual railway operations."}
            </span>
          </div>

          <div className="space-y-4">
            <h3 className="text-base font-bold text-white">Indian Railways & Third-Party Trademarks</h3>
            <p>
              "Indian Railways", "IRCTC", "Rajdhani", "Shatabdi", "Humsafar", "Vistadome", "Vande Bharat", and associated zonal markings are registered trademarks and property of the Ministry of Railways, Government of India.
            </p>
            <p>
              All visual representations, 3D meshes, and liveries hosted on this website are non-official, artistic 3D digital recreations produced independently by Varun Ganesh solely for entertainment, educational appreciation of railway engineering, and train simulation in Open Rails and Microsoft Train Simulator.
            </p>
            <p>
              "Microsoft Train Simulator" is a trademark of Microsoft Corporation. "Open Rails" is an open-source train simulator project developed under GPL.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

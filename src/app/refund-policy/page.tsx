import React from "react";
import { prisma } from "@/lib/prisma";
import { ShieldCheck, RotateCcw } from "lucide-react";

export const revalidate = 0;

export const metadata = {
  title: "Digital Product Refund Policy | VG-3D Modelers",
};

export default async function RefundPolicyPage() {
  const setting = await prisma.websiteSetting.findUnique({ where: { id: "default" } });

  return (
    <div className="min-h-screen bg-railway-darkest text-slate-100 pb-20">
      <div className="py-16 bg-railway-dark border-b border-railway-border text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-xs font-bold text-amber-400 uppercase tracking-wider mb-4">
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Consumer Guarantee</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight">
          Digital Product Refund Policy
        </h1>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-railway-card p-6 sm:p-10 rounded-3xl border border-railway-border space-y-6 text-sm text-slate-300 leading-relaxed shadow-xl">
          <div className="whitespace-pre-line space-y-4">
            {setting?.refundContent || (
              <>
                <p>
                  Because our train simulation add-ons are digital goods delivered via immediate download, sales are generally non-refundable once the file link is accessed or downloaded.
                </p>
                <h3 className="text-base font-bold text-white mt-4">Technical Defect Guarantee</h3>
                <p>
                  If you encounter an irrecoverable technical bug or corrupted archive file that our technical support team cannot resolve within 5 business days, we will gladly provide a full refund or exchange credit.
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

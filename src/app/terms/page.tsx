import React from "react";
import { prisma } from "@/lib/prisma";

export const revalidate = 0;

export const metadata = {
  title: "Terms and Conditions | TB PRO • Indian Railways Simulation Platform",
};

export default async function TermsPage() {
  const setting = await prisma.websiteSetting.findUnique({ where: { id: "default" } });

  return (
    <div className="w-full bg-white text-[#041229] py-16 px-4">
      <div className="max-w-[900px] mx-auto space-y-8">
        <div className="text-center pb-4 border-b border-gray-200">
          <h1 className="font-futuraBook text-[32px] sm:text-[38px] font-normal text-[#041229]">
            Terms and Conditions
          </h1>
          <p className="font-futuraLight text-[14px] text-gray-500 mt-2">
            TB PRO Railway Simulations • Official Terms of Service
          </p>
        </div>

        <div className="space-y-6 font-futuraLight text-[15px] sm:text-[16px] text-[#041229] leading-[28.125px]">
          <p>
            Welcome to TB PRO Railway Simulations. By accessing our platform, purchasing,
            or downloading our 3D railway simulation models and digital assets, you agree to comply with
            and be bound by these Terms and Conditions.
          </p>

          <div className="space-y-2">
            <h2 className="font-futuraBook text-[20px] sm:text-[22px] font-normal text-[#041229]">
              1. Digital Content &amp; License Scope
            </h2>
            <p>
              All 3D meshes, rolling stock geometry, sound recordings, textures, and physics files are
              the exclusive creative work of the TB PRO development team. Purchases
              grant an individual, personal, non-exclusive, non-transferable license to install and run
              the simulation models on your personal computer in compatible simulation platforms
              (including Open Rails and Microsoft Train Simulator).
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="font-futuraBook text-[20px] sm:text-[22px] font-normal text-[#041229]">
              2. Strict No-Redistribution &amp; Anti-Piracy Policy
            </h2>
            <p>
              Users are strictly prohibited from sharing, re-uploading, reselling, renting, or
              distributing original files or derived assets on any public or private cloud drives, forums,
              social media channels, or third-party websites. Any unauthorized distribution constitutes a
              material violation and will result in revocation of access and potential legal recourse.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="font-futuraBook text-[20px] sm:text-[22px] font-normal text-[#041229]">
              3. Independent Simulation Addon Notice
            </h2>
            <p>
              All add-ons are independent artistic 3D digital models crafted for railway simulation
              hobbies. Products are not affiliated with, endorsed by, or connected to Indian Railways,
              Rail Coach Factory (RCF), Integral Coach Factory (ICF), or Modern Coach Factory (MCF).
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="font-futuraBook text-[20px] sm:text-[22px] font-normal text-[#041229]">
              4. Refunds &amp; Digital Delivery
            </h2>
            <p>
              Due to the immediate digital entitlement and download nature of computer software files,
              all sales are final upon fulfillment. If you experience technical defects or corrupt
              downloads, contact TB PRO technical support directly via email or our contact page for prompt technical support.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="font-futuraBook text-[20px] sm:text-[22px] font-normal text-[#041229]">
              5. Governing Law &amp; Entity
            </h2>
            <p>
              This service operates under MSME Registration UDYAM-MH-18-0225661, located in Maharashtra,
              India. Direct all official queries to the TB PRO support team.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

import React from "react";
import { prisma } from "@/lib/prisma";

export const revalidate = 0;

export const metadata = {
  title: "Privacy Policy | VG-3D Modelers & Railway Simulations",
};

export default async function PrivacyPage() {
  const setting = await prisma.websiteSetting.findUnique({ where: { id: "default" } });

  return (
    <div className="w-full bg-white text-[#041229] py-16 px-4">
      <div className="max-w-[900px] mx-auto space-y-8">
        <div className="text-center pb-4 border-b border-gray-200">
          <h1 className="font-futuraBook text-[32px] sm:text-[38px] font-normal text-[#041229]">
            Privacy Policy
          </h1>
          <p className="font-futuraLight text-[14px] text-gray-500 mt-2">
            VG-3D Modelers &amp; Railway Simulations • Privacy &amp; Data Protection
          </p>
        </div>

        <div className="space-y-6 font-futuraLight text-[15px] sm:text-[16px] text-[#041229] leading-[28.125px]">
          <p>
            At VG-3D Modelers &amp; Railway Simulations, we respect your privacy and are committed to
            protecting the personal data you share with us. This Privacy Policy outlines our data
            practices when you browse our site, register an account, or download digital simulation
            assets.
          </p>

          <div className="space-y-2">
            <h2 className="font-futuraBook text-[20px] sm:text-[22px] font-normal text-[#041229]">
              1. Information We Collect
            </h2>
            <p>
              We collect information to provide a smooth simulation and downloading experience:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-gray-700">
              <li>
                <strong>Personal Data:</strong> Name, email address, and account credentials when you
                register as a member.
              </li>
              <li>
                <strong>Order Data:</strong> Digital purchase history, transaction IDs, and download
                entitlement counters. Payment processing is handled by secure third-party gateways; we
                never store raw credit card numbers.
              </li>
              <li>
                <strong>Technical Logs:</strong> IP address and user-agent details strictly recorded for
                secure digital asset streaming and anti-fraud verification.
              </li>
            </ul>
          </div>

          <div className="space-y-2">
            <h2 className="font-futuraBook text-[20px] sm:text-[22px] font-normal text-[#041229]">
              2. How We Use Your Data
            </h2>
            <p>
              Your personal data is used solely to authenticate your account, maintain your digital
              product entitlement library, process simulator add-on orders, and communicate important
              file update notifications or critical simulator patches.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="font-futuraBook text-[20px] sm:text-[22px] font-normal text-[#041229]">
              3. Data Protection &amp; Retention
            </h2>
            <p>
              All customer sessions and credentials are encrypted using industry-standard hashing
              and JWT token encryption. We do not sell, rent, or trade customer information to third
              parties for marketing purposes.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="font-futuraBook text-[20px] sm:text-[22px] font-normal text-[#041229]">
              4. Contact the Data Controller
            </h2>
            <p>
              For privacy inquiries, account deletion requests, or data access requests, please reach
              out to Varun Ganesh at varunganesh221@gmail.com.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

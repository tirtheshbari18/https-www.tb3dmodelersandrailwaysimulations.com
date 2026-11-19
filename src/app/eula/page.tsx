import React from "react";
import { prisma } from "@/lib/prisma";

export const revalidate = 0;

export const metadata = {
  title: "End User License Agreement (EULA) | VG-3D Modelers & Railway Simulations",
};

export default async function EulaPage() {
  const setting = await prisma.websiteSetting.findUnique({ where: { id: "default" } });

  return (
    <div className="w-full bg-white text-[#041229] py-16 px-4">
      <div className="max-w-[900px] mx-auto space-y-8">
        <div className="text-center pb-4 border-b border-gray-200">
          <h1 className="font-futuraBook text-[32px] sm:text-[38px] font-normal text-[#041229]">
            End User License Agreement (EULA)
          </h1>
          <p className="font-futuraLight text-[14px] text-gray-500 mt-2">
            Developer: VG-3D Modelers &amp; Railway Simulations • Lead Developer: Varun Ganesh &amp; Team
          </p>
        </div>

        <div className="space-y-6 font-futuraLight text-[15px] sm:text-[16px] text-[#041229] leading-[28.125px]">
          <div className="space-y-2">
            <h2 className="font-futuraBook text-[20px] sm:text-[22px] font-normal text-[#041229]">
              1.1 Grant of License
            </h2>
            <p>
              By purchasing, downloading, or installing any content from VG-3D Modelers &amp; Railway
              Simulations, you are granted a non-exclusive, non-transferable, revocable license to use
              the digital assets strictly for personal, non-commercial entertainment and simulation
              purposes on compatible simulators (including Open Rails and MSTS).
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="font-futuraBook text-[20px] sm:text-[22px] font-normal text-[#041229]">
              1.2 Intellectual Property Rights
            </h2>
            <p>
              All rights, titles, and interests in and to the Product remain the exclusive intellectual
              property of Varun Ganesh. This includes:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-gray-700">
              <li>3D Geometry: All 3D meshes, polygons, and shape files (.s, .obj).</li>
              <li>Artistic Assets: All custom textures, bake maps, and material files (.ace, .dds, .png).</li>
              <li>Configuration &amp; Logic: Physics coding, wagon parameters, sound engineering, and scripting (.wag, .eng, .sms).</li>
              <li>Branding: The VG-3D Modelers &amp; Railway Simulations name, insignias, and associated assets.</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h2 className="font-futuraBook text-[20px] sm:text-[22px] font-normal text-[#041229]">
              1.3 Restrictions on Use &amp; No Repaints Policy
            </h2>
            <p>
              Repainting, texture swapping, reverse-engineering, or decompiling 3D shape files is strictly
              prohibited unless an official template or repaint kit is explicitly published by the developer.
              Any attempt to convert or port assets to commercial third-party platforms without prior written
              authorization will result in immediate termination of license rights.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="font-futuraBook text-[20px] sm:text-[22px] font-normal text-[#041229]">
              1.4 Disclaimer &amp; Simulator Compatibility
            </h2>
            <p>
              The product is provided &quot;AS IS&quot; without warranty of any kind. The developer
              disclaims all warranties, express or implied, regarding performance, stability, or
              compatibility with unverified third-party scripts.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

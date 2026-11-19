import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { 
  CheckCircle, 
  Download, 
  Package, 
  FileText, 
  ArrowRight, 
  ShieldCheck, 
  Mail, 
  Train 
} from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";

export const revalidate = 0;

export default async function OrderSuccessPage({
  params,
}: {
  params: { orderId: string };
}) {
  const { orderId } = params;

  const order = await prisma.order.findFirst({
    where: {
      OR: [{ id: orderId }, { orderNumber: orderId }],
    },
    include: {
      items: {
        include: {
          product: {
            include: {
              files: true,
              images: { take: 1 },
            },
          },
        },
      },
      payments: true,
      entitlements: {
        include: {
          productFile: true,
        },
      },
    },
  });

  if (!order) {
    notFound();
  }

  // Collect all downloadable files linked to this order
  const downloadableFiles: any[] = [];
  for (const item of order.items) {
    if (item.product?.files) {
      for (const file of item.product.files) {
        downloadableFiles.push({
          fileId: file.id,
          fileName: file.fileName,
          name: file.name,
          format: file.fileFormat,
          size: file.fileSize,
          version: file.version,
          productName: item.product.name,
        });
      }
    }
  }

  return (
    <div className="min-h-screen bg-white text-[#041229] pb-20 font-futura">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Success Card */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm p-6 sm:p-10 space-y-8">
          {/* Header */}
          <div className="text-center space-y-3 pb-8 border-b border-gray-200">
            <div className="w-16 h-16 rounded-full bg-green-50 border border-[#38D300] text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle className="w-8 h-8" />
            </div>
            <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wider block">
              Payment Confirmed &amp; Verified
            </span>
            <h1 className="text-2xl sm:text-3xl font-normal text-[#041229] tracking-tight">
              Thank You For Your Order!
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 max-w-lg mx-auto leading-relaxed">
              Your order <strong>#{order.orderNumber}</strong> has been successfully processed.
              Your simulator files are ready for immediate download below.
            </p>
          </div>

          {/* Downloadable Assets Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-[#041229] flex items-center gap-2">
                <Download className="w-5 h-5 text-[#38D300]" />
                Your Purchased Digital Downloads
              </h2>
              <span className="text-xs text-gray-500 font-mono">
                {downloadableFiles.length} File(s) Ready
              </span>
            </div>

            <div className="space-y-3">
              {downloadableFiles.length > 0 ? (
                downloadableFiles.map((file) => (
                  <div
                    key={file.fileId}
                    className="p-4 rounded-lg bg-gray-50 border border-gray-200 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between hover:border-gray-400 transition-colors"
                  >
                    <div>
                      <span className="text-[10px] text-gray-500 font-semibold uppercase block">
                        {file.productName}
                      </span>
                      <h4 className="font-semibold text-sm text-[#041229]">{file.name}</h4>
                      <p className="text-[11px] text-gray-500 mt-0.5">
                        Format: <strong>{file.format}</strong> • Size: {file.size} • Version: {file.version}
                      </p>
                    </div>

                    <a
                      href={`/api/downloads/${file.fileId}`}
                      download
                      className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-[#38D300] hover:bg-green-400 text-black font-semibold text-xs flex items-center justify-center gap-2 shadow-sm transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      Download File
                    </a>
                  </div>
                ))
              ) : (
                <div className="p-4 rounded-lg bg-gray-50 text-xs text-gray-600">
                  Files linked to your account. You can also view them in your{" "}
                  <Link href="/downloads" className="text-black underline font-semibold">
                    Downloads Portal
                  </Link>
                  .
                </div>
              )}
            </div>
          </div>

          {/* Invoice Summary */}
          <div className="p-5 rounded-lg bg-gray-50 border border-gray-200 space-y-4 text-xs">
            <h3 className="font-semibold text-[#041229] uppercase tracking-wider border-b border-gray-200 pb-2">
              Order Details &amp; Receipt
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <span className="text-gray-500 block text-[10px] uppercase font-bold">Order Number</span>
                <span className="font-mono font-semibold text-[#041229]">{order.orderNumber}</span>
              </div>
              <div>
                <span className="text-gray-500 block text-[10px] uppercase font-bold">Date</span>
                <span className="text-[#041229] font-medium">{formatDate(order.createdAt)}</span>
              </div>
              <div>
                <span className="text-gray-500 block text-[10px] uppercase font-bold">Payment Status</span>
                <span className="text-emerald-700 font-bold uppercase">{order.status}</span>
              </div>
              <div>
                <span className="text-gray-500 block text-[10px] uppercase font-bold">Total Paid</span>
                <span className="text-[#041229] font-bold">{formatCurrency(order.finalAmount)}</span>
              </div>
            </div>

            <div className="pt-2 text-gray-600 border-t border-gray-200 space-y-1">
              <p>
                <strong>Customer:</strong> {order.customerName} ({order.customerEmail})
              </p>
              <p>
                <strong>Payment Method:</strong> {order.paymentMethod}{" "}
                {order.paymentId && `(Ref: ${order.paymentId})`}
              </p>
            </div>
          </div>

          {/* Next Steps CTAs */}
          <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-between items-center border-t border-gray-200 text-xs">
            <Link
              href="/downloads"
              className="text-gray-700 hover:text-black flex items-center gap-1.5 font-medium"
            >
              <Package className="w-4 h-4 text-[#041229]" />
              Go to My Downloads Library
            </Link>

            <Link
              href="/shop"
              className="px-5 py-2.5 rounded-full bg-[#041229] hover:bg-black text-white font-medium transition-colors flex items-center gap-1.5"
            >
              Continue Exploring Shop
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

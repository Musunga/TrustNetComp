"use client"

import Image from "next/image"
import trustnetLogo from "@/assets/images/logo.png"

/** Centered low-opacity logo behind report content (same idea as PDF watermark). */
export function TrustNetReportWatermark() {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center overflow-hidden rounded-[inherit] select-none"
      aria-hidden
    >
      <Image
        src={trustnetLogo}
        alt=""
        width={1440}
        height={400}
        className="h-auto max-h-[min(480px,100%)] w-[min(880px,140%)] object-contain opacity-[0.08]"
        sizes="(max-width: 768px) 140vw, 880px"
      />
    </div>
  )
}

"use client"

import { useState } from "react"
import { LiveCapture } from "@/components/shared/LiveCapture"

const CAPTURE_LABELS = ["Turn left", "Turn right", "Still 1", "Still 2", "Still 3", "Still 4"]

function Page() {
  const [capturedImages, setCapturedImages] = useState<string[]>([])

  return (
    <div className="container mx-auto relative flex min-h-screen flex-col items-center justify-center gap-6 py-8 md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
        <div className="absolute inset-0 bg-primary" />
      </div>
      <div className="flex w-full max-w-2xl flex-col items-center gap-6">
        <LiveCapture
          onVerificationComplete={(result) => {
            if (result.status === "completed") setCapturedImages(result.images)
          }}
          onRestart={() => setCapturedImages([])}
        />
        {capturedImages.length > 0 && (
          <div className="w-full space-y-2">
            <h3 className="text-sm font-bold text-foreground">Captured images ({capturedImages.length})</h3>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {capturedImages.map((src, i) => (
                <div key={i} className="flex flex-col overflow-hidden rounded-lg border border-border bg-muted">
                  <img
                    src={src}
                    alt={CAPTURE_LABELS[i] ?? `Capture ${i + 1}`}
                    className="aspect-video w-full object-cover"
                  />
                  <p className="px-2 py-1 text-center text-xs font-medium text-muted-foreground">
                    {CAPTURE_LABELS[i] ?? `Capture ${i + 1}`}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Page

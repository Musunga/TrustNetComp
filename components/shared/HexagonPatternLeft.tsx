"use client"

import React from "react"
import { cn } from "@/lib/utils"

const HEX_SIZE = 24
const HEX_WIDTH = HEX_SIZE * 2
const HEX_HEIGHT = Math.sqrt(3) * HEX_SIZE
const PATTERN_WIDTH = HEX_WIDTH * 1.5
const PATTERN_HEIGHT = HEX_HEIGHT

function hexagonPoints(cx: number, cy: number, r: number) {
  const points: [number, number][] = []
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i - Math.PI / 6
    points.push([cx + r * Math.cos(angle), cy + r * Math.sin(angle)])
  }
  return points.map(([x, y]) => `${x},${y}`).join(" ")
}

interface HexagonPatternLeftProps {
  className?: string
  width?: string
}

export function HexagonPatternLeft({
  className,
  width = "50%",
}: HexagonPatternLeftProps) {
  const r = HEX_SIZE - 2
  const cx = HEX_SIZE
  const cy = HEX_SIZE

  return (
    <svg
      aria-hidden
      className={cn(
        "pointer-events-none fixed left-0 top-10 -z-10 h-[calc(100vh-4rem)] w-full animate-in fade-in duration-700 ease-out fill-none stroke-primary/10 dark:stroke-muted-foreground/10",
        className
      )}
      style={{ width }}
      preserveAspectRatio="xMinYMin slice"
    >
      <defs>
        <pattern
          id="hex-pattern-left"
          x="0"
          y="0"
          width={PATTERN_WIDTH}
          height={PATTERN_HEIGHT}
          patternUnits="userSpaceOnUse"
        >
          <polygon
            points={hexagonPoints(cx, cy, r)}
            className="stroke-[0.5]"
          />
          <polygon
            points={hexagonPoints(cx + PATTERN_WIDTH / 2, cy + PATTERN_HEIGHT / 2, r)}
            className="stroke-[0.5]"
          />
        </pattern>
        <linearGradient
          id="hex-fade-left"
          x1="0%"
          y1="0"
          x2="100%"
          y2="0"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="white" stopOpacity="1" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </linearGradient>
        <mask id="hex-mask-left">
          <rect x="0" y="0" width="100%" height="100%" fill="url(#hex-fade-left)" />
        </mask>
      </defs>
      <rect
        x="0"
        y="0"
        width="100%"
        height="100%"
        fill="url(#hex-pattern-left)"
        mask="url(#hex-mask-left)"
      />
    </svg>
  )
}

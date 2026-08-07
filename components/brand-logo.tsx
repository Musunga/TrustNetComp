'use client'

import * as React from 'react'
import Image, { type StaticImageData } from 'next/image'
import  logoWhiteBg from '@/assets/images/logo-dark.png'
import  logoDark from '@/assets/images/logo.png'
import { cn } from '@/lib/utils'

type BrandLogoSource = string | StaticImageData

type BrandLogoProps = {
  lightSrc?: BrandLogoSource
  darkSrc?: BrandLogoSource
  alt?: string
  className?: string
  width?: number
  height?: number
  priority?: boolean
}

const DEFAULT_LOGO = logoDark // Dark logo for light theme
const DEFAULT_LOGO_WHITE = logoWhiteBg // White logo for dark theme

export function BrandLogo({
  lightSrc = DEFAULT_LOGO,
  darkSrc = DEFAULT_LOGO_WHITE,
  alt = 'TrustNetComp',
  className,
  width = 120,
  height = 32,
  priority,
}: BrandLogoProps) {
  return (
    <div className={cn('inline-flex h-8 w-auto max-w-full items-center', className)}>
      <Image
        src={lightSrc}
        alt={alt}
        width={width}
        height={height}
        className="h-full w-auto max-w-full object-contain dark:hidden"
        priority={priority}
      />
      <Image
        src={darkSrc}
        alt={alt}
        width={width}
        height={height}
        className="hidden h-full w-auto max-w-full object-contain dark:inline-block"
        priority={priority}
      />
    </div>
  )
}



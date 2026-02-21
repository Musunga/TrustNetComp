'use client'

import * as React from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'

type BrandLogoProps = {
  lightSrc?: string
  darkSrc?: string
  alt?: string
  className?: string
  width?: number
  height?: number
  priority?: boolean
}

const DEFAULT_LOGO = '/logo.png'
const DEFAULT_LOGO_DARK   = '/logo-dark.png'

export function BrandLogo({
  lightSrc = DEFAULT_LOGO,
  darkSrc = DEFAULT_LOGO_DARK,
  alt = 'TrustNetComp',
  className,
  width = 120,
  height = 32,
  priority,
}: BrandLogoProps) {
  return (
    <div className={cn('relative', className)}>
      <Image
        src={lightSrc}
        alt={alt}
        width={width}
        height={height}
        className="inline-block dark:hidden h-full w-auto"
        priority={priority}
      />
      <Image
        src={darkSrc}
        alt={alt}
        width={width}
        height={height}
        className="hidden dark:inline-block h-full w-auto"
        priority={priority}
      />
    </div>
  )
}



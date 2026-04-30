"use client"

import { useState } from "react"

function Page() {


  return (
    <div className="container mx-auto relative flex min-h-screen flex-col items-center justify-center gap-6 py-8 md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
        <div className="absolute inset-0 bg-primary" />
      </div>
      <div className="flex w-full max-w-2xl flex-col items-center gap-6">

      </div>
    </div>
  )
}

export default Page

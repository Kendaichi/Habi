"use client"

import type { ReactNode } from 'react'
import { Toaster } from 'sileo'

interface ToasterProviderProps {
  children: ReactNode
  position?:
    | 'top-right'
    | 'top-left'
    | 'bottom-right'
    | 'bottom-left'
    | 'top-center'
    | 'bottom-center'
}

export default function ToasterProvider({
  children,
  position = 'top-center',
}: ToasterProviderProps) {
  return (
    <>
      {children}
      <Toaster
        position={position}
        options={{
          fill: '#ffffff',
          roundness: 16,
          styles: {
            title: 'text-slate-900',
            description: 'text-slate-600',
            badge: 'bg-slate-100 text-slate-700',
            button: 'bg-slate-100 text-slate-700 hover:bg-slate-200',
          },
        }}
      />
    </>
  )
}

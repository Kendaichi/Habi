"use client"

import { useState } from "react"
import { motion } from "framer-motion"

export type ToggleValue = "buy" | "rent" | "lease"

interface BuyRentLeaseToggleProps {
  value?: ToggleValue
  onChange?: (val: ToggleValue) => void
}

const OPTIONS: { label: string; value: ToggleValue }[] = [
  { label: "Buy", value: "buy" },
  { label: "Rent", value: "rent" },
  { label: "Lease", value: "lease" },
]

export function BuyRentLeaseToggle({ value = "buy", onChange }: BuyRentLeaseToggleProps) {
  const [active, setActive] = useState<ToggleValue>(value)

  const handleSelect = (val: ToggleValue) => {
    setActive(val)
    onChange?.(val)
  }

  return (
    <div className="inline-flex rounded-full bg-muted p-1 gap-0.5">
      {OPTIONS.map((opt) => (
        <button
          key={opt.value}
          onClick={() => handleSelect(opt.value)}
          className="relative px-4 py-1.5 text-sm font-medium rounded-full transition-colors z-10"
          style={{ color: active === opt.value ? "#2C2C2C" : "#8B8680" }}
        >
          {active === opt.value && (
            <motion.div
              layoutId="toggle-pill"
              className="absolute inset-0 rounded-full bg-mustard -z-10"
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            />
          )}
          {opt.label}
        </button>
      ))}
    </div>
  )
}

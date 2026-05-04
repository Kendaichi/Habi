"use client"

import { useEffect, useRef } from "react"
import { animate } from "framer-motion"

interface ImpactCounterProps {
  target: number
  duration?: number
  prefix?: string
  suffix?: string
  className?: string
}

export function ImpactCounter({
  target,
  duration = 2,
  prefix = "",
  suffix = "",
  className,
}: ImpactCounterProps) {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    const controls = animate(0, target, {
      duration,
      ease: "easeOut",
      onUpdate: (value) => {
        node.textContent = prefix + Math.round(value).toLocaleString() + suffix
      },
    })

    return () => controls.stop()
  }, [target, duration, prefix, suffix])

  return (
    <span ref={ref} className={className}>
      {prefix}0{suffix}
    </span>
  )
}

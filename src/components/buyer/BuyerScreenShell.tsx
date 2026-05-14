import { BuyerBottomNav } from '@/components/buyer/BuyerBottomNav'
import { BuyerTopBar } from '@/components/buyer/BuyerTopBar'

type BuyerScreenShellProps = {
  children: React.ReactNode
  title?: string
  eyebrow?: string
  showTopBar?: boolean
  showBottomNav?: boolean
  className?: string
}

export function BuyerScreenShell({
  children,
  title,
  eyebrow,
  showTopBar = true,
  showBottomNav = true,
  className = '',
}: BuyerScreenShellProps) {
  return (
    <div
      className={`min-h-screen bg-[linear-gradient(180deg,_#faf6f0_0%,_#fffaf6_44%,_#f4ece3_100%)] ${className}`}
    >
      {showTopBar ? <BuyerTopBar title={title} eyebrow={eyebrow} /> : null}
      <main className="mx-auto max-w-md px-5 pt-6 pb-32 sm:max-w-2xl sm:px-6">{children}</main>
      {showBottomNav ? <BuyerBottomNav /> : null}
    </div>
  )
}

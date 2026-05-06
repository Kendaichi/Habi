import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'

export default function SignInPage() {
  return (
    <div className="bg-cream flex min-h-screen flex-col items-center justify-center p-6">
      {/* Logo + Brand */}
      <div className="mb-8 flex flex-col items-center">
        <Image
          src="/Habi_Logo.png"
          alt="Habi Logo"
          width={56}
          height={56}
          className="mb-4 rounded-2xl"
        />
        <h1 className="font-heading text-forest text-3xl font-bold">Elevated Craft</h1>
        <p className="text-stone mt-1 text-sm">Honoring Mindanao&apos;s artisan heritage.</p>
      </div>

      {/* Card */}
      <div className="w-full max-w-sm rounded-2xl bg-white p-7 shadow-sm">
        <h2 className="font-heading text-charcoal text-2xl font-bold">Create Account</h2>
        <p className="text-stone mt-1 mb-6 text-sm">Sign up to manage your workshop.</p>

        <div className="space-y-4">
          {/* Email */}
          <div className="space-y-1.5">
            <Label className="text-charcoal text-xs font-semibold tracking-widest uppercase">
              Email Address
            </Label>
            <Input type="email" placeholder="name@artisan.ph" className="bg-cream border-border" />
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label className="text-charcoal text-xs font-semibold tracking-widest uppercase">
                Password
              </Label>
              <Link
                href="/onboarding/forgot-password"
                className="text-terracotta text-xs hover:underline"
              >
                Forgot?
              </Link>
            </div>
            <Input type="password" placeholder="••••••••" className="bg-cream border-border" />
          </div>

          {/* Sign Up Button */}
          <Button className="bg-forest hover:bg-forest/90 text-cream mt-2 w-full font-semibold">
            Sign Up →
          </Button>

          {/* Divider */}
          <div className="flex items-center gap-3 py-1">
            <Separator className="flex-1" />
            <span className="text-stone text-xs tracking-widest uppercase">or continue with</span>
            <Separator className="flex-1" />
          </div>

          {/* Magic Link Button */}
          <Button
            variant="outline"
            className="border-border text-charcoal w-full gap-2 font-semibold"
          >
            <Image src="/Habi_Logo.png" alt="" width={16} height={16} className="rounded-sm" />
            Magic Link
          </Button>
        </div>
      </div>

      {/* Footer */}
      <p className="text-stone mt-6 text-sm">
        Already have an account?{' '}
        <Link href="/onboarding/signin" className="text-terracotta font-semibold hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  )
}

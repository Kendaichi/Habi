'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useMemo, useState, type FormEvent } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useRole, type UserRole } from '@/context/RoleContext'
import { getRoleHomeRoute, isUserRole, roleLabels } from '@/lib/role-routes'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import { hasSupabaseBrowserEnv } from '@/lib/supabase/env'

type OnboardingAuthFormProps = {
  mode: 'signin' | 'signup'
  initialRole: string | null
}

const roleDescriptions: Record<UserRole, string> = {
  buyer: 'Browse pieces, use AI Room, and track circular impact.',
  artisan: 'Manage listings, source materials, and respond to demand signals.',
  supplier: 'Manage waste inventory and connect materials to circular makers.',
  junkshop: 'Track sorted inventory and connect verified materials to artisans.',
}

export function OnboardingAuthForm({ mode, initialRole }: OnboardingAuthFormProps) {
  const router = useRouter()
  const { role, setRole } = useRole()
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isPending, setIsPending] = useState(false)
  const resolvedRole = useMemo<UserRole | null>(() => {
    if (isUserRole(initialRole)) return initialRole
    return role
  }, [initialRole, role])
  const selectedRole = resolvedRole
  const isSignup = mode === 'signup'

  async function completeProfile(input: { role?: UserRole; name?: string }) {
    const response = await fetch('/api/auth/profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    })
    const payload = (await response.json()) as {
      error?: string
      redirectTo?: string
      user?: { role: UserRole }
    }

    if (!response.ok || !payload.redirectTo) {
      throw new Error(payload.error ?? 'Unable to create your Habi profile.')
    }

    if (payload.user?.role) setRole(payload.user.role)
    router.replace(payload.redirectTo)
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setMessage(null)
    if (!selectedRole) {
      router.push('/onboarding/role-select')
      return
    }

    const form = new FormData(event.currentTarget)
    const email = String(form.get('email') ?? '').trim()
    const password = String(form.get('password') ?? '')
    const name = String(form.get('name') ?? '').trim()

    if (!email || !password) {
      setError('Email and password are required.')
      return
    }

    setIsPending(true)

    try {
      if (!hasSupabaseBrowserEnv()) {
        if (selectedRole) setRole(selectedRole)
        router.replace(getRoleHomeRoute(selectedRole ?? 'buyer'))
        return
      }

      const supabase = createSupabaseBrowserClient()

      const result = isSignup
        ? await supabase.auth.signUp({
            email,
            password,
            options: {
              data: {
                name: name || email.split('@')[0],
                role: selectedRole,
              },
            },
          })
        : await supabase.auth.signInWithPassword({ email, password })

      if (result.error) throw result.error

      if (!result.data.session) {
        throw new Error(
          'Email confirmation is still enabled in Supabase. Turn it off in Authentication settings to use email/password without confirmation.',
        )
      }

      await completeProfile({ role: selectedRole, name })
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Authentication failed.')
    } finally {
      setIsPending(false)
    }
  }

  const roleQuery = selectedRole ? `?role=${selectedRole}` : ''

  return (
    <div className="bg-cream flex min-h-screen flex-col items-center justify-center p-6">
      <div className="mb-8 flex flex-col items-center text-center">
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

      <form onSubmit={handleSubmit} className="w-full max-w-sm rounded-2xl bg-white p-7 shadow-sm">
        <h2 className="font-heading text-charcoal text-2xl font-bold">
          {isSignup ? 'Create Account' : 'Welcome Back'}
        </h2>
        <p className="text-stone mt-1 text-sm">
          {selectedRole
            ? `${isSignup ? 'Sign up' : 'Sign in'} as a ${roleLabels[selectedRole]}.`
            : 'Choose a role to continue into the right Habi workspace.'}
        </p>

        <div className="mt-5 rounded-2xl border border-forest/15 bg-forest/6 p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-forest text-xs font-semibold tracking-widest uppercase">
                Selected Role
              </p>
              <p className="font-heading text-charcoal mt-1 text-2xl font-semibold">
                {selectedRole ? roleLabels[selectedRole] : 'No role selected'}
              </p>
              <p className="text-stone mt-1 text-sm leading-relaxed">
                {selectedRole
                  ? roleDescriptions[selectedRole]
                  : 'Start from role selection so your dashboard, nav, and actions match your account.'}
              </p>
            </div>
            <Link
              href="/onboarding/role-select"
              className="text-terracotta shrink-0 text-xs font-semibold uppercase tracking-widest"
            >
              Change
            </Link>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          <div className="space-y-1.5">
            <Label className="text-charcoal text-xs font-semibold tracking-widest uppercase">
              Email Address
            </Label>
            <Input
              name="email"
              type="email"
              required
              placeholder={
                selectedRole === 'buyer'
                  ? 'name@habi.ph'
                  : selectedRole === 'junkshop'
                    ? 'hub@junkshop.ph'
                    : 'name@artisan.ph'
              }
              className="bg-cream border-border"
            />
          </div>

          {isSignup ? (
            <div className="space-y-1.5">
              <Label className="text-charcoal text-xs font-semibold tracking-widest uppercase">
                Full Name
              </Label>
              <Input
                name="name"
                type="text"
                placeholder="Juan Dela Cruz"
                className="bg-cream border-border"
              />
            </div>
          ) : null}

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label className="text-charcoal text-xs font-semibold tracking-widest uppercase">
                Password
              </Label>
              {!isSignup ? (
                <span className="text-stone text-xs">Email/password only</span>
              ) : null}
            </div>
            <Input
              name="password"
              type="password"
              required
              minLength={6}
              placeholder="password"
              className="bg-cream border-border"
            />
          </div>

          {error ? (
            <p className="rounded-xl border border-terracotta/25 bg-terracotta/10 px-3 py-2 text-sm text-terracotta">
              {error}
            </p>
          ) : null}
          {message ? (
            <p className="rounded-xl border border-forest/20 bg-forest/10 px-3 py-2 text-sm text-forest">
              {message}
            </p>
          ) : null}

          <Button
            disabled={isPending}
            className="bg-forest hover:bg-forest/90 text-cream mt-2 w-full font-semibold"
          >
            {isSignup ? 'Create Account' : 'Sign In'} -{' '}
            {selectedRole ? roleLabels[selectedRole] : 'Choose Role'}
          </Button>
        </div>
      </form>

      <p className="text-stone mt-6 text-sm">
        {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
        <Link
          href={isSignup ? `/onboarding/signin${roleQuery}` : '/onboarding/role-select'}
          className="text-terracotta font-semibold hover:underline"
        >
          {isSignup ? 'Sign in' : 'Sign up'}
        </Link>
      </p>
    </div>
  )
}

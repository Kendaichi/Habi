import { OnboardingAuthForm } from '@/components/auth/OnboardingAuthForm'

export default async function SignUpPage({
  searchParams,
}: {
  searchParams: Promise<{ role?: string }>
}) {
  const { role } = await searchParams

  return <OnboardingAuthForm mode="signup" initialRole={role ?? null} />
}

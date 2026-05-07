import { OnboardingAuthForm } from '@/components/auth/OnboardingAuthForm'

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ role?: string }>
}) {
  const { role } = await searchParams

  return <OnboardingAuthForm mode="signin" initialRole={role ?? null} />
}

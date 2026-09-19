import type { Metadata } from 'next'
import RegistrationFlow from '@/components/auth/RegistrationFlow'
export const metadata: Metadata = { title: 'Register' }
export default function RegisterPage() {
  return <RegistrationFlow />
}

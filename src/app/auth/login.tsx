import { finishLoginRedirect } from '@/context/auth/Auth'
import { Redirect } from 'expo-router'

// Link browser closing.
finishLoginRedirect()

export default function Login() {
  // App redirect after IDP login goes to this page, but at this point we
  // completed the login, so go back to homepage.
  return <Redirect href="/" />
}

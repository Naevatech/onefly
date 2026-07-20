import { SignIn } from '@clerk/clerk-react'

const SignInPage = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-16">
      <SignIn path="/sign-in" routing="path" signUpUrl="/sign-up" />
    </div>
  )
}

export default SignInPage
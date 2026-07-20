import React from 'react'
import { useAuth } from '@clerk/clerk-react'
import { Navigate, useLocation } from 'react-router-dom'

type ProtectedRouteProps = {
  children: React.ReactNode
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isLoaded, isSignedIn } = useAuth()
  const location = useLocation()

  if (!isLoaded) return null

  if (!isSignedIn) {
    return <Navigate to="/sign-in" state={{ from: location }} replace />
  }

  return <>{children}</>
}

export default ProtectedRoute
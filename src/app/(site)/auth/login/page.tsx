// app/(auth)/login/page.tsx
import { Metadata } from 'next'
import { LoginForm } from './components/login-form'

export const metadata: Metadata = {
    title: 'Sign In | TrackMaster',
    description: 'Sign in to your account to access your dashboard and manage your services.',
    openGraph: {
        title: 'Sign In | TrackMaster',
        description: 'Sign in to your account to access your dashboard and manage your services.',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Sign In | TrackMaster',
        description: 'Sign in to your account to access your dashboard and manage your services.',
    },
}

export default function LoginPage() {
    return (
        <LoginForm />
    )
}
'use client';

import { useSearchParams } from 'next/navigation';
import { AlertTriangle } from 'lucide-react';

export function ErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Authentication Error</h1>
          <p className="text-gray-600 text-center">
            {error === 'OAuthSignin' && 'Error occurred during OAuth sign-in.'}
            {error === 'OAuthCallback' && 'Error occurred during OAuth callback.'}
            {error === 'OAuthCreateAccount' && 'Error occurred while creating OAuth account.'}
            {error === 'EmailCreateAccount' && 'Error occurred while creating email account.'}
            {error === 'Callback' && 'Error occurred during the callback.'}
            {error === 'OAuthAccountNotLinked' && 'Email is already used with different provider.'}
            {error === 'EmailSignin' && 'Error occurred while sending email sign-in link.'}
            {error === 'CredentialsSignin' && 'Invalid credentials provided.'}
            {error === 'SessionRequired' && 'Please sign in to access this page.'}
            {!error && 'An unknown error occurred.'}
          </p>
          <a
            href="/auth/signin"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Try Again
          </a>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { CheckCircle } from 'lucide-react';

interface PaymentDetails {
  plan: string;
  amount: number;
  interval: string;
  credits: number;
}

export function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (sessionId) {
      fetch(`/api/checkout/session?session_id=${sessionId}`)
        .then((res) => res.json())
        .then((data) => {
          setPaymentDetails(data);
          setLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching payment details:', error);
          setLoading(false);
        });
    }
  }, [sessionId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="text-gray-600">Loading payment details...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Payment Successful!</h1>
          {paymentDetails ? (
            <div className="space-y-2 text-center">
              <p className="text-gray-600">
                Thank you for upgrading to {paymentDetails.plan}!
              </p>
              <p className="text-gray-600">
                You have been charged ${paymentDetails.amount / 100}/{paymentDetails.interval}
              </p>
              <p className="text-gray-600">
                {paymentDetails.credits} credits have been added to your account
              </p>
            </div>
          ) : (
            <p className="text-gray-600">
              Your payment has been processed successfully.
            </p>
          )}
          <a
            href="/dashboard"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Go to Dashboard
          </a>
        </div>
      </div>
    </div>
  );
}

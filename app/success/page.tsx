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

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getPaymentDetails = async () => {
      if (sessionId) {
        try {
          const response = await fetch(`/api/payment/details?session_id=${sessionId}`);
          const data = await response.json();
          setPaymentDetails(data);
        } catch (error) {
          console.error('Error fetching payment details:', error);
        }
      }
      setLoading(false);
    };

    getPaymentDetails();
  }, [sessionId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!paymentDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-500">Payment Details Not Found</h1>
          <p className="mt-2">Unable to retrieve payment information.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center">
          <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
          <h1 className="mt-4 text-3xl font-bold text-gray-900">Payment Successful!</h1>
          <p className="mt-2 text-gray-600">Thank you for your purchase</p>
        </div>

        <div className="mt-8 border-t border-gray-200 pt-6">
          <dl className="divide-y divide-gray-200">
            <div className="py-4 flex justify-between">
              <dt className="text-gray-600">Plan</dt>
              <dd className="text-gray-900 font-medium">{paymentDetails.plan}</dd>
            </div>
            <div className="py-4 flex justify-between">
              <dt className="text-gray-600">Amount</dt>
              <dd className="text-gray-900 font-medium">
                ${(paymentDetails.amount / 100).toFixed(2)} {paymentDetails.interval === 'month' ? '/month' : '/year'}
              </dd>
            </div>
            <div className="py-4 flex justify-between">
              <dt className="text-gray-600">Credits</dt>
              <dd className="text-gray-900 font-medium">{paymentDetails.credits}</dd>
            </div>
          </dl>
        </div>

        <div className="mt-8">
          <a
            href="/dashboard"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Go to Dashboard
          </a>
        </div>
      </div>
    </div>
  );
}

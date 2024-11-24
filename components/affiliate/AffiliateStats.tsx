'use client';

import { useEffect, useState } from 'react';

interface AffiliateStats {
  totalReferrals: number;
  activeReferrals: number;
  totalEarnings: number;
  currentTier: number;
  monthlyReferrals: number;
  monthlyEarnings: number;
  nextTierThreshold: number | null;
  referralsToNextTier: number;
  reachedMilestone: boolean;
}

export function AffiliateStats() {
  const [stats, setStats] = useState<AffiliateStats | null>(null);
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/affiliate/stats');
        const data = await response.json();
        setStats(data.stats);
        setReferralCode(data.referralCode);
      } catch (error) {
        console.error('Error fetching affiliate stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <div className="text-center py-4">Loading...</div>;
  }

  if (!stats) {
    return <div className="text-center py-4 text-red-500">Error loading affiliate stats</div>;
  }

  const progressToNextTier = stats.nextTierThreshold
    ? ((stats.totalReferrals / stats.nextTierThreshold) * 100)
    : 100;

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">Affiliate Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Total Referrals Card */}
        <div className="border-2 border-solid rounded-lg shadow p-6">
          <div className="text-sm font-medium text-gray-500 mb-2">Total Referrals</div>
          <div className="text-3xl font-bold mb-2">{stats.totalReferrals}</div>
          <p className="text-sm text-gray-500">
            {stats.activeReferrals} active subscribers
          </p>
        </div>

        {/* Commission Tier Card */}
        <div className="border-2 rounded-lg shadow p-6">
          <div className="text-sm font-medium text-gray-500 mb-2">Commission Tier</div>
          <div className="text-3xl font-bold mb-2">{stats.currentTier}%</div>
          {stats.nextTierThreshold && (
            <div className="mt-2">
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-blue-600 h-2.5 rounded-full"
                  style={{ width: `${progressToNextTier}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                {stats.referralsToNextTier} referrals to {stats.nextTierThreshold} for next tier
              </p>
            </div>
          )}
        </div>

        {/* Total Earnings Card */}
        <div className="border-2  rounded-lg shadow p-6">
          <div className="text-sm font-medium text-gray-500 mb-2">Total Earnings</div>
          <div className="text-3xl font-bold mb-2">
            ${stats.totalEarnings.toFixed(2)}
          </div>
          <p className="text-sm text-gray-500">
            ${stats.monthlyEarnings.toFixed(2)} this month
          </p>
        </div>
      </div>

      {/* Referral Code Section */}
      {referralCode && (
        <div className="mt-6 border-2  rounded-lg shadow p-6">
          <div className="text-sm font-medium text-gray-500 mb-4">Your Referral Code</div>
          <div className="flex items-center gap-4">
            <code className="border-2  px-3 py-2 rounded font-mono text-sm">
              {referralCode}
            </code>
            <button
              className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
              onClick={() => navigator.clipboard.writeText(referralCode)}
            >
              Copy to clipboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

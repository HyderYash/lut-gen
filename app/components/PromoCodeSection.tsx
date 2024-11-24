'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Copy, Share2 } from 'lucide-react';
import { toast } from 'sonner';

interface PromoCodeSectionProps {
    userId: string;
    onClose: () => void;
}

export default function PromoCodeSection({ userId, onClose }: PromoCodeSectionProps) {
    const [activeTab, setActiveTab] = useState<'generate' | 'apply' | 'affiliate'>('generate');
    const [promoCode, setPromoCode] = useState<string | null>(null);
    const [enteredCode, setEnteredCode] = useState<string>('');
    const [message, setMessage] = useState<string>('');

    // New affiliate-related states
    const [referralCode, setReferralCode] = useState<string | null>(null);
    const [referralStats, setReferralStats] = useState({
        totalReferrals: 0,
        commissionTier: 20
    });

    useEffect(() => {
        // When component mounts, try to generate/fetch referral code
        generateReferralCode();
    }, []);

    const generateCode = async () => {
        try {
            const response = await fetch('/api/promo-code', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId }),
            });

            const data = await response.json();
            if (response.ok) {
                setPromoCode(data.promoCode.code);
                setMessage('Promo code generated successfully!');
            } else {
                setMessage(data.message);
            }
        } catch (error) {
            setMessage('Error generating promo code');
        }
    };

    const applyCode = async () => {
        try {
            const response = await fetch('/api/apply-promo', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, promoCode: enteredCode }),
            });

            const data = await response.json();
            if (response.ok) {
                setMessage(`Promo code applied! Your new credits: ${data.updatedCredits}`);
            } else {
                setMessage(data.message);
            }
        } catch (error) {
            setMessage('Error applying promo code');
        }
    };

    const generateReferralCode = async () => {
        try {
            const response = await fetch('/api/affiliate/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId })
            });

            const data = await response.json();
            if (response.ok) {
                setReferralCode(data.referralCode);
                setReferralStats({
                    totalReferrals: data.totalReferrals,
                    commissionTier: data.commissionTier
                });
            }
        } catch (error) {
            toast.error('Failed to generate referral code');
        }
    };

    const copyReferralLink = () => {
        if (!referralCode) return;
        const referralLink = `${window.location.origin}?ref=${referralCode}`;
        navigator.clipboard.writeText(referralLink);
        toast.success('Referral link copied!');
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-dark-800 rounded-lg max-w-2xl mx-4 p-4">
                <div className="flex justify-between items-center">
                    <div className="w-full">
                        <h2 className="text-2xl font-semibold text-center">
                            Promo & Affiliate
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-[#979A9C] hover:text-[#323233] transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>
                <motion.div
                    className="rounded-lg p-6 max-w-lg w-full"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                >
                    <div className="flex justify-center gap-4 mb-6">
                        <button
                            onClick={() => setActiveTab('generate')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${activeTab === 'generate'
                                ? 'bg-primary text-dark-950 shadow-lg'
                                : 'bg-dark-700 text-dark-200 hover:bg-dark-600'
                                }`}
                        >
                            Generate Promo
                        </button>
                        <button
                            onClick={() => setActiveTab('apply')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${activeTab === 'apply'
                                ? 'bg-primary text-dark-950 shadow-lg'
                                : 'bg-dark-700 text-dark-200 hover:bg-dark-600'
                                }`}
                        >
                            Apply Promo
                        </button>
                        <button
                            onClick={() => setActiveTab('affiliate')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${activeTab === 'affiliate'
                                ? 'bg-primary text-dark-950 shadow-lg'
                                : 'bg-dark-700 text-dark-200 hover:bg-dark-600'
                                }`}
                        >
                            Affiliate
                        </button>
                    </div>

                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        {activeTab === 'generate' && (
                            <div className="text-center">
                                <button
                                    onClick={generateCode}
                                    className="px-6 py-3 bg-primary text-dark-950 font-semibold rounded-lg hover:bg-primary-light transition focus:ring focus:ring-primary-light"
                                >
                                    Generate Promo Code
                                </button>
                                {promoCode && (
                                    <motion.p
                                        className="mt-4 text-lg font-bold text-primary-light"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.2 }}
                                    >
                                        Your Promo Code: <span>{promoCode}</span>
                                    </motion.p>
                                )}
                            </div>
                        )}

                        {activeTab === 'apply' && (
                            <div className="text-center">
                                <input
                                    type="text"
                                    value={enteredCode}
                                    onChange={(e) => setEnteredCode(e.target.value.toUpperCase())}
                                    placeholder="Enter Promo Code"
                                    className="px-4 py-2 w-full bg-dark-700 border border-dark-500 text-dark-200 rounded-lg mb-4 focus:ring focus:ring-primary-light"
                                />
                                <button
                                    onClick={applyCode}
                                    className="px-6 py-3 bg-primary text-dark-950 font-semibold rounded-lg hover:bg-primary-light transition focus:ring focus:ring-primary-light"
                                >
                                    Apply Code
                                </button>
                            </div>
                        )}

                        {activeTab === 'affiliate' && (
                            <div className="text-center space-y-4">
                                <div className="bg-dark-700 p-4 rounded-lg">
                                    <h3 className="text-lg font-medium mb-2">Your Referral Code</h3>
                                    <div className="flex items-center justify-center gap-4">
                                        <span className="text-2xl font-bold text-primary">
                                            {referralCode || 'Generating...'}
                                        </span>
                                        {referralCode && (
                                            <button
                                                onClick={copyReferralLink}
                                                className="bg-dark-600 p-2 rounded-full hover:bg-dark-500"
                                                title="Copy Referral Link"
                                            >
                                                <Copy size={20} />
                                            </button>
                                        )}
                                    </div>
                                </div>
                                <div className="bg-dark-700 p-4 rounded-lg">
                                    <h3 className="text-lg font-medium mb-2">Referral Stats</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-gray-400">Total Referrals</p>
                                            <p className="text-xl font-bold text-primary">
                                                {referralStats.totalReferrals}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-gray-400">Commission Tier</p>
                                            <p className="text-xl font-bold text-primary">
                                                {referralStats.commissionTier}%
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {message && (
                            <motion.p
                                className={`mt-4 text-lg font-semibold ${message.includes('success')
                                    ? 'text-primary-light'
                                    : 'text-red-500'
                                    }`}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                            >
                                {message}
                            </motion.p>
                        )}
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
}
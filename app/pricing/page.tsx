"use client";

import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Loader } from "lucide-react";
import { useSession } from "next-auth/react";
import Navbar from "../../components/Navbar";
import Tutorial from "../components/Tutorial";
import Link from "next/link";
import PromoCodeSection from "../components/PromoCodeSection";

// Define the type for a single plan
type Plan = {
    title: string;
    price: string | { monthly: string; yearly: string };
    features: string[];
    button: string;
    href: string;
    paymentLinks?: {
        monthly?: string;
        yearly?: string;
    };
};

// Define the plans data
const plans: Plan[] = [
    {
        title: "Free",
        price: "$0",
        features: [
            "10 LUTs generations per month",
            "Basic color matching",
            "Standard export formats",
            "Community support",
            "Basic tutorials"
        ],
        button: "Get Started",
        href: "/",
    },
    {
        title: "Standard",
        price: {
            monthly: "$14.95/month",
            yearly: "$107.40/year",
        },
        features: [
            "100 LUTs generations per month",
            "Advanced color matching",
            "All export formats",
            "Priority email support",
            "Advanced tutorials",
        ],
        button: "Choose Standard",
        href: process.env.NEXT_PUBLIC_STRIPE_STANDARD_MONTHLY_PLAN_LINK || "",
        paymentLinks: {
            monthly: process.env.NEXT_PUBLIC_STRIPE_STANDARD_MONTHLY_PLAN_LINK,
            yearly: process.env.NEXT_PUBLIC_STRIPE_STANDARD_YEARLY_PLAN_LINK,
        },
    },
    {
        title: "Premium",
        price: {
            monthly: "$28.25/month",
            yearly: "$169.50/year",
        },
        features: [
            "Unlimited LUT generations",
            "Advanced color matching",
            "All export formats",
            "Priority support",
            "Customized LUTs",
        ],
        button: "Choose Premium",
        href: process.env.NEXT_PUBLIC_STRIPE_PREMIUM_MONTHLY_PLAN_LINK || "",
        paymentLinks: {
            monthly: process.env.NEXT_PUBLIC_STRIPE_PREMIUM_MONTHLY_PLAN_LINK,
            yearly: process.env.NEXT_PUBLIC_STRIPE_PREMIUM_YEARLY_PLAN_LINK,
        },
    },
];

const PricingPage: React.FC = () => {
    const [showTutorial, setShowTutorial] = useState<boolean>(false);
    const [showAffilate, setShowAffiliate] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [accountType, setAccountType] = useState<string | null>(null);
    const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');
    const session = useSession();

    useEffect(() => {
        const fetchAccountType = async () => {
            try {
                const response = await fetch("/api/get-user-account-type");
                if (!response.ok) {
                    throw new Error("Failed to fetch account type");
                }
                const data = await response.json();
                // Capitalize the first letter of the plan
                const plan = data.plan ? data.plan.charAt(0).toUpperCase() + data.plan.slice(1) : "Free";
                setAccountType(plan);
            } catch (error) {
                console.error("Error fetching account type:", error);
                setAccountType("Free");
            }
            setLoading(false);
        };

        if (session.status === "authenticated") {
            fetchAccountType();
        } else if (session.status === "unauthenticated") {
            setLoading(false);
            setAccountType(null);
        }
    }, [session.status]);

    return (
        <>
            <Navbar setShowTutorial={setShowTutorial} setShowAffiliate={setShowAffiliate} />
            {loading ? (
                <div className='mt-20 w-full flex justify-center'>
                    <div className='flex flex-col items-center gap-2'>
                        <Loader className='w-10 h-10 animate-spin text-primary' />
                        <h3 className='text-xl font-bold'>Loading...</h3>
                        <p>Please wait...</p>
                    </div>
                </div>
            ) : (
                <>
                    <div className="flex flex-col items-center min-h-screen bg-[#0A0A0A] pb-20">
                        {/* Header Section */}
                        <div className="w-full bg-gradient-to-b from-[#1A1A1A] to-[#0A0A0A] pt-20 pb-32 px-4">
                            <div className="max-w-4xl mx-auto text-center">
                                <h2 className="text-5xl font-bold mb-6 text-white">Choose Your Plan</h2>
                                <p className="text-xl text-gray-400">Select the perfect plan for your creative journey</p>
                            </div>
                        </div>

                        {/* Pricing Cards Section */}
                        <div className="max-w-7xl w-full px-4 -mt-20">
                            {/* Billing Toggle */}
                            <div className="flex justify-center mb-12">
                                <div className="bg-[#1A1A1A] p-1.5 rounded-xl inline-flex">
                                    <button 
                                        onClick={() => setBillingPeriod('monthly')}
                                        className={`px-6 py-3 rounded-lg text-base font-medium transition-all duration-300 min-w-[120px]
                                            ${billingPeriod === 'monthly' 
                                                ? 'bg-[#2A2A2A] text-white shadow-lg' 
                                                : 'text-gray-400 hover:text-white'}`}
                                    >
                                        Monthly
                                    </button>
                                    <button 
                                        onClick={() => setBillingPeriod('yearly')}
                                        className={`px-6 py-3 rounded-lg text-base font-medium transition-all duration-300 min-w-[120px]
                                            ${billingPeriod === 'yearly' 
                                                ? 'bg-[#2A2A2A] text-white shadow-lg' 
                                                : 'text-gray-400 hover:text-white'}`}
                                    >
                                        Yearly
                                    </button>
                                </div>
                            </div>

                            {/* Cards Grid */}
                            <div className="grid md:grid-cols-3 gap-8">
                                {plans.map((plan, index) => (
                                    <motion.div
                                        key={index}
                                        className={`relative rounded-2xl overflow-hidden transition-all duration-500
                                            ${index === 1 
                                                ? 'bg-gradient-to-br from-[#3A3A3A] to-[#2A2A2A] md:scale-105' 
                                                : 'bg-[#1A1A1A]'}
                                            ${accountType === plan.title 
                                                ? 'ring-2 ring-primary' 
                                                : 'hover:ring-2 hover:ring-primary/50'}
                                        `}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.4, delay: index * 0.1 }}
                                    >
                                        {/* Popular Badge */}
                                        {index === 1 && (
                                            <div className="absolute top-0 w-full text-center py-2 bg-primary text-white text-sm font-medium">
                                                Most Popular
                                            </div>
                                        )}

                                        {/* Card Content */}
                                        <div className={`p-8 ${index === 1 ? 'pt-14' : ''}`}>
                                            {/* Plan Name & Price */}
                                            <div className="mb-8">
                                                <h3 className="text-2xl font-bold text-white mb-2">{plan.title}</h3>
                                                <div className="flex items-baseline gap-2">
                                                    <span className="text-4xl font-bold text-white">
                                                        {typeof plan.price === 'string' ? plan.price : plan.price[billingPeriod]}
                                                    </span>
                                                    {billingPeriod === 'yearly' && index > 0 && (
                                                        <span className="text-primary text-sm font-medium">
                                                            Save {index === 1 ? '40%' : '50%'}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Features List */}
                                            <ul className="space-y-4 mb-8">
                                                {plan.features.map((feature, idx) => (
                                                    <li key={idx} className="flex items-start text-gray-300 group">
                                                        <div className="mr-3 mt-1">
                                                            <Check className="w-4 h-4 text-primary" />
                                                        </div>
                                                        <span>{feature}</span>
                                                    </li>
                                                ))}
                                            </ul>

                                            {/* Action Button */}
                                            {accountType !== plan.title ? (
                                                session.status === "authenticated" ? (
                                                    <Link
                                                        href={`${plan.paymentLinks?.[billingPeriod]}${session.data?.user?.email ? `?prefilled_email=${encodeURIComponent(session.data.user.email)}` : ''}`}
                                                        className={`block w-full py-3 rounded-lg text-center font-medium transition-all duration-300
                                                            ${index === 1 
                                                                ? 'bg-primary text-white hover:bg-primary-dark' 
                                                                : 'bg-[#2A2A2A] text-white hover:bg-[#3A3A3A]'}`}
                                                    >
                                                        {plan.button}
                                                    </Link>
                                                ) : (
                                                    <Link
                                                        href="/api/auth/signin"
                                                        className={`block w-full py-3 rounded-lg text-center font-medium transition-all duration-300
                                                            ${index === 1 
                                                                ? 'bg-primary text-white hover:bg-primary-dark' 
                                                                : 'bg-[#2A2A2A] text-white hover:bg-[#3A3A3A]'}`}
                                                    >
                                                        Sign in to Subscribe
                                                    </Link>
                                                )
                                            ) : (
                                                <div className="w-full py-3 rounded-lg text-center font-medium bg-[#2A2A2A] text-gray-500 cursor-not-allowed">
                                                    Current Plan
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <AnimatePresence>
                        {showTutorial && <Tutorial onClose={() => setShowTutorial(false)} />}
                    </AnimatePresence>
                    <AnimatePresence>
                        {showAffilate && <PromoCodeSection onClose={() => setShowAffiliate(false)} />}
                    </AnimatePresence>
                </>
            )}
        </>
    );
};

export default PricingPage;

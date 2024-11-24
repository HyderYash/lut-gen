"use client";

import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Loader } from "lucide-react";
import { useSession } from "next-auth/react";
import Navbar from "../components/Navbar";
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
            "15 LUTs generations per month",
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
            "Save 40% with annual plan"
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
            "Save 50% with annual plan"
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
            {
                loading ? <div className='mt-20 w-full flex justify-center'>
                    <div className='flex flex-col items-center gap-2'>
                        <Loader className='w-10 h-10 animate-spin text-primary' />
                        <h3 className='text-xl font-bold'>Loading...</h3>
                        <p>Please wait...</p>
                    </div>
                </div> :
                    <>
                        <div className="flex flex-col items-center min-h-screen p-4">
                            <h2 className="text-4xl font-bold mb-4">Choose Your Plan</h2>
                            <p className="text-lg text-gray-600 mb-3">Select the perfect plan for your needs</p>
                            
                            <div className="flex items-center gap-4 mb-6">
                                <button 
                                    onClick={() => setBillingPeriod('monthly')}
                                    className={`px-4 py-2 rounded-lg ${billingPeriod === 'monthly' ? 'bg-primary text-white' : 'border-2'}`}
                                >
                                    Monthly
                                </button>
                                <button 
                                    onClick={() => setBillingPeriod('yearly')}
                                    className={`px-4 py-2 rounded-lg ${billingPeriod === 'yearly' ? 'bg-primary text-white' : 'border-2'}`}
                                >
                                    Yearly
                                </button>
                            </div>

                            <div className="flex flex-col md:flex-row gap-6 w-full max-w-6xl">
                                {plans.map((plan, index) => (
                                    <motion.div
                                        key={index}
                                        className={`flex flex-col items-center p-6 rounded-lg border-2 w-full md:w-1/3 hover:border-primary transition-all duration-300 ${
                                            accountType === plan.title 
                                                ? 'border-primary bg-primary/5' 
                                                : index === 1 
                                                    ? 'border-primary' 
                                                    : 'border-gray-200'
                                        }`}
                                        initial={{ opacity: 0, y: 50 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5, delay: index * 0.1 }}
                                    >
                                        {index === 1 && accountType !== plans[1].title && (
                                            <span className="px-3 py-1 bg-primary text-white text-sm rounded-full mb-4">
                                                Most Popular
                                            </span>
                                        )}
                                        <div className="flex items-center gap-2 mb-4">
                                            <h3 className="text-2xl font-bold">{plan.title}</h3>
                                            {accountType === plan.title && (
                                                <span className="px-3 py-1 bg-primary text-white text-sm rounded-full">
                                                    Current Plan
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-3xl font-bold text-primary mb-2">
                                            {typeof plan.price === 'string' ? plan.price : plan.price[billingPeriod]}
                                        </p>
                                        <ul className="mb-6 space-y-3">
                                            {plan.features.map((feature, idx) => (
                                                <li key={idx} className="flex items-center text-gray-700">
                                                    <Check className="w-5 h-5 text-primary mr-2" />
                                                    {feature}
                                                </li>
                                            ))}
                                        </ul>
                                        {
                                            accountType !== plan.title ? (
                                                session.status === "authenticated" ? (
                                                    <Link
                                                        href={`${plan.paymentLinks?.[billingPeriod]}${session.data?.user?.email ? `?prefilled_email=${encodeURIComponent(session.data.user.email)}` : ''}`}
                                                        className={`px-6 py-3 rounded-lg font-semibold transition-colors w-full text-center ${index === 1 ? 'bg-primary text-white hover:bg-primary-dark' : 'border-2 border-primary text-primary hover:bg-primary hover:text-white'}`}
                                                    >
                                                        {plan.button}
                                                    </Link>
                                                ) : (
                                                    <Link
                                                        href="/api/auth/signin"
                                                        className={`px-6 py-3 rounded-lg font-semibold transition-colors w-full text-center ${index === 1 ? 'bg-primary text-white hover:bg-primary-dark' : 'border-2 border-primary text-primary hover:bg-primary hover:text-white'}`}
                                                    >
                                                        Sign in to Subscribe
                                                    </Link>
                                                )
                                            ) : (
                                                <div className="px-6 py-3 rounded-lg font-semibold w-full text-center bg-gray-100 text-gray-500 cursor-not-allowed">
                                                    Current Plan
                                                </div>
                                            )
                                        }
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                        <AnimatePresence>
                            {showTutorial && <Tutorial onClose={() => setShowTutorial(false)} />}
                        </AnimatePresence>
                        <AnimatePresence>
                            {showAffilate && <PromoCodeSection userId={session.data?.user?.id || ""} onClose={() => setShowAffiliate(false)} />}
                        </AnimatePresence>
                    </>
            }
        </>
    );
};

export default PricingPage;

'use client';

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Check, Loader } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";

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

const PricingCards = () => {
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
        <section className="w-full py-20">
            <div className="max-w-7xl mx-auto px-4">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <h2 className="text-3xl font-bold mb-4">
                        <span className="bg-gradient-to-r from-white via-white to-gray-400 text-transparent bg-clip-text">
                            Choose Your Plan
                        </span>
                    </h2>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        Select the perfect plan for your creative journey
                    </p>
                </motion.div>

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

                {loading ? (
                    <div className='mt-20 w-full flex justify-center'>
                        <div className='flex flex-col items-center gap-2'>
                            <Loader className='w-10 h-10 animate-spin text-primary' />
                            <h3 className='text-xl font-bold'>Loading...</h3>
                            <p>Please wait...</p>
                        </div>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-3 gap-8">
                        {plans.map((plan, index) => (
                            <motion.div
                                key={index}
                                className={`relative rounded-3xl overflow-hidden transition-all duration-500 backdrop-blur-sm
                                    ${index === 1 
                                        ? 'bg-gradient-to-br from-emerald-600/10 via-emerald-500/5 to-emerald-900/10 border border-emerald-500/20 md:scale-105' 
                                        : 'bg-gradient-to-br from-gray-800/30 via-gray-700/20 to-gray-900/30 border border-gray-700/30'}
                                    ${accountType === plan.title 
                                        ? 'ring-2 ring-emerald-500/80' 
                                        : 'hover:ring-2 hover:ring-emerald-500/50'}
                                    shadow-xl hover:shadow-2xl hover:shadow-emerald-500/10
                                    group
                                `}
                                initial={{ opacity: 0, y: 50 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ 
                                    duration: 0.6,
                                    delay: index * 0.2,
                                    ease: [0.23, 1, 0.32, 1]
                                }}
                                whileHover={{ 
                                    y: -8,
                                    transition: { duration: 0.3 }
                                }}
                            >
                                {/* Animated Background Gradient */}
                                <motion.div 
                                    className="absolute inset-0 bg-gradient-to-br from-emerald-500/0 via-emerald-500/0 to-emerald-500/0 opacity-0 group-hover:opacity-10 transition-opacity duration-500"
                                    animate={{
                                        background: [
                                            "radial-gradient(circle at 0% 0%, rgba(16,185,129,0.1) 0%, transparent 50%)",
                                            "radial-gradient(circle at 100% 100%, rgba(16,185,129,0.1) 0%, transparent 50%)",
                                            "radial-gradient(circle at 0% 0%, rgba(16,185,129,0.1) 0%, transparent 50%)",
                                        ],
                                    }}
                                    transition={{
                                        duration: 5,
                                        repeat: Infinity,
                                        ease: "linear"
                                    }}
                                />

                                {/* Popular Badge */}
                                {index === 1 && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.5 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 0.6, duration: 0.3 }}
                                        className="absolute top-4 right-4"
                                    >
                                        <div className="px-3 py-1 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-sm font-medium rounded-full shadow-lg shadow-emerald-500/20">
                                            Most Popular
                                        </div>
                                    </motion.div>
                                )}

                                {/* Card Content */}
                                <div className={`p-8 ${index === 1 ? 'pt-14' : 'pt-8'} relative z-10 h-full flex flex-col`}>
                                    {/* Plan Name & Price */}
                                    <motion.div 
                                        className="mb-8"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.2 + 0.3 }}
                                    >
                                        <h3 className="text-2xl font-bold bg-gradient-to-r from-white via-white to-gray-300 bg-clip-text text-transparent mb-2">
                                            {plan.title}
                                        </h3>
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-4xl font-bold bg-gradient-to-r from-emerald-400 via-emerald-500 to-emerald-600 bg-clip-text text-transparent">
                                                {typeof plan.price === 'string' ? plan.price : plan.price[billingPeriod]}
                                            </span>
                                            {billingPeriod === 'yearly' && index > 0 && (
                                                <motion.span 
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    className="text-emerald-500 text-sm font-medium"
                                                >
                                                    Save {index === 1 ? '40%' : '50%'}
                                                </motion.span>
                                            )}
                                        </div>
                                    </motion.div>

                                    {/* Features List */}
                                    <motion.ul 
                                        className="mb-auto space-y-4"
                                        initial="hidden"
                                        animate="visible"
                                        variants={{
                                            visible: {
                                                transition: {
                                                    staggerChildren: 0.1,
                                                    delayChildren: index * 0.2 + 0.5
                                                }
                                            }
                                        }}
                                    >
                                        {plan.features.map((feature, featureIndex) => (
                                            <motion.li
                                                key={featureIndex}
                                                variants={{
                                                    hidden: { opacity: 0, x: -20 },
                                                    visible: { opacity: 1, x: 0 }
                                                }}
                                                className="flex items-center gap-3 group/item"
                                            >
                                                <motion.div
                                                    whileHover={{ scale: 1.2 }}
                                                    className="w-5 h-5 flex items-center justify-center"
                                                >
                                                    <Check className="w-5 h-5 text-emerald-500 flex-shrink-0 group-hover/item:text-emerald-400 transition-colors" />
                                                </motion.div>
                                                <span className="text-gray-300 group-hover/item:text-white transition-colors">
                                                    {feature}
                                                </span>
                                            </motion.li>
                                        ))}
                                    </motion.ul>

                                    {/* Action Button */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.2 + 0.7 }}
                                        className="mt-8"
                                    >
                                        <Link
                                            href={billingPeriod === 'monthly' 
                                                ? plan.paymentLinks?.monthly || plan.href 
                                                : plan.paymentLinks?.yearly || plan.href}
                                            className={`group relative w-full inline-flex justify-center items-center px-6 py-3 rounded-xl text-base font-medium transition-all duration-300 overflow-hidden
                                                ${index === 1
                                                    ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700'
                                                    : 'bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700'}
                                                ${accountType === plan.title ? 'cursor-default opacity-50' : 'hover:shadow-lg hover:shadow-emerald-500/20'}
                                            `}
                                            onClick={(e) => {
                                                if (accountType === plan.title) {
                                                    e.preventDefault();
                                                }
                                            }}
                                        >
                                            <span className="relative z-10">
                                                {accountType === plan.title ? 'Current Plan' : plan.button}
                                            </span>
                                            <motion.div
                                                className="absolute inset-0 -z-10 bg-gradient-to-r from-emerald-600/0 via-emerald-600/70 to-emerald-600/0"
                                                initial={{ x: '-100%' }}
                                                whileHover={{ x: '100%' }}
                                                transition={{ duration: 0.7 }}
                                            />
                                        </Link>
                                    </motion.div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default PricingCards;

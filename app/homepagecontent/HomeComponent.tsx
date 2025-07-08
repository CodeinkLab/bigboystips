/* eslint-disable react/no-unescaped-entities */
'use client'
import Link from 'next/link'
import Image from 'next/image'

import { Prediction } from '../lib/interface';
import { ChangeEvent, useEffect, useState } from 'react';
import moment from 'moment';
import { useAuth } from '../contexts/AuthContext';
import { sportTypeOptions } from '../lib/formschemas/predictionForm';
import { Edit2, PlusCircle, X } from 'lucide-react';
import { updateTitle } from '../actions/utils';
import { FaSpinner } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

const HomePageComponent = ({ content }: { content: any }) => {
    const { user } = useAuth()
    const [predictions, setPredictions] = useState<Prediction[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const predictionsPerPage = 20;
    const pageSize = predictions.length;
    const totalPages = Math.ceil(pageSize / predictionsPerPage);
    const startIndex = (currentPage - 1) * predictionsPerPage;
    const endIndex = startIndex + predictionsPerPage;
    const currentPredictions = predictions.slice(startIndex, endIndex);
    const [games, setGames] = useState('soccer')
    const [openEdit, setOpenEdit] = useState(false)
    const [loading, setLoading] = useState(false)
    const [title, setTitle] = useState("One Odd In a Day")


    const features = [
        {
            title: 'AI-Powered Analysis',
            description: 'Our advanced AI algorithms analyze millions of data points to provide highly accurate predictions.',
            icon: (
                <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
            ),
            gradient: 'from-orange-500 to-purple-500'
        },
        {
            title: 'Real-Time Updates',
            description: 'Get instant notifications and live updates for matches, odds changes, and prediction results.',
            icon: (
                <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            gradient: 'from-green-500 to-teal-500'
        },
        {
            title: 'Secure Payments',
            description: 'Multiple payment options with bank-grade security. Easy subscriptions and instant access.',
            icon: (
                <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
            ),
            gradient: 'from-orange-500 to-orange-500'
        },
        {
            title: 'Premium Insights',
            description: 'Access detailed match analysis, expert opinions, and exclusive VIP predictions.',
            icon: (
                <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
            ),
            gradient: 'from-pink-500 to-rose-500'
        },
        {
            title: 'Multiple Payment Methods',
            description: 'Pay with credit cards, PayPal, crypto, or mobile money. Flexible subscription options.',
            icon: (
                <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
            ),
            gradient: 'from-cyan-500 to-orange-500'
        },
        {
            title: '24/7 Support',
            description: 'Get help anytime with our dedicated customer support team and community forum.',
            icon: (
                <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                </svg>
            ),
            gradient: 'from-violet-500 to-purple-500'
        },
    ]

    const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const changedTitle = e.target.value
        setTitle(changedTitle)
    }

    useEffect(() => {
        const handler = async (e: ErrorEvent) => {
            const res = await fetch("/api/log", {
                method: "POST",
                body: JSON.stringify({
                    message: e.message,
                    stack: e.error?.stack,
                    userAgent: navigator.userAgent,
                }),
            });
            const err = await res.json();
            console.log(err);
        };
        window.addEventListener("error", handler);
        return () => window.removeEventListener("error", handler);
    }, []);


    useEffect(() => {
        if (content?.predictions?.length > 0) {
            setPredictions(content?.predictions || []);
        }
    }, [content]);

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="flex flex-col justify-center items-center relative min-h-[65vh] md:min-h-[80vh] 2xl:min-h-[95vh] 3xl:min-h-[90vh] bg-gradient-to-r from-neutral-600/40 to-neutral-800/40 text-white w-full bg-url(/stadium.webp) bg-cover bg-center"
                style={{
                    backgroundImage: 'linear-gradient(to right, #1a1818c0, #111010cb), url(/stadium.webp)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                }}>

                <div className="flex items-center justify-center w-full my-auto container px-4 py-8 mt-24 h-full overflow-hidden">
                    <div className="w-full flex items-center justify-center flex-col lg:flex-row lg:justify-between gap-2 h-full">
                        <div className="flex flex-col w-full h-full justify-center lg:w-1/2 text-center lg:text-left z-20 gap-4 ">
                            <p className="text-xl sm:text-3xl md:text-5xl font-thin italic text-white ">Welcome, {user?.username || "User"}</p>

                            <h1 className="text-3xl md:text-5xl lg:text-5xl 2xl:text-7xl font-bold sm:leading-16 md:leading-20 lg:leading-16 2xl:leading-24 lg:mt-8 ">
                                Welcome to the Expert BigBoysTips <span className="text-orange-400">Odds </span> Hub!
                            </h1>
                            <p className="text-sm sm:text-lg md:text-base text-white mt-4 sm:mt-8">
                                Join thousands of successful bettors who trust our expert analysis and predictions.
                                Get access to premium tips and increase your winning potential.
                            </p>
                            <div className="flex flex-col lg:flex-row items-center justify-center">
                                <div className="flex flex-col xl:flex-row justify-center items-center lg:justify-start gap-4 pt-4 w-full lg:mt-8">
                                    <Link
                                        href="https://t.me/bigboyzg" target='_blank'
                                        className="flex bg-orange-500 uppercase w-72 font-bold justify-center items-center gap-2 hover:scale-[1.05] transition-all text-white px-4 py-2 rounded-lg text-xs sm:text-base text-center"
                                    >
                                        <svg className="size-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.227-.535.227l.19-2.712 4.94-4.465c.215-.19-.047-.296-.332-.106l-6.103 3.854-2.623-.816c-.57-.18-.582-.57.12-.843l10.238-3.948c.473-.174.887.104.605 1.337z" />
                                        </svg>
                                        Join Telegram Channel
                                    </Link>
                                    <Link
                                        href="/pricing"
                                        className="flex justify-center relative bg-orange-500 w-72 uppercase border border-orange-500 gap-2 items-center hover:scale-[1.05] transition-all text-white px-4 py-2 rounded-lg font-bold text-xs sm:text-base text-center"
                                    >
                                        <svg className="size-6" fill="currentColor" viewBox="0 0 24 24">
                                            <path
                                                d="M2 8l4 10h12l4-10-6 5-4-7-4 7-6-5z"
                                                fill="white"
                                                stroke="white"
                                                strokeWidth="1"
                                            />
                                            <circle cx="4" cy="8" r="1.5" fill="white" />
                                            <circle cx="12" cy="4" r="1.5" fill="white" />
                                            <circle cx="20" cy="8" r="1.5" fill="white" />
                                        </svg>
                                        Get Vip Games
                                        <div className="absolute top-2 right-2">
                                            <div className="relative w-2 h-2">
                                                <div className="absolute inset-0 rounded-full bg-orange-100 opacity-0 group-hover:scale-[6] group-hover:opacity-10 transition-all duration-500" />
                                                <div className="absolute inset-0 rounded-full bg-orange-100 animate-ping group-hover:opacity-0 transition-opacity" />
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            </div>
                            {/* <div className="flex items-center justify-center lg:justify-start gap-6 sm:gap-8 pt-8 bg-background-blur bg-white/10 backdrop-blur-sm rounded-lg p-4 sm:p-6 w-full lg:w-max">
                <StatCard value="95%" label="Accuracy Rate" />
                <StatCard value="10k+" label="Active Users" />
                <StatCard value="50k+" label="Predictions Made" />
              </div> */}
                        </div>
                        <div className="hidden lg:block w-full lg:w-1/2 px-4 sm:px-8 lg:px-0 blur-md lg:blur-none">
                            <div className="relative max-w-[500px] mx-auto lg:max-w-none">
                                <div className="absolute -top-4 -left-4 w-24 h-24 bg-orange-400/20 rounded-full blur-xl animate-pulse" />
                                <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-orange-400/20 rounded-full blur-xl animate-pulse" style={{ animationDelay: '1s' }} />
                                <Image
                                    src="/hero-img.png"
                                    alt="Sports prediction illustration"
                                    width={600}
                                    height={400}
                                    className="rounded-lg w-full h-full relative z-10 hover:scale-[1.02] transition-all duration-500 "
                                    priority
                                />
                                {/* <div className="hidden lg:block absolute bottom-24 sm:bottom-28 lg:bottom-0 -right-2 sm:-right-0 bg-gradient-to-br from-orange-400 to-orange-500 p-3 sm:p-4 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300 cursor-pointer group">
                                    <p className="text-gray-900 font-bold text-sm sm:text-base">Today&apos;s Win Rate</p>
                                    <p className="text-2xl sm:text-3xl font-bold text-gray-900 group-hover:scale-105 transition-transform">92%</p>
                                </div> */}
                                {/* Live Stats Floating Card */}
                                {/*  <div className="hidden lg:block absolute bottom-24 lg:bottom-0 -left-2 sm:-left-8 bg-white/10 backdrop-blur-md p-4 rounded-lg shadow-lg border border-white/20 transform hover:scale-105 transition-all duration-300">
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                        <p className="text-gray-100 text-sm font-medium">Live Stats</p>
                                    </div>
                                    <div className="mt-2 space-y-1">
                                        <p className="text-xs text-gray-200">Active Users: <span className="text-green-400">1.2k</span></p>
                                        <p className="text-xs text-gray-200">Pending Tips: <span className="text-orange-400">23</span></p>
                                    </div>
                                </div> */}
                            </div>
                        </div>
                        <div className="lg:hidden w-full lg:w-1/2 absolute top-10 px-4  lg:px-0 blur-md lg:blur-none">
                            <div className="relative max-w-[500px] mx-auto lg:max-w-none">
                                <div className="absolute -top-4 -left-4 w-24 h-24 bg-orange-400/20 rounded-full blur-xl animate-pulse" />
                                <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-orange-400/20 rounded-full blur-xl animate-pulse" style={{ animationDelay: '1s' }} />
                                <Image
                                    src="/hero-img.png"
                                    alt="Sports prediction illustration"
                                    width={600}
                                    height={400}
                                    className="rounded-lg w-full h-auto relative z-10 hover:scale-[1.02] transition-all duration-500 "
                                    priority
                                />
                                {/* <div className="hidden lg:block absolute bottom-24 sm:bottom-28 lg:bottom-0 -right-2 sm:-right-0 bg-gradient-to-br from-orange-400 to-orange-500 p-3 sm:p-4 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300 cursor-pointer group">
                                    <p className="text-gray-900 font-bold text-sm sm:text-base">Today&apos;s Win Rate</p>
                                    <p className="text-2xl sm:text-3xl font-bold text-gray-900 group-hover:scale-105 transition-transform">92%</p>
                                </div> */}
                                {/* Live Stats Floating Card */}
                                {/*  <div className="hidden lg:block absolute bottom-24 lg:bottom-0 -left-2 sm:-left-8 bg-white/10 backdrop-blur-md p-4 rounded-lg shadow-lg border border-white/20 transform hover:scale-105 transition-all duration-300">
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                        <p className="text-gray-100 text-sm font-medium">Live Stats</p>
                                    </div>
                                    <div className="mt-2 space-y-1">
                                        <p className="text-xs text-gray-200">Active Users: <span className="text-green-400">1.2k</span></p>
                                        <p className="text-xs text-gray-200">Pending Tips: <span className="text-orange-400">23</span></p>
                                    </div>
                                </div> */}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

          

            {/* Features Section */}
            < section className="py-20 relative overflow-hidden" >
                {/* Background Elements */}
                < div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-white z-0" >
                    <div className="absolute inset-0 bg-[linear-gradient(30deg,#00000000_0%,#0000000a_50%,#00000000_100%)] bg-[length:5px_5px]" />
                </div >

                {/* Animated Background Shapes */}
                < div className="absolute -top-24 -right-24 w-96 h-96 bg-orange-200 rounded-full blur-3xl opacity-20 animate-pulse" />
                <div className="absolute top-1/2 right-0 w-72 h-72 bg-orange-200 rounded-full blur-2xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }} />
                <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-orange-200 rounded-full blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }} />
                <div className="absolute top-32 left-0 w-72 h-72 bg-red-200 rounded-full blur-2xl opacity-20 animate-pulse" style={{ animationDelay: '3s' }} />

                {/* Decorative Elements */}
                <div className="absolute top-10 left-10 w-20 h-20 border-2 border-orange-200 rounded-lg rotate-45 animate-spin-slow" />
                <div className="absolute bottom-10 right-10 w-20 h-20 border-2 border-orange-200 rounded-lg rotate-45 animate-spin-slow" style={{ animationDirection: 'reverse' }} />

                <div className="container mx-auto px-4 relative z-10">
                    <div className="text-center mb-16 relative">
                        <div className="inline-block">
                            <div className="relative">
                                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2 sm:mb-4 relative z-10">
                                    Why Choose <span className="text-orange-600">BigBoysTips</span>?
                                </h2>
                                <div className="absolute -top-6 -right-6 w-20 h-20 bg-orange-200 rounded-full blur-xl opacity-30 animate-pulse" />
                                <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-orange-200 rounded-full blur-xl opacity-30 animate-pulse" style={{ animationDelay: '1s' }} />
                            </div>
                        </div>
                        <p className="mt-4 text-sm sm:text-xl text-gray-600 max-w-3xl mx-auto">
                            Experience the perfect blend of expert analysis, cutting-edge technology, and premium features
                        </p>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-1 bg-gradient-to-r from-transparent via-orange-200 to-transparent opacity-50" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/0 via-orange-500/5 to-orange-500/0 transform -skew-y-12" />
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className="group relative bg-white/70 backdrop-blur-sm p-4 sm:p-8 rounded-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-200 shadow overflow-hidden"
                            >
                                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 rounded-xl transition-all duration-500`} />
                                <div className="absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-orange-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                {/* Animated Corner Effects */}
                                <div className="absolute top-0 left-0 w-16 h-16 -translate-x-full -translate-y-full group-hover:translate-x-0 group-hover:translate-y-0 transition-transform duration-700">
                                    <div className="absolute top-0 left-0 w-[2px] h-8 bg-gradient-to-b from-transparent via-orange-500 to-transparent" />
                                    <div className="absolute top-0 left-0 h-[2px] w-8 bg-gradient-to-r from-transparent via-orange-500 to-transparent" />
                                </div>

                                <div className="absolute bottom-0 right-0 w-16 h-16 translate-x-full translate-y-full group-hover:translate-x-0 group-hover:translate-y-0 transition-transform duration-700">
                                    <div className="absolute bottom-0 right-0 w-[2px] h-8 bg-gradient-to-t from-transparent via-orange-500 to-transparent" />
                                    <div className="absolute bottom-0 right-0 h-[2px] w-8 bg-gradient-to-l from-transparent via-orange-500 to-transparent" />
                                </div>

                                <div className="relative">
                                    <div className="bg-gradient-to-br from-orange-50 to-orange-100/50 w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-sm group-hover:shadow-md">
                                        <div className="transform group-hover:scale-110 transition-transform duration-500">
                                            {feature.icon}
                                        </div>
                                    </div>
                                    <h3 className="text-base sm:text-xl font-semibold text-gray-900 mb-3 group-hover:text-orange-600 transition-colors duration-300">
                                        {feature.title}
                                    </h3>
                                    <p className="text-xs sm:text-base text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
                                        {feature.description}
                                    </p>
                                </div>

                                {/* Animated Dots */}
                                <div className="absolute top-4 right-4">
                                    <div className="relative w-2 h-2">
                                        <div className="absolute inset-0 rounded-full bg-orange-400 opacity-0 group-hover:scale-[6] group-hover:opacity-10 transition-all duration-500" />
                                        <div className="absolute inset-0 rounded-full bg-orange-400 animate-ping group-hover:opacity-0 transition-opacity" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section >


            {/* CTA Section */}
            < section className="relative py-20 overflow-hidden" >
                {/* Gradient Background */}
                < div className="absolute inset-0 bg-gradient-to-br from-neutral-600 via-neutral-700 to-neutral-900" >
                    {/* Animated Pattern Overlay */}
                    < div className="absolute inset-0 bg-[linear-gradient(45deg,#ffffff0a_1px,#0000_1px),linear-gradient(-45deg,#ffffff0a_1px,#0000_1px)] bg-[size:40px_40px] animate-[grain_8s_steps(10)_infinite]" />

                    {/* Animated Shapes */}
                    < div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-neutral-400/20 to-transparent rounded-full blur-3xl animate-shape-1" />
                    <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-orange-400/20 to-transparent rounded-full blur-3xl animate-shape-2" />
                </div >

                <div className="container mx-auto px-4 text-center relative z-10">
                    {/* Glowing Effect */}
                    <div className="relative inline-block mb-6">
                        <div className="absolute -inset-1  group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse-slow"></div>
                        <h2 className="relative text-3xl md:text-4xl font-bold text-white mb-2">
                            Ready to Start Winning?
                        </h2>
                    </div>

                    <p className="text-base sm:text-xl text-orange-100 mb-12 max-w-2xl mx-auto">
                        Join thousands of successful bettors who are already profiting from our expert predictions.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                        <Link
                            href="/signup"
                            className="group relative inline-flex items-center justify-center px-8 py-3 overflow-hidden font-medium tracking-wider text-gray-900 rounded-lg bg-gradient-to-br from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 transition-all duration-300"
                        >
                            <span className="absolute w-0 h-0 transition-all duration-500 ease-out bg-orange-600/20 rounded-full group-hover:w-64 group-hover:h-64"></span>
                            <span className="relative font-semibold">Get Started Now</span>
                        </Link>

                        <Link
                            href="/pricing"
                            className="group relative inline-flex items-center justify-center px-8 py-3 overflow-hidden font-medium text-white rounded-lg hover:bg-white/10 transition-all duration-300 border border-white/30"
                        >
                            <span className="absolute w-0 h-0 transition-all duration-500 ease-out bg-white/10 rounded-full group-hover:w-64 group-hover:h-64"></span>
                            <span className="relative font-semibold">Subscribe Now!</span>
                        </Link>
                    </div>

                    {/* Trust Indicators */}
                    <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-center">
                        {[
                            { label: "Subscribers", value: "10000", start: "500", suffix: "+" },
                            { label: "Success Rate", value: "98", start: "10", suffix: "%" },
                            { label: "Expert Tips", value: "50000", start: "500", suffix: "+" },
                            { label: "Avg. ROI", value: "127", start: "10", suffix: "%" }
                        ].map((stat, index) => (
                            <div key={index} className="text-center bg-orange-200/10 backdrop-blur-sm p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow border border-orange-500/50">
                                <p suppressHydrationWarning className="text-xl md:text-3xl font-bold text-white mb-2">
                                    <span suppressHydrationWarning className="inline-block" data-start={stat.start} data-end={stat.value}>
                                        {stat.value}
                                    </span>
                                    {stat.suffix}
                                </p>
                                <p className="text-orange-100 text-sm">{stat.label}</p>
                            </div>
                        ))}
                    </div>

                    {/* Add this script tag to the end of your component */}
                    <script dangerouslySetInnerHTML={{
                        __html: `
                                function animateValue(element, start, end, duration) {
                                let current = start;
                                const range = end - start;
                                const increment = range / (duration / 16);
                                const timer = setInterval(() => {
                                    current += increment;
                                    if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
                                    current = end;
                                    clearInterval(timer);
                                    }
                                    element.textContent = Math.round(current);
                                }, 16);
                                }

                                const observer = new IntersectionObserver((entries) => {
                                entries.forEach(entry => {
                                    if (entry.isIntersecting) {
                                    const element = entry.target;
                                    const start = parseInt(element.dataset.start);
                                    const end = parseInt(element.dataset.end);
                                    animateValue(element, start, end, 2000);
                                    observer.unobserve(element);
                                    }
                                });
                                }, { threshold: 0.5 });

                                document.querySelectorAll('[data-start]').forEach(element => {
                                observer.observe(element);
                                });
                            `
                    }} />
                </div>
            </section >

            {/* Testimonials Section */}
            < section className="py-12 bg-gradient-to-b from-neutral-50 via-white to-neutral-50 relative overflow-hidden" >
                {/* Animated Background Elements */}
                < div className="absolute inset-0" >
                    <div className="absolute inset-0 bg-[radial-gradient(circle_500px_at_50%_200px,#e5e7eb,transparent)]" />
                    <div className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-orange-50/30 to-transparent" />
                    <div className="absolute inset-y-0 right-0 w-1/2 bg-gradient-to-l from-orange-50/20 to-transparent" />
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-orange-100/20 to-transparent rounded-full blur-3xl animate-blob" />
                    <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-br from-orange-100/20 to-transparent rounded-full blur-3xl animate-blob animation-delay-2000" />
                </div >

                <div className="container mx-auto px-4 relative z-10">
                    <div className="text-center mb-20">
                        <div className="inline-block">
                            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent mb-6">
                                Voices of Success
                            </h2>
                            <div className="h-1 w-32 bg-gradient-to-r from-orange-500 to-orange-500 rounded-full mx-auto" />
                        </div>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto mt-6">
                            Join our community of successful bettors and experience the difference
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 ">
                        {[
                            {
                                name: "John Smith",
                                role: "Professional Bettor",
                                location: "United Kingdom",
                                avatar: "/avatars/default_img.webp",
                                quote: "BigBoysTips has completely transformed my betting strategy. The accuracy of predictions is simply remarkable!",
                                rating: 5,
                                winRate: "92%",
                                gradientFrom: "from-orange-500",
                                gradientTo: "to-orange-600"
                            },
                            {
                                name: "Maria Rodriguez",
                                role: "Sports Analyst",
                                location: "Spain",
                                avatar: "/avatars/default_img.webp",
                                quote: "The premium insights have been invaluable. My success rate has improved significantly since joining.",
                                rating: 5,
                                winRate: "88%",
                                gradientFrom: "from-orange-500",
                                gradientTo: "to-orange-600"
                            },
                            {
                                name: "David Chen",
                                role: "VIP Member",
                                location: "Singapore",
                                avatar: "/avatars/default_img.webp",
                                quote: "Best prediction service I've used. The combination of AI analysis and expert insights is unmatched.",
                                rating: 5,
                                winRate: "90%",
                                gradientFrom: "from-purple-500",
                                gradientTo: "to-purple-600"
                            }
                        ].map((testimonial, index) => (
                            <div
                                key={index}
                                className="group relative bg-neutral-200 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-1"
                            >
                                {/* Gradient Border Effect */}
                                {/* <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-orange-500 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur" /> */}

                                {/* Success Badge */}
                                <div className={`absolute -top-4 right-8 bg-gradient-to-r ${testimonial.gradientFrom} ${testimonial.gradientTo} text-white text-sm font-medium px-4 py-2 rounded-full shadow-lg transform group-hover:scale-110 transition-transform duration-500`}>
                                    {testimonial.winRate} Success Rate
                                </div>

                                {/* Quote */}
                                <div className="mb-8 relative">
                                    <svg className="absolute -top-4 -left-2 w-8 h-8 text-gray-200 transform -rotate-12" fill="currentColor" viewBox="0 0 32 32">
                                        <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                                    </svg>
                                    <p className="text-gray-700 text-lg relative z-10 pl-6">{testimonial.quote}</p>
                                </div>

                                {/* User Info */}
                                <div className="flex items-center gap-4">
                                    <div className="relative">
                                        <div className="w-14 h-14 bg-gray-200 rounded-full overflow-hidden ring-2 ring-offset-2 ring-gray-100">
                                            <Image
                                                src={testimonial.avatar}
                                                alt={testimonial.name}
                                                width={56}
                                                height={56}
                                                className="object-cover transform group-hover:scale-110 transition-transform duration-500"
                                            />
                                        </div>
                                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full border-2 border-white flex items-center justify-center">
                                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                                            </svg>
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                                        <p className="text-sm text-orange-600 font-medium">{testimonial.role}</p>
                                        <p className="text-sm text-gray-500">{testimonial.location}</p>
                                    </div>
                                </div>

                                {/* Rating */}
                                <div className="absolute bottom-6 right-8">
                                    <div className="flex gap-1">
                                        {Array.from({ length: testimonial.rating }).map((_, i) => (
                                            <svg key={i} className="w-5 h-5 text-orange-400" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section >

            {/* Contact Section */}
            < section className="py-8 bg-neutral-500 w-full mx-auto" >
                <div className="flex flex-col container items-center justify-center mx-auto px-4 w-full gap-8">

                    <div className="flex items-center gap-4">
                        <a href="tel:+233542810847" target="_blank" rel="noopener noreferrer"
                            className="flex items-center gap-3 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors">
                            <div className="w-10 h-10 bg-neutral-100 rounded-lg flex items-center justify-center hover:bg-neutral-200 transition-colors">
                                <svg className="w-5 h-5 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                            </div>
                            {/* <span className="text-gray-700 font-medium">Join our Telegram Channel</span> */}
                        </a>
                        <a href="mailto:senanick1333@gmail.com" target="_blank" rel="noopener noreferrer"
                            className="flex items-center gap-3  bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors">
                            <div className="w-10 h-10 bg-neutral-100 rounded-lg flex items-center justify-center hover:bg-neutral-200 transition-colors">
                                <svg className="w-5 h-5 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </div>
                            {/* <span className="text-gray-700 font-medium">Join our Telegram Channel</span> */}
                        </a>
                        <a href="https://t.me/bigboyzg" target="_blank" rel="noopener noreferrer"
                            className="flex items-center gap-3 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors">
                            <div className="w-10 h-10 bg-neutral-100 rounded-lg flex items-center justify-center hover:bg-neutral-200 transition-colors">
                                <svg className="w-5 h-5 text-neutral-600" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.227-.535.227l.19-2.712 4.94-4.465c.215-.19-.047-.296-.332-.106l-6.103 3.854-2.623-.816c-.57-.18-.582-.57.12-.843l10.238-3.948c.473-.174.887.104.605 1.337z" />
                                </svg>
                            </div>
                            {/* <span className="text-gray-700 font-medium">Join our Telegram Channel</span> */}
                        </a>
                        <a href="https://x.com/@SenaNick1" target="_blank" rel="noopener noreferrer"
                            className="flex items-center gap-3  bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors">
                            <div className="w-10 h-10 bg-neutral-100 rounded-lg flex items-center justify-center hover:bg-neutral-200 transition-colors">
                                <svg className="w-5 h-5 text-neutral-600" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                                </svg>
                            </div>
                            {/* <span className="text-gray-700 font-medium">Join our Telegram Channel</span> */}
                        </a>

                    </div>
                    {/*  <div>
            <p className="text-gray-600 text-xs">Email</p>
          </div> */}


                </div>


            </section >

            {/* Payment Gateway Section */}
            < section className="py-10 bg-neutral-200" >
                <div className="container mx-auto px-4">
                    <div className="text-center my-8">

                        <div className="relative max-w-3xl mx-auto">
                            {/* Decorative Elements */}
                            {/* <div className="absolute -top-4 -left-4 w-24 h-24 bg-orange-400/20 rounded-full blur-xl animate-pulse" /> */}
                            {/* <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-orange-400/20 rounded-full blur-xl animate-pulse" style={{ animationDelay: '1s' }} /> */}

                            {/* Image Container */}
                            <div className="relative rounded-2xl overflow-hidden shadow-2xl transform hover:scale-[1.02] transition-all duration-500">
                                <Image
                                    src="/paymentmethods.png"
                                    alt="Payment Methods"
                                    width={800}
                                    height={400}
                                    className="w-full h-auto"
                                    priority
                                />

                                {/* Overlay Gradient */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                            </div>

                            {/* Security Badge */}
                            {/* <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-neutral-500 px-6 py-3 rounded-full shadow-lg flex items-center gap-2">
                                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                                <span className="text-sm font-medium text-white">100% Secure Payments</span>
                            </div> */}
                        </div>
                    </div>
                </div>
            </section >

        </div >
    )
}

export default HomePageComponent


/*   */
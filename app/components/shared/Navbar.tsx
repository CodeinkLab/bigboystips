'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { signOut, useSession } from 'next-auth/react';
import { Menu, X, ChevronDown, User } from 'lucide-react';

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { data: session } = useSession();

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 60) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const menuItems = [
        { label: 'Home', href: '/' },
        { label: 'About', href: '/about' },
        { label: 'Contact', href: '/contact' },
        { label: 'Subscribe', href: '/pricing' },
        { label: 'Blog', href: '/blog' },
    ];

    return (
        <nav
            className={`w-full fixed top-0 left-0 z-50 transition-all duration-300 shadow-xl ${isScrolled ? 'bg-white/10 backdrop-blur-lg shadow-md' : 'bg-transparent '}`}>
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-20">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-2">
                        <Image
                            src="/logo.svg"
                            alt="BigBoysTips Logo"
                            width={40}
                            height={40}
                            className="w-10 h-10"
                        />
                        <span className={`text-xl font-semibold ${isScrolled ? 'text-blue-600' : 'text-white'
                            }`}>
                            BigBoysTips
                        </span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-8">
                        {menuItems.map((item) => {
                            const isActive = typeof window !== 'undefined' && window.location.pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`font-bold tracking-widest transition-colors ${isScrolled
                                        ? isActive
                                            ? 'text-blue-600'
                                            : 'text-gray-700 hover:text-blue-600'
                                        : isActive
                                            ? 'text-white'
                                            : 'text-blue/90 hover:text-blue-600'
                                        }`}
                                >
                                    {item.label}
                                </Link>
                            );
                        })}
                    </div>

                    {/* Auth Buttons / User Menu */}
                    <div className="hidden md:flex items-center space-x-4">
                        {session ? (
                            <div className="relative group">
                                <button className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${isScrolled
                                    ? 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                                    : 'bg-white/10 text-white hover:bg-white/20'
                                    }`}>
                                    <User size={20} />
                                    <span>Account</span>
                                    <ChevronDown size={16} />
                                </button>
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 invisible group-hover:visible transition-all opacity-0 group-hover:opacity-100">
                                    <Link
                                        href="/dashboard"
                                        className="block px-4 py-2 text-gray-700 hover:bg-blue-50"
                                    >
                                        Dashboard
                                    </Link>
                                    <Link
                                        href="/settings"
                                        className="block px-4 py-2 text-gray-700 hover:bg-blue-50"
                                    >
                                        Settings
                                    </Link>
                                    <hr className="my-2" />
                                    <button
                                        onClick={() => signOut()}
                                        className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
                                    >
                                        Sign Out
                                    </button>
                                </div>
                            </div>
                        ) : (

                            <Link href="/signin" className={`px-4 py-2 rounded-lg transition-colors ${isScrolled
                                ? 'bg-blue-600 text-white hover:bg-blue-700'
                                : 'bg-white text-blue-600 hover:bg-white/90'
                                }`}>
                                Authenticate
                            </Link>

                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className={`md:hidden transition-colors ${isScrolled ? 'text-gray-700 hover:text-blue-600' : 'text-white hover:text-white/80'
                            }`}
                    >
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <div className={`md:hidden fixed inset-y-0 right-0 transform w-64 bg-white shadow-2xl transition-transform duration-300 ease-in-out h-screen z-50 ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="p-6">
                    <div className="flex flex-col space-y-6">
                        {menuItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                {item.label}
                            </Link>
                        ))}
                        <hr className="my-4" />
                        {session ? (
                            <>
                                <Link
                                    href="/dashboard"
                                    className="text-gray-700 hover:text-blue-600 font-medium"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    Dashboard
                                </Link>
                                <Link
                                    href="/settings"
                                    className="text-gray-700 hover:text-blue-600 font-medium"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    Settings
                                </Link>
                                <button
                                    onClick={() => {
                                        signOut();
                                        setIsMobileMenuOpen(false);
                                    }}
                                    className="text-red-600 hover:text-red-700 font-medium text-left"
                                >
                                    Sign Out
                                </button>
                            </>
                        ) : (
                            <div className="flex flex-col space-y-4">
                                <Link
                                    href="/signin"
                                    className="text-gray-700 hover:text-blue-600 font-medium"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    Sign In
                                </Link>
                                <Link
                                    href="/signup"
                                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-center"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Overlay for mobile menu */}
            {isMobileMenuOpen && (
                <div
                    className="inset-0 bg-white/10 backdrop-blur-xs bg-opacity-50 lg:hidden z-60 h-screen"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}
        </nav>
    );
}

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, BarChart3, CheckCircle2, Menu, ShieldCheck, Sparkles, X } from 'lucide-react';

const navItems = [
    { label: 'Features', href: '#features', icon: Sparkles },
    { label: 'How It Works', href: '#how-it-works', icon: ShieldCheck },
    { label: 'Testimonials', href: '#testimonials', icon: CheckCircle2 },
];

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <header className="fixed inset-x-0 top-0 z-50 border-b border-[#29251B] bg-[#0D0D0D]/80 backdrop-blur-xl">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">

                {/* Brand Logo */}
                <Link to="/" className="flex items-center gap-3 text-[#F5F5F0] transition-opacity hover:opacity-90">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#29251B] bg-[#151515] text-[#D4AF37]">
                        <BarChart3 className="h-4 w-4" />
                    </div>
                    <div>
                        <div className="text-sm font-semibold tracking-[0.24em] text-[#D4AF37] uppercase">Traders</div>
                        <div className="text-xs text-[#A8A8A0]">Edge</div>
                    </div>
                </Link>

                {/* Desktop Navigation Links */}
                <nav className="hidden items-center gap-8 md:flex">
                    {navItems.map((item) => (
                        <a
                            key={item.label}
                            href={item.href}
                            className="text-sm text-[#A8A8A0] transition-colors hover:text-[#D4AF37]"
                        >
                            {item.label}
                        </a>
                    ))}
                </nav>

                {/* Desktop Action Buttons */}
                <div className="hidden items-center gap-3 md:flex">
                    <Link
                        to="/signin"
                        className="rounded-lg border border-[#29251B] px-4 py-2 text-sm font-medium text-[#F5F5F0] transition-all hover:border-[#D4AF37] hover:text-[#D4AF37] active:scale-[0.98]"
                    >
                        Sign In
                    </Link>
                    <Link
                        to="/dashboard"
                        className="inline-flex items-center gap-2 rounded-lg bg-[#D4AF37] px-4 py-2 text-sm font-semibold text-[#070707] transition-all hover:bg-[#E5C76B] active:scale-[0.98]"
                    >
                        Launch App
                        <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>

                {/* Mobile Menu Toggle Button */}
                <button
                    type="button"
                    aria-label="Toggle navigation"
                    onClick={() => setIsOpen((value) => !value)}
                    className="inline-flex items-center justify-center rounded-lg border border-[#29251B] bg-[#151515] p-2.5 text-[#F5F5F0] transition-colors hover:border-[#D4AF37] hover:text-[#D4AF37] md:hidden"
                >
                    {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </button>
            </div>

            {/* Mobile Navigation Dropdown Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25, ease: 'easeInOut' }}
                        className="overflow-hidden border-t border-[#29251B] bg-[#0D0D0D]/95 backdrop-blur-2xl md:hidden"
                    >
                        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-6 sm:px-6">
                            {navItems.map((item) => {
                                const Icon = item.icon;
                                return (
                                    <a
                                        key={item.label}
                                        href={item.href}
                                        onClick={() => setIsOpen(false)}
                                        className="flex items-center gap-3 rounded-lg px-3 py-3 text-base font-medium text-[#A8A8A0] transition-colors hover:bg-[#151515] hover:text-[#D4AF37]"
                                    >
                                        <Icon className="h-5 w-5 text-[#D4AF37]" />
                                        {item.label}
                                    </a>
                                );
                            })}

                            <div className="mt-4 flex flex-col gap-3 border-t border-[#29251B] pt-5">
                                <Link
                                    to="/signin"
                                    onClick={() => setIsOpen(false)}
                                    className="flex items-center justify-center rounded-lg border border-[#29251B] bg-[#151515] py-3 text-center text-sm font-medium text-[#F5F5F0] transition-colors hover:border-[#D4AF37]"
                                >
                                    Sign In
                                </Link>
                                <Link
                                    to="/dashboard"
                                    onClick={() => setIsOpen(false)}
                                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#D4AF37] py-3 text-center text-sm font-semibold text-[#070707] transition-colors hover:bg-[#E5C76B]"
                                >
                                    Launch App
                                    <ArrowRight className="h-4 w-4" />
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
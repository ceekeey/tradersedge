import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BarChart3, Check, Mail } from 'lucide-react';

// Custom inline SVG for the GitHub brand logo
function GithubIcon(props) {
    return (
        <svg
            {...props}
            viewBox="0 0 24 24"
            width="24"
            height="24"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
            <path d="M9 18c-4.51 2-5-2-7-2" />
        </svg>
    );
}

// Custom inline SVG for X (formerly Twitter)
function XTwitterIcon(props) {
    return (
        <svg
            {...props}
            viewBox="0 0 24 24"
            width="24"
            height="24"
            fill="currentColor"
        >
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
    );
}

const footerLinks = {
    product: [
        { label: 'Features', href: '#features' },
        { label: 'How It Works', href: '#how-it-works' },
        { label: 'Interface Preview', href: '#preview' },
        { label: 'Testimonials', href: '#testimonials' },
    ],
    resources: [
        { label: 'Deriv API Guide', href: '/docs' },
        { label: 'Execution Rules', href: '/rules' },
        { label: 'Risk Calculator', href: '/tools' },
        { label: 'Changelog', href: '/changelog' },
    ],
    legal: [
        { label: 'Privacy Policy', href: '/privacy' },
        { label: 'Terms of Service', href: '/terms' },
        { label: 'Risk Disclosure', href: '/risk' },
    ],
};

const Footer = () => {
    const [email, setEmail] = useState('');
    const [subscribed, setSubscribed] = useState(false);

    const handleSubscribe = (e) => {
        e.preventDefault();
        if (email.trim()) {
            setSubscribed(true);
            setEmail('');
            setTimeout(() => setSubscribed(false), 4000);
        }
    };

    return (
        <footer className="border-t border-[#29251B] bg-[#070707] text-[#F5F5F0]">
            <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                <div className="grid gap-12 lg:grid-cols-12">

                    {/* Brand Info & Newsletter */}
                    <div className="lg:col-span-5">
                        <Link to="/" className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#29251B] bg-[#151515] text-[#D4AF37]">
                                <BarChart3 className="h-4 w-4" />
                            </div>
                            <div>
                                <div className="text-sm font-semibold tracking-[0.24em] text-[#D4AF37] uppercase">Traders</div>
                                <div className="text-xs text-[#A8A8A0]">Edge</div>
                            </div>
                        </Link>

                        <p className="mt-4 max-w-sm text-sm leading-6 text-[#A8A8A0]">
                            Execution discipline, automated journaling, and Deriv API integration built for serious market operators.
                        </p>

                        <div className="mt-6">
                            <span className="text-xs font-semibold uppercase tracking-wider text-[#F5F5F0]">
                                Weekly Execution Insights
                            </span>
                            <form onSubmit={handleSubscribe} className="mt-2.5 flex max-w-md gap-2">
                                <div className="relative flex-1">
                                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#A8A8A0]" />
                                    <input
                                        type="email"
                                        required
                                        placeholder="Enter your email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full rounded-lg border border-[#29251B] bg-[#0D0D0D] py-2.5 pl-9 pr-3 text-sm text-[#F5F5F0] placeholder-[#A8A8A0] outline-none transition-colors focus:border-[#D4AF37]"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="inline-flex items-center justify-center rounded-lg bg-[#D4AF37] px-4 py-2.5 text-sm font-semibold text-[#070707] transition-all hover:bg-[#E5C76B] active:scale-[0.98]"
                                >
                                    {subscribed ? <Check className="h-4 w-4 text-[#070707]" /> : <ArrowRight className="h-4 w-4" />}
                                </button>
                            </form>
                            {subscribed && (
                                <p className="mt-2 text-xs text-[#10B981]">Thanks for subscribing to our newsletter!</p>
                            )}
                        </div>
                    </div>

                    {/* Navigation Columns */}
                    <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-7">
                        <div>
                            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#D4AF37]">Product</h3>
                            <ul className="mt-4 space-y-3 text-sm">
                                {footerLinks.product.map((link) => (
                                    <li key={link.label}>
                                        <a href={link.href} className="text-[#A8A8A0] transition-colors hover:text-[#F5F5F0]">
                                            {link.label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#D4AF37]">Resources</h3>
                            <ul className="mt-4 space-y-3 text-sm">
                                {footerLinks.resources.map((link) => (
                                    <li key={link.label}>
                                        <a href={link.href} className="text-[#A8A8A0] transition-colors hover:text-[#F5F5F0]">
                                            {link.label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#D4AF37]">Legal</h3>
                            <ul className="mt-4 space-y-3 text-sm">
                                {footerLinks.legal.map((link) => (
                                    <li key={link.label}>
                                        <a href={link.href} className="text-[#A8A8A0] transition-colors hover:text-[#F5F5F0]">
                                            {link.label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                </div>

                {/* Bottom Row */}
                <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-[#29251B] pt-8 sm:flex-row">
                    <p className="text-xs text-[#A8A8A0]">
                        © 2026 Traders Edge. All rights reserved.
                    </p>

                    <div className="flex items-center gap-6">
                        <div className="inline-flex items-center gap-2 rounded-full border border-[#29251B] bg-[#0D0D0D] px-3 py-1 text-xs text-[#10B981]">
                            <span className="relative flex h-2 w-2">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#10B981] opacity-75" />
                                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#10B981]" />
                            </span>
                            API Status: Operational
                        </div>

                        <div className="flex items-center gap-3 text-[#A8A8A0]">
                            <a href="https://github.com" aria-label="GitHub" className="transition-colors hover:text-[#D4AF37]">
                                <GithubIcon className="h-4 w-4" />
                            </a>
                            <a href="https://twitter.com" aria-label="X (Twitter)" className="transition-colors hover:text-[#D4AF37]">
                                <XTwitterIcon className="h-4 w-4" />
                            </a>
                        </div>
                    </div>
                </div>

            </div>
        </footer>
    );
};

export default Footer;
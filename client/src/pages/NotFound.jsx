import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Home, LineChart } from 'lucide-react';

export default function NotFound() {
    const navigate = useNavigate();

    return (
        <div className="relative flex h-screen w-screen flex-col items-center justify-between overflow-hidden bg-[#070707] px-4 py-8 text-[#F5F5F0]">

            {/* Background Radial Glow */}
            <div
                className="pointer-events-none absolute inset-0 z-0 opacity-40"
                style={{
                    background: 'radial-gradient(circle at 50% 40%, rgba(212,175,55,0.12), transparent 60%)',
                }}
            />

            {/* Error Badge */}
            <div className="relative z-10 pt-4 text-center">
                <div className="inline-block rounded-md border border-red-500/20 bg-red-500/10 px-3 py-1 text-[10px] font-mono font-bold uppercase tracking-widest text-red-400 backdrop-blur-md">
                    Error Code: 404
                </div>
            </div>

            {/* Full-Page Image Section */}
            <div className="relative z-10 flex w-full flex-1 items-center justify-center p-2">
                <img
                    src="/404.gif" /* File must be located directly inside the /public folder */
                    alt="Page Not Found"
                    className="h-auto max-h-[55vh] w-full max-w-4xl object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.8)]"
                />
            </div>

            {/* Bottom Content Overlay */}
            <div className="relative z-10 w-full max-w-xl space-y-6 text-center pb-4">
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight text-[#F5F5F0] sm:text-5xl">
                        Page Out of Bounds
                    </h1>
                    <p className="mx-auto max-w-md text-xs leading-relaxed text-[#A8A8A0] sm:text-sm">
                        Looks like you hit a bad tick. The page or chart analysis you are searching for has been moved, liquidated, or doesn't exist.
                    </p>
                </div>

                {/* Primary Actions */}
                <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#29251B] bg-[#0D0D0D] px-6 py-3 text-xs font-bold text-[#A8A8A0] transition hover:border-[#3E3A2E] hover:bg-[#151515] hover:text-[#F5F5F0] sm:w-auto"
                    >
                        <ArrowLeft className="h-4 w-4" /> Go Back
                    </button>

                    <Link
                        to="/"
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#D4AF37] px-6 py-3 text-xs font-bold text-black transition hover:bg-[#b8952b] sm:w-auto"
                    >
                        <Home className="h-4 w-4" /> Return to Home
                    </Link>
                </div>

                {/* Quick Link Footer */}
                <div>
                    <Link
                        to="/journal"
                        className="inline-flex items-center gap-1.5 text-xs text-[#6F6F68] transition hover:text-[#D4AF37]"
                    >
                        <LineChart className="h-3.5 w-3.5" /> View Active Trade Logs
                    </Link>
                </div>
            </div>

        </div>
    );
}
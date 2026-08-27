import { ArrowRight, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import Navbar from '../components/layout/Navbar';
import { Footer, Preview, Testimonial, HowWork, Features, Metrics } from '../components';

// Static animation variant for reuse across pasted components
const fadeUp = {
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.2 },
    transition: { duration: 0.45 },
};

// Static chart mock data to prevent recreation on render
const CHART_BARS = [
    { id: 'b1', height: 18 },
    { id: 'b2', height: 26 },
    { id: 'b3', height: 21 },
    { id: 'b4', height: 30 },
    { id: 'b5', height: 22 },
    { id: 'b6', height: 36 },
    { id: 'b7', height: 28 },
    { id: 'b8', height: 40 },
];

export default function Landing() {
    return (
        <div className="min-h-screen bg-[#070707] text-[#F5F5F0] antialiased selection:bg-[#D4AF37]/30 selection:text-[#D4AF37]">
            <Navbar />

            <main className="pt-24">
                {/* Hero Section */}
                <section className="mx-auto max-w-7xl px-4 pb-16 pt-10 sm:px-6 lg:px-8">
                    <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">

                        {/* Left Copy Column */}
                        <motion.div {...fadeUp}>
                            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#29251B] bg-[#0D0D0D] px-3 py-1.5 text-xs font-medium text-[#D4AF37]">
                                <Zap className="h-3.5 w-3.5" />
                                Built for disciplined execution
                            </div>

                            <h1 className="max-w-xl text-4xl font-semibold tracking-tight text-[#F5F5F0] sm:text-5xl lg:text-6xl">
                                Trade with clarity. Journal with intent. Stay in control.
                            </h1>

                            <p className="mt-6 max-w-xl text-base leading-7 text-[#A8A8A0] sm:text-lg">
                                Traders Edge connects your execution workflow with Deriv API speed, structured risk rules, and a calm reflection system built for serious traders.
                            </p>

                            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                                <a
                                    href="/dashboard"
                                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#D4AF37] px-6 py-3 text-sm font-semibold text-[#070707] transition-all hover:bg-[#E5C76B] active:scale-[0.98]"
                                >
                                    Start Trading Now
                                    <ArrowRight className="h-4 w-4" />
                                </a>
                                <a
                                    href="/login"
                                    className="inline-flex items-center justify-center rounded-lg border border-[#29251B] bg-[#0D0D0D] px-6 py-3 text-sm font-semibold text-[#F5F5F0] transition-all hover:border-[#D4AF37] hover:text-[#D4AF37] active:scale-[0.98]"
                                >
                                    Launch App
                                </a>
                            </div>
                        </motion.div>

                        {/* Right Terminal Mockup */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.98, y: 18 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            transition={{ duration: 0.45, ease: 'easeOut' }}
                            className="rounded-2xl border border-[#29251B] bg-[#0D0D0D] p-4 shadow-[0_0_0_1px_rgba(212,175,55,0.06)]"
                        >
                            <div className="rounded-xl border border-[#29251B] bg-[#070707] p-4">
                                <div className="mb-4 flex items-center justify-between border-b border-[#29251B] pb-3">
                                    <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#A8A8A0]">
                                        <span className="h-2.5 w-2.5 rounded-full bg-[#10B981] animate-pulse" />
                                        Trade Terminal
                                    </div>
                                    <span className="rounded-full bg-[#151515] px-2 py-1 text-[10px] font-medium text-[#D4AF37]">
                                        Live
                                    </span>
                                </div>

                                <div className="space-y-4">
                                    <div className="rounded-lg border border-[#29251B] bg-[#151515] p-3">
                                        <div className="mb-2 flex items-center justify-between text-xs text-[#A8A8A0]">
                                            <span>EURUSD</span>
                                            <span className="text-[#10B981]">+1.24%</span>
                                        </div>
                                        <div className="flex items-end gap-2">
                                            <div className="flex-1">
                                                <div className="h-16 rounded bg-gradient-to-t from-[#0D0D0D] via-[#0D0D0D] to-[#D4AF37]/25" />
                                            </div>
                                            <div className="flex h-16 items-end gap-1">
                                                {CHART_BARS.map((bar) => (
                                                    <span
                                                        key={bar.id}
                                                        className="w-2 rounded-t bg-[#D4AF37]/70 transition-all hover:bg-[#D4AF37]"
                                                        style={{ height: `${bar.height}px` }}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid gap-3 sm:grid-cols-2">
                                        <div className="rounded-lg border border-[#29251B] bg-[#151515] p-3">
                                            <div className="text-xs text-[#A8A8A0]">Balance</div>
                                            <div className="mt-2 text-2xl font-semibold text-[#F5F5F0]">$24,680</div>
                                        </div>
                                        <div className="rounded-lg border border-[#29251B] bg-[#151515] p-3">
                                            <div className="text-xs text-[#A8A8A0]">Daily P/L</div>
                                            <div className="mt-2 text-2xl font-semibold text-[#10B981]">+$420</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                    </div>
                </section>

                {/* Additional Page Sections */}
                <Metrics />
                <Features />
                <Preview />
                <HowWork />
                <Testimonial />
            </main>

            <Footer />
        </div>
    );
}
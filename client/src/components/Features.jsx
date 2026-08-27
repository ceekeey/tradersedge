import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, ShieldCheck, Sparkles, TrendingUp } from 'lucide-react';

const features = [
    {
        title: 'Live Trading',
        text: 'Execute with speed, discipline, and clear execution logic built around your trade plan.',
        icon: TrendingUp,
        tag: 'Deriv API',
    },
    {
        title: 'Automated Journaling',
        text: 'Capture trade intent, mistakes, and lessons without losing momentum mid-session.',
        icon: Sparkles,
        tag: 'Analytics',
    },
    {
        title: 'Rules Checklist',
        text: 'Reinforce your process before every trade so execution stays governed by structure.',
        icon: CheckCircle2,
        tag: 'Risk Rules',
    },
    {
        title: 'Trader Sanctuary',
        text: 'Reflect, reset, and maintain emotional stability between high-pressure market sessions.',
        icon: ShieldCheck,
        tag: 'Mindset',
    },
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
    },
};

const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.4, ease: 'easeOut' },
    },
};

const Features = () => {
    return (
        <section id="features" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
            {/* Header Block */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.45 }}
                className="mb-12 text-center"
            >
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[#29251B] bg-[#0D0D0D] px-3.5 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[#D4AF37]">
                    Core System
                </span>
                <h2 className="mt-4 text-3xl font-semibold tracking-tight text-[#F5F5F0] sm:text-4xl">
                    A disciplined workflow built for execution and control.
                </h2>
                <p className="mx-auto mt-3 max-w-2xl text-base text-[#A8A8A0]">
                    Eliminate emotional friction by linking execution directly with real-time risk parameters.
                </p>
            </motion.div>

            {/* Grid Items */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.15 }}
                className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4"
            >
                {features.map((feature) => {
                    const Icon = feature.icon;

                    return (
                        <motion.div
                            key={feature.title}
                            variants={cardVariants}
                            whileHover={{ y: -4 }}
                            className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-[#29251B] bg-[#0D0D0D] p-6 transition-all duration-300 hover:border-[#D4AF37]/50 hover:shadow-[0_0_24px_rgba(212,175,55,0.06)]"
                        >
                            {/* Accent Glow */}
                            <div className="absolute -right-8 -top-8 h-20 w-20 rounded-full bg-[#D4AF37]/5 blur-xl transition-all duration-300 group-hover:bg-[#D4AF37]/15" />

                            <div>
                                <div className="mb-6 flex items-center justify-between">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#29251B] bg-[#151515] text-[#D4AF37] transition-colors group-hover:border-[#D4AF37]/40">
                                        <Icon className="h-5 w-5" />
                                    </div>
                                    <span className="text-[11px] font-medium tracking-wide text-[#A8A8A0] uppercase">
                                        {feature.tag}
                                    </span>
                                </div>

                                <h3 className="text-xl font-semibold text-[#F5F5F0]">
                                    {feature.title}
                                </h3>
                                <p className="mt-3 text-sm leading-6 text-[#A8A8A0]">
                                    {feature.text}
                                </p>
                            </div>
                        </motion.div>
                    );
                })}
            </motion.div>
        </section>
    );
};

export default Features;
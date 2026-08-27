import React from 'react';
import { motion } from 'framer-motion';
import { KeyRound, SlidersHorizontal, Zap, ArrowRight } from 'lucide-react';

const steps = [
    {
        number: '01',
        title: 'Connect Deriv API',
        description: 'Link your Deriv token to establish a fast, direct WebSocket execution workspace[cite: 1].',
        icon: KeyRound,
    },
    {
        number: '02',
        title: 'Define Risk Rules',
        description: 'Configure maximum drawdown thresholds and entry parameters to enforce discipline.',
        icon: SlidersHorizontal,
    },
    {
        number: '03',
        title: 'Execute & Auto-Journal',
        description: 'Take trades with confidence while every setup is logged directly into your database.',
        icon: Zap,
    },
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
        },
    },
};

const cardVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.45, ease: 'easeOut' },
    },
};

const HowWork = () => {
    return (
        <section id="how-it-works" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">

            {/* Header Block */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.45 }}
                className="mb-14 text-center"
            >
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[#29251B] bg-[#0D0D0D] px-3.5 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[#D4AF37]">
                    How It Works
                </span>
                <h2 className="mt-4 text-3xl font-semibold tracking-tight text-[#F5F5F0] sm:text-4xl">
                    Build a process that keeps your emotions out of the way.
                </h2>
                <p className="mx-auto mt-3 max-w-xl text-base text-[#A8A8A0]">
                    Three simple steps to transition from impulsive trades to structured execution[cite: 1].
                </p>
            </motion.div>

            {/* 3-Step Grid */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                className="grid gap-6 md:grid-cols-3"
            >
                {steps.map((step, index) => {
                    const Icon = step.icon;
                    const isLast = index === steps.length - 1;

                    return (
                        <motion.div
                            key={step.title}
                            variants={cardVariants}
                            whileHover={{ y: -4 }}
                            className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-[#29251B] bg-[#0D0D0D] p-6 transition-all duration-300 hover:border-[#D4AF37]/50 hover:shadow-[0_0_24px_rgba(212,175,55,0.06)]"
                        >
                            {/* Ambient Gold Glow */}
                            <div className="absolute -right-8 -top-8 h-20 w-20 rounded-full bg-[#D4AF37]/5 blur-xl transition-all duration-300 group-hover:bg-[#D4AF37]/15" />

                            <div>
                                {/* Step Top Row */}
                                <div className="mb-6 flex items-center justify-between">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#29251B] bg-[#151515] text-[#D4AF37] transition-colors group-hover:border-[#D4AF37]/40">
                                        <Icon className="h-5 w-5" />
                                    </div>
                                    <span className="font-mono text-xl font-bold text-[#D4AF37]/40 transition-colors group-hover:text-[#D4AF37]">
                                        {step.number}
                                    </span>
                                </div>

                                {/* Step Title & Description */}
                                <h3 className="text-xl font-semibold text-[#F5F5F0]">
                                    {step.title}
                                </h3>
                                <p className="mt-3 text-sm leading-6 text-[#A8A8A0]">
                                    {step.description}
                                </p>
                            </div>

                            {/* Flow Arrow Indicator for Desktop */}
                            {!isLast && (
                                <div className="mt-6 hidden justify-end md:flex">
                                    <ArrowRight className="h-4 w-4 text-[#29251B] transition-colors group-hover:text-[#D4AF37]" />
                                </div>
                            )}
                        </motion.div>
                    );
                })}
            </motion.div>
        </section>
    );
};

export default HowWork;
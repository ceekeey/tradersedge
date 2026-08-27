import React from 'react';
import { motion } from 'framer-motion';
import { Activity, Globe2, ShieldCheck, Zap } from 'lucide-react';

const metrics = [
    {
        label: 'Execution Speed',
        value: '< 40ms',
        subtext: 'Direct Deriv API route',
        icon: Zap,
        accent: 'text-[#D4AF37]',
        badgeBg: 'bg-[#D4AF37]/10',
    },
    {
        label: 'Platform Uptime',
        value: '99.99%',
        subtext: 'High-availability infrastructure',
        icon: ShieldCheck,
        accent: 'text-[#10B981]',
        badgeBg: 'bg-[#10B981]/10',
    },
    {
        label: 'Market Access',
        value: '24/7',
        subtext: 'Synthetics & Forex feeds',
        icon: Globe2,
        accent: 'text-[#38BDF8]',
        badgeBg: 'bg-[#38BDF8]/10',
    },
    {
        label: 'Active Executions',
        value: '2.4M+',
        subtext: 'Journaled trade setups',
        icon: Activity,
        accent: 'text-[#F5B942]',
        badgeBg: 'bg-[#F5B942]/10',
    },
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.12,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.45, ease: 'easeOut' },
    },
};

const Metrics = () => {
    return (
        <section className="border-y border-[#29251B] bg-[#0D0D0D]">
            <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                    className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
                >
                    {metrics.map((metric) => {
                        const Icon = metric.icon;

                        return (
                            <motion.div
                                key={metric.label}
                                variants={itemVariants}
                                whileHover={{ y: -4 }}
                                className="group relative overflow-hidden rounded-xl border border-[#29251B] bg-[#070707] p-6 transition-all duration-300 hover:border-[#D4AF37]/50 hover:shadow-[0_0_20px_rgba(212,175,55,0.08)]"
                            >
                                {/* Background Ambient Glow */}
                                <div className="absolute -right-10 -top-10 h-24 w-24 rounded-full bg-[#D4AF37]/5 blur-2xl transition-all duration-300 group-hover:bg-[#D4AF37]/15" />

                                <div className="flex items-center justify-between">
                                    <div className={`flex h-10 w-10 items-center justify-center rounded-lg border border-[#29251B] ${metric.badgeBg}`}>
                                        <Icon className={`h-5 w-5 ${metric.accent}`} />
                                    </div>

                                    {/* Live Pulse Indicator for Uptime/Execution */}
                                    <span className="flex h-2 w-2">
                                        <span className="absolute inline-flex h-2 w-2 animate-ping rounded-full bg-[#10B981] opacity-75" />
                                        <span className="relative inline-flex h-2 w-2 rounded-full bg-[#10B981]" />
                                    </span>
                                </div>

                                <div className="mt-5">
                                    <div className={`text-3xl font-bold tracking-tight ${metric.accent}`}>
                                        {metric.value}
                                    </div>
                                    <div className="mt-1 text-sm font-medium text-[#F5F5F0]">
                                        {metric.label}
                                    </div>
                                    <div className="mt-1 text-xs text-[#A8A8A0]">
                                        {metric.subtext}
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </motion.div>
            </div>
        </section>
    );
};

export default Metrics;
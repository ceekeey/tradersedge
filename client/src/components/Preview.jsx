import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, ShieldAlert, Terminal, Activity, ChevronRight, Play } from 'lucide-react';

const consoleLogs = [
    { type: 'exec', text: 'ORDER: BUY EURUSD @ 1.08240', time: '14:32:01', status: 'SUCCESS' },
    { type: 'risk', text: 'RISK: 0.50% of balance (Max allowed: 1.00%)', time: '14:32:01', status: 'PASSED' },
    { type: 'rules', text: 'RULES: Pre-trade checklist verified (4/4)', time: '14:32:00', status: 'VALID' },
    { type: 'journal', text: 'JOURNAL: Auto-captured entry intent & screenshots', time: '14:32:02', status: 'SAVED' },
];

const containerVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.45, ease: 'easeOut', staggerChildren: 0.1 },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

const Preview = () => {
    const [activeTab, setActiveTab] = useState('Console');

    return (
        <section className="border-y border-[#29251B] bg-[#0D0D0D]">
            <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">

                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.45 }}
                    className="mb-12 text-center"
                >
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-[#29251B] bg-[#070707] px-3.5 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[#D4AF37]">
                        Interface Preview
                    </span>
                    <h2 className="mt-4 text-3xl font-semibold tracking-tight text-[#F5F5F0] sm:text-4xl">
                        Technical clarity in every market session.
                    </h2>
                    <p className="mx-auto mt-3 max-w-xl text-base text-[#A8A8A0]">
                        Real-time execution speed combined with instant rule validation and automated trade logs[cite: 1, 2].
                    </p>
                </motion.div>

                {/* Main Preview Shell Window */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                    className="overflow-hidden rounded-2xl border border-[#29251B] bg-[#070707] p-3 shadow-2xl sm:p-6"
                >
                    <div className="rounded-xl border border-[#29251B] bg-[#0D0D0D] p-4 sm:p-5">

                        {/* Terminal Header Bar */}
                        <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-[#29251B] pb-4">
                            <div className="flex items-center gap-2">
                                <span className="h-3 w-3 rounded-full bg-[#EF4444]/80" />
                                <span className="h-3 w-3 rounded-full bg-[#F5B942]/80" />
                                <span className="h-3 w-3 rounded-full bg-[#10B981]/80" />
                                <span className="ml-2 text-xs font-mono text-[#A8A8A0]">traders-edge//execution-terminal</span>
                            </div>

                            {/* Navigation Tabs */}
                            <div className="flex items-center gap-1 rounded-lg border border-[#29251B] bg-[#070707] p-1">
                                {['Console', 'Risk Rules', 'Logs'].map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`rounded-md px-3 py-1 text-xs font-medium transition-all ${activeTab === tab
                                            ? 'bg-[#151515] text-[#D4AF37] shadow-sm'
                                            : 'text-[#A8A8A0] hover:text-[#F5F5F0]'
                                            }`}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Terminal Grid Content */}
                        <div className="grid gap-4 lg:grid-cols-[1.3fr_0.7fr]">

                            {/* Console Output Panel */}
                            <motion.div variants={itemVariants} className="rounded-xl border border-[#29251B] bg-[#070707] p-4 font-mono">
                                <div className="mb-4 flex items-center justify-between border-b border-[#29251B] pb-3 text-xs text-[#A8A8A0]">
                                    <div className="flex items-center gap-2">
                                        <Terminal className="h-4 w-4 text-[#D4AF37]" />
                                        <span>Execution Console</span>
                                    </div>
                                    <span className="flex items-center gap-1.5 text-[#10B981]">
                                        <span className="h-2 w-2 rounded-full bg-[#10B981] animate-pulse" />
                                        Connected
                                    </span>
                                </div>

                                <div className="space-y-2.5">
                                    {consoleLogs.map((log) => (
                                        <div
                                            key={log.text}
                                            className="group flex items-center justify-between rounded-lg border border-[#29251B]/60 bg-[#0D0D0D] px-3.5 py-2.5 text-xs text-[#F5F5F0] transition-colors hover:border-[#D4AF37]/40 hover:bg-[#151515]"
                                        >
                                            <div className="flex items-center gap-2.5">
                                                <ChevronRight className="h-3.5 w-3.5 text-[#D4AF37] transition-transform group-hover:translate-x-0.5" />
                                                <span className="tracking-wide">{log.text}</span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className="hidden text-[10px] text-[#A8A8A0] sm:inline">{log.time}</span>
                                                <span className="rounded bg-[#10B981]/10 px-2 py-0.5 text-[10px] font-semibold text-[#10B981]">
                                                    {log.status}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>

                            {/* Risk & Rules KPI Metrics Panel */}
                            <div className="space-y-4">

                                {/* Risk Parameter Box */}
                                <motion.div
                                    variants={itemVariants}
                                    whileHover={{ y: -2 }}
                                    className="rounded-xl border border-[#29251B] bg-[#151515] p-4 transition-all hover:border-[#D4AF37]/50"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[#A8A8A0]">
                                            Session Risk
                                        </div>
                                        <ShieldAlert className="h-4 w-4 text-[#D4AF37]" />
                                    </div>
                                    <div className="mt-3 flex items-baseline justify-between">
                                        <div className="text-3xl font-bold text-[#F5F5F0]">1.2%</div>
                                        <span className="text-xs text-[#10B981]">Optimal Zone</span>
                                    </div>
                                    <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-[#070707]">
                                        <div className="h-full w-[35%] rounded-full bg-[#D4AF37]" />
                                    </div>
                                </motion.div>

                                {/* Rules Validation Box */}
                                <motion.div
                                    variants={itemVariants}
                                    whileHover={{ y: -2 }}
                                    className="rounded-xl border border-[#29251B] bg-[#151515] p-4 transition-all hover:border-[#D4AF37]/50"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[#A8A8A0]">
                                            Rules Checklist
                                        </div>
                                        <CheckCircle2 className="h-4 w-4 text-[#10B981]" />
                                    </div>
                                    <div className="mt-3 flex items-baseline justify-between">
                                        <div className="text-3xl font-bold text-[#10B981]">4 / 4</div>
                                        <span className="text-xs text-[#A8A8A0]">Ready to Execute</span>
                                    </div>
                                    <div className="mt-3 flex gap-1.5">
                                        {[1, 2, 3, 4].map((step) => (
                                            <div key={step} className="h-1.5 flex-1 rounded-full bg-[#10B981]" />
                                        ))}
                                    </div>
                                </motion.div>

                            </div>

                        </div>
                    </div>
                </motion.div>

            </div>
        </section>
    );
};

export default Preview;
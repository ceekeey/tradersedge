import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Quote, Star } from 'lucide-react';

const testimonials = [
    {
        quote:
            'The discipline layer is what changed my consistency. I can track execution and protect my mindset without distraction.',
        name: 'A. Moreno',
        role: 'Intraday Trader',
        metrics: '84% Win Rate Control',
        avatarBg: 'bg-[#D4AF37]/10 text-[#D4AF37]',
    },
    {
        quote:
            'The journaling flow keeps me honest. It is simple, fast, and makes the mistakes visible before they compound.',
        name: 'L. Chen',
        role: 'Swing Trader',
        metrics: '2.4 R:R Average',
        avatarBg: 'bg-[#10B981]/10 text-[#10B981]',
    },
    {
        quote:
            'It feels like a professional desk. The workflow is clean, and the rules-first process helps me stay focused.',
        name: 'D. Okafor',
        role: 'Systematic Trader',
        metrics: 'Zero Impulse Trades',
        avatarBg: 'bg-[#38BDF8]/10 text-[#38BDF8]',
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

const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.45, ease: 'easeOut' },
    },
};

const Testimonial = () => {
    return (
        <section id="testimonials" className="border-y border-[#29251B] bg-[#0D0D0D]">
            <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">

                {/* Header Block */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.45 }}
                    className="mb-14 text-center"
                >
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-[#29251B] bg-[#070707] px-3.5 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[#D4AF37]">
                        Social Proof
                    </span>
                    <h2 className="mt-4 text-3xl font-semibold tracking-tight text-[#F5F5F0] sm:text-4xl">
                        Trusted by traders focused on process and control.
                    </h2>
                    <p className="mx-auto mt-3 max-w-xl text-base text-[#A8A8A0]">
                        Real reviews from disciplined execution traders using our workflow daily.
                    </p>
                </motion.div>

                {/* Testimonial Cards Grid */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                    className="grid gap-6 md:grid-cols-3"
                >
                    {testimonials.map((item) => (
                        <motion.blockquote
                            key={item.name}
                            variants={cardVariants}
                            whileHover={{ y: -4 }}
                            className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-[#29251B] bg-[#070707] p-6 transition-all duration-300 hover:border-[#D4AF37]/50 hover:shadow-[0_0_24px_rgba(212,175,55,0.06)]"
                        >
                            {/* Ambient Glow */}
                            <div className="absolute -right-8 -top-8 h-20 w-20 rounded-full bg-[#D4AF37]/5 blur-xl transition-all duration-300 group-hover:bg-[#D4AF37]/15" />

                            <div>
                                {/* Top Header: Quote Icon & 5-Star Rating */}
                                <div className="mb-6 flex items-center justify-between">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#29251B] bg-[#151515] text-[#D4AF37]">
                                        <Quote className="h-4 w-4" />
                                    </div>
                                    <div className="flex items-center gap-1">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className="h-3.5 w-3.5 fill-[#D4AF37] text-[#D4AF37]" />
                                        ))}
                                    </div>
                                </div>

                                {/* Main Quote Content */}
                                <p className="text-sm leading-6 text-[#A8A8A0]">
                                    “{item.quote}”
                                </p>
                            </div>

                            {/* Author Footer */}
                            <footer className="mt-8 border-t border-[#29251B] pt-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="flex items-center gap-1.5 font-semibold text-[#F5F5F0]">
                                            {item.name}
                                            <CheckCircle2 className="h-3.5 w-3.5 text-[#10B981]" />
                                        </div>
                                        <div className="text-xs text-[#A8A8A0]">{item.role}</div>
                                    </div>
                                    <span className={`rounded-md border border-[#29251B] px-2 py-1 text-[10px] font-medium ${item.avatarBg}`}>
                                        {item.metrics}
                                    </span>
                                </div>
                            </footer>
                        </motion.blockquote>
                    ))}
                </motion.div>

            </div>
        </section>
    );
};

export default Testimonial;
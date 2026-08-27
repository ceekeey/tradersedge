import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Mail, CheckCircle2, KeyRound } from 'lucide-react';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (email) {
            setSubmitted(true);
        }
    };

    return (
        <div className="flex min-h-screen w-full items-center justify-center bg-[#070707] p-4 text-[#F5F5F0]">
            <div className="w-full max-w-md rounded-2xl border border-[#29251B] bg-[#0D0D0D] p-8 space-y-6 shadow-2xl">

                {/* Header Icon & Title */}
                <div className="text-center space-y-2">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-[#29251B] bg-[#151515] text-[#D4AF37]">
                        <KeyRound className="h-6 w-6" />
                    </div>
                    <h1 className="text-xl font-bold tracking-tight">Forgot Password?</h1>
                    <p className="text-xs text-[#A8A8A0]">
                        No worries. Enter your account email below to receive a secure password reset link.
                    </p>
                </div>

                {!submitted ? (
                    /* Forgot Password Form */
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold uppercase tracking-wider text-[#A8A8A0]">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3.5 top-3 h-4 w-4 text-[#6F6F68]" />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="trader@tradersedge.com"
                                    className="w-full rounded-xl border border-[#29251B] bg-[#151515] pl-10 pr-4 py-2.5 text-xs text-[#F5F5F0] placeholder-[#6F6F68] transition focus:border-[#D4AF37] focus:outline-none"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full rounded-xl bg-[#D4AF37] py-2.5 text-xs font-bold text-black transition hover:bg-[#b8952b]"
                        >
                            Send Reset Link
                        </button>
                    </form>
                ) : (
                    /* Confirmation Screen */
                    <div className="rounded-xl border border-[#10B981]/20 bg-[#10B981]/5 p-4 text-center space-y-3">
                        <div className="flex justify-center text-[#10B981]">
                            <CheckCircle2 className="h-8 w-8" />
                        </div>
                        <h3 className="text-xs font-bold text-[#F5F5F0]">Reset Link Sent</h3>
                        <p className="text-[11px] text-[#A8A8A0]">
                            We emailed a password reset link to <span className="font-semibold text-[#D4AF37]">{email}</span>. Please check your inbox and spam folder.
                        </p>
                    </div>
                )}

                {/* Return to Login */}
                <div className="pt-2 text-center border-t border-[#29251B]">
                    <Link
                        to="/signin"
                        className="inline-flex items-center gap-2 text-xs font-semibold text-[#A8A8A0] transition hover:text-[#F5F5F0]"
                    >
                        <ArrowLeft className="h-3.5 w-3.5" /> Back to Sign In
                    </Link>
                </div>

            </div>
        </div>
    );
}
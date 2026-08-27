import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Eye, EyeOff, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function ResetPassword() {
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (password.length < 8) {
            setError('Password must be at least 8 characters long.');
            return;
        }
        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }
        setError('');
        setIsSuccess(true);
        setTimeout(() => {
            navigate('/login');
        }, 2000);
    };

    return (
        <div className="flex min-h-screen w-full items-center justify-center bg-[#070707] p-4 text-[#F5F5F0]">
            <div className="w-full max-w-md rounded-2xl border border-[#29251B] bg-[#0D0D0D] p-8 space-y-6 shadow-2xl">

                {/* Header Icon & Title */}
                <div className="text-center space-y-2">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-[#29251B] bg-[#151515] text-[#D4AF37]">
                        <ShieldCheck className="h-6 w-6" />
                    </div>
                    <h1 className="text-xl font-bold tracking-tight">Set New Password</h1>
                    <p className="text-xs text-[#A8A8A0]">
                        Your new password must be distinct from previously used credentials.
                    </p>
                </div>

                {!isSuccess ? (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Error Banner */}
                        {error && (
                            <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-center text-xs text-red-400">
                                {error}
                            </div>
                        )}

                        {/* New Password Input */}
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold uppercase tracking-wider text-[#A8A8A0]">
                                New Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3.5 top-3 h-4 w-4 text-[#6F6F68]" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••••••"
                                    className="w-full rounded-xl border border-[#29251B] bg-[#151515] pl-10 pr-10 py-2.5 text-xs text-[#F5F5F0] placeholder-[#6F6F68] transition focus:border-[#D4AF37] focus:outline-none"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3.5 top-3 text-[#6F6F68] hover:text-[#F5F5F0]"
                                >
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                        </div>

                        {/* Confirm Password Input */}
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold uppercase tracking-wider text-[#A8A8A0]">
                                Confirm New Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3.5 top-3 h-4 w-4 text-[#6F6F68]" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="••••••••••••"
                                    className="w-full rounded-xl border border-[#29251B] bg-[#151515] pl-10 pr-10 py-2.5 text-xs text-[#F5F5F0] placeholder-[#6F6F68] transition focus:border-[#D4AF37] focus:outline-none"
                                />
                            </div>
                        </div>

                        {/* Password Criteria Checklist */}
                        <div className="rounded-xl border border-[#29251B] bg-[#151515] p-3 text-[10px] space-y-1 text-[#A8A8A0]">
                            <p className="font-semibold text-[#F5F5F0]">Password Requirements:</p>
                            <ul className="list-disc pl-4 space-y-0.5">
                                <li className={password.length >= 8 ? 'text-[#10B981]' : ''}>At least 8 characters long</li>
                                <li className={password && password === confirmPassword ? 'text-[#10B981]' : ''}>Passwords match</li>
                            </ul>
                        </div>

                        <button
                            type="submit"
                            className="w-full rounded-xl bg-[#D4AF37] py-2.5 text-xs font-bold text-black transition hover:bg-[#b8952b]"
                        >
                            Update Password
                        </button>
                    </form>
                ) : (
                    /* Success Alert */
                    <div className="rounded-xl border border-[#10B981]/20 bg-[#10B981]/5 p-4 text-center space-y-3">
                        <div className="flex justify-center text-[#10B981]">
                            <CheckCircle2 className="h-8 w-8" />
                        </div>
                        <h3 className="text-xs font-bold text-[#F5F5F0]">Password Reset Successful!</h3>
                        <p className="text-[11px] text-[#A8A8A0]">
                            Your password has been updated. Redirecting you to sign in...
                        </p>
                    </div>
                )}

                {/* Link to Login */}
                <div className="pt-2 text-center border-t border-[#29251B]">
                    <Link
                        to="/login"
                        className="text-xs font-semibold text-[#A8A8A0] transition hover:text-[#F5F5F0]"
                    >
                        Back to Login
                    </Link>
                </div>

            </div>
        </div>
    );
}
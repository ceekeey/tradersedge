import { useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, ArrowRight, Check, Eye, EyeOff, Lock, Mail, ShieldCheck, Zap, LineChart } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import SocialAuthButtons from '../components/common/SocialAuthButtons';

const platformFeatures = [
    {
        icon: Zap,
        title: 'Deriv API Connectivity',
        desc: 'Direct WebSocket integration for instant execution',
    },
    {
        icon: ShieldCheck,
        title: 'Disciplined Risk Guard',
        desc: 'Hard-coded max drawdown limits protect your capital',
    },
    {
        icon: LineChart,
        title: 'Automated Trade Logs',
        desc: 'Every trade automatically logged with full metrics',
    },
];

export default function SignIn() {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [rememberMe, setRememberMe] = useState(true);
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((current) => ({ ...current, [name]: value }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (!formData.email.trim() || !formData.password.trim()) {
            toast.error('Please enter both email and password');
            return;
        }
        toast.success('Sign in request ready');
    };

    return (
        <div className="h-screen w-full overflow-hidden bg-[#070707] text-[#F5F5F0] font-sans">
            <div className="grid h-full w-full md:grid-cols-2">

                {/* Left Column: Visual Branding & Live Feature Highlights */}
                <div className="relative hidden h-full w-full overflow-hidden border-r border-[#29251B] md:block">
                    {/* Background Image Layer */}
                    <img
                        src="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1400&q=80"
                        alt="Trading Workspace"
                        className="absolute inset-0 h-full w-full object-cover opacity-15"
                    />

                    {/* Dark Gold Gradient Overlay */}
                    <div
                        className="absolute inset-0"
                        style={{
                            background:
                                'radial-gradient(circle at 20% 20%, rgba(212,175,55,0.08), transparent 45%), linear-gradient(180deg, rgba(7,7,7,0.7) 0%, rgba(7,7,7,0.98) 100%)',
                        }}
                    />

                    {/* Top Branding */}
                    <div className="absolute left-8 top-8 flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#29251B] bg-[#0D0D0D] text-[#D4AF37] shadow-lg">
                            <Activity className="h-4 w-4 text-[#D4AF37]" />
                        </div>
                        <span className="text-xs font-semibold tracking-[0.2em] text-[#F5F5F0] uppercase">
                            Traders Edge
                        </span>
                    </div>

                    {/* Left Column Content Area */}
                    <div className="absolute inset-x-8 bottom-12 flex flex-col gap-6">
                        <div>
                            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#D4AF37]">
                                Execution Terminal
                            </span>
                            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[#F5F5F0]">
                                Built for process, clarity, and total trade control.
                            </h2>
                        </div>

                        {/* Feature Highlights Grid */}
                        <div className="space-y-3">
                            {platformFeatures.map((item) => {
                                const Icon = item.icon;
                                return (
                                    <div
                                        key={item.title}
                                        className="flex items-center gap-3.5 rounded-xl border border-[#29251B] bg-[#0D0D0D]/80 p-3.5 backdrop-blur-md"
                                    >
                                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[#29251B] bg-[#151515] text-[#D4AF37]">
                                            <Icon className="h-4 w-4" />
                                        </div>
                                        <div>
                                            <div className="text-xs font-semibold text-[#F5F5F0]">{item.title}</div>
                                            <div className="text-[11px] text-[#A8A8A0]">{item.desc}</div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Right Column: Auth Form */}
                <div className="flex h-full w-full items-center justify-center overflow-y-auto px-4 py-6 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                        className="my-auto w-full max-w-sm rounded-2xl border border-[#29251B] bg-[#0D0D0D] p-6 shadow-2xl sm:p-7"
                    >
                        {/* Header */}
                        <div className="mb-5">
                            <div className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-[#29251B] bg-[#070707] px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-[0.18em] text-[#A8A8A0]">
                                <span className="h-1.5 w-1.5 rounded-full bg-[#10B981]" />
                                Access Portal
                            </div>
                            <h1 className="text-2xl font-semibold text-[#F5F5F0]">Welcome back</h1>
                            <p className="mt-1 text-xs text-[#A8A8A0]">
                                Need an account?{' '}
                                <Link to="/signup" className="font-medium text-[#D4AF37] hover:text-[#E5C76B]">
                                    Sign up here
                                </Link>
                            </p>
                        </div>

                        {/* Compact Social Authentication */}
                        <div className="scale-95 origin-top -mb-1">
                            <SocialAuthButtons
                                onGoogleClick={() => toast('Google sign-in coming soon')}
                                onGithubClick={() => toast('GitHub sign-in coming soon')}
                            />
                        </div>

                        <div className="my-4 flex items-center gap-3">
                            <div className="h-px flex-1 bg-[#29251B]" />
                            <span className="text-[9px] uppercase tracking-[0.25em] text-[#A8A8A0]">Or email</span>
                            <div className="h-px flex-1 bg-[#29251B]" />
                        </div>

                        {/* Form Fields */}
                        <form onSubmit={handleSubmit} className="space-y-3.5">
                            <div>
                                <label htmlFor="email" className="mb-1.5 block text-xs font-medium text-[#F5F5F0]">
                                    Email address
                                </label>
                                <div className="relative">
                                    <Mail className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#A8A8A0]" />
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="name@example.com"
                                        className="w-full rounded-lg border border-[#29251B] bg-[#151515] py-2.5 pl-9 pr-3 text-xs text-[#F5F5F0] placeholder:text-[#A8A8A0] transition focus:border-[#D4AF37] focus:outline-none"
                                        autoComplete="email"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="password" className="mb-1.5 block text-xs font-medium text-[#F5F5F0]">
                                    Password
                                </label>
                                <div className="relative">
                                    <Lock className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#A8A8A0]" />
                                    <input
                                        id="password"
                                        name="password"
                                        type={showPassword ? 'text' : 'password'}
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="••••••••"
                                        className="w-full rounded-lg border border-[#29251B] bg-[#151515] py-2.5 pl-9 pr-9 text-xs text-[#F5F5F0] placeholder:text-[#A8A8A0] transition focus:border-[#D4AF37] focus:outline-none"
                                        autoComplete="current-password"
                                    />
                                    <button
                                        type="button"
                                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                                        onClick={() => setShowPassword((current) => !current)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A8A8A0] transition hover:text-[#F5F5F0]"
                                    >
                                        {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-center justify-between text-xs">
                                <label className="inline-flex items-center gap-1.5 text-[#A8A8A0]">
                                    <input
                                        type="checkbox"
                                        checked={rememberMe}
                                        onChange={(event) => setRememberMe(event.target.checked)}
                                        className="h-3.5 w-3.5 rounded border-[#29251B] bg-[#151515] text-[#D4AF37] focus:ring-[#D4AF37]"
                                    />
                                    Remember me
                                </label>
                                <Link to="/forgot-password" className="text-[#D4AF37] transition hover:text-[#E5C76B]">
                                    Forgot password?
                                </Link>
                            </div>

                            <button
                                type="submit"
                                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#D4AF37] py-2.5 text-xs font-semibold text-[#070707] transition hover:bg-[#E5C76B] active:scale-[0.98]"
                            >
                                Sign In
                                <ArrowRight className="h-3.5 w-3.5" />
                            </button>
                        </form>

                        <div className="mt-4 rounded-lg border border-[#29251B] bg-[#070707] p-2.5 text-[11px] text-[#A8A8A0]">
                            <div className="flex items-center gap-2">
                                <Check className="h-3.5 w-3.5 shrink-0 text-[#10B981]" />
                                Secure API connection with automated execution parameters.
                            </div>
                        </div>
                    </motion.div>
                </div>

            </div>
        </div>
    );
}
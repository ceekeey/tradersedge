import React, { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    TrendingUp,
    BookOpen,
    FileText,
    ShieldAlert,
    Compass,
    User,
    LogOut,
    Menu,
    X,
    ChevronLeft,
    ChevronRight,
    Activity,
    Bell
} from 'lucide-react';

const navItems = [
    { name: 'Home', path: '/dashboard', icon: LayoutDashboard, end: true },
    { name: 'Trade', path: '/dashboard/trade', icon: TrendingUp },
    { name: 'Journal', path: '/dashboard/journal', icon: BookOpen },
    { name: 'Notes', path: '/dashboard/notes', icon: FileText },
    { name: 'Rules', path: '/dashboard/rules', icon: ShieldAlert },
    { name: 'Sanctuary', path: '/dashboard/sanctuary', icon: Compass },
    { name: 'Profile', path: '/dashboard/profile', icon: User },
];

export default function DashboardLayout() {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        // Clear auth state/tokens here
        navigate('/signin');
    };

    return (
        <div className="flex h-screen w-full overflow-hidden bg-[#070707] text-[#F5F5F0] font-sans">

            {/* Mobile Backdrop */}
            {mobileMenuOpen && (
                <div
                    onClick={() => setMobileMenuOpen(false)}
                    className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
                />
            )}

            {/* Sidebar (Desktop + Mobile Drawer) */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 flex flex-col border-r border-[#29251B] bg-[#0D0D0D] transition-all duration-300 lg:static lg:z-auto ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
                    } ${sidebarCollapsed ? 'lg:w-20' : 'lg:w-64'} w-64`}
            >
                {/* Brand Header */}
                <div className="flex h-16 items-center justify-between border-b border-[#29251B] px-4">
                    <Link to="/dashboard" className="flex items-center gap-3 overflow-hidden">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#29251B] bg-[#151515] text-[#D4AF37]">
                            <Activity className="h-5 w-5" />
                        </div>
                        {(!sidebarCollapsed || mobileMenuOpen) && (
                            <div className="whitespace-nowrap">
                                <div className="text-xs font-semibold tracking-[0.2em] text-[#D4AF37] uppercase">Traders</div>
                                <div className="text-[10px] text-[#A8A8A0]">EDGE</div>
                            </div>
                        )}
                    </Link>

                    {/* Desktop Collapse Toggle */}
                    <button
                        onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                        className="hidden rounded-lg border border-[#29251B] p-1.5 text-[#A8A8A0] hover:border-[#D4AF37] hover:text-[#F5F5F0] lg:block"
                    >
                        {sidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
                    </button>

                    {/* Mobile Close Toggle */}
                    <button
                        onClick={() => setMobileMenuOpen(false)}
                        className="rounded-lg p-1.5 text-[#A8A8A0] hover:text-[#F5F5F0] lg:hidden"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Navigation Links */}
                <nav className="flex-1 space-y-1 overflow-y-auto p-3">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                end={item.end}
                                onClick={() => setMobileMenuOpen(false)}
                                className={({ isActive }) =>
                                    `flex items-center gap-3.5 rounded-xl px-3.5 py-2.5 text-xs font-medium transition-all duration-200 ${isActive
                                        ? 'border border-[#D4AF37]/40 bg-[#151515] text-[#D4AF37] shadow-[0_0_12px_rgba(212,175,55,0.08)]'
                                        : 'text-[#A8A8A0] hover:bg-[#151515]/60 hover:text-[#F5F5F0]'
                                    }`
                                }
                            >
                                <Icon className="h-4 w-4 shrink-0" />
                                {(!sidebarCollapsed || mobileMenuOpen) && (
                                    <span className="whitespace-nowrap">{item.name}</span>
                                )}
                            </NavLink>
                        );
                    })}
                </nav>

                {/* Sidebar Footer: Real-time Status */}
                {(!sidebarCollapsed || mobileMenuOpen) && (
                    <div className="border-t border-[#29251B] p-3">
                        <div className="flex items-center gap-2 rounded-lg border border-[#29251B] bg-[#070707] px-3 py-2 text-[11px] text-[#10B981]">
                            <span className="relative flex h-2 w-2">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#10B981] opacity-75" />
                                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#10B981]" />
                            </span>
                            Deriv WS: Connected
                        </div>
                    </div>
                )}
            </aside>

            {/* Main Content Area */}
            <div className="flex flex-1 flex-col overflow-hidden">

                {/* Top Navigation Bar */}
                <header className="flex h-16 items-center justify-between border-b border-[#29251B] bg-[#0D0D0D] px-4 sm:px-6">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setMobileMenuOpen(true)}
                            className="rounded-lg border border-[#29251B] p-2 text-[#A8A8A0] hover:text-[#F5F5F0] lg:hidden"
                        >
                            <Menu className="h-5 w-5" />
                        </button>
                        <h1 className="text-sm font-semibold tracking-wide text-[#F5F5F0] sm:text-base">
                            TradersEdge
                        </h1>
                    </div>

                    {/* User Profile & Actions */}
                    <div className="flex items-center gap-3 sm:gap-4">
                        <button
                            aria-label="Notifications"
                            className="relative rounded-lg border border-[#29251B] p-2 text-[#A8A8A0] transition hover:border-[#D4AF37]/50 hover:text-[#F5F5F0]"
                        >
                            <Bell className="h-4 w-4" />
                            <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-[#D4AF37]" />
                        </button>

                        <div className="h-4 w-px bg-[#29251B]" />

                        {/* User Badge */}
                        <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full border border-[#D4AF37]/50 bg-[#151515] text-xs font-bold text-[#D4AF37]">
                                AV
                            </div>
                            <div className="hidden text-left sm:block">
                                <div className="text-xs font-semibold text-[#F5F5F0]">Alex Vance</div>
                                <div className="text-[10px] text-[#10B981]">Pro Trader</div>
                            </div>
                        </div>

                        {/* Logout Button */}
                        <button
                            onClick={handleLogout}
                            title="Log out"
                            className="inline-flex items-center gap-2 rounded-lg border border-[#29251B] bg-[#151515] px-3 py-1.5 text-xs font-medium text-[#A8A8A0] transition hover:border-red-500/50 hover:text-red-400"
                        >
                            <LogOut className="h-3.5 w-3.5" />
                            <span className="hidden sm:inline">Logout</span>
                        </button>
                    </div>
                </header>

                {/* Dashboard Main Outlet */}
                <main className="flex-1 overflow-y-auto bg-[#070707] p-4 sm:p-6 lg:p-8">
                    <Outlet />
                </main>
            </div>

        </div>
    );
}
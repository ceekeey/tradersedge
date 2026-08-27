import { Mail } from 'lucide-react';

// Custom inline SVG for the GitHub brand logo
function GithubIcon(props) {
    return (
        <svg
            {...props}
            viewBox="0 0 24 24"
            width="24"
            height="24"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
            <path d="M9 18c-4.51 2-5-2-7-2" />
        </svg>
    );
}

function SocialButton({ icon: Icon, label, onClick }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="flex w-full items-center justify-center gap-3 rounded-xl border border-[#29251B] bg-[#0D0D0D] px-4 py-3 text-sm font-medium text-[#F5F5F0] transition-colors duration-200 hover:border-[#D4AF37] hover:bg-[#111111]"
        >
            <Icon className="h-4 w-4 text-[#F5F5F0]" />
            <span>{label}</span>
        </button>
    );
}

export default function SocialAuthButtons({ onGoogleClick, onGithubClick }) {
    return (
        <div className="space-y-3">
            <SocialButton icon={Mail} label="Continue with Google" onClick={onGoogleClick} />
            <SocialButton icon={GithubIcon} label="Continue with GitHub" onClick={onGithubClick} />
        </div>
    );
}
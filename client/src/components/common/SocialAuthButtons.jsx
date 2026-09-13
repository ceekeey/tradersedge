import { Mail } from 'lucide-react';

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
        </div>
    );
}
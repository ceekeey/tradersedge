import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Volume2, Wind, HeartPulse, Brain, Compass } from 'lucide-react';

const EMOTIONAL_STATES = [
    { id: 'tilt', label: 'Tilt / Frustration', desc: 'Lower heart rate & clear adrenaline', duration: 10, sound: 'Binaural Theta (432Hz)' },
    { id: 'anxious', label: 'Anxiety / Fear', desc: 'Regulate breath & build confidence', duration: 5, sound: 'Soft Ambient Rain' },
    { id: 'greedy', label: 'Overconfident', desc: 'Ground focus & prevent over-trading', duration: 5, sound: 'Deep Alpha Waves' },
    { id: 'fatigue', label: 'Burnout / Fatigue', desc: 'Reset clarity before next execution', duration: 15, sound: 'Lo-Fi Calm Stream' },
];

export default function Sanctuary() {
    const [selectedState, setSelectedState] = useState(EMOTIONAL_STATES[0]);
    const [timeLeft, setTimeLeft] = useState(EMOTIONAL_STATES[0].duration * 60);
    const [isPlaying, setIsPlaying] = useState(false);
    const [breathText, setBreathText] = useState('Inhale...');

    // Timer Logic
    useEffect(() => {
        let timer = null;
        if (isPlaying && timeLeft > 0) {
            timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
        } else if (timeLeft === 0) {
            setIsPlaying(false);
        }
        return () => clearInterval(timer);
    }, [isPlaying, timeLeft]);

    // Simple Breathwork Rhythm Loop
    useEffect(() => {
        if (!isPlaying) return;
        const breathCycle = setInterval(() => {
            setBreathText((prev) => (prev === 'Inhale...' ? 'Hold...' : prev === 'Hold...' ? 'Exhale...' : 'Inhale...'));
        }, 4000);
        return () => clearInterval(breathCycle);
    }, [isPlaying]);

    const handleSelectState = (state) => {
        setSelectedState(state);
        setTimeLeft(state.duration * 60);
        setIsPlaying(false);
    };

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    return (
        <div className="flex min-h-[calc(100vh-6rem)] w-full flex-col gap-6 bg-[#070707] p-4 text-[#F5F5F0] lg:p-6">
            {/* Top Bar */}
            <div className="flex items-center justify-between rounded-2xl border border-[#29251B] bg-[#0D0D0D] p-5">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#D4AF37]/10 text-[#D4AF37]">
                        <Compass className="h-5 w-5" />
                    </div>
                    <div>
                        <h1 className="text-lg font-bold">Trader Sanctuary</h1>
                        <p className="text-xs text-[#A8A8A0]">Mental Reset & Stress Regulation</p>
                    </div>
                </div>
            </div>

            <div className="grid flex-1 grid-cols-1 gap-6 lg:grid-cols-12">
                {/* Left Column: State Selection */}
                <div className="flex flex-col gap-3 lg:col-span-5">
                    <span className="text-xs font-semibold text-[#A8A8A0]">Select Current Mindset</span>
                    {EMOTIONAL_STATES.map((state) => (
                        <div
                            key={state.id}
                            onClick={() => handleSelectState(state)}
                            className={`cursor-pointer rounded-2xl border p-4 transition ${selectedState.id === state.id
                                ? 'border-[#D4AF37] bg-[#151515]'
                                : 'border-[#29251B] bg-[#0D0D0D] hover:border-[#29251B]/80'
                                }`}
                        >
                            <div className="flex items-center justify-between">
                                <h3 className="text-sm font-bold text-[#F5F5F0]">{state.label}</h3>
                                <span className="rounded bg-[#D4AF37]/10 px-2 py-0.5 text-[10px] font-bold text-[#D4AF37]">
                                    {state.duration} MIN
                                </span>
                            </div>
                            <p className="mt-1 text-xs text-[#A8A8A0]">{state.desc}</p>
                            <div className="mt-3 flex items-center gap-2 text-[11px] text-[#6F6F68]">
                                <Volume2 className="h-3.5 w-3.5 text-[#D4AF37]" />
                                <span>{state.sound}</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Right Column: Audio Timer & Breathing Circle */}
                <div className="flex flex-col items-center justify-between rounded-2xl border border-[#29251B] bg-[#0D0D0D] p-8 lg:col-span-7">
                    {/* Breathwork Visualizer */}
                    <div className="my-auto flex flex-col items-center gap-6">
                        <div className="relative flex h-52 w-52 items-center justify-center">
                            {/* Pulsing Breathing Ring */}
                            <div
                                className={`absolute inset-0 rounded-full border-2 border-[#D4AF37]/30 transition-all duration-1000 ${isPlaying ? 'scale-110 bg-[#D4AF37]/5' : 'scale-100'
                                    }`}
                            />
                            <div className="flex flex-col items-center gap-1 text-center">
                                <Wind className="h-6 w-6 text-[#D4AF37]" />
                                <span className="font-mono text-3xl font-bold">{formatTime(timeLeft)}</span>
                                <span className="text-xs font-medium text-[#A8A8A0]">
                                    {isPlaying ? breathText : 'Press Play to Begin'}
                                </span>
                            </div>
                        </div>

                        {/* Affirmation Banner */}
                        <p className="max-w-md text-center text-xs italic text-[#A8A8A0]">
                            "One loss is just a statistical data point. Preserve your capital, maintain your edge."
                        </p>
                    </div>

                    {/* Controls */}
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => {
                                setTimeLeft(selectedState.duration * 60);
                                setIsPlaying(false);
                            }}
                            className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#29251B] bg-[#151515] text-[#A8A8A0] transition hover:text-[#F5F5F0]"
                        >
                            <RotateCcw className="h-5 w-5" />
                        </button>

                        <button
                            onClick={() => setIsPlaying(!isPlaying)}
                            className="flex h-12 gap-2 items-center justify-center rounded-xl bg-[#D4AF37] px-6 text-xs font-bold text-black transition hover:bg-[#b8952b]"
                        >
                            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                            {isPlaying ? 'PAUSE SESSION' : 'START SESSION'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
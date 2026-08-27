import React, { useState } from 'react';
import {
    BookOpen,
    Calendar,
    Folder,
    Plus,
    Search,
    Brain,
    Target,
    Trash2,
    Save,
    ExternalLink
} from 'lucide-react';

const CATEGORIES = [
    { id: 'prep', name: 'Weekly Market Prep', color: 'text-amber-400' },
    { id: 'playbook', name: 'Strategy Playbook', color: 'text-emerald-400' },
    { id: 'postmortem', name: 'Monthly Debriefs', color: 'text-sky-400' },
    { id: 'mindset', name: 'Psychology & Audit', color: 'text-purple-400' }
];

export default function Notes() {
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedPeriod, setSelectedPeriod] = useState('2026-08');
    const [searchQuery, setSearchQuery] = useState('');

    const [notes, setNotes] = useState([
        {
            id: 'note-1',
            title: 'August 2026 Week 34 Market Outlook & Levels',
            category: 'prep',
            period: '2026-08',
            date: '2026-08-23',
            tags: ['Volatility Index', 'Supply Zone'],
            linkedTrades: ['TRD-8092'],
            mindset: 'Focused / Objective',
            content: `Higher timeframe structure on Volatility 100 Index remains bullish. Key demand zone at 1240.00 - 1245.00.\n\nRule: Do not take buys if 15M candle closes below 1238.00 level.\n\nLinked trade: #TRD-8092 executed clean sweep off 15M demand.`
        }
    ]);

    const [activeNoteId, setActiveNoteId] = useState('note-1');
    const activeNote = notes.find((n) => n.id === activeNoteId) || notes[0];

    const handleContentChange = (e) => {
        const val = e.target.value;
        setNotes((prev) =>
            prev.map((n) => (n.id === activeNoteId ? { ...n, content: val } : n))
        );
    };

    const handleTitleChange = (e) => {
        const val = e.target.value;
        setNotes((prev) =>
            prev.map((n) => (n.id === activeNoteId ? { ...n, title: val } : n))
        );
    };

    const handleCreateNote = () => {
        const newNote = {
            id: `note-${Date.now()}`,
            title: 'Untitled Trading Note',
            category: selectedCategory === 'all' ? 'prep' : selectedCategory,
            period: '2026-08',
            date: new Date().toISOString().split('T')[0],
            tags: ['Draft'],
            linkedTrades: [],
            mindset: 'Neutral',
            content: ''
        };
        setNotes([newNote, ...notes]);
        setActiveNoteId(newNote.id);
    };

    const handleDeleteNote = (id) => {
        const filtered = notes.filter((n) => n.id !== id);
        setNotes(filtered);
        if (filtered.length > 0) setActiveNoteId(filtered[0].id);
    };

    const filteredNotes = notes.filter((n) => {
        const matchesCategory = selectedCategory === 'all' || n.category === selectedCategory;
        const matchesPeriod = selectedPeriod === 'all' || n.period === selectedPeriod;
        const matchesSearch = n.title.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesPeriod && matchesSearch;
    });

    return (
        <div className="flex h-[calc(100vh-5rem)] w-full overflow-hidden bg-[#070707] text-[#F5F5F0]">
            {/* Sidebar 1: Navigation */}
            <div className="flex w-64 flex-col border-r border-[#29251B] bg-[#0A0A0A] p-4 gap-6 shrink-0">
                <div className="space-y-3">
                    <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#D4AF37]">
                        <BookOpen className="h-4 w-4" /> Lab Journal
                    </span>
                    <button
                        onClick={handleCreateNote}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#D4AF37] px-4 py-2 text-xs font-bold text-black transition hover:bg-[#b8952b]"
                    >
                        <Plus className="h-4 w-4" /> New Journal Note
                    </button>
                </div>

                <div className="space-y-2">
                    <label className="flex items-center gap-1.5 text-[10px] font-semibold text-[#6F6F68] uppercase">
                        <Calendar className="h-3 w-3" /> Time Horizon
                    </label>
                    <select
                        value={selectedPeriod}
                        onChange={(e) => setSelectedPeriod(e.target.value)}
                        className="w-full rounded-xl border border-[#29251B] bg-[#151515] px-3 py-2 text-xs font-semibold text-[#F5F5F0] focus:border-[#D4AF37] focus:outline-none"
                    >
                        <option value="all">All Time History</option>
                        <option value="2026-08">August 2026</option>
                        <option value="2026-07">July 2026</option>
                    </select>
                </div>

                <div className="space-y-1">
                    <span className="text-[10px] font-semibold text-[#6F6F68] uppercase px-1">Notebook Sections</span>
                    <button
                        onClick={() => setSelectedCategory('all')}
                        className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-medium transition ${selectedCategory === 'all' ? 'bg-[#151515] text-[#F5F5F0] border border-[#29251B]' : 'text-[#A8A8A0] hover:bg-[#111111]'
                            }`}
                    >
                        <span className="flex items-center gap-2"><Folder className="h-3.5 w-3.5 text-[#D4AF37]" /> All Entries</span>
                        <span className="text-[10px] font-mono text-[#6F6F68]">{notes.length}</span>
                    </button>

                    {CATEGORIES.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setSelectedCategory(cat.id)}
                            className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-medium transition ${selectedCategory === cat.id ? 'bg-[#151515] text-[#F5F5F0] border border-[#29251B]' : 'text-[#A8A8A0] hover:bg-[#111111]'
                                }`}
                        >
                            <span className="flex items-center gap-2">
                                <Folder className={`h-3.5 w-3.5 ${cat.color}`} /> {cat.name}
                            </span>
                            <span className="text-[10px] font-mono text-[#6F6F68]">
                                {notes.filter(n => n.category === cat.id).length}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Sidebar 2: Note List */}
            <div className="flex w-72 flex-col border-r border-[#29251B] bg-[#0D0D0D] p-3 gap-3 shrink-0">
                <div className="relative">
                    <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-[#6F6F68]" />
                    <input
                        type="text"
                        placeholder="Search notes..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full rounded-xl border border-[#29251B] bg-[#151515] pl-9 pr-3 py-1.5 text-xs text-[#F5F5F0] placeholder-[#6F6F68] focus:border-[#D4AF37] focus:outline-none"
                    />
                </div>

                <div className="flex-1 space-y-2 overflow-y-auto">
                    {filteredNotes.map((note) => (
                        <div
                            key={note.id}
                            onClick={() => setActiveNoteId(note.id)}
                            className={`group cursor-pointer rounded-xl border p-3 transition ${activeNoteId === note.id
                                ? 'border-[#D4AF37] bg-[#151515]'
                                : 'border-[#29251B] bg-[#070707] hover:border-[#3E3A2E]'
                                }`}
                        >
                            <div className="flex items-center justify-between text-[10px] text-[#6F6F68]">
                                <span className="font-mono">{note.date}</span>
                                <button
                                    onClick={(e) => { e.stopPropagation(); handleDeleteNote(note.id); }}
                                    className="opacity-0 group-hover:opacity-100 hover:text-red-400"
                                >
                                    <Trash2 className="h-3 w-3" />
                                </button>
                            </div>
                            <h4 className="mt-1 line-clamp-1 text-xs font-bold text-[#F5F5F0]">{note.title}</h4>
                        </div>
                    ))}
                </div>
            </div>

            {/* Main Area: Editor */}
            {activeNote && (
                <div className="flex flex-1 flex-col overflow-hidden bg-[#070707]">
                    <div className="flex items-center justify-between border-b border-[#29251B] bg-[#0A0A0A] px-6 py-3">
                        <input
                            type="text"
                            value={activeNote.title}
                            onChange={handleTitleChange}
                            className="bg-transparent text-lg font-bold text-[#F5F5F0] focus:outline-none"
                            placeholder="Note Title..."
                        />
                        <div className="flex items-center gap-3">
                            <span className="flex items-center gap-1.5 rounded-full border border-[#29251B] bg-[#151515] px-3 py-1 text-xs text-[#A8A8A0]">
                                <Brain className="h-3.5 w-3.5 text-[#D4AF37]" /> {activeNote.mindset}
                            </span>
                            <button className="flex items-center gap-1 rounded-xl bg-[#151515] border border-[#29251B] px-3 py-1.5 text-xs font-semibold text-[#10B981]">
                                <Save className="h-3.5 w-3.5" /> Saved
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 p-6">
                        <textarea
                            value={activeNote.content}
                            onChange={handleContentChange}
                            placeholder="Write your market observations, rules, and notes here..."
                            className="h-full w-full resize-none bg-transparent font-mono text-xs text-[#F5F5F0] placeholder-[#6F6F68] focus:outline-none leading-relaxed"
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
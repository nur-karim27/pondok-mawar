import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useState } from 'react';
import { BrainCircuit, Send, Copy, Check, FileText, Calendar, MessageSquare, BookOpen, Loader2 } from 'lucide-react';
import axios from 'axios';

export default function AiAssistant({ history }: { history: any[] }) {
    const [feature, setFeature] = useState('surat');
    const [prompt, setPrompt] = useState('');
    const [style, setStyle] = useState('formal islami');
    const [isGenerating, setIsGenerating] = useState(false);
    const [result, setResult] = useState('');
    const [isDemo, setIsDemo] = useState(false);
    const [copied, setCopied] = useState(false);

    const features = [
        { id: 'surat', name: 'Surat Resmi', icon: FileText, desc: 'Draf surat undangan, edaran, keterangan' },
        { id: 'pengumuman', name: 'Pengumuman', icon: MessageSquare, desc: 'Pengumuman untuk santri & wali' },
        { id: 'agenda', name: 'Agenda', icon: Calendar, desc: 'Susunan acara & kegiatan pondok' },
        { id: 'ringkasan', name: 'Ringkasan', icon: BookOpen, desc: 'Rangkuman rapat atau kajian' },
    ];

    const generate = async () => {
        if (!prompt.trim()) return;
        
        setIsGenerating(true);
        setResult('');
        setCopied(false);
        
        try {
            const response = await axios.post('/api/ai/generate', {
                feature,
                prompt,
                style
            });
            
            setResult(response.data.result);
            setIsDemo(response.data.demo);
        } catch (error) {
            setResult('Maaf, terjadi kesalahan saat menghubungi AI. Silakan coba lagi nanti.');
        } finally {
            setIsGenerating(false);
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(result);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-bold leading-tight text-gray-800">AI Assistant PondokKita</h2>}
        >
            <Head title="AI Assistant" />

            <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-12rem)] min-h-[600px]">
                {/* Left Panel: Configuration */}
                <div className="w-full lg:w-1/3 bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col overflow-hidden">
                    <div className="p-6 border-b border-gray-50 bg-primary/5 flex items-center gap-3">
                        <BrainCircuit className="w-6 h-6 text-primary" />
                        <h3 className="font-bold text-gray-900">Konfigurasi AI</h3>
                    </div>
                    
                    <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-3">Tipe Konten</label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {features.map(f => (
                                    <button
                                        key={f.id}
                                        onClick={() => setFeature(f.id)}
                                        className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-200 ${
                                            feature === f.id 
                                            ? 'border-primary bg-primary/5 text-primary' 
                                            : 'border-gray-100 bg-white text-gray-500 hover:border-accent hover:bg-accent/10'
                                        }`}
                                    >
                                        <f.icon className="w-6 h-6 mb-2" />
                                        <span className="text-sm font-bold">{f.name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Gaya Bahasa</label>
                            <select 
                                value={style}
                                onChange={(e) => setStyle(e.target.value)}
                                className="w-full border-gray-200 rounded-xl shadow-sm focus:border-primary focus:ring focus:ring-primary/20 transition-all text-sm"
                            >
                                <option value="formal islami">Formal Islami (Santun, Resmi)</option>
                                <option value="santai sopan">Santai & Sopan (Lebih luwes)</option>
                                <option value="tegas">Tegas (Aturan/Tata Tertib)</option>
                                <option value="inspiratif">Inspiratif & Memotivasi</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Right Panel: Prompt & Result */}
                <div className="w-full lg:w-2/3 bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col overflow-hidden">
                    <div className="p-6 border-b border-gray-50 flex items-center justify-between">
                        <h3 className="font-bold text-gray-900">Area Kerja</h3>
                        {isDemo && (
                            <span className="px-3 py-1 bg-amber-100 text-amber-700 text-xs font-bold rounded-full">Mode Demo</span>
                        )}
                    </div>
                    
                    <div className="flex-1 p-6 flex flex-col gap-4 overflow-hidden relative">
                        {/* Result Area */}
                        <div className="flex-1 bg-gray-50 rounded-xl p-6 border border-gray-100 overflow-y-auto custom-scrollbar relative">
                            {!result && !isGenerating ? (
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
                                    <BrainCircuit className="w-16 h-16 mb-4 opacity-20" />
                                    <p className="font-medium text-center max-w-md">Silakan ketikkan instruksi Anda di bawah untuk mulai membuat dokumen dengan AI.</p>
                                </div>
                            ) : isGenerating ? (
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-primary">
                                    <Loader2 className="w-10 h-10 animate-spin mb-4" />
                                    <p className="font-medium animate-pulse">Menghasilkan teks...</p>
                                </div>
                            ) : (
                                <div className="h-full flex flex-col">
                                    <div className="flex justify-end mb-4 shrink-0">
                                        <button 
                                            onClick={copyToClipboard}
                                            className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:text-primary hover:bg-gray-50 transition-colors"
                                        >
                                            {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                                            {copied ? 'Tersalin' : 'Salin Teks'}
                                        </button>
                                    </div>
                                    <div className="prose prose-sm md:prose-base max-w-none flex-1 font-sans text-gray-800 whitespace-pre-wrap">
                                        {result}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Input Area */}
                        <div className="shrink-0 relative">
                            <textarea 
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                placeholder="Contoh: Buatkan surat undangan pertemuan wali santri kelas 1 untuk membahas ujian akhir..."
                                className="w-full resize-none border-gray-200 rounded-2xl shadow-sm focus:border-primary focus:ring focus:ring-primary/20 transition-all p-4 pr-16 min-h-[100px] text-sm md:text-base"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                                        generate();
                                    }
                                }}
                            ></textarea>
                            <button 
                                onClick={generate}
                                disabled={isGenerating || !prompt.trim()}
                                className="absolute right-3 bottom-3 p-3 bg-primary text-accent hover:bg-primary-light disabled:bg-gray-200 disabled:text-gray-400 rounded-xl transition-colors shadow-md"
                            >
                                {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                            </button>
                        </div>
                        <p className="text-xs text-center text-gray-400">Tekan Ctrl + Enter untuk mengirim</p>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

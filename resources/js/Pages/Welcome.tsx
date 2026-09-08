import { Head, Link } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';
import {
    BookOpen, Users, Code, Globe, ScrollText,
    ChevronRight, Star, TrendingUp, ShieldCheck,
    GraduationCap, ArrowRight, Calendar, Network,
    Newspaper, Award, MapPin, Clock, Zap, ExternalLink
} from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';

const GREEN = '#0C3527';

interface Pesantren {
    name: string; short_name: string; address: string;
    phone: string; email: string; vision: string; mission: string;
}
interface Props {
    canLogin: boolean;
    pesantren: Pesantren | null;
    informasi?: { id: number; title: string; body: string; published_at: string | null; created_at: string }[];
    kegiatan_alumni?: { id: number; title: string; activity_date: string; location: string; status: string; cover_image: string | null }[];
}

// ========== Slideshow Pengasuh ==========
const PENGASUH_PHOTOS = [
    { src: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?q=80&w=600&auto=format&fit=crop', name: 'KH. Ahmad Mawar',       jabatan: 'Pengasuh Pondok' },
    { src: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600&auto=format&fit=crop', name: 'KH. Muhammad Hasan',    jabatan: 'Wakil Pengasuh' },
    { src: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=600&auto=format&fit=crop', name: 'Ustadz Ali Ridho',       jabatan: 'Musyrif Pondok' },
    { src: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=600&auto=format&fit=crop', name: 'Ustadz Fahmi Abdillah',  jabatan: 'Koordinator Tahfidz' },
    { src: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=600&auto=format&fit=crop', name: 'Ustadz Rizky Maulana',   jabatan: 'Kepala Akademik' },
];

// Desktop: full portrait slideshow
function PengasuhSlideshow() {
    const [current, setCurrent] = useState(0);
    useEffect(() => {
        const t = setInterval(() => setCurrent(c => (c + 1) % PENGASUH_PHOTOS.length), 10000);
        return () => clearInterval(t);
    }, []);
    return (
        <div className="relative w-72 rounded-2xl overflow-hidden shadow-2xl border border-white/20">
            <div className="relative w-full" style={{ aspectRatio: '3/4' }}>
                {PENGASUH_PHOTOS.map((p, i) => (
                    <motion.div key={i} initial={false} animate={{ opacity: current === i ? 1 : 0 }} transition={{ duration: 0.8 }} className="absolute inset-0">
                        <img src={p.src} alt={p.name} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                    </motion.div>
                ))}
                <div className="absolute bottom-0 left-0 right-0 p-5 z-10">
                    <motion.div key={current} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                        <p className="text-white font-bold text-lg drop-shadow">{PENGASUH_PHOTOS[current].name}</p>
                        <p className="text-emerald-300 text-sm font-semibold drop-shadow">{PENGASUH_PHOTOS[current].jabatan}</p>
                    </motion.div>
                    <div className="flex gap-2 mt-3">
                        {PENGASUH_PHOTOS.map((_, i) => (
                            <button key={i} onClick={() => setCurrent(i)}
                                className={`transition-all duration-300 rounded-full ${current === i ? 'w-6 h-2 bg-emerald-400' : 'w-2 h-2 bg-white/40'}`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

// Mobile: compact staggered avatar row
function PengasuhAvatarRow() {
    const [active, setActive] = useState(0);
    useEffect(() => {
        const t = setInterval(() => setActive(c => (c + 1) % PENGASUH_PHOTOS.length), 4000);
        return () => clearInterval(t);
    }, []);
    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mt-16"
        >
            {/* Avatar row — Menggunakan margin negatif asli agar flexbox bisa otomatis menghitung titik tengah dengan sempurna */}
            <div className="flex items-center justify-center">
                {PENGASUH_PHOTOS.map((p, i) => (
                    <motion.button
                        key={i}
                        onClick={() => setActive(i)}
                        animate={{
                            scale: active === i ? 1.08 : 0.88,
                            zIndex: active === i ? 10 : 5 - i,
                        }}
                        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                        className="relative rounded-full border-[3px] overflow-hidden flex-shrink-0"
                        style={{
                            marginLeft: i === 0 ? 0 : -20,
                            width: active === i ? 96 : 76,
                            height: active === i ? 96 : 76,
                            borderColor: active === i ? '#34d399' : 'rgba(255,255,255,0.35)',
                            boxShadow: active === i ? '0 0 0 4px rgba(52,211,153,0.25)' : 'none',
                        }}
                    >
                        <img src={p.src} alt={p.name} className="w-full h-full object-cover" />
                    </motion.button>
                ))}
            </div>

            {/* Name info — ditaruh di bawah foto agar tidak kepotong */}
            <div className="text-center mt-5">
                <motion.div key={active} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                    <p className="text-white font-bold text-base leading-tight">{PENGASUH_PHOTOS[active].name}</p>
                    <p className="text-emerald-400 text-sm font-semibold mt-1">{PENGASUH_PHOTOS[active].jabatan}</p>
                </motion.div>
            </div>

            {/* Dot indicators */}
            <div className="flex justify-center gap-2 mt-4">
                {PENGASUH_PHOTOS.map((_, i) => (
                    <button key={i} onClick={() => setActive(i)}
                        className={`transition-all duration-300 rounded-full ${
                            active === i ? 'w-6 h-2 bg-emerald-400' : 'w-2 h-2 bg-white/30'
                        }`}
                    />
                ))}
            </div>
        </motion.div>
    );
}

// ========== Santri Photos — real pesantren-like images ==========
const SANTRI_PHOTOS = [
    { src: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=800&auto=format&fit=crop', caption: 'Kegiatan Belajar', sub: 'Suasana pembelajaran aktif' },
    { src: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=800&auto=format&fit=crop', caption: 'Tadarus Al-Quran', sub: 'Tilawah dan menghafal' },
    { src: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=800&auto=format&fit=crop', caption: 'Kebersamaan', sub: 'Ukhuwah islamiyah' },
    { src: 'https://images.unsplash.com/photo-1571260899304-425eee4c7efc?q=80&w=800&auto=format&fit=crop', caption: 'Prestasi Santri', sub: 'Pencapaian gemilang' },
];

// ========== Programs ==========
const programs = [
    {
        title: "Tahfidzul Qur'an", tag: 'Unggulan',
        photo: 'https://images.unsplash.com/photo-1585036156171-384164a8c675?q=80&w=900&auto=format&fit=crop',
        desc: "Hafalan Al-Qur'an 30 juz bersanad dengan metode mutqin didampingi muhaffizh tersertifikasi.",
        icon: BookOpen,
        accentColor: '#059669', accentBg: '#ECFDF5', accentBorder: '#6EE7B7',
        tagBg: 'bg-emerald-600', stats: '30 Juz',
    },
    {
        title: 'Kajian Kitab Kuning', tag: null,
        photo: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=900&auto=format&fit=crop',
        desc: 'Pengkajian mendalam turats klasik Ahlussunnah Wal Jamaah meliputi fiqih, tafsir, dan hadits.',
        icon: ScrollText,
        accentColor: '#D97706', accentBg: '#FFFBEB', accentBorder: '#FCD34D',
        tagBg: 'bg-amber-500', stats: '50+ Kitab',
    },
    {
        title: 'Bahasa Asing', tag: null,
        photo: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=900&auto=format&fit=crop',
        desc: 'Pembiasaan percakapan Bahasa Arab dan Inggris intensif dalam seluruh aktivitas keseharian santri.',
        icon: Globe,
        accentColor: '#2563EB', accentBg: '#EFF6FF', accentBorder: '#93C5FD',
        tagBg: 'bg-blue-600', stats: '2 Bahasa',
    },
    {
        title: 'IT & Multimedia', tag: 'Baru',
        photo: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?q=80&w=900&auto=format&fit=crop',
        desc: 'Membekali santri dengan keahlian teknologi informasi, coding, dan dakwah digital abad 21.',
        icon: Code,
        accentColor: '#7C3AED', accentBg: '#F5F3FF', accentBorder: '#C4B5FD',
        tagBg: 'bg-violet-600', stats: 'Digital',
    },
];

// ========== Warta photos ==========
const WARTA_PHOTOS = [
    'https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?auto=format&fit=crop&q=80&w=900',
    'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&q=80&w=900',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=900',
];

// ========== Animated Counter ==========
function AnimatedCounter({ target, suffix = '' }: { target: number; suffix?: string }) {
    const [count, setCount] = useState(0);
    const ref = useRef<HTMLSpanElement>(null);
    const [started, setStarted] = useState(false);
    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting && !started) {
                setStarted(true);
                let start = 0;
                const step = Math.ceil(target / 60);
                const timer = setInterval(() => {
                    start += step;
                    if (start >= target) { setCount(target); clearInterval(timer); }
                    else setCount(start);
                }, 20);
            }
        }, { threshold: 0.5 });
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, [target, started]);
    return <span ref={ref}>{count.toLocaleString('id-ID')}{suffix}</span>;
}

export default function Welcome({ canLogin, pesantren, informasi = [], kegiatan_alumni = [] }: Props) {
    const { scrollY } = useScroll();
    const yBg   = useTransform(scrollY, [0, 800], [0, 200]);
    const scale = useTransform(scrollY, [0, 600], [1, 1.06]);

    const displayNews = informasi.length > 0
        ? informasi.slice(0, 3).map((a, i) => ({
            title: a.title,
            date: new Date(a.published_at || a.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
            photo: WARTA_PHOTOS[i % WARTA_PHOTOS.length],
            body: (a.body?.slice(0, 140) || '') + '...',
        }))
        : [
            { title: 'Pendaftaran Santri Baru Tahun Ajaran 2026/2027 Resmi Dibuka', date: '01 Agustus 2026', photo: WARTA_PHOTOS[0], body: "Pondok Pesantren Mamba'ul Anwar mengumumkan pembukaan pendaftaran santri baru untuk tahun ajaran 2026/2027. Daftarkan putra-putri Anda sekarang." },
            { title: 'Delegasi Santri Raih Juara MTQ Nasional Tingkat Provinsi',    date: '28 Juli 2026',   photo: WARTA_PHOTOS[1], body: 'Santri-santri terbaik Pondok Pesantren Mamba\'ul Anwar kembali mengharumkan nama pesantren di ajang MTQ Nasional Tingkat Provinsi.' },
            { title: "Kunjungan Ulama Internasional ke Ponpes Mawar",               date: '15 Juli 2026',   photo: WARTA_PHOTOS[2], body: "Pesantren Mamba'ul Anwar menerima kunjungan kehormatan dari beberapa ulama internasional dari Timur Tengah dan Asia Selatan." },
        ];

    return (
        <GuestLayout pesantren={pesantren ?? undefined} canLogin={canLogin} activeNav="beranda">
            <Head title={`Selamat Datang — ${pesantren?.name || 'Ponpes Mawar'}`} />

            {/* =====================================================================
                HERO
            ===================================================================== */}
            {/*
             * MOBILE:  flex-col, konten rapat atas (pt-20 = bawah navbar),
             *          bukan di tengah layar
             * DESKTOP: min-h-screen + flex items-center = konten di tengah layar
             */}
            <section className="relative overflow-hidden min-h-screen">
                <motion.div style={{ y: yBg, scale }} className="absolute inset-0 w-full h-full">
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1585036156171-384164a8c675?q=80&w=2400&auto=format&fit=crop')] bg-cover bg-center" />
                    <div className="absolute inset-0 bg-gradient-to-b from-[#0C3527]/85 via-[#0C3527]/65 to-[#0C3527]/92" />
                </motion.div>
                <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-emerald-400/8 rounded-full blur-[120px] pointer-events-none" />

                {/* MOBILE layout: top-aligned */}
                <div className="lg:hidden relative z-10 max-w-7xl mx-auto px-5 pt-20 pb-10 w-full">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
                        className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/15 backdrop-blur-xl border border-white/20 mb-5"
                    >
                        <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-white/90 text-sm font-semibold tracking-wide">Penerimaan Santri Baru Telah Dibuka</span>
                    </motion.div>

                    <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.7 }}
                        className="text-4xl font-black text-white leading-[1.05] tracking-tight mb-4"
                    >
                        Membentuk<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-teal-300 to-cyan-300">Generasi</span>{' '}
                        <span className="text-white">Qur'ani</span>
                    </motion.h1>

                    <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.6 }}
                        className="text-sm text-white/75 mb-0 leading-relaxed"
                    >
                        Selamat datang di portal resmi{' '}
                        <span className="text-white font-semibold">{pesantren?.name || "Pondok Pesantren Mamba'ul Anwar"}</span>.
                        Mengintegrasikan tradisi keilmuan salaf dengan kecakapan modern.
                    </motion.p>

                    <PengasuhAvatarRow />
                </div>

                {/* DESKTOP layout: perfectly centered */}
                <div className="hidden lg:flex min-h-screen items-center justify-center relative z-10 w-full pt-16">
                    <div className="max-w-7xl mx-auto px-8 w-full">
                        <div className="grid grid-cols-2 gap-12 items-center w-full">
                            <div>
                                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
                                    className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/15 backdrop-blur-xl border border-white/20 mb-6"
                                >
                                    <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                                    <span className="text-white/90 text-sm font-semibold tracking-wide">Penerimaan Santri Baru Telah Dibuka</span>
                                </motion.div>

                                <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.7 }}
                                    className="text-5xl xl:text-7xl font-black text-white leading-[1.05] tracking-tight mb-5"
                                >
                                    Membentuk<br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-teal-300 to-cyan-300">Generasi</span>{' '}
                                    <span className="text-white">Qur'ani</span>
                                </motion.h1>

                                <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.6 }}
                                    className="text-lg text-white/75 mb-6 max-w-lg leading-relaxed font-light"
                                >
                                    Selamat datang di portal resmi{' '}
                                    <span className="text-white font-semibold">{pesantren?.name || "Pondok Pesantren Mamba'ul Anwar"}</span>.
                                    Mengintegrasikan tradisi keilmuan salaf dengan kecakapan modern.
                                </motion.p>

                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="flex flex-col items-start gap-2 mt-10">
                                    <span className="text-white/40 text-xs font-bold tracking-[0.3em] uppercase">Scroll untuk Menjelajahi</span>
                                    <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.5, repeat: Infinity }}
                                        className="w-px h-8 bg-gradient-to-b from-white/40 to-transparent"
                                    />
                                </motion.div>
                            </div>

                            {/* Portrait slideshow — desktop only */}
                            <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2, duration: 0.8 }}
                                className="flex justify-end"
                            >
                                <PengasuhSlideshow />
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>

            {/* =====================================================================
                POTRET KEHIDUPAN — White bg, masonry-like grid with large proper images
            ===================================================================== */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-5 lg:px-8">
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border mb-4" style={{ backgroundColor: '#ECFDF5', borderColor: '#6EE7B7', color: GREEN }}>
                            <Users className="w-3.5 h-3.5" />
                            <span className="text-xs font-bold tracking-widest uppercase">Kehidupan Santri</span>
                        </div>
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 mb-3">
                            Potret Kehidupan di <span style={{ color: GREEN }}>Pondok</span>
                        </h2>
                        <p className="text-gray-500 max-w-xl mx-auto">Satu pondok, satu keluarga — tumbuh bersama dalam ilmu dan ukhuwah</p>
                    </motion.div>

                    {/* Desktop: masonry-like 2-row grid. Mobile: horizontal scroll */}
                    <div className="hidden md:grid grid-cols-4 grid-rows-2 gap-4 h-[480px]">
                        {/* Large left photo */}
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
                            whileHover={{ scale: 1.01 }}
                            className="col-span-2 row-span-2 relative rounded-3xl overflow-hidden group shadow-xl"
                        >
                            <img src={SANTRI_PHOTOS[0].src} alt={SANTRI_PHOTOS[0].caption} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />
                            <div className="absolute bottom-0 left-0 right-0 p-6">
                                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-sm border border-white/20 mb-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                                    <span className="text-white text-xs font-bold">{SANTRI_PHOTOS[0].caption}</span>
                                </div>
                                <p className="text-white/70 text-sm">{SANTRI_PHOTOS[0].sub}</p>
                            </div>
                        </motion.div>

                        {/* Top right */}
                        <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
                            whileHover={{ scale: 1.02 }}
                            className="col-span-2 relative rounded-3xl overflow-hidden group shadow-lg"
                        >
                            <img src={SANTRI_PHOTOS[1].src} alt={SANTRI_PHOTOS[1].caption} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                            <div className="absolute bottom-4 left-4">
                                <p className="text-white font-bold text-sm">{SANTRI_PHOTOS[1].caption}</p>
                                <p className="text-white/60 text-xs">{SANTRI_PHOTOS[1].sub}</p>
                            </div>
                        </motion.div>

                        {/* Bottom right: split into 2 */}
                        <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
                            whileHover={{ scale: 1.02 }}
                            className="relative rounded-3xl overflow-hidden group shadow-lg"
                        >
                            <img src={SANTRI_PHOTOS[2].src} alt={SANTRI_PHOTOS[2].caption} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                            <div className="absolute bottom-4 left-4">
                                <p className="text-white font-bold text-sm">{SANTRI_PHOTOS[2].caption}</p>
                            </div>
                        </motion.div>
                        <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }}
                            whileHover={{ scale: 1.02 }}
                            className="relative rounded-3xl overflow-hidden group shadow-lg"
                        >
                            <img src={SANTRI_PHOTOS[3].src} alt={SANTRI_PHOTOS[3].caption} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                            <div className="absolute bottom-4 left-4">
                                <p className="text-white font-bold text-sm">{SANTRI_PHOTOS[3].caption}</p>
                            </div>
                        </motion.div>
                    </div>

                    {/* Mobile: horizontal scroll */}
                    <div className="md:hidden flex gap-4 overflow-x-auto pb-3 snap-x snap-mandatory -mx-5 px-5" style={{ scrollbarWidth: 'none' }}>
                        {SANTRI_PHOTOS.map((photo, i) => (
                            <div key={i} className="flex-shrink-0 snap-start relative rounded-2xl overflow-hidden shadow-lg" style={{ width: '75vw', height: '220px' }}>
                                <img src={photo.src} alt={photo.caption} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                                <div className="absolute bottom-4 left-4">
                                    <p className="text-white font-bold text-sm">{photo.caption}</p>
                                    <p className="text-white/60 text-xs">{photo.sub}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <p className="md:hidden text-center text-gray-400 text-xs mt-3">← Geser untuk melihat semua →</p>
                </div>
            </section>

            {/* =====================================================================
                ABOUT SNIPPET — White bg
            ===================================================================== */}
            <section className="py-20 lg:py-24 relative overflow-hidden" style={{ backgroundColor: '#F8FAF9' }}>
                <div className="max-w-7xl mx-auto px-5 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                        <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border mb-6" style={{ backgroundColor: '#ECFDF5', borderColor: '#6EE7B7', color: GREEN }}>
                                <Star className="w-3.5 h-3.5" />
                                <span className="text-xs font-bold tracking-widest uppercase">Tentang Kami</span>
                            </div>
                            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 leading-tight mb-6">
                                Pusat Keunggulan <br />
                                <span style={{ color: GREEN }}>Ilmu & Akhlak</span>
                            </h2>
                            <p className="text-gray-600 text-base lg:text-lg leading-relaxed mb-8">
                                Didirikan dengan dedikasi penuh membina umat, kami terus beradaptasi dengan perkembangan zaman tanpa kehilangan ruh spiritualitas dan tradisi keilmuan pesantren yang telah teruji.
                            </p>
                            <div className="grid grid-cols-2 gap-3 mb-8">
                                {[
                                    { icon: ShieldCheck,    label: 'Berakhlak Mulia',   bg: '#ECFDF5', border: '#A7F3D0', color: '#065F46' },
                                    { icon: GraduationCap, label: 'Intelektual Unggul', bg: '#EFF6FF', border: '#93C5FD', color: '#1E40AF' },
                                    { icon: Globe,         label: 'Wawasan Global',     bg: '#F5F3FF', border: '#C4B5FD', color: '#5B21B6' },
                                    { icon: TrendingUp,    label: 'Adaptif & Inovatif', bg: '#FFF7ED', border: '#FCD34D', color: '#92400E' },
                                ].map((f, i) => (
                                    <div key={i} className="flex items-center gap-3 p-3.5 rounded-2xl border" style={{ background: f.bg, borderColor: f.border }}>
                                        <f.icon className="w-4 h-4 shrink-0" style={{ color: f.color }} />
                                        <span className="text-sm font-bold" style={{ color: f.color }}>{f.label}</span>
                                    </div>
                                ))}
                            </div>
                            <Link href="/tentang-kami"
                                className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-2xl text-white font-bold transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 group"
                                style={{ backgroundColor: GREEN }}
                            >
                                Selengkapnya <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </motion.div>

                        <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="relative">
                            <div className="relative rounded-3xl overflow-hidden aspect-[4/5] shadow-2xl">
                                <img src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=1000&auto=format&fit=crop" alt="Pesantren" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                                <div className="absolute bottom-6 left-6 right-6 bg-white/96 backdrop-blur border border-white rounded-2xl p-4 shadow-xl">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#ECFDF5' }}>
                                            <Star className="w-5 h-5" style={{ color: GREEN }} />
                                        </div>
                                        <div>
                                            <p className="text-gray-900 font-bold text-sm">Akreditasi Terbaik</p>
                                            <p className="text-gray-500 text-xs">Lembaga Pendidikan Islam Unggulan</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* =====================================================================
                AKADEMIK — White background, premium card design with large photo tops
            ===================================================================== */}
            <section id="program" className="py-20 lg:py-28 bg-white relative overflow-hidden">
                {/* Subtle top border accent */}
                <div className="absolute top-0 left-0 right-0 h-1" style={{ background: `linear-gradient(90deg, transparent, ${GREEN}, transparent)` }} />

                {/* Background decorative blob */}
                <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full opacity-[0.03] blur-[80px] pointer-events-none" style={{ background: GREEN }} />

                <div className="max-w-7xl mx-auto px-5 lg:px-8 relative z-10">
                    {/* Header */}
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                        className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-14"
                    >
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border mb-5" style={{ backgroundColor: '#ECFDF5', borderColor: '#6EE7B7', color: GREEN }}>
                                <BookOpen className="w-3.5 h-3.5" />
                                <span className="text-xs font-bold tracking-widest uppercase">Program Akademik</span>
                                <motion.span animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.5, repeat: Infinity }} className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            </div>
                            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 leading-tight">
                                Program <span style={{ color: GREEN }}>Unggulan</span>
                            </h2>
                            <p className="text-gray-500 text-lg mt-3 max-w-xl">Kurikulum terintegrasi memadukan tradisi salaf dengan kecakapan abad 21</p>
                        </div>
                        <Link href="/akademik"
                            className="shrink-0 self-start lg:self-auto inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl font-bold text-white hover:shadow-lg hover:-translate-y-0.5 transition-all group text-sm"
                            style={{ backgroundColor: GREEN }}
                        >
                            Lihat Semua Program <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </motion.div>

                    {/* Stats row */}
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                        className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-14"
                    >
                        {[
                            { num: 500, suffix: '+', label: 'Santri Aktif', icon: Users, color: GREEN, bg: '#ECFDF5' },
                            { num: 30, suffix: ' Juz', label: 'Target Hafalan', icon: BookOpen, color: '#D97706', bg: '#FFFBEB' },
                            { num: 15, suffix: '+', label: 'Tahun Berdiri', icon: Award, color: '#7C3AED', bg: '#F5F3FF' },
                            { num: 98, suffix: '%', label: 'Tingkat Kelulusan', icon: TrendingUp, color: '#0369A1', bg: '#F0F9FF' },
                        ].map((stat, i) => (
                            <motion.div key={i}
                                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                                className="rounded-2xl border p-5 text-center hover:shadow-lg transition-all"
                                style={{ background: stat.bg, borderColor: stat.bg }}
                            >
                                <stat.icon className="w-5 h-5 mx-auto mb-2" style={{ color: stat.color }} />
                                <p className="text-3xl font-black" style={{ color: stat.color }}>
                                    <AnimatedCounter target={stat.num} suffix={stat.suffix} />
                                </p>
                                <p className="text-gray-500 text-xs font-semibold mt-1">{stat.label}</p>
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* Program Cards — desktop 4-col grid, mobile horizontal scroll */}
                    <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {programs.map((prog, idx) => (
                            <motion.div key={idx}
                                initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                                transition={{ delay: idx * 0.12, duration: 0.5 }}
                                whileHover={{ y: -8, boxShadow: '0 25px 50px rgba(0,0,0,0.12)' }}
                                className="group bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-md transition-all duration-300"
                            >
                                {/* Photo — full width aspect-[4/3] */}
                                <div className="relative overflow-hidden" style={{ aspectRatio: '4/3' }}>
                                    <img src={prog.photo} alt={prog.title}
                                        className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700"
                                        style={{ objectPosition: 'center' }}
                                        loading="lazy"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                                    {/* Tag badge */}
                                    {prog.tag && (
                                        <div className={`absolute top-3 right-3 ${prog.tagBg} text-white px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-md`}>
                                            {prog.tag === 'Unggulan' ? '⭐ ' : '🆕 '}{prog.tag}
                                        </div>
                                    )}
                                    {/* Icon floating */}
                                    <div className="absolute bottom-3 left-3 w-9 h-9 rounded-xl flex items-center justify-center shadow-lg"
                                        style={{ backgroundColor: prog.accentColor }}
                                    >
                                        <prog.icon className="w-4 h-4 text-white" />
                                    </div>
                                    {/* Stats chip */}
                                    <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-lg text-xs font-black text-white bg-black/50 backdrop-blur-sm">
                                        {prog.stats}
                                    </div>
                                </div>
                                {/* Content */}
                                <div className="p-5">
                                    <h3 className="font-black text-gray-900 text-base mb-2 group-hover:transition-colors" style={{ ['--hover-color' as string]: prog.accentColor }}>
                                        {prog.title}
                                    </h3>
                                    <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-2">{prog.desc}</p>
                                    <Link href="/akademik"
                                        className="inline-flex items-center gap-1.5 text-xs font-bold transition-all group-hover:gap-2"
                                        style={{ color: prog.accentColor }}
                                    >
                                        Selengkapnya <ChevronRight className="w-3.5 h-3.5" />
                                    </Link>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Mobile scroll */}
                    <div className="sm:hidden flex gap-4 overflow-x-auto pb-3 snap-x snap-mandatory -mx-5 px-5" style={{ scrollbarWidth: 'none' }}>
                        {programs.map((prog, idx) => (
                            <div key={idx} className="flex-shrink-0 snap-start bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-md" style={{ minWidth: '72vw' }}>
                                <div className="relative overflow-hidden h-40">
                                    <img src={prog.photo} alt={prog.title} className="w-full h-full object-cover" loading="lazy" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                                    {prog.tag && (
                                        <div className={`absolute top-3 right-3 ${prog.tagBg} text-white px-2 py-0.5 rounded-md text-[9px] font-black uppercase`}>{prog.tag}</div>
                                    )}
                                    <div className="absolute bottom-3 left-3 w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: prog.accentColor }}>
                                        <prog.icon className="w-4 h-4 text-white" />
                                    </div>
                                </div>
                                <div className="p-4">
                                    <h3 className="font-black text-gray-900 text-sm mb-1.5">{prog.title}</h3>
                                    <p className="text-gray-500 text-xs leading-relaxed line-clamp-2 mb-3">{prog.desc}</p>
                                    <Link href="/akademik" className="text-xs font-bold flex items-center gap-1" style={{ color: prog.accentColor }}>
                                        Selengkapnya <ChevronRight className="w-3.5 h-3.5" />
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                    <p className="sm:hidden text-center text-gray-400 text-xs mt-3">← Geser untuk melihat semua →</p>
                </div>
            </section>

            {/* =====================================================================
                IKSAMA / ALUMNI — Very light warm off-white, cards with big photos
            ===================================================================== */}
            {kegiatan_alumni.length > 0 && (
                <section className="py-20 lg:py-28 relative overflow-hidden" style={{ backgroundColor: '#FAFAF8' }}>
                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-200 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-100 to-transparent" />

                    {/* Decorative circle */}
                    <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full opacity-[0.06] blur-[60px]" style={{ backgroundColor: '#F59E0B' }} />

                    <div className="max-w-7xl mx-auto px-5 lg:px-8 relative z-10">
                        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-14">
                            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                                <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full border mb-5" style={{ backgroundColor: '#FFF7ED', borderColor: '#FCD34D', color: '#92400E' }}>
                                    <motion.div animate={{ rotate: [0, 360] }} transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}>
                                        <Network className="w-3.5 h-3.5" />
                                    </motion.div>
                                    <span className="text-xs font-bold tracking-widest uppercase">IKSAMA</span>
                                    <span className="px-2 py-0.5 rounded-full bg-amber-100 border border-amber-200 text-[9px] font-black uppercase text-amber-700">Alumni</span>
                                </div>
                                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900">
                                    Kegiatan <span style={{ color: '#D97706' }}>Alumni</span>
                                </h2>
                                <p className="text-gray-500 text-lg mt-3">Merajut ukhuwah dan berkontribusi untuk umat</p>
                            </motion.div>
                            <Link href="/alumni"
                                className="shrink-0 self-start lg:self-auto inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl font-bold border-2 text-sm hover:shadow-md transition-all group"
                                style={{ borderColor: '#D97706', color: '#D97706' }}
                            >
                                Lihat Semua <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>

                        {/* Desktop: 4-col grid */}
                        <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {kegiatan_alumni.map((k, idx) => (
                                <motion.div key={idx}
                                    initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                                    transition={{ delay: idx * 0.1 }}
                                    whileHover={{ y: -6, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
                                    className="group bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm transition-all duration-300"
                                >
                                    {/* Photo */}
                                    <div className="relative overflow-hidden" style={{ aspectRatio: '4/3' }}>
                                        {k.cover_image
                                            ? <img src={`/storage/${k.cover_image}`} alt={k.title} className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700" />
                                            : (
                                                <div className="w-full h-full flex flex-col items-center justify-center" style={{ background: 'linear-gradient(135deg, #FFF7ED, #FEFCE8)' }}>
                                                    <Network className="w-12 h-12 mb-2" style={{ color: '#FCD34D' }} />
                                                    <p className="text-amber-300 text-xs font-bold">IKSAMA</p>
                                                </div>
                                            )
                                        }
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
                                        {k.status && (
                                            <div className="absolute top-3 left-3 px-2.5 py-0.5 rounded-lg bg-amber-500 text-white text-[9px] font-black uppercase shadow-sm">
                                                {k.status}
                                            </div>
                                        )}
                                        <div className="absolute bottom-3 left-3 right-3 flex items-center gap-1.5 text-white text-xs font-bold">
                                            <Calendar className="w-3.5 h-3.5 shrink-0 text-amber-300" />
                                            {new Date(k.activity_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                        </div>
                                    </div>
                                    <div className="p-5">
                                        <h4 className="font-bold text-gray-900 text-sm leading-snug line-clamp-2 group-hover:text-amber-700 transition-colors mb-2">{k.title}</h4>
                                        {k.location && (
                                            <p className="text-gray-400 text-xs flex items-center gap-1">
                                                <MapPin className="w-3 h-3 text-amber-400" />{k.location}
                                            </p>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Mobile scroll */}
                        <div className="sm:hidden flex gap-4 overflow-x-auto pb-3 snap-x snap-mandatory -mx-5 px-5" style={{ scrollbarWidth: 'none' }}>
                            {kegiatan_alumni.map((k, idx) => (
                                <div key={idx} className="flex-shrink-0 snap-start bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm" style={{ minWidth: '72vw' }}>
                                    <div className="relative h-40 overflow-hidden">
                                        {k.cover_image
                                            ? <img src={`/storage/${k.cover_image}`} alt={k.title} className="w-full h-full object-cover" />
                                            : <div className="w-full h-full flex items-center justify-center" style={{ background: '#FFF7ED' }}><Network className="w-10 h-10 text-amber-200" /></div>
                                        }
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                        {k.status && <div className="absolute top-3 left-3 px-2 py-0.5 rounded-md bg-amber-500 text-white text-[9px] font-black uppercase">{k.status}</div>}
                                        <div className="absolute bottom-3 left-3 flex items-center gap-1 text-white text-xs font-bold">
                                            <Calendar className="w-3 h-3 text-amber-300" />
                                            {new Date(k.activity_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <h4 className="font-bold text-gray-900 text-sm line-clamp-2 mb-1">{k.title}</h4>
                                        {k.location && <p className="text-gray-400 text-xs flex items-center gap-1"><MapPin className="w-3 h-3 text-amber-400" />{k.location}</p>}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <p className="sm:hidden text-center text-gray-400 text-xs mt-3">← Geser untuk melihat semua →</p>
                    </div>
                </section>
            )}

            {/* =====================================================================
                WARTA PONDOK — Light gray-blue, magazine layout with large feature card
            ===================================================================== */}
            <section className="py-20 lg:py-28 relative overflow-hidden" style={{ backgroundColor: '#F7F8FC' }}>
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
                <div className="absolute -bottom-20 -left-20 w-96 h-96 rounded-full opacity-[0.05] blur-[80px]" style={{ backgroundColor: '#4F46E5' }} />

                <div className="max-w-7xl mx-auto px-5 lg:px-8 relative z-10">
                    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-14">
                        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                            <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full border mb-5" style={{ backgroundColor: '#EEF2FF', borderColor: '#C7D2FE', color: '#3730A3' }}>
                                <motion.div animate={{ y: [0, -3, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
                                    <Newspaper className="w-3.5 h-3.5" />
                                </motion.div>
                                <span className="text-xs font-bold tracking-widest uppercase">Warta Pondok</span>
                                <motion.div animate={{ scale: [1, 1.4, 1], opacity: [0.5, 1, 0.5] }} transition={{ duration: 1.5, repeat: Infinity }} className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                            </div>
                            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900">
                                Kabar <span style={{ color: '#4F46E5' }}>Terkini</span>
                            </h2>
                            <p className="text-gray-500 text-lg mt-3">Informasi, pengumuman, dan berita seputar pesantren</p>
                        </motion.div>
                        <Link href="/berita"
                            className="shrink-0 self-start lg:self-auto inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl font-bold text-sm border-2 hover:shadow-md transition-all group"
                            style={{ borderColor: '#4F46E5', color: '#4F46E5' }}
                        >
                            Semua Berita <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>

                    {/* DESKTOP: Magazine layout — 1 featured + 2 stacked */}
                    <div className="hidden md:grid lg:grid-cols-5 gap-6">
                        {/* Featured big card */}
                        {displayNews[0] && (
                            <motion.div
                                initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                                whileHover={{ y: -6 }}
                                className="lg:col-span-3 group relative bg-white rounded-3xl overflow-hidden shadow-md border border-gray-100 hover:shadow-2xl transition-all duration-300"
                            >
                                {/* Photo 16/9 */}
                                <div className="relative overflow-hidden" style={{ aspectRatio: '16/9' }}>
                                    <img src={displayNews[0].photo} alt={displayNews[0].title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                        loading="lazy"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                                    <div className="absolute top-4 left-4">
                                        <motion.span animate={{ scale: [1, 1.04, 1] }} transition={{ duration: 2, repeat: Infinity }}
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-black uppercase tracking-widest text-white shadow-lg"
                                            style={{ backgroundColor: '#4F46E5' }}
                                        >
                                            ✦ Berita Utama
                                        </motion.span>
                                    </div>
                                    <div className="absolute bottom-0 left-0 right-0 p-6">
                                        <div className="flex items-center gap-2 text-indigo-300 text-xs font-bold mb-3">
                                            <Calendar className="w-3.5 h-3.5" />{displayNews[0].date}
                                        </div>
                                        <h3 className="text-white font-black text-xl lg:text-2xl leading-tight mb-3 group-hover:text-indigo-200 transition-colors">
                                            {displayNews[0].title}
                                        </h3>
                                        <p className="text-white/60 text-sm leading-relaxed line-clamp-2 mb-4">{displayNews[0].body}</p>
                                        <Link href="/berita" className="inline-flex items-center gap-2 text-indigo-300 text-sm font-bold hover:text-white group/link transition-colors">
                                            Baca Selengkapnya <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                                        </Link>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* 2 smaller cards stacked */}
                        <div className="lg:col-span-2 flex flex-col gap-6">
                            {displayNews.slice(1, 3).map((item, idx) => (
                                <motion.div key={idx}
                                    initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                                    transition={{ delay: idx * 0.15 }}
                                    whileHover={{ y: -4 }}
                                    className="group flex-1 bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300"
                                >
                                    <div className="relative overflow-hidden h-36">
                                        <img src={item.photo} alt={item.title}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                            loading="lazy"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                                        <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-lg text-[10px] font-black uppercase text-white" style={{ backgroundColor: '#4F46E5' }}>Berita</span>
                                    </div>
                                    <div className="p-4">
                                        <div className="flex items-center gap-1.5 text-indigo-400 text-[11px] font-bold mb-2">
                                            <Clock className="w-3 h-3" />{item.date}
                                        </div>
                                        <h4 className="text-gray-900 font-bold text-sm leading-snug line-clamp-2 group-hover:text-indigo-700 transition-colors mb-3">{item.title}</h4>
                                        <Link href="/berita" className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-500 hover:text-indigo-700 group/link transition-colors">
                                            Baca <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform" />
                                        </Link>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* MOBILE: Full cards scroll */}
                    <div className="md:hidden flex gap-4 overflow-x-auto pb-3 snap-x snap-mandatory -mx-5 px-5" style={{ scrollbarWidth: 'none' }}>
                        {displayNews.map((item, idx) => (
                            <div key={idx} className="flex-shrink-0 snap-start bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm" style={{ minWidth: '78vw' }}>
                                <div className="relative h-44 overflow-hidden">
                                    <img src={item.photo} alt={item.title} className="w-full h-full object-cover" loading="lazy" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                                    <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-lg text-[9px] font-black uppercase text-white" style={{ backgroundColor: idx === 0 ? '#4F46E5' : '#6366F1' }}>
                                        {idx === 0 ? '✦ Utama' : 'Berita'}
                                    </span>
                                    <div className="absolute bottom-3 left-4 right-4">
                                        <div className="flex items-center gap-1 text-indigo-300 text-[11px] font-bold mb-1.5">
                                            <Calendar className="w-3 h-3" />{item.date}
                                        </div>
                                        <h4 className="text-white font-bold text-sm leading-snug line-clamp-2">{item.title}</h4>
                                    </div>
                                </div>
                                <div className="p-4">
                                    <p className="text-gray-500 text-xs leading-relaxed line-clamp-2 mb-3">{item.body}</p>
                                    <Link href="/berita" className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600">
                                        Baca Selengkapnya <ArrowRight className="w-3.5 h-3.5" />
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                    <p className="md:hidden text-center text-gray-400 text-xs mt-3">← Geser untuk melihat semua →</p>
                </div>
            </section>

            {/* =====================================================================
                CTA BANNER
            ===================================================================== */}
            <section className="py-16 lg:py-20 relative overflow-hidden" style={{ backgroundColor: GREEN }}>
                {/* Subtle grid pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:48px_48px]" />
                <motion.div animate={{ x: [0, 30, 0], y: [0, -20, 0] }} transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute -top-20 -right-20 w-80 h-80 rounded-full opacity-10 blur-[80px]"
                    style={{ background: 'radial-gradient(circle, #34d399, transparent)' }}
                />

                <div className="max-w-4xl mx-auto px-5 lg:px-8 text-center relative z-10">
                    <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                        <div className="w-14 h-14 mx-auto mb-7 rounded-2xl flex items-center justify-center bg-white/15 border border-white/20">
                            <GraduationCap className="w-7 h-7 text-white" />
                        </div>
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black text-white mb-5 leading-tight">
                            Bergabung Bersama <br />
                            <span className="text-emerald-300">Keluarga Besar Kami</span>
                        </h2>
                        <p className="text-white/60 text-base sm:text-lg mb-8 max-w-2xl mx-auto">
                            Mulailah perjalanan menuju ilmu dan akhlak yang mulia. Pendaftaran santri baru telah dibuka.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                            <a href="#" className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl bg-white text-gray-900 font-black text-base transition-all hover:shadow-xl hover:-translate-y-0.5">
                                Daftar Sekarang <ArrowRight className="w-5 h-5" style={{ color: GREEN }} />
                            </a>
                            <Link href="/tentang-kami" className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl border-2 border-white/30 text-white font-bold text-base transition-all hover:bg-white/10">
                                Pelajari Lebih Lanjut
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>
        </GuestLayout>
    );
}

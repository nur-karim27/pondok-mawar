import { Head, Link } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';
import {
    BookOpen, Users, Code, Globe, ScrollText,
    Bell, ChevronRight, Star,
    TrendingUp, ShieldCheck, GraduationCap, ArrowRight, Calendar,
    Network, Newspaper, Sparkles
} from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useState, useEffect } from 'react';

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

function PengasuhSlideshow() {
    const [current, setCurrent] = useState(0);
    useEffect(() => {
        const t = setInterval(() => setCurrent(c => (c + 1) % PENGASUH_PHOTOS.length), 10000);
        return () => clearInterval(t);
    }, []);
    return (
        <div className="relative w-full lg:w-72 rounded-2xl overflow-hidden shadow-2xl border border-white/20">
            <div className="relative w-full" style={{ aspectRatio: '3/4' }}>
                {PENGASUH_PHOTOS.map((p, i) => (
                    <motion.div key={i} initial={false} animate={{ opacity: current === i ? 1 : 0 }} transition={{ duration: 0.8, ease: 'easeInOut' }} className="absolute inset-0">
                        <img src={p.src} alt={p.name} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                    </motion.div>
                ))}
                <div className="absolute bottom-0 left-0 right-0 p-5 z-10">
                    <motion.div key={current} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                        <p className="text-white font-bold text-lg leading-tight drop-shadow">{PENGASUH_PHOTOS[current].name}</p>
                        <p className="text-emerald-300 text-sm font-semibold drop-shadow">{PENGASUH_PHOTOS[current].jabatan}</p>
                    </motion.div>
                    <div className="flex gap-2 mt-3">
                        {PENGASUH_PHOTOS.map((_, i) => (
                            <button key={i} onClick={() => setCurrent(i)}
                                className={`transition-all duration-300 rounded-full ${current === i ? 'w-6 h-2 bg-emerald-400' : 'w-2 h-2 bg-white/40 hover:bg-white/70'}`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

// ========== Data Santri Photos ==========
const SANTRI_PHOTOS = [
    { src: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=600&auto=format&fit=crop', caption: 'Kegiatan Belajar' },
    { src: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=600&auto=format&fit=crop', caption: 'Tadarus Al-Quran' },
    { src: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=80&w=600&auto=format&fit=crop', caption: 'Kebersamaan' },
    { src: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=600&auto=format&fit=crop', caption: 'Prestasi Santri' },
];

// ========== Program dengan Foto (aspect-video sama seperti IKSAMA) ==========
const programs = [
    {
        title: "Tahfidzul Qur'an", tag: 'Unggulan',
        photo: 'https://images.unsplash.com/photo-1585036156171-384164a8c675?q=80&w=800&auto=format&fit=crop',
        desc: "Hafalan Al-Qur'an 30 juz bersanad dengan metode mutqin didampingi muhaffizh tersertifikasi.",
        icon: BookOpen, gradient: 'from-emerald-500 to-teal-600', color: 'text-emerald-600', bg: 'bg-emerald-50',
    },
    {
        title: 'Kajian Kitab Kuning', tag: null,
        photo: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=800&auto=format&fit=crop',
        desc: 'Pengkajian mendalam turats klasik Ahlussunnah Wal Jamaah meliputi fiqih, tafsir, dan hadits.',
        icon: ScrollText, gradient: 'from-amber-500 to-orange-600', color: 'text-amber-600', bg: 'bg-amber-50',
    },
    {
        title: 'Bahasa Asing', tag: null,
        photo: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=800&auto=format&fit=crop',
        desc: 'Pembiasaan percakapan Bahasa Arab dan Inggris intensif dalam seluruh aktivitas keseharian santri.',
        icon: Globe, gradient: 'from-blue-500 to-indigo-600', color: 'text-blue-600', bg: 'bg-blue-50',
    },
    {
        title: 'IT & Multimedia', tag: 'Baru',
        photo: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?q=80&w=800&auto=format&fit=crop',
        desc: 'Membekali santri dengan keahlian teknologi informasi, coding, dan dakwah digital abad 21.',
        icon: Code, gradient: 'from-violet-500 to-purple-600', color: 'text-violet-600', bg: 'bg-violet-50',
    },
];

// ========== Foto Warta (aspect-video sama seperti IKSAMA) ==========
const WARTA_PHOTOS = [
    'https://images.unsplash.com/photo-1596489377461-2a149b109e25?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1577884877395-5df79b4a44f3?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1629815049364-77fec3aeb30a?auto=format&fit=crop&q=80&w=600',
];

export default function Welcome({ canLogin, pesantren, informasi = [], kegiatan_alumni = [] }: Props) {
    const { scrollY } = useScroll();
    const yBg   = useTransform(scrollY, [0, 800], [0, 200]);
    const scale = useTransform(scrollY, [0, 600], [1, 1.06]);

    const displayNews = informasi.length > 0
        ? informasi.slice(0, 3).map(a => ({
            title: a.title,
            date: new Date(a.published_at || a.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
            photo: WARTA_PHOTOS[0],
        }))
        : [
            { title: 'Pendaftaran Santri Baru Tahun Ajaran 2026/2027 Resmi Dibuka', date: '01 Agustus 2026',  photo: WARTA_PHOTOS[0] },
            { title: 'Delegasi Santri Raih Juara MTQ Nasional Tingkat Provinsi',    date: '28 Juli 2026',    photo: WARTA_PHOTOS[1] },
            { title: 'Kunjungan Ulama Internasional ke Ponpes Mawar',               date: '15 Juli 2026',    photo: WARTA_PHOTOS[2] },
        ];

    return (
        <GuestLayout pesantren={pesantren ?? undefined} canLogin={canLogin} activeNav="beranda">
            <Head title={`Selamat Datang — ${pesantren?.name || 'Ponpes Mawar'}`} />

            {/* ======================================================
                HERO
            ====================================================== */}
            <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
                <motion.div style={{ y: yBg, scale }} className="absolute inset-0 w-full h-full">
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1585036156171-384164a8c675?q=80&w=2400&auto=format&fit=crop')] bg-cover bg-center" />
                    <div className="absolute inset-0 bg-gradient-to-b from-[#0C3527]/80 via-[#0C3527]/60 to-[#0C3527]/90" />
                </motion.div>
                <div className="absolute top-1/4 right-1/3 w-80 h-80 bg-emerald-400/8 rounded-full blur-[100px] pointer-events-none" />

                <div className="relative z-10 max-w-7xl mx-auto px-5 lg:px-8 pt-24 pb-20 w-full">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
                                className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/15 backdrop-blur-xl border border-white/20 mb-8"
                            >
                                <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                                <span className="text-white/90 text-sm font-semibold tracking-wide">Penerimaan Santri Baru Telah Dibuka</span>
                            </motion.div>

                            <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.7 }}
                                className="text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-[1.05] tracking-tight mb-6"
                            >
                                Membentuk<br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-teal-300 to-cyan-300">Generasi</span>{' '}
                                <span className="text-white">Qur'ani</span>
                            </motion.h1>

                            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.6 }}
                                className="text-lg text-white/75 mb-10 max-w-lg leading-relaxed font-light"
                            >
                                Selamat datang di portal resmi{' '}
                                <span className="text-white font-semibold">{pesantren?.name || 'Pondok Pesantren Mamba\'ul Anwar'}</span>.
                                Mengintegrasikan tradisi keilmuan salaf dengan kecakapan modern.
                            </motion.p>

                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="flex flex-col items-start gap-2">
                                <span className="text-white/40 text-xs font-bold tracking-[0.3em] uppercase">Scroll untuk Menjelajahi</span>
                                <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                                    className="w-px h-8 bg-gradient-to-b from-white/40 to-transparent"
                                />
                            </motion.div>
                        </div>

                        <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2, duration: 0.8 }}
                            className="flex justify-center lg:justify-end"
                        >
                            <PengasuhSlideshow />
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ======================================================
                FOTO SANTRI
            ====================================================== */}
            <section className="py-16" style={{ backgroundColor: '#F2F8F5' }}>
                <div className="max-w-7xl mx-auto px-5 lg:px-8">
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border mb-4" style={{ backgroundColor: '#E8F4ED', borderColor: '#C5DFD0' }}>
                            <Users className="w-3.5 h-3.5" style={{ color: GREEN }} />
                            <span className="text-xs font-bold tracking-widest uppercase" style={{ color: GREEN }}>Kehidupan Santri</span>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-black text-gray-900">Potret Kehidupan di Pondok</h2>
                    </motion.div>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {SANTRI_PHOTOS.map((photo, i) => (
                            <motion.div key={i}
                                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1, duration: 0.5 }}
                                whileHover={{ y: -4 }}
                                className="group relative rounded-2xl overflow-hidden shadow-lg aspect-square"
                            >
                                <img src={photo.src} alt={photo.caption} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                                <div className="absolute bottom-0 left-0 right-0 p-4">
                                    <p className="text-white font-semibold text-sm">{photo.caption}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ======================================================
                ABOUT SNIPPET
            ====================================================== */}
            <section className="py-24 bg-white relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-200 to-transparent" />
                <div className="max-w-7xl mx-auto px-5 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border mb-6" style={{ backgroundColor: '#E8F4ED', borderColor: '#C5DFD0' }}>
                                <Star className="w-3.5 h-3.5" style={{ color: GREEN }} />
                                <span className="text-xs font-bold tracking-widest uppercase" style={{ color: GREEN }}>Tentang Kami</span>
                            </div>
                            <h2 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight mb-6">
                                Pusat Keunggulan <br />
                                <span style={{ color: GREEN }}>Ilmu & Akhlak</span>
                            </h2>
                            <p className="text-gray-600 text-lg leading-relaxed mb-8">
                                Didirikan dengan dedikasi penuh membina umat, kami terus beradaptasi dengan perkembangan zaman tanpa kehilangan ruh spiritualitas dan tradisi keilmuan pesantren yang telah teruji.
                            </p>
                            <div className="grid grid-cols-2 gap-4 mb-10">
                                {[
                                    { icon: ShieldCheck,    label: 'Berakhlak Mulia',   style: { border: '1px solid #C5DFD0', background: '#E8F4ED', color: GREEN } },
                                    { icon: GraduationCap, label: 'Intelektual Unggul', style: { border: '1px solid #bfdbfe', background: '#eff6ff', color: '#1d4ed8' } },
                                    { icon: Globe,         label: 'Wawasan Global',     style: { border: '1px solid #ddd6fe', background: '#f5f3ff', color: '#7c3aed' } },
                                    { icon: TrendingUp,    label: 'Adaptif & Inovatif', style: { border: '1px solid #fed7aa', background: '#fff7ed', color: '#c2410c' } },
                                ].map((f, i) => (
                                    <div key={i} className="flex items-center gap-3 p-3 rounded-xl" style={f.style}>
                                        <f.icon className="w-4 h-4 shrink-0" />
                                        <span className="text-sm font-semibold">{f.label}</span>
                                    </div>
                                ))}
                            </div>
                            <Link href="/tentang-kami"
                                className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl text-white font-bold transition-all shadow-lg group"
                                style={{ backgroundColor: GREEN }}
                            >
                                Selengkapnya <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </motion.div>

                        <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="relative">
                            <div className="relative rounded-3xl overflow-hidden aspect-[4/5] shadow-2xl">
                                <img src="https://images.unsplash.com/photo-1596789778044-82d59b23b7f4?q=80&w=1000&auto=format&fit=crop" alt="Pesantren" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                                <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur border border-white rounded-2xl p-4 shadow-xl">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#E8F4ED' }}>
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

            {/* ======================================================
                AKADEMIK — Background hijau gelap, kartu putih dengan foto aspect-video
            ====================================================== */}
            <section id="program" className="py-24 relative overflow-hidden" style={{ backgroundColor: GREEN }}>
                {/* Dekorasi */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:48px_48px]" />
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-400/30 to-transparent" />
                <div className="absolute top-1/2 left-0 w-80 h-80 bg-emerald-400/5 rounded-full blur-[120px] pointer-events-none" />
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-teal-500/5 rounded-full blur-[120px] pointer-events-none" />

                <div className="max-w-7xl mx-auto px-5 lg:px-8 relative z-10">
                    {/* Header seksi — khas Akademik */}
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
                        <div>
                            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/15 border border-white/25 backdrop-blur-xl mb-5">
                                <BookOpen className="w-4 h-4 text-emerald-300" />
                                <span className="text-emerald-200 text-xs font-bold tracking-widest uppercase">Akademik</span>
                            </div>
                            <h2 className="text-4xl md:text-5xl font-black text-white leading-tight">
                                Program <span className="text-emerald-300">Unggulan</span>
                            </h2>
                            <p className="text-white/60 text-lg mt-3 max-w-xl">Kurikulum terintegrasi memadukan tradisi salaf dengan kecakapan abad 21</p>
                        </div>
                        <Link href="/akademik"
                            className="shrink-0 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/15 border border-white/25 text-white font-bold hover:bg-white/25 transition-all group"
                        >
                            Lihat Semua <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </motion.div>

                    {/* Kartu program — sama format dengan IKSAMA (aspect-video foto + konten) */}
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
                        {programs.map((prog, idx) => (
                            <motion.div key={idx}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1, duration: 0.5 }}
                                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                                className="group bg-white rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 shadow-xl"
                            >
                                {/* Foto — aspect-video (sama persis dengan IKSAMA) */}
                                <div className="aspect-video overflow-hidden relative bg-gray-100">
                                    <img src={prog.photo} alt={prog.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                                    {prog.tag && (
                                        <div className={`absolute top-3 right-3 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest bg-gradient-to-r ${prog.gradient} text-white shadow`}>
                                            {prog.tag}
                                        </div>
                                    )}
                                    <div className={`absolute bottom-3 left-3 w-9 h-9 rounded-xl bg-gradient-to-br ${prog.gradient} flex items-center justify-center shadow-lg`}>
                                        <prog.icon className="w-4 h-4 text-white" />
                                    </div>
                                </div>
                                {/* Konten */}
                                <div className="p-5">
                                    <h3 className="font-black text-gray-900 text-base mb-2 group-hover:text-emerald-700 transition-colors">{prog.title}</h3>
                                    <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-2">{prog.desc}</p>
                                    <Link href="/akademik" className={`inline-flex items-center gap-1.5 text-xs font-bold ${prog.color}`}>
                                        Selengkapnya <ChevronRight className="w-3.5 h-3.5" />
                                    </Link>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ======================================================
                IKSAMA / ALUMNI — Background oranye hangat
            ====================================================== */}
            {kegiatan_alumni.length > 0 && (
                <section className="py-24 relative overflow-hidden" style={{ backgroundColor: '#FFF7ED' }}>
                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-300 to-transparent" />
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_100%,rgba(251,146,60,0.08),transparent)]" />
                    <div className="max-w-7xl mx-auto px-5 lg:px-8 relative z-10">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                                <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-orange-100 border border-orange-200 mb-5">
                                    <Network className="w-4 h-4 text-orange-600" />
                                    <span className="text-orange-600 text-xs font-bold tracking-widest uppercase">IKSAMA</span>
                                </div>
                                <h2 className="text-4xl md:text-5xl font-black text-gray-900">
                                    Kegiatan <span className="text-orange-500">Alumni</span>
                                </h2>
                                <p className="text-gray-500 text-lg mt-3">Merajut ukhuwah dan berkontribusi untuk umat</p>
                            </motion.div>
                            <Link href="/alumni" className="shrink-0 inline-flex items-center gap-2 text-sm font-bold text-orange-600 hover:text-orange-700 transition-colors group">
                                Lihat Semua <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                        {/* Kartu IKSAMA — ukuran referensi */}
                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
                            {kegiatan_alumni.map((k, idx) => (
                                <motion.div key={idx}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.08 }}
                                    whileHover={{ y: -5 }}
                                    className="group bg-white border border-orange-100 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 shadow-sm"
                                >
                                    {/* Foto aspect-video — ukuran referensi */}
                                    <div className="aspect-video bg-orange-50 overflow-hidden relative">
                                        {k.cover_image
                                            ? <img src={`/storage/${k.cover_image}`} alt={k.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                            : <div className="w-full h-full flex items-center justify-center"><Network className="w-10 h-10 text-orange-200" /></div>
                                        }
                                    </div>
                                    <div className="p-5">
                                        <div className="flex items-center gap-1.5 text-orange-500 text-xs font-bold mb-2">
                                            <Calendar className="w-3.5 h-3.5" />
                                            {new Date(k.activity_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                        </div>
                                        <h4 className="font-bold text-gray-900 text-sm leading-snug line-clamp-2 group-hover:text-orange-600 transition-colors">{k.title}</h4>
                                        {k.location && <p className="text-gray-400 text-xs mt-2 flex items-center gap-1"><span>📍</span>{k.location}</p>}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* ======================================================
                WARTA PONDOK — Background ungu/violet (beda dari yang lain)
            ====================================================== */}
            <section className="py-24 relative overflow-hidden" style={{ backgroundColor: '#F5F3FF' }}>
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-300 to-transparent" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(124,58,237,0.06),transparent)]" />
                <div className="max-w-7xl mx-auto px-5 lg:px-8 relative z-10">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-violet-100 border border-violet-200 mb-5">
                                <Newspaper className="w-4 h-4 text-violet-600" />
                                <span className="text-violet-600 text-xs font-bold tracking-widest uppercase">Warta Pondok</span>
                            </div>
                            <h2 className="text-4xl md:text-5xl font-black text-gray-900">
                                Kabar <span className="text-violet-600">Terkini</span>
                            </h2>
                            <p className="text-gray-500 text-lg mt-3">Informasi, pengumuman, dan berita seputar pesantren</p>
                        </motion.div>
                        <Link href="/berita" className="shrink-0 inline-flex items-center gap-2 text-sm font-bold text-violet-600 hover:text-violet-700 transition-colors group">
                            Semua Berita <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>

                    {/* Kartu warta — foto aspect-video SAMA ukurannya dengan IKSAMA */}
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {displayNews.map((item, idx) => (
                            <motion.div key={idx}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                whileHover={{ y: -5 }}
                                className="group bg-white border border-violet-100 rounded-2xl overflow-hidden hover:shadow-xl hover:border-violet-200 transition-all duration-300 shadow-sm"
                            >
                                {/* Foto aspect-video — SAMA ukuran dengan IKSAMA */}
                                <div className="aspect-video overflow-hidden relative bg-violet-50">
                                    <img src={item.photo} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                    <div className="absolute top-3 left-3">
                                        <span className="px-2.5 py-1 bg-violet-600 text-white text-[10px] font-black rounded-lg tracking-widest uppercase">Berita</span>
                                    </div>
                                </div>
                                <div className="p-5">
                                    <div className="flex items-center gap-1.5 text-violet-500 text-xs font-bold mb-2.5">
                                        <Calendar className="w-3.5 h-3.5" />
                                        {item.date}
                                    </div>
                                    <h4 className="text-gray-900 font-bold text-base leading-snug mb-4 group-hover:text-violet-700 transition-colors line-clamp-2">{item.title}</h4>
                                    <Link href="/berita" className="inline-flex items-center gap-1.5 text-xs font-bold text-violet-600 hover:text-violet-700 transition-colors group/link">
                                        Baca Selengkapnya <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform" />
                                    </Link>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ======================================================
                CTA BANNER
            ====================================================== */}
            <section className="py-20 bg-white relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-200 to-transparent" />
                <div className="max-w-4xl mx-auto px-5 lg:px-8 text-center relative z-10">
                    <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                        <div className="w-16 h-16 mx-auto mb-8 rounded-2xl flex items-center justify-center" style={{ backgroundColor: '#E8F4ED', border: '1px solid #C5DFD0' }}>
                            <GraduationCap className="w-8 h-8" style={{ color: GREEN }} />
                        </div>
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-6 leading-tight">
                            Bergabung Bersama <br />
                            <span style={{ color: GREEN }}>Keluarga Besar Kami</span>
                        </h2>
                        <p className="text-gray-500 text-lg mb-10 max-w-2xl mx-auto">
                            Mulailah perjalanan menuju ilmu dan akhlak yang mulia. Pendaftaran santri baru telah dibuka.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <a href="#" className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl text-white font-bold text-base transition-all shadow-xl hover:-translate-y-0.5"
                                style={{ backgroundColor: GREEN }}
                            >
                                Daftar Sekarang <ArrowRight className="w-5 h-5" />
                            </a>
                            <Link href="/tentang-kami" className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl border-2 font-bold text-base transition-all hover:bg-gray-50"
                                style={{ borderColor: GREEN, color: GREEN }}
                            >
                                Pelajari Lebih Lanjut
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>
        </GuestLayout>
    );
}

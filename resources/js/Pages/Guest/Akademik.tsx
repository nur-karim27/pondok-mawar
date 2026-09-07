import { Head, Link } from '@inertiajs/react';
import { PageProps } from '@/types';
import { BookOpen, GraduationCap, Code, Globe, ScrollText, BrainCircuit, Microscope, ChevronRight, ArrowRight, Sparkles, CheckCircle2, Clock, Users, Trophy } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import GuestLayout from '@/Layouts/GuestLayout';
import { useRef } from 'react';

const programs = [
    {
        id: 1, title: "Takhassus Tahfidz Al-Qur'an", subtitle: 'Program Hafalan 30 Juz',
        desc: "Program khusus menghafal Al-Qur'an 30 Juz dengan metode mutqin bersanad, didampingi muhaffizh tersertifikasi.",
        icon: BookOpen, gradient: 'from-emerald-500 to-teal-600',
        borderColor: 'border-emerald-100', textColor: 'text-[#1a4731]',
        features: ['Metode Mutqin & Murajaah', 'Sanad Keilmuan Tersambung', 'Muhaffizh Tersertifikasi'],
        badge: 'Unggulan', span: 'lg:col-span-2'
    },
    {
        id: 2, title: 'Dirasah Islamiyah', subtitle: 'Kajian Kitab Kuning',
        desc: 'Pendalaman literatur klasik (Turats) meliputi nahwu, sharaf, fiqih, tafsir, dan hadits menggunakan kurikulum salaf.',
        icon: ScrollText, gradient: 'from-blue-500 to-indigo-600',
        borderColor: 'border-blue-100', textColor: 'text-blue-700',
        features: ['Ilmu Nahwu & Sharaf', 'Fiqih & Ushul Fiqih', 'Tafsir & Hadits'],
        badge: null, span: 'lg:col-span-1'
    },
    {
        id: 3, title: 'Pendidikan Formal', subtitle: 'MTs & MA Terintegrasi',
        desc: 'Pendidikan tingkat SMP/MTs dan SMA/MA yang terintegrasi dengan kurikulum pondok untuk mencetak generasi intelektual.',
        icon: GraduationCap, gradient: 'from-violet-500 to-purple-600',
        borderColor: 'border-violet-100', textColor: 'text-violet-700',
        features: ['Kurikulum Kemendikbud', 'Terintegrasi Pondok', 'Akreditasi A'],
        badge: null, span: 'lg:col-span-1'
    },
    {
        id: 4, title: 'Sains & Teknologi Terapan', subtitle: 'IT & Inovasi Digital',
        desc: 'Ekstrakurikuler unggulan di bidang robotika, desain grafis, dan coding untuk menjawab tantangan revolusi industri 4.0.',
        icon: BrainCircuit, gradient: 'from-rose-500 to-orange-600',
        borderColor: 'border-rose-100', textColor: 'text-rose-700',
        features: ['Coding & Robotika', 'Desain Grafis', 'Dakwah Digital'],
        badge: 'Baru', span: 'lg:col-span-2'
    },
];

const advantages = [
    { icon: Clock,   title: 'Jadwal Terstruktur', desc: '18 jam belajar aktif per hari dengan sistem yang tertata rapi.',   color: 'border-amber-200 bg-amber-50 text-amber-700' },
    { icon: Users,   title: 'Pengajar Berdedikasi', desc: 'Lebih dari 30 asatidz berpengalaman dan berkompeten di bidangnya.', color: 'border-blue-200 bg-blue-50 text-blue-700' },
    { icon: Trophy,  title: 'Prestasi Membanggakan', desc: 'Ratusan penghargaan lokal dan nasional di bidang akademik.',        color: 'border-emerald-200 bg-emerald-50 text-[#1a4731]' },
    { icon: Globe,   title: 'Jaringan Alumni Global', desc: 'Ribuan alumni tersebar di berbagai daerah dan mancanegara.',       color: 'border-violet-200 bg-violet-50 text-violet-700' },
];

export default function Akademik({ pesantren }: PageProps<{ pesantren: any }>) {
    const heroRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
    const yBg = useTransform(scrollYProgress, [0, 1], [0, 180]);

    return (
        <GuestLayout pesantren={pesantren} canLogin={true} activeNav="akademik">
            <Head title="Program Akademik & Pendidikan" />

            {/* HERO */}
            <section ref={heroRef} className="relative min-h-[75vh] flex items-center justify-center overflow-hidden">
                <motion.div style={{ y: yBg }} className="absolute inset-0 w-full h-[130%] -top-[15%]">
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1629814696208-cbfa96fa3528?q=80&w=2400&auto=format&fit=crop')] bg-cover bg-center" />
                    <div className="absolute inset-0 bg-gradient-to-b from-[#0f2d1e]/80 via-[#1a4731]/60 to-[#1a4731]/90" />
                </motion.div>
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_40%,transparent_100%)]" />
                <div className="absolute top-1/3 left-1/4 w-80 h-80 bg-cyan-400/10 rounded-full blur-[120px]" />

                <div className="relative z-10 max-w-7xl mx-auto px-5 lg:px-8 pt-24 pb-20 text-center">
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }}
                        className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/15 border border-white/25 backdrop-blur-xl mb-8"
                    >
                        <Sparkles className="w-4 h-4 text-cyan-300" />
                        <span className="text-white text-xs font-bold tracking-widest uppercase">Kurikulum & Program</span>
                    </motion.div>

                    <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.7, ease: 'easeOut' }}
                        className="text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-[1.08] tracking-tight mb-6"
                    >
                        Sinergi <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-teal-300">Sains</span> &<br />Ilmu Agama
                    </motion.h1>

                    <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.7 }}
                        className="text-lg text-white/80 max-w-2xl mx-auto leading-relaxed font-light"
                    >
                        {pesantren?.short_name || 'Ponpes Mawar'} menyelenggarakan sistem pendidikan modern yang memadukan kedalaman tradisi salaf dengan kecakapan abad 21.
                    </motion.p>
                </div>
            </section>

            {/* PROGRAMS */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-5 lg:px-8">
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 mb-5">
                            <span className="text-[#1a4731] text-xs font-bold tracking-widest uppercase">Program Studi</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">Pilihan Program</h2>
                        <p className="text-gray-500 text-lg max-w-xl mx-auto">Pilih program yang sesuai minat, bakat, dan tujuan hidupmu</p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {programs.map((prog, idx) => (
                            <motion.div key={prog.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1, duration: 0.5, ease: 'easeOut' }}
                                whileHover={{ y: -6, transition: { duration: 0.25 } }}
                                className={`group relative bg-white border ${prog.borderColor} rounded-2xl p-8 overflow-hidden hover:shadow-xl shadow-sm transition-all duration-300 ${prog.span}`}
                            >
                                {prog.badge && (
                                    <div className={`absolute top-5 right-5 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest bg-gradient-to-r ${prog.gradient} text-white shadow-lg`}>
                                        {prog.badge}
                                    </div>
                                )}
                                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${prog.gradient} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                    <prog.icon className="w-7 h-7 text-white" />
                                </div>
                                <p className={`text-xs font-bold tracking-widest uppercase mb-2 ${prog.textColor}`}>{prog.subtitle}</p>
                                <h3 className="text-2xl font-black text-gray-900 mb-4 leading-tight">{prog.title}</h3>
                                <p className="text-gray-500 text-sm leading-relaxed mb-6">{prog.desc}</p>
                                <ul className="space-y-2 mb-6">
                                    {prog.features.map((f, fi) => (
                                        <li key={fi} className="flex items-center gap-2.5">
                                            <CheckCircle2 className={`w-4 h-4 ${prog.textColor} shrink-0`} />
                                            <span className="text-gray-600 text-sm">{f}</span>
                                        </li>
                                    ))}
                                </ul>
                                <button className={`inline-flex items-center gap-1.5 text-sm font-bold ${prog.textColor}`}>
                                    Selengkapnya <ChevronRight className="w-4 h-4" />
                                </button>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ADVANTAGES */}
            <section className="py-20 bg-gray-50 relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
                <div className="max-w-7xl mx-auto px-5 lg:px-8">
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
                        <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">Mengapa Kami?</h2>
                        <p className="text-gray-500 text-lg max-w-xl mx-auto">Keunggulan yang membedakan kami dari yang lain</p>
                    </motion.div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
                        {advantages.map((adv, i) => (
                            <motion.div key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                whileHover={{ y: -4 }}
                                className="bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 shadow-sm"
                            >
                                <div className={`w-12 h-12 rounded-xl border flex items-center justify-center mb-5 ${adv.color}`}>
                                    <adv.icon className="w-6 h-6" />
                                </div>
                                <h3 className="text-gray-900 font-bold text-lg mb-2">{adv.title}</h3>
                                <p className="text-gray-500 text-sm leading-relaxed">{adv.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-24 bg-white relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1629814696208-cbfa96fa3528?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-[0.03]" />
                <div className="max-w-4xl mx-auto px-5 lg:px-8 text-center relative z-10">
                    <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                        <div className="w-20 h-20 mx-auto mb-8 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center">
                            <Microscope className="w-10 h-10 text-[#1a4731]" />
                        </div>
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-6 leading-tight">
                            Siap Membangun<br />
                            <span className="text-[#1a4731]">Masa Depan Gemilang?</span>
                        </h2>
                        <p className="text-gray-500 text-lg mb-10 max-w-2xl mx-auto">
                            Mari bergabung bersama kami dalam mencetak generasi qur'ani yang unggul dalam IPTEK dan IMTAQ.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <a href="#"
                                className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl bg-[#1a4731] text-white font-bold text-base hover:bg-[#1a4731]/90 transition-all shadow-xl shadow-[#1a4731]/20 hover:-translate-y-0.5 group"
                            >
                                Daftar Sekarang <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </a>
                            <Link href="/tentang-kami"
                                className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl border-2 border-[#1a4731] text-[#1a4731] font-bold hover:bg-[#1a4731] hover:text-white transition-all"
                            >
                                Profil Pesantren
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>
        </GuestLayout>
    );
}

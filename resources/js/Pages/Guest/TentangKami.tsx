import { Head, Link } from '@inertiajs/react';
import { PageProps } from '@/types';
import { ShieldCheck, GraduationCap, Clock, Users, Award, Heart, Star, CheckCircle2, ArrowRight } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import GuestLayout from '@/Layouts/GuestLayout';
import { useRef } from 'react';

const milestones = [
    { year: '1990', title: 'Pendirian Pondok', desc: 'Didirikan oleh KH. Mawar Abdurrahman dengan santri perdana 12 orang.' },
    { year: '1998', title: 'Kurikulum Formal', desc: 'Membuka Madrasah Tsanawiyah terintegrasi dengan kurikulum pondok.' },
    { year: '2005', title: 'Pengembangan IKSAMA', desc: 'Terbentuknya ikatan alumni IKSAMA yang kini berjangkauan nasional.' },
    { year: '2012', title: 'Program IT & Sains', desc: 'Inovasi kurikulum dengan menambahkan program sains dan teknologi.' },
    { year: '2020', title: 'Era Digitalisasi', desc: 'Pesantren digital pertama di wilayah ini dengan sistem manajemen terpadu.' },
    { year: '2026', title: 'Kini & Masa Depan', desc: 'Terus berkembang dengan visi menjadi pesantren modern bertaraf nasional.' },
];

const values = [
    { icon: ShieldCheck, title: 'Amanah', desc: 'Setiap amanah diemban dengan penuh tanggung jawab dan kejujuran.', color: 'from-emerald-400 to-teal-500' },
    { icon: Heart, title: 'Ukhuwah', desc: 'Membangun persaudaraan Islam yang hangat di lingkungan pesantren.', color: 'from-rose-400 to-pink-500' },
    { icon: Star, title: 'Tafaqquh', desc: 'Mendalami ilmu agama dengan sungguh-sungguh mengikuti tradisi salaf.', color: 'from-amber-400 to-orange-500' },
    { icon: Award, title: 'Prestasi', desc: 'Mendorong setiap santri meraih prestasi terbaik dalam ilmu dan akhlak.', color: 'from-blue-400 to-indigo-500' },
];

export default function TentangKami({ pesantren }: PageProps<{ pesantren: any }>) {
    const heroRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
    const yBg = useTransform(scrollYProgress, [0, 1], [0, 150]);
    const opacityText = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

    const missionList = (pesantren?.mission || 'Menyelenggarakan pendidikan agama Islam secara terpadu.\nMembina akhlak dan karakter santri yang luhur.\nMengembangkan keterampilan bermasyarakat dan IT.').split('\n');

    return (
        <GuestLayout pesantren={pesantren} canLogin={true} activeNav="tentang">
            <Head title={`Tentang Kami — ${pesantren?.name || 'Pondok Pesantren'}`} />

            {/* ============================== HERO ============================== */}
            <section ref={heroRef} className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
                {/* Background */}
                <motion.div style={{ y: yBg }} className="absolute inset-0 w-full h-[130%] -top-[15%]">
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1590402494682-ce361bd47a75?q=80&w=2400&auto=format&fit=crop')] bg-cover bg-center" />
                    <div className="absolute inset-0 bg-gradient-to-b from-[#0f2d1e]/70 via-[#1a4731]/50 to-[#1a4731]/90" />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#0f2d1e]/40 to-transparent" />
                </motion.div>

                {/* Decorative orbs */}
                <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-amber-500/8 rounded-full blur-[100px]" />
                <div className="absolute bottom-1/4 left-1/3 w-48 h-48 bg-orange-500/8 rounded-full blur-[80px]" />

                <motion.div style={{ opacity: opacityText }} className="relative z-10 max-w-7xl mx-auto px-5 lg:px-8 pt-24 pb-20 text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 backdrop-blur-xl mb-8"
                    >
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                        <span className="text-amber-400 text-xs font-bold tracking-widest uppercase">Sejarah & Profil</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                        className="text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-[1.08] tracking-tight mb-6"
                    >
                        Warisan Keilmuan<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-orange-400">
                            Penjaga Peradaban
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.7 }}
                        className="text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed font-light"
                    >
                        Menyelami sejarah panjang{' '}
                        <span className="text-white font-semibold">{pesantren?.name || 'Pesantren Mawar'}</span>{' '}
                        dalam mencetak generasi penerus bangsa yang berakar tradisi salaf dan adaptif terhadap kemajuan zaman.
                    </motion.p>
                </motion.div>
            </section>

            {/* ============================== STATS FLOATING ============================== */}
            <section className="bg-white">
                <div className="max-w-7xl mx-auto px-5 lg:px-8 -mt-12 relative z-20">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="grid grid-cols-1 md:grid-cols-3 gap-0.5 bg-white/5 rounded-2xl overflow-hidden border border-white/8 shadow-2xl"
                    >
                        {[
                            { icon: Clock, value: '1990', label: 'Tahun Berdiri', color: 'text-amber-400', bg: 'bg-amber-500/10' },
                            { icon: Users, value: '5.000+', label: 'Alumni Tersebar', color: 'text-blue-400', bg: 'bg-blue-500/10' },
                            { icon: Award, value: 'Akreditasi A', label: 'Kualitas Terbaik', color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
                        ].map((s, i) => (
                            <div key={i} className={`flex items-center gap-5 p-7 bg-white border border-gray-100`}>
                                <div className={`w-12 h-12 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center ${s.color}`}>
                                    <s.icon className="w-6 h-6" />
                                </div>
                                <div>
                                    <div className={`text-2xl font-black ${s.color}`}>{s.value}</div>
                                    <div className="text-gray-600 text-sm font-semibold">{s.label}</div>
                                </div>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* ============================== HISTORY SPLIT ============================== */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-5 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        {/* Image */}
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                            className="relative"
                        >
                            <div className="relative rounded-3xl overflow-hidden aspect-[4/5] shadow-2xl group">
                                <img
                                    src="https://images.unsplash.com/photo-1542816417-0983c9c9ad53?q=80&w=1000&auto=format&fit=crop"
                                    alt="Sejarah Pesantren"
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                                {/* Quote overlay */}
                                <div className="absolute bottom-6 left-6 right-6 bg-black/40 backdrop-blur-2xl border border-white/10 rounded-2xl p-5">
                                    <p className="text-white/90 text-sm italic leading-relaxed">
                                        "Pondok pesantren adalah jantung peradaban Islam Nusantara yang terus berdetak melintasi zaman."
                                    </p>
                                </div>
                            </div>
                            {/* Decorative */}
                            <div className="absolute -bottom-8 -left-8 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl -z-10" />
                        </motion.div>

                        {/* Text */}
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                        >
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 mb-6">
                                <span className="text-amber-400 text-xs font-bold tracking-widest uppercase">Jejak Langkah</span>
                            </div>
                            <h2 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight mb-6">
                                Membangun Peradaban dari{' '}
                                <span className="text-[#1a4731]">Bilik Pesantren</span>
                            </h2>
                            <div className="text-gray-600 leading-relaxed text-base space-y-4 mb-8">
                                <p>
                                    {pesantren?.history ||
                                        'Pesantren ini didirikan dengan semangat menyebarkan nilai-nilai Islam yang rahmatan lil \'alamin. Melalui perpaduan kurikulum tradisional dan modern, pesantren terus berupaya menjawab tantangan zaman tanpa kehilangan jati dirinya sebagai institusi tafaqquh fiddin.'}
                                </p>
                            </div>
                            <Link
                                href="#visi-misi"
                                className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl bg-[#1a4731] text-white font-bold hover:bg-[#1a4731]/90 transition-all shadow-lg shadow-[#1a4731]/20 group"
                            >
                                Visi & Misi <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ============================== TIMELINE ============================== */}
            <section className="py-24 bg-gray-50 relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-300 to-transparent" />
                <div className="max-w-7xl mx-auto px-5 lg:px-8">
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 mb-5">
                            <span className="text-amber-400 text-xs font-bold tracking-widest uppercase">Perjalanan</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black text-gray-900">Linimasa Sejarah</h2>
                    </motion.div>

                    <div className="relative">
                        {/* Center line */}
                        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-amber-500/30 via-amber-500/10 to-transparent hidden md:block" />

                        <div className="space-y-8">
                            {milestones.map((m, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1, duration: 0.6 }}
                                    className={`flex items-center gap-8 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                                >
                                    <div className={`flex-1 ${i % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                                        <div className={`bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-lg hover:border-amber-300 transition-all duration-300 group shadow-sm ${i % 2 === 0 ? 'md:ml-8' : 'md:mr-8'}`}>
                                            <span className="text-amber-400 text-xs font-black tracking-widest uppercase mb-2 block">{m.year}</span>
                                            <h3 className="text-gray-900 font-bold text-lg mb-2 group-hover:text-amber-700 transition-colors">{m.title}</h3>
                                            <p className="text-gray-500 text-sm leading-relaxed">{m.desc}</p>
                                        </div>
                                    </div>
                                    {/* Center dot */}
                                    <div className="hidden md:flex w-5 h-5 rounded-full bg-amber-400 border-4 border-[#0d1a2e] shadow-lg shadow-amber-400/40 shrink-0 z-10" />
                                    <div className="flex-1 hidden md:block" />
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ============================== VISI MISI ============================== */}
            <section id="visi-misi" className="py-24 bg-white relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/8 to-transparent" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_50%_100%,rgba(245,158,11,0.05),transparent)]" />

                <div className="max-w-7xl mx-auto px-5 lg:px-8 relative z-10">
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 mb-5">
                            <span className="text-gray-300 text-xs font-bold tracking-widest uppercase">Arah & Tujuan</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black text-gray-900">Visi & Misi Kami</h2>
                    </motion.div>

                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Visi */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="group relative bg-white border border-gray-100 rounded-3xl p-10 hover:shadow-xl hover:border-amber-200 transition-all duration-500 overflow-hidden shadow-sm"
                        >
                            <div className="absolute -top-20 -right-20 w-48 h-48 bg-amber-500/8 rounded-full blur-3xl group-hover:opacity-150 transition-opacity" />
                            <div className="relative z-10">
                                <div className="w-14 h-14 rounded-2xl bg-amber-500/15 border border-amber-500/20 flex items-center justify-center mb-8 text-amber-400 group-hover:scale-110 transition-transform">
                                    <ShieldCheck className="w-7 h-7" />
                                </div>
                                <h3 className="text-3xl font-black text-gray-900 mb-5">Visi</h3>
                                <p className="text-gray-600 text-lg leading-relaxed italic">
                                    "{pesantren?.vision || 'Menjadi lembaga pendidikan Islam terkemuka yang inovatif dan unggul dalam mencetak generasi tafaqquh fiddin yang berakhlakul karimah.'}"
                                </p>
                            </div>
                        </motion.div>

                        {/* Misi */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.15 }}
                            className="relative bg-gradient-to-br from-amber-50 via-orange-50 to-white border border-amber-200 rounded-3xl p-10 overflow-hidden"
                        >
                            <div className="absolute -top-20 -right-20 w-56 h-56 bg-amber-400/10 rounded-full blur-3xl" />
                            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-orange-400/8 rounded-full blur-2xl" />
                            <div className="relative z-10">
                                <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center mb-8 text-amber-400">
                                    <GraduationCap className="w-7 h-7" />
                                </div>
                                <h3 className="text-3xl font-black text-gray-900 mb-6">Misi</h3>
                                <ul className="space-y-4">
                                    {missionList.map((misi: string, idx: number) => (
                                        <li key={idx} className="flex items-start gap-3">
                                            <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                                            <span className="text-gray-700 leading-relaxed">{misi.replace(/^\d+\.\s*/, '')}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ============================== NILAI DASAR ============================== */}
            <section className="py-24 bg-gray-50 relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
                <div className="max-w-7xl mx-auto px-5 lg:px-8">
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
                        <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">Nilai Dasar Kami</h2>
                        <p className="text-gray-500 text-lg max-w-xl mx-auto">Pilar-pilar yang menopang setiap langkah perjalanan pesantren</p>
                    </motion.div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
                        {values.map((v, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                whileHover={{ y: -6 }}
                                className="group bg-white border border-gray-100 rounded-2xl p-7 text-center hover:shadow-xl hover:border-gray-200 transition-all duration-300 overflow-hidden relative shadow-sm"
                            >
                                <div className={`absolute -top-16 -right-16 w-32 h-32 bg-gradient-to-br ${v.color} rounded-full blur-3xl opacity-0 group-hover:opacity-15 transition-opacity duration-500`} />
                                <div className={`relative z-10 w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br ${v.color} flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform`}>
                                    <v.icon className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-xl font-black text-gray-900 mb-3 relative z-10">{v.title}</h3>
                                <p className="text-gray-500 text-sm leading-relaxed relative z-10">{v.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </GuestLayout>
    );
}

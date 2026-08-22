import { Head, Link } from '@inertiajs/react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import { BookOpen, Users, MapPin, Phone, Mail, ArrowRight, ShieldCheck, GraduationCap, Code, Globe, MessageSquare, ChevronRight, PlayCircle, ScrollText, Menu, X } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useState, useEffect } from 'react';

interface Props {
    canLogin: boolean;
    pesantren: {
        name: string;
        short_name: string;
        address: string;
        phone: string;
        email: string;
        vision: string;
        mission: string;
    };
}

export default function Welcome({ canLogin, pesantren }: Props) {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { scrollY } = useScroll();
    
    // Parallax effect for hero background
    const yHeroBg = useTransform(scrollY, [0, 1000], [0, 300]);
    const opacityHero = useTransform(scrollY, [0, 500], [1, 0]);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const fadeUpVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: (i: number) => ({
            opacity: 1,
            y: 0,
            transition: { delay: i * 0.1, duration: 0.6, ease: "easeOut" as const }
        })
    };

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const navLinks = [
        { name: 'Beranda', href: '#beranda' },
        { name: 'Profil', href: '#profil' },
        { name: 'Program', href: '#program' },
        { name: 'Berita', href: '#berita' },
        { name: 'Galeri', href: '#galeri' },
    ];

    const programs = [
        { title: 'Tahfidzul Qur\'an', desc: 'Program hafalan Al-Qur\'an 30 juz bersanad dengan metode mutqin.', icon: BookOpen, color: 'bg-emerald-100 text-emerald-600' },
        { title: 'Kajian Kitab Kuning', desc: 'Pengkajian mendalam turats klasik (Salaf) berhaluan Ahlussunnah Wal Jamaah.', icon: ScrollText, color: 'bg-amber-100 text-amber-600' },
        { title: 'Bahasa Asing', desc: 'Pembiasaan percakapan Bahasa Arab dan Inggris dalam keseharian santri.', icon: Globe, color: 'bg-blue-100 text-blue-600' },
        { title: 'IT & Multimedia', desc: 'Membekali santri dengan keahlian teknologi informasi dan dakwah digital.', icon: Code, color: 'bg-purple-100 text-purple-600' },
    ];

    const news = [
        { title: 'Pendaftaran Santri Baru Tahun Ajaran 2026/2027 Resmi Dibuka', date: '01 Agustus 2026', image: 'https://images.unsplash.com/photo-1596489377461-2a149b109e25?auto=format&fit=crop&q=80&w=800' },
        { title: 'Kunjungan Silaturahmi Ulama Timur Tengah ke Ponpes Mawar', date: '28 Juli 2026', image: 'https://images.unsplash.com/photo-1577884877395-5df79b4a44f3?auto=format&fit=crop&q=80&w=800' },
        { title: 'Prestasi Santri: Juara Umum MTQ Nasional Tingkat Provinsi', date: '15 Juli 2026', image: 'https://images.unsplash.com/photo-1629815049364-77fec3aeb30a?auto=format&fit=crop&q=80&w=800' },
    ];

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-800 selection:bg-primary/20 selection:text-primary overflow-x-hidden">
            <Head title={`Selamat Datang di ${pesantren?.name || 'Ponpes Mawar'}`} />

            {/* Navbar */}
            <motion.nav 
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-gray-900/80 backdrop-blur-lg shadow-lg border-b border-white/10 py-3' : 'bg-transparent py-5'}`}
            >
                <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10">
                            <ApplicationLogo className="h-8 w-8 text-white fill-current" />
                        </div>
                        <span className="text-xl font-bold tracking-tight text-white">
                            {pesantren?.short_name || 'Ponpes Mawar'}
                        </span>
                    </div>
                    
                    <div className="hidden lg:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <a 
                                key={link.name} 
                                href={link.href} 
                                className="text-sm font-medium transition-colors text-gray-300 hover:text-white"
                            >
                                {link.name}
                            </a>
                        ))}
                        {canLogin && (
                            <Link
                                href={route('login')}
                                className="text-sm font-medium transition-colors text-gray-300 hover:text-white"
                            >
                                Masuk
                            </Link>
                        )}
                    </div>

                    <div className="flex items-center gap-4">
                        <button 
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="lg:hidden p-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors focus:outline-none"
                        >
                            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="lg:hidden bg-gray-900/95 backdrop-blur-xl border-t border-white/10 mt-3"
                    >
                        <div className="px-6 py-6 flex flex-col gap-4">
                            {navLinks.map((link) => (
                                <a 
                                    key={link.name} 
                                    href={link.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="text-base font-medium text-gray-300 hover:text-white py-2 border-b border-white/5"
                                >
                                    {link.name}
                                </a>
                            ))}
                            {canLogin && (
                                <Link 
                                    href={route('login')}
                                    className="text-base font-medium text-gray-300 hover:text-white py-2 border-b border-white/5"
                                >
                                    Masuk
                                </Link>
                            )}
                        </div>
                    </motion.div>
                )}
            </motion.nav>

            {/* Hero Section */}
            <section id="beranda" className="relative min-h-screen flex items-center justify-center overflow-hidden">
                {/* Background Image with Parallax */}
                <motion.div 
                    style={{ y: yHeroBg }}
                    className="absolute inset-0 w-full h-[120%] -top-[10%]"
                >
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1585036156171-384164a8c675?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center"></div>
                    <div className="absolute inset-0 bg-gradient-to-b from-gray-900/80 via-gray-900/60 to-gray-900/90 mix-blend-multiply"></div>
                    {/* Brand overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-transparent opacity-60"></div>
                </motion.div>

                <div className="relative z-10 max-w-7xl mx-auto px-6 w-full pt-20">
                    <div className="max-w-3xl">
                        <motion.div
                            custom={0}
                            initial="hidden"
                            animate="visible"
                            variants={fadeUpVariants}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-8"
                        >
                            <span className="flex h-2 w-2 rounded-full bg-accent animate-pulse"></span>
                            <span className="text-white text-sm font-medium tracking-wide uppercase">Penerimaan Santri Baru Telah Dibuka</span>
                        </motion.div>
                        
                        <motion.h1 
                            custom={1}
                            initial="hidden"
                            animate="visible"
                            variants={fadeUpVariants}
                            className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-[1.1] mb-6"
                        >
                            Membentuk Generasi <br/>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-emerald-300">
                                Qur'ani & Intelektual
                            </span>
                        </motion.h1>
                        
                        <motion.p 
                            custom={2}
                            initial="hidden"
                            animate="visible"
                            variants={fadeUpVariants}
                            className="text-lg md:text-xl text-gray-200 mb-10 max-w-2xl leading-relaxed"
                        >
                            Selamat datang di portal resmi <b>{pesantren?.name || 'Pondok Pesantren'}</b>. Kami mengintegrasikan tradisi keilmuan salaf dengan kecakapan modern untuk melahirkan ulama yang intelektual dan intelektual yang ulama.
                        </motion.p>
                        
                        <motion.div 
                            custom={3}
                            initial="hidden"
                            animate="visible"
                            variants={fadeUpVariants}
                            className="flex flex-col sm:flex-row gap-4"
                        >
                            <a href="#profil" className="inline-flex justify-center items-center gap-2 px-8 py-4 rounded-xl bg-accent text-primary font-bold text-lg hover:bg-white transition-colors duration-300 shadow-xl shadow-accent/20">
                                Kenali Kami Lebih Dekat
                                <ArrowRight className="w-5 h-5" />
                            </a>
                            <a href="#program" className="inline-flex justify-center items-center gap-2 px-8 py-4 rounded-xl bg-white/10 backdrop-blur-md text-white border border-white/30 font-bold text-lg hover:bg-white/20 transition-colors duration-300">
                                <PlayCircle className="w-5 h-5" />
                                Video Profil
                            </a>
                        </motion.div>
                    </div>
                </div>

                {/* Scroll Indicator */}
                <motion.div 
                    style={{ opacity: opacityHero }}
                    className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
                >
                    <span className="text-white/60 text-sm font-medium tracking-widest uppercase">Scroll</span>
                    <div className="w-[1px] h-12 bg-gradient-to-b from-white/60 to-transparent"></div>
                </motion.div>
            </section>

            {/* Profil & Visi Misi */}
            <section id="profil" className="py-24 bg-white relative">
                <div className="max-w-7xl mx-auto px-6">
                    <motion.div 
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={fadeUpVariants}
                        className="text-center max-w-3xl mx-auto mb-20"
                    >
                        <h2 className="text-sm font-bold text-primary tracking-widest uppercase mb-3">Tentang Kami</h2>
                        <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Pusat Keunggulan Ilmu Agama dan Sains</h3>
                        <p className="text-lg text-gray-600">
                            Didirikan dengan dedikasi penuh untuk membina umat, pesantren kami terus beradaptasi dengan perkembangan zaman tanpa kehilangan ruh spiritualitas dan tradisi keilmuan pesantren.
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 gap-8">
                        <motion.div 
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            custom={1}
                            variants={fadeUpVariants}
                            className="bg-gray-50 rounded-[2rem] p-10 lg:p-12 border border-gray-100 hover:shadow-xl transition-shadow duration-500 relative overflow-hidden group"
                        >
                            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-20 -mt-20 transition-transform duration-700 group-hover:scale-150"></div>
                            <div className="relative z-10">
                                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-8 shadow-sm text-primary">
                                    <ShieldCheck className="w-8 h-8" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-4">Visi Pondok</h3>
                                <p className="text-lg text-gray-600 leading-relaxed italic">
                                    "{pesantren?.vision || 'Menjadi lembaga pendidikan Islam terkemuka yang inovatif dan unggul dalam mencetak generasi tafaqquh fiddin yang berakhlakul karimah.'}"
                                </p>
                            </div>
                        </motion.div>

                        <motion.div 
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            custom={2}
                            variants={fadeUpVariants}
                            className="bg-primary rounded-[2rem] p-10 lg:p-12 text-white shadow-xl shadow-primary/20 relative overflow-hidden group"
                        >
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-20 -mt-20 transition-transform duration-700 group-hover:scale-150"></div>
                            <div className="relative z-10">
                                <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-8 backdrop-blur-md text-accent">
                                    <GraduationCap className="w-8 h-8" />
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-4">Misi Pondok</h3>
                                <ul className="space-y-4">
                                    {(pesantren?.mission || 'Menyelenggarakan pendidikan agama Islam secara terpadu.\nMembina akhlak dan karakter santri.\nMengembangkan keterampilan bermasyarakat dan IT.').split('\n').map((misi, idx) => (
                                        <li key={idx} className="flex items-start gap-3 text-gray-200">
                                            <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center shrink-0 mt-0.5">
                                                <span className="text-accent text-sm font-bold">{idx + 1}</span>
                                            </div>
                                            <span className="leading-relaxed">{misi.replace(/^\d+\.\s*/, '')}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Program Unggulan */}
            <section id="program" className="py-24 bg-gray-50 border-y border-gray-200/50">
                <div className="max-w-7xl mx-auto px-6">
                    <motion.div 
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeUpVariants}
                        className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16"
                    >
                        <div className="max-w-2xl">
                            <h2 className="text-sm font-bold text-primary tracking-widest uppercase mb-3">Akademik</h2>
                            <h3 className="text-3xl md:text-4xl font-bold text-gray-900">Program Unggulan</h3>
                        </div>
                        <p className="text-gray-600 max-w-md md:text-right">
                            Pilih program studi yang sesuai dengan minat dan bakat, dan mulailah perjalanan akademik yang bermakna bersama kami.
                        </p>
                    </motion.div>

                    <motion.div 
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
                    >
                        {programs.map((prog, idx) => (
                            <motion.div 
                                key={idx}
                                variants={fadeUpVariants}
                                className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
                            >
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${prog.color} group-hover:scale-110 transition-transform duration-300`}>
                                    <prog.icon className="w-7 h-7" />
                                </div>
                                <h4 className="text-xl font-bold text-gray-900 mb-3">{prog.title}</h4>
                                <p className="text-gray-600 text-sm leading-relaxed mb-6">{prog.desc}</p>
                                <a href="#" className="inline-flex items-center gap-1 text-sm font-bold text-primary group-hover:text-primary-light transition-colors">
                                    Pelajari lebih lanjut <ChevronRight className="w-4 h-4" />
                                </a>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Berita Terbaru */}
            <section id="berita" className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <motion.div 
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeUpVariants}
                        className="flex items-center justify-between mb-16"
                    >
                        <div>
                            <h2 className="text-sm font-bold text-primary tracking-widest uppercase mb-3">Informasi</h2>
                            <h3 className="text-3xl md:text-4xl font-bold text-gray-900">Warta Pondok</h3>
                        </div>
                        <a href="#" className="hidden md:inline-flex items-center gap-2 px-6 py-3 rounded-full border border-gray-200 font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
                            Lihat Semua Warta
                        </a>
                    </motion.div>

                    <motion.div 
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="grid md:grid-cols-3 gap-8"
                    >
                        {news.map((item, idx) => (
                            <motion.a 
                                key={idx}
                                href="#"
                                variants={fadeUpVariants}
                                className="group flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100"
                            >
                                <div className="relative aspect-[4/3] overflow-hidden">
                                    <div className="absolute inset-0 bg-gray-900/10 group-hover:bg-transparent transition-colors z-10"></div>
                                    <img 
                                        src={item.image} 
                                        alt={item.title} 
                                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                                    />
                                    <div className="absolute top-4 left-4 z-20">
                                        <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-primary text-xs font-bold rounded-full shadow-sm">Berita</span>
                                    </div>
                                </div>
                                <div className="p-6 flex flex-col flex-1">
                                    <span className="text-xs font-medium text-gray-500 mb-2">{item.date}</span>
                                    <h4 className="text-lg font-bold text-gray-900 leading-snug mb-4 group-hover:text-primary transition-colors">{item.title}</h4>
                                    <div className="mt-auto flex items-center gap-1 text-sm font-bold text-primary">
                                        Baca selengkapnya <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </div>
                            </motion.a>
                        ))}
                    </motion.div>
                    
                    <div className="mt-10 text-center md:hidden">
                        <a href="#" className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-gray-200 font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
                            Lihat Semua Warta
                        </a>
                    </div>
                </div>
            </section>

            {/* Footer / Kontak */}
            <footer id="kontak" className="bg-gray-900 pt-20 pb-10">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
                        <div className="lg:col-span-1 space-y-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-white/10 rounded-xl">
                                    <ApplicationLogo className="h-8 w-8 text-white fill-current" />
                                </div>
                                <div>
                                    <span className="text-xl font-bold text-white tracking-tight">{pesantren?.short_name || 'Ponpes Mawar'}</span>
                                    <span className="block text-[10px] uppercase tracking-widest text-gray-400">Pesantren Modern</span>
                                </div>
                            </div>
                            <p className="text-gray-400 text-sm leading-relaxed">
                                Portal informasi dan layanan akademik terpadu {pesantren?.name || 'Pondok Pesantren'} untuk mencetak generasi unggul berlandaskan Al-Qur'an.
                            </p>
                        </div>

                        <div>
                            <h4 className="text-white font-bold mb-6">Tautan Cepat</h4>
                            <ul className="space-y-3 text-sm">
                                <li><a href="#profil" className="text-gray-400 hover:text-white transition-colors">Profil Pesantren</a></li>
                                <li><a href="#program" className="text-gray-400 hover:text-white transition-colors">Program Studi</a></li>
                                <li><a href="#berita" className="text-gray-400 hover:text-white transition-colors">Warta & Berita</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Galeri Foto</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-white font-bold mb-6">Layanan</h4>
                            <ul className="space-y-3 text-sm">
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Pendaftaran Santri Baru</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Informasi Akademik</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Alumni</a></li>

                            </ul>
                        </div>

                        <div>
                            <h4 className="text-white font-bold mb-6">Hubungi Kami</h4>
                            <ul className="space-y-4 text-sm">
                                <li className="flex items-start gap-3 text-gray-400">
                                    <MapPin className="w-5 h-5 text-gray-500 shrink-0 mt-0.5" />
                                    <span>{pesantren?.address || 'Alamat pondok belum diatur di sistem.'}</span>
                                </li>
                                <li className="flex items-center gap-3 text-gray-400">
                                    <Phone className="w-5 h-5 text-gray-500 shrink-0" />
                                    <span>{pesantren?.phone || '-'}</span>
                                </li>
                                <li className="flex items-center gap-3 text-gray-400">
                                    <Mail className="w-5 h-5 text-gray-500 shrink-0" />
                                    <span>{pesantren?.email || '-'}</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                    
                    <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
                        <p className="text-gray-500 text-sm">
                            &copy; {new Date().getFullYear()} {pesantren?.name || 'Ponpes Mawar'}. All rights reserved.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-primary hover:text-white transition-colors">
                                <span className="sr-only">Facebook</span>
                                {/* Icon placeholder */}
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" /></svg>
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-primary hover:text-white transition-colors">
                                <span className="sr-only">Instagram</span>
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" /></svg>
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-primary hover:text-white transition-colors">
                                <span className="sr-only">YouTube</span>
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                            </a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}

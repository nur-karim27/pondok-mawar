import { Head, Link } from '@inertiajs/react';
import { PageProps } from '@/types';
import { ArrowRight, Calendar, Search, Megaphone, Clock, TrendingUp, Bell, BookOpen, Newspaper, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import GuestLayout from '@/Layouts/GuestLayout';
import { useState } from 'react';

const fallbackNews = [
    { id: 1, title: 'Pendaftaran Santri Baru Tahun Ajaran 2026/2027 Resmi Dibuka', body: 'Pondok Pesantren Mawar dengan bangga mengumumkan pembukaan pendaftaran santri baru untuk tahun ajaran 2026/2027.', published_at: '2026-08-01', cover_image: null, category: 'Pengumuman' },
    { id: 2, title: 'Delegasi Santri Raih Juara Umum MTQ Nasional Tingkat Provinsi', body: 'Torehan prestasi membanggakan kembali diraih oleh santri kami pada ajang MTQ Nasional tingkat provinsi.', published_at: '2026-07-28', cover_image: null, category: 'Prestasi' },
    { id: 3, title: 'Kunjungan Ulama Internasional dan Silaturahmi ke Ponpes Mawar', body: 'Pondok Pesantren Mawar menerima kunjungan kehormatan dari sejumlah ulama dari Timur Tengah.', published_at: '2026-07-15', cover_image: null, category: 'Kegiatan' },
    { id: 4, title: 'Wisuda Tahfidz Angkatan ke-15: 45 Santri Rampung 30 Juz', body: 'Sebanyak 45 santri berhasil menyelesaikan hafalan Al-Quran 30 juz pada wisuda tahfidz angkatan ke-15.', published_at: '2026-07-01', cover_image: null, category: 'Kegiatan' },
    { id: 5, title: 'Program Bahasa Arab Intensif Summer Camp 2026 Dibuka', body: 'Program unggulan bahasa Arab intensif selama 3 pekan siap digelar, terbuka bagi santri maupun pelajar umum.', published_at: '2026-06-20', cover_image: null, category: 'Program' },
    { id: 6, title: 'Ponpes Mawar Terima Kunjungan Delegasi Pesantren Luar Negeri', body: 'Delegasi dari 5 negara berkunjung ke Ponpes Mawar dalam rangka pertukaran pengalaman.', published_at: '2026-06-10', cover_image: null, category: 'Kegiatan' },
];

const categories = ['Semua', 'Pengumuman', 'Prestasi', 'Kegiatan', 'Program'];

const categoryColors: Record<string, string> = {
    'Pengumuman': 'bg-violet-50 text-violet-700 border-violet-200',
    'Prestasi':   'bg-amber-50 text-amber-700 border-amber-200',
    'Kegiatan':   'bg-emerald-50 text-emerald-700 border-emerald-200',
    'Program':    'bg-blue-50 text-blue-700 border-blue-200',
};

const PLACEHOLDER_IMGS = [
    'https://images.unsplash.com/photo-1596489377461-2a149b109e25?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1577884877395-5df79b4a44f3?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1629815049364-77fec3aeb30a?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1542816417-0983c9c9ad53?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=80&w=800',
];

export default function Berita({ pesantren, berita }: PageProps<{ pesantren: any, berita: any }>) {
    const [activeCategory, setActiveCategory] = useState('Semua');
    const [search, setSearch] = useState('');

    const rawData: any[] = berita?.data?.length > 0 ? berita.data : fallbackNews;

    const displayData = rawData
        .filter(item => activeCategory === 'Semua' || item.category === activeCategory)
        .filter(item => !search || item.title?.toLowerCase().includes(search.toLowerCase()));

    const featured = displayData[0];
    const rest = displayData.slice(1);

    const getImg = (item: any, idx: number) => item.cover_image ? `/storage/${item.cover_image}` : PLACEHOLDER_IMGS[idx % PLACEHOLDER_IMGS.length];
    const formatDate = (item: any) => new Date(item.published_at || item.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    const cleanBody = (text?: string) => text ? text.replace(/<[^>]*>?/gm, '') : '';

    return (
        <GuestLayout pesantren={pesantren} canLogin={true} activeNav="berita">
            <Head title="Warta Pondok & Pengumuman" />

            {/* HERO — Magazine Style */}
            <section className="relative pt-32 pb-16 bg-white overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(26,71,49,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(26,71,49,0.02)_1px,transparent_1px)] bg-[size:48px_48px]" />
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-300 to-transparent" />

                <div className="max-w-7xl mx-auto px-5 lg:px-8 relative z-10">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-center gap-3 mb-6">
                        <span className="w-12 h-px bg-violet-300" />
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-50 border border-violet-200">
                            <Newspaper className="w-3.5 h-3.5 text-violet-600" />
                            <span className="text-violet-600 text-xs font-bold tracking-widest uppercase">Edisi Terkini</span>
                        </div>
                        <span className="w-12 h-px bg-violet-300" />
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-center mb-4">
                        <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black tracking-tight text-gray-900 mb-4">
                            Warta <span className="text-violet-700 italic">Pondok</span>
                        </h1>
                        <p className="text-gray-500 text-lg max-w-2xl mx-auto font-light italic">
                            "Menyajikan kabar terkini, liputan mendalam, dan potret kehidupan santri dari jantung{' '}
                            {pesantren?.name || 'Pesantren Mawar'}."
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* FILTER BAR */}
            <section className="bg-white sticky top-16 z-40 border-b border-gray-100 shadow-sm">
                <div className="max-w-7xl mx-auto px-5 lg:px-8">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4">
                        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
                            {categories.map(cat => (
                                <button key={cat} onClick={() => setActiveCategory(cat)}
                                    className={`px-4 py-2 rounded-xl text-xs font-bold tracking-wide whitespace-nowrap transition-all duration-200 border ${
                                        activeCategory === cat
                                            ? 'bg-[#1a4731] text-white border-[#1a4731] shadow-lg shadow-[#1a4731]/20'
                                            : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50 hover:text-gray-900'
                                    }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                        <div className="relative w-full sm:w-64 shrink-0">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Cari artikel..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* CONTENT */}
            <section className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-5 lg:px-8">
                    <AnimatePresence mode="wait">
                        {displayData.length > 0 ? (
                            <motion.div key={activeCategory + search} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                {/* Featured */}
                                {featured && (
                                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
                                        className="group grid lg:grid-cols-12 gap-0 bg-white border border-gray-100 rounded-2xl overflow-hidden mb-8 hover:shadow-xl hover:border-violet-100 transition-all duration-300 shadow-sm"
                                    >
                                        <div className="lg:col-span-7 relative aspect-[16/10] lg:aspect-auto overflow-hidden bg-gradient-to-br from-violet-50 to-indigo-50">
                                            <img src={getImg(featured, 0)} alt={featured.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent lg:hidden" />
                                            <div className="absolute top-5 left-5 px-3 py-1.5 rounded-xl bg-violet-600 text-white text-xs font-black uppercase tracking-widest">
                                                Sorotan Utama
                                            </div>
                                            {featured.category && (
                                                <div className={`absolute top-5 right-5 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wide border ${categoryColors[featured.category] || 'bg-white/90 text-gray-700 border-gray-200'}`}>
                                                    {featured.category}
                                                </div>
                                            )}
                                        </div>
                                        <div className="lg:col-span-5 p-8 lg:p-10 flex flex-col justify-center bg-white">
                                            <div className="flex items-center gap-3 text-xs text-gray-400 font-semibold mb-5">
                                                <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {formatDate(featured)}</span>
                                                <span className="w-1 h-1 rounded-full bg-gray-300" />
                                                <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> 5 Menit Baca</span>
                                            </div>
                                            <h2 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight mb-4 group-hover:text-violet-700 transition-colors">{featured.title}</h2>
                                            <p className="text-gray-500 leading-relaxed text-base mb-8 line-clamp-3">{cleanBody(featured.body || featured.content)}</p>
                                            <Link href="/berita" className="inline-flex items-center gap-2 text-sm font-black text-violet-700 border-b-2 border-violet-200 pb-1 hover:text-violet-900 hover:border-violet-400 transition-all group/link w-max">
                                                Baca Selengkapnya <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                                            </Link>
                                        </div>
                                    </motion.div>
                                )}

                                {rest.length > 0 && (
                                    <div className="grid lg:grid-cols-12 gap-8">
                                        {/* Side articles */}
                                        <div className="lg:col-span-5 space-y-4">
                                            <div className="flex items-center gap-3 mb-5">
                                                <TrendingUp className="w-5 h-5 text-violet-600" />
                                                <h3 className="text-lg font-black text-gray-900 uppercase tracking-widest">Kabar Terkini</h3>
                                            </div>
                                            {rest.slice(0, 3).map((item: any, idx: number) => (
                                                <motion.div key={item.id}
                                                    initial={{ opacity: 0, x: -20 }}
                                                    whileInView={{ opacity: 1, x: 0 }}
                                                    viewport={{ once: true }}
                                                    transition={{ delay: idx * 0.08 }}
                                                    className="group flex gap-4 items-start p-4 rounded-2xl bg-white border border-gray-100 hover:shadow-lg hover:border-violet-100 transition-all duration-200 cursor-pointer shadow-sm"
                                                >
                                                    <div className="w-20 h-20 rounded-xl overflow-hidden bg-violet-50 shrink-0">
                                                        <img src={getImg(item, idx + 1)} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        {item.category && (
                                                            <span className={`inline-block px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest border mb-2 ${categoryColors[item.category] || 'bg-gray-50 text-gray-500 border-gray-200'}`}>
                                                                {item.category}
                                                            </span>
                                                        )}
                                                        <h4 className="text-gray-900 font-bold text-sm leading-snug line-clamp-2 group-hover:text-violet-700 transition-colors mb-1.5">{item.title}</h4>
                                                        <span className="text-gray-400 text-xs font-semibold flex items-center gap-1.5">
                                                            <Calendar className="w-3 h-3" /> {formatDate(item)}
                                                        </span>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>

                                        {/* Grid articles */}
                                        {rest.length > 3 && (
                                            <div className="lg:col-span-7">
                                                <div className="flex items-center gap-3 mb-5">
                                                    <BookOpen className="w-5 h-5 text-violet-600" />
                                                    <h3 className="text-lg font-black text-gray-900 uppercase tracking-widest">Warta Lainnya</h3>
                                                </div>
                                                <div className="grid sm:grid-cols-2 gap-5">
                                                    {rest.slice(3).map((item: any, idx: number) => (
                                                        <motion.div key={item.id}
                                                            initial={{ opacity: 0, y: 20 }}
                                                            whileInView={{ opacity: 1, y: 0 }}
                                                            viewport={{ once: true }}
                                                            transition={{ delay: idx * 0.07 }}
                                                            whileHover={{ y: -4 }}
                                                            className="group bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-xl hover:border-violet-100 transition-all duration-300 shadow-sm"
                                                        >
                                                            <div className="aspect-[16/9] overflow-hidden bg-violet-50 relative">
                                                                <img src={getImg(item, idx + 4)} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                                                {item.category && (
                                                                    <div className={`absolute top-3 left-3 px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest border ${categoryColors[item.category] || 'bg-white/90 text-gray-700 border-gray-200'}`}>
                                                                        {item.category}
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <div className="p-5">
                                                                <span className="text-gray-400 text-xs font-semibold mb-2 flex items-center gap-1.5">
                                                                    <Calendar className="w-3 h-3" /> {formatDate(item)}
                                                                </span>
                                                                <h4 className="text-gray-900 font-bold text-sm leading-snug line-clamp-2 group-hover:text-violet-700 transition-colors mb-3">{item.title}</h4>
                                                                <button className="inline-flex items-center gap-1 text-xs font-bold text-violet-600 group/link">
                                                                    Baca <ChevronRight className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform" />
                                                                </button>
                                                            </div>
                                                        </motion.div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Pagination */}
                                {berita?.links && berita.data?.length > 0 && (
                                    <div className="flex justify-center gap-2 mt-14">
                                        {berita.links.filter((l: any) => l.url).map((link: any, i: number) => (
                                            <Link key={i} href={link.url}
                                                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${link.active ? 'bg-[#1a4731] text-white shadow-lg' : 'bg-white border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        ))}
                                    </div>
                                )}
                            </motion.div>
                        ) : (
                            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                className="bg-white border border-gray-100 border-dashed rounded-3xl py-28 flex flex-col items-center justify-center text-center shadow-sm"
                            >
                                <div className="w-20 h-20 rounded-2xl bg-violet-50 border border-violet-200 flex items-center justify-center mb-6">
                                    <Megaphone className="w-10 h-10 text-violet-300" />
                                </div>
                                <h3 className="text-2xl font-black text-gray-900 mb-2">{search ? 'Tidak Ada Hasil' : 'Belum Ada Berita'}</h3>
                                <p className="text-gray-500 text-lg max-w-sm">{search ? `Tidak ada artikel yang cocok dengan "${search}"` : 'Belum ada warta atau pengumuman.'}</p>
                                {(search || activeCategory !== 'Semua') && (
                                    <button onClick={() => { setSearch(''); setActiveCategory('Semua'); }}
                                        className="mt-6 px-5 py-2.5 rounded-xl bg-violet-50 text-violet-700 font-bold text-sm border border-violet-200 hover:bg-violet-100 transition-all"
                                    >
                                        Reset Filter
                                    </button>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </section>

            {/* Newsletter CTA */}
            <section className="py-20 bg-white relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-200 to-transparent" />
                <div className="max-w-3xl mx-auto px-5 lg:px-8 text-center">
                    <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                        <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-violet-50 border border-violet-200 flex items-center justify-center">
                            <Bell className="w-8 h-8 text-violet-600" />
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-5">
                            Jangan Lewatkan <span className="text-violet-700">Informasi Terbaru</span>
                        </h2>
                        <p className="text-gray-500 text-lg mb-8">Pantau terus kabar terkini dari Pondok Pesantren melalui portal warta pondok kami.</p>
                        <Link href="/" className="inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl bg-[#1a4731] text-white font-bold text-base hover:bg-[#1a4731]/90 transition-all shadow-xl shadow-[#1a4731]/20 hover:-translate-y-0.5 group">
                            Kembali ke Beranda <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </motion.div>
                </div>
            </section>
        </GuestLayout>
    );
}

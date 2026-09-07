import { Head, Link } from '@inertiajs/react';
import { PageProps } from '@/types';
import { Users, Calendar, MapPin, Search, HeartHandshake, Globe2, ArrowRight, Star, Flame, Network } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import GuestLayout from '@/Layouts/GuestLayout';
import { useState } from 'react';

const communityStats = [
    { value: '5.000+', label: 'Alumni Aktif',       icon: Users,  color: 'text-orange-600', bg: 'bg-orange-50 border-orange-200' },
    { value: '34+',   label: 'Provinsi Terjangkau', icon: Globe2, color: 'text-blue-600',   bg: 'bg-blue-50 border-blue-200' },
    { value: '15+',   label: 'Tahun Bersama',       icon: Star,   color: 'text-amber-600',  bg: 'bg-amber-50 border-amber-200' },
    { value: '200+',  label: 'Event Digelar',        icon: Flame,  color: 'text-rose-600',   bg: 'bg-rose-50 border-rose-200' },
];

const statusBadge: Record<string, { label: string; class: string }> = {
    terjadwal:   { label: 'Terjadwal',           class: 'bg-blue-50 text-blue-600 border-blue-200' },
    berlangsung: { label: 'Sedang Berlangsung',  class: 'bg-emerald-50 text-emerald-600 border-emerald-200' },
    selesai:     { label: 'Selesai',             class: 'bg-gray-50 text-gray-500 border-gray-200' },
};

export default function Alumni({ pesantren, kegiatan }: PageProps<{ pesantren: any, kegiatan: any }>) {
    const [search, setSearch] = useState('');

    const filteredKegiatan = kegiatan?.data?.filter((item: any) =>
        !search || item.title?.toLowerCase().includes(search.toLowerCase()) || item.location?.toLowerCase().includes(search.toLowerCase())
    ) ?? [];

    return (
        <GuestLayout pesantren={pesantren} canLogin={true} activeNav="alumni">
            <Head title="IKSAMA & Alumni" />

            {/* HERO */}
            <section className="relative min-h-[75vh] flex items-center overflow-hidden">
                <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=2400&auto=format&fit=crop')] bg-cover bg-center" />
                    <div className="absolute inset-0 bg-gradient-to-b from-[#0f2d1e]/80 via-[#1a4731]/65 to-[#1a4731]/90" />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#0f2d1e]/60 to-transparent" />
                </div>
                <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-orange-400/10 rounded-full blur-[120px]" />

                <div className="relative z-10 max-w-7xl mx-auto px-5 lg:px-8 pt-24 pb-20 w-full">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                                className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/15 border border-white/25 backdrop-blur-xl mb-8"
                            >
                                <HeartHandshake className="w-4 h-4 text-orange-300" />
                                <span className="text-white text-xs font-bold tracking-widest uppercase">Ikatan Alumni & Santri</span>
                            </motion.div>

                            <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.8, ease: 'easeOut' }}
                                className="text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-[1.08] tracking-tight mb-6"
                            >
                                Merajut <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-300 to-rose-300">Ukhuwah</span>,<br />Menebar Berkah
                            </motion.h1>

                            <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.7 }}
                                className="text-white/80 text-lg leading-relaxed font-light mb-8"
                            >
                                Wadah silaturahmi, sinergi, dan kontribusi alumni{' '}
                                <span className="text-white font-semibold">{pesantren?.name || 'Pondok Pesantren Mawar'}</span>{' '}
                                untuk kemajuan agama, nusa, dan bangsa.
                            </motion.p>

                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="flex items-center gap-4">
                                <div className="flex -space-x-3">
                                    {['1535713875002-d1d0cf377fde', '1494790108377-be9c29b29330', '1599566150163-29194dcaad36', '1472099645785-5658abf4ff4e'].map((id, i) => (
                                        <div key={i} className="w-10 h-10 rounded-full border-2 border-[#1a4731] overflow-hidden shadow-lg">
                                            <img src={`https://images.unsplash.com/photo-${id}?auto=format&fit=crop&q=80&w=100`} alt="Alumni" className="w-full h-full object-cover" />
                                        </div>
                                    ))}
                                    <div className="w-10 h-10 rounded-full border-2 border-[#1a4731] bg-orange-100 flex items-center justify-center text-orange-700 font-black text-xs">+5K</div>
                                </div>
                                <div>
                                    <p className="text-white font-bold text-sm">Jaringan alumni yang kuat</p>
                                    <p className="text-white/60 text-xs">tersebar di 34 provinsi Indonesia</p>
                                </div>
                            </motion.div>
                        </div>

                        {/* Mosaic photos */}
                        <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2, duration: 0.8, ease: 'easeOut' }} className="hidden lg:grid grid-cols-2 gap-4">
                            <div className="space-y-4">
                                <div className="rounded-2xl overflow-hidden aspect-square border-2 border-white/20 shadow-xl">
                                    <img src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=600&auto=format&fit=crop" alt="Alumni" className="w-full h-full object-cover" />
                                </div>
                                <div className="rounded-2xl overflow-hidden aspect-[3/2] border-2 border-white/20 shadow-xl">
                                    <img src="https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=80&w=600&auto=format&fit=crop" alt="Alumni" className="w-full h-full object-cover" />
                                </div>
                            </div>
                            <div className="pt-8 space-y-4">
                                <div className="rounded-2xl overflow-hidden aspect-[3/2] border-2 border-white/20 shadow-xl">
                                    <img src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=600&auto=format&fit=crop" alt="Alumni" className="w-full h-full object-cover" />
                                </div>
                                <div className="rounded-2xl overflow-hidden aspect-square border-2 border-white/20 shadow-xl">
                                    <img src="https://images.unsplash.com/photo-1491975474562-1f4e30bc9468?q=80&w=600&auto=format&fit=crop" alt="Alumni" className="w-full h-full object-cover" />
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* STATS */}
            <section className="bg-white py-10">
                <div className="max-w-7xl mx-auto px-5 lg:px-8">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {communityStats.map((s, i) => (
                            <motion.div key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.08 }}
                                className={`flex items-center gap-4 p-5 rounded-2xl border ${s.bg}`}
                            >
                                <div className={`w-11 h-11 rounded-xl ${s.bg} border flex items-center justify-center ${s.color} shrink-0`}>
                                    <s.icon className="w-5 h-5" />
                                </div>
                                <div>
                                    <div className={`text-xl font-black ${s.color}`}>{s.value}</div>
                                    <div className="text-gray-500 text-xs font-semibold">{s.label}</div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* KEGIATAN */}
            <section className="py-20 bg-gray-50 relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-300 to-transparent" />
                <div className="max-w-7xl mx-auto px-5 lg:px-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-50 border border-orange-200 mb-4">
                                <Network className="w-3.5 h-3.5 text-orange-600" />
                                <span className="text-orange-600 text-xs font-bold tracking-widest uppercase">Agenda</span>
                            </div>
                            <h2 className="text-4xl md:text-5xl font-black text-gray-900">Kegiatan IKSAMA</h2>
                        </motion.div>
                        <div className="relative w-full md:w-80 shrink-0">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Cari agenda atau lokasi..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-white border border-gray-200 text-gray-900 placeholder-gray-400 text-sm font-medium focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all"
                            />
                        </div>
                    </div>

                    <AnimatePresence mode="wait">
                        {filteredKegiatan.length > 0 ? (
                            <motion.div key="grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                                {filteredKegiatan.map((item: any, idx: number) => {
                                    const st = statusBadge[item.status] || { label: item.status, class: 'bg-gray-50 text-gray-500 border-gray-200' };
                                    return (
                                        <motion.div key={item.id}
                                            initial={{ opacity: 0, y: 30 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: idx * 0.07 }}
                                            whileHover={{ y: -5 }}
                                            className="group bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-xl hover:border-orange-200 transition-all duration-300 shadow-sm"
                                        >
                                            <div className="aspect-video bg-orange-50 overflow-hidden relative">
                                                {item.cover_image
                                                    ? <img src={`/storage/${item.cover_image}`} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                                    : <div className="w-full h-full flex items-center justify-center"><Globe2 className="w-12 h-12 text-orange-200" /></div>
                                                }
                                                <div className={`absolute top-4 left-4 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wide border ${st.class}`}>
                                                    {st.label}
                                                </div>
                                            </div>
                                            <div className="p-6">
                                                <div className="flex flex-col gap-1.5 mb-4 p-3 rounded-xl bg-gray-50 border border-gray-100">
                                                    <div className="flex items-center gap-2 text-xs font-semibold text-gray-500">
                                                        <Calendar className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                                                        <span>{new Date(item.activity_date || item.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                                                    </div>
                                                    {item.location && (
                                                        <div className="flex items-center gap-2 text-xs font-semibold text-gray-500">
                                                            <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                                                            <span className="line-clamp-1">{item.location}</span>
                                                        </div>
                                                    )}
                                                </div>
                                                <h3 className="text-gray-900 font-bold text-base leading-snug mb-3 group-hover:text-orange-600 transition-colors line-clamp-2">
                                                    {item.title || item.name}
                                                </h3>
                                                {item.description && (
                                                    <p className="text-gray-400 text-sm leading-relaxed line-clamp-2 mb-4">{item.description}</p>
                                                )}
                                                <button className="inline-flex items-center gap-1.5 text-sm font-bold text-orange-600 hover:text-orange-700 transition-colors group/link">
                                                    Detail <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform" />
                                                </button>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </motion.div>
                        ) : (
                            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                className="bg-white border border-gray-100 border-dashed rounded-3xl py-24 flex flex-col items-center justify-center text-center shadow-sm"
                            >
                                <div className="w-20 h-20 rounded-2xl bg-orange-50 border border-orange-200 flex items-center justify-center mb-5">
                                    <Users className="w-9 h-9 text-orange-300" />
                                </div>
                                <h3 className="text-2xl font-black text-gray-900 mb-2">{search ? 'Tidak Ada Hasil' : 'Belum Ada Agenda'}</h3>
                                <p className="text-gray-400 text-base max-w-sm">{search ? `Tidak ada kegiatan yang cocok dengan "${search}"` : 'Jadwal kegiatan perkumpulan alumni akan segera hadir.'}</p>
                                {search && (
                                    <button onClick={() => setSearch('')} className="mt-5 px-5 py-2.5 rounded-xl bg-orange-50 text-orange-600 font-bold text-sm border border-orange-200 hover:bg-orange-100 transition-all">
                                        Hapus Filter
                                    </button>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Pagination */}
                    {kegiatan?.links && filteredKegiatan.length > 0 && (
                        <div className="flex justify-center gap-2 mt-10">
                            {kegiatan.links.filter((l: any) => l.url).map((link: any, i: number) => (
                                <Link key={i} href={link.url}
                                    className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${link.active ? 'bg-[#1a4731] text-white shadow-lg' : 'bg-white border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 bg-white relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-200 to-transparent" />
                <div className="max-w-3xl mx-auto px-5 lg:px-8 text-center">
                    <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                        <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-orange-50 border border-orange-200 flex items-center justify-center">
                            <HeartHandshake className="w-8 h-8 text-orange-600" />
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-5">
                            Bergabung dengan <span className="text-orange-600">IKSAMA</span>
                        </h2>
                        <p className="text-gray-500 text-lg mb-8">Daftarkan diri Anda dan jadilah bagian dari jaringan alumni yang besar dan penuh keberkahan.</p>
                        <a href="#" className="inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl bg-orange-500 text-white font-bold text-base hover:bg-orange-600 transition-all shadow-xl shadow-orange-500/25 hover:-translate-y-0.5 group">
                            Daftar Alumni <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </a>
                    </motion.div>
                </div>
            </section>
        </GuestLayout>
    );
}

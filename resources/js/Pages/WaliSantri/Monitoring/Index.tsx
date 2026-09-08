import React, { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { User, Activity, Award, AlertTriangle, ArrowLeft, Home, BookOpen, Heart, Shield, CheckCircle, Clock, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function AnimatedNumber({ value }: { value: number }) {
    const [display, setDisplay] = useState(0);
    useEffect(() => {
        if (value === 0) { setDisplay(0); return; }
        let start = 0;
        const step = Math.max(1, Math.ceil(value / 30));
        const timer = setInterval(() => {
            start += step;
            if (start >= value) { setDisplay(value); clearInterval(timer); }
            else setDisplay(start);
        }, 30);
        return () => clearInterval(timer);
    }, [value]);
    return <span>{display}</span>;
}

export default function MonitoringSantri({ auth, student }: any) {
    const [activeTab, setActiveTab] = useState('biodata');
    const isWaliSantri = auth.user.role === 'Wali Santri';
    const totalPoints     = student.violations?.reduce((s: number, v: any) => s + (v.points || 0), 0) || 0;
    const unresolvedCount = student.violations?.filter((v: any) => !v.is_resolved).length || 0;
    const resolvedCount   = (student.violations?.length || 0) - unresolvedCount;
    const achievementCount = student.achievements?.length || 0;

    const tabs = [
        { id: 'biodata',     name: 'Biodata',     icon: User   },
        { id: 'prestasi',    name: 'Prestasi',    icon: Award  },
        { id: 'pelanggaran', name: 'Pelanggaran', icon: Shield },
        { id: 'kesehatan',   name: 'Kesehatan',   icon: Heart  },
    ];

    const cardVariants: any = {
        hidden:  { opacity: 0, y: 24 },
        visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.07, duration: 0.4, ease: 'easeOut' } }),
    };

    const stats = [
        { label: 'Prestasi',     value: achievementCount, icon: Award,         from: '#f59e0b', to: '#f97316' },
        { label: 'Total Poin',   value: totalPoints,       icon: AlertTriangle, from: '#ef4444', to: '#dc2626' },
        { label: 'Blm Selesai',  value: unresolvedCount,   icon: Clock,         from: '#f97316', to: '#ea580c' },
        { label: 'Diselesaikan', value: resolvedCount,     icon: CheckCircle,   from: '#22c55e', to: '#16a34a' },
    ];

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-3">
                    {!isWaliSantri && (
                        <Link href={route('monitoring-santri.index')} className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
                            <ArrowLeft className="w-5 h-5 text-gray-600" />
                        </Link>
                    )}
                    <h2 className="font-bold text-xl text-gray-800">Monitoring Santri</h2>
                </div>
            }
        >
            <Head title={`Monitoring — ${student.name}`} />
            <div className="min-h-screen bg-slate-50">

                {/* ── HERO ── */}
                <div className="relative overflow-hidden text-white" style={{ background: 'linear-gradient(135deg, #0f4c75 0%, #1b6ca8 40%, #16a085 75%, #1abc9c 100%)' }}>
                    {/* Animated blobs */}
                    <div className="absolute inset-0 pointer-events-none">
                        <motion.div animate={{ scale: [1,1.25,1], rotate: [0,20,0] }} transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
                            className="absolute -top-20 -right-20 w-80 h-80 rounded-full opacity-20"
                            style={{ background: 'radial-gradient(circle, #74ebd5, transparent)' }} />
                        <motion.div animate={{ scale: [1.1,1,1.1], rotate: [0,-15,0] }} transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
                            className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full opacity-15"
                            style={{ background: 'radial-gradient(circle, #89f7fe, transparent)' }} />
                        <motion.div animate={{ y: [-10, 10, -10] }} transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
                            className="absolute top-1/2 right-1/4 w-40 h-40 rounded-full opacity-10"
                            style={{ background: 'radial-gradient(circle, white, transparent)' }} />
                    </div>

                    <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-28">
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
                            className="flex flex-col sm:flex-row items-center sm:items-end gap-6">
                            {/* Avatar */}
                            <div className="relative shrink-0">
                                <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5 }}>
                                    <div className="absolute inset-0 rounded-3xl blur-lg opacity-50 scale-110"
                                        style={{ background: 'linear-gradient(135deg, #74ebd5, #89f7fe)' }} />
                                    {student.photo ? (
                                        <img src={`/storage/${student.photo}`} alt={student.name}
                                            className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-3xl object-cover border-4 border-white/40 shadow-2xl" />
                                    ) : (
                                        <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-3xl border-4 border-white/40 shadow-2xl flex items-center justify-center text-white text-5xl font-black"
                                            style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)' }}>
                                            {student.name.charAt(0)}
                                        </div>
                                    )}
                                    <div className="absolute -bottom-2 -right-2 px-2.5 py-1 rounded-full text-[10px] font-black border-2 border-white shadow-lg"
                                        style={{ background: student.status === 'aktif' ? '#22c55e' : student.status === 'lulus' ? '#3b82f6' : '#f97316', color: 'white' }}>
                                        {student.status === 'aktif' ? 'Aktif' : student.status === 'lulus' ? 'Lulus' : student.status === 'pindah' ? 'Pindah' : 'Nonaktif'}
                                    </div>
                                </motion.div>
                            </div>
                            {/* Name */}
                            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2, duration: 0.5 }}
                                className="text-center sm:text-left">
                                <p className="text-white/60 text-xs font-bold uppercase tracking-widest mb-1">Profil Santri</p>
                                <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-none drop-shadow-lg">{student.name}</h1>
                                <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-3">
                                    {[
                                        { icon: User,  text: `NIS ${student.nis}` },
                                        ...(student.room ? [{ icon: Home, text: student.room.name }] : []),
                                        ...(student.gender ? [{ icon: User, text: student.gender }] : []),
                                    ].map((item) => {
                                        const Icon = item.icon;
                                        return (
                                            <span key={item.text} className="flex items-center gap-1.5 text-sm text-white/80 bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm border border-white/10 capitalize">
                                                <Icon className="w-3.5 h-3.5" /> {item.text}
                                            </span>
                                        );
                                    })}
                                </div>
                            </motion.div>
                        </motion.div>
                    </div>
                    {/* Curved bottom wave */}
                    <div className="absolute bottom-0 left-0 right-0 h-20 bg-slate-50" style={{ clipPath: 'ellipse(60% 100% at 50% 100%)' }} />
                </div>

                {/* ── FLOATING STAT CARDS ── */}
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10 mb-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                        {stats.map((s, i) => {
                            const Icon = s.icon;
                            return (
                                <motion.div key={s.label} custom={i} initial="hidden" animate="visible" variants={cardVariants}
                                    className="rounded-2xl p-4 text-white relative overflow-hidden"
                                    style={{ background: `linear-gradient(135deg, ${s.from}, ${s.to})`, boxShadow: `0 8px 30px ${s.from}60` }}>
                                    <div className="absolute -top-4 -right-4 w-16 h-16 rounded-full bg-white/20" />
                                    <div className="relative">
                                        <Icon className="w-5 h-5 mb-2 opacity-90" />
                                        <div className="text-3xl font-black leading-none">
                                            <AnimatedNumber value={s.value} />
                                        </div>
                                        <div className="text-[11px] mt-1 font-semibold opacity-80 uppercase tracking-wider">{s.label}</div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>

                {/* ── TAB BAR ── */}
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-1.5 flex gap-1">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            const isActive = activeTab === tab.id;
                            return (
                                <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                                    className="relative flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 overflow-hidden"
                                    style={{ color: isActive ? 'white' : '#6b7280' }}>
                                    {isActive && (
                                        <motion.div layoutId="activeTab" className="absolute inset-0 rounded-xl"
                                            style={{ background: 'linear-gradient(135deg, #0f4c75, #1b6ca8)' }}
                                            transition={{ type: 'spring', stiffness: 400, damping: 35 }} />
                                    )}
                                    <Icon className="relative w-4 h-4" />
                                    <span className="relative hidden sm:inline">{tab.name}</span>
                                    <span className="relative sm:hidden text-xs">{tab.name.substring(0, 4)}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* ── TAB CONTENT ── */}
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
                    <AnimatePresence mode="wait">
                        <motion.div key={activeTab}
                            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.2 }}>

                            {/* BIODATA */}
                            {activeTab === 'biodata' && (
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                    {[
                                        { title: 'Data Pribadi', icon: User, color: '#3b82f6', rows: [
                                            { label: 'Tempat Lahir',    value: student.place_of_birth || '-' },
                                            { label: 'Tanggal Lahir',   value: student.birth_date || '-' },
                                            { label: 'Jenis Kelamin',   value: student.gender ? student.gender.charAt(0).toUpperCase() + student.gender.slice(1) : '-' },
                                            { label: 'Kamar / Asrama',  value: student.room?.name || 'Belum diatur' },
                                            { label: 'Tahun Masuk',     value: student.enrollment_date ? new Date(student.enrollment_date).getFullYear() : '-' },
                                            { label: 'Tahun Keluar',    value: student.graduation_year || 'Masih aktif' },
                                        ]},
                                        { title: 'Akademik & Wali', icon: BookOpen, color: '#8b5cf6', rows: [
                                            { label: 'Jenjang Sekolah', value: student.school_level || '-' },
                                            { label: 'Jenjang Ngaji',   value: student.quran_level || '-' },
                                            { label: 'Nama Wali',       value: student.guardian?.name || '-' },
                                            { label: 'Alamat',          value: student.address || '-' },
                                        ]},
                                    ].map((sec, si) => {
                                        const Icon = sec.icon;
                                        return (
                                            <motion.div key={sec.title} custom={si} initial="hidden" animate="visible" variants={cardVariants}
                                                className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                                                <div className="p-4 flex items-center gap-3 border-b border-gray-50"
                                                    style={{ background: `${sec.color}08` }}>
                                                    <div className="p-2 rounded-xl" style={{ background: `${sec.color}15`, color: sec.color }}>
                                                        <Icon className="w-5 h-5" />
                                                    </div>
                                                    <h3 className="font-bold text-gray-900">{sec.title}</h3>
                                                </div>
                                                <div className="divide-y divide-gray-50">
                                                    {sec.rows.map((row) => (
                                                        <div key={row.label} className="flex items-center justify-between px-5 py-3 hover:bg-gray-50/50 transition-colors">
                                                            <span className="text-sm text-gray-500">{row.label}</span>
                                                            <span className="text-sm font-semibold text-gray-900 text-right ml-4">{row.value}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                                {sec.title === 'Akademik & Wali' && student.history && (
                                                    <div className="p-4 border-t border-gray-50 bg-gray-50/50">
                                                        <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-2">Riwayat Perjalanan</p>
                                                        <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{student.history}</p>
                                                    </div>
                                                )}
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            )}

                            {/* PRESTASI */}
                            {activeTab === 'prestasi' && (
                                student.achievements?.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {student.achievements.map((ach: any, i: number) => (
                                            <motion.div key={ach.id} custom={i} initial="hidden" animate="visible" variants={cardVariants}
                                                className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all hover:-translate-y-0.5 overflow-hidden">
                                                <div className="h-1.5" style={{ background: 'linear-gradient(90deg, #f59e0b, #f97316)' }} />
                                                <div className="p-5 flex gap-4">
                                                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm"
                                                        style={{ background: 'linear-gradient(135deg, #fef3c7, #fed7aa)' }}>
                                                        <Award className="w-6 h-6 text-amber-500" />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-gray-900 mb-1.5">{ach.title}</h4>
                                                        <div className="flex flex-wrap gap-1.5">
                                                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100">{ach.level}</span>
                                                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-100">{ach.category}</span>
                                                            <span className="text-[10px] text-gray-400 flex items-center gap-1"><Clock className="w-3 h-3" />{ach.date}</span>
                                                        </div>
                                                        {ach.description && <p className="text-sm text-gray-500 mt-2">{ach.description}</p>}
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                ) : (
                                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                                        className="bg-white rounded-2xl border border-gray-100 shadow-sm p-16 text-center">
                                        <div className="w-20 h-20 rounded-full bg-amber-50 flex items-center justify-center mx-auto mb-4">
                                            <Star className="w-10 h-10 text-amber-200" />
                                        </div>
                                        <p className="font-bold text-gray-700 text-lg">Belum Ada Prestasi</p>
                                        <p className="text-gray-400 text-sm mt-1">Semangat terus meraih prestasi!</p>
                                    </motion.div>
                                )
                            )}

                            {/* PELANGGARAN */}
                            {activeTab === 'pelanggaran' && (
                                student.violations?.length > 0 ? (
                                    <div className="space-y-3">
                                        {student.violations.map((vio: any, i: number) => {
                                            const diffDays = Math.ceil((new Date().getTime() - new Date(vio.violation_date).getTime()) / (1000 * 60 * 60 * 24));
                                            const isOverdue = !vio.is_resolved && diffDays > 7;
                                            const catColor = vio.category === 'Ringan'
                                                ? { bg: '#fef9c3', text: '#854d0e', border: '#fde68a' }
                                                : vio.category === 'Sedang'
                                                    ? { bg: '#fff7ed', text: '#9a3412', border: '#fed7aa' }
                                                    : { bg: '#fef2f2', text: '#991b1b', border: '#fecaca' };
                                            return (
                                                <motion.div key={vio.id} custom={i} initial="hidden" animate="visible" variants={cardVariants}
                                                    className="bg-white rounded-2xl border shadow-sm hover:shadow-md transition-all overflow-hidden"
                                                    style={{ borderColor: vio.is_resolved ? '#f3f4f6' : isOverdue ? '#fca5a5' : '#e5e7eb' }}>
                                                    <div className="h-1" style={{ background: vio.is_resolved ? 'linear-gradient(90deg, #22c55e, #16a34a)' : isOverdue ? 'linear-gradient(90deg, #ef4444, #dc2626)' : 'linear-gradient(90deg, #f97316, #ea580c)' }} />
                                                    <div className="p-4 sm:p-5">
                                                        <div className="flex items-start gap-4">
                                                            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm"
                                                                style={{ background: vio.is_resolved ? 'linear-gradient(135deg, #dcfce7, #bbf7d0)' : 'linear-gradient(135deg, #fee2e2, #fecaca)' }}>
                                                                {vio.is_resolved ? <CheckCircle className="w-5 h-5 text-green-600" /> : <AlertTriangle className="w-5 h-5 text-red-500" />}
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
                                                                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full border"
                                                                        style={{ background: catColor.bg, color: catColor.text, borderColor: catColor.border }}>{vio.category}</span>
                                                                    {isOverdue && (
                                                                        <motion.span animate={{ opacity: [1, 0.5, 1] }} transition={{ duration: 1.5, repeat: Infinity }}
                                                                            className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-red-100 text-red-700 border border-red-200">
                                                                            Lewat 7 Hari
                                                                        </motion.span>
                                                                    )}
                                                                    {vio.is_resolved && <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-green-50 text-green-700 border border-green-200">Selesai</span>}
                                                                </div>
                                                                <h4 className="font-bold text-gray-900">{vio.violation_name}</h4>
                                                                <p className="text-xs text-gray-400 mt-1 flex items-center gap-1.5">
                                                                    <Clock className="w-3 h-3" />
                                                                    {new Date(vio.violation_date).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                                                                </p>
                                                                {vio.description && <p className="text-sm text-gray-600 mt-2 p-3 rounded-xl bg-gray-50">{vio.description}</p>}
                                                                {vio.is_resolved && vio.punishment && (
                                                                    <div className="mt-2 p-3 rounded-xl border flex gap-2 items-start"
                                                                        style={{ background: '#f0fdf4', borderColor: '#bbf7d0' }}>
                                                                        <CheckCircle className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                                                                        <p className="text-sm text-green-800"><span className="font-bold">Diselesaikan: </span>{vio.punishment}</p>
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <div className="shrink-0 text-center px-3 py-2 rounded-xl border" style={{ background: '#fef2f2', borderColor: '#fecaca' }}>
                                                                <span className="block text-xl font-black text-red-600 leading-none">{vio.points}</span>
                                                                <span className="text-[9px] text-red-400 font-bold uppercase tracking-wider">Poin</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                                        className="bg-white rounded-2xl border border-gray-100 shadow-sm p-16 text-center">
                                        <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4">
                                            <Shield className="w-10 h-10 text-green-200" />
                                        </div>
                                        <p className="font-black text-gray-800 text-2xl">Alhamdulillah!</p>
                                        <p className="text-gray-400 text-sm mt-2">Tidak ada catatan pelanggaran.</p>
                                    </motion.div>
                                )
                            )}

                            {/* KESEHATAN */}
                            {activeTab === 'kesehatan' && (
                                (student.healthRecords || student.health_records)?.length > 0 ? (
                                    <div className="space-y-3">
                                        {(student.healthRecords || student.health_records).map((record: any, i: number) => (
                                            <motion.div key={record.id} custom={i} initial="hidden" animate="visible" variants={cardVariants}
                                                className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden">
                                                <div className="h-1" style={{ background: 'linear-gradient(90deg, #10b981, #059669)' }} />
                                                <div className="p-5 flex gap-4">
                                                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm"
                                                        style={{ background: 'linear-gradient(135deg, #d1fae5, #a7f3d0)' }}>
                                                        <Activity className="w-5 h-5 text-emerald-600" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex items-start justify-between gap-2">
                                                            <h4 className="font-bold text-gray-900">{record.complaint}</h4>
                                                            <span className="text-xs text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full shrink-0 border border-gray-100">{record.date}</span>
                                                        </div>
                                                        <div className="mt-2 space-y-1 text-sm">
                                                            {record.diagnosis && <p><span className="font-semibold text-gray-700">Diagnosis: </span><span className="text-gray-600">{record.diagnosis}</span></p>}
                                                            {record.treatment && <p><span className="font-semibold text-gray-700">Tindakan: </span><span className="text-gray-600">{record.treatment}</span></p>}
                                                            {record.notes    && <p className="text-gray-400 italic text-xs mt-1">{record.notes}</p>}
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                ) : (
                                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                                        className="bg-white rounded-2xl border border-gray-100 shadow-sm p-16 text-center">
                                        <div className="w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-4">
                                            <Heart className="w-10 h-10 text-emerald-200" />
                                        </div>
                                        <p className="font-bold text-gray-700 text-lg">Alhamdulillah, Sehat!</p>
                                        <p className="text-gray-400 text-sm mt-1">Belum ada riwayat kunjungan ke klinik.</p>
                                    </motion.div>
                                )
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

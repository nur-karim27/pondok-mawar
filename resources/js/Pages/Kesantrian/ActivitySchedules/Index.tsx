import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, usePage } from '@inertiajs/react';
import { Plus, Edit2, Trash2, Clock, Bell, BellOff, CheckCircle, Calendar, School, BookMarked, ChevronDown, ChevronUp, Info, Lock, Landmark } from 'lucide-react';
import ScheduleModal from './Partials/ScheduleModal';
import DangerButton from '@/Components/DangerButton';
import SecondaryButton from '@/Components/SecondaryButton';
import Modal from '@/Components/Modal';
import { motion, AnimatePresence } from 'framer-motion';

interface Schedule {
    id: number;
    type: string;
    name: string;
    start_time: string;
    end_time: string | null;
    is_active: boolean;
}

const TYPE_CONFIG: Record<string, {
    label: string;
    color: string;
    bg: string;
    border: string;
    icon: React.ElementType;
    description: string;
    canAdd: boolean;
}> = {
    sholat_jamaah: {
        label: 'Sholat Jamaah',
        color: 'text-emerald-700',
        bg: 'bg-emerald-50',
        border: 'border-emerald-200',
        icon: Bell,
        description: 'Waktu sholat berjamaah. Edit jam sesuai jadwal sholat setempat.',
        canAdd: false,
    },
    kegiatan: {
        label: 'Kegiatan',
        color: 'text-blue-700',
        bg: 'bg-blue-50',
        border: 'border-blue-200',
        icon: Calendar,
        description: 'Kegiatan pesantren lainnya. Bisa ditambah sesuai jadwal dadakan.',
        canAdd: true,
    },
    sekolah: {
        label: 'Sekolah',
        color: 'text-indigo-700',
        bg: 'bg-indigo-50',
        border: 'border-indigo-200',
        icon: School,
        description: 'Jam pelajaran sekolah formal. Bisa disesuaikan jika ada perubahan.',
        canAdd: true,
    },
    madin: {
        label: 'Madin / Ngaji',
        color: 'text-amber-700',
        bg: 'bg-amber-50',
        border: 'border-amber-200',
        icon: BookMarked,
        description: 'Jadwal madin/ngaji (sore & malam). Bisa ditambah jika ada sesi tambahan.',
        canAdd: true,
    },
};

export default function ActivityScheduleIndex({ auth, schedules }: { auth: any; schedules: Schedule[] }) {
    const user = usePage().props.auth.user as any;
    // notif_prefs is now an object mapping schedule_id -> boolean
    const notifPrefs: Record<number, boolean> = user?.notif_prefs ?? {};

    // Role check
    const canManageSchedules = ['Super Admin', 'Kesantrian'].includes(user.role); // can edit/add/delete
    const canToggleSystem = user.role === 'Super Admin'; // ONLY Super Admin can mute system-wide

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);
    const [addType, setAddType] = useState<string>('kegiatan');
    const [scheduleToDelete, setScheduleToDelete] = useState<Schedule | null>(null);
    const [expandedTypes, setExpandedTypes] = useState<Record<string, boolean>>({
        sholat_jamaah: true, kegiatan: true, sekolah: true, madin: true
    });

    const toggleType = (type: string) => setExpandedTypes(prev => ({ ...prev, [type]: !prev[type] }));

    const openAddModal = (type: string) => {
        setAddType(type);
        setSelectedSchedule(null);
        setIsModalOpen(true);
    };

    const openEditModal = (schedule: Schedule) => {
        setSelectedSchedule(schedule);
        setIsModalOpen(true);
    };

    const deleteSchedule = () => {
        if (!scheduleToDelete) return;
        router.delete(route('activity-schedules.destroy', scheduleToDelete.id), {
            preserveScroll: true,
            onSuccess: () => setScheduleToDelete(null),
        });
    };

    const toggleScheduleActive = (schedule: Schedule) => {
        router.put(route('activity-schedules.update', schedule.id), {
            name: schedule.name,
            start_time: schedule.start_time.substring(0, 5),
            end_time: schedule.end_time ? schedule.end_time.substring(0, 5) : '',
            is_active: !schedule.is_active,
        }, { preserveScroll: true });
    };

    // New logic: Update pref for a specific schedule ID
    const updateNotifPref = (scheduleId: number, currentEnabled: boolean) => {
        router.post(route('notifications.updatePrefs'), {
            schedule_id: scheduleId,
            is_enabled: !currentEnabled,
        }, { preserveScroll: true });
    };

    const groupedSchedules = Object.keys(TYPE_CONFIG).reduce((acc, type) => {
        acc[type] = schedules.filter(s => s.type === type);
        return acc;
    }, {} as Record<string, Schedule[]>);

    // Live schedule tracker
    const [currentTime, setCurrentTime] = useState(new Date());
    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 60000);
        return () => clearInterval(timer);
    }, []);

    const isScheduleLive = (startStr: string, endStr: string | null) => {
        if (!startStr) return false;
        
        const now = currentTime;
        const currentMins = now.getHours() * 60 + now.getMinutes();
        
        const [startH, startM] = startStr.split(':').map(Number);
        const startMins = startH * 60 + startM;
        
        // Default duration 30 mins if end time not provided
        let endMins = startMins + 30;
        
        if (endStr) {
            const [endH, endM] = endStr.split(':').map(Number);
            endMins = endH * 60 + endM;
            // Handle overnight schedules (e.g. 23:00 to 02:00)
            if (endMins < startMins) endMins += 24 * 60;
        }

        let checkMins = currentMins;
        // If it's an overnight schedule and current time is past midnight but before end
        if (endMins > 24 * 60 && currentMins < startMins) {
            checkMins += 24 * 60;
        }

        return checkMins >= startMins && checkMins < endMins;
    };

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-bold leading-tight text-gray-800">Jadwal & Notifikasi</h2>}>
            <Head title="Jadwal & Notifikasi" />

            <div className="space-y-6 pb-12">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="px-6 py-5 flex items-center justify-between border-b border-gray-100">
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                Daftar Jadwal
                                {!canManageSchedules && (
                                    <span className="inline-flex items-center gap-1 text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-medium">
                                        <Lock className="w-3 h-3" /> Hanya bisa mengatur notifikasi
                                    </span>
                                )}
                            </h3>
                            <p className="text-sm text-gray-500">
                                {canManageSchedules
                                    ? 'Atur jam jadwal dan pilih notifikasi mana yang ingin Anda terima di perangkat ini.'
                                    : 'Nyalakan/matikan notifikasi untuk masing-masing jadwal di bawah ini.'}
                            </p>
                        </div>
                    </div>

                    <div className="divide-y divide-gray-100">
                        {Object.entries(TYPE_CONFIG).map(([type, cfg]) => {
                            const typeSchedules = groupedSchedules[type] || [];
                            const Ic = cfg.icon;
                            const isExpanded = expandedTypes[type];

                            return (
                                <div key={type}>
                                    {/* Type Header */}
                                    <div className={`flex items-center justify-between px-6 py-3.5 ${cfg.bg}`}>
                                        <button
                                            onClick={() => toggleType(type)}
                                            className="flex items-center gap-3 flex-1 text-left"
                                        >
                                            <div className={`p-1.5 rounded-lg border ${cfg.border} ${cfg.bg}`}>
                                                <Ic className={`w-4 h-4 ${cfg.color}`} />
                                            </div>
                                            <div>
                                                <span className={`font-bold text-sm ${cfg.color}`}>{cfg.label}</span>
                                                <span className="ml-2 text-xs text-gray-400">({typeSchedules.length} jadwal)</span>
                                            </div>
                                            {isExpanded ? <ChevronUp className="w-4 h-4 text-gray-400 ml-2" /> : <ChevronDown className="w-4 h-4 text-gray-400 ml-2" />}
                                        </button>

                                        <div className="flex items-center gap-2 shrink-0">
                                            {canManageSchedules && cfg.canAdd && (
                                                <button
                                                    onClick={() => openAddModal(type)}
                                                    className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg font-medium border ${cfg.border} ${cfg.color} ${cfg.bg} hover:opacity-80 transition-opacity`}
                                                >
                                                    <Plus className="w-3 h-3" /> Tambah
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    {/* Schedule Rows */}
                                    <AnimatePresence initial={false}>
                                        {isExpanded && (
                                            <motion.div
                                                key="content"
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.2 }}
                                                className="overflow-hidden"
                                            >
                                                {typeSchedules.length === 0 ? (
                                                    <div className="px-8 py-4 text-sm text-gray-400 italic">
                                                        Belum ada jadwal untuk kategori ini.
                                                        {canManageSchedules && cfg.canAdd && (
                                                            <button
                                                                onClick={() => openAddModal(type)}
                                                                className="ml-2 text-primary font-medium hover:underline"
                                                            >
                                                                + Tambah sekarang
                                                            </button>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <div className="divide-y divide-gray-50">
                                                        {typeSchedules.map(schedule => {
                                                            // Determine if user has enabled this schedule (default: true if not explicitly false)
                                                            const isPrefEnabled = notifPrefs[schedule.id] !== false;
                                                            const isLive = schedule.is_active && isScheduleLive(schedule.start_time, schedule.end_time);

                                                            return (
                                                                <div 
                                                                    key={schedule.id} 
                                                                    className={`flex items-center justify-between px-8 py-4 transition-all duration-500 border-l-4 ${
                                                                        isLive 
                                                                            ? 'bg-blue-50/50 border-blue-500 animate-[pulse_2s_cubic-bezier(0.4,0,0.6,1)_infinite] shadow-inner' 
                                                                            : 'border-transparent hover:bg-gray-50/60'
                                                                    }`}
                                                                >
                                                                    <div className="flex items-center gap-4 flex-1">
                                                                        {/* Notification Toggle for Current User */}
                                                                        <label className="relative inline-flex items-center cursor-pointer shrink-0 mr-2" title={isPrefEnabled ? "Matikan notifikasi" : "Hidupkan notifikasi"}>
                                                                            <input 
                                                                                type="checkbox" 
                                                                                className="sr-only peer"
                                                                                checked={isPrefEnabled}
                                                                                onChange={() => updateNotifPref(schedule.id, isPrefEnabled)}
                                                                            />
                                                                            <div className={`w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500 ${isLive ? 'shadow-[0_0_10px_rgba(16,185,129,0.5)]' : ''}`}></div>
                                                                        </label>
                                                                        
                                                                        <div>
                                                                            <p className="font-semibold text-gray-800 text-[15px] flex items-center gap-2">
                                                                                {schedule.name}
                                                                                {!schedule.is_active && (
                                                                                    <span className="text-[10px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">Libur</span>
                                                                                )}
                                                                                {isLive && (
                                                                                    <span className="text-[10px] bg-blue-500 text-white px-2 py-0.5 rounded-full font-bold tracking-wider animate-pulse shadow-sm shadow-blue-500/30">SEDANG BERJALAN</span>
                                                                                )}
                                                                            </p>
                                                                            <div className="flex items-center gap-2 mt-1">
                                                                                <Clock className={`w-3.5 h-3.5 ${isLive ? 'text-blue-500 animate-spin-slow' : 'text-gray-400'}`} />
                                                                                <span className={`text-sm font-mono font-bold ${isLive ? 'text-blue-700' : cfg.color}`}>
                                                                                    {schedule.start_time.substring(0, 5)}
                                                                                </span>
                                                                                {schedule.end_time && (
                                                                                    <span className={`text-xs font-medium ${isLive ? 'text-blue-600' : 'text-gray-400'}`}>
                                                                                        s/d {schedule.end_time.substring(0, 5)}
                                                                                    </span>
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                    <div className="flex items-center gap-2 shrink-0">
                                                                        {/* System-level toggle: ONLY Super Admin */}
                                                                        {canToggleSystem && (
                                                                            <div className="flex items-center gap-1.5 shrink-0" title={schedule.is_active ? 'Matikan sistem untuk semua (Liburkan)' : 'Aktifkan sistem untuk semua'}>
                                                                                <label className="relative inline-flex items-center cursor-pointer" title={schedule.is_active ? 'Matikan untuk semua' : 'Aktifkan untuk semua'}>
                                                                                    <input 
                                                                                        type="checkbox" 
                                                                                        className="sr-only peer"
                                                                                        checked={schedule.is_active}
                                                                                        onChange={() => toggleScheduleActive(schedule)}
                                                                                    />
                                                                                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-500"></div>
                                                                                </label>
                                                                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Sistem</span>
                                                                            </div>
                                                                        )}
                                                                        {canManageSchedules && (
                                                                            <>
                                                                                <button
                                                                                    onClick={() => openEditModal(schedule)}
                                                                                    className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                                                                    title="Edit jam/nama jadwal"
                                                                                >
                                                                                    <Edit2 className="w-4 h-4" />
                                                                                </button>
                                                                                {cfg.canAdd && (
                                                                                    <button
                                                                                        onClick={() => setScheduleToDelete(schedule)}
                                                                                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                                                        title="Hapus jadwal"
                                                                                    >
                                                                                        <Trash2 className="w-4 h-4" />
                                                                                    </button>
                                                                                )}
                                                                            </>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                )}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Special Notification for Bendahara & Super Admin */}
                {(user.role === 'Super Admin' || user.role === 'Bendahara') && (
                    <div className="bg-white rounded-2xl shadow-sm border border-emerald-100 overflow-hidden mb-6">
                        {/* Header */}
                        <div className="px-6 py-4 border-b border-emerald-100 bg-emerald-50/50 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600">
                                    <Landmark className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="text-[17px] font-bold text-gray-800">Keuangan & Tagihan</h3>
                                    <p className="text-sm text-gray-500">Notifikasi tunggakan SPP</p>
                                </div>
                            </div>
                        </div>
                        {/* Row */}
                        <div className="flex items-center justify-between px-8 py-4 transition-all duration-500 border-l-4 border-blue-500 bg-blue-50/50 animate-[pulse_2s_cubic-bezier(0.4,0,0.6,1)_infinite] shadow-inner">
                            <div className="flex items-center gap-4 flex-1">
                                <label className="relative inline-flex items-center cursor-pointer shrink-0 mr-2" title={user.receive_billing_notifications ? "Matikan notifikasi" : "Hidupkan notifikasi"}>
                                    <input 
                                        type="checkbox" 
                                        className="sr-only peer"
                                        checked={user.receive_billing_notifications}
                                        onChange={() => {
                                            router.post(route('notifications.billingPrefs'), {
                                                receive_billing_notifications: !user.receive_billing_notifications
                                            }, { preserveScroll: true });
                                        }}
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                                </label>
                                
                                <div>
                                    <p className="font-semibold text-gray-800 text-[15px] flex items-center gap-2">
                                        Notifikasi Tunggakan SPP
                                        <span className="text-[10px] bg-blue-500 text-white px-2 py-0.5 rounded-full font-bold tracking-wider animate-pulse shadow-sm shadow-blue-500/30">SEDANG BERJALAN</span>
                                    </p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <Clock className="w-3.5 h-3.5 text-blue-500 animate-spin-slow" />
                                        <span className="text-sm font-mono font-bold text-blue-700">
                                            24 Jam Non-Stop
                                        </span>
                                        <span className="text-xs font-medium text-blue-600">
                                            (Pemantauan Real-time)
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Info Box - Role-based Guide */}
                <div className="bg-gradient-to-br from-slate-50 to-blue-50 border border-blue-200 rounded-xl p-5">
                    <div className="flex items-start gap-3 mb-4">
                        <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                        <p className="font-bold text-gray-800">Panduan Hak Akses Notifikasi</p>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-xs border-collapse">
                            <thead>
                                <tr className="bg-blue-100 text-blue-800">
                                    <th className="text-left px-3 py-2 rounded-tl-lg font-bold">Role / Hak Akses</th>
                                    <th className="text-center px-3 py-2 font-bold">Edit Jadwal</th>
                                    <th className="text-center px-3 py-2 font-bold">On/Off Notif Sendiri</th>
                                    <th className="text-center px-3 py-2 font-bold">Lihat Keuangan</th>
                                    <th className="text-center px-3 py-2 rounded-tr-lg font-bold">Matikan Semua (Sistem)</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-blue-100">
                                {[
                                    { role: 'Super Admin', edit: true, own: true, fin: true, sys: true },
                                    { role: 'Admin Kesantrian', edit: true, own: true, fin: false, sys: false },
                                    { role: 'Bendahara', edit: false, own: true, fin: true, sys: false },
                                    { role: 'Keamanan', edit: false, own: true, fin: false, sys: false },
                                    { role: 'Wali Santri', edit: false, own: false, fin: false, sys: false, note: 'Tidak dapat mengakses halaman ini' },
                                ].map((r, i) => (
                                    <tr key={i} className={`${user.role === r.role ? 'bg-blue-50 font-semibold' : 'bg-white'} hover:bg-blue-50/50 transition-colors`}>
                                        <td className="px-3 py-2 text-gray-800 flex items-center gap-1.5">
                                            {user.role === r.role && <span className="w-2 h-2 rounded-full bg-blue-500 inline-block"></span>}
                                            {r.role}
                                            {user.role === r.role && <span className="text-[10px] bg-blue-500 text-white px-1.5 rounded font-bold ml-1">Anda</span>}
                                        </td>
                                        <td className="px-3 py-2 text-center">{r.edit ? '✅' : '❌'}</td>
                                        <td className="px-3 py-2 text-center">{r.own ? '✅' : '—'}</td>
                                        <td className="px-3 py-2 text-center">{r.fin ? '✅' : '—'}</td>
                                        <td className="px-3 py-2 text-center">{r.sys ? '✅' : '❌'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-600">
                        <p>🔔 <b>Toggle kiri</b> setiap jadwal = on/off notifikasi <u>untuk akun Anda sendiri</u> (tidak mempengaruhi user lain)</p>
                        <p>🔵 <b>Toggle "Sistem" (Super Admin)</b> = matikan jadwal untuk <u>semua orang</u> (libur/darurat)</p>
                        <p>⏰ <b>Notifikasi</b> otomatis dihapus setelah 1 hari, <u>kecuali</u> notifikasi Keuangan yang hanya bisa dihapus manual</p>
                        <p>✏️ <b>Perubahan edit waktu</b> jadwal berlaku untuk <u>semua user</u> secara otomatis</p>
                    </div>
                </div>

            </div>

            {/* Modals */}
            <ScheduleModal
                show={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                schedule={selectedSchedule}
                defaultType={addType}
            />

            <Modal show={scheduleToDelete !== null} onClose={() => setScheduleToDelete(null)} maxWidth="md">
                <div className="p-6 text-center">
                    <Trash2 className="mx-auto mb-4 text-gray-400 w-12 h-12" />
                    <h3 className="mb-5 text-lg font-normal text-gray-500">
                        Hapus jadwal <b>{scheduleToDelete?.name}</b>?
                    </h3>
                    <div className="flex justify-center gap-3">
                        <SecondaryButton onClick={() => setScheduleToDelete(null)}>Batal</SecondaryButton>
                        <DangerButton onClick={deleteSchedule}>Ya, Hapus</DangerButton>
                    </div>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}

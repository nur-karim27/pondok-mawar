import { Link, usePage, router } from '@inertiajs/react';
import { PropsWithChildren, ReactNode, useState, useEffect, useRef } from 'react';
import { 
    LayoutDashboard, Users, BookOpen, Wallet, 
    Menu, X, FileText, Bell, CheckSquare,
    BookOpenCheck, GraduationCap, ShieldCheck,
    CheckCircle, AlertCircle, Settings, Moon, Sun,
    Mosque, Calendar, School, BookMarked, ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import axios from 'axios';

type NotifCounts = {
    sholat_jamaah: number;
    kegiatan: number;
    sekolah: number;
    madin: number;
    other: number;
    total: number;
};

const ACTIVITY_TYPE_CONFIG: Record<string, { label: string; color: string; bg: string; icon: React.ElementType }> = {
    sholat_jamaah: { label: 'Sholat Jamaah', color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-200', icon: Mosque },
    kegiatan:      { label: 'Kegiatan',       color: 'text-blue-600',    bg: 'bg-blue-50 border-blue-200',    icon: Calendar },
    sekolah:       { label: 'Sekolah',         color: 'text-indigo-600',  bg: 'bg-indigo-50 border-indigo-200', icon: School },
    madin:         { label: 'Madin',           color: 'text-amber-600',   bg: 'bg-amber-50 border-amber-200',  icon: BookMarked },
};

export default function Authenticated({
    header,
    children,
}: PropsWithChildren<{ header?: ReactNode }>) {
    const user = usePage().props.auth.user as any;
    const { url, props } = usePage();
    const flash = (props as any).flash as { success?: string; error?: string } | undefined;
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [flashVisible, setFlashVisible] = useState(false);
    const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});
    const [inAppNotif, setInAppNotif] = useState<any>(null); // For fallback popup

    const notifCounts: NotifCounts = user?.notif_counts ?? { sholat_jamaah: 0, kegiatan: 0, sekolah: 0, madin: 0, other: 0, total: 0 };

    useEffect(() => {
        if (flash?.success || flash?.error) {
            setFlashVisible(true);
            const timer = setTimeout(() => setFlashVisible(false), 4000);
            return () => clearTimeout(timer);
        }
    }, [flash]);

    // Convert base64 VAPID to Uint8Array
    const urlBase64ToUint8Array = (base64String: string) => {
        const padding = '='.repeat((4 - base64String.length % 4) % 4);
        const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);
        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
    };

    // Request Notification permission & Subscribe to Web Push (requires HTTPS)
    useEffect(() => {
        const subscribePush = async () => {
            if (!('serviceWorker' in navigator) || !('PushManager' in window)) return;
            
            try {
                // Register Service Worker
                const registration = await navigator.serviceWorker.register('/sw.js');
                
                // Request permission
                const permission = await Notification.requestPermission();
                if (permission !== 'granted') return;

                // Subscribe to PushManager
                const vapidPublicKey = usePage().props.vapid_public_key as string;
                if (!vapidPublicKey) return;

                const convertedVapidKey = urlBase64ToUint8Array(vapidPublicKey);
                let subscription = await registration.pushManager.getSubscription();
                
                if (!subscription) {
                    subscription = await registration.pushManager.subscribe({
                        userVisibleOnly: true,
                        applicationServerKey: convertedVapidKey
                    });
                }

                // Send subscription to server
                await axios.post(route('push.subscribe'), subscription);
                console.log("Web Push Subscribed Successfully");
            } catch (err) {
                console.error("Service Worker / Push Subscription failed:", err);
            }
        };

        if (window.isSecureContext) {
            subscribePush();
        } else {
            // Warn user if on HTTP local IP
            console.warn("Background Push Notifications require HTTPS or localhost. Currently running in Insecure Context.");
        }
    }, []);

    const playNotificationSound = () => {
        try {
            const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
            if (!AudioContext) return;
            
            const ctx = new AudioContext();
            const osc = ctx.createOscillator();
            const gainNode = ctx.createGain();
            
            osc.connect(gainNode);
            gainNode.connect(ctx.destination);
            
            // Create a pleasant "ding" sound
            osc.type = 'sine';
            osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
            osc.frequency.exponentialRampToValueAtTime(1046.50, ctx.currentTime + 0.1); // Jump to C6
            
            gainNode.gain.setValueAtTime(0, ctx.currentTime);
            gainNode.gain.linearRampToValueAtTime(0.5, ctx.currentTime + 0.05);
            gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1);
            
            osc.start(ctx.currentTime);
            osc.stop(ctx.currentTime + 1);
        } catch (e) {
            console.error("Audio generation failed", e);
        }
    };

    // Polling logic for Push Notifications
    useEffect(() => {
        if (!user || user.role === 'Wali Santri') return;

        const checkNotifications = async () => {
            try {
                const response = await axios.get(route('notifications.poll'));
                const newUnread = response.data.unread || [];
                
                const lastKnownId = localStorage.getItem('last_notif_id');
                if (newUnread.length > 0) {
                    const latest = newUnread[0];
                    if (latest.id !== lastKnownId) {
                        localStorage.setItem('last_notif_id', latest.id);
                        
                        // 1. Selalu mainkan suara notifikasi
                        playNotificationSound();
                        
                        // 2. Trigger Native Notification if allowed & secure
                        if ('Notification' in window && window.isSecureContext && Notification.permission === 'granted') {
                            new Notification(latest.data.title || 'Notifikasi Baru', {
                                body: latest.data.message || 'Ada pemberitahuan baru.',
                                icon: '/favicon.ico'
                            });
                        } else {
                            // 3. Fallback: Show In-App Popup if native is blocked (e.g. HTTP LAN)
                            setInAppNotif(latest);
                            setTimeout(() => setInAppNotif(null), 10000); // hide after 10s
                        }
                        
                        // Soft reload to update the bell icon count
                        router.reload({ only: ['auth'] });
                    }
                }
            } catch (e) {
                console.error('Polling error', e);
            }
        };

        const interval = setInterval(checkNotifications, 10000); // Check every 10s for faster response
        return () => clearInterval(interval);
    }, [user]);

    // Auto-open sidebar groups based on current route
    useEffect(() => {
        const initialOpen: Record<string, boolean> = {};
        navigation.forEach(item => {
            if (item.current) initialOpen[item.name] = true;
        });
        setOpenGroups(initialOpen);
    }, []);

    const toggleGroup = (name: string) => {
        setOpenGroups(prev => ({ ...prev, [name]: !prev[name] }));
    };

    const navigation = [
        { name: 'Dashboard', href: route('dashboard'), icon: LayoutDashboard, current: route().current('dashboard'), roles: ['Super Admin', 'Keamanan', 'Bendahara', 'Wali Santri', 'Kesantrian'] },
        
        { 
            name: 'Keamanan', icon: ShieldCheck, current: route().current('pelanggaran.*') || route().current('perizinan.*') || (route().current('attendances.*') && !route().current('attendances.jamaah.*')), roles: ['Super Admin', 'Keamanan'],
            children: [
                { name: 'Pelanggaran & Poin', href: route('pelanggaran.index'), current: route().current('pelanggaran.*'), roles: ['Super Admin', 'Keamanan'] },
                { name: 'Perizinan', href: route('perizinan.index'), current: route().current('perizinan.*'), roles: ['Super Admin', 'Keamanan'] },
                { name: 'Absensi', href: route('attendances.index'), current: (route().current('attendances.*') && !route().current('attendances.jamaah.*')), roles: ['Super Admin', 'Keamanan'] },
            ]
        },
        
        {
            name: 'Bendahara', icon: Wallet, current: route().current('payments.*') || route().current('tabungan.*') || route().current('kantin.*'), roles: ['Super Admin', 'Bendahara'],
            children: [
                { name: 'Uang Masuk / Rekap', href: route('payments.index'), current: route().current('payments.*'), roles: ['Super Admin', 'Bendahara'] },
                { name: 'Tabungan Santri', href: route('tabungan.index'), current: route().current('tabungan.*'), roles: ['Super Admin', 'Bendahara'] },
                { name: 'Keuangan Kantin', href: route('kantin.index'), current: route().current('kantin.*'), roles: ['Super Admin', 'Bendahara'] },
            ]
        },
        
        {
            name: 'Wali Santri', icon: Users, current: route().current('monitoring-santri.*'), roles: ['Super Admin', 'Wali Santri'],
            children: [
                { name: 'Monitoring Santri', href: route('monitoring-santri.index'), current: route().current('monitoring-santri.*'), roles: ['Super Admin', 'Wali Santri'] },
            ]
        },
        
        {
            name: 'Kesantrian', icon: BookOpenCheck, current: route().current('kesantrian.*') || route().current('prestasi.*') || route().current('kesehatan.*') || route().current('muhafadzoh.*') || route().current('attendances.jamaah.*'), roles: ['Super Admin', 'Kesantrian'],
            children: [
                { name: 'Biodata Santri', href: route('kesantrian.index'), current: route().current('kesantrian.*'), roles: ['Super Admin', 'Kesantrian'] },
                { name: 'Absensi Jamaah (Barcode)', href: route('attendances.jamaah.scan'), current: route().current('attendances.jamaah.*'), roles: ['Super Admin', 'Kesantrian'] },
                { name: 'Evaluasi Muhafadzoh', href: route('muhafadzoh.index'), current: route().current('muhafadzoh.*'), roles: ['Super Admin', 'Kesantrian'] },
                { name: 'Prestasi Santri', href: route('prestasi.index'), current: route().current('prestasi.*'), roles: ['Super Admin', 'Kesantrian'] },
                { name: 'Kesehatan Santri', href: route('kesehatan.index'), current: route().current('kesehatan.*'), roles: ['Super Admin', 'Kesantrian'] },
            ]
        },
        
        { name: 'Kegiatan Alumni/IKSAMA', href: route('kegiatan.index'), icon: GraduationCap, current: route().current('kegiatan.*'), roles: ['Super Admin'] },
        
        {
            name: 'Modul Lainnya', icon: BookOpen, current: route().current('staff.*') || route().current('letters.*') || route().current('announcements.*') || route().current('ai.*'), roles: ['Super Admin', 'Kesantrian'],
            children: [
                { name: 'Asatidz', href: route('staff.index'), current: route().current('staff.*'), roles: ['Super Admin'] },
                { name: 'Surat & Berkas', href: route('letters.index'), current: route().current('letters.*'), roles: ['Super Admin'] },
                { name: 'Pengumuman', href: route('announcements.index'), current: route().current('announcements.*'), roles: ['Super Admin', 'Kesantrian'] },
                { name: 'AI Assistant', href: route('ai.index'), current: route().current('ai.*'), roles: ['Super Admin'] },
            ]
        }
    ].filter(item => item.roles.includes(user.role));

    const showNotifBadges = user.role !== 'Wali Santri';

    return (
        <div className="h-screen bg-background flex flex-col md:flex-row font-sans overflow-hidden">
            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div 
                    className="fixed inset-0 z-40 bg-gray-900/50 backdrop-blur-sm md:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside 
                className={`
                    fixed inset-y-0 left-0 z-50 w-72 bg-primary text-white shadow-xl transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0
                    ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                `}
            >
                <div className="flex h-20 items-center justify-between px-6 border-b border-primary-light/30">
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="p-2 bg-accent/10 rounded-lg group-hover:bg-accent/20 transition-colors">
                            <ApplicationLogo className="h-8 w-8 text-accent fill-current" />
                        </div>
                        <div>
                            <span className="text-2xl font-bold tracking-tight text-white">Ponpes Mawar</span>
                            <span className="block text-[10px] uppercase tracking-widest text-accent font-medium">Sistem Administrasi</span>
                        </div>
                    </Link>
                    <button onClick={() => setSidebarOpen(false)} className="md:hidden text-accent p-2 hover:bg-primary-light rounded-lg">
                        <X className="h-6 w-6" />
                    </button>
                </div>

                <nav className="p-4 space-y-1 overflow-y-auto h-[calc(100vh-5rem)] custom-scrollbar">
                    {navigation.map((item) => (
                        <div key={item.name}>
                            {item.children ? (
                                <div>
                                    <button
                                        onClick={() => toggleGroup(item.name)}
                                        className={`
                                            w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group
                                            ${item.current || openGroups[item.name]
                                                ? 'bg-primary-light text-white font-medium' 
                                                : 'text-gray-300 hover:bg-primary-light hover:text-white'}
                                        `}
                                    >
                                        <div className="flex items-center gap-3">
                                            <item.icon className={`h-5 w-5 ${item.current ? 'text-accent' : 'text-gray-400 group-hover:text-accent'}`} />
                                            {item.name}
                                        </div>
                                        <svg className={`h-4 w-4 transform transition-transform duration-200 ${openGroups[item.name] ? 'rotate-180 text-accent' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                    
                                    {openGroups[item.name] && (
                                        <div className="mt-1 ml-4 pl-4 border-l border-primary-light/50 space-y-1">
                                            {item.children.filter((c: any) => c.roles.includes(user.role)).map((child: any) => (
                                                <Link
                                                    key={child.name}
                                                    href={child.href}
                                                    className={`
                                                        block px-4 py-2 rounded-lg text-sm transition-all duration-200
                                                        ${child.current 
                                                            ? 'bg-accent/20 text-accent font-semibold' 
                                                            : 'text-gray-400 hover:bg-primary-light hover:text-white'}
                                                    `}
                                                >
                                                    {child.name}
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <Link
                                    href={(item as any).href}
                                    className={`
                                        flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group
                                        ${item.current 
                                            ? 'bg-accent text-primary font-semibold shadow-md shadow-accent/20' 
                                            : 'text-gray-300 hover:bg-primary-light hover:text-white'}
                                    `}
                                >
                                    <item.icon className={`h-5 w-5 ${item.current ? 'text-primary' : 'text-accent group-hover:scale-110 transition-transform'}`} />
                                    {item.name}
                                </Link>
                            )}
                        </div>
                    ))}
                </nav>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
                {/* Header */}
                <header className="h-20 bg-white shadow-sm border-b border-gray-100 flex items-center justify-between px-4 sm:px-6 lg:px-8 shrink-0 z-10 sticky top-0">
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={() => setSidebarOpen(true)}
                            className="md:hidden p-2 text-primary hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <Menu className="h-6 w-6" />
                        </button>
                        
                        {header && (
                            <div className="hidden sm:block">
                                {header}
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-2">
                        {/* Notification Bell Dropdown */}
                        <Dropdown>
                            <Dropdown.Trigger>
                                <button className="relative p-2 text-gray-400 hover:text-primary hover:bg-accent/20 rounded-full transition-colors focus:outline-none">
                                    <Bell className="h-5 w-5" />
                                    {notifCounts.total > 0 && (
                                        <span className="absolute top-1 right-1 h-2.5 w-2.5 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
                                    )}
                                </button>
                            </Dropdown.Trigger>

                            <Dropdown.Content align="right" width="80">
                                {/* Notif Header */}
                                <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center bg-gray-50/80">
                                    <p className="text-sm font-semibold text-gray-900">Notifikasi Kegiatan</p>
                                    <div className="flex items-center gap-2">
                                        {notifCounts.total > 0 && (
                                            <button 
                                                onClick={() => router.post(route('notifications.markRead'), {}, { preserveScroll: true })}
                                                className="text-xs text-primary hover:text-primary-light font-medium"
                                            >
                                                Baca semua
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Notification List */}
                                <div className="max-h-64 overflow-y-auto">
                                    {user.unread_notifications && user.unread_notifications.length > 0 ? (
                                        user.unread_notifications.map((notif: any) => {
                                            const actType = notif.data?.activity_type;
                                            const cfg = actType ? ACTIVITY_TYPE_CONFIG[actType] : null;
                                            const Ic = cfg?.icon;
                                            return (
                                                <Link 
                                                    key={notif.id}
                                                    href={notif.data?.url || '#'}
                                                    className="block px-4 py-3 hover:bg-gray-50 border-b border-gray-50 last:border-0 transition-colors"
                                                >
                                                    <div className="flex items-start gap-2">
                                                        {Ic && cfg && (
                                                            <div className={`mt-0.5 p-1 rounded-full ${cfg.bg}`}>
                                                                <Ic className={`w-3 h-3 ${cfg.color}`} />
                                                            </div>
                                                        )}
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-sm font-medium text-gray-800 truncate">{notif.data?.title || notif.data?.message}</p>
                                                            <p className="text-xs text-gray-400 mt-0.5">{new Date(notif.created_at).toLocaleDateString('id-ID', { hour: '2-digit', minute: '2-digit' })}</p>
                                                        </div>
                                                    </div>
                                                </Link>
                                            );
                                        })
                                    ) : (
                                        <div className="px-4 py-6 text-center text-sm text-gray-500">
                                            <Bell className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                                            Tidak ada notifikasi baru.
                                        </div>
                                    )}
                                </div>
                            </Dropdown.Content>
                        </Dropdown>

                        {/* User Dropdown */}
                        <Dropdown>
                            <Dropdown.Trigger>
                                <button className="flex items-center gap-3 p-1.5 rounded-full hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-200 focus:outline-none">
                                    <div className="h-9 w-9 rounded-full bg-primary-light/10 text-primary flex items-center justify-center font-bold text-sm border border-primary/20">
                                        {user.name.charAt(0)}
                                    </div>
                                    <div className="hidden md:flex flex-col items-start text-sm mr-2">
                                        <span className="font-semibold text-gray-700 leading-tight">{user.name}</span>
                                        <span className="text-xs text-gray-500">{user.role || 'User'}</span>
                                    </div>
                                </button>
                            </Dropdown.Trigger>

                            <Dropdown.Content align="right" width="64">
                                <div className="px-4 py-3 border-b border-gray-100">
                                    <p className="text-sm font-semibold text-gray-900 truncate">{user.name}</p>
                                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                                    <span className="inline-block mt-1 text-[11px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">{user.role}</span>
                                </div>
                                <Dropdown.Link href={route('profile.edit')}>⚙️ Pengaturan Profil</Dropdown.Link>
                                {user.role !== 'Wali Santri' && (
                                    <Dropdown.Link href={route('activity-schedules.index')}>🔔 Jadwal &amp; Notifikasi</Dropdown.Link>
                                )}
                                <Dropdown.Link href={route('logout')} method="post" as="button">
                                    🚪 Keluar
                                </Dropdown.Link>
                            </Dropdown.Content>
                        </Dropdown>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-background relative">
                    {/* Flash Notifications */}
                    <AnimatePresence>
                        {flashVisible && (flash?.success || flash?.error) && (
                            <motion.div
                                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                transition={{ duration: 0.3 }}
                                className={`fixed top-6 right-6 z-50 max-w-sm w-full flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl border ${
                                    flash?.success 
                                        ? 'bg-emerald-600 border-emerald-500 text-white shadow-emerald-500/30' 
                                        : 'bg-red-600 border-red-500 text-white shadow-red-500/30'
                                }`}
                            >
                                {flash?.success ? (
                                    <CheckCircle className="w-5 h-5 shrink-0 text-white" />
                                ) : (
                                    <AlertCircle className="w-5 h-5 shrink-0 text-white" />
                                )}
                                <p className="text-sm font-semibold">{flash?.success || flash?.error}</p>
                                <button 
                                    onClick={() => setFlashVisible(false)}
                                    className="ml-auto text-white/70 hover:text-white transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </motion.div>
                        )}

                        {/* In-App Push Notification Fallback (Ultra Modern Glassmorphism) */}
                        {inAppNotif && (
                            <motion.div
                                initial={{ opacity: 0, y: -50, scale: 0.9, filter: 'blur(10px)' }}
                                animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
                                exit={{ opacity: 0, scale: 0.9, filter: 'blur(10px)', transition: { duration: 0.2 } }}
                                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                                className="fixed top-20 right-6 z-50 w-full max-w-sm cursor-pointer overflow-hidden rounded-2xl border border-white/40 bg-white/70 shadow-[0_8px_32px_0_rgba(31,38,135,0.15)] backdrop-blur-xl transition-transform hover:scale-[1.02]"
                                onClick={() => {
                                    setInAppNotif(null);
                                    if(inAppNotif.data?.url) router.visit(inAppNotif.data.url);
                                }}
                            >
                                <div className="relative p-5">
                                    {/* Glowing background accent */}
                                    <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-blue-500/20 blur-2xl"></div>
                                    <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-emerald-500/20 blur-2xl"></div>
                                    
                                    <div className="relative flex items-start justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/30">
                                                <Bell className="h-6 w-6 animate-[wiggle_1s_ease-in-out_infinite]" />
                                            </div>
                                            <div>
                                                <h4 className="text-base font-bold text-gray-900 leading-tight tracking-tight">
                                                    {inAppNotif.data?.title || 'Notifikasi Baru'}
                                                </h4>
                                                <p className="mt-1 text-sm font-medium text-gray-600 leading-snug">
                                                    {inAppNotif.data?.message}
                                                </p>
                                            </div>
                                        </div>
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); setInAppNotif(null); }}
                                            className="rounded-full p-1.5 text-gray-400 transition-colors hover:bg-gray-200/50 hover:text-gray-700"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                                <div className="h-1 w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <motion.div 
                        key={url}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                        className="max-w-7xl mx-auto"
                    >
                        {/* Mobile Header (displayed only if screen is small) */}
                        {header && (
                            <div className="sm:hidden mb-6">
                                {header}
                            </div>
                        )}
                        {children}
                    </motion.div>
                </main>
            </div>
        </div>
    );
}

import { Link, usePage } from '@inertiajs/react';
import { PropsWithChildren, ReactNode, useState } from 'react';
import { 
    LayoutDashboard, Users, BookOpen, UserCheck, Wallet, 
    MessageSquare, Menu, X, FileText, Bell, CheckSquare, BrainCircuit,
    ShieldAlert, FileSignature, CalendarDays, PiggyBank, Coins, Trophy, 
    ActivitySquare, QrCode, BookOpenCheck, GraduationCap, ShieldCheck
} from 'lucide-react';
import { motion } from 'framer-motion';
import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';

export default function Authenticated({
    header,
    children,
}: PropsWithChildren<{ header?: ReactNode }>) {
    const user = usePage().props.auth.user;
    const { url } = usePage();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});

    const toggleGroup = (name: string) => {
        setOpenGroups(prev => ({ ...prev, [name]: !prev[name] }));
    };

    const navigation = [
        { name: 'Dashboard', href: route('dashboard'), icon: LayoutDashboard, current: route().current('dashboard'), roles: ['Super Admin', 'Keamanan', 'Bendahara', 'Wali Santri', 'Kesantrian'] },
        
        { 
            name: 'Keamanan', icon: ShieldCheck, current: route().current('pelanggaran.*') || route().current('perizinan.*') || route().current('attendances.*'), roles: ['Super Admin', 'Keamanan'],
            children: [
                { name: 'Pelanggaran & Poin', href: route('pelanggaran.index'), current: route().current('pelanggaran.*'), roles: ['Super Admin', 'Keamanan'] },
                { name: 'Perizinan', href: route('perizinan.index'), current: route().current('perizinan.*'), roles: ['Super Admin', 'Keamanan'] },
                { name: 'Absensi', href: route('attendances.index'), current: route().current('attendances.*'), roles: ['Super Admin', 'Keamanan'] },
            ]
        },
        
        {
            name: 'Bendahara', icon: Wallet, current: route().current('payments.*') || route().current('tabungan.*'), roles: ['Super Admin', 'Bendahara'],
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
            name: 'Kesantrian', icon: BookOpenCheck, current: route().current('kesantrian.*') || route().current('prestasi.*') || route().current('kesehatan.*'), roles: ['Super Admin', 'Kesantrian'],
            children: [
                { name: 'Biodata Santri', href: route('kesantrian.index'), current: route().current('kesantrian.*'), roles: ['Super Admin', 'Kesantrian'] },
                { name: 'Absensi Jamaah (Barcode)', href: '#', current: false, roles: ['Super Admin', 'Kesantrian'] },
                { name: 'Evaluasi Mukhafadoh', href: '#', current: false, roles: ['Super Admin', 'Kesantrian'] },
                { name: 'Prestasi Santri', href: route('prestasi.index'), current: route().current('prestasi.*'), roles: ['Super Admin', 'Kesantrian'] },
                { name: 'Kesehatan Santri', href: route('kesehatan.index'), current: route().current('kesehatan.*'), roles: ['Super Admin', 'Kesantrian'] },
            ]
        },
        
        { name: 'Kegiatan Alumni/IKSAMA', href: '#', icon: GraduationCap, current: false, roles: ['Super Admin'] },
        
        {
            name: 'Modul Lainnya', icon: BookOpen, current: false, roles: ['Super Admin', 'Kesantrian'],
            children: [
                { name: 'Asatidz', href: route('staff.index'), current: route().current('staff.*'), roles: ['Super Admin'] },
                { name: 'Surat & Berkas', href: route('letters.index'), current: route().current('letters.*'), roles: ['Super Admin'] },
                { name: 'Pengumuman', href: route('announcements.index'), current: route().current('announcements.*'), roles: ['Super Admin', 'Kesantrian'] },
                { name: 'AI Assistant', href: route('ai.index'), current: route().current('ai.*'), roles: ['Super Admin'] },
            ]
        }
    ].filter(item => item.roles.includes(user.role));

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
                                    href={item.href}
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

                    <div className="flex items-center gap-4">
                        <button className="relative p-2 text-gray-400 hover:text-primary hover:bg-accent/20 rounded-full transition-colors">
                            <Bell className="h-5 w-5" />
                            <span className="absolute top-1 right-1 h-2.5 w-2.5 bg-red-500 rounded-full border-2 border-white"></span>
                        </button>

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

                            <Dropdown.Content align="right" width="48">
                                <div className="px-4 py-3 border-b border-gray-100 md:hidden">
                                    <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
                                    <p className="text-sm text-gray-500 truncate">{user.email}</p>
                                </div>
                                <Dropdown.Link href={route('profile.edit')}>Profile Settings</Dropdown.Link>
                                <Dropdown.Link href={route('logout')} method="post" as="button">
                                    Log Out
                                </Dropdown.Link>
                            </Dropdown.Content>
                        </Dropdown>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-background relative">
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

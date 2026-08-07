import { Link, usePage } from '@inertiajs/react';
import { PropsWithChildren, ReactNode, useState } from 'react';
import { 
    LayoutDashboard, Users, BookOpen, UserCheck, Wallet, 
    MessageSquare, Menu, X, FileText, Bell, CheckSquare, BrainCircuit
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

    const navigation = [
        { name: 'Dashboard', href: route('dashboard'), icon: LayoutDashboard, current: route().current('dashboard') },
        { name: 'Kesantrian', href: route('kesantrian.index'), icon: Users, current: route().current('kesantrian.*') },
        { name: 'Asatidz', href: route('staff.index'), icon: BookOpen, current: route().current('staff.*') },
        { name: 'Absensi', href: route('attendances.index'), icon: CheckSquare, current: route().current('attendances.*') },
        { name: 'Keuangan', href: route('payments.index'), icon: Wallet, current: route().current('payments.*') },
        { name: 'Surat & Berkas', href: route('letters.index'), icon: FileText, current: route().current('letters.*') },
        { name: 'Pengumuman', href: route('announcements.index'), icon: MessageSquare, current: route().current('announcements.*') },
        { name: 'AI Assistant', href: route('ai.index'), icon: BrainCircuit, current: route().current('ai.*') },
    ];

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
                            <span className="text-2xl font-bold tracking-tight text-white">PondokKita</span>
                            <span className="block text-[10px] uppercase tracking-widest text-accent font-medium">Sistem Administrasi</span>
                        </div>
                    </Link>
                    <button onClick={() => setSidebarOpen(false)} className="md:hidden text-accent p-2 hover:bg-primary-light rounded-lg">
                        <X className="h-6 w-6" />
                    </button>
                </div>

                <nav className="p-4 space-y-1 overflow-y-auto h-[calc(100vh-5rem)] custom-scrollbar">
                    {navigation.map((item) => (
                        <Link
                            key={item.name}
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

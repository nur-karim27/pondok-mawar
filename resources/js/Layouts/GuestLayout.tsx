import { Link } from '@inertiajs/react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import { useState, useEffect, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, MapPin, Phone, Mail, ArrowRight, Home, BookOpen, Users, Newspaper, LogIn } from 'lucide-react';

interface GuestLayoutProps {
    children: ReactNode;
    pesantren?: any;
    canLogin?: boolean;
    activeNav?: string;
}

const GREEN = '#0C3527';

const navLinks = [
    { name: 'Beranda',      href: '/',              key: 'beranda',  Icon: Home },
    { name: 'Tentang Kami', href: '/tentang-kami',  key: 'tentang',  Icon: Users },
    { name: 'Akademik',     href: '/akademik',      key: 'akademik', Icon: BookOpen },
    { name: 'Alumni',       href: '/alumni',        key: 'alumni',   Icon: Users },
    { name: 'Warta Pondok', href: '/berita',        key: 'berita',   Icon: Newspaper },
];

const bottomNavItems = [
    { name: 'Beranda',  href: '/',              key: 'beranda',  Icon: Home },
    { name: 'Akademik', href: '/akademik',      key: 'akademik', Icon: BookOpen },
    { name: 'Alumni',   href: '/alumni',        key: 'alumni',   Icon: Users },
    { name: 'Warta',    href: '/berita',        key: 'berita',   Icon: Newspaper },
    { name: 'Masuk',    href: '/login',         key: 'masuk',    Icon: LogIn },
];

export default function GuestLayout({ children, pesantren, canLogin = true, activeNav }: GuestLayoutProps) {
    const [scrolled, setScrolled]     = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 60);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return (
        <div className="min-h-screen flex flex-col bg-white text-gray-900 overflow-x-hidden">

            {/* ===================== NAVBAR ===================== */}
            <motion.nav
                initial={{ y: -80, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.7, ease: 'easeOut' }}
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
                    scrolled ? 'py-3 shadow-xl' : 'bg-transparent py-5'
                }`}
                style={scrolled ? { backgroundColor: GREEN } : {}}
            >
                <div className="max-w-7xl mx-auto px-5 lg:px-8 flex items-center justify-between">
                    {/* Logo */}
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shadow-lg">
                            <ApplicationLogo className="h-6 w-6 text-white fill-current" />
                        </div>
                        <div className="leading-tight">
                            <span className="block text-base font-extrabold tracking-tight text-white">
                                {pesantren?.short_name || "Mamba'ul Anwar"}
                            </span>
                            <span className="block text-[10px] text-white/60 font-semibold tracking-widest uppercase">
                                Pesantren Modern
                            </span>
                        </div>
                    </div>

                    {/* Desktop Nav */}
                    <div className="hidden lg:flex items-center gap-1">
                        {navLinks.map(link => (
                            <Link key={link.key} href={link.href}
                                className={`relative px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${
                                    activeNav === link.key
                                        ? 'text-white bg-white/25'
                                        : 'text-white/80 hover:text-white hover:bg-white/15'
                                }`}
                            >
                                {activeNav === link.key && (
                                    <motion.div layoutId="navIndicator" className="absolute inset-0 bg-white/20 rounded-lg" />
                                )}
                                <span className="relative z-10">{link.name}</span>
                            </Link>
                        ))}
                        {canLogin && (
                            <Link href={route('login')}
                                className="relative px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200 text-white/80 hover:text-white hover:bg-white/15"
                            >
                                Masuk
                            </Link>
                        )}
                    </div>

                    {/* Mobile Toggle */}
                    <button onClick={() => setMobileOpen(v => !v)}
                        className="lg:hidden w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center text-white hover:bg-white/25 transition-all"
                    >
                        {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                </div>

                {/* Mobile Dropdown */}
                <AnimatePresence>
                    {mobileOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3, ease: 'easeInOut' }}
                            className="lg:hidden overflow-hidden border-t border-white/10"
                            style={{ backgroundColor: GREEN }}
                        >
                            <div className="px-5 py-4 flex flex-col gap-1">
                                {navLinks.map((link, i) => (
                                    <motion.div key={link.key} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}>
                                        <Link href={link.href} onClick={() => setMobileOpen(false)}
                                            className={`block px-4 py-3 rounded-xl text-base font-semibold transition-all ${
                                                activeNav === link.key ? 'bg-white/20 text-white' : 'text-white/80 hover:text-white hover:bg-white/10'
                                            }`}
                                        >
                                            {link.name}
                                        </Link>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.nav>

            {/* ===================== MAIN CONTENT ===================== */}
            {/* pb-16 lg:pb-0 = ruang untuk mobile bottom nav */}
            <main className="flex-1 pb-16 lg:pb-0">
                {children}
            </main>

            {/* ===================== FOOTER ===================== */}
            <footer className="text-white pt-14 pb-8 pb-safe" style={{ backgroundColor: '#0A2E1F' }}>
                <div className="max-w-7xl mx-auto px-5 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">

                        {/* Brand */}
                        <div className="space-y-5">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center">
                                    <ApplicationLogo className="h-5 w-5 text-white fill-current" />
                                </div>
                                <div>
                                    <span className="block text-base font-extrabold text-white">{pesantren?.short_name || "Mamba'ul Anwar"}</span>
                                    <span className="block text-[10px] text-white/40 font-semibold tracking-widest uppercase">Pesantren Modern</span>
                                </div>
                            </div>
                            <p className="text-white/40 text-sm leading-relaxed">
                                Portal informasi dan layanan akademik terpadu {pesantren?.name || 'Pondok Pesantren Mawar'} untuk mencetak generasi qur'ani dan intelektual.
                            </p>
                            <div className="flex gap-3">
                                {[
                                    { color: 'hover:bg-blue-600', icon: <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" /> },
                                    { color: 'hover:bg-pink-600', icon: <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" /> },
                                    { color: 'hover:bg-red-600', icon: <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /> },
                                ].map((s, i) => (
                                    <a key={i} href="#" className={`w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center text-white/40 hover:text-white ${s.color} transition-all duration-200`}>
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">{s.icon}</svg>
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* Navigasi */}
                        <div>
                            <h4 className="text-white font-bold mb-5 text-xs tracking-widest uppercase">Navigasi</h4>
                            <ul className="space-y-3">
                                {navLinks.map(link => (
                                    <li key={link.key}>
                                        <Link href={link.href} className="text-white/40 text-sm hover:text-white transition-colors flex items-center gap-2 group">
                                            <span className="w-1 h-1 rounded-full bg-white/20 group-hover:bg-white transition-colors" />
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Layanan */}
                        <div>
                            <h4 className="text-white font-bold mb-5 text-xs tracking-widest uppercase">Layanan</h4>
                            <ul className="space-y-3">
                                {['Pendaftaran Santri Baru', 'Informasi Beasiswa', 'Alumni IKSAMA', 'Hubungi Kami'].map(item => (
                                    <li key={item}>
                                        <a href="#" className="text-white/40 text-sm hover:text-white transition-colors flex items-center gap-2 group">
                                            <span className="w-1 h-1 rounded-full bg-white/20 group-hover:bg-white transition-colors" />
                                            {item}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Lokasi Kantor — seperti foto 1 dengan mini map */}
                        <div>
                            <h4 className="text-white font-bold mb-5 text-xs tracking-widest uppercase">Lokasi Kantor</h4>
                            <ul className="space-y-3 mb-4">
                                <li className="flex items-start gap-3 text-white/40 text-sm">
                                    <MapPin className="w-4 h-4 text-white/25 shrink-0 mt-0.5" />
                                    <span>{pesantren?.address || 'Alamat pondok belum diatur.'}</span>
                                </li>
                                {pesantren?.phone && (
                                    <li className="flex items-center gap-3 text-white/40 text-sm">
                                        <Phone className="w-4 h-4 text-white/25 shrink-0" />
                                        <span>{pesantren.phone}</span>
                                    </li>
                                )}
                                {pesantren?.email && (
                                    <li className="flex items-center gap-3 text-white/40 text-sm">
                                        <Mail className="w-4 h-4 text-white/25 shrink-0" />
                                        <span>{pesantren.email}</span>
                                    </li>
                                )}
                            </ul>

                            {/* Mini Map Preview — seperti foto 1 */}
                            <div className="rounded-xl overflow-hidden border border-white/10" style={{ height: 110 }}>
                                <a
                                    href="https://maps.app.goo.gl/7YoQTZarATmQXthK7"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block w-full h-full"
                                    title="Buka di Google Maps"
                                >
                                    <iframe
                                        src="https://maps.google.com/maps?q=Pondok+Pesantren+Mamba%27ul+Anwar&t=&z=14&ie=UTF8&iwloc=&output=embed"
                                        className="w-full h-full border-0"
                                        style={{ pointerEvents: 'none' }}
                                        loading="lazy"
                                        title="Lokasi Pondok Pesantren"
                                    />
                                </a>
                            </div>
                            {/* Link seperti foto 1 */}
                            <a
                                href="https://maps.app.goo.gl/7YoQTZarATmQXthK7"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-2.5 flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors"
                            >
                                <MapPin className="w-3.5 h-3.5" />
                                Petunjuk Arah (Google Maps)
                            </a>
                        </div>
                    </div>

                    {/* Bottom Bar */}
                    <div className="border-t border-white/10 pt-7 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <p className="text-white/25 text-sm">
                            © {new Date().getFullYear()} {pesantren?.name || 'Pondok Pesantren Mawar'}. All rights reserved.
                        </p>
                        <div className="flex items-center gap-1 text-white/25 text-sm">
                            <span>Dibuat dengan</span>
                            <span className="text-emerald-400 mx-1">♥</span>
                            <span>untuk umat</span>
                        </div>
                    </div>
                </div>
            </footer>

            {/* ===================== MOBILE BOTTOM NAVIGATION (seperti foto 3) ===================== */}
            <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
                <div className="flex items-center justify-around py-2 px-2">
                    {bottomNavItems.map(item => {
                        const isActive = activeNav === item.key;
                        const isMasuk  = item.key === 'masuk';
                        return (
                            <Link
                                key={item.key}
                                href={item.href}
                                className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-2xl transition-all duration-200 ${
                                    isActive
                                        ? 'bg-[#E8F4ED]'
                                        : isMasuk
                                            ? 'bg-[#0C3527] rounded-2xl'
                                            : ''
                                }`}
                            >
                                <item.Icon
                                    className="w-5 h-5"
                                    style={{ color: isActive ? GREEN : isMasuk ? 'white' : '#9ca3af' }}
                                />
                                <span
                                    className="text-[9px] font-bold tracking-wide"
                                    style={{ color: isActive ? GREEN : isMasuk ? 'white' : '#9ca3af' }}
                                >
                                    {item.name}
                                </span>
                            </Link>
                        );
                    })}
                </div>
                {/* Safe area for iOS */}
                <div className="h-safe-area-inset-bottom bg-white" />
            </nav>
        </div>
    );
}

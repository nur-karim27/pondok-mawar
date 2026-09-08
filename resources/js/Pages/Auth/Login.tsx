import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import TextInput from '@/Components/TextInput';
import ApplicationLogo from '@/Components/ApplicationLogo';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler, useState, useEffect } from 'react';
import { LogIn, Lock, Eye, EyeOff, User, ChevronLeft, ChevronRight, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const GREEN = '#0C3527';

// ===== 5 Foto Slideshow =====
const SLIDE_PHOTOS = [
    {
        src: 'https://images.unsplash.com/photo-1585036156171-384164a8c675?q=80&w=1200&auto=format&fit=crop',
        caption: 'Tadarus Al-Quran',
        sub: 'Menghafal dengan penuh keikhlasan'
    },
    {
        src: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=1200&auto=format&fit=crop',
        caption: 'Kegiatan Santri',
        sub: 'Belajar bersama dalam suasana islami'
    },
    {
        src: 'https://images.unsplash.com/photo-1596789778044-82d59b23b7f4?q=80&w=1200&auto=format&fit=crop',
        caption: 'Lingkungan Pesantren',
        sub: 'Tempat berkah penuh ilmu dan akhlak'
    },
    {
        src: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=1200&auto=format&fit=crop',
        caption: 'Kebersamaan Santri',
        sub: 'Ukhuwah yang terjalin erat'
    },
    {
        src: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=80&w=1200&auto=format&fit=crop',
        caption: 'Prestasi Membanggakan',
        sub: 'Santri berprestasi di berbagai bidang'
    },
];

function PhotoSlideshow() {
    const [current, setCurrent] = useState(0);
    const [direction, setDirection] = useState(1);

    useEffect(() => {
        const t = setInterval(() => {
            setDirection(1);
            setCurrent(c => (c + 1) % SLIDE_PHOTOS.length);
        }, 10000);
        return () => clearInterval(t);
    }, []);

    const goTo = (idx: number) => { setDirection(idx > current ? 1 : -1); setCurrent(idx); };
    const prev = () => { setDirection(-1); setCurrent(c => (c - 1 + SLIDE_PHOTOS.length) % SLIDE_PHOTOS.length); };
    const next = () => { setDirection(1);  setCurrent(c => (c + 1) % SLIDE_PHOTOS.length); };

    const variants = {
        enter:  (dir: number) => ({ x: dir > 0 ? '100%' : '-100%', opacity: 0 }),
        center: { x: 0, opacity: 1 },
        exit:   (dir: number) => ({ x: dir > 0 ? '-100%' : '100%', opacity: 0 }),
    };

    return (
        <div className="relative w-full h-full overflow-hidden">
            <AnimatePresence custom={direction} initial={false}>
                <motion.div
                    key={current}
                    custom={direction}
                    variants={variants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.6, ease: 'easeInOut' }}
                    className="absolute inset-0"
                >
                    <img
                        src={SLIDE_PHOTOS[current].src}
                        alt={SLIDE_PHOTOS[current].caption}
                        className="w-full h-full object-cover object-center"
                    />
                    {/* Overlay */}
                    <div className="absolute inset-0" style={{ background: `linear-gradient(to top, ${GREEN}DD 0%, ${GREEN}44 40%, transparent 70%)` }} />
                    <div className="absolute inset-0" style={{ background: `linear-gradient(to right, ${GREEN}33, transparent)` }} />
                </motion.div>
            </AnimatePresence>

            {/* Logo di atas kiri */}
            <div className="absolute top-6 left-6 z-10 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <ApplicationLogo className="h-6 w-6 text-white fill-current" />
                </div>
                <div>
                    <p className="text-white font-extrabold text-base leading-none drop-shadow">Mamba'ul Anwar</p>
                    <p className="text-white/60 text-[10px] font-semibold tracking-widest uppercase">Pesantren Modern</p>
                </div>
            </div>

            {/* Caption + dots di bawah (hanya tampil di desktop) */}
            <div className="absolute bottom-0 left-0 right-0 z-10 p-7 hidden lg:block">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={current}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.35 }}
                    >
                        <p className="text-white font-black text-2xl mb-1 drop-shadow-lg">{SLIDE_PHOTOS[current].caption}</p>
                        <p className="text-emerald-200 text-sm font-medium">{SLIDE_PHOTOS[current].sub}</p>
                    </motion.div>
                </AnimatePresence>

                <div className="flex items-center gap-4 mt-5">
                    <div className="flex gap-1.5">
                        {SLIDE_PHOTOS.map((_, i) => (
                            <button key={i} onClick={() => goTo(i)}
                                className={`transition-all duration-300 rounded-full ${current === i ? 'w-8 h-2 bg-emerald-400' : 'w-2 h-2 bg-white/40 hover:bg-white/70'}`}
                            />
                        ))}
                    </div>
                    <div className="flex gap-2 ml-auto">
                        <button onClick={prev} className="w-9 h-9 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-all">
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button onClick={next} className="w-9 h-9 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-all">
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Caption — MOBILE only (tampil di bawah foto) */}
            <div className="absolute bottom-0 left-0 right-0 z-10 px-5 pb-4 lg:hidden">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={current}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <p className="text-white font-black text-base drop-shadow-lg">{SLIDE_PHOTOS[current].caption}</p>
                        <p className="text-emerald-300 text-xs font-medium">{SLIDE_PHOTOS[current].sub}</p>
                    </motion.div>
                </AnimatePresence>
                <div className="flex gap-1.5 mt-2">
                    {SLIDE_PHOTOS.map((_, i) => (
                        <button key={i} onClick={() => goTo(i)}
                            className={`transition-all duration-300 rounded-full ${current === i ? 'w-5 h-1.5 bg-emerald-400' : 'w-1.5 h-1.5 bg-white/40'}`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}



export default function Login({
    status,
    canResetPassword,
}: {
    status?: string;
    canResetPassword: boolean;
}) {
    const [showPassword, setShowPassword] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        password: '',
        remember: false as boolean,
    });

    useEffect(() => {
        const preventFocus = () => {
            if (typeof document !== 'undefined' && document.activeElement?.tagName === 'INPUT') {
                (document.activeElement as HTMLElement).blur();
            }
        };
        preventFocus();
        const t1 = setTimeout(preventFocus, 100);
        const t2 = setTimeout(preventFocus, 400);
        return () => { clearTimeout(t1); clearTimeout(t2); };
    }, []);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'), { onFinish: () => reset('password') });
    };

    return (
        /*
         * MOBILE: flex-col (foto di atas, form card di bawah, sticky bottom nav)
         * DESKTOP: flex-row (foto kiri, form kanan)
         */
        <div className="min-h-screen flex flex-col lg:flex-row bg-white">
            <Head title="Masuk — Portal Pondok" />

            {/* ======== FOTO: Mobile di atas (fixed height), Desktop di kiri (full height) ======== */}
            <div className="relative flex-shrink-0 overflow-hidden"
                style={{
                    /* mobile: 52vw height so it looks like a big hero banner */
                    height: undefined,
                }}
            >
                {/* Mobile: tall hero */}
                <div className="relative lg:hidden overflow-hidden" style={{ height: '52vw', minHeight: '220px', maxHeight: '340px' }}>
                    <PhotoSlideshow />
                </div>
                {/* Desktop: left panel full height */}
                <div className="hidden lg:block lg:w-[55%] lg:h-screen lg:fixed lg:top-0 lg:left-0">
                    <PhotoSlideshow />
                </div>
            </div>

            {/* ======== FORM: Mobile — sliding card from bottom, Desktop — right panel ======== */}

            {/* === MOBILE FORM CARD === */}
            <motion.div
                initial={{ y: 60, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: 'spring', damping: 22, stiffness: 220, delay: 0.1 }}
                className="lg:hidden relative z-20 -mt-6 bg-white rounded-t-3xl shadow-[0_-8px_40px_rgba(0,0,0,0.18)] px-6 pt-5 pb-4"
            >
                {/* Accent gradient line at top of card */}
                <div className="absolute top-0 left-0 right-0 h-1 rounded-t-3xl" style={{ background: 'linear-gradient(90deg, #0C3527, #10b981, #0C3527)' }} />

                {/* Drag handle */}
                <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mt-4 mb-5" />

                {/* Pesantren brand row */}
                <div className="flex items-center gap-3 mb-5 pb-4 border-b border-gray-100">
                    <div className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg" style={{ backgroundColor: '#0C3527' }}>
                        <ApplicationLogo className="h-6 w-6 fill-current text-white" />
                    </div>
                    <div>
                        <p className="font-black text-gray-900 text-sm leading-none">Mamba'ul Anwar</p>
                        <p className="text-gray-400 text-[10px] font-semibold uppercase tracking-widest">Pesantren Modern</p>
                    </div>
                    <Link href="/" className="ml-auto flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 transition-all">
                        <ChevronLeft className="w-3.5 h-3.5" /> Beranda
                    </Link>
                </div>

                {/* Welcome text with icon */}
                <div className="flex items-start gap-3 mb-5">
                    <div className="w-9 h-9 rounded-xl flex-shrink-0 flex items-center justify-center" style={{ backgroundColor: '#E8F4ED' }}>
                        <ShieldCheck className="w-5 h-5" style={{ color: '#0C3527' }} />
                    </div>
                    <div>
                        <h1 className="text-xl font-black text-gray-900 leading-tight">Selamat Datang!</h1>
                        <p className="text-gray-400 text-xs mt-0.5">Portal Santri, Wali & Pengurus Pondok</p>
                    </div>
                </div>

                {/* Info Wali Santri */}
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="mb-4 p-3.5 rounded-xl border border-emerald-200" style={{ background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)' }}>
                    <div className="flex gap-3 items-start">
                        <div className="p-1.5 bg-emerald-500 rounded-lg shrink-0"><User className="w-4 h-4 text-white" /></div>
                        <div>
                            <p className="text-xs font-black text-emerald-900 mb-0.5">Info Khusus Wali Santri</p>
                            <p className="text-[11px] text-emerald-800 leading-relaxed">Masuk dengan <span className="font-bold">Nama Lengkap Anak</span>, dengan sandi: <span className="font-mono font-bold bg-white/60 px-1 py-0.5 rounded border border-emerald-100">password</span>. Sandi dapat diubah di profil.</p>
                        </div>
                    </div>
                </motion.div>

                {/* Status */}
                {status && (
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                        className="mb-4 p-3 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-medium border border-emerald-200"
                    >
                        {status}
                    </motion.div>
                )}

                <form onSubmit={submit} className="space-y-3.5">
                    {/* Nama / Email */}
                    <div>
                        <label htmlFor="name-mobile" className="block text-xs font-bold text-gray-700 mb-1">
                            Nama Lengkap / Email
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                <User className="h-4 w-4 text-gray-400" />
                            </div>
                            <TextInput
                                id="name-mobile"
                                type="text"
                                name="name"
                                value={data.name}
                                className="pl-10 block w-full rounded-xl border-gray-200 bg-gray-50 h-11 text-gray-900 placeholder-gray-400 text-sm focus:border-emerald-600 focus:ring-emerald-600/10 transition-all"
                                autoComplete="username"
                                onChange={e => setData('name', e.target.value)}
                                placeholder="Nama santri atau email admin..."
                            />
                        </div>
                        <InputError message={errors.name} className="mt-1" />
                    </div>

                    {/* Password */}
                    <div>
                        <div className="flex justify-between items-center mb-1">
                            <label htmlFor="password-mobile" className="text-xs font-bold text-gray-700">Kata Sandi</label>
                            {canResetPassword && (
                                <Link href={route('password.request')} className="text-xs font-semibold hover:underline" style={{ color: GREEN }}>
                                    Lupa sandi?
                                </Link>
                            )}
                        </div>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                <Lock className="h-4 w-4 text-gray-400" />
                            </div>
                            <TextInput
                                id="password-mobile"
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                value={data.password}
                                className="pl-10 pr-10 block w-full rounded-xl border-gray-200 bg-gray-50 h-11 text-gray-900 text-sm focus:border-emerald-600 focus:ring-emerald-600/10 transition-all"
                                autoComplete="current-password"
                                onChange={e => setData('password', e.target.value)}
                                placeholder="••••••••"
                            />
                            <button type="button" onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-700 focus:outline-none"
                            >
                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                        <InputError message={errors.password} className="mt-1" />
                    </div>

                    {/* Remember me */}
                    <label className="flex items-center gap-2.5 cursor-pointer">
                        <Checkbox
                            name="remember"
                            checked={data.remember}
                            onChange={e => setData('remember', (e.target.checked || false) as false)}
                            className="rounded w-4 h-4"
                        />
                        <span className="text-xs text-gray-500 select-none">Ingat saya di perangkat ini</span>
                    </label>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full flex items-center justify-center gap-2 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg transition-all duration-200 disabled:opacity-70 text-sm hover:opacity-90 active:scale-[0.99]"
                        style={{ backgroundColor: GREEN }}
                    >
                        {processing ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Memproses...
                            </>
                        ) : (
                            <>
                                <LogIn className="w-4 h-4" />
                                Masuk ke Sistem
                            </>
                        )}
                    </button>
                </form>
            </motion.div>


            {/* ======== DESKTOP FORM — RIGHT PANEL ======== */}
            <div className="hidden lg:flex lg:ml-[55%] flex-1 items-center justify-center overflow-y-auto px-10 lg:px-14 py-6 bg-white min-h-screen">
                <div className="w-full max-w-md">
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.45 }}
                        className="mb-7"
                    >
                        <h1 className="text-3xl lg:text-4xl font-black text-gray-900 mb-1.5">Selamat Datang</h1>
                        <p className="text-gray-500 text-sm">
                            Silakan masuk ke portal{' '}
                            <span className="font-semibold" style={{ color: GREEN }}>Pondok Pesantren Mamba'ul Anwar</span>
                        </p>
                    </motion.div>

                    {/* Info Wali Santri */}
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-6 p-4 rounded-xl border border-emerald-200 shadow-sm" style={{ background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)' }}>
                        <div className="flex gap-3.5 items-start">
                            <div className="p-2 bg-emerald-500 rounded-xl shrink-0"><User className="w-5 h-5 text-white" /></div>
                            <div>
                                <p className="text-sm font-black text-emerald-900 mb-0.5">Info Wali Santri</p>
                                <p className="text-xs text-emerald-800 leading-relaxed">Silakan masuk menggunakan <span className="font-bold">Nama Lengkap Anak Anda</span>, dengan kata sandi bawaan: <span className="font-mono font-bold bg-white/60 px-1.5 py-0.5 rounded shadow-sm border border-emerald-100">password</span>. Anda dapat mengubah sandi di menu profil setelah masuk.</p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Status */}
                    {status && (
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                            className="mb-5 p-4 rounded-xl bg-emerald-50 text-emerald-700 text-sm font-medium border border-emerald-200"
                        >
                            {status}
                        </motion.div>
                    )}

                    <motion.form
                        onSubmit={submit}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.08, duration: 0.45 }}
                        className="space-y-4"
                    >
                        {/* Nama / Email */}
                        <div>
                            <label htmlFor="name" className="block text-sm font-bold text-gray-700 mb-1.5">
                                Nama Lengkap / Email
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <User className="h-5 w-5 text-gray-400" />
                                </div>
                                <TextInput
                                    id="name"
                                    type="text"
                                    name="name"
                                    value={data.name}
                                    className="pl-11 block w-full rounded-xl border-gray-200 bg-gray-50 h-12 text-gray-900 placeholder-gray-400 focus:border-emerald-600 focus:ring-emerald-600/10 transition-all"
                                    autoComplete="username"
                                    onChange={e => setData('name', e.target.value)}
                                    placeholder="Masukkan nama santri atau email admin..."
                                />
                            </div>
                            <InputError message={errors.name} className="mt-1.5" />
                        </div>

                        {/* Password */}
                        <div>
                            <div className="flex justify-between items-center mb-1.5">
                                <label htmlFor="password" className="text-sm font-bold text-gray-700">Kata Sandi</label>
                                {canResetPassword && (
                                    <Link href={route('password.request')} className="text-sm font-semibold hover:underline transition-colors" style={{ color: GREEN }}>
                                        Lupa sandi?
                                    </Link>
                                )}
                            </div>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <TextInput
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={data.password}
                                    className="pl-11 pr-11 block w-full rounded-xl border-gray-200 bg-gray-50 h-12 text-gray-900 focus:border-emerald-600 focus:ring-emerald-600/10 transition-all"
                                    autoComplete="current-password"
                                    onChange={e => setData('password', e.target.value)}
                                    placeholder="••••••••"
                                />
                                <button type="button" onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-700 focus:outline-none transition-colors"
                                >
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                            <InputError message={errors.password} className="mt-1.5" />
                        </div>

                        {/* Remember me */}
                        <div className="flex items-center">
                            <label className="flex items-center cursor-pointer group gap-3">
                                <Checkbox
                                    name="remember"
                                    checked={data.remember}
                                    onChange={e => setData('remember', (e.target.checked || false) as false)}
                                    className="rounded w-4 h-4"
                                />
                                <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors select-none">
                                    Ingat saya di perangkat ini
                                </span>
                            </label>
                        </div>

                        {/* Submit */}
                        <div className="pt-1">
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full flex items-center justify-center gap-2.5 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed text-base hover:opacity-90 active:scale-[0.99]"
                                style={{ backgroundColor: GREEN }}
                            >
                                {processing ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Memproses...
                                    </>
                                ) : (
                                    <>
                                        <LogIn className="w-5 h-5" />
                                        Masuk ke Sistem
                                    </>
                                )}
                            </button>
                        </div>

                        {/* Kembali ke Beranda */}
                        <div className="pt-1">
                            <Link
                                href="/"
                                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 text-sm font-semibold transition-all hover:bg-gray-50"
                                style={{ borderColor: '#e5e7eb', color: '#6b7280' }}
                            >
                                <ChevronLeft className="w-4 h-4" />
                                Kembali ke Beranda
                            </Link>
                        </div>
                    </motion.form>
                </div>
            </div>
        </div>
    );
}

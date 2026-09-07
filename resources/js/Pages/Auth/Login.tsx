import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import TextInput from '@/Components/TextInput';
import ApplicationLogo from '@/Components/ApplicationLogo';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler, useState, useEffect } from 'react';
import { LogIn, Lock, Eye, EyeOff, User, ChevronLeft, ChevronRight } from 'lucide-react';
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

            {/* Caption + dots di bawah */}
            <div className="absolute bottom-0 left-0 right-0 z-10 p-7">
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
        /* h-screen overflow-hidden → pastikan tidak ada scroll */
        <div className="h-screen overflow-hidden flex flex-col lg:flex-row bg-white">
            <Head title="Masuk — Portal Pondok" />

            {/* ======== FOTO: Mobile di atas (h-44), Desktop di kiri (full height) ======== */}
            <div className="relative h-44 sm:h-56 lg:h-full lg:w-[55%] shrink-0 overflow-hidden">
                <PhotoSlideshow />
            </div>

            {/* ======== FORM: kanan (desktop), bawah (mobile) ======== */}
            <div className="flex-1 flex items-center justify-center overflow-y-auto px-6 sm:px-10 lg:px-14 py-6 bg-white">
                <div className="w-full max-w-md">

                    {/* Heading — langsung "Selamat Datang", tanpa badge Portal Akademik */}
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
                                className="w-full flex items-center justify-center gap-2.5 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none text-base hover:opacity-90 active:scale-[0.99]"
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

                        {/* Kembali ke Beranda — di bawah tombol Masuk */}
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

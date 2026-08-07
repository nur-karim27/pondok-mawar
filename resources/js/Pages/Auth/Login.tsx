import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { LogIn, Mail, Lock, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Login({
    status,
    canResetPassword,
}: {
    status?: string;
    canResetPassword: boolean;
}) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false as boolean,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Log in" />

            <div className="mb-8 text-center sm:text-left">
                <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Selamat Datang</h2>
                <p className="text-gray-500">Silakan login ke portal pengurus PondokKita.</p>
            </div>

            {status && (
                <div className="mb-6 p-4 rounded-xl bg-emerald-50 text-emerald-600 text-sm font-medium border border-emerald-100">
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="space-y-5">
                <div>
                    <InputLabel htmlFor="email" value="Alamat Email" className="mb-1 text-gray-700" />
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Mail className="h-5 w-5 text-gray-400" />
                        </div>
                        <TextInput
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            className="pl-11 block w-full rounded-xl border-gray-200 focus:border-primary focus:ring-primary/20 transition-all shadow-sm h-12"
                            autoComplete="username"
                            isFocused={true}
                            onChange={(e) => setData('email', e.target.value)}
                            placeholder="admin@pondokkita.com"
                        />
                    </div>
                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div>
                    <div className="flex justify-between items-center mb-1">
                        <InputLabel htmlFor="password" value="Kata Sandi" className="text-gray-700" />
                        {canResetPassword && (
                            <Link
                                href={route('password.request')}
                                className="text-sm text-primary font-semibold hover:text-primary-light transition-colors"
                            >
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
                            type="password"
                            name="password"
                            value={data.password}
                            className="pl-11 block w-full rounded-xl border-gray-200 focus:border-primary focus:ring-primary/20 transition-all shadow-sm h-12"
                            autoComplete="current-password"
                            onChange={(e) => setData('password', e.target.value)}
                            placeholder="••••••••"
                        />
                    </div>
                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="flex items-center pt-2">
                    <label className="flex items-center cursor-pointer group">
                        <Checkbox
                            name="remember"
                            checked={data.remember}
                            onChange={(e) =>
                                setData('remember', (e.target.checked || false) as false)
                            }
                            className="rounded text-primary focus:ring-primary/20 transition-colors"
                        />
                        <span className="ms-3 text-sm text-gray-600 group-hover:text-gray-900 transition-colors">
                            Ingat saya
                        </span>
                    </label>
                </div>

                <div className="pt-4">
                    <button 
                        type="submit" 
                        disabled={processing}
                        className="w-full flex items-center justify-center gap-2 bg-primary text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-primary/30 hover:bg-primary-light hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                    >
                        {processing ? 'Memproses...' : 'Masuk ke Sistem'}
                        {!processing && <LogIn className="w-5 h-5" />}
                    </button>
                </div>
            </form>
            
            <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                <p className="text-sm text-gray-500">
                    Sistem informasi ini khusus untuk staf dan pengurus. <br className="hidden sm:block" />
                    <Link href="/" className="text-primary font-semibold hover:underline mt-1 inline-block">
                        Kembali ke Halaman Utama
                    </Link>
                </p>
            </div>
        </GuestLayout>
    );
}

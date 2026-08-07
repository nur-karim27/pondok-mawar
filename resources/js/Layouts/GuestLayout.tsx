import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link, usePage } from '@inertiajs/react';
import { PropsWithChildren } from 'react';
import { motion } from 'framer-motion';

export default function Guest({ children }: PropsWithChildren) {
    const { url } = usePage();

    return (
        <div className="min-h-screen flex bg-white font-sans overflow-hidden selection:bg-primary/20 selection:text-primary">
            {/* Left Side - Image/Branding (Hidden on Mobile) */}
            <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-12 overflow-hidden bg-gray-900">
                <div className="absolute inset-0">
                    <img 
                        src="https://images.unsplash.com/photo-1596489377461-2a149b109e25?auto=format&fit=crop&q=80&w=2000" 
                        alt="Pesantren" 
                        className="w-full h-full object-cover opacity-60 mix-blend-overlay"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary/40 opacity-70"></div>
                </div>

                <div className="relative z-10">
                    <Link href="/" className="inline-flex items-center gap-3 bg-white/10 p-3 rounded-2xl backdrop-blur-md border border-white/20 hover:bg-white/20 transition-colors">
                        <ApplicationLogo className="h-10 w-10 text-white fill-current" />
                        <span className="text-2xl font-bold text-white tracking-tight">PondokKita</span>
                    </Link>
                </div>

                <div className="relative z-10 max-w-lg">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.8 }}
                    >
                        <h1 className="text-4xl font-bold text-white mb-6 leading-tight">
                            Sistem Administrasi <br/>
                            <span className="text-accent">Terpadu & Modern</span>
                        </h1>
                        <p className="text-lg text-gray-200 mb-8 leading-relaxed">
                            Akses seluruh fitur pengelolaan akademik, asrama, kesantrian, dan keuangan dalam satu platform yang elegan.
                        </p>
                        
                        <div className="flex items-center gap-4 text-sm text-gray-300 font-medium">
                            <span className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-md border border-white/20">🔒</div>
                                Aman
                            </span>
                            <span className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-md border border-white/20">⚡</div>
                                Cepat
                            </span>
                            <span className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-md border border-white/20">📱</div>
                                Responsif
                            </span>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-12 lg:p-24 relative bg-gray-50/50">
                {/* Mobile Header (Hidden on Desktop) */}
                <div className="absolute top-8 left-8 lg:hidden">
                    <Link href="/" className="flex items-center gap-2 text-primary font-bold">
                        <ApplicationLogo className="h-8 w-8 text-primary fill-current" />
                        PondokKita
                    </Link>
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-20 -mt-20"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl -ml-20 -mb-20"></div>

                <motion.div 
                    key={url}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="w-full max-w-md relative z-10 bg-white p-8 sm:p-10 rounded-[2rem] shadow-xl shadow-gray-200/50 border border-gray-100"
                >
                    {children}
                </motion.div>
            </div>
        </div>
    );
}

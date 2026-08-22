import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link, usePage } from '@inertiajs/react';
import { PropsWithChildren, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Guest({ children }: PropsWithChildren) {
    const { url } = usePage();
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const images = [
        "/images/carousel/media_1787427452427.jpg",
        "/images/carousel/media_1787427452499.jpg",
        "/images/carousel/media_1787427452608.jpg",
        "/images/carousel/media_1787427452647.jpg",
        "/images/carousel/media_1787427452704.jpg"
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prev) => (prev + 1) % images.length);
        }, 10000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="h-screen w-full flex flex-col lg:flex-row bg-gray-50/50 font-sans overflow-hidden selection:bg-primary/20 selection:text-primary">
            {/* Image/Branding Section (Top on mobile, Left on desktop) */}
            <div className="flex w-full h-[45%] lg:h-auto lg:flex-1 relative flex-col justify-between p-6 lg:p-12 overflow-hidden bg-gray-900 z-0">
                <div className="absolute inset-0 bg-gray-900 overflow-hidden">
                    <AnimatePresence mode="popLayout">
                        <motion.div 
                            key={currentImageIndex}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 2.5, ease: "easeInOut" }}
                            className="absolute inset-0 w-full h-full"
                        >
                            {/* Blurred Background to fill empty space */}
                            <img 
                                src={images[currentImageIndex]}
                                alt="" 
                                className="absolute inset-0 w-full h-full object-cover blur-xl opacity-40 scale-125"
                            />
                            {/* Main Image - strictly uncropped on all devices */}
                            <img 
                                src={images[currentImageIndex]}
                                alt="Pesantren"
                                className="relative z-0 w-full h-full object-contain object-top lg:object-center"
                            />
                        </motion.div>
                    </AnimatePresence>
                    {/* Dark overlay so the white text is readable without obscuring the photo too much */}
                    <div className="absolute inset-0 bg-black/40 z-10 pointer-events-none"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent z-10 pointer-events-none"></div>
                </div>

                <div className="relative z-10">
                    <Link href="/" className="inline-flex items-center gap-2 lg:gap-3 bg-white/10 p-2 lg:p-3 rounded-2xl backdrop-blur-md border border-white/20 hover:bg-white/20 transition-colors shadow-lg">
                        <ApplicationLogo className="h-8 w-8 lg:h-10 lg:w-10 text-white fill-current" />
                        <span className="text-xl lg:text-2xl font-bold text-white tracking-tight">Ponpes Mawar</span>
                    </Link>
                </div>
            </div>

            {/* Right Side - Form (Bottom on mobile, Right on desktop) */}
            <div className="flex-1 flex flex-col justify-start lg:justify-center items-center px-4 sm:px-12 lg:p-24 pb-4 lg:pb-12 relative z-20">
                {/* Decorative Elements */}
                <div className="hidden lg:block absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-20 -mt-20"></div>
                <div className="hidden lg:block absolute bottom-0 left-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl -ml-20 -mb-20"></div>

                <motion.div 
                    key={url}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="w-full max-w-md relative z-10 bg-white p-6 sm:p-10 rounded-[2rem] shadow-2xl shadow-gray-200/50 border border-gray-100 -mt-24 lg:mt-0 h-fit"
                >
                    {children}
                </motion.div>
            </div>
        </div>
    );
}

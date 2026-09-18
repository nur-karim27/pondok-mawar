import React, { useState, useEffect, useRef } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { QrCode, ScanLine, Send, AlertCircle, CheckCircle, Camera, Keyboard, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Html5Qrcode } from 'html5-qrcode';

type ScanMode = 'hardware' | 'camera' | 'manual';

export default function JamaahScan({ auth, flash }: any) {
    const [scanMode, setScanMode] = useState<ScanMode>('hardware');
    const inputRef = useRef<HTMLInputElement>(null);
    const [cameraFacingMode, setCameraFacingMode] = useState<'environment' | 'user'>('environment');
    const [isScanning, setIsScanning] = useState(false);
    const html5QrCodeRef = useRef<Html5Qrcode | null>(null);
    const [scannerError, setScannerError] = useState<string | null>(null);

    const { data, setData, post, processing, reset } = useForm({
        nis: '',
        type: 'sholat_jamaah'
    });

    // Auto-focus untuk mode hardware
    useEffect(() => {
        if (scanMode === 'hardware' && inputRef.current) {
            inputRef.current.focus();
        }
    }, [scanMode]);

    // Handle submit (bisa manual, hardware, atau hasil scan kamera)
    const submitAbsensi = (nisValue: string) => {
        if (!nisValue) return;

        // Play beep sound on scan success
        const audio = new Audio('/success-beep.mp3'); // Opsional, bisa diabaikan jika tidak ada file
        audio.play().catch(() => {}); // catch error if no file

        router.post(route('attendances.jamaah.store'), { nis: nisValue, type: data.type }, {
            preserveScroll: true,
            onSuccess: () => {
                reset('nis');
                if (scanMode === 'hardware' && inputRef.current) {
                    inputRef.current.focus();
                }
            }
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        submitAbsensi(data.nis);
    };

    // Bersihkan scanner saat unmount atau ganti mode
    useEffect(() => {
        return () => {
            if (html5QrCodeRef.current && html5QrCodeRef.current.isScanning) {
                html5QrCodeRef.current.stop().catch(console.error);
            }
        };
    }, []);

    // Jalankan Kamera
    useEffect(() => {
        if (scanMode === 'camera') {
            startCamera();
        } else {
            stopCamera();
        }
    }, [scanMode, cameraFacingMode]);

    const startCamera = async () => {
        try {
            setScannerError(null);
            
            if (html5QrCodeRef.current && html5QrCodeRef.current.isScanning) {
                await html5QrCodeRef.current.stop();
            }

            if (!html5QrCodeRef.current) {
                html5QrCodeRef.current = new Html5Qrcode("reader");
            }

            await html5QrCodeRef.current.start(
                { facingMode: cameraFacingMode },
                {
                    fps: 10,
                    qrbox: 250,
                },
                (decodedText) => {
                    setData('nis', decodedText);
                    submitAbsensi(decodedText);
                    
                    // Stop sebentar biar nggak dobel scan terlalu cepat
                    stopCamera();
                    setTimeout(() => startCamera(), 2000);
                },
                (errorMessage) => {
                    // Ignore scan loop errors
                }
            );
            setIsScanning(true);
        } catch (err: any) {
            console.error(err);
            setScannerError("Gagal mengakses kamera. Pastikan browser memberikan izin dan menggunakan HTTPS/Localhost.");
            setIsScanning(false);
        }
    };

    const stopCamera = async () => {
        if (html5QrCodeRef.current && html5QrCodeRef.current.isScanning) {
            try {
                await html5QrCodeRef.current.stop();
                setIsScanning(false);
            } catch (err) {
                console.error(err);
            }
        }
    };

    const toggleCamera = () => {
        setCameraFacingMode(prev => prev === 'environment' ? 'user' : 'environment');
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="text-2xl font-extrabold leading-tight text-gray-900 tracking-tight">Scan Absensi</h2>}
        >
            <Head title="Scan Absensi" />

            <div className="py-12">
                <div className="max-w-3xl mx-auto sm:px-6 lg:px-8 space-y-6">

                    <AnimatePresence>
                        {flash?.success && (
                            <motion.div 
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="p-4 bg-green-50/80 backdrop-blur-sm border border-green-200 rounded-2xl flex items-center gap-3 text-green-700 shadow-sm"
                            >
                                <CheckCircle className="w-5 h-5 shrink-0" />
                                <p className="font-medium">{flash.success}</p>
                            </motion.div>
                        )}

                        {flash?.error && (
                            <motion.div 
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="p-4 bg-red-50/80 backdrop-blur-sm border border-red-200 rounded-2xl flex items-center gap-3 text-red-700 shadow-sm"
                            >
                                <AlertCircle className="w-5 h-5 shrink-0" />
                                <p className="font-medium">{flash.error}</p>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="bg-white/90 backdrop-blur-xl overflow-hidden shadow-xl shadow-gray-200/50 rounded-3xl border border-white/50">
                        <div className="p-8 border-b border-gray-100/80 bg-gradient-to-r from-indigo-50/50 to-white/50 text-center">
                            <motion.div 
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                                className="mx-auto w-20 h-20 bg-indigo-100/80 rounded-full flex items-center justify-center mb-4 shadow-inner"
                            >
                                <ScanLine className="w-10 h-10 text-indigo-600" />
                            </motion.div>
                            <h3 className="text-xl font-bold text-gray-900">Sistem Absensi Terpadu</h3>
                            <p className="text-sm text-gray-500 mt-1">Gunakan scanner alat, kamera HP/Laptop, atau ketik manual.</p>
                        </div>

                        <div className="p-8">
                            <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-8">
                                
                                {/* Mode Selection Tabs */}
                                <div className="flex bg-gray-100 p-1 rounded-2xl">
                                    <button
                                        type="button"
                                        onClick={() => setScanMode('hardware')}
                                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold rounded-xl transition-all ${scanMode === 'hardware' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'}`}
                                    >
                                        <QrCode className="w-4 h-4" />
                                        Alat Scan
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setScanMode('camera')}
                                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold rounded-xl transition-all ${scanMode === 'camera' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'}`}
                                    >
                                        <Camera className="w-4 h-4" />
                                        Kamera
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setScanMode('manual')}
                                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold rounded-xl transition-all ${scanMode === 'manual' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'}`}
                                    >
                                        <Keyboard className="w-4 h-4" />
                                        Manual
                                    </button>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Pilih Jenis Kegiatan</label>
                                    <select
                                        value={data.type}
                                        onChange={(e) => setData('type', e.target.value)}
                                        className="w-full border-gray-300 rounded-xl shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-white/50 backdrop-blur-sm transition-all"
                                    >
                                        <option value="sholat_jamaah">Sholat Jamaah</option>
                                        <option value="kegiatan">Kegiatan</option>
                                        <option value="sekolah">Sekolah</option>
                                        <option value="madin">Madin</option>
                                    </select>
                                </div>

                                {/* Area Konten Dinamis Berdasarkan Mode */}
                                <AnimatePresence mode="wait">
                                    {scanMode === 'hardware' && (
                                        <motion.div
                                            key="hardware"
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            className="space-y-4"
                                        >
                                            <div className="relative overflow-hidden bg-indigo-50/50 border border-indigo-100 rounded-2xl p-8 flex flex-col items-center justify-center h-48">
                                                <QrCode className="w-16 h-16 text-indigo-200 mb-4" />
                                                <p className="text-sm font-medium text-indigo-800 text-center">
                                                    Siap menerima input dari alat scanner.<br/>Arahkan alat ke barcode santri.
                                                </p>
                                                {/* Laser Animation */}
                                                <motion.div 
                                                    animate={{ top: ['0%', '100%', '0%'] }}
                                                    transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                                                    className="absolute left-0 right-0 h-1 bg-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.8)]"
                                                />
                                            </div>

                                            {/* Input ini dibuat transparan atau sangat halus karena user tidak perlu mengetik di sini, alat yang mengetik */}
                                            <input
                                                ref={inputRef}
                                                type="text"
                                                value={data.nis}
                                                onChange={(e) => setData('nis', e.target.value)}
                                                className="w-full text-center border-dashed border-2 border-indigo-200 rounded-xl focus:border-indigo-500 focus:ring-indigo-500 h-12 text-sm text-indigo-700 placeholder-indigo-300 transition-all"
                                                placeholder="[Input Scanner Terekam Di Sini]"
                                                autoFocus
                                            />
                                        </motion.div>
                                    )}

                                    {scanMode === 'camera' && (
                                        <motion.div
                                            key="camera"
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            className="space-y-4"
                                        >
                                            <div className="relative bg-black rounded-2xl overflow-hidden min-h-[300px] flex items-center justify-center border-4 border-gray-100">
                                                <div id="reader" className="w-full"></div>
                                                
                                                {scannerError && (
                                                    <div className="absolute inset-0 bg-black/80 flex items-center justify-center p-6 text-center text-white z-10">
                                                        <div>
                                                            <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
                                                            <p className="text-sm">{scannerError}</p>
                                                        </div>
                                                    </div>
                                                )}

                                                <button
                                                    type="button"
                                                    onClick={toggleCamera}
                                                    className="absolute top-4 right-4 bg-white/20 hover:bg-white/40 backdrop-blur-md p-2 rounded-full text-white transition-all z-20"
                                                    title="Putar Kamera"
                                                >
                                                    <RotateCcw className="w-5 h-5" />
                                                </button>
                                            </div>
                                            <p className="text-xs text-center text-gray-500">Arahkan barcode ke tengah area kamera.</p>
                                        </motion.div>
                                    )}

                                    {scanMode === 'manual' && (
                                        <motion.div
                                            key="manual"
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            className="space-y-4"
                                        >
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                    <Keyboard className="h-5 w-5 text-gray-400" />
                                                </div>
                                                <input
                                                    type="text"
                                                    value={data.nis}
                                                    onChange={(e) => setData('nis', e.target.value)}
                                                    placeholder="Ketik NIS santri manual..."
                                                    className="pl-11 w-full border-gray-300 rounded-xl shadow-sm focus:border-indigo-500 focus:ring-indigo-500 h-14 text-lg bg-white/50 backdrop-blur-sm transition-all"
                                                />
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Tombol Submit Khusus Mode Manual/Error */}
                                <button
                                    type="submit"
                                    disabled={processing || !data.nis}
                                    className={`w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl text-base font-bold text-white shadow-md transition-all border focus:ring-2 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed
                                        ${scanMode === 'camera' ? 'hidden' : 'bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 shadow-indigo-500/30 border-indigo-600/50 focus:ring-indigo-500'}
                                    `}
                                >
                                    <Send className="w-5 h-5" />
                                    {processing ? 'Memproses...' : 'Catat Kehadiran Manual'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

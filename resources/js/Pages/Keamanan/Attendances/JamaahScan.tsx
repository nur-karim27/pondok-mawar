import React, { useState, useEffect, useRef } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { QrCode, ScanLine, Send, AlertCircle, CheckCircle } from 'lucide-react';

export default function JamaahScan({ auth, flash }: any) {
    const [scanMode, setScanMode] = useState(true);
    const inputRef = useRef<HTMLInputElement>(null);

    const { data, setData, post, processing, reset } = useForm({
        nis: '',
        type: 'asrama' // Default ke absensi asrama/jamaah
    });

    useEffect(() => {
        if (scanMode && inputRef.current) {
            inputRef.current.focus();
        }
    }, [scanMode]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!data.nis) return;

        post(route('attendances.jamaah.store'), {
            preserveScroll: true,
            onSuccess: () => {
                reset('nis');
                if (scanMode && inputRef.current) {
                    inputRef.current.focus();
                }
            }
        });
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="text-2xl font-extrabold leading-tight text-gray-900 tracking-tight">Scan Barcode Jamaah</h2>}
        >
            <Head title="Scan Barcode Jamaah" />

            <div className="py-12">
                <div className="max-w-3xl mx-auto sm:px-6 lg:px-8 space-y-6">

                    {flash?.success && (
                        <div className="p-4 bg-green-50/80 backdrop-blur-sm border border-green-200 rounded-2xl flex items-center gap-3 text-green-700 shadow-sm animate-in fade-in slide-in-from-top-4">
                            <CheckCircle className="w-5 h-5" />
                            <p className="font-medium">{flash.success}</p>
                        </div>
                    )}

                    {flash?.error && (
                        <div className="p-4 bg-red-50/80 backdrop-blur-sm border border-red-200 rounded-2xl flex items-center gap-3 text-red-700 shadow-sm animate-in fade-in slide-in-from-top-4">
                            <AlertCircle className="w-5 h-5" />
                            <p className="font-medium">{flash.error}</p>
                        </div>
                    )}

                    <div className="bg-white/90 backdrop-blur-xl overflow-hidden shadow-xl shadow-gray-200/50 rounded-3xl border border-white/50">
                        <div className="p-8 border-b border-gray-100/80 bg-gradient-to-r from-indigo-50/50 to-white/50 text-center">
                            <div className="mx-auto w-20 h-20 bg-indigo-100/80 rounded-full flex items-center justify-center mb-4 shadow-inner">
                                <ScanLine className="w-10 h-10 text-indigo-600" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900">Sistem Absensi Barcode</h3>
                            <p className="text-sm text-gray-500 mt-1">Gunakan scanner barcode atau masukkan NIS secara manual.</p>
                        </div>

                        <div className="p-8">
                            <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Pilih Jenis Absensi</label>
                                    <select
                                        value={data.type}
                                        onChange={(e) => setData('type', e.target.value)}
                                        className="w-full border-gray-300 rounded-xl shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-white/50 backdrop-blur-sm transition-all"
                                    >
                                        <option value="asrama">Jamaah Asrama</option>
                                        <option value="kegiatan">Kegiatan Pesantren</option>
                                        <option value="sekolah">Sekolah / Madin</option>
                                        <option value="ngaji">Ngaji Kitab</option>
                                    </select>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <label className="block text-sm font-medium text-gray-700">NIS Santri</label>
                                        <button
                                            type="button"
                                            onClick={() => setScanMode(!scanMode)}
                                            className="text-xs text-indigo-600 font-medium hover:text-indigo-700 flex items-center gap-1 bg-indigo-50 px-2 py-1 rounded-lg transition-colors"
                                        >
                                            <QrCode className="w-3 h-3" />
                                            {scanMode ? 'Mode Manual' : 'Mode Scan'}
                                        </button>
                                    </div>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <ScanLine className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            ref={inputRef}
                                            type="text"
                                            value={data.nis}
                                            onChange={(e) => setData('nis', e.target.value)}
                                            placeholder="Arahkan kursor ke sini untuk scan barcode..."
                                            className="pl-11 w-full border-gray-300 rounded-xl shadow-sm focus:border-indigo-500 focus:ring-indigo-500 h-14 text-lg bg-white/50 backdrop-blur-sm transition-all"
                                            autoFocus={scanMode}
                                            required
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={processing || !data.nis}
                                    className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-indigo-600 to-indigo-500 rounded-xl text-base font-bold text-white hover:from-indigo-700 hover:to-indigo-600 shadow-md shadow-indigo-500/30 transition-all border border-indigo-600/50 focus:ring-2 focus:ring-indigo-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Send className="w-5 h-5" />
                                    {processing ? 'Memproses...' : 'Catat Kehadiran'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

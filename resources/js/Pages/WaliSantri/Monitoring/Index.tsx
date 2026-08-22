import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { User, Activity, Award, AlertTriangle, Calendar, MapPin, Phone, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

export default function MonitoringSantri({ auth, student }: any) {
    const [activeTab, setActiveTab] = useState('biodata');

    const tabs = [
        { id: 'biodata', name: 'Biodata', icon: User },
        { id: 'prestasi', name: 'Prestasi', icon: Award },
        { id: 'pelanggaran', name: 'Pelanggaran', icon: AlertTriangle },
        { id: 'kesehatan', name: 'Kesehatan', icon: Activity },
    ];

    const isWaliSantri = auth.user.role === 'Wali Santri';

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Monitoring Santri</h2>}
        >
            <Head title="Monitoring Santri" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    
                    {!isWaliSantri && (
                        <div className="mb-4">
                            <Link href={route('monitoring-santri.index')} className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-primary transition-colors">
                                <ArrowLeft className="w-4 h-4" /> Kembali ke Daftar Santri
                            </Link>
                        </div>
                    )}

                    {/* Header Card */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-2xl mb-6 p-6 flex items-center space-x-6 relative">
                        <div className="absolute top-6 right-6">
                            {student.status === 'aktif' && <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-bold rounded-full border border-green-200">Santri Aktif</span>}
                            {student.status === 'lulus' && <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-bold rounded-full border border-blue-200">Alumni (Lulus)</span>}
                            {student.status === 'pindah' && <span className="px-3 py-1 bg-orange-100 text-orange-800 text-xs font-bold rounded-full border border-orange-200">Boyong / Pindah</span>}
                            {student.status === 'nonaktif' && <span className="px-3 py-1 bg-gray-100 text-gray-800 text-xs font-bold rounded-full border border-gray-200">Nonaktif</span>}
                            {student.status === 'izin' && <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-bold rounded-full border border-yellow-200">Sedang Izin</span>}
                        </div>
                        {student.photo ? (
                            <img src={`/storage/${student.photo}`} alt={student.name} className="h-24 w-24 rounded-full object-cover border-4 border-primary/20" />
                        ) : (
                            <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center text-primary text-3xl font-bold">
                                {student.name.charAt(0)}
                            </div>
                        )}
                        <div>
                            <h3 className="text-2xl font-bold text-gray-900 pr-20">{student.name}</h3>
                            <p className="text-gray-500 flex items-center gap-2 mt-1">
                                <span className="font-medium text-gray-700">NIS:</span> {student.nis} 
                                <span className="mx-2">|</span>
                                <span className="font-medium text-gray-700">Kamar:</span> {student.room?.name || '-'}
                            </p>
                        </div>
                    </div>

                    {/* Navigation Tabs */}
                    <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            const isActive = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
                                        isActive 
                                        ? 'bg-primary text-white shadow-md shadow-primary/30' 
                                        : 'bg-white text-gray-600 hover:bg-gray-50'
                                    }`}
                                >
                                    <Icon className="w-5 h-5" />
                                    {tab.name}
                                </button>
                            );
                        })}
                    </div>

                    {/* Tab Contents */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-2xl p-6 min-h-[400px]">
                        
                        {/* Biodata Tab */}
                        {activeTab === 'biodata' && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                                <h4 className="text-lg font-bold text-gray-900 mb-6 border-b pb-2">Informasi Biodata</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-sm text-gray-500">Tempat, Tanggal Lahir</p>
                                            <p className="font-medium text-gray-900">{student.place_of_birth}, {student.birth_date}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Jenis Kelamin</p>
                                            <p className="font-medium text-gray-900 capitalize">{student.gender}</p>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-sm text-gray-500">Tahun Masuk</p>
                                                <p className="font-medium text-gray-900">{new Date(student.enrollment_date).getFullYear()}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Tahun Keluar</p>
                                                <p className="font-medium text-gray-900">{student.graduation_year || '-'}</p>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Tanggal Pendaftaran Lengkap</p>
                                            <p className="font-medium text-gray-900">{student.enrollment_date}</p>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-sm text-gray-500">Asrama & Kamar</p>
                                            <p className="font-medium text-gray-900">{student.room?.name || 'Belum diatur'}</p>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-sm text-gray-500">Akademik (Sekolah)</p>
                                                <p className="font-medium text-gray-900">{student.school_level || '-'}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Non-Akademik (Ngaji)</p>
                                                <p className="font-medium text-gray-900">{student.quran_level || '-'}</p>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Nama Wali</p>
                                            <p className="font-medium text-gray-900">{student.guardian?.name || '-'}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Alamat Lengkap</p>
                                            <p className="font-medium text-gray-900">{student.address || '-'}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Riwayat Perjalanan Santri</p>
                                            <p className="font-medium text-gray-900 whitespace-pre-wrap">{student.history || 'Belum ada catatan riwayat perjalanan santri.'}</p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Prestasi Tab */}
                        {activeTab === 'prestasi' && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                                <h4 className="text-lg font-bold text-gray-900 mb-6 border-b pb-2">Riwayat Prestasi</h4>
                                {student.achievements?.length > 0 ? (
                                    <div className="space-y-4">
                                        {student.achievements.map((ach: any) => (
                                            <div key={ach.id} className="p-4 border rounded-xl flex gap-4 items-start">
                                                <div className="bg-amber-100 p-3 rounded-lg text-amber-600">
                                                    <Award className="w-6 h-6" />
                                                </div>
                                                <div>
                                                    <h5 className="font-bold text-gray-900">{ach.title}</h5>
                                                    <p className="text-sm text-gray-500 mt-1">
                                                        <span className="font-medium">{ach.level}</span> • {ach.category} • {ach.date}
                                                    </p>
                                                    {ach.description && <p className="text-sm text-gray-700 mt-2">{ach.description}</p>}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-10 text-gray-500">Belum ada data prestasi.</div>
                                )}
                            </motion.div>
                        )}

                        {/* Pelanggaran Tab */}
                        {activeTab === 'pelanggaran' && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                                <h4 className="text-lg font-bold text-gray-900 mb-6 border-b pb-2">Catatan Pelanggaran</h4>
                                {student.violations?.length > 0 ? (
                                    <div className="space-y-4">
                                        {student.violations.map((vio: any) => (
                                            <div key={vio.id} className="p-4 border rounded-xl flex gap-4 items-start">
                                                <div className="bg-red-100 p-3 rounded-lg text-red-600">
                                                    <AlertTriangle className="w-6 h-6" />
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex justify-between">
                                                        <h5 className="font-bold text-gray-900">{vio.violation_name}</h5>
                                                        <span className="px-2 py-1 bg-red-50 text-red-600 text-xs font-bold rounded-md">
                                                            {vio.points} Poin
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-gray-500 mt-1">
                                                        {vio.category} • {vio.violation_date}
                                                    </p>
                                                    {vio.punishment && (
                                                        <p className="text-sm text-gray-700 mt-2 bg-gray-50 p-2 rounded">
                                                            <strong>Hukuman:</strong> {vio.punishment}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-10 text-gray-500">Alhamdulillah, tidak ada catatan pelanggaran.</div>
                                )}
                            </motion.div>
                        )}

                        {/* Kesehatan Tab */}
                        {activeTab === 'kesehatan' && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                                <h4 className="text-lg font-bold text-gray-900 mb-6 border-b pb-2">Riwayat Kesehatan</h4>
                                {student.health_records?.length > 0 || student.healthRecords?.length > 0 ? (
                                    <div className="space-y-4">
                                        {(student.healthRecords || student.health_records).map((record: any) => (
                                            <div key={record.id} className="p-4 border rounded-xl flex gap-4 items-start">
                                                <div className="bg-emerald-100 p-3 rounded-lg text-emerald-600">
                                                    <Activity className="w-6 h-6" />
                                                </div>
                                                <div>
                                                    <h5 className="font-bold text-gray-900">{record.complaint}</h5>
                                                    <p className="text-sm text-gray-500 mt-1">{record.date}</p>
                                                    <div className="mt-2 space-y-1 text-sm text-gray-700">
                                                        {record.diagnosis && <p><strong>Diagnosis:</strong> {record.diagnosis}</p>}
                                                        {record.treatment && <p><strong>Tindakan/Obat:</strong> {record.treatment}</p>}
                                                        {record.notes && <p><strong>Catatan:</strong> {record.notes}</p>}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-10 text-gray-500">Belum ada riwayat kesehatan.</div>
                                )}
                            </motion.div>
                        )}

                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

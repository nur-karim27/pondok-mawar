import React, { useState, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Search, User, ChevronRight, Filter } from 'lucide-react';
import TextInput from '@/Components/TextInput';
import Pagination from '@/Components/Pagination';

export default function StudentList({ auth, students, filters }: any) {
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    // Initialize from filters once safely
    useEffect(() => {
        if (filters && typeof filters === 'object') {
            if (filters.search) setSearch(filters.search);
            if (filters.status) setStatusFilter(filters.status);
        }
    }, [filters]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(
            route('monitoring-santri.index'),
            { search: search || '', status: statusFilter || '' },
            { preserveState: true, preserveScroll: true }
        );
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Daftar Santri untuk Monitoring</h2>}
        >
            <Head title="Monitoring Santri" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-2xl p-6 mb-6">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">Pilih Santri</h3>
                                <p className="text-gray-500 text-sm mt-1">
                                    Silakan pilih santri di bawah ini untuk melihat detail monitoring keseharian mereka.
                                </p>
                            </div>
                            <form onSubmit={handleSubmit} className="w-full md:w-auto flex flex-col md:flex-row gap-3">
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Filter className="h-4 w-4 text-gray-400" />
                                    </div>
                                    <select
                                        className="pl-10 block w-full md:w-48 border-gray-300 focus:border-primary focus:ring-primary rounded-lg shadow-sm sm:text-sm"
                                        value={statusFilter}
                                        onChange={(e) => {
                                            setStatusFilter(e.target.value);
                                            router.get(
                                                route('monitoring-santri.index'),
                                                { search: search || '', status: e.target.value },
                                                { preserveState: true, preserveScroll: true }
                                            );
                                        }}
                                    >
                                        <option value="">Semua Status</option>
                                        <option value="aktif">Masih Aktif</option>
                                        <option value="lulus">Sudah Lulus</option>
                                        <option value="pindah">Pindah / Boyong</option>
                                    </select>
                                </div>
                                <div className="relative w-full md:w-80 flex gap-2">
                                    <div className="relative flex-1">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Search className="h-4 w-4 text-gray-400" />
                                        </div>
                                        <TextInput
                                            type="text"
                                            placeholder="Cari tahun angkatan atau nama..."
                                            value={search}
                                            onChange={(e) => setSearch(e.target.value)}
                                            className="pl-10 w-full"
                                        />
                                    </div>
                                    <button 
                                        type="submit"
                                        className="px-4 py-2 bg-primary text-white rounded-lg shadow hover:bg-primary-dark transition-colors"
                                    >
                                        Cari
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {students.data.map((student: any) => (
                            <div key={student.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow relative">
                                <div className="absolute top-4 right-4">
                                    {student.status === 'aktif' && <span className="px-2 py-0.5 bg-green-100 text-green-800 text-[10px] font-bold rounded-full border border-green-200">Aktif</span>}
                                    {student.status === 'lulus' && <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-[10px] font-bold rounded-full border border-blue-200">Lulus</span>}
                                    {student.status === 'pindah' && <span className="px-2 py-0.5 bg-orange-100 text-orange-800 text-[10px] font-bold rounded-full border border-orange-200">Boyong/Pindah</span>}
                                    {student.status === 'nonaktif' && <span className="px-2 py-0.5 bg-gray-100 text-gray-800 text-[10px] font-bold rounded-full border border-gray-200">Nonaktif</span>}
                                    {student.status === 'izin' && <span className="px-2 py-0.5 bg-yellow-100 text-yellow-800 text-[10px] font-bold rounded-full border border-yellow-200">Izin</span>}
                                </div>
                                <div className="p-5 flex items-start gap-4">
                                    {student.photo ? (
                                        <img src={`/storage/${student.photo}`} alt={student.name} className="h-14 w-14 rounded-full object-cover shrink-0 border-2 border-primary/20" />
                                    ) : (
                                        <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xl font-bold shrink-0">
                                            {student.name.charAt(0)}
                                        </div>
                                    )}
                                    <div className="flex-1 min-w-0 pr-8">
                                        <h4 className="text-base font-bold text-gray-900 truncate">{student.name}</h4>
                                        <p className="text-xs text-gray-500 mt-1 truncate">NIS: {student.nis} • {student.room?.name || '-'}</p>
                                        <div className="mt-2 text-xs text-gray-400">
                                            <p>Masuk: {new Date(student.enrollment_date).getFullYear()}</p>
                                            <p>Keluar: {student.graduation_year || '-'}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-gray-50 px-5 py-3 border-t border-gray-100">
                                    <Link 
                                        href={route('monitoring-santri.show', student.id)}
                                        className="flex items-center justify-between text-sm font-medium text-primary hover:text-primary-light transition-colors group"
                                    >
                                        Cek Selengkapnya
                                        <ChevronRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>

                    {students.data.length === 0 && (
                        <div className="text-center py-12 bg-white rounded-2xl shadow-sm border border-gray-100">
                            <User className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                            <h3 className="text-lg font-medium text-gray-900">Tidak ada data</h3>
                            <p className="text-gray-500">Belum ada data santri aktif saat ini.</p>
                        </div>
                    )}

                    <div className="mt-6 flex justify-center">
                        <Pagination links={students.links} />
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}

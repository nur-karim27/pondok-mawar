import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { PageProps } from '@/types';
import { Landmark, ArrowDownCircle, ArrowUpCircle, Wallet, Eye, History, Search, Download } from 'lucide-react';
import { useState } from 'react';
import Pagination from '@/Components/Pagination';

interface Student {
    id: number;
    name: string;
    nis: string;
    photo: string | null;
    gender: 'putra' | 'putri';
    balance: number;
}

interface Summary {
    total_saldo: number;
    total_setor: number;
    total_tarik: number;
}

interface Filters {
    search: string | null;
    gender: string | null;
}

export default function TabunganIndex({ auth, students, summary, filters }: PageProps<{ students: { data: Student[], links: any[], current_page: number, last_page: number }, summary: Summary, filters: Filters }>) {
    const [search, setSearch] = useState(filters?.search || '');
    const [gender, setGender] = useState(filters?.gender || 'semua');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(route('tabungan.index'), { search, gender }, { preserveState: true });
    };

    const handleGenderFilter = (selectedGender: string) => {
        setGender(selectedGender);
        router.get(route('tabungan.index'), { search, gender: selectedGender }, { preserveState: true });
    };

    const exportData = () => {
        window.location.href = route('tabungan.export_balances', { search, gender });
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Tabungan Santri</h2>}
        >
            <Head title="Tabungan Santri - Bendahara" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    
                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white overflow-hidden shadow-sm rounded-xl p-6 border border-gray-100 flex items-center gap-4">
                            <div className="p-4 bg-purple-100 text-purple-600 rounded-lg">
                                <Wallet className="w-8 h-8" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500">Total Saldo Seluruh Santri</p>
                                <p className="text-2xl font-bold text-gray-900">Rp {Number(summary.total_saldo).toLocaleString('id-ID')}</p>
                            </div>
                        </div>

                        <div className="bg-white overflow-hidden shadow-sm rounded-xl p-6 border border-gray-100 flex items-center gap-4">
                            <div className="p-4 bg-green-100 text-green-600 rounded-lg">
                                <ArrowDownCircle className="w-8 h-8" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500">Total Setoran Masuk</p>
                                <p className="text-2xl font-bold text-gray-900">Rp {Number(summary.total_setor).toLocaleString('id-ID')}</p>
                            </div>
                        </div>

                        <div className="bg-white overflow-hidden shadow-sm rounded-xl p-6 border border-gray-100 flex items-center gap-4">
                            <div className="p-4 bg-red-100 text-red-600 rounded-lg">
                                <ArrowUpCircle className="w-8 h-8" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500">Total Penarikan Keluar</p>
                                <p className="text-2xl font-bold text-gray-900">Rp {Number(summary.total_tarik).toLocaleString('id-ID')}</p>
                            </div>
                        </div>
                    </div>

                    {/* Table Section */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-xl border border-gray-100">
                        <div className="p-6">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                    <Landmark className="w-5 h-5 text-gray-500" />
                                    Daftar Saldo Tabungan Santri
                                </h3>
                                
                                <div className="flex flex-wrap items-center gap-2">
                                    <form onSubmit={handleSearch} className="flex items-center">
                                        <div className="relative">
                                            <input 
                                                type="text" 
                                                placeholder="Cari nama/NIS..." 
                                                value={search}
                                                onChange={(e) => setSearch(e.target.value)}
                                                className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500"
                                            />
                                            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                        </div>
                                    </form>

                                    <div className="flex bg-gray-100 p-1 rounded-lg">
                                        <button 
                                            onClick={() => handleGenderFilter('semua')}
                                            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${gender === 'semua' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                                        >
                                            Semua
                                        </button>
                                        <button 
                                            onClick={() => handleGenderFilter('putra')}
                                            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${gender === 'putra' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                                        >
                                            Putra
                                        </button>
                                        <button 
                                            onClick={() => handleGenderFilter('putri')}
                                            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${gender === 'putri' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                                        >
                                            Putri
                                        </button>
                                    </div>

                                    <button 
                                        onClick={exportData}
                                        className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 shadow-sm transition-all"
                                    >
                                        <Download className="w-4 h-4" />
                                        Export Excel
                                    </button>

                                    <Link 
                                        href={route('tabungan.history')}
                                        className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors font-medium text-sm border border-blue-100"
                                    >
                                        <History className="w-4 h-4" />
                                        Semua Riwayat
                                    </Link>
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left text-gray-500">
                                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-100">
                                        <tr>
                                            <th className="px-6 py-4 rounded-tl-lg">Santri</th>
                                            <th className="px-6 py-4 text-right">Saldo Saat Ini (Rp)</th>
                                            <th className="px-6 py-4 text-center rounded-tr-lg">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {students.data.length > 0 ? students.data.map((student) => (
                                            <tr key={student.id} className="bg-white border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                                <td className="px-6 py-4 flex items-center gap-3">
                                                    {student.photo ? (
                                                        <img src={`/storage/${student.photo}`} alt={student.name} className="w-10 h-10 rounded-full object-cover border border-gray-200" />
                                                    ) : (
                                                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold border border-blue-200">
                                                            {student.name.charAt(0)}
                                                        </div>
                                                    )}
                                                    <div>
                                                        <p className="text-gray-900 font-medium">{student.name}</p>
                                                        <p className="text-xs text-gray-500">{student.nis} • {student.gender === 'putra' ? 'Laki-laki' : 'Perempuan'}</p>
                                                    </div>
                                                </td>
                                                <td className={`px-6 py-4 text-right font-bold align-middle ${student.balance < 0 ? 'text-red-600' : 'text-gray-900'}`}>
                                                    {student.balance < 0 ? '-' : ''}Rp {Math.abs(Number(student.balance)).toLocaleString('id-ID')}
                                                </td>
                                                <td className="px-6 py-4 text-center align-middle">
                                                    <Link 
                                                        href={route('tabungan.show', student.id)}
                                                        className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-900 px-3 py-1.5 rounded hover:bg-blue-50 transition-colors font-medium text-xs"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                        Lihat Detail
                                                    </Link>
                                                </td>
                                            </tr>
                                        )) : (
                                            <tr>
                                                <td colSpan={3} className="px-6 py-8 text-center text-gray-500">
                                                    Belum ada data santri.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            
                            {/* Pagination */}
                            {students.links && students.links.length > 3 && (
                                <div className="mt-6">
                                    <Pagination links={students.links} />
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}

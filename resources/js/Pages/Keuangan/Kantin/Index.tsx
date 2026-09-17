import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { PageProps } from '@/types';
import { Landmark, ArrowDownCircle, ArrowUpCircle, Wallet, Eye, History, Store, Search, Download } from 'lucide-react';
import { useState } from 'react';
import Pagination from '@/Components/Pagination';

interface Canteen {
    id: number;
    name: string;
    type: 'putra' | 'putri';
    balance: number;
}

interface Summary {
    total_saldo: number;
    total_masuk: number;
    total_keluar: number;
}

interface Filters {
    search: string | null;
    type: string | null;
}

export default function KantinIndex({ 
    auth, 
    canteens, 
    summary = { total_saldo: 0, total_masuk: 0, total_keluar: 0 }, 
    filters = { search: '', type: 'semua' } 
}: PageProps<{ canteens: { data: Canteen[], links: any[], current_page: number, last_page: number }, summary: Summary, filters: Filters }>) {
    const [search, setSearch] = useState(filters?.search || '');
    const [type, setType] = useState(filters?.type || 'semua');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(route('kantin.index'), { search, type }, { preserveState: true });
    };

    const handleTypeFilter = (selectedType: string) => {
        setType(selectedType);
        router.get(route('kantin.index'), { search, type: selectedType }, { preserveState: true });
    };

    const exportData = () => {
        window.location.href = route('kantin.export_balances', { search, type });
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Keuangan Kantin</h2>}
        >
            <Head title="Keuangan Kantin - Bendahara" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white overflow-hidden shadow-sm rounded-xl p-6 border border-gray-100 flex items-center gap-4">
                            <div className="p-4 bg-purple-100 text-purple-600 rounded-lg">
                                <Wallet className="w-8 h-8" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500">Total Kas Seluruh Kantin</p>
                                <p className="text-2xl font-bold text-gray-900">Rp {Number(summary.total_saldo).toLocaleString('id-ID')}</p>
                            </div>
                        </div>

                        <div className="bg-white overflow-hidden shadow-sm rounded-xl p-6 border border-gray-100 flex items-center gap-4">
                            <div className="p-4 bg-green-100 text-green-600 rounded-lg">
                                <ArrowDownCircle className="w-8 h-8" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500">Total Pemasukan</p>
                                <p className="text-2xl font-bold text-gray-900">Rp {Number(summary.total_masuk).toLocaleString('id-ID')}</p>
                            </div>
                        </div>

                        <div className="bg-white overflow-hidden shadow-sm rounded-xl p-6 border border-gray-100 flex items-center gap-4">
                            <div className="p-4 bg-red-100 text-red-600 rounded-lg">
                                <ArrowUpCircle className="w-8 h-8" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500">Total Pengeluaran</p>
                                <p className="text-2xl font-bold text-gray-900">Rp {Number(summary.total_keluar).toLocaleString('id-ID')}</p>
                            </div>
                        </div>
                    </div>

                    {/* Daftar Kantin */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-xl border border-gray-100">
                        <div className="p-6">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                    <Landmark className="w-5 h-5 text-gray-500" />
                                    Daftar Kas Kantin
                                </h3>
                                
                                <div className="flex flex-wrap items-center gap-2">
                                    <form onSubmit={handleSearch} className="flex items-center">
                                        <div className="relative">
                                            <input 
                                                type="text" 
                                                placeholder="Cari kantin..." 
                                                value={search}
                                                onChange={(e) => setSearch(e.target.value)}
                                                className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500"
                                            />
                                            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                        </div>
                                    </form>

                                    <div className="flex bg-gray-100 p-1 rounded-lg">
                                        <button 
                                            onClick={() => handleTypeFilter('semua')}
                                            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${type === 'semua' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                                        >
                                            Semua
                                        </button>
                                        <button 
                                            onClick={() => handleTypeFilter('putra')}
                                            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${type === 'putra' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                                        >
                                            Putra
                                        </button>
                                        <button 
                                            onClick={() => handleTypeFilter('putri')}
                                            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${type === 'putri' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
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
                                        href={route('kantin.settings')}
                                        className="inline-flex items-center gap-2 bg-gray-50 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors font-medium text-sm border border-gray-200"
                                    >
                                        Pengaturan Kantin
                                    </Link>
                                    
                                    <Link 
                                        href={route('kantin.history')}
                                        className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors font-medium text-sm border border-blue-100"
                                    >
                                        <History className="w-4 h-4" />
                                        Semua Riwayat
                                    </Link>
                                </div>
                            </div>

                            <div className="overflow-x-auto rounded-lg border border-gray-100">
                                <table className="w-full text-sm text-left text-gray-500">
                                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-100">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">KANTIN</th>
                                            <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">SISA KAS SAAT INI (RP)</th>
                                            <th className="px-6 py-4 text-center rounded-tr-lg">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {canteens.data.length === 0 ? (
                                            <tr>
                                                <td colSpan={3} className="px-6 py-8 text-center text-gray-500">
                                                    Belum ada data kantin. Silakan tambahkan di menu Pengaturan Kantin.
                                                </td>
                                            </tr>
                                        ) : (
                                            canteens.data.map((canteen) => (
                                                <tr key={canteen.id} className="hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0">
                                                    <td className="px-6 py-4 flex items-center gap-3">
                                                        <div className={`p-2 rounded-lg ${canteen.type === 'putra' ? 'bg-blue-100 text-blue-600' : 'bg-pink-100 text-pink-600'}`}>
                                                            <Store className="w-6 h-6" />
                                                        </div>
                                                        <div>
                                                            <div className="font-medium text-gray-900">{canteen.name}</div>
                                                            <div className="text-xs text-gray-500 capitalize">Kantin {canteen.type}</div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-right font-bold align-middle">
                                                        <span className={canteen.balance < 0 ? 'text-red-600' : 'text-gray-900'}>
                                                            {canteen.balance < 0 ? `-Rp ${Math.abs(canteen.balance).toLocaleString('id-ID')}` : `Rp ${canteen.balance.toLocaleString('id-ID')}`}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-center align-middle">
                                                        <Link 
                                                            href={route('kantin.show', canteen.id)}
                                                            className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-900 px-3 py-1.5 rounded hover:bg-blue-50 transition-colors font-medium text-xs"
                                                        >
                                                            <Eye className="w-4 h-4" />
                                                            Lihat Detail
                                                        </Link>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            {canteens.links && canteens.links.length > 3 && (
                                <div className="mt-6">
                                    <Pagination links={canteens.links} />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { PageProps } from '@/types';
import { Landmark, ArrowDownCircle, ArrowUpCircle, Wallet, Eye, History } from 'lucide-react';

interface Student {
    id: number;
    name: string;
    nis: string;
    balance: number;
}

interface Summary {
    total_saldo: number;
    total_setor: number;
    total_tarik: number;
}

export default function TabunganIndex({ auth, students, summary }: PageProps<{ students: { data: Student[] }, summary: Summary }>) {
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
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                    <Landmark className="w-5 h-5 text-gray-500" />
                                    Daftar Saldo Tabungan Santri
                                </h3>
                                <div className="flex items-center gap-2">
                                    <Link 
                                        href={route('tabungan.history')}
                                        className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors font-medium text-sm border border-blue-100"
                                    >
                                        <History className="w-4 h-4" />
                                        Riwayat Semua Transaksi
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
                                                <td className="px-6 py-4">
                                                    <div>
                                                        <p className="text-gray-900 font-medium">{student.name}</p>
                                                        <p className="text-xs text-gray-500">{student.nis}</p>
                                                    </div>
                                                </td>
                                                <td className={`px-6 py-4 text-right font-bold ${student.balance < 0 ? 'text-red-600' : 'text-gray-900'}`}>
                                                    {student.balance < 0 ? '-' : ''}Rp {Math.abs(Number(student.balance)).toLocaleString('id-ID')}
                                                </td>
                                                <td className="px-6 py-4 text-center">
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
                        </div>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}

import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { PageProps } from '@/types';
import { ArrowLeft, PlusCircle, MinusCircle, History as HistoryIcon, Download, Wallet } from 'lucide-react';

interface Transaction {
    id: number;
    transaction_type: 'setor' | 'tarik';
    amount: string;
    transaction_date: string;
    notes: string | null;
    student: {
        id: number;
        name: string;
        nis: string;
    };
    handled_by: {
        id: number;
        name: string;
    } | null;
}

export default function TabunganHistory({ auth, transactions }: PageProps<{ transactions: { data: Transaction[], links: any[] } }>) {
    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-4">
                    <Link href={route('tabungan.index')} className="text-gray-500 hover:text-gray-700">
                        <ArrowLeft className="w-6 h-6" />
                    </Link>
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">Riwayat Seluruh Transaksi Tabungan</h2>
                </div>
            }
        >
            <Head title="Riwayat Tabungan Global" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-xl border border-gray-100">
                        <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                <HistoryIcon className="w-5 h-5 text-gray-500" />
                                Transaksi Keseluruhan (Setoran & Penarikan)
                            </h3>
                            <div className="flex flex-col sm:flex-row gap-2">
                                <a 
                                    href={route('tabungan.export_balances')}
                                    className="inline-flex items-center justify-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors font-medium text-sm shadow-sm"
                                >
                                    <Wallet className="w-4 h-4" />
                                    Unduh Saldo Akhir (CSV)
                                </a>
                                <a 
                                    href={route('tabungan.export')}
                                    className="inline-flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium text-sm shadow-sm"
                                >
                                    <Download className="w-4 h-4" />
                                    Unduh Riwayat (CSV)
                                </a>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left text-gray-500">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-100">
                                    <tr>
                                        <th className="px-6 py-4">Tanggal / Waktu</th>
                                        <th className="px-6 py-4">Nama Santri</th>
                                        <th className="px-6 py-4">Jenis</th>
                                        <th className="px-6 py-4">Nominal (Rp)</th>
                                        <th className="px-6 py-4">Catatan</th>
                                        <th className="px-6 py-4">Admin</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {transactions.data.length > 0 ? transactions.data.map((trx) => (
                                        <tr key={trx.id} className="bg-white border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex flex-col">
                                                    <span className="font-medium text-gray-900">
                                                        {new Date(trx.transaction_date).toLocaleDateString('id-ID', {
                                                            day: 'numeric', month: 'short', year: 'numeric'
                                                        })}
                                                    </span>
                                                    <span className="text-xs text-gray-500">
                                                        {new Date(trx.transaction_date).toLocaleTimeString('id-ID', {
                                                            hour: '2-digit', minute: '2-digit'
                                                        })} WIB
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="font-medium text-gray-900">{trx.student.name}</span>
                                                    <span className="text-xs text-gray-500">{trx.student.nis}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                {trx.transaction_type === 'setor' ? (
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                        <PlusCircle className="w-3.5 h-3.5" />
                                                        Setor
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                        <MinusCircle className="w-3.5 h-3.5" />
                                                        Tarik
                                                    </span>
                                                )}
                                            </td>
                                            <td className={`px-6 py-4 font-bold ${trx.transaction_type === 'setor' ? 'text-green-600' : 'text-red-600'}`}>
                                                {trx.transaction_type === 'setor' ? '+' : '-'} {Number(trx.amount).toLocaleString('id-ID')}
                                            </td>
                                            <td className="px-6 py-4 text-gray-600 max-w-xs truncate" title={trx.notes || ''}>
                                                {trx.notes || '-'}
                                            </td>
                                            <td className="px-6 py-4 text-gray-600">
                                                {trx.handled_by?.name || '-'}
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                                                Belum ada riwayat transaksi tabungan di sistem.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}

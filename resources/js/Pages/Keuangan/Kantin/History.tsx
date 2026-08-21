import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { PageProps } from '@/types';
import { ArrowLeft, PlusCircle, MinusCircle, History as HistoryIcon, Download, Wallet } from 'lucide-react';

interface Transaction {
    id: number;
    transaction_type: 'masuk' | 'keluar';
    amount: string;
    transaction_date: string;
    notes: string | null;
    canteen: {
        id: number;
        name: string;
        type: string;
    };
    handled_by: {
        id: number;
        name: string;
    } | null;
}

export default function KantinHistory({ auth, transactions }: PageProps<{ transactions: any }>) {
    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-4">
                    <Link href={route('kantin.index')} className="text-gray-500 hover:text-gray-700">
                        <ArrowLeft className="w-6 h-6" />
                    </Link>
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">Riwayat Seluruh Transaksi Kantin</h2>
                </div>
            }
        >
            <Head title="Riwayat Kas Kantin Global" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-xl border border-gray-100">
                        <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                <HistoryIcon className="w-5 h-5 text-gray-500" />
                                Transaksi Keseluruhan (Pemasukan & Pengeluaran)
                            </h3>
                            <div className="flex flex-col sm:flex-row gap-2">
                                <a 
                                    href={route('kantin.export_balances')}
                                    className="inline-flex items-center justify-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors font-medium text-sm shadow-sm"
                                >
                                    <Wallet className="w-4 h-4" />
                                    Unduh Saldo Akhir (CSV)
                                </a>
                                <a 
                                    href={route('kantin.export')}
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
                                        <th className="px-6 py-4 font-semibold text-gray-500">Tanggal/Waktu</th>
                                        <th className="px-6 py-4 font-semibold text-gray-500">Kantin</th>
                                        <th className="px-6 py-4 font-semibold text-gray-500">Jenis Transaksi</th>
                                        <th className="px-6 py-4 font-semibold text-gray-500">Nominal (Rp)</th>
                                        <th className="px-6 py-4 font-semibold text-gray-500">Catatan</th>
                                        <th className="px-6 py-4 font-semibold text-gray-500">Admin/Petugas</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {transactions.data.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                                                Belum ada riwayat transaksi kantin
                                            </td>
                                        </tr>
                                    ) : (
                                        transactions.data.map((trx: Transaction) => (
                                            <tr key={trx.id} className="hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {new Date(trx.transaction_date).toLocaleString('id-ID', {
                                                        day: 'numeric',
                                                        month: 'short',
                                                        year: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="font-medium text-gray-900">{trx.canteen.name}</div>
                                                    <div className="text-xs text-gray-500 capitalize">{trx.canteen.type}</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    {trx.transaction_type === 'masuk' ? (
                                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                            <PlusCircle className="w-3.5 h-3.5" />
                                                            Pemasukan
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                            <MinusCircle className="w-3.5 h-3.5" />
                                                            Pengeluaran
                                                        </span>
                                                    )}
                                                </td>
                                                <td className={`px-6 py-4 font-semibold ${trx.transaction_type === 'masuk' ? 'text-green-600' : 'text-red-600'}`}>
                                                    {trx.transaction_type === 'masuk' ? '+' : '-'} {Number(trx.amount).toLocaleString('id-ID')}
                                                </td>
                                                <td className="px-6 py-4 text-gray-600">
                                                    {trx.notes || '-'}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {trx.handled_by ? trx.handled_by.name : '-'}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <div className="p-4 border-t border-gray-100 flex justify-between items-center bg-gray-50">
                            <span className="text-sm text-gray-700">
                                Menampilkan <span className="font-semibold">{transactions.from || 0}</span> sampai <span className="font-semibold">{transactions.to || 0}</span> dari <span className="font-semibold">{transactions.total}</span> transaksi
                            </span>
                            <div className="flex gap-1 flex-wrap">
                                {transactions.links.map((link: any, index: number) => (
                                    <Link
                                        key={index}
                                        href={link.url || '#'}
                                        className={`px-3 py-1 text-sm rounded-lg ${
                                            link.active 
                                                ? 'bg-emerald-600 text-white font-medium' 
                                                : link.url 
                                                    ? 'text-gray-700 hover:bg-gray-200 bg-white border border-gray-200' 
                                                    : 'text-gray-300 bg-gray-50 cursor-not-allowed border border-gray-100'
                                        }`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

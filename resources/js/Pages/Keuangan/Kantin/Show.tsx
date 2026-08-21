import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { PageProps } from '@/types';
import { ArrowLeft, PlusCircle, MinusCircle, Wallet, Download, Edit } from 'lucide-react';
import { useState } from 'react';
import CreateTransactionModal from './Partials/CreateTransactionModal';
import EditTransactionModal from './Partials/EditTransactionModal';

interface Transaction {
    id: number;
    transaction_type: 'masuk' | 'keluar';
    amount: string;
    running_balance: number;
    transaction_date: string;
    notes: string | null;
    handled_by: {
        id: number;
        name: string;
    } | null;
}

interface Canteen {
    id: number;
    name: string;
    type: 'putra' | 'putri';
}

export default function KantinShow({ auth, canteen, transactions, balance }: PageProps<{ canteen: Canteen, transactions: any, balance: number }>) {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [transactionType, setTransactionType] = useState<'masuk' | 'keluar'>('masuk');
    const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-4">
                    <Link href={route('kantin.index')} className="text-gray-500 hover:text-gray-700">
                        <ArrowLeft className="w-6 h-6" />
                    </Link>
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">Detail Kas: {canteen.name}</h2>
                </div>
            }
        >
            <Head title={`Kas Kantin - ${canteen.name}`} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    {/* Summary Card */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-xl border border-gray-100">
                        <div className="p-6 md:p-8 flex flex-col md:flex-row justify-between items-center gap-6">
                            <div className="flex items-center gap-4">
                                <div className={`p-4 rounded-full ${balance < 0 ? 'bg-red-50 text-red-600' : 'bg-purple-50 text-purple-600'}`}>
                                    <Wallet className="w-8 h-8" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">Sisa Kas Saat Ini</h3>
                                    <p className={`text-4xl font-bold ${balance < 0 ? 'text-red-600' : 'text-gray-900'}`}>
                                        {balance < 0 ? `-Rp ${Math.abs(balance).toLocaleString('id-ID')}` : `Rp ${balance.toLocaleString('id-ID')}`}
                                    </p>
                                    <p className="text-sm text-gray-500 mt-1 capitalize">Kantin {canteen.type}</p>
                                </div>
                            </div>
                            
                            <div className="flex gap-3 w-full md:w-auto">
                                <button 
                                    onClick={() => { setTransactionType('masuk'); setIsCreateModalOpen(true); }}
                                    className="flex-1 md:flex-none inline-flex justify-center items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 transition-colors font-medium shadow-sm"
                                >
                                    <PlusCircle className="w-5 h-5" />
                                    Catat Pemasukan
                                </button>
                                <button 
                                    onClick={() => { setTransactionType('keluar'); setIsCreateModalOpen(true); }}
                                    className="flex-1 md:flex-none inline-flex justify-center items-center gap-2 bg-red-600 text-white px-6 py-3 rounded-xl hover:bg-red-700 transition-colors font-medium shadow-sm"
                                >
                                    <MinusCircle className="w-5 h-5" />
                                    Catat Pengeluaran
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Transaction History */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-xl border border-gray-100">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="text-lg font-semibold text-gray-900">Riwayat Transaksi</h3>
                            <a 
                                href={route('kantin.export_canteen', canteen.id)}
                                className="inline-flex items-center gap-2 bg-gray-50 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors font-medium text-sm border border-gray-200"
                            >
                                <Download className="w-4 h-4" />
                                Unduh Rekap Excel
                            </a>
                        </div>
                        
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left text-gray-500">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-100">
                                    <tr>
                                        <th className="px-6 py-4 font-semibold text-gray-500">Tanggal</th>
                                        <th className="px-6 py-4 font-semibold text-gray-500">Jenis</th>
                                        <th className="px-6 py-4 font-semibold text-gray-500">Nominal (Rp)</th>
                                        <th className="px-6 py-4 font-semibold text-gray-500">Catatan</th>
                                        <th className="px-6 py-4 font-semibold text-gray-500">Admin</th>
                                        <th className="px-6 py-4 font-semibold text-gray-500 text-center">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {transactions.data.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                                                Belum ada riwayat transaksi kantin
                                            </td>
                                        </tr>
                                    ) : (
                                        transactions.data.map((trx: Transaction) => (
                                            <tr key={trx.id} className="hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {new Date(trx.transaction_date).toLocaleDateString('id-ID', {
                                                        day: 'numeric',
                                                        month: 'short',
                                                        year: 'numeric'
                                                    })}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {trx.transaction_type === 'masuk' ? (
                                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                            <PlusCircle className="w-3.5 h-3.5" />
                                                            Pemasukan
                                                        </span>
                                                    ) : (
                                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${trx.running_balance < 0 ? 'bg-orange-100 text-orange-800' : 'bg-red-100 text-red-800'}`}>
                                                            <MinusCircle className="w-3.5 h-3.5" />
                                                            {trx.running_balance < 0 ? 'Pengeluaran (Minus)' : 'Pengeluaran'}
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
                                                <td className="px-6 py-4 text-center">
                                                    <button
                                                        onClick={() => {
                                                            setEditingTransaction(trx);
                                                            setIsEditModalOpen(true);
                                                        }}
                                                        className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-900 px-3 py-1.5 rounded hover:bg-blue-50 transition-colors font-medium text-xs"
                                                        title="Edit Transaksi"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                        Edit
                                                    </button>
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
                            <div className="flex gap-1">
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

            <CreateTransactionModal 
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                canteen={canteen}
                transactionType={transactionType}
            />

            <EditTransactionModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                canteen={canteen}
                transaction={editingTransaction}
            />
        </AuthenticatedLayout>
    );
}

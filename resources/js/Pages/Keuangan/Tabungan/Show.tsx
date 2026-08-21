import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { PageProps } from '@/types';
import { ArrowLeft, Wallet, PlusCircle, MinusCircle, Plus, Minus, Download } from 'lucide-react';
import CreateTransactionModal from './Partials/CreateTransactionModal';

interface Student {
    id: number;
    name: string;
    nis: string;
}

interface Transaction {
    id: number;
    transaction_type: 'setor' | 'tarik';
    amount: string;
    running_balance: number;
    transaction_date: string;
    notes: string | null;
    handled_by: {
        id: number;
        name: string;
    } | null;
}

export default function TabunganShow({ auth, student, transactions, balance }: PageProps<{ student: Student, transactions: { data: Transaction[] }, balance: number }>) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [transactionType, setTransactionType] = useState<'setor' | 'tarik'>('setor');

    const handleOpenModal = (type: 'setor' | 'tarik') => {
        setTransactionType(type);
        setIsModalOpen(true);
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-4">
                    <Link href={route('tabungan.index')} className="text-gray-500 hover:text-gray-700">
                        <ArrowLeft className="w-6 h-6" />
                    </Link>
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">Detail Tabungan: {student.name}</h2>
                </div>
            }
        >
            <Head title={`Tabungan - ${student.name}`} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    
                    {/* Header Card */}
                    <div className="bg-white overflow-hidden shadow-sm rounded-xl p-6 border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="flex items-center gap-6">
                            <div className="p-4 bg-purple-100 text-purple-600 rounded-full">
                                <Wallet className="w-10 h-10" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Saldo Saat Ini</p>
                                <p className={`text-4xl font-bold mt-1 ${balance < 0 ? 'text-red-600' : 'text-gray-900'}`}>
                                    {balance < 0 ? '-' : ''}Rp {Math.abs(Number(balance)).toLocaleString('id-ID')}
                                </p>
                                <p className="text-sm text-gray-500 mt-1">NIS: {student.nis}</p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button 
                                onClick={() => handleOpenModal('setor')}
                                className="inline-flex items-center gap-2 bg-green-600 text-white px-5 py-2.5 rounded-lg hover:bg-green-700 transition-colors font-medium shadow-sm"
                            >
                                <Plus className="w-5 h-5" />
                                Catat Setoran
                            </button>
                            <button 
                                onClick={() => handleOpenModal('tarik')}
                                className="inline-flex items-center gap-2 bg-red-600 text-white px-5 py-2.5 rounded-lg hover:bg-red-700 transition-colors font-medium shadow-sm"
                            >
                                <Minus className="w-5 h-5" />
                                Catat Penarikan
                            </button>
                        </div>
                    </div>

                    {/* Table Section */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-xl border border-gray-100">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="text-lg font-semibold text-gray-900">Riwayat Transaksi</h3>
                            <a 
                                href={route('tabungan.export_student', student.id)}
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
                                        <th className="px-6 py-4">Tanggal</th>
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
                                                {new Date(trx.transaction_date).toLocaleDateString('id-ID', {
                                                    day: 'numeric', month: 'short', year: 'numeric'
                                                })}
                                            </td>
                                            <td className="px-6 py-4">
                                                {trx.transaction_type === 'setor' ? (
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                        <PlusCircle className="w-3.5 h-3.5" />
                                                        Setor
                                                    </span>
                                                ) : (
                                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${trx.running_balance < 0 ? 'bg-orange-100 text-orange-800' : 'bg-red-100 text-red-800'}`}>
                                                        <MinusCircle className="w-3.5 h-3.5" />
                                                        {trx.running_balance < 0 ? 'Tarik (Kasbon)' : 'Tarik'}
                                                    </span>
                                                )}
                                            </td>
                                            <td className={`px-6 py-4 font-bold ${trx.transaction_type === 'setor' ? 'text-green-600' : 'text-red-600'}`}>
                                                {trx.transaction_type === 'setor' ? '+' : '-'} {Number(trx.amount).toLocaleString('id-ID')}
                                            </td>
                                            <td className="px-6 py-4 text-gray-600 max-w-xs truncate">
                                                {trx.notes || '-'}
                                            </td>
                                            <td className="px-6 py-4 text-gray-600">
                                                {trx.handled_by?.name || '-'}
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                                                Belum ada riwayat transaksi tabungan.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>
            </div>

            <CreateTransactionModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                studentId={student.id}
                transactionType={transactionType}
            />
        </AuthenticatedLayout>
    );
}

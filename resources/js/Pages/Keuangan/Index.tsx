import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { PageProps } from '@/types';
import { useState } from 'react';
import { Banknote, CreditCard, Wallet, Plus, Download, ReceiptText, Pencil } from 'lucide-react';
import CreatePaymentModal from './Partials/CreatePaymentModal';
import EditPaymentModal from './Partials/EditPaymentModal';

interface Payment {
    id: number;
    receipt_number: string;
    payment_date: string;
    amount: number;
    payment_method: string;
    student_bill: {
        id: number;
        student: { id: number; name: string; nis: string };
        payment_type: { name: string };
    };
    received_by: { name: string } | null;
    notes: string | null;
}

interface UnpaidBill {
    id: number;
    amount: number;
    remaining: number;
    status: string;
    billing_month: string | null;
    billing_year: string | null;
    payment_type: { name: string };
    student: { name: string; nis: string };
}

interface Summary {
    total_masuk: number;
    total_tunai: number;
    total_non_tunai: number;
}

interface Student {
    id: number;
    name: string;
    nis: string;
}

export default function KeuanganIndex({ auth, payments, summary, unpaid_bills, students }: PageProps<{ payments: { data: Payment[] }, summary: Summary, unpaid_bills: UnpaidBill[], students: Student[] }>) {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingPayment, setEditingPayment] = useState<Payment | null>(null);

    const handleEdit = (payment: Payment) => {
        setEditingPayment(payment);
        setIsEditModalOpen(true);
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Keuangan & Tagihan</h2>}
        >
            <Head title="Keuangan - Bendahara" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    
                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white overflow-hidden shadow-sm rounded-xl p-6 border border-gray-100 flex items-center gap-4">
                            <div className="p-4 bg-green-100 text-green-600 rounded-lg">
                                <Wallet className="w-8 h-8" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500">Total Uang Masuk</p>
                                <p className="text-2xl font-bold text-gray-900">Rp {Number(summary.total_masuk).toLocaleString('id-ID')}</p>
                            </div>
                        </div>

                        <div className="bg-white overflow-hidden shadow-sm rounded-xl p-6 border border-gray-100 flex items-center gap-4">
                            <div className="p-4 bg-emerald-100 text-emerald-600 rounded-lg">
                                <Banknote className="w-8 h-8" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500">Pemasukan Tunai</p>
                                <p className="text-2xl font-bold text-gray-900">Rp {Number(summary.total_tunai).toLocaleString('id-ID')}</p>
                            </div>
                        </div>

                        <div className="bg-white overflow-hidden shadow-sm rounded-xl p-6 border border-gray-100 flex items-center gap-4">
                            <div className="p-4 bg-blue-100 text-blue-600 rounded-lg">
                                <CreditCard className="w-8 h-8" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500">Pemasukan Non-Tunai (Transfer/QRIS)</p>
                                <p className="text-2xl font-bold text-gray-900">Rp {Number(summary.total_non_tunai).toLocaleString('id-ID')}</p>
                            </div>
                        </div>
                    </div>

                    {/* Table Section */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-xl border border-gray-100">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                    <ReceiptText className="w-5 h-5 text-gray-500" />
                                    Riwayat Uang Masuk
                                </h3>
                                <div className="flex gap-3">
                                    <button className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 shadow-sm transition-all">
                                        <Download className="w-4 h-4" />
                                        Export
                                    </button>
                                    <button 
                                        onClick={() => setIsCreateModalOpen(true)}
                                        className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 rounded-lg text-sm font-medium text-white hover:bg-green-700 shadow-sm transition-all"
                                    >
                                        <Plus className="w-4 h-4" />
                                        Catat Pemasukan
                                    </button>
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left text-gray-500">
                                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-100">
                                        <tr>
                                            <th className="px-6 py-4 rounded-tl-lg">No. Kuitansi</th>
                                            <th className="px-6 py-4">Tanggal</th>
                                            <th className="px-6 py-4">Santri</th>
                                            <th className="px-6 py-4">Jenis Tagihan</th>
                                            <th className="px-6 py-4">Metode</th>
                                            <th className="px-6 py-4 text-right">Jumlah (Rp)</th>
                                            <th className="px-6 py-4 text-center rounded-tr-lg">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {payments.data.length > 0 ? payments.data.map((payment) => (
                                            <tr key={payment.id} className="bg-white border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                                <td className="px-6 py-4 font-medium text-gray-900">
                                                    {payment.receipt_number}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {new Date(payment.payment_date).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div>
                                                        <p className="text-gray-900 font-medium">{payment.student_bill?.student?.name}</p>
                                                        <p className="text-xs text-gray-500">{payment.student_bill?.student?.nis}</p>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-gray-900">
                                                    {payment.student_bill?.payment_type?.name}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium capitalize border ${
                                                        payment.payment_method === 'tunai' 
                                                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                                                            : payment.payment_method === 'transfer'
                                                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                                                            : 'bg-purple-50 text-purple-700 border-purple-200'
                                                    }`}>
                                                        {payment.payment_method === 'tunai' && <Banknote className="w-3.5 h-3.5" />}
                                                        {payment.payment_method === 'transfer' && <CreditCard className="w-3.5 h-3.5" />}
                                                        {payment.payment_method === 'qris' && <Wallet className="w-3.5 h-3.5" />}
                                                        {payment.payment_method}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right font-medium text-gray-900">
                                                    {Number(payment.amount).toLocaleString('id-ID')}
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <button 
                                                        onClick={() => handleEdit(payment)}
                                                        className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50 transition-colors"
                                                        title="Edit Pembayaran"
                                                    >
                                                        <Pencil className="w-4 h-4" />
                                                    </button>
                                                </td>
                                            </tr>
                                        )) : (
                                            <tr>
                                                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                                                    Belum ada data uang masuk.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Daftar Tunggakan Section */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-xl border border-gray-100">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                    <Wallet className="w-5 h-5 text-red-500" />
                                    Daftar Tunggakan Santri (Minus / Belum Bayar)
                                </h3>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left text-gray-500">
                                    <thead className="text-xs text-gray-700 uppercase bg-red-50 border-b border-red-100">
                                        <tr>
                                            <th className="px-6 py-4 rounded-tl-lg">Santri</th>
                                            <th className="px-6 py-4">Jenis Tagihan</th>
                                            <th className="px-6 py-4">Bulan/Tahun</th>
                                            <th className="px-6 py-4">Total Tagihan</th>
                                            <th className="px-6 py-4 text-right">Minus / Kurang (Rp)</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {unpaid_bills.length > 0 ? unpaid_bills.map((bill) => (
                                            <tr key={bill.id} className="bg-white border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div>
                                                        <p className="text-gray-900 font-medium">{bill.student?.name}</p>
                                                        <p className="text-xs text-gray-500">{bill.student?.nis}</p>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-gray-900">
                                                    {bill.payment_type?.name}
                                                    <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800 capitalize">
                                                        {bill.status.replace('_', ' ')}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-gray-500">
                                                    {bill.billing_month ? `${bill.billing_month} ${bill.billing_year}` : '-'}
                                                </td>
                                                <td className="px-6 py-4 text-gray-900">
                                                    Rp {Number(bill.amount).toLocaleString('id-ID')}
                                                </td>
                                                <td className="px-6 py-4 text-right font-bold text-red-600">
                                                    - Rp {Number(bill.remaining).toLocaleString('id-ID')}
                                                </td>
                                            </tr>
                                        )) : (
                                            <tr>
                                                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                                                    Alhamdulillah, tidak ada santri yang menunggak pembayaran.
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

            <CreatePaymentModal 
                isOpen={isCreateModalOpen} 
                onClose={() => setIsCreateModalOpen(false)} 
                students={students}
            />

            <EditPaymentModal 
                isOpen={isEditModalOpen}
                onClose={() => {
                    setIsEditModalOpen(false);
                    setEditingPayment(null);
                }}
                students={students}
                payment={editingPayment}
            />
        </AuthenticatedLayout>
    );
}

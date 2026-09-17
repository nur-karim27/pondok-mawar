import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { PageProps } from '@/types';
import { useState } from 'react';
import { Banknote, CreditCard, Wallet, Plus, Download, ReceiptText, Pencil, ScanLine, User } from 'lucide-react';
import CreatePaymentModal from './Partials/CreatePaymentModal';
import EditPaymentModal from './Partials/EditPaymentModal';
import axios from 'axios';

interface Payment {
    id: number;
    receipt_number: string;
    payment_date: string;
    amount: number;
    payment_method: string;
    student_bill: {
        id: number;
        student: { id: number; name: string; nis: string; gender: string; photo: string | null };
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
    student: { id: number, name: string; nis: string; gender: string; photo: string | null };
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
    gender: string;
    photo: string | null;
}

export default function KeuanganIndex({ auth, payments, summary, unpaid_bills, students, filters }: PageProps<{ payments: { data: Payment[] }, summary: Summary, unpaid_bills: UnpaidBill[], students: Student[], filters: any }>) {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingPayment, setEditingPayment] = useState<Payment | null>(null);
    const [currentGender, setCurrentGender] = useState(filters?.gender || 'semua');
    const [isProcessingSnap, setIsProcessingSnap] = useState<number | null>(null);

    const handleEdit = (payment: Payment) => {
        setEditingPayment(payment);
        setIsEditModalOpen(true);
    };

    const handleGenderChange = (gender: string) => {
        setCurrentGender(gender);
        router.get(route('payments.index'), { gender }, { preserveState: true, preserveScroll: true });
    };

    const exportData = () => {
        window.location.href = route('payments.export', { gender: currentGender });
    };

    const handleMidtransPayment = async (bill: UnpaidBill) => {
        try {
            setIsProcessingSnap(bill.id);
            const res = await axios.post(route('payments.midtransToken'), {
                student_bill_id: bill.id,
                amount: bill.remaining
            });

            if (res.data.token) {
                // @ts-ignore
                window.snap.pay(res.data.token, {
                    onSuccess: function(result: any) {
                        // Normally you wait for webhook, but for sandbox UI:
                        router.post(route('payments.store'), {
                            student_bill_id: bill.id,
                            amount: bill.remaining,
                            payment_method: 'midtrans_sandbox',
                            payment_date: new Date().toISOString().split('T')[0],
                            notes: `Paid via Midtrans Sandbox (Order ID: ${result.order_id})`
                        });
                    },
                    onPending: function(result: any) {
                        alert('Menunggu pembayaran Anda!');
                    },
                    onError: function(result: any) {
                        alert('Pembayaran gagal!');
                    },
                    onClose: function() {
                        setIsProcessingSnap(null);
                    }
                });
            }
        } catch (error: any) {
            alert('Gagal mengambil token Midtrans: ' + error?.response?.data?.error || error.message);
            setIsProcessingSnap(null);
        }
    };

    const getPhotoUrl = (photoPath: string | null) => {
        if (photoPath) {
            if (photoPath.startsWith('http')) return photoPath;
            return `/storage/${photoPath}`;
        }
        return null;
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Keuangan & Tagihan</h2>}
        >
            <Head title="Keuangan - Bendahara" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    
                    {/* Filter Tabs */}
                    <div className="bg-white p-1 rounded-xl shadow-sm border border-gray-100 inline-flex">
                        {(['semua', 'putra', 'putri'] as const).map((gender) => (
                            <button
                                key={gender}
                                onClick={() => handleGenderChange(gender)}
                                className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
                                    currentGender === gender
                                        ? 'bg-green-50 text-green-700 shadow-sm'
                                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                }`}
                            >
                                {gender === 'semua' ? 'Semua Santri' : `Santri ${gender.charAt(0).toUpperCase() + gender.slice(1)}`}
                            </button>
                        ))}
                    </div>

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
                                    <button 
                                        onClick={() => {
                                            if(confirm('Buat tagihan SPP bulanan untuk semua santri bulan ini?')) {
                                                router.post(route('payments.generateMonthly'));
                                            }
                                        }}
                                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg text-sm font-medium text-blue-700 hover:bg-blue-100 shadow-sm transition-all"
                                    >
                                        <Wallet className="w-4 h-4" />
                                        Buat Tagihan Bulan Ini
                                    </button>
                                    <button 
                                        onClick={exportData}
                                        className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 shadow-sm transition-all"
                                    >
                                        <Download className="w-4 h-4" />
                                        Export Excel
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
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-10 w-10 shrink-0">
                                                            {getPhotoUrl(payment.student_bill?.student?.photo) ? (
                                                                <img className="h-10 w-10 rounded-full object-cover border border-gray-200" src={getPhotoUrl(payment.student_bill?.student?.photo)!} alt="" />
                                                            ) : (
                                                                <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200">
                                                                    <User className="h-5 w-5 text-gray-400" />
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div>
                                                            <p className="text-gray-900 font-medium">{payment.student_bill?.student?.name}</p>
                                                            <p className="text-xs text-gray-500">{payment.student_bill?.student?.nis}</p>
                                                        </div>
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
                                                        {(payment.payment_method === 'qris' || payment.payment_method === 'midtrans_sandbox') && <ScanLine className="w-3.5 h-3.5" />}
                                                        {payment.payment_method.replace('_', ' ')}
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
                                                <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
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
                                            <th className="px-6 py-4 text-right">Total Tagihan</th>
                                            <th className="px-6 py-4 text-right">Minus / Kurang (Rp)</th>
                                            <th className="px-6 py-4 text-center">Aksi Bayar</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {unpaid_bills.length > 0 ? unpaid_bills.map((bill) => (
                                            <tr key={bill.id} className="bg-white border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-10 w-10 shrink-0">
                                                            {getPhotoUrl(bill.student?.photo) ? (
                                                                <img className="h-10 w-10 rounded-full object-cover border border-gray-200" src={getPhotoUrl(bill.student?.photo)!} alt="" />
                                                            ) : (
                                                                <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200">
                                                                    <User className="h-5 w-5 text-gray-400" />
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div>
                                                            <p className="text-gray-900 font-medium">{bill.student?.name}</p>
                                                            <p className="text-xs text-gray-500">{bill.student?.nis}</p>
                                                        </div>
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
                                                <td className="px-6 py-4 text-right text-gray-900">
                                                    Rp {Number(bill.amount).toLocaleString('id-ID')}
                                                </td>
                                                <td className="px-6 py-4 text-right font-bold text-red-600">
                                                    - Rp {Number(bill.remaining).toLocaleString('id-ID')}
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <button 
                                                        onClick={() => handleMidtransPayment(bill)}
                                                        disabled={isProcessingSnap === bill.id}
                                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700 shadow-sm transition-all disabled:opacity-50"
                                                    >
                                                        {isProcessingSnap === bill.id ? (
                                                            'Memproses...'
                                                        ) : (
                                                            <>
                                                                <ScanLine className="w-3.5 h-3.5" />
                                                                Bayar Online
                                                            </>
                                                        )}
                                                    </button>
                                                </td>
                                            </tr>
                                        )) : (
                                            <tr>
                                                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
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

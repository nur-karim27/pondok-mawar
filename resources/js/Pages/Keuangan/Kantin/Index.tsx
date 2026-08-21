import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { PageProps } from '@/types';
import { Landmark, ArrowDownCircle, ArrowUpCircle, Wallet, Eye, History, ArrowDownToLine, ArrowUpFromLine } from 'lucide-react';

interface Canteen {
    id: number;
    name: string;
    type: 'putra' | 'putri';
    balance: number;
}

export default function KantinIndex({ auth, canteens }: PageProps<{ canteens: Canteen[] }>) {
    const totalSaldo = canteens.reduce((sum, c) => sum + c.balance, 0);

    return (
        <AuthenticatedLayout
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Keuangan Kantin</h2>}
        >
            <Head title="Keuangan Kantin - Bendahara" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Total Kas */}
                        <div className="bg-white border border-gray-100 rounded-xl p-6 flex items-start gap-4 shadow-sm">
                            <div className="bg-purple-50 p-3 rounded-lg mt-1">
                                <Wallet className="w-6 h-6 text-purple-600" />
                            </div>
                            <div>
                                <div className="text-sm font-medium text-purple-600 mb-1">Total Kas Seluruh Kantin</div>
                                <div className="text-2xl font-bold text-gray-900">
                                    Rp {totalSaldo.toLocaleString('id-ID')}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Daftar Kantin */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-xl border border-gray-100">
                        <div className="p-6 border-b border-gray-100">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                    <Landmark className="w-5 h-5 text-gray-500" />
                                    Daftar Kas Kantin
                                </h3>
                                <div className="flex items-center gap-2">
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
                                        Riwayat Semua Transaksi
                                    </Link>
                                </div>
                            </div>

                            <div className="overflow-x-auto rounded-lg border border-gray-100">
                                <table className="w-full text-sm text-left text-gray-500">
                                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-100">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">KANTIN</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">SISA KAS SAAT INI (RP)</th>
                                            <th className="px-6 py-4 text-center rounded-tr-lg">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {canteens.length === 0 ? (
                                            <tr>
                                                <td colSpan={3} className="px-6 py-8 text-center text-gray-500">
                                                    Belum ada data kantin. Silakan tambahkan di menu Pengaturan Kantin.
                                                </td>
                                            </tr>
                                        ) : (
                                            canteens.map((canteen) => (
                                                <tr key={canteen.id} className="hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0">
                                                    <td className="px-6 py-4">
                                                        <div className="font-medium text-gray-900">{canteen.name}</div>
                                                        <div className="text-sm text-gray-500 capitalize">Kantin {canteen.type}</div>
                                                    </td>
                                                    <td className="px-6 py-4 font-semibold">
                                                        <span className={canteen.balance < 0 ? 'text-red-600' : 'text-gray-900'}>
                                                            {canteen.balance < 0 ? `-Rp ${Math.abs(canteen.balance).toLocaleString('id-ID')}` : `Rp ${canteen.balance.toLocaleString('id-ID')}`}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-center">
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
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

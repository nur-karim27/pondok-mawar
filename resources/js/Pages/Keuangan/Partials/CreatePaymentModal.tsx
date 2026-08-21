import { useState, useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import axios from 'axios';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { X } from 'lucide-react';

interface Student {
    id: number;
    name: string;
    nis: string;
}

interface Bill {
    id: number;
    amount: number;
    remaining: number;
    payment_type: { name: string };
    billing_month: string | null;
    billing_year: string | null;
}

interface Props {
    isOpen: boolean;
    onClose: () => void;
    students: Student[];
}

export default function CreatePaymentModal({ isOpen, onClose, students }: Props) {
    const [selectedStudent, setSelectedStudent] = useState<number | ''>('');
    const [studentBills, setStudentBills] = useState<Bill[]>([]);
    const [loadingBills, setLoadingBills] = useState(false);

    const today = new Date();
    const localDate = today.getFullYear() + '-' + String(today.getMonth() + 1).padStart(2, '0') + '-' + String(today.getDate()).padStart(2, '0');

    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        student_bill_id: '',
        amount: '',
        payment_method: 'tunai',
        payment_date: localDate,
        notes: '',
    });

    useEffect(() => {
        if (selectedStudent) {
            setLoadingBills(true);
            axios.get(`/api/students/${selectedStudent}/bills`)
                .then(res => {
                    setStudentBills(res.data);
                })
                .finally(() => {
                    setLoadingBills(false);
                });
        } else {
            setStudentBills([]);
        }
    }, [selectedStudent]);

    // Update amount automatically when bill is selected
    useEffect(() => {
        if (data.student_bill_id) {
            const bill = studentBills.find(b => b.id.toString() === data.student_bill_id);
            if (bill) {
                setData('amount', bill.remaining.toString());
            }
        }
    }, [data.student_bill_id, studentBills]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('payments.store'), {
            onSuccess: () => {
                reset();
                setSelectedStudent('');
                onClose();
            }
        });
    };

    const handleClose = () => {
        reset();
        clearErrors();
        setSelectedStudent('');
        onClose();
    };

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={handleClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/25 backdrop-blur-sm" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                <Dialog.Title
                                    as="h3"
                                    className="text-lg font-medium leading-6 text-gray-900 flex justify-between items-center"
                                >
                                    <span>Catat Pemasukan / Rekap</span>
                                    <button onClick={handleClose} className="text-gray-400 hover:text-gray-500">
                                        <X className="w-5 h-5" />
                                    </button>
                                </Dialog.Title>
                                
                                <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Santri</label>
                                        <select 
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                                            value={selectedStudent}
                                            onChange={(e) => {
                                                setSelectedStudent(Number(e.target.value));
                                                setData('student_bill_id', '');
                                            }}
                                        >
                                            <option value="">Pilih Santri...</option>
                                            {students.map(s => (
                                                <option key={s.id} value={s.id}>{s.nis} - {s.name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Tagihan</label>
                                        <select
                                            id="student_bill_id"
                                            className="mt-1 block w-full border-gray-300 focus:border-emerald-500 focus:ring-emerald-500 rounded-md shadow-sm"
                                            value={data.student_bill_id}
                                            onChange={(e) => setData('student_bill_id', e.target.value)}
                                            required
                                            disabled={!selectedStudent || loadingBills || studentBills.length === 0}
                                        >
                                            <option value="">
                                                {!selectedStudent ? 'Pilih Santri Dulu...' : 
                                                 loadingBills ? 'Memuat tagihan...' : 
                                                 studentBills.length === 0 ? 'Semua tagihan lunas (Tidak ada tunggakan)' : 'Pilih Tagihan...'}
                                            </option>
                                            {studentBills.map(b => (
                                                <option key={b.id} value={b.id}>
                                                    {b.payment_type?.name} {b.billing_month ? `(${b.billing_month} ${b.billing_year})` : ''} - Sisa: Rp {Number(b.remaining).toLocaleString('id-ID')}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.student_bill_id && <p className="mt-1 text-sm text-red-600">{errors.student_bill_id}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Jumlah Bayar (Rp)</label>
                                        <input 
                                            type="number" 
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                                            value={data.amount}
                                            onChange={e => setData('amount', e.target.value)}
                                            min="1"
                                        />
                                        {errors.amount && <p className="mt-1 text-sm text-red-600">{errors.amount}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Metode Pembayaran</label>
                                        <select 
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                                            value={data.payment_method}
                                            onChange={e => setData('payment_method', e.target.value)}
                                        >
                                            <option value="tunai">Tunai</option>
                                            <option value="transfer">Transfer Bank</option>
                                            <option value="qris">QRIS / E-Wallet</option>
                                        </select>
                                        {errors.payment_method && <p className="mt-1 text-sm text-red-600">{errors.payment_method}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Tanggal Pembayaran</label>
                                        <input 
                                            type="date" 
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                                            value={data.payment_date}
                                            onChange={e => setData('payment_date', e.target.value)}
                                        />
                                        {errors.payment_date && <p className="mt-1 text-sm text-red-600">{errors.payment_date}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Catatan Tambahan (Opsional)</label>
                                        <textarea 
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                                            value={data.notes}
                                            onChange={e => setData('notes', e.target.value)}
                                            rows={2}
                                        ></textarea>
                                        {errors.notes && <p className="mt-1 text-sm text-red-600">{errors.notes}</p>}
                                    </div>

                                    <div className="mt-5 flex justify-end gap-2">
                                        <button
                                            type="button"
                                            className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
                                            onClick={handleClose}
                                        >
                                            Batal
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="inline-flex justify-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 focus:outline-none disabled:opacity-50"
                                        >
                                            {processing ? 'Menyimpan...' : 'Simpan Pemasukan'}
                                        </button>
                                    </div>
                                </form>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}

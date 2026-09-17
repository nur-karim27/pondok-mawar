import { useState, useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import axios from 'axios';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { X } from 'lucide-react';
import Select from 'react-select';

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

interface Payment {
    id: number;
    amount: number;
    payment_method: string;
    payment_date: string;
    notes: string | null;
    student_bill: {
        id: number;
        student: { id: number };
    };
}

interface Props {
    isOpen: boolean;
    onClose: () => void;
    students: Student[];
    payment: Payment | null;
}

export default function EditPaymentModal({ isOpen, onClose, students, payment }: Props) {
    const [selectedStudent, setSelectedStudent] = useState<number | ''>('');
    const [studentBills, setStudentBills] = useState<Bill[]>([]);
    const [loadingBills, setLoadingBills] = useState(false);

    const today = new Date();
    const localDate = today.getFullYear() + '-' + String(today.getMonth() + 1).padStart(2, '0') + '-' + String(today.getDate()).padStart(2, '0');

    const { data, setData, put, processing, errors, reset, clearErrors } = useForm({
        student_bill_id: '',
        amount: '',
        payment_method: 'tunai',
        payment_date: localDate,
        notes: '',
    });

    useEffect(() => {
        if (payment && isOpen) {
            setSelectedStudent(payment.student_bill.student.id);
            setData({
                student_bill_id: payment.student_bill.id.toString(),
                amount: payment.amount.toString(),
                payment_method: payment.payment_method,
                payment_date: payment.payment_date ? payment.payment_date.split(' ')[0].split('T')[0] : '',
                notes: payment.notes || '',
            });
        }
    }, [payment, isOpen]);

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

    // Update amount automatically when bill is selected, ONLY if it's a new bill choice (not initial load)
    useEffect(() => {
        if (data.student_bill_id && payment && data.student_bill_id !== payment.student_bill.id.toString()) {
            const bill = studentBills.find(b => b.id.toString() === data.student_bill_id);
            if (bill) {
                setData('amount', bill.remaining.toString());
            }
        }
    }, [data.student_bill_id, studentBills, payment]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!payment) return;
        put(route('payments.update', payment.id), {
            onSuccess: () => {
                reset();
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

    const studentOptions = students.map(s => ({
        value: s.id,
        label: `${s.nis} - ${s.name}`
    }));

    const billOptions = studentBills.map(b => ({
        value: b.id.toString(),
        label: `${b.payment_type?.name} ${b.billing_month ? `(${b.billing_month} ${b.billing_year})` : ''} - Kurang: Rp ${Number(b.remaining).toLocaleString('id-ID')}`
    }));

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
                            <Dialog.Panel className="w-full max-w-md transform overflow-visible rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                <Dialog.Title
                                    as="h3"
                                    className="text-lg font-medium leading-6 text-gray-900 flex justify-between items-center"
                                >
                                    <span>Edit Pemasukan / Rekap</span>
                                    <button onClick={handleClose} className="text-gray-400 hover:text-gray-500">
                                        <X className="w-5 h-5" />
                                    </button>
                                </Dialog.Title>
                                
                                <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Santri</label>
                                        <Select
                                            options={studentOptions}
                                            placeholder="Ketik untuk mencari santri..."
                                            value={studentOptions.find(opt => opt.value === selectedStudent) || null}
                                            onChange={(option) => {
                                                setSelectedStudent(option ? option.value : '');
                                                setData('student_bill_id', '');
                                            }}
                                            isClearable
                                            className="react-select-container"
                                            classNamePrefix="react-select"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Tagihan (Pilih Santri Dulu)</label>
                                        <Select
                                            options={billOptions}
                                            placeholder={
                                                !selectedStudent ? 'Pilih Santri Dulu...' : 
                                                loadingBills ? 'Memuat tagihan...' : 
                                                studentBills.length === 0 ? 'Semua tagihan lunas (Tidak ada tunggakan)' : 'Ketik untuk mencari tagihan...'
                                            }
                                            value={billOptions.find(opt => opt.value === data.student_bill_id) || null}
                                            onChange={(option) => setData('student_bill_id', option ? option.value : '')}
                                            isDisabled={!selectedStudent || loadingBills || studentBills.length === 0}
                                            isClearable
                                            className="react-select-container"
                                            classNamePrefix="react-select"
                                        />
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
                                            <option value="midtrans_sandbox">Midtrans (Sandbox)</option>
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
                                            disabled={processing || !data.student_bill_id}
                                            className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none disabled:opacity-50"
                                        >
                                            {processing ? 'Menyimpan...' : 'Perbarui Pemasukan'}
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

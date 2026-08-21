import { useState, useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { X } from 'lucide-react';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    studentId: number;
    transactionType: 'setor' | 'tarik';
}

export default function CreateTransactionModal({ isOpen, onClose, studentId, transactionType }: Props) {
    const today = new Date();
    const localDate = today.getFullYear() + '-' + String(today.getMonth() + 1).padStart(2, '0') + '-' + String(today.getDate()).padStart(2, '0');

    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        student_id: studentId.toString(),
        transaction_type: transactionType,
        amount: '',
        transaction_date: localDate,
        notes: '',
    });

    useEffect(() => {
        setData(data => ({ ...data, transaction_type: transactionType, student_id: studentId.toString() }));
    }, [transactionType, studentId]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('tabungan.store'), {
            onSuccess: () => {
                reset();
                onClose();
            }
        });
    };

    const handleClose = () => {
        reset();
        clearErrors();
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
                                    <span>{transactionType === 'setor' ? 'Catat Setoran Tabungan' : 'Catat Penarikan Tabungan'}</span>
                                    <button onClick={handleClose} className="text-gray-400 hover:text-gray-500">
                                        <X className="w-5 h-5" />
                                    </button>
                                </Dialog.Title>
                                
                                <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Jumlah (Rp)</label>
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
                                        <label className="block text-sm font-medium text-gray-700">Tanggal Transaksi</label>
                                        <input 
                                            type="date" 
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                                            value={data.transaction_date}
                                            onChange={e => setData('transaction_date', e.target.value)}
                                        />
                                        {errors.transaction_date && <p className="mt-1 text-sm text-red-600">{errors.transaction_date}</p>}
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
                                            className={`inline-flex justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white focus:outline-none disabled:opacity-50 ${transactionType === 'setor' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}
                                        >
                                            {processing ? 'Menyimpan...' : 'Simpan Transaksi'}
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

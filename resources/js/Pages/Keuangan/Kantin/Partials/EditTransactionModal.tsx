import { Fragment, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useForm } from '@inertiajs/react';
import { X } from 'lucide-react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';

interface Transaction {
    id: number;
    transaction_type: 'masuk' | 'keluar';
    amount: string;
    transaction_date: string;
    notes: string | null;
}

interface Canteen {
    id: number;
    name: string;
    type: 'putra' | 'putri';
}

interface EditTransactionModalProps {
    isOpen: boolean;
    onClose: () => void;
    canteen: Canteen;
    transaction: Transaction | null;
}

export default function EditTransactionModal({ isOpen, onClose, canteen, transaction }: EditTransactionModalProps) {
    const { data, setData, put, processing, errors, reset } = useForm({
        transaction_type: 'masuk' as 'masuk' | 'keluar',
        amount: '',
        transaction_date: '',
        notes: ''
    });

    useEffect(() => {
        if (isOpen && transaction) {
            // Convert UTC or saved date to local datetime-local format
            const d = new Date(transaction.transaction_date);
            d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
            setData({
                transaction_type: transaction.transaction_type,
                amount: transaction.amount,
                transaction_date: d.toISOString().slice(0, 16),
                notes: transaction.notes || ''
            });
        }
    }, [isOpen, transaction]);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!transaction) return;
        
        put(route('kantin.transactions.update', transaction.id), {
            onSuccess: () => {
                reset();
                onClose();
            },
        });
    };

    const handleClose = () => {
        reset();
        onClose();
    };

    if (!transaction) return null;

    return (
        <Transition show={isOpen} as={Fragment}>
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
                    <div className="fixed inset-0 bg-gray-900/75 backdrop-blur-sm transition-opacity" />
                </Transition.Child>

                <div className="fixed inset-0 z-10 overflow-y-auto">
                    <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            enterTo="opacity-100 translate-y-0 sm:scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        >
                            <Dialog.Panel className="relative transform overflow-hidden rounded-2xl bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                                <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4 border-b border-gray-100">
                                    <div className="sm:flex sm:items-start">
                                        <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
                                            <Dialog.Title
                                                as="h3"
                                                className="text-lg font-medium leading-6 text-gray-900 flex justify-between items-center"
                                            >
                                                <span>Edit Transaksi Kantin</span>
                                                <button onClick={handleClose} className="text-gray-400 hover:text-gray-500">
                                                    <X className="w-5 h-5" />
                                                </button>
                                            </Dialog.Title>
                                        </div>
                                    </div>
                                </div>

                                <form onSubmit={submit}>
                                    <div className="px-4 py-5 sm:p-6 space-y-4">
                                        <div>
                                            <InputLabel value="Kantin" />
                                            <div className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-gray-700 font-medium">
                                                {canteen.name}
                                            </div>
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="edit_transaction_type" value="Jenis Transaksi" />
                                            <select
                                                id="edit_transaction_type"
                                                className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                                value={data.transaction_type}
                                                onChange={(e) => setData('transaction_type', e.target.value as 'masuk' | 'keluar')}
                                                required
                                            >
                                                <option value="masuk">Pemasukan (+)</option>
                                                <option value="keluar">Pengeluaran (-)</option>
                                            </select>
                                            <InputError message={errors.transaction_type} className="mt-2" />
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="edit_amount" value="Nominal (Rp)" />
                                            <TextInput
                                                id="edit_amount"
                                                type="number"
                                                className="mt-1 block w-full"
                                                value={data.amount}
                                                onChange={(e) => setData('amount', e.target.value)}
                                                required
                                                min="1"
                                            />
                                            <InputError message={errors.amount} className="mt-2" />
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="edit_transaction_date" value="Tanggal & Waktu Transaksi" />
                                            <TextInput
                                                id="edit_transaction_date"
                                                type="datetime-local"
                                                className="mt-1 block w-full"
                                                value={data.transaction_date}
                                                onChange={(e) => setData('transaction_date', e.target.value)}
                                                required
                                            />
                                            <InputError message={errors.transaction_date} className="mt-2" />
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="edit_notes" value="Catatan (Opsional)" />
                                            <TextInput
                                                id="edit_notes"
                                                type="text"
                                                className="mt-1 block w-full"
                                                value={data.notes}
                                                onChange={(e) => setData('notes', e.target.value)}
                                            />
                                            <div className="mt-2 flex flex-wrap gap-2">
                                                {data.transaction_type === 'masuk' ? (
                                                    <>
                                                        <button type="button" onClick={() => setData('notes', 'Hasil Penjualan Shift Pagi')} className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-2.5 py-1.5 rounded-md border border-gray-200 transition-colors">Jualan Shift Pagi</button>
                                                        <button type="button" onClick={() => setData('notes', 'Hasil Penjualan Shift Siang')} className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-2.5 py-1.5 rounded-md border border-gray-200 transition-colors">Jualan Shift Siang</button>
                                                        <button type="button" onClick={() => setData('notes', 'Hasil Penjualan Shift Malam')} className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-2.5 py-1.5 rounded-md border border-gray-200 transition-colors">Jualan Shift Malam</button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <button type="button" onClick={() => setData('notes', 'Belanja Lauk / Sayur')} className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-2.5 py-1.5 rounded-md border border-gray-200 transition-colors">Belanja Lauk/Sayur</button>
                                                        <button type="button" onClick={() => setData('notes', 'Belanja Sembako / Beras')} className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-2.5 py-1.5 rounded-md border border-gray-200 transition-colors">Belanja Sembako</button>
                                                        <button type="button" onClick={() => setData('notes', 'Beli Gas / Air Galon')} className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-2.5 py-1.5 rounded-md border border-gray-200 transition-colors">Beli Gas/Air</button>
                                                    </>
                                                )}
                                            </div>
                                            <InputError message={errors.notes} className="mt-2" />
                                        </div>
                                    </div>

                                    <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 border-t border-gray-100">
                                        <PrimaryButton 
                                            className={`w-full justify-center sm:ml-3 sm:w-auto bg-blue-600 hover:bg-blue-700`} 
                                            disabled={processing}
                                        >
                                            Simpan Perubahan
                                        </PrimaryButton>
                                        <button
                                            type="button"
                                            className="mt-3 inline-flex w-full justify-center rounded-lg bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto transition-colors"
                                            onClick={handleClose}
                                        >
                                            Batal
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

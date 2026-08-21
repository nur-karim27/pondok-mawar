import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useForm } from '@inertiajs/react';
import { X } from 'lucide-react';
import { useEffect } from 'react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';

interface Canteen {
    id: number;
    name: string;
    type: 'putra' | 'putri';
}

interface CreateTransactionModalProps {
    isOpen: boolean;
    onClose: () => void;
    canteen: Canteen;
    transactionType: 'masuk' | 'keluar';
}

export default function CreateTransactionModal({ isOpen, onClose, canteen, transactionType }: CreateTransactionModalProps) {
    const { data, setData, post, processing, errors, reset } = useForm({
        canteen_id: canteen.id,
        transaction_type: transactionType,
        amount: '',
        transaction_date: '',
        notes: ''
    });

    useEffect(() => {
        if (isOpen) {
            const now = new Date();
            now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
            setData(prev => ({
                ...prev,
                transaction_type: transactionType,
                transaction_date: now.toISOString().slice(0, 16),
                notes: '',
                amount: ''
            }));
        }
    }, [isOpen, transactionType]);

    // Removed old sync logic as it is handled by useEffect

    const submit = (e: React.FormEvent, addMore = false) => {
        e.preventDefault();
        post(route('kantin.store'), {
            onSuccess: () => {
                if (addMore) {
                    reset('amount', 'notes');
                    const now = new Date();
                    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
                    setData('transaction_date', now.toISOString().slice(0, 16));
                    document.getElementById('amount')?.focus();
                } else {
                    reset();
                    onClose();
                }
            },
        });
    };

    const handleClose = () => {
        reset();
        onClose();
    };

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
                                                <span>{transactionType === 'masuk' ? 'Catat Pemasukan Kantin' : 'Catat Pengeluaran Kantin'}</span>
                                                <button onClick={handleClose} className="text-gray-400 hover:text-gray-500">
                                                    <X className="w-5 h-5" />
                                                </button>
                                            </Dialog.Title>
                                        </div>
                                    </div>
                                </div>

                                <form>
                                    <div className="px-4 py-5 sm:p-6 space-y-4">
                                        <div>
                                            <InputLabel value="Kantin" />
                                            <div className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-gray-700 font-medium">
                                                {canteen.name}
                                            </div>
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="amount" value="Nominal (Rp)" />
                                            <TextInput
                                                id="amount"
                                                type="number"
                                                className="mt-1 block w-full"
                                                value={data.amount}
                                                onChange={(e) => setData('amount', e.target.value)}
                                                required
                                                min="1"
                                                autoFocus
                                            />
                                            <InputError message={errors.amount} className="mt-2" />
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="transaction_date" value="Tanggal & Waktu Transaksi" />
                                            <TextInput
                                                id="transaction_date"
                                                type="datetime-local"
                                                className="mt-1 block w-full"
                                                value={data.transaction_date}
                                                onChange={(e) => setData('transaction_date', e.target.value)}
                                                required
                                            />
                                            <InputError message={errors.transaction_date} className="mt-2" />
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="notes" value="Catatan (Opsional)" />
                                            <TextInput
                                                id="notes"
                                                type="text"
                                                className="mt-1 block w-full"
                                                value={data.notes}
                                                onChange={(e) => setData('notes', e.target.value)}
                                                placeholder={transactionType === 'masuk' ? "Contoh: Hasil penjualan shift pagi" : "Contoh: Beli telur, gula, sayur"}
                                            />
                                            <div className="mt-2 flex flex-wrap gap-2">
                                                {transactionType === 'masuk' ? (
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

                                    <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 border-t border-gray-100 gap-2">
                                        <PrimaryButton 
                                            className={`w-full justify-center sm:w-auto mb-2 sm:mb-0 ${transactionType === 'masuk' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`} 
                                            disabled={processing}
                                            onClick={(e) => submit(e, false)}
                                        >
                                            Simpan {transactionType === 'masuk' ? 'Pemasukan' : 'Pengeluaran'}
                                        </PrimaryButton>
                                        <button
                                            type="button"
                                            className="inline-flex w-full justify-center rounded-lg bg-indigo-50 px-3 py-2 text-sm font-semibold text-indigo-700 shadow-sm ring-1 ring-inset ring-indigo-200 hover:bg-indigo-100 sm:w-auto transition-colors mb-2 sm:mb-0"
                                            onClick={(e) => submit(e, true)}
                                            disabled={processing}
                                        >
                                            Simpan & Tambah Lagi
                                        </button>
                                        <button
                                            type="button"
                                            className="inline-flex w-full justify-center rounded-lg bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:w-auto transition-colors mb-2 sm:mb-0"
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

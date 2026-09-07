import { useEffect } from 'react';
import Modal from '@/Components/Modal';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';
import { useForm } from '@inertiajs/react';

interface Letter {
    id: number;
    code: string;
    type: string;
    subject: string;
    sender: string | null;
    recipient: string | null;
    letter_date: string;
    received_date: string | null;
    body: string | null;
    attachment: string | null;
    status: string;
}

interface Props {
    show: boolean;
    onClose: () => void;
    letter?: Letter | null;
    currentType: string;
}

export default function LetterFormModal({ show, onClose, letter, currentType }: Props) {
    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        _method: 'POST',
        code: '',
        type: currentType,
        subject: '',
        sender: '',
        recipient: '',
        letter_date: new Date().toISOString().split('T')[0],
        received_date: '',
        body: '',
        status: 'draft',
        attachment: null as File | null,
    });

    useEffect(() => {
        if (show) {
            if (letter) {
                setData({
                    _method: 'PUT',
                    code: letter.code,
                    type: letter.type,
                    subject: letter.subject,
                    sender: letter.sender || '',
                    recipient: letter.recipient || '',
                    letter_date: letter.letter_date.split('T')[0],
                    received_date: letter.received_date ? letter.received_date.split('T')[0] : '',
                    body: letter.body || '',
                    status: letter.status,
                    attachment: null, // Don't pre-fill file inputs
                });
            } else {
                reset();
                setData('type', currentType);
            }
            clearErrors();
        }
    }, [show, letter, currentType]);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        // Use POST for both create and update (with _method: PUT for update) to handle file uploads
        if (letter) {
            post(route('letters.update', letter.id), {
                onSuccess: () => {
                    onClose();
                    reset();
                },
                forceFormData: true,
            });
        } else {
            post(route('letters.store'), {
                onSuccess: () => {
                    onClose();
                    reset();
                },
                forceFormData: true,
            });
        }
    };

    return (
        <Modal show={show} onClose={onClose} maxWidth="2xl">
            <div className="p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-6 border-b pb-3">
                    {letter ? 'Edit Data Surat/Berkas' : 'Tambah Data Surat/Berkas'}
                </h2>

                <form onSubmit={submit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <InputLabel htmlFor="code" value="Nomor Surat / Kode Berkas" />
                            <TextInput
                                id="code"
                                type="text"
                                className="mt-1 block w-full"
                                value={data.code}
                                onChange={(e) => setData('code', e.target.value)}
                                required
                            />
                            {errors.code && <div className="text-red-500 text-xs mt-1">{errors.code}</div>}
                        </div>

                        <div>
                            <InputLabel htmlFor="type" value="Jenis Arsip" />
                            <select
                                id="type"
                                className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                value={data.type}
                                onChange={(e) => setData('type', e.target.value)}
                                required
                            >
                                <option value="masuk">Surat Masuk</option>
                                <option value="keluar">Surat Keluar</option>
                                <option value="keputusan">Keputusan (SK)</option>
                                <option value="keterangan">Keterangan / Berkas Lain</option>
                            </select>
                            {errors.type && <div className="text-red-500 text-xs mt-1">{errors.type}</div>}
                        </div>
                    </div>

                    <div>
                        <InputLabel htmlFor="subject" value="Perihal / Judul Surat" />
                        <TextInput
                            id="subject"
                            type="text"
                            className="mt-1 block w-full"
                            value={data.subject}
                            onChange={(e) => setData('subject', e.target.value)}
                            required
                        />
                        {errors.subject && <div className="text-red-500 text-xs mt-1">{errors.subject}</div>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <InputLabel htmlFor="sender" value="Pengirim" />
                            <TextInput
                                id="sender"
                                type="text"
                                className="mt-1 block w-full"
                                value={data.sender}
                                onChange={(e) => setData('sender', e.target.value)}
                            />
                        </div>

                        <div>
                            <InputLabel htmlFor="recipient" value="Penerima / Tujuan" />
                            <TextInput
                                id="recipient"
                                type="text"
                                className="mt-1 block w-full"
                                value={data.recipient}
                                onChange={(e) => setData('recipient', e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <InputLabel htmlFor="letter_date" value="Tanggal Surat" />
                            <TextInput
                                id="letter_date"
                                type="date"
                                className="mt-1 block w-full"
                                value={data.letter_date}
                                onChange={(e) => setData('letter_date', e.target.value)}
                                required
                            />
                            {errors.letter_date && <div className="text-red-500 text-xs mt-1">{errors.letter_date}</div>}
                        </div>

                        <div>
                            <InputLabel htmlFor="received_date" value="Tanggal Diterima (Opsional)" />
                            <TextInput
                                id="received_date"
                                type="date"
                                className="mt-1 block w-full"
                                value={data.received_date}
                                onChange={(e) => setData('received_date', e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <InputLabel htmlFor="status" value="Status" />
                            <select
                                id="status"
                                className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                value={data.status}
                                onChange={(e) => setData('status', e.target.value)}
                                required
                            >
                                <option value="draft">Draft</option>
                                <option value="masuk">Masuk / Baru</option>
                                <option value="perlu_paraf">Perlu Paraf</option>
                                <option value="diproses">Sedang Diproses</option>
                                <option value="selesai">Selesai</option>
                                <option value="diarsipkan">Diarsipkan</option>
                            </select>
                        </div>

                        <div>
                            <InputLabel htmlFor="attachment" value="File Lampiran (PDF/JPG)" />
                            <input
                                id="attachment"
                                type="file"
                                className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary-dark"
                                accept=".pdf,.jpg,.jpeg,.png"
                                onChange={(e) => setData('attachment', e.target.files ? e.target.files[0] : null)}
                            />
                            {errors.attachment && <div className="text-red-500 text-xs mt-1">{errors.attachment}</div>}
                            {letter && letter.attachment && !data.attachment && (
                                <div className="text-xs text-gray-500 mt-1">Biarkan kosong jika tidak ingin mengubah file lampiran.</div>
                            )}
                        </div>
                    </div>

                    <div>
                        <InputLabel htmlFor="body" value="Keterangan Ringkas / Isi (Opsional)" />
                        <textarea
                            id="body"
                            className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                            rows={3}
                            value={data.body}
                            onChange={(e) => setData('body', e.target.value)}
                        ></textarea>
                    </div>

                    <div className="mt-6 flex justify-end gap-3 pt-4 border-t">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                            Batal
                        </button>
                        <PrimaryButton type="submit" disabled={processing}>
                            {processing ? 'Menyimpan...' : 'Simpan Data'}
                        </PrimaryButton>
                    </div>
                </form>
            </div>
        </Modal>
    );
}

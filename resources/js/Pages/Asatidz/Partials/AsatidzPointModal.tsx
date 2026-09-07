import { FormEventHandler, useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import Modal from '@/Components/Modal';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';

interface StaffMember {
    id: number;
    name: string;
    email?: string;
    address?: string;
    join_date?: string;
}

interface Props {
    show: boolean;
    onClose: () => void;
    asatidz?: StaffMember | null;
}

export default function AsatidzPointModal({ show, onClose, asatidz }: Props) {
    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        staff_member_id: '',
        point_name: '',
        category: 'Penghargaan',
        points: 0,
        description: '',
        record_date: new Date().toISOString().split('T')[0],
    });

    useEffect(() => {
        if (show && asatidz) {
            setData('staff_member_id', asatidz.id.toString());
            clearErrors();
        }
    }, [show, asatidz]);

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('asatidz-points.store'), {
            onSuccess: () => {
                reset();
                onClose();
            },
        });
    };

    return (
        <Modal show={show} onClose={onClose} maxWidth="lg">
            <form onSubmit={handleSubmit} className="p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-2">
                    Beri Poin untuk Ustadz/ah
                </h2>
                <p className="text-sm text-gray-500 mb-6">
                    Nama: <span className="font-semibold text-gray-900">{asatidz?.name}</span>
                </p>

                <div className="space-y-4">
                    <div>
                        <InputLabel htmlFor="category" value="Kategori" />
                        <select
                            id="category"
                            className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                            value={data.category}
                            onChange={(e) => setData('category', e.target.value)}
                            required
                        >
                            <option value="Penghargaan">Penghargaan (Poin Positif)</option>
                            <option value="Pelanggaran">Pelanggaran (Poin Negatif)</option>
                            <option value="Lainnya">Lainnya</option>
                        </select>
                        <InputError message={errors.category} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel htmlFor="point_name" value="Nama Penghargaan / Pelanggaran" />
                        <TextInput
                            id="point_name"
                            className="mt-1 block w-full"
                            value={data.point_name}
                            onChange={(e) => setData('point_name', e.target.value)}
                            placeholder="Contoh: Pengajar Terbaik Bulan Ini"
                            required
                        />
                        <InputError message={errors.point_name} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel htmlFor="points" value="Jumlah Poin" />
                        <TextInput
                            id="points"
                            type="number"
                            className="mt-1 block w-full"
                            value={data.points}
                            onChange={(e) => setData('points', parseInt(e.target.value))}
                            required
                        />
                        <p className="mt-1 text-xs text-gray-500">
                            Gunakan angka positif untuk penghargaan (contoh: 10), dan angka negatif untuk pelanggaran (contoh: -5).
                        </p>
                        <InputError message={errors.points} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel htmlFor="record_date" value="Tanggal" />
                        <TextInput
                            id="record_date"
                            type="date"
                            className="mt-1 block w-full"
                            value={data.record_date}
                            onChange={(e) => setData('record_date', e.target.value)}
                            required
                        />
                        <InputError message={errors.record_date} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel htmlFor="description" value="Keterangan (Opsional)" />
                        <textarea
                            id="description"
                            className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                            rows={3}
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                        />
                        <InputError message={errors.description} className="mt-2" />
                    </div>
                </div>

                <div className="mt-6 flex justify-end gap-3">
                    <SecondaryButton onClick={onClose} disabled={processing}>
                        Batal
                    </SecondaryButton>
                    <PrimaryButton disabled={processing}>
                        {processing ? 'Menyimpan...' : 'Simpan Poin'}
                    </PrimaryButton>
                </div>
            </form>
        </Modal>
    );
}

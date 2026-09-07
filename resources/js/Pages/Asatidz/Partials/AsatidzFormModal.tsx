import { FormEventHandler, useEffect } from 'react';
import { useForm, router } from '@inertiajs/react';
import Modal from '@/Components/Modal';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';

interface StaffMember {
    id: number;
    name: string;
    nip: string;
    gender: 'putra' | 'putri';
    role: string;
    division: string;
    phone: string;
    email?: string;
    address?: string;
    join_date?: string;
    is_active: boolean;
    photo?: string;
}

interface Props {
    show: boolean;
    onClose: () => void;
    asatidz?: StaffMember | null;
}

export default function AsatidzFormModal({ show, onClose, asatidz }: Props) {
    const isEdit = !!asatidz;

    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        name: '',
        nip: '',
        gender: 'putra',
        role: '',
        division: '',
        phone: '',
        email: '',
        address: '',
        join_date: '',
        is_active: true,
        photo: null as File | null,
    });

    useEffect(() => {
        if (show) {
            if (isEdit && asatidz) {
                setData({
                    name: asatidz.name || '',
                    nip: asatidz.nip || '',
                    gender: asatidz.gender || 'putra',
                    role: asatidz.role || '',
                    division: asatidz.division || '',
                    phone: asatidz.phone || '',
                    email: asatidz.email || '',
                    address: asatidz.address || '',
                    join_date: asatidz.join_date || '',
                    is_active: asatidz.is_active === undefined ? true : !!asatidz.is_active,
                    photo: null,
                });
            } else {
                reset();
            }
            clearErrors();
        }
    }, [show, isEdit, asatidz]);

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        
        if (isEdit) {
            router.post(route('staff.update', asatidz!.id), {
                ...data,
                _method: 'PUT'
            }, {
                forceFormData: true,
                onSuccess: () => onClose(),
            });
        } else {
            post(route('staff.store'), {
                forceFormData: true,
                onSuccess: () => onClose(),
            });
        }
    };

    return (
        <Modal show={show} onClose={onClose} maxWidth="2xl">
            <form onSubmit={handleSubmit} className="p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-6">
                    {isEdit ? 'Edit Data Asatidz' : 'Tambah Asatidz Baru'}
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <InputLabel htmlFor="name" value="Nama Lengkap" />
                        <TextInput
                            id="name"
                            className="mt-1 block w-full"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            required
                        />
                        <InputError message={errors.name} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel htmlFor="nip" value="NIP (Opsional)" />
                        <TextInput
                            id="nip"
                            className="mt-1 block w-full"
                            value={data.nip}
                            onChange={(e) => setData('nip', e.target.value)}
                        />
                        <InputError message={errors.nip} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel htmlFor="gender" value="Jenis Kelamin" />
                        <select
                            id="gender"
                            className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                            value={data.gender}
                            onChange={(e) => setData('gender', e.target.value)}
                            required
                        >
                            <option value="putra">Putra</option>
                            <option value="putri">Putri</option>
                        </select>
                        <InputError message={errors.gender} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel htmlFor="role" value="Jabatan" />
                        <TextInput
                            id="role"
                            className="mt-1 block w-full"
                            value={data.role}
                            onChange={(e) => setData('role', e.target.value)}
                            required
                        />
                        <InputError message={errors.role} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel htmlFor="division" value="Divisi" />
                        <TextInput
                            id="division"
                            className="mt-1 block w-full"
                            value={data.division}
                            onChange={(e) => setData('division', e.target.value)}
                            required
                        />
                        <InputError message={errors.division} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel htmlFor="phone" value="No. HP" />
                        <TextInput
                            id="phone"
                            className="mt-1 block w-full"
                            value={data.phone}
                            onChange={(e) => setData('phone', e.target.value)}
                        />
                        <InputError message={errors.phone} className="mt-2" />
                    </div>
                    
                    <div className="md:col-span-2">
                        <InputLabel htmlFor="photo" value="Foto (Opsional)" />
                        <input
                            id="photo"
                            type="file"
                            accept="image/*"
                            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                            onChange={(e) => setData('photo', e.target.files ? e.target.files[0] : null)}
                        />
                        <InputError message={errors.photo} className="mt-2" />
                        {isEdit && asatidz?.photo && !data.photo && (
                            <div className="mt-2">
                                <span className="text-sm text-gray-500">Foto saat ini terpasang. Unggah file baru untuk menggantinya.</span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="mt-6 flex justify-end gap-3">
                    <SecondaryButton onClick={onClose} disabled={processing}>
                        Batal
                    </SecondaryButton>
                    <PrimaryButton disabled={processing}>
                        {processing ? 'Menyimpan...' : 'Simpan'}
                    </PrimaryButton>
                </div>
            </form>
        </Modal>
    );
}
